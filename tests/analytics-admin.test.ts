import { afterEach, describe, expect, it } from "vitest";
import {
  analyticsAdminCookieOptions,
  buildAnalyticsAdminSession,
  createCodeChallenge,
  getAnalyticsAdminConfig,
  isValidAnalyticsAdminSession,
  sealAnalyticsAdminValue,
  unsealAnalyticsAdminValue,
  type AnalyticsAdminSession,
} from "../lib/analytics-admin";

const originalEnv = { ...process.env };

afterEach(() => {
  process.env = { ...originalEnv };
});

describe("private analytics configuration", () => {
  it("reports every missing server-side requirement without exposing a fake configured state", () => {
    delete process.env.GOOGLE_OAUTH_CLIENT_ID;
    delete process.env.GOOGLE_OAUTH_CLIENT_SECRET;
    delete process.env.ANALYTICS_SESSION_SECRET;
    delete process.env.ANALYTICS_ALLOWED_EMAIL;
    delete process.env.GOOGLE_ANALYTICS_PROPERTY_ID;
    const result = getAnalyticsAdminConfig();
    expect(result.configured).toBe(false);
    expect(result.missing).toEqual(expect.arrayContaining([
      "GOOGLE_OAUTH_CLIENT_ID",
      "GOOGLE_OAUTH_CLIENT_SECRET",
      "ANALYTICS_SESSION_SECRET",
      "ANALYTICS_ALLOWED_EMAIL",
      "GOOGLE_ANALYTICS_PROPERTY_ID",
    ]));
  });

  it("uses the trusted site origin for the OAuth callback", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "http://localhost:3001";
    process.env.GOOGLE_OAUTH_CLIENT_ID = "client-id";
    process.env.GOOGLE_OAUTH_CLIENT_SECRET = "client-secret";
    process.env.ANALYTICS_SESSION_SECRET = "a".repeat(32);
    process.env.ANALYTICS_ALLOWED_EMAIL = "ALEGFINK@GMAIL.COM ";
    process.env.GOOGLE_ANALYTICS_PROPERTY_ID = "549251072";
    const result = getAnalyticsAdminConfig();
    expect(result.configured).toBe(true);
    if (!result.configured) return;
    expect(result.config.redirectUri).toBe("http://localhost:3001/api/admin/google/callback");
    expect(result.config.allowedEmail).toBe("alegfink@gmail.com");
    expect(analyticsAdminCookieOptions(result.config.siteUrl).secure).toBe(false);
  });
});

describe("private analytics session", () => {
  it("round-trips an encrypted session and rejects tampering", async () => {
    const secret = "portfolio-session-secret-".repeat(2);
    const session: AnalyticsAdminSession = {
      accessToken: "access-token-with-enough-entropy-123",
      email: "alegfink@gmail.com",
      expiresAt: Date.now() + 60_000,
      refreshToken: "refresh-token",
      version: 1,
    };
    const sealed = await sealAnalyticsAdminValue(session, secret);
    expect(sealed).not.toContain(session.accessToken);
    expect(await unsealAnalyticsAdminValue<AnalyticsAdminSession>(sealed, secret)).toEqual(session);
    expect(await unsealAnalyticsAdminValue(`${sealed.slice(0, -2)}xx`, secret)).toBeNull();
  });

  it("builds a valid normalized Google session", () => {
    const session = buildAnalyticsAdminSession(
      { access_token: "access-token-with-enough-entropy-123", expires_in: 3600, token_type: "Bearer", refresh_token: "refresh" },
      { email: "ALEGFINK@GMAIL.COM", email_verified: true, sub: "google-id" },
    );
    expect(session.email).toBe("alegfink@gmail.com");
    expect(isValidAnalyticsAdminSession(session)).toBe(true);
  });

  it("creates the expected PKCE SHA-256 challenge", async () => {
    expect(await createCodeChallenge("dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk"))
      .toBe("E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM");
  });
});
