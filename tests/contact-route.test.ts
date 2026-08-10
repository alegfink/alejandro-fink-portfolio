import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { clearContactRateLimitForTests, POST } from "../app/api/contact/route";
import { CONTACT_MIN_COMPLETION_MS } from "../lib/contact";

const siteUrl = "https://portfolio.example";
const webhookUrl = "https://script.google.com/macros/s/AKfycb-test_123/exec";
const secret = "a-secure-webhook-secret-with-more-than-32-characters";

function submission(index = 0) {
  return {
    name: "Ada Lovelace",
    email: "ada@example.com",
    need: "product",
    stage: "starting",
    message: "I need a useful product validation flow.",
    locale: "en",
    submissionId: `d9428888-122b-4c1d-8a1a-ea7b8f1f3ab${index}`,
    startedAt: Date.now() - CONTACT_MIN_COMPLETION_MS,
    botField: "",
  };
}

function request(body: unknown, origin = siteUrl, ip = "203.0.113.8") {
  return new Request(`${siteUrl}/api/contact`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: origin,
      "CF-Connecting-IP": ip,
    },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  clearContactRateLimitForTests();
  vi.stubEnv("NEXT_PUBLIC_SITE_URL", siteUrl);
  vi.stubEnv("CONTACT_PROVIDER", "google-apps-script");
  vi.stubEnv("CONTACT_WEBHOOK_URL", webhookUrl);
  vi.stubEnv("CONTACT_WEBHOOK_SECRET", secret);
  vi.stubEnv("CONTACT_RECIPIENT_EMAIL", "alegfink@gmail.com");
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe("POST /api/contact", () => {
  it("rejects requests while the provider is disabled", async () => {
    vi.stubEnv("CONTACT_PROVIDER", "disabled");
    const response = await POST(request(submission()));
    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toMatchObject({ ok: false, code: "CONTACT_DISABLED" });
  });

  it("rejects another origin", async () => {
    const response = await POST(request(submission(), "https://attacker.example"));
    expect(response.status).toBe(403);
  });

  it("silently accepts a honeypot hit without calling Google", async () => {
    const provider = vi.fn();
    vi.stubGlobal("fetch", provider);
    const response = await POST(request({ ...submission(), botField: "https://spam.example" }));
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ ok: true });
    expect(provider).not.toHaveBeenCalled();
  });

  it("rejects invalid and too-fast submissions before calling Google", async () => {
    const provider = vi.fn();
    vi.stubGlobal("fetch", provider);
    const invalid = await POST(request({ ...submission(), email: "invalid" }));
    expect(invalid.status).toBe(422);
    const tooFast = await POST(request({ ...submission(), startedAt: Date.now() }));
    expect(tooFast.status).toBe(429);
    expect(provider).not.toHaveBeenCalled();
  });

  it("delivers a valid inquiry and forwards only the secret and validated inquiry", async () => {
    const provider = vi.fn().mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200 }));
    vi.stubGlobal("fetch", provider);
    const response = await POST(request(submission()));
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ ok: true, duplicate: false });
    const options = provider.mock.calls[0][1] as RequestInit;
    const forwarded = JSON.parse(String(options.body));
    expect(forwarded.secret).toBe(secret);
    expect(forwarded.inquiry.email).toBe("ada@example.com");
    expect(forwarded).not.toHaveProperty("recipient");
  });

  it("treats an idempotent provider response as success", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ ok: true, duplicate: true }), { status: 200 })));
    const response = await POST(request(submission()));
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ ok: true, duplicate: true });
  });

  it("surfaces provider errors, malformed responses and timeouts", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValueOnce(new Response(JSON.stringify({ ok: false, code: "EMAIL_FAILED" }), { status: 200 })));
    expect((await POST(request(submission(), siteUrl, "203.0.113.10"))).status).toBe(502);

    vi.stubGlobal("fetch", vi.fn().mockResolvedValueOnce(new Response("not-json", { status: 200 })));
    expect((await POST(request(submission(), siteUrl, "203.0.113.11"))).status).toBe(502);

    vi.stubGlobal("fetch", vi.fn().mockRejectedValueOnce(new DOMException("Timed out", "TimeoutError")));
    const timedOut = await POST(request(submission(), siteUrl, "203.0.113.12"));
    expect(timedOut.status).toBe(504);
    await expect(timedOut.json()).resolves.toMatchObject({ code: "PROVIDER_TIMEOUT" });
  });

  it("limits bursts without persisting the visitor address", async () => {
    vi.stubGlobal("fetch", vi.fn().mockImplementation(() => Promise.resolve(new Response(JSON.stringify({ ok: true }), { status: 200 }))));
    for (let index = 0; index < 5; index += 1) {
      expect((await POST(request(submission(index), siteUrl, "203.0.113.20"))).status).toBe(200);
    }
    const limited = await POST(request(submission(5), siteUrl, "203.0.113.20"));
    expect(limited.status).toBe(429);
    await expect(limited.json()).resolves.toMatchObject({ code: "RATE_LIMITED" });
  });
});
