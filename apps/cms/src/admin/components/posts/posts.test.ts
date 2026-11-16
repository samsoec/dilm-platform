import { describe, expect, it } from "vitest";

import {
  categoryCounts,
  EXCERPT_LIMIT,
  parsePostsQuery,
  placementsFor,
  postsHref,
  postsWhere,
  PUBLICATION_PROMPT,
  type LatestSection,
} from "./posts";

describe("parsePostsQuery", () => {
  it("reads category and search and trims them", () => {
    expect(parsePostsQuery({ category: "3", q: "  fuel " })).toEqual({
      category: "3",
      search: "fuel",
    });
  });

  it("caps long search text", () => {
    expect(parsePostsQuery({ q: "x".repeat(300) }).search).toHaveLength(100);
  });
});

describe("postsHref", () => {
  it("keeps only the filters that are set", () => {
    expect(postsHref("/p", { category: "2", search: "" })).toBe(
      "/p?category=2",
    );
    expect(postsHref("/p", {})).toBe("/p");
  });
});

describe("postsWhere", () => {
  it("puts company, search and category in the query", () => {
    expect(postsWhere({ category: "2", search: "gas" }, { tenant: 5 })).toEqual(
      {
        and: [
          { tenant: { equals: 5 } },
          { title: { like: "gas" } },
          { primaryCategory: { equals: "2" } },
        ],
      },
    );
  });

  it("leaves the category out for the chip counts", () => {
    expect(
      postsWhere(
        { category: "2", search: "" },
        { tenant: 5, skipCategory: true },
      ),
    ).toEqual({ and: [{ tenant: { equals: 5 } }] });
  });
});

describe("categoryCounts", () => {
  it("counts posts per category and skips posts without one", () => {
    expect(
      categoryCounts([{ category: "1" }, { category: "1" }, { category: "" }]),
    ).toEqual({ 1: 2 });
  });
});

describe("copy", () => {
  it("keeps the design wording", () => {
    expect(EXCERPT_LIMIT).toBe(160);
    expect(PUBLICATION_PROMPT).toBe(
      'Choose your Publication page. Until it\'s set, the navbar search icon, the "All Updates" tab and post breadcrumbs have nowhere to go.',
    );
  });
});

describe("placementsFor", () => {
  const sections: LatestSection[] = [
    {
      key: "a",
      page: "Home",
      section: "News",
      categories: [],
      sites: ["A", "B", "C"],
    },
    {
      key: "b",
      page: "Sustainability",
      section: "Stories",
      categories: ["9"],
      sites: [],
    },
  ];

  it("lists the tabs and the sections that pick the latest posts", () => {
    const rows = placementsFor({
      category: "2",
      categoryName: "Events",
      sections,
      publicationSet: true,
    });
    expect(rows.map(({ text }) => text)).toEqual([
      "Publication › All Updates",
      "Publication › Events tab",
      "Home › News",
    ]);
    expect(rows[2]?.note).toBe("on A, B and C");
  });

  it("includes a section limited to the post's category", () => {
    const rows = placementsFor({
      category: "9",
      categoryName: "Sustainability",
      sections,
      publicationSet: true,
    });
    expect(rows.map(({ key }) => key)).toContain("b");
  });

  it("says the Publication page is missing", () => {
    const [all] = placementsFor({
      category: undefined,
      categoryName: undefined,
      sections: [],
      publicationSet: false,
    });
    expect(all?.note).toBe("Set a Publication page first");
  });
});
