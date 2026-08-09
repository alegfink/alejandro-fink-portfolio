import { NextResponse } from "next/server";
import { getContactConfig, validateContactPayload } from "@/lib/contact";
import { getSiteUrl } from "@/lib/urls";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const config = getContactConfig();

  // Important: reject before reading the body while contact is not configured.
  if (!config.enabled) {
    return NextResponse.json({ ok: false, code: "CONTACT_DISABLED" }, { status: 503 });
  }

  const origin = request.headers.get("origin");
  if (!origin || origin !== getSiteUrl().origin) {
    return NextResponse.json({ ok: false, code: "ORIGIN_REJECTED" }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, code: "INVALID_JSON" }, { status: 400 });
  }

  const validation = validateContactPayload(body);
  if (!validation.valid || !validation.data) {
    return NextResponse.json({ ok: false, code: "VALIDATION_ERROR", errors: validation.errors }, { status: 422 });
  }

  try {
    const providerResponse = await fetch(config.webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recipient: config.recipientEmail, inquiry: validation.data }),
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });
    if (!providerResponse.ok) throw new Error("Provider rejected the message");
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, code: "PROVIDER_ERROR" }, { status: 502 });
  }
}
