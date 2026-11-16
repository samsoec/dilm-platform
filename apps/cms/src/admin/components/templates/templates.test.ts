import { describe, expect, it } from "vitest";

import { sectionNotes } from "../../sectionStates";
import {
  badToken,
  categoryDrawsNote,
  chunksOf,
  highlightsCountText,
  insertToken,
  isTokenField,
  publishingChangesText,
  recordCountText,
  stripReach,
  STRIP_ORDER,
} from "./templates";

describe("template strip", () => {
  it("lists the five templates with their reach", () => {
    expect(STRIP_ORDER.map((type) => [type, stripReach(type)])).toEqual([
      ["product", "All 3 sites"],
      ["solution", "All 3 sites"],
      ["job", "This site"],
      ["post", "This site"],
      ["category", "This site"],
    ]);
  });

  it("words record counts", () => {
    expect(recordCountText(1)).toBe("1 record");
    expect(recordCountText(12)).toBe("12 records");
    expect(recordCountText(null)).toBe("Pick a company");
  });
});

describe("right column", () => {
  it("says what a publish changes", () => {
    expect(publishingChangesText(24, ["a.com", "b.com", "c.com"])).toBe(
      "Publishing changes 24 pages on a.com, b.com and c.com",
    );
    expect(publishingChangesText(1, ["a.com"])).toBe(
      "Publishing changes 1 page on a.com",
    );
  });

  it("names the category pages it draws", () => {
    expect(categoryDrawsNote(["/category/a", "/b", "/c"])).toBe(
      "Draws /category/a, /b and /c. Their SEO uses the category's name, description and cover.",
    );
  });
});

describe("placeholders", () => {
  it("shows {title} as a chip", () => {
    expect(chunksOf("About {title} now")).toEqual([
      { text: "About ", chip: false },
      { text: "title", chip: true },
      { text: " now", chip: false },
    ]);
  });

  it("flags unknown tokens with the TP-02 wording", () => {
    expect(badToken("Hello {name}")).toBe(
      "{name} isn't a placeholder. Use {title}.",
    );
    expect(badToken("Hello {title}")).toBeUndefined();
  });

  it("replaces a typed brace when inserting", () => {
    expect(insertToken("Hi {", 4, true)).toEqual({
      text: "Hi {title}",
      caret: 10,
    });
    expect(insertToken("Hi ", 3, false).text).toBe("Hi {title}");
  });

  it("skips fields with their own token rules", () => {
    expect(isTokenField("field-layout__0__heading__title")).toBe(true);
    expect(isTokenField("field-layout__2__resultsLabel")).toBe(false);
    expect(isTokenField("field-layout__2__emptyState__title")).toBe(false);
    expect(isTokenField("field-title")).toBe(false);
  });
});

describe("section notes in templates", () => {
  it("adds the post article notes", () => {
    const notes = sectionNotes("postArticle", "Template", {
      recordType: "post",
      highlights: [1, 2],
    }).map(({ text }) => text);
    expect(notes[0]).toContain(
      "2 of 5 · same on every post page. The post being read is left out of its own list.",
    );
    expect(notes[1]).toContain("Previous and Next");
    expect(highlightsCountText(undefined)).toBe(
      "0 of 5 · same on every post page",
    );
  });

  it("adds the category notes only on the category template", () => {
    expect(
      sectionNotes("publicationHero", "Hero", { recordType: "category" }),
    ).toHaveLength(1);
    expect(
      sectionNotes("publicationHero", "Hero", { recordType: "post" }),
    ).toHaveLength(0);
    expect(
      sectionNotes("postListing", "Records", { recordType: "category" }),
    ).toHaveLength(1);
  });
});
