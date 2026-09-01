import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { stabilizeLocalMedia, waitForPortfolioReady } from "./helpers";

const accessibilityRoutes = ["/", "/proyectos", "/acerca-de", "/en"] as const;

test.beforeEach(async ({ page, browserName }) => {
  if (browserName === "chromium") await stabilizeLocalMedia(page);
});

for (const path of accessibilityRoutes) {
  test(`${path} has no critical or serious automated accessibility violations`, async ({ page }) => {
    await page.goto(path, { waitUntil: "domcontentloaded" });
    await waitForPortfolioReady(page);

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    const blockingViolations = results.violations.filter((violation) => violation.impact === "critical" || violation.impact === "serious");

    expect(blockingViolations, JSON.stringify(blockingViolations, null, 2)).toEqual([]);
  });
}

test("skip link is focusable and reaches the intended content", async ({ page }) => {
  await page.goto("/proyectos", { waitUntil: "domcontentloaded" });
  await waitForPortfolioReady(page);
  const skipLink = page.locator("a[href='#archivo']").first();
  await skipLink.focus();
  await expect(skipLink).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#archivo$/);
  await expect(page.locator("#archivo")).toBeVisible();
});
