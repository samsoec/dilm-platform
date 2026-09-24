import { expect, it } from "vitest";

// TODO(DILM-13): replace with real tests once the Payload app lands.
it("loads the app entry point", async () => {
  await expect(import("./index.js")).resolves.toBeDefined();
});
