import { describe, expect, it } from "vitest";

import { pageBlocks } from "../blocks";
import {
  atSectionLimit,
  catalogEntries,
  groupCounts,
  insertHeading,
  matchLine,
  noResultText,
  searchCatalog,
  stepIndex,
  templateOnlyText,
  type ClientBlockLike,
} from "./sectionCatalog";
import { menuActions } from "./sectionRows";

const entries = catalogEntries(pageBlocks as unknown as ClientBlockLike[]);

describe("section catalog", () => {
  it("counts groups from the real block registry", () => {
    expect(entries).toHaveLength(37);
    expect(
      Object.fromEntries(groupCounts(entries).map((g) => [g.group, g.count])),
    ).toEqual({
      Hero: 3,
      Content: 13,
      Records: 8,
      "Company sections": 3,
      "Current company": 2,
      Template: 8,
    });
  });

  it("searches names, technical names and Figma names", () => {
    expect(searchCatalog(entries, "media and", null)[0].entry.slug).toBe(
      "mediaText",
    );
    const figma = searchCatalog(entries, "why-choose-us", null);
    expect(figma[0].entry.slug).toBe("mediaText");
    expect(matchLine(figma[0])).toBe("Matches Figma section/why-choose-us");
    expect(searchCatalog(entries, "carousel", "Hero").length).toBeGreaterThan(
      0,
    );
  });

  it("suggests alternatives when nothing matches", () => {
    expect(searchCatalog(entries, "slider", null)).toEqual([]);
    expect(noResultText(entries, "slider")).toMatch(
      /^No section matches "slider"\. Try Hero carousel or Image carousel\.$/,
    );
  });

  it("marks template-only sections and words the insert point", () => {
    const job = entries.find((entry) => entry.slug === "jobDetail")!;
    expect(templateOnlyText(job)).toBe("Works on detail templates only · job");
    expect(insertHeading(2, ["a", "Hero carousel"])).toBe(
      "Inserting after 02 · Hero carousel",
    );
    expect(insertHeading(0, [])).toBe("Inserting at the top");
  });

  it("disables add and duplicate at 30 sections", () => {
    expect(atSectionLimit(30)).toBe(true);
    expect(atSectionLimit(29)).toBe(false);
    expect(
      menuActions(0, 30, 30).find((a) => a.id === "duplicate")?.disabled,
    ).toBe(true);
    expect(
      menuActions(0, 5, 30).find((a) => a.id === "duplicate")?.disabled,
    ).toBe(false);
  });

  it("steps through cards with the arrow keys", () => {
    expect(stepIndex("ArrowDown", 0, 3)).toBe(1);
    expect(stepIndex("ArrowUp", 0, 3)).toBe(0);
    expect(stepIndex("x", 0, 3)).toBeNull();
  });
});
