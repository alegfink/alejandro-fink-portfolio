import { NextResponse } from "next/server";
import {
  ANALYTICS_ADMIN_OAUTH_COOKIE,
  ANALYTICS_ADMIN_SESSION_COOKIE,
  analyticsAdminCookieOptions,
  getAnalyticsAdminConfig,
} from "@/lib/analytics-admin";
import { getSiteUrl } from "@/lib/urls";

export const dynamic = "force-dynamic";

export async function POST() {
  const result = getAnalyticsAdminConfig();
  const siteUrl = result.configured ? result.config.siteUrl : getSiteUrl();
  const response = new NextResponse(null, { status: 204 });
  response.cookies.set({ name: ANALYTICS_ADMIN_SESSION_COOKIE, value: "", ...analyticsAdminCookieOptions(siteUrl, 0) });
  response.cookies.set({ name: ANALYTICS_ADMIN_OAUTH_COOKIE, value: "", ...analyticsAdminCookieOptions(siteUrl, 0) });
  response.headers.set("Cache-Control", "no-store");
  response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  return response;
}
