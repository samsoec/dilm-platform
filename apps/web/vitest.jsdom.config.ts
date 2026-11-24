import path from "node:path";

import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "server-only": path.resolve(import.meta.dirname, "vitest.server-only.ts"),
    },
  },
  test: {
    name: "@dilm/web (jsdom)",
    environment: "jsdom",
    include: ["src/**/*.test.tsx"],
  },
});
