import { describe, expect, it } from "vitest";

import {
  atLimit,
  footerText,
  moveItem,
  overrideNote,
  pickerQuery,
  postsOnPage,
  showCompanyChips,
  toPickRow,
} from "./recordPicker";

const post = {
  id: 7,
  _status: "published",
  title: "Zero waste",
  excerpt: "Less waste",
  publishedAt: "2026-03-04T00:00:00.000Z",
  primaryCategory: { id: 1, name: "News" },
  tenant: { id: 2, name: "Likute", domain: "likutelaga.com" },
  coverImage: 3,
  path: "/news/zero-waste",
};

describe("record picker", () => {
  it("hides company chips on company pages", () => {
    expect(showCompanyChips("posts", undefined)).toBe(true);
    expect(showCompanyChips("posts", "2")).toBe(false);
    expect(showCompanyChips("products", undefined)).toBe(false);
  });

  it("builds a server-side, paged, scoped query", () => {
    const query = new URLSearchParams(
      pickerQuery({
        collection: "posts",
        term: " zero ",
        pageTenant: "2",
        company: "3",
        page: 2,
        locale: "en",
      }),
    );
    expect(query.get("page")).toBe("2");
    expect(query.get("where[title][like]")).toBe("zero");
    expect(query.get("where[tenant][equals]")).toBe("2");
    expect(query.getAll("where[tenant][equals]")).toEqual(["2"]);
    const shared = new URLSearchParams(
      pickerQuery({
        collection: "posts",
        term: "",
        pageTenant: undefined,
        company: "3",
        page: 1,
        locale: "en",
      }),
    );
    expect(shared.get("where[tenant][equals]")).toBe("3");
  });

  it("disables drafts and flags other companies", () => {
    const draft = toPickRow("posts", { ...post, _status: "draft" });
    expect(draft.selectable).toBe(false);
    const row = toPickRow("posts", post, "indonesianacids.com");
    expect(row.otherSite).toBe(true);
    expect(row.meta).toBe("News · 4 Mar 2026");
    expect(row.reach.scope).toBe("tenant");
    expect(toPickRow("products", { id: 1, name: "A" }).reach.scope).toBe("all");
  });

  it("counts the footer and the limit", () => {
    expect(footerText(2, 3, 6)).toBe("2 selected · 5 of 6 used");
    expect(atLimit(3, 3, 6)).toBe(true);
    expect(atLimit(1, 3, 6)).toBe(false);
  });

  it("reorders", () => {
    expect(moveItem(["a", "b", "c"], 0, 2)).toEqual(["b", "c", "a"]);
    expect(moveItem(["a", "b"], 1, 5)).toEqual(["a", "b"]);
  });

  it("shows the post's own value when an override is empty", () => {
    expect(overrideNote("title", "", post)).toEqual({
      text: "Zero waste",
      inherited: true,
    });
    expect(overrideNote("eyebrow", "Hi", post).inherited).toBe(false);
    expect(overrideNote("description", "", { id: 1 }).text).toBe(
      "Empty · uses the post's excerpt",
    );
  });

  it("lists hand-picked post sections with their numbers", () => {
    const sections = postsOnPage([
      { blockType: "hero" },
      { blockType: "postShowcase", source: "manual", items: [1, 2] },
      { blockType: "postShowcase", source: "latest", items: [] },
    ]);
    expect(sections).toEqual([{ number: 2, title: "Post cards", count: 2 }]);
  });
});
