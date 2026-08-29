import { describe, expect, it } from "vitest";
import { GET } from "../app/(root)/admin/metricas/route";

describe("private analytics entry point", () => {
  it("redirects to the portfolio property and excludes the browser from internal traffic", () => {
    const response = GET();
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toContain("analytics.google.com/analytics/web/");
    expect(response.headers.get("location")).toContain("p549251072");
    expect(response.headers.get("set-cookie")).toContain("af-analytics-internal-v1=true");
    expect(response.headers.get("x-robots-tag")).toBe("noindex, nofollow, noarchive");
  });
});
