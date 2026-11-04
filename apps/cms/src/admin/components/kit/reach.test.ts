import { describe, expect, it } from "vitest";

import { collections } from "../../../collections";
import { applyMultiTenant, findField } from "../../../testing";
import {
  ALL_SITE_COLLECTIONS,
  ALL_SITES_COUNT,
  allSitesLabel,
  getReach,
} from "./reach";

const tenants = [
  { id: 1, domain: "indonesianacids.com" },
  { id: 2, domain: "duniakimia.com" },
  { id: 3, domain: "likutelaga.com" },
];

describe("getReach (PR-WC-01)", () => {
  it("names the domain of a populated tenant", () => {
    expect(getReach({ tenant: tenants[1] })).toEqual({
      scope: "tenant",
      domain: "duniakimia.com",
      label: "This site only (duniakimia.com)",
    });
  });

  it("looks the domain up when the tenant is only an id", () => {
    expect(getReach({ tenant: 3 }, { tenants }).label).toBe(
      "This site only (likutelaga.com)",
    );
    expect(getReach({ tenant: "2" }, { tenants }).label).toBe(
      "This site only (duniakimia.com)",
    );
  });

  it("stays truthful when the domain can't be resolved", () => {
    expect(getReach({ tenant: 9 }, { tenants })).toEqual({
      scope: "tenant",
      domain: undefined,
      label: "This site only",
    });
    expect(getReach({ tenant: { id: 9, domain: null } }).label).toBe(
      "This site only",
    );
  });

  it("says All 3 sites for a document with no tenant", () => {
    for (const doc of [{}, { tenant: null }, null, undefined]) {
      expect(getReach(doc)).toEqual({
        scope: "all",
        sites: ALL_SITES_COUNT,
        label: "All 3 sites",
      });
    }
  });

  it("takes the number of sites from the caller when it knows it", () => {
    expect(getReach({}, { sites: tenants.length }).label).toBe("All 3 sites");
    expect(getReach({}, { sites: 4 }).label).toBe("All 4 sites");
    expect(allSitesLabel(2)).toBe("All 2 sites");
  });

  it.each(ALL_SITE_COLLECTIONS)(
    "treats %s as all sites even when the document names an owner",
    (collection) => {
      expect(getReach({ tenant: tenants[0] }, { collection }).scope).toBe(
        "all",
      );
    },
  );

  it.each(["pages", "detail-templates", "jobs", "posts", "documents"])(
    "treats %s as this site only",
    (collection) => {
      expect(getReach({ tenant: 2 }, { collection, tenants }).scope).toBe(
        "tenant",
      );
    },
  );
});

describe("reach against the real collections", () => {
  it("lists exactly the collections with no tenant, plus the catalogue owners", async () => {
    const configured = await applyMultiTenant(collections);
    const reaches = collections.map(({ slug }) => {
      const hasTenant = Boolean(findField(configured(slug).fields, "tenant"));
      return [slug, hasTenant] as const;
    });
    const tenantless = reaches.filter(([, has]) => !has).map(([slug]) => slug);

    for (const slug of [
      "shared-pages",
      "shared-detail-templates",
      "categories",
    ]) {
      expect(tenantless).toContain(slug);
      expect(ALL_SITE_COLLECTIONS).toContain(slug);
    }
    for (const slug of [
      "pages",
      "detail-templates",
      "jobs",
      "posts",
      "documents",
    ]) {
      expect(tenantless).not.toContain(slug);
      expect(ALL_SITE_COLLECTIONS).not.toContain(slug);
    }
    for (const slug of ["products", "solutions"]) {
      expect(tenantless).not.toContain(slug);
      expect(ALL_SITE_COLLECTIONS).toContain(slug);
    }
    expect(
      ALL_SITE_COLLECTIONS.filter(
        (slug) => !collections.some((c) => c.slug === slug),
      ),
    ).toEqual([]);
  });
});
