import { expect, it } from "vitest";

// TODO(DILM-12): replace with real tests once the cached secret loader lands.
it("loads the package entry point", async () => {
  await expect(import("./index.js")).resolves.toBeDefined();
});
