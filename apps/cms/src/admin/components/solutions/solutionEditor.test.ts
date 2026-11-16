import { describe, expect, it } from "vitest";

import {
  addSupporting,
  canAddTag,
  featuredNote,
  idList,
  isShownFeatured,
  moveSupporting,
  offered,
  productSearchQuery,
  productsByIdQuery,
  removeSupporting,
  shownFeatured,
  SUPPORTING_HINT,
  toggleFeatured,
} from "./solutionEditor";

const state = { ids: [4, 7, 9], featured: 7 };

describe("supporting products (SL-01)", () => {
  it("keeps the verbatim hint", () => {
    expect(SUPPORTING_HINT).toBe(
      "Pick from every company's published products. The star marks the featured card; it must be one of these. Removing the featured product clears it, and the first product is used.",
    );
  });

  it("reads ids from ids or populated documents", () => {
    expect(idList([1, { id: 2 }, "3", null])).toEqual([1, 2, "3"]);
    expect(idList(undefined)).toEqual([]);
  });

  it("removing the featured product clears it and the first is used", () => {
    const next = removeSupporting(state, 7);
    expect(next).toEqual({ ids: [4, 9], featured: null });
    expect(shownFeatured(next)).toBe(4);
    expect(isShownFeatured(next, 4)).toBe(true);
  });

  it("removing another product keeps the featured one", () => {
    expect(removeSupporting(state, 9).featured).toBe(7);
  });

  it("stars only members and toggles off", () => {
    expect(toggleFeatured(state, 99)).toBe(state);
    expect(toggleFeatured(state, 9).featured).toBe(9);
    expect(toggleFeatured(state, 7).featured).toBeNull();
  });

  it("uses the first product when none is starred", () => {
    expect(shownFeatured({ ids: [3, 2], featured: null })).toBe(3);
    expect(shownFeatured({ ids: [], featured: null })).toBeNull();
    expect(shownFeatured({ ids: [3], featured: 8 })).toBe(3);
  });

  it("adds without duplicates ", () => {
    expect(addSupporting(state, 4)).toBe(state);
    expect(addSupporting(state, 5).ids).toEqual([4, 7, 9, 5]);
  });

  it("moves rows and ignores out-of-range moves", () => {
    expect(moveSupporting(state, 0, 1).ids).toEqual([7, 4, 9]);
    expect(moveSupporting(state, 0, 3)).toBe(state);
  });

  it("explains who is featured", () => {
    const names = new Map([
      ["4", "Soda ash"],
      ["7", "Citric acid"],
    ]);
    expect(featuredNote(state, names)).toBe("Citric acid is featured.");
    expect(featuredNote({ ids: [4], featured: null }, names)).toContain(
      "Soda ash is featured because it is first",
    );
    expect(featuredNote({ ids: [], featured: null }, names)).toBe(
      "No product is featured yet.",
    );
  });

  it("offers published products not yet picked", () => {
    const found = [{ id: 4 }, { id: 5 }];
    expect(offered(found, state)).toEqual([{ id: 5 }]);
  });

  it("queries only published products, by name", () => {
    const query = new URLSearchParams(productSearchQuery(" acid ", "id"));
    expect(query.get("where[_status][equals]")).toBe("published");
    expect(query.get("where[name][like]")).toBe("acid");
    expect(query.get("locale")).toBe("id");
    expect(
      new URLSearchParams(productSearchQuery("", "en")).has(
        "where[name][like]",
      ),
    ).toBe(false);
    expect(
      new URLSearchParams(productsByIdQuery([1, 2], "en")).get(
        "where[id][in][1]",
      ),
    ).toBe("2");
  });
});

describe("tag lists", () => {
  it("rejects blanks, duplicates in any case and a full list", () => {
    expect(canAddTag("  ", [], 3)).toBe(false);
    expect(canAddTag("Dyeing", ["dyeing"], 3)).toBe(false);
    expect(canAddTag("Dyeing", ["a", "b", "c"], 3)).toBe(false);
    expect(canAddTag("Dyeing", ["a"], 3)).toBe(true);
  });
});
