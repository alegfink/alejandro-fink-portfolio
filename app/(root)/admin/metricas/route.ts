import { NextResponse } from "next/server";
import { ANALYTICS_INTERNAL_COOKIE } from "@/lib/analytics";

const portfolioAnalyticsUrl = "https://analytics.google.com/analytics/web/#/a404062247p549251072/reports/intelligenthome";

export const dynamic = "force-dynamic";

export function GET() {
  const response = NextResponse.redirect(portfolioAnalyticsUrl, 307);
  response.cookies.set({
    name: ANALYTICS_INTERNAL_COOKIE,
    value: "true",
    httpOnly: false,
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
    sameSite: "lax",
    secure: true,
  });
  response.headers.set("Cache-Control", "no-store");
  response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  return response;
}
