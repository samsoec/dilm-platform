import { describe, expect, it } from "vitest";

import { fieldDiffs, sectionsSummary } from "./sectionCompare";

const nameOf = (slug?: string) =>
  slug === "mediaText" ? "Media and text" : "Hero";

const hero = { id: "a", blockType: "hero", title: { en: "Hi", id: "Halo" } };
const media = {
  id: "b",
  blockType: "mediaText",
  heading: { title: { en: "Old", id: "Lama" } },
};

describe("sections summary and field diffs (PB-06)", () => {
  it("reports added, removed and moved sections by block id", () => {
    const extra = { id: "c", blockType: "hero" };
    const summary = sectionsSummary(
      { layout: [hero, media, extra] },
      { layout: [media, hero, { id: "d", blockType: "hero" }] },
      nameOf,
    );
    expect(summary.added).toEqual(["Added 03 HERO"]);
    expect(summary.removed).toEqual(["Removed 03 HERO (was 03)"]);
    expect(summary.moved).toEqual([
      "Moved 01 MEDIA AND TEXT from 02 to 01",
      "Moved 02 HERO from 01 to 02",
    ]);
  });

  it("labels field diffs by section and locale", () => {
    const changed = {
      ...media,
      heading: { title: { en: "New", id: "Lama" } },
    };
    expect(
      fieldDiffs(
        { layout: [hero, media] },
        { layout: [hero, changed] },
        nameOf,
        ["en", "id"],
      ),
    ).toEqual([
      {
        label: "02 MEDIA AND TEXT › HEADING › TITLE (EN)",
        before: "Old",
        after: "New",
      },
    ]);
  });
});
