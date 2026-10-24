import { defineConfig } from "@playwright/test";

const externalURL = process.env.PLAYWRIGHT_BASE_URL;
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  workers: 2,
  retries: 0,
  reporter: "list",
  outputDir: "test-results/e2e",
  use: {
    baseURL: externalURL || "http://127.0.0.1:3100",
    browserName: "chromium",
    reducedMotion: "reduce",
    viewport: { width: 1440, height: 1000 },
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    launchOptions: executablePath ? { executablePath } : {},
  },
  webServer: externalURL
    ? undefined
    : {
        command: "npm run dev -- --port 3100",
        url: "http://127.0.0.1:3100",
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
});
