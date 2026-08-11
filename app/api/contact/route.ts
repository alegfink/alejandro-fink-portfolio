import { NextResponse } from "next/server";
import { getContactConfig, validateContactSubmission } from "@/lib/contact";
import { getSiteUrl } from "@/lib/urls";

export const dynamic = "force-dynamic";

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1_000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const rateLimitBuckets = new Map<string, { count: number; resetAt: number }>();

type ProviderResponse = { ok?: boolean; code?: string; duplicate?: boolean };

async function anonymizedClientKey(request: Request) {
  const forwarded = request.headers.get("cf-connecting-ip") ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const bytes = new TextEncoder().encode(forwarded);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest).slice(0, 12), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function exceedsRateLimit(key: string, now = Date.now()) {
  const current = rateLimitBuckets.get(key);
  if (!current || current.resetAt <= now) {
    rateLimitBuckets.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  current.count += 1;
  return current.count > RATE_LIMIT_MAX_REQUESTS;
}

export function clearContactRateLimitForTests() {
  rateLimitBuckets.clear();
}

export async function POST(request: Request) {
  const config = getContactConfig();

  // Reject before reading the body while contact is not configured.
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

  const validation = validateContactSubmission(body);
  if (!validation.valid) {
    // Honeypots fail silently so automated senders receive no useful feedback.
    if (validation.code === "BOT_DETECTED") return NextResponse.json({ ok: true });
    if (validation.code === "FORM_TOO_FAST") {
      return NextResponse.json({ ok: false, code: validation.code }, { status: 429 });
    }
    if (validation.code === "VALIDATION_ERROR") {
      return NextResponse.json({ ok: false, code: validation.code, errors: validation.errors }, { status: 422 });
    }
    return NextResponse.json({ ok: false, code: validation.code }, { status: 422 });
  }

  const clientKey = await anonymizedClientKey(request);
  if (exceedsRateLimit(clientKey)) {
    return NextResponse.json({ ok: false, code: "RATE_LIMITED" }, { status: 429 });
  }

  try {
    const providerResponse = await fetch(config.webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret: config.webhookSecret, inquiry: validation.data }),
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });
    const providerBody = await providerResponse.json().catch(() => null) as ProviderResponse | null;
    if (!providerResponse.ok || providerBody?.ok !== true) {
      throw new Error(providerBody?.code ?? "Provider rejected the message");
    }
    return NextResponse.json({ ok: true, duplicate: providerBody.duplicate === true });
  } catch (error) {
    const timedOut = error instanceof DOMException && (error.name === "TimeoutError" || error.name === "AbortError");
    return NextResponse.json(
      { ok: false, code: timedOut ? "PROVIDER_TIMEOUT" : "PROVIDER_ERROR" },
      { status: timedOut ? 504 : 502 },
    );
  }
}
