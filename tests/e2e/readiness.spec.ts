import { expect, test } from "@playwright/test";
import { canonicalRoutes, closeConsentIfVisible, stabilizeLocalMedia, waitForPortfolioReady } from "./helpers";

test.beforeEach(async ({ page, browserName }) => {
  if (browserName === "chromium") await stabilizeLocalMedia(page);
});

for (const path of canonicalRoutes) {
  test(`${path} renders as a canonical route without runtime errors`, async ({ page }) => {
    const consoleErrors: string[] = [];
    const pageErrors: string[] = [];
    page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text()); });
    page.on("pageerror", (error) => pageErrors.push(error.message));

    const response = await page.goto(path, { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBeLessThan(400);
    await waitForPortfolioReady(page);

    const expectedLanguage = path === "/en" || path.startsWith("/en/") ? "en" : "es";
    await expect(page.locator("html")).toHaveAttribute("lang", expectedLanguage);
    await expect(page.locator("main")).toBeVisible();
    await expect(page.locator("link[rel='canonical']")).toHaveAttribute("href", new RegExp(`${path === "/" ? "/?$" : `${path}/?$`}`));
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);

    const brokenVisibleImages = await page.locator("img:visible").evaluateAll((images) => images
      .filter((image) => image instanceof HTMLImageElement && image.complete && image.naturalWidth === 0)
      .map((image) => (image as HTMLImageElement).currentSrc || (image as HTMLImageElement).src));
    expect(brokenVisibleImages).toEqual([]);
    expect(pageErrors).toEqual([]);
    expect(consoleErrors).toEqual([]);
  });
}

test("the branded loader runs once per tab and internal navigation skips it", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium-desktop", "One browser is enough for the session contract");

  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.locator("[data-portfolio-loader]")).toBeVisible();
  await waitForPortfolioReady(page);

  const projectsLink = page.locator("header a[href='/proyectos']:visible").first();
  await Promise.all([
    page.waitForURL(/\/proyectos$/),
    projectsLink.click(),
  ]);
  await waitForPortfolioReady(page);

  await expect(page.locator("[data-loader-mode='session-skip']")).toHaveCount(1);
  expect(await page.evaluate(() => document.documentElement.dataset.portfolioLoaderSeen)).toBe("true");

  await page.goBack({ waitUntil: "domcontentloaded" });
  await waitForPortfolioReady(page);
  await expect(page.locator("[data-portfolio-loader]")).toHaveCount(0);
});

test("the primary contact works without a Gmail session", async ({ page }, testInfo) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await waitForPortfolioReady(page);
  if (testInfo.project.name.includes("mobile")) {
    await closeConsentIfVisible(page);
    await page.locator("[data-mobile-menu-trigger]").click();
    const mobileContact = page.locator("#v2-mobile-navigation a[href^='https://wa.me/']:visible");
    await expect(mobileContact).toHaveAttribute("href", /wa\.me\/5491162494740\?text=/);
    return;
  }
  const contact = page.locator("header a[href^='mailto:']:visible").first();
  await expect(contact).toHaveAttribute("href", /mailto:alegfink@gmail\.com\?subject=/);
  await expect(contact).not.toHaveAttribute("target", "_blank");
});

test("mobile navigation closes with Escape and returns focus", async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.includes("mobile"), "Mobile-only interaction");

  await page.goto("/proyectos", { waitUntil: "domcontentloaded" });
  await waitForPortfolioReady(page);
  const trigger = page.locator("[data-mobile-menu-trigger]");
  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByRole("dialog", { name: /Navegación principal|Main navigation/ })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(trigger).toBeFocused();
});

test("the mobile project rail exposes every case and a scroll cue", async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.includes("mobile"), "Mobile-only interaction");

  await page.goto("/proyectos", { waitUntil: "domcontentloaded" });
  await waitForPortfolioReady(page);
  const rail = page.locator("[data-project-index]");
  expect(await rail.evaluate((element) => element.scrollWidth > element.clientWidth)).toBe(true);
  await expect(page.getByText("Deslizá para ver más →")).toBeVisible();
  const lastCase = rail.locator("a[href='#salto-cuantico']");
  await lastCase.scrollIntoViewIfNeeded();
  await expect(lastCase).toBeVisible();
});

test("reduced motion keeps the complete page available without ambient playback", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium-reduced-motion", "Reduced-motion project only");

  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await waitForPortfolioReady(page);
  expect(await page.evaluate(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches)).toBe(true);
  await expect(page.locator("main")).toBeVisible();
  expect(await page.locator("video").evaluateAll((videos) => videos.every((video) => (video as HTMLVideoElement).paused))).toBe(true);
});

test("captures current visual evidence after consent choice", async ({ page }, testInfo) => {
  test.slow();
  test.skip(!["chromium-desktop", "chromium-mobile", "webkit-desktop"].includes(testInfo.project.name), "Representative evidence projects only");

  await page.goto("/", { waitUntil: "domcontentloaded" });
  await waitForPortfolioReady(page);
  await testInfo.attach("home-fresh-consent", { body: await page.screenshot(), contentType: "image/png" });
  await closeConsentIfVisible(page);
  await testInfo.attach("home-ready", { body: await page.screenshot(), contentType: "image/png" });

  await page.goto("/proyectos", { waitUntil: "domcontentloaded" });
  await waitForPortfolioReady(page);
  await testInfo.attach("projects-ready", { body: await page.screenshot(), contentType: "image/png" });
});
