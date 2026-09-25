import { describe, expect, it } from "vitest";

import { localization } from "./localization";

describe("localization", () => {
  it("serves English and Indonesian, English by default", () => {
    expect(localization).toEqual({
      locales: ["en", "id"],
      defaultLocale: "en",
    });
  });
});
