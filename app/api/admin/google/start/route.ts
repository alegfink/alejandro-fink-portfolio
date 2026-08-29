import { NextResponse } from "next/server";
import {
  ANALYTICS_ADMIN_OAUTH_COOKIE,
  analyticsAdminCookieOptions,
  buildAnalyticsOauthAttempt,
  createCodeChallenge,
  getAnalyticsAdminConfig,
  sealAnalyticsAdminValue,
} from "@/lib/analytics-admin";
import { getSiteUrl } from "@/lib/urls";

export const dynamic = "force-dynamic";

export async function GET() {
  const result = getAnalyticsAdminConfig();
  if (!result.configured) {
    return NextResponse.redirect(new URL("/admin/metricas?estado=configuracion", getSiteUrl()), 307);
  }

  const { config } = result;
  const attempt = buildAnalyticsOauthAttempt();
  const challenge = await createCodeChallenge(attempt.codeVerifier);
  const authorizationUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authorizationUrl.search = new URLSearchParams({
    access_type: "offline",
    client_id: config.clientId,
    code_challenge: challenge,
    code_challenge_method: "S256",
    include_granted_scopes: "true",
    prompt: "consent select_account",
    redirect_uri: config.redirectUri,
    response_type: "code",
    scope: "openid email https://www.googleapis.com/auth/analytics.readonly",
    state: attempt.state,
  }).toString();

  const response = NextResponse.redirect(authorizationUrl, 307);
  response.cookies.set({
    name: ANALYTICS_ADMIN_OAUTH_COOKIE,
    value: await sealAnalyticsAdminValue(attempt, config.sessionSecret),
    ...analyticsAdminCookieOptions(config.siteUrl, 10 * 60),
  });
  response.headers.set("Cache-Control", "no-store");
  response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  return response;
}
