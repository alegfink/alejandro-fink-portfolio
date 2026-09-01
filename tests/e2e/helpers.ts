import { expect, type Page } from "@playwright/test";

export const canonicalRoutes = [
  "/",
  "/proyectos",
  "/acerca-de",
  "/privacidad",
  "/en",
  "/en/projects",
  "/en/about",
  "/en/privacy",
] as const;

export async function stabilizeLocalMedia(page: Page): Promise<void> {
  if (process.env.PLAYWRIGHT_REAL_MEDIA === "true") return;

  // The Vinext production server can throw ERR_STREAM_UNABLE_TO_PIPE when
  // browser engines cancel repeated MP4 range requests. Local UI QA uses the
  // real posters and DOM states; Preview must validate actual CDN streaming.
  await page.route(/\/media\/.*\.mp4(?:\?.*)?$/, async (route) => {
    await route.fulfill({ status: 204, contentType: "video/mp4", body: "" });
  });
}

export async function waitForPortfolioReady(page: Page): Promise<void> {
  // Vinext compiles routes on demand in local QA. This waits for the actual
  // application state without treating first-compile latency as loader latency.
  await page.locator("[data-page-ready='true']").first().waitFor({ state: "attached", timeout: 30_000 });
  await expect(page.locator("[data-portfolio-loader]")).toHaveCount(0, { timeout: 15_000 });
}

export async function closeConsentIfVisible(page: Page): Promise<void> {
  const reject = page.getByRole("button", { name: /Solo necesarias|Necessary only/ });
  if (await reject.isVisible().catch(() => false)) await reject.click();
}
