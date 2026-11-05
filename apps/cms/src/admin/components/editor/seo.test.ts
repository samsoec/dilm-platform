import { describe, expect, it } from "vitest";

import {
  NO_SEO_DEFAULTS,
  searchSnippet,
  seoView,
  type SeoDefaults,
} from "./seo";

const context = { locale: "en", defaultLocale: "en", pageTitle: "Overview" };

const defaults: SeoDefaults = {
  title: { en: "Dunia Kimia Utama", id: "Dunia Kimia Utama ID" },
  description: {
    en: "Aluminium and silicate chemicals.",
    id: "Bahan kimia aluminium.",
  },
  image: { id: 5, filename: "dku-share.jpg" },
};

describe("seoView (PG-09)", () => {
  it("counts the search title against the 60-character limit", () => {
    const view = seoView(
      { title: "About Dunia Kimia Utama · Overview" },
      defaults,
      context,
    );
    expect(view.title).toMatchObject({
      length: 34,
      limit: 60,
      over: false,
      usingDefault: false,
    });
    const long = seoView({ title: "x".repeat(61) }, defaults, context);
    expect(long.title.over).toBe(true);
    expect(long.issues[0]).toContain("over 60 characters");
  });

  it("falls back to the company default when a field is empty", () => {
    const view = seoView({ title: "", description: "  " }, defaults, context);
    expect(view.description).toMatchObject({
      usingDefault: true,
      shown: "Aluminium and silicate chemicals.",
    });
    expect(view.title.shown).toBe("Dunia Kimia Utama");
    expect(view.image).toEqual({
      chosen: false,
      usingDefault: true,
      defaultName: "dku-share.jpg",
    });
  });

  it("uses the default of the language being edited", () => {
    const view = seoView({}, defaults, { ...context, locale: "id" });
    expect(view.description.shown).toBe("Bahan kimia aluminium.");
  });

  it("falls back to English, then to the page title, for the search title", () => {
    expect(
      seoView(
        {},
        { ...defaults, description: { en: "English only" } },
        {
          ...context,
          locale: "id",
        },
      ).description.shown,
    ).toBe("English only");
    expect(seoView({}, NO_SEO_DEFAULTS, context).title.shown).toBe("Overview");
  });

  it("stops using the default as soon as the editor types", () => {
    const view = seoView({ description: "Own words" }, defaults, context);
    expect(view.description).toMatchObject({
      usingDefault: false,
      shown: "Own words",
    });
  });

  it("flags issues only when nothing covers the gap", () => {
    expect(seoView({}, defaults, context).issues).toEqual([]);
    const bare = seoView({}, NO_SEO_DEFAULTS, context).issues;
    expect(bare).toHaveLength(2);
    expect(bare.join(" ")).toContain("No description");
    expect(bare.join(" ")).toContain("No share image");
    expect(
      seoView({ image: { id: 9 }, description: "x" }, NO_SEO_DEFAULTS, context)
        .issues,
    ).toEqual([]);
    expect(
      seoView({ image: 9, description: "x" }, NO_SEO_DEFAULTS, context).image
        .chosen,
    ).toBe(true);
  });

  it("flags an over-long description", () => {
    expect(
      seoView({ description: "y".repeat(161) }, defaults, context).issues[0],
    ).toContain("over 160");
  });
});

describe("searchSnippet", () => {
  it("breaks the computed address into a trail", () => {
    expect(
      searchSnippet({
        domain: "duniakimia.com",
        path: "/about-us/overview",
        locale: "en",
        title: "T",
        description: "D",
      }).trail,
    ).toEqual(["duniakimia.com", "en", "about-us", "overview"]);
    expect(
      searchSnippet({
        domain: "duniakimia.com",
        path: "/",
        locale: "id",
        title: "T",
        description: "D",
      }).trail,
    ).toEqual(["duniakimia.com", "id"]);
  });
});
