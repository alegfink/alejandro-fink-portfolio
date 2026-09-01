import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:4173";
const reportFolder = process.env.PLAYWRIGHT_HTML_OUTPUT_DIR ?? "./artifacts/qa/awwwards-final/playwright-report";
const outputDir = process.env.PLAYWRIGHT_OUTPUT_DIR ?? "./artifacts/qa/awwwards-final/test-results";

export default defineConfig({
  testDir: "./tests/e2e",
  outputDir,
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: 2,
  timeout: 60_000,
  expect: { timeout: 15_000 },
  reporter: [
    ["list"],
    ["html", { outputFolder: reportFolder, open: "never" }],
  ],
  use: {
    baseURL,
    colorScheme: "dark",
    locale: "es-AR",
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
    video: "off",
  },
  webServer: process.env.PLAYWRIGHT_BASE_URL ? undefined : {
    command: "npm run dev -- --host 127.0.0.1 --port 4173",
    url: baseURL,
    reuseExistingServer: true,
    timeout: 180_000,
  },
  projects: [
    { name: "chromium-desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    { name: "firefox-desktop", use: { ...devices["Desktop Firefox"], viewport: { width: 1440, height: 900 } } },
    { name: "webkit-desktop", use: { ...devices["Desktop Safari"], viewport: { width: 1440, height: 900 } } },
    { name: "chromium-mobile", use: { ...devices["Pixel 7"] } },
    { name: "webkit-mobile", use: { ...devices["iPhone 13"] } },
    {
      name: "chromium-reduced-motion",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } },
    },
  ],
});
