import { verifyPreviewToken } from "@dilm/runtime-config";
import { describe, expect, it } from "vitest";

import {
  LISTING_NO_MATCH,
  LISTING_SAMPLE_WORD,
  buildPreviewUrl,
  listingQuery,
  previewUrlsFor,
  type PreviewCollection,
} from "./previewUrl";

const secret = "test-secret";
const now = 5_000_000;
const tenants = [
  { domain: "indonesianacids.com" },
  { domain: "https://duniakimia.com/" },
  { domain: "likutelaga.com" },
];

function parse(url: string | null) {
  const parsed = new URL(url ?? "");
  return {
    host: parsed.host,
    pathname: parsed.pathname,
    token: parsed.searchParams.get("token") ?? "",
    path: parsed.searchParams.get("path") ?? "",
    q: parsed.searchParams.get("q"),
  };
}

describe("buildPreviewUrl", () => {
  it.each([
    ["pages", "/about", "/en/about"],
    ["shared-pages", "/privacy", "/en/privacy"],
    ["products", "/products/hcl", "/en/products/hcl"],
    ["posts", "/news/a", "/en/news/a"],
    ["jobs", "/careers/chemist", "/en/careers/chemist"],
    ["categories", "/news/c/x", "/en/news/c/x"],
    ["solutions", "/solutions/s", "/en/solutions/s"],
  ] as [PreviewCollection, string, string][])(
    "builds the %s URL",
    (collection, path, expected) => {
      const url = parse(
        buildPreviewUrl({
          doc: { path },
          collection,
          tenant: tenants[0],
          locale: "en",
          secret,
          now,
        }),
      );
      expect(url.host).toBe("indonesianacids.com");
      expect(url.pathname).toBe("/api/preview");
      expect(url.path).toBe(expected);
      expect(verifyPreviewToken(url.token, url.path, secret, now).ok).toBe(
        true,
      );
    },
  );

  it("uses the home path without a trailing slash and the locale's path", () => {
    const url = parse(
      buildPreviewUrl({
        doc: { path: { en: "/", id: "/tentang" } },
        collection: "pages",
        tenant: tenants[0],
        locale: "id",
        secret,
        now,
      }),
    );
    expect(url.path).toBe("/id/tentang");
  });

  it("previews a template through the chosen record", () => {
    const url = parse(
      buildPreviewUrl({
        doc: { path: "/ignored" },
        record: { path: "/products/hcl" },
        collection: "shared-detail-templates",
        tenant: tenants[1],
        locale: "en",
        secret,
        now,
      }),
    );
    expect(url.host).toBe("duniakimia.com");
    expect(url.path).toBe("/en/products/hcl");
  });

  it("gives nothing when the domain, path or secret is missing", () => {
    const base = {
      doc: { path: "/a" },
      collection: "pages" as const,
      locale: "en",
      secret,
    };
    expect(buildPreviewUrl({ ...base, tenant: { domain: "" } })).toBeNull();
    expect(buildPreviewUrl({ ...base, tenant: null })).toBeNull();
    expect(
      buildPreviewUrl({ ...base, doc: {}, tenant: tenants[0] }),
    ).toBeNull();
    expect(
      buildPreviewUrl({ ...base, secret: "", tenant: tenants[0] }),
    ).toBeNull();
  });

  it("gives a shared page one URL per domain", () => {
    const urls = previewUrlsFor({
      doc: { path: "/privacy" },
      collection: "shared-pages",
      tenants,
      locale: "en",
      secret,
      now,
    });
    expect(urls.map((url) => parse(url).host)).toEqual([
      "indonesianacids.com",
      "duniakimia.com",
      "likutelaga.com",
    ]);
  });

  it("rejects a tampered path and an expired token", () => {
    const url = parse(
      buildPreviewUrl({
        doc: { path: "/a" },
        collection: "pages",
        tenant: tenants[0],
        locale: "en",
        secret,
        now,
      }),
    );
    expect(verifyPreviewToken(url.token, "/en/b", secret, now).ok).toBe(false);
    expect(
      verifyPreviewToken(url.token, url.path, secret, now + 600_001).ok,
    ).toBe(false);
  });

  it("adds the listing query for Search and No results only", () => {
    const build = (q?: string) =>
      parse(
        buildPreviewUrl({
          doc: { path: "/news" },
          collection: "pages",
          tenant: tenants[0],
          locale: "en",
          q,
          secret,
          now,
        }),
      ).q;
    expect(build(listingQuery("initial"))).toBeNull();
    expect(build(listingQuery("search"))).toBe(LISTING_SAMPLE_WORD);
    expect(build(listingQuery("none"))).toBe(LISTING_NO_MATCH);
  });
});
