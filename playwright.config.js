import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "tests/browser",
  timeout: 180000,
  workers: 1,
  use: {
    baseURL: "http://127.0.0.1:8000",
    viewport: { width: 1100, height: 800 },
    screenshot: "only-on-failure",
    headless: true,
    channel: process.env.PLAYWRIGHT_CHANNEL || "chromium",
    launchOptions: { args: ["--disable-gpu"] },
  },
  webServer: {
    command: "node scripts/serve.js",
    url: "http://127.0.0.1:8000",
    reuseExistingServer: true,
  },
});
