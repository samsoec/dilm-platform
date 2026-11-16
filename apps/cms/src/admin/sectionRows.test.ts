import { describe, expect, it } from "vitest";

import {
  clampMove,
  itemCount,
  pickedUpText,
  positionText,
  removeCopy,
  sectionCountText,
  sectionSummary,
  variantText,
} from "./sectionRows";

describe("section rows", () => {
  it("numbers positions from 01", () => {
    expect(positionText(0)).toBe("01");
    expect(positionText(11)).toBe("12");
  });

  it("counts sections against the limit", () => {
    expect(sectionCountText(7, 30)).toBe("7 of 30 sections");
  });

  it("summarises by heading, then by item count, then by record", () => {
    expect(
      sectionSummary(
        { heading: { eyebrow: "Since 1990", title: "Our story" } },
        false,
      ),
    ).toBe("Since 1990 · Our story");
    expect(sectionSummary({ banner: { title: "Milestones" } }, false)).toBe(
      "Milestones",
    );
    expect(sectionSummary({ products: [{}, {}, {}] }, true)).toBe("3 products");
    expect(sectionSummary({ cards: [{}] }, false)).toBe("1 card");
    expect(sectionSummary({}, true)).toBe("Filled from the record");
    expect(sectionSummary({}, false)).toBe("");
  });

  it("humanises the variant", () => {
    expect(variantText("logos")).toBe("Logos");
    expect(variantText("imageCard")).toBe("Image card");
    expect(variantText(undefined)).toBe("");
  });

  it("names the item count and both languages when removing", () => {
    expect(itemCount({ entries: [{}, {}], cards: [{}] })).toBe(3);
    const copy = removeCopy("Timeline", { entries: new Array(8).fill({}) });
    expect(copy.body).toBe(
      "Its 8 items and their text in English and Indonesian go with it. You can get it back from Versions until you publish.",
    );
  });

  it("stops moves at the ends", () => {
    expect(clampMove(0, -1, 7)).toBe(0);
    expect(clampMove(6, 1, 7)).toBe(6);
    expect(clampMove(3, 1, 7)).toBe(4);
  });

  it("announces a pick-up as the design says", () => {
    expect(pickedUpText("Timeline", 3, 7)).toBe(
      "Timeline, picked up. Position 4 of 7. Arrow keys to move, Space to drop, Escape to cancel.",
    );
  });
});
