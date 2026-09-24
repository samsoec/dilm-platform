import { expect, it } from "vitest";

// TODO(DILM-24): replace with real tests once the Next.js app lands.
it("loads the app entry point", async () => {
  await expect(import("./index.js")).resolves.toBeDefined();
});
