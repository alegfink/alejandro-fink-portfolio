import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  ANALYTICS_ADMIN_OAUTH_COOKIE,
  ANALYTICS_ADMIN_SESSION_COOKIE,
  analyticsAdminCookieOptions,
  buildAnalyticsAdminSession,
  exchangeGoogleAuthorizationCode,
  fetchGoogleUserInfo,
  getAnalyticsAdminConfig,
  isValidAnalyticsOauthAttempt,
  sealAnalyticsAdminValue,
  unsealAnalyticsAdminValue,
  type AnalyticsOauthAttempt,
} from "@/lib/analytics-admin";

export const dynamic = "force-dynamic";

function redirectWithStatus(siteUrl: URL, status: string) {
  const response = NextResponse.redirect(new URL(`/admin/metricas?estado=${encodeURIComponent(status)}`, siteUrl), 307);
  response.headers.set("Cache-Control", "no-store");
  response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  return response;
}

export async function GET(request: NextRequest) {
  const result = getAnalyticsAdminConfig();
  const fallbackSiteUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000");
  if (!result.configured) return redirectWithStatus(fallbackSiteUrl, "configuracion");
  const { config } = result;

  const oauthError = request.nextUrl.searchParams.get("error");
  if (oauthError) return redirectWithStatus(config.siteUrl, oauthError === "access_denied" ? "cancelado" : "oauth");

  const code = request.nextUrl.searchParams.get("code") ?? "";
  const state = request.nextUrl.searchParams.get("state") ?? "";
  const sealedAttempt = request.cookies.get(ANALYTICS_ADMIN_OAUTH_COOKIE)?.value;
  const attempt = await unsealAnalyticsAdminValue<AnalyticsOauthAttempt>(sealedAttempt, config.sessionSecret);
  if (!code || !state || !isValidAnalyticsOauthAttempt(attempt) || state !== attempt.state) {
    return redirectWithStatus(config.siteUrl, "sesion_invalida");
  }

  try {
    const tokens = await exchangeGoogleAuthorizationCode(config, code, attempt.codeVerifier);
    if (!tokens.access_token || !tokens.expires_in) return redirectWithStatus(config.siteUrl, "oauth");
    const user = await fetchGoogleUserInfo(tokens.access_token);
    if (user.email_verified === false || user.email.trim().toLowerCase() !== config.allowedEmail) {
      return redirectWithStatus(config.siteUrl, "sin_permiso");
    }

    const session = buildAnalyticsAdminSession(tokens, user);
    const response = NextResponse.redirect(new URL("/admin/metricas", config.siteUrl), 307);
    response.cookies.set({
      name: ANALYTICS_ADMIN_SESSION_COOKIE,
      value: await sealAnalyticsAdminValue(session, config.sessionSecret),
      ...analyticsAdminCookieOptions(config.siteUrl),
    });
    response.cookies.set({ name: ANALYTICS_ADMIN_OAUTH_COOKIE, value: "", ...analyticsAdminCookieOptions(config.siteUrl, 0) });
    response.headers.set("Cache-Control", "no-store");
    response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
    return response;
  } catch (error) {
    console.error(
      "[analytics-admin] Google OAuth callback failed:",
      error instanceof Error ? error.message : "unknown_error",
    );
    return redirectWithStatus(config.siteUrl, "oauth");
  }
}
