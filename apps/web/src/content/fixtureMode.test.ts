import { describe, expect, it } from "vitest";

import { fixtureModeEnabled } from "./fixtureMode";

describe("fixtureModeEnabled", () => {
  it("is on only for CONTENT_TRANSPORT=fixture", () => {
    expect(fixtureModeEnabled({ CONTENT_TRANSPORT: "fixture" })).toBe(true);
    expect(fixtureModeEnabled({ SITE_STAGE: "staging" })).toBe(false);
    expect(
      fixtureModeEnabled({
        CONTENT_TRANSPORT: "fixture",
        SITE_STAGE: "staging",
      }),
    ).toBe(true);
  });

  it("refuses fixture mode in production", () => {
    expect(() =>
      fixtureModeEnabled({
        CONTENT_TRANSPORT: "fixture",
        SITE_STAGE: "production",
      }),
    ).toThrow(/not allowed/);
  });
});
