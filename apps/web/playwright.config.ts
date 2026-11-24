import { defineConfig, devices } from "@playwright/test";

const PORT = 3101;

export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["list"]] : "list",
  use: { baseURL: `http://localhost:${PORT}` },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: `pnpm exec next start --port ${PORT}`,
    port: PORT,
    reuseExistingServer: false,
    timeout: 60_000,
    env: {
      RUNTIME_CONFIG_SOURCE: "env",
      CMS_URL: "http://fixture.invalid",
      CONTENT_TRANSPORT: "fixture",
      SITE_STAGE: "staging",
      REVALIDATE_SECRET: "e2e-only-not-a-secret",
    },
  },
});
