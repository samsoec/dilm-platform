import { describe, expect, it } from "vitest";

import { computePath } from "../../../pathCompute";
import {
  bareDomain,
  computeUrls,
  mergeSlugs,
  parentLookupPath,
  pathsOf,
  relationId,
  slugFallbackWarning,
  slugsOf,
} from "./urls";

const locales = ["en", "id"];
const base = { domain: "duniakimia.com", locales, defaultLocale: "en" };

describe("computeUrls (PR-WC-04)", () => {
  it("builds both URLs from the parent path and each language's slug", () => {
    const rows = computeUrls({
      ...base,
      slugs: { en: "overview", id: "ikhtisar" },
      parentPaths: { en: "/about-us", id: "/tentang-kami" },
    });
    expect(rows.map(({ display }) => display)).toEqual([
      "duniakimia.com/en/about-us/overview",
      "duniakimia.com/id/tentang-kami/ikhtisar",
    ]);
    expect(rows[0].href).toBe("https://duniakimia.com/en/about-us/overview");
    expect(rows.every(({ fellBack }) => !fellBack)).toBe(true);
  });

  it("agrees with the path logic the save hook uses", () => {
    const [en, id] = computeUrls({
      ...base,
      slugs: { en: "overview", id: "ikhtisar" },
      parentPaths: { en: "/about-us", id: "/tentang-kami" },
    });
    expect(en.path).toBe(computePath("/about-us", "overview"));
    expect(id.path).toBe(computePath("/tentang-kami", "ikhtisar"));
  });

  it("uses the English slug and parent path when Indonesian has none", () => {
    const rows = computeUrls({
      ...base,
      slugs: { en: "overview", id: "" },
      parentPaths: { en: "/about-us" },
    });
    expect(rows[1]).toMatchObject({
      path: "/about-us/overview",
      fellBack: true,
      display: "duniakimia.com/id/about-us/overview",
    });
  });

  it("recomputes live as the slug and the parent change", () => {
    const first = computeUrls({
      ...base,
      slugs: { en: "overview", id: "overview" },
      parentPaths: { en: "/about-us", id: "/about-us" },
    });
    const typed = computeUrls({
      ...base,
      slugs: mergeSlugs(
        { en: "overview", id: "overview" },
        {
          locale: "en",
          slug: "who-we-are",
        },
      ),
      parentPaths: { en: "/about-us", id: "/about-us" },
    });
    const moved = computeUrls({
      ...base,
      slugs: { en: "who-we-are", id: "overview" },
      parentPaths: { en: "/company", id: "/perusahaan" },
    });
    expect(first[0].path).toBe("/about-us/overview");
    expect(typed.map(({ path }) => path)).toEqual([
      "/about-us/who-we-are",
      "/about-us/overview",
    ]);
    expect(moved.map(({ path }) => path)).toEqual([
      "/company/who-we-are",
      "/perusahaan/overview",
    ]);
  });

  it("puts a top-level page directly under the language", () => {
    const rows = computeUrls({
      ...base,
      slugs: { en: "career", id: "karier" },
      parentPaths: null,
    });
    expect(rows.map(({ path }) => path)).toEqual(["/career", "/karier"]);
  });

  it("ignores a stale parent when the page has none", () => {
    const rows = computeUrls({
      ...base,
      slugs: { en: "career" },
      parentPaths: { en: "/about-us" },
      parent: false,
    });
    expect(rows[0].path).toBe("/career");
  });

  it("shows an unfinished address while the slug is empty", () => {
    const [en] = computeUrls({
      ...base,
      slugs: { en: "" },
      parentPaths: { en: "/about-us" },
    });
    expect(en).toMatchObject({
      incomplete: true,
      display: "duniakimia.com/en/about-us/",
    });
    expect(
      computeUrls({ ...base, slugs: {}, parentPaths: null })[0].display,
    ).toBe("duniakimia.com/en");
  });

  it("works without a company domain", () => {
    expect(
      computeUrls({
        locales,
        defaultLocale: "en",
        slugs: { en: "a", id: "b" },
      })[1].href,
    ).toBe("/id/b");
  });
});

describe("slug helpers", () => {
  it("strips scheme and trailing slash from the domain", () => {
    expect(bareDomain(" https://duniakimia.com/ ")).toBe("duniakimia.com");
    expect(bareDomain(undefined)).toBe("");
  });

  it("warns once when the Indonesian slug is missing (FR-PM-09)", () => {
    const warning = slugFallbackWarning(
      { en: "overview", id: "" },
      locales,
      "en",
      { en: "English", id: "Indonesian" },
    );
    expect(warning?.message).toBe(
      "No Indonesian slug yet. The ID address uses the English slug (overview).",
    );
    expect(
      slugFallbackWarning({ en: "overview", id: "ikhtisar" }, locales, "en"),
    ).toBeUndefined();
    expect(slugFallbackWarning({ en: "", id: "" }, locales, "en")).toBe(
      undefined,
    );
  });

  it("reads relation values in every shape the form produces", () => {
    expect(relationId(14)).toBe("14");
    expect(relationId("14")).toBe("14");
    expect(relationId({ id: 14 })).toBe("14");
    expect(relationId({ relationTo: "pages", value: 14 })).toBe("14");
    expect(relationId({ relationTo: "pages", value: { id: 14 } })).toBe("14");
    expect(relationId(null)).toBeUndefined();
    expect(relationId("")).toBeUndefined();
  });

  it("reads localized maps and plain strings from documents", () => {
    expect(pathsOf({ path: { en: "/a", id: "/b" } })).toEqual({
      en: "/a",
      id: "/b",
    });
    expect(pathsOf({ path: "/a" })).toEqual({ en: "/a" });
    expect(pathsOf(undefined)).toEqual({});
    expect(slugsOf({ slug: { en: "a" } })).toEqual({ en: "a" });
    expect(slugsOf({ slug: "a" })).toEqual({ en: "a" });
  });

  it("asks the API for the parent's path in every language", () => {
    expect(parentLookupPath("pages", "14")).toBe(
      "/api/pages/14?locale=all&fallbackLocale=false&depth=0&trash=true&select[path]=true",
    );
  });
});
