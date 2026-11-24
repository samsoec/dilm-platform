import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    projects: [
      "apps/cms",
      "apps/web/vitest.*.config.ts",
      "packages/*",
      "infra",
    ],
  },
});
