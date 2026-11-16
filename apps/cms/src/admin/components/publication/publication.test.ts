import { describe, expect, it } from "vitest";

import { moveItem } from "../../recordPicker";
import { highlightsField } from "../../../blocks/highlights";
import { postListing } from "../../../blocks/postListing";
import { publicationHero } from "../../../blocks/publicationHero";
import {
  categoryTabsCount,
  existingPicks,
  publicationSettingsHref,
  tabAddedNote,
  tabMoveNote,
  tabRemovedNote,
  highlightsCount,
  insertAt,
  LIMIT_REACHED_NOTE,
  newestPostText,
  PUBLICATION_SET_NOTE,
  selectableCategories,
  tokenKindOf,
  tokenPieces,
  tokenProblem,
} from "./publication";

type Loose = {
  name?: string;
  admin?: { components?: Record<string, unknown> };
  fields?: Loose[];
};

const named = (fields: Loose[], name: string) =>
  fields.find((field) => field.name === name)!;

describe("publication strings", () => {
  it("keeps the verbatim design text", () => {
    expect(LIMIT_REACHED_NOTE).toBe(
      "Limit reached. The side list fits 5 posts; remove one to add another.",
    );
    expect(PUBLICATION_SET_NOTE).toBe(
      "Set in Company settings › Publication page. It can't be unpublished or trashed while it's set.",
    );
    expect(newestPostText(null)).toBe("Empty uses the newest post.");
    expect(newestPostText("Alum update")).toBe("Newest post: Alum update");
  });

  it("counts category tabs and highlights", () => {
    expect(categoryTabsCount(3, 6)).toBe("All + 3 of 6 categories");
    expect(categoryTabsCount(1, 1)).toBe("All + 1 of 1 category");
    expect(highlightsCount(2)).toBe("2 of 5");
  });

  it("offers only categories not yet picked", () => {
    const all = [{ id: 1 }, { id: 2 }, { id: 3 }];
    expect(selectableCategories(all, ["2"])).toEqual([{ id: 1 }, { id: 3 }]);
  });
});

describe("token chips", () => {
  it("picks the token set from the field path", () => {
    expect(tokenKindOf("layout.0.emptyState.title")).toBe("empty");
    expect(tokenKindOf("layout.0.resultsLabel")).toBe("results");
  });

  it("flags unknown tokens with the PS-08 message", () => {
    expect(tokenProblem("{count} for {query}", "results")).toBeUndefined();
    expect(tokenProblem("{total}", "results")).toBe(
      "{total} isn't a placeholder. Use {count} or {query}.",
    );
    expect(tokenProblem("{count}", "empty")).toBe(
      "Only {query} works in this title.",
    );
  });

  it("splits text into chips and marks bad ones", () => {
    expect(tokenPieces("a {count} b {nope}", "results")).toEqual([
      { text: "a ", chip: false, bad: false },
      { text: "count", chip: true, bad: false },
      { text: " b ", chip: false, bad: false },
      { text: "nope", chip: true, bad: true },
    ]);
  });

  it("inserts at the caret and swallows a typed brace", () => {
    expect(insertAt("ab", 1, "count", false)).toEqual({
      text: "a{count}b",
      caret: 8,
    });
    expect(insertAt("a{b", 2, "query", true)).toEqual({
      text: "a{query}b",
      caret: 8,
    });
  });
});

describe("block wiring", () => {
  it("gives the hero a category tabs editor", () => {
    const field = named(publicationHero.fields as Loose[], "categories");
    expect(String(JSON.stringify(field.admin?.components))).toContain(
      "CategoryTabsField",
    );
  });

  it("puts chips on the results line and no-results title only", () => {
    const fields = postListing.fields as Loose[];
    const results = named(fields, "resultsLabel");
    const empty = named(named(fields, "emptyState").fields!, "title");
    const description = named(
      named(fields, "emptyState").fields!,
      "description",
    );
    expect(JSON.stringify(results.admin?.components)).toContain("TokenChips");
    expect(JSON.stringify(empty.admin?.components)).toContain("TokenChips");
    expect(JSON.stringify(description.admin?.components ?? {})).not.toContain(
      "TokenChips",
    );
  });

  it("limits highlights to 5 on the server and shows the limit note", () => {
    const group = highlightsField("x") as Loose & { fields: Loose[] };
    const items = named(group.fields, "items") as Loose & {
      maxRows?: number;
      validate?: unknown;
    };
    expect(items.maxRows).toBe(5);
    expect(items.validate).toBeTypeOf("function");
    expect(JSON.stringify(items.admin?.components)).toContain("Limit reached");
  });
});

describe("settings link and category tab helpers", () => {
  it("links to the general tab of the company's settings", () => {
    expect(publicationSettingsHref("7")).toBe(
      "/admin/collections/tenant-settings/7?tab=general",
    );
    expect(publicationSettingsHref(null)).toBe(
      "/admin/collections/tenant-settings",
    );
  });

  it("counts only categories that exist", () => {
    expect(existingPicks(["1", "9", "2"], [{ id: 1 }, { id: 2 }])).toEqual([
      "1",
      "2",
    ]);
  });

  it("moves and removes tabs and words each change", () => {
    expect(moveItem(["a", "b", "c"], 0, 1)).toEqual(["b", "a", "c"]);
    expect(moveItem(["a", "b"], 0, 5)).toEqual(["a", "b"]);
    expect(tabMoveNote("Alum", 0, 3)).toBe("Alum moved to tab 2 of 4");
    expect(tabAddedNote("Alum", 3)).toBe("Alum added as tab 4 of 4");
    expect(tabRemovedNote("Alum")).toBe("Alum removed from the tabs");
  });
});
