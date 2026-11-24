import { describe, expect, it } from "vitest";

import { buildMetadata } from "./metadata";
import { organizationJsonLd } from "./organization";
import { canonicalUrl, languageAlternates, robotsTxt } from "./site";
import { serializeJsonLd } from "@/components/JsonLd";

const defaults = { title: "Default", description: "Desc", ogImageUrl: null };
const prod = { SITE_STAGE: "production" };

describe("seo", () => {
  it("pins the canonical to the tenant .com", () => {
    expect(canonicalUrl("likutelaga", "id", ["about"])).toBe(
      "https://likutelaga.com/id/about",
    );
  });

  it("lists en, id and x-default pointing at en", () => {
    expect(languageAlternates("indoacid", ["a"])).toEqual({
      en: "https://indonesianacidsindustry.com/en/a",
      id: "https://indonesianacidsindustry.com/id/a",
      "x-default": "https://indonesianacidsindustry.com/en/a",
    });
  });

  it("uses CMS defaults and lets page meta override them", () => {
    const base = {
      tenant: "duniakimia",
      locale: "en",
      defaults,
      env: prod,
    } as const;
    expect(buildMetadata(base).title).toBe("Default");
    const page = buildMetadata({ ...base, meta: { title: "Page" } });
    expect(page.title).toBe("Page");
    expect(page.description).toBe("Desc");
  });

  it("indexes only in production", () => {
    const base = { tenant: "duniakimia", locale: "en", defaults } as const;
    expect(buildMetadata({ ...base, env: prod }).robots).toMatchObject({
      index: true,
    });
    expect(buildMetadata({ ...base, env: {} }).robots).toMatchObject({
      index: false,
    });
    expect(
      buildMetadata({ ...base, env: { SITE_STAGE: "staging" } }).robots,
    ).toMatchObject({ index: false });
  });

  it("disallows everything outside production", () => {
    expect(robotsTxt({ SITE_STAGE: "staging" })).toContain("Disallow: /");
    expect(robotsTxt({})).toContain("Disallow: /");
    expect(robotsTxt(prod)).not.toContain("Disallow");
  });

  it("builds Organization data from the brand fields", () => {
    expect(organizationJsonLd("likutelaga", defaults)).toMatchObject({
      "@type": "Organization",
      name: "Liku Telaga",
      url: "https://likutelaga.com",
    });
  });

  it("escapes markup in JSON-LD", () => {
    expect(serializeJsonLd({ a: "</script>" })).not.toContain("<");
  });
});
