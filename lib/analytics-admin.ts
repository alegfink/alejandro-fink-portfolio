import { getSiteUrl } from "@/lib/urls";

export const ANALYTICS_ADMIN_SESSION_COOKIE = "af-admin-ga-session-v1";
export const ANALYTICS_ADMIN_OAUTH_COOKIE = "af-admin-ga-oauth-v1";
export const GOOGLE_ANALYTICS_PANEL_URL = "https://analytics.google.com/analytics/web/";

const SESSION_VERSION = 1;
const sessionLifetimeSeconds = 60 * 60 * 24 * 30;

export type AnalyticsAdminConfig = {
  allowedEmail: string;
  clientId: string;
  clientSecret: string;
  propertyId: string;
  redirectUri: string;
  sessionSecret: string;
  siteUrl: URL;
};

export type AnalyticsAdminSession = {
  accessToken: string;
  email: string;
  expiresAt: number;
  refreshToken?: string;
  version: typeof SESSION_VERSION;
};

export type AnalyticsOauthAttempt = {
  codeVerifier: string;
  expiresAt: number;
  state: string;
  version: typeof SESSION_VERSION;
};

export type GoogleTokenResponse = {
  access_token: string;
  expires_in: number;
  id_token?: string;
  refresh_token?: string;
  scope?: string;
  token_type: string;
};

export type GoogleUserInfo = {
  email: string;
  email_verified?: boolean;
  sub: string;
};

type ConfigResult =
  | { configured: true; config: AnalyticsAdminConfig; missing: [] }
  | { configured: false; config: null; missing: string[] };

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

export function getAnalyticsAdminConfig(): ConfigResult {
  const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID?.trim() ?? "";
  const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET?.trim() ?? "";
  const sessionSecret = process.env.ANALYTICS_SESSION_SECRET?.trim() ?? "";
  const allowedEmail = normalizeEmail(process.env.ANALYTICS_ALLOWED_EMAIL ?? "");
  const propertyId = process.env.GOOGLE_ANALYTICS_PROPERTY_ID?.trim() ?? "";
  const missing = [
    ["GOOGLE_OAUTH_CLIENT_ID", clientId],
    ["GOOGLE_OAUTH_CLIENT_SECRET", clientSecret],
    ["ANALYTICS_SESSION_SECRET", sessionSecret.length >= 32 ? sessionSecret : ""],
    ["ANALYTICS_ALLOWED_EMAIL", allowedEmail],
    ["GOOGLE_ANALYTICS_PROPERTY_ID", /^\d{6,}$/.test(propertyId) ? propertyId : ""],
  ].flatMap(([name, value]) => (value ? [] : [name]));

  if (missing.length > 0) return { configured: false, config: null, missing };

  const siteUrl = getSiteUrl();
  return {
    configured: true,
    missing: [],
    config: {
      allowedEmail,
      clientId,
      clientSecret,
      propertyId,
      redirectUri: new URL("/api/admin/google/callback", siteUrl).toString(),
      sessionSecret,
      siteUrl,
    },
  };
}

function bytesToBase64Url(bytes: Uint8Array) {
  let binary = "";
  for (let offset = 0; offset < bytes.length; offset += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + 0x8000));
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlToBytes(value: string) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(base64);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

async function importEncryptionKey(secret: string) {
  const material = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(secret));
  return crypto.subtle.importKey("raw", material, { name: "AES-GCM" }, false, ["encrypt", "decrypt"]);
}

export function createRandomToken(byteLength = 32) {
  return bytesToBase64Url(crypto.getRandomValues(new Uint8Array(byteLength)));
}

export async function createCodeChallenge(codeVerifier: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(codeVerifier));
  return bytesToBase64Url(new Uint8Array(digest));
}

export async function sealAnalyticsAdminValue(value: unknown, secret: string) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await importEncryptionKey(secret);
  const payload = new TextEncoder().encode(JSON.stringify(value));
  const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, payload);
  return `v${SESSION_VERSION}.${bytesToBase64Url(iv)}.${bytesToBase64Url(new Uint8Array(encrypted))}`;
}

export async function unsealAnalyticsAdminValue<T>(token: string | undefined, secret: string): Promise<T | null> {
  if (!token) return null;
  const [version, encodedIv, encodedPayload] = token.split(".");
  if (version !== `v${SESSION_VERSION}` || !encodedIv || !encodedPayload) return null;
  try {
    const key = await importEncryptionKey(secret);
    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: base64UrlToBytes(encodedIv) },
      key,
      base64UrlToBytes(encodedPayload),
    );
    return JSON.parse(new TextDecoder().decode(decrypted)) as T;
  } catch {
    return null;
  }
}

export function isValidAnalyticsAdminSession(value: unknown): value is AnalyticsAdminSession {
  if (!value || typeof value !== "object") return false;
  const session = value as Partial<AnalyticsAdminSession>;
  return session.version === SESSION_VERSION
    && typeof session.accessToken === "string"
    && session.accessToken.length > 20
    && typeof session.email === "string"
    && typeof session.expiresAt === "number"
    && (session.refreshToken === undefined || typeof session.refreshToken === "string");
}

export function isValidAnalyticsOauthAttempt(value: unknown): value is AnalyticsOauthAttempt {
  if (!value || typeof value !== "object") return false;
  const attempt = value as Partial<AnalyticsOauthAttempt>;
  return attempt.version === SESSION_VERSION
    && typeof attempt.codeVerifier === "string"
    && attempt.codeVerifier.length > 30
    && typeof attempt.state === "string"
    && attempt.state.length > 20
    && typeof attempt.expiresAt === "number"
    && attempt.expiresAt > Date.now();
}

export function analyticsAdminCookieOptions(siteUrl: URL, maxAge = sessionLifetimeSeconds) {
  return {
    httpOnly: true,
    maxAge,
    path: "/",
    sameSite: "lax" as const,
    secure: siteUrl.protocol === "https:",
  };
}

export function buildAnalyticsOauthAttempt(): AnalyticsOauthAttempt {
  return {
    codeVerifier: createRandomToken(48),
    expiresAt: Date.now() + 10 * 60 * 1000,
    state: createRandomToken(32),
    version: SESSION_VERSION,
  };
}

export function buildAnalyticsAdminSession(tokens: GoogleTokenResponse, user: GoogleUserInfo): AnalyticsAdminSession {
  return {
    accessToken: tokens.access_token,
    email: normalizeEmail(user.email),
    expiresAt: Date.now() + Math.max(60, tokens.expires_in) * 1000,
    ...(tokens.refresh_token ? { refreshToken: tokens.refresh_token } : {}),
    version: SESSION_VERSION,
  };
}

export async function exchangeGoogleAuthorizationCode(config: AnalyticsAdminConfig, code: string, codeVerifier: string) {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: config.clientId,
      client_secret: config.clientSecret,
      code,
      code_verifier: codeVerifier,
      grant_type: "authorization_code",
      redirect_uri: config.redirectUri,
    }),
  });
  if (!response.ok) throw new Error(`google_token_exchange_${response.status}`);
  return response.json() as Promise<GoogleTokenResponse>;
}

export async function refreshGoogleAccessToken(config: AnalyticsAdminConfig, refreshToken: string) {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: config.clientId,
      client_secret: config.clientSecret,
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });
  if (!response.ok) throw new Error(`google_token_refresh_${response.status}`);
  return response.json() as Promise<GoogleTokenResponse>;
}

export async function fetchGoogleUserInfo(accessToken: string) {
  const response = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!response.ok) throw new Error(`google_userinfo_${response.status}`);
  return response.json() as Promise<GoogleUserInfo>;
}
