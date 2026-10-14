import { describe, expect, it } from "vitest";

import { ICON_NAMES } from "./icons";

describe("ICON_NAMES", () => {
  it("is sorted and unique, as Google's icon_names subset parameter requires", () => {
    expect([...ICON_NAMES]).toEqual([...new Set(ICON_NAMES)].sort());
  });
});
