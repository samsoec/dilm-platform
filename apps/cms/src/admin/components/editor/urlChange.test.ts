import { describe, expect, it } from "vitest";

import {
  categoryChangeSummary,
  categoryMoves,
  displayUrl,
  impactBody,
  isImpactReply,
  linksSummary,
  liveOnNote,
  pathImpactPath,
  sameValues,
  urlChangeKind,
  valuesKey,
  type PathImpactReply,
} from "./urlChange";

const reply = (over: Partial<PathImpactReply> = {}): PathImpactReply => ({
  ok: true,
  published: true,
  urls: [
    { locale: "en", from: "/about-us", to: "/about" },
    { locale: "id", from: "/tentang-kami", to: "/tentang" },
  ],
  childPages: 4,
  records: 0,
  redirects: 10,
  overLimit: false,
  linkCount: 0,
  links: [],
  ...over,
});

describe("urlChangeKind", () => {
  it("reviews a live page whose address moves", () => {
    expect(urlChangeKind(reply())).toBe("review");
  });

  it("asks nothing of a page that isn't live (PG-06)", () => {
    expect(urlChangeKind(reply({ published: false }))).toBe("none");
  });

  it("asks nothing when no address moves", () => {
    expect(
      urlChangeKind(reply({ urls: [{ locale: "en", from: "/a", to: "/a" }] })),
    ).toBe("none");
  });

  it("refuses over the limit (PG-05) but not for a page that isn't live", () => {
    expect(urlChangeKind(reply({ overLimit: true }))).toBe("refusal");
    expect(urlChangeKind(reply({ overLimit: true, published: false }))).toBe(
      "none",
    );
  });
});

describe("request helpers", () => {
  it("builds the endpoint path and body", () => {
    expect(pathImpactPath("/api", 12)).toBe("/api/pages/12/path-impact");
    expect(impactBody("id", { slug: "tentang", parent: null })).toEqual({
      slugs: { id: "tentang" },
      parent: null,
    });
  });

  it("compares values", () => {
    const a = { slug: "x", parent: "1" };
    expect(sameValues(a, { slug: "x", parent: "1" })).toBe(true);
    expect(sameValues(a, { slug: "x", parent: null })).toBe(false);
    expect(valuesKey(a)).not.toBe(valuesKey({ slug: "x", parent: null }));
  });

  it("validates the reply shape", () => {
    expect(isImpactReply(reply())).toBe(true);
    expect(isImpactReply({ ok: true })).toBe(false);
    expect(isImpactReply(null)).toBe(false);
    expect(isImpactReply({ ...reply(), urls: "x" })).toBe(false);
  });
});

describe("texts", () => {
  it("uses the PG-04 sentence with the real domain", () => {
    expect(liveOnNote("https://duniakimia.com/")).toBe(
      "It's live on duniakimia.com. Nothing breaks: old URLs forward to the new ones.",
    );
  });

  it("shows addresses with the language", () => {
    expect(displayUrl("duniakimia.com", "en", "/about")).toBe(
      "duniakimia.com/en/about",
    );
    expect(displayUrl("duniakimia.com", "id", "/")).toBe("duniakimia.com/id");
  });

  it("summarises the links", () => {
    expect(linksSummary(reply())).toBe("No other page links here.");
    expect(linksSummary(reply({ linkCount: 1 }))).toBe(
      "1 page or record that links here will follow the new address.",
    );
  });
});

describe("categoryMoves (PS-02)", () => {
  const base = {
    domain: "duniakimia.com",
    locales: ["en", "id"],
    fallbackLocale: "en",
    live: true,
    slugs: { en: "new-plant", id: "pabrik-baru" },
    current: {
      en: "/category/news/new-plant",
      id: "/kategori/berita/pabrik-baru",
    },
    category: { en: "/category/csr", id: "/kategori/csr" },
  };

  it("moves the post under the new category in both languages", () => {
    const moves = categoryMoves(base);
    expect(moves).toEqual([
      {
        locale: "en",
        from: "duniakimia.com/en/category/news/new-plant",
        to: "duniakimia.com/en/category/csr/new-plant",
      },
      {
        locale: "id",
        from: "duniakimia.com/id/kategori/berita/pabrik-baru",
        to: "duniakimia.com/id/kategori/csr/pabrik-baru",
      },
    ]);
    expect(categoryChangeSummary(moves)).toBe(
      "Changing the category moves the post. A redirect from the old address is created in English and Indonesian when the post is next published.",
    );
  });

  it("falls back to the English slug and category path", () => {
    const moves = categoryMoves({
      ...base,
      slugs: { en: "new-plant" },
      category: { en: "/category/csr" },
    });
    expect(moves[1].to).toBe("duniakimia.com/id/category/csr/new-plant");
  });

  it("says nothing for a post that isn't live", () => {
    expect(categoryMoves({ ...base, live: false })).toEqual([]);
  });

  it("says nothing when the address stays", () => {
    expect(
      categoryMoves({
        ...base,
        category: { en: "/category/news", id: "/kategori/berita" },
      }),
    ).toEqual([]);
  });

  it("skips a language with no stored address", () => {
    expect(categoryMoves({ ...base, current: {} })).toEqual([]);
    expect(categoryChangeSummary([])).toBe("");
  });
});
