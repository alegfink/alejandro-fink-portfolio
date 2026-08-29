import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  ANALYTICS_ADMIN_SESSION_COOKIE,
  analyticsAdminCookieOptions,
  getAnalyticsAdminConfig,
  isValidAnalyticsAdminSession,
  refreshGoogleAccessToken,
  sealAnalyticsAdminValue,
  unsealAnalyticsAdminValue,
  type AnalyticsAdminSession,
} from "@/lib/analytics-admin";
import { fetchAnalyticsDashboardSummary, GoogleAnalyticsDataError } from "@/lib/google-analytics-data";

export const dynamic = "force-dynamic";

function json(body: unknown, status = 200) {
  const response = NextResponse.json(body, { status });
  response.headers.set("Cache-Control", "private, no-store");
  response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  return response;
}

async function refreshSession(session: AnalyticsAdminSession, config: NonNullable<ReturnType<typeof getAnalyticsAdminConfig>["config"]>) {
  if (!session.refreshToken) return null;
  const tokens = await refreshGoogleAccessToken(config, session.refreshToken);
  if (!tokens.access_token || !tokens.expires_in) return null;
  return {
    ...session,
    accessToken: tokens.access_token,
    expiresAt: Date.now() + Math.max(60, tokens.expires_in) * 1000,
    refreshToken: tokens.refresh_token ?? session.refreshToken,
  } satisfies AnalyticsAdminSession;
}

export async function GET(request: NextRequest) {
  const result = getAnalyticsAdminConfig();
  if (!result.configured) return json({ code: "configuration_missing", missing: result.missing }, 503);
  const { config } = result;

  const sealedSession = request.cookies.get(ANALYTICS_ADMIN_SESSION_COOKIE)?.value;
  let session = await unsealAnalyticsAdminValue<AnalyticsAdminSession>(sealedSession, config.sessionSecret);
  if (!isValidAnalyticsAdminSession(session) || session.email !== config.allowedEmail) {
    return json({ code: "not_authenticated" }, 401);
  }

  let refreshed = false;
  if (session.expiresAt <= Date.now() + 60_000) {
    try {
      session = await refreshSession(session, config);
      refreshed = true;
    } catch {
      session = null;
    }
    if (!session) {
      const response = json({ code: "session_expired" }, 401);
      response.cookies.set({ name: ANALYTICS_ADMIN_SESSION_COOKIE, value: "", ...analyticsAdminCookieOptions(config.siteUrl, 0) });
      return response;
    }
  }

  try {
    const summary = await fetchAnalyticsDashboardSummary(session.accessToken, config.propertyId);
    const response = json({ accountEmail: session.email, summary });
    if (refreshed) {
      response.cookies.set({
        name: ANALYTICS_ADMIN_SESSION_COOKIE,
        value: await sealAnalyticsAdminValue(session, config.sessionSecret),
        ...analyticsAdminCookieOptions(config.siteUrl),
      });
    }
    return response;
  } catch (error) {
    if (error instanceof GoogleAnalyticsDataError) {
      if (error.status === 401) return json({ code: "session_expired" }, 401);
      if (error.status === 403) return json({ code: "analytics_access_denied" }, 403);
      if (error.status === 404) return json({ code: "property_not_found" }, 404);
    }
    return json({ code: "analytics_unavailable" }, 502);
  }
}
