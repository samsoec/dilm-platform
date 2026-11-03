import { describe, expect, it } from "vitest";

import {
  Collector,
  changeReason,
  documentChange,
  listTag,
  mergeChanges,
  publicPath,
  referrersChange,
  routeTag,
  templateBasePaths,
  templateChange,
  type Tenant,
} from "./revalidationTargets";
import type { RouteSnapshot } from "./routeIndex";

const DUNIA: Tenant = { id: "2", slug: "duniakimia", host: "duniakimia.com" };
const INDO: Tenant = { id: "1", slug: "indoacid", host: "indonesianacids.com" };
const LIKU: Tenant = { id: "3", slug: "likutelaga", host: "likutelaga.com" };
const TENANTS = [INDO, DUNIA, LIKU];
const ALL_HOSTS = ["duniakimia.com", "indonesianacids.com", "likutelaga.com"];

const row = (
  tenant: string | null,
  path: string,
  locale = "en",
): RouteSnapshot => ({ tenant, locale, path });

const hosts = (purge: { host: string }[]) =>
  [...new Set(purge.map((entry) => entry.host))].sort();

describe("tags and URLs", () => {
  it("names a route tag by tenant slug or shared", () => {
    expect(routeTag("duniakimia", "en", "/about")).toBe(
      "route:duniakimia:en:/about",
    );
    expect(routeTag(null, "id", "/produk")).toBe("route:shared:id:/produk");
    expect(listTag("all", "products")).toBe("list:all:products");
  });

  it("puts the locale in front of the path, and keeps home to one URL", () => {
    expect(publicPath("en", "/about")).toBe("/en/about");
    expect(publicPath("id", "/")).toBe("/id/");
  });
});

describe("a page change", () => {
  it("revalidates a company page on its own host only", () => {
    const after = [row("2", "/about"), row("2", "/tentang", "id")];
    expect(
      documentChange(
        [
          {
            collection: "pages",
            id: "9",
            before: [],
            after,
            reason: "publish",
          },
        ],
        [],
        TENANTS,
      ),
    ).toEqual({
      collection: "pages",
      reason: "publish",
      tags: ["route:duniakimia:en:/about", "route:duniakimia:id:/tentang"],
      purge: [
        { host: "duniakimia.com", pathPrefix: "/en/about", exact: true },
        { host: "duniakimia.com", pathPrefix: "/id/tentang", exact: true },
      ],
    });
  });

  it("purges a shared page's path on every tenant host", () => {
    const change = documentChange(
      [
        {
          collection: "shared-pages",
          id: "4",
          before: [],
          after: [row(null, "/terms")],
          reason: "publish",
        },
      ],
      [],
      TENANTS,
    );
    expect(change.tags).toEqual(["route:shared:en:/terms"]);
    expect(change.purge).toHaveLength(3);
    expect(hosts(change.purge)).toEqual(ALL_HOSTS);
    expect(
      change.purge.every((entry) => entry.pathPrefix === "/en/terms"),
    ).toBe(true);
  });

  it("purges only the exact home URL, not the whole locale", () => {
    const change = documentChange(
      [
        {
          collection: "pages",
          id: "1",
          before: [],
          after: [row("2", "/")],
          reason: "publish",
        },
      ],
      [],
      TENANTS,
    );
    expect(change.purge).toEqual([
      { host: "duniakimia.com", pathPrefix: "/en/", exact: true },
    ]);
    expect(change.tags).toEqual(["route:duniakimia:en:/"]);
  });

  it("revalidates both the old and the new path when a page moves", () => {
    const change = documentChange(
      [
        {
          collection: "pages",
          id: "1",
          before: [row("2", "/press")],
          after: [row("2", "/media")],
          reason: "move",
        },
      ],
      [],
      TENANTS,
    );
    expect(change.tags).toEqual([
      "route:duniakimia:en:/media",
      "route:duniakimia:en:/press",
    ]);
    expect(change.purge.map((entry) => entry.pathPrefix)).toEqual([
      "/en/media",
      "/en/press",
    ]);
  });

  it("revalidates the old path when a page is unpublished or trashed", () => {
    const change = documentChange(
      [
        {
          collection: "pages",
          id: "1",
          before: [row("2", "/press")],
          after: [],
          reason: "unpublish",
        },
      ],
      [],
      TENANTS,
    );
    expect(change).toMatchObject({
      reason: "unpublish",
      tags: ["route:duniakimia:en:/press"],
    });
  });

  it("skips a row whose company is unknown instead of guessing a host", () => {
    const change = documentChange(
      [
        {
          collection: "pages",
          id: "1",
          before: [],
          after: [row("99", "/ghost")],
          reason: "publish",
        },
      ],
      [],
      TENANTS,
    );
    expect(change.tags).toEqual([]);
    expect(change.purge).toEqual([]);
  });
});

describe("a record change", () => {
  const product = {
    collection: "products",
    id: "7",
    before: [],
    after: [row(null, "/products/bleach"), row(null, "/produk/bleach", "id")],
    reason: "publish" as const,
  };

  it("purges a product on every host with its list tags", () => {
    const change = documentChange([product], [], TENANTS);
    expect(change.tags).toEqual([
      "list:all:products",
      "list:duniakimia:products",
      "list:indoacid:products",
      "list:likutelaga:products",
      "route:shared:en:/products/bleach",
      "route:shared:id:/produk/bleach",
    ]);
    expect(hosts(change.purge)).toEqual(ALL_HOSTS);
    expect(change.purge).toHaveLength(6);
  });

  it("treats a solution and a category the same way", () => {
    for (const collection of ["solutions", "categories"]) {
      const change = documentChange([{ ...product, collection }], [], TENANTS);
      expect(change.tags).toContain(`list:all:${collection}`);
      expect(change.tags).toContain(`list:likutelaga:${collection}`);
      expect(hosts(change.purge)).toEqual(ALL_HOSTS);
    }
  });

  it("keeps a job to its own company's host and list", () => {
    const change = documentChange(
      [
        {
          collection: "jobs",
          id: "5",
          before: [],
          after: [row("2", "/career/chemist")],
          reason: "publish",
        },
      ],
      [],
      TENANTS,
    );
    expect(change.tags).toEqual([
      "list:all:jobs",
      "list:duniakimia:jobs",
      "route:duniakimia:en:/career/chemist",
    ]);
    expect(hosts(change.purge)).toEqual(["duniakimia.com"]);
  });

  it("tags a post's company list and the shared all-list", () => {
    const change = documentChange(
      [
        {
          collection: "posts",
          id: "5",
          before: [],
          after: [row("3", "/category/news/opening")],
          reason: "publish",
        },
      ],
      [],
      TENANTS,
    );
    expect(change.tags).toEqual([
      "list:all:posts",
      "list:likutelaga:posts",
      "route:likutelaga:en:/category/news/opening",
    ]);
    expect(hosts(change.purge)).toEqual(["likutelaga.com"]);
  });

  it("adds no list tags for pages", () => {
    const change = documentChange(
      [
        {
          collection: "shared-pages",
          id: "1",
          before: [],
          after: [row(null, "/x")],
          reason: "publish",
        },
      ],
      [],
      TENANTS,
    );
    expect(change.tags.filter((tag) => tag.startsWith("list:"))).toEqual([]);
  });

  it("adds every route whose refs contain the record", () => {
    const change = documentChange(
      [product],
      [
        { tenant: "2", paths: { en: "/showcase", id: "/pameran" } },
        { tenant: null, paths: { en: "/home" } },
      ],
      TENANTS,
    );
    expect(change.tags).toEqual(
      expect.arrayContaining([
        "route:duniakimia:en:/showcase",
        "route:duniakimia:id:/pameran",
        "route:shared:en:/home",
      ]),
    );
    expect(
      change.purge.filter((entry) => entry.pathPrefix === "/en/showcase"),
    ).toEqual([
      { host: "duniakimia.com", pathPrefix: "/en/showcase", exact: true },
    ]);
    expect(
      change.purge.filter((entry) => entry.pathPrefix === "/en/home"),
    ).toHaveLength(3);
  });

  it("lists a cascade of many records once each", () => {
    const moved = Array.from({ length: 500 }, (_, index) => ({
      collection: "jobs",
      id: String(index),
      before: [row("2", `/career/job-${index}`)],
      after: [row("2", `/careers/job-${index}`)],
      reason: "move" as const,
    }));
    const change = documentChange(moved, [], TENANTS);
    expect(change.tags).toHaveLength(1002);
    expect(new Set(change.tags).size).toBe(change.tags.length);
    expect(change.purge).toHaveLength(1000);
  });

  it("dedupes the same route reached twice", () => {
    const twice = documentChange(
      [
        { ...product, collection: "pages", after: [row("2", "/a")] },
        { ...product, collection: "pages", after: [row("2", "/a")] },
      ],
      [{ tenant: "2", paths: { en: "/a" } }],
      TENANTS,
    );
    expect(twice.tags).toEqual(["route:duniakimia:en:/a"]);
    expect(twice.purge).toHaveLength(1);
  });
});

describe("change reasons", () => {
  it("names publish, unpublish, move and update", () => {
    const a = [row("2", "/a")];
    const b = [row("2", "/b")];
    expect(changeReason([], a)).toBe("publish");
    expect(changeReason(a, [])).toBe("unpublish");
    expect(changeReason(a, b)).toBe("move");
    expect(changeReason(a, a)).toBe("update");
  });
});

describe("a template change", () => {
  const governed = [
    row(null, "/products/bleach"),
    row(null, "/products/acid"),
    row(null, "/produk/bleach", "id"),
  ];

  it("revalidates every product path and the base prefix on every host (shared)", () => {
    const change = templateChange(
      {
        kind: "shared",
        recordType: "product",
        governed,
        bases: { en: "/products", id: "/produk" },
      },
      TENANTS,
    );
    expect(change.collection).toBe("products");
    expect(change.reason).toBe("template");
    expect(change.tags).toEqual([
      "route:shared:en:/products/acid",
      "route:shared:en:/products/bleach",
      "route:shared:id:/produk/bleach",
    ]);
    expect(change.purge).toHaveLength(6);
    expect(hosts(change.purge)).toEqual(ALL_HOSTS);
    expect(
      change.purge.filter((entry) => entry.host === "duniakimia.com"),
    ).toEqual([
      { host: "duniakimia.com", pathPrefix: "/en/products/" },
      { host: "duniakimia.com", pathPrefix: "/id/produk/" },
    ]);
  });

  it("limits a company's job template to that company's host and jobs", () => {
    const change = templateChange(
      {
        kind: "tenant",
        recordType: "job",
        tenant: "2",
        governed: [row("2", "/career/chemist"), row("3", "/karier/other")],
        bases: { en: "/career", id: "/karier" },
      },
      TENANTS,
    );
    expect(change.tags).toEqual(["route:duniakimia:en:/career/chemist"]);
    expect(change.purge).toEqual([
      { host: "duniakimia.com", pathPrefix: "/en/career/" },
      { host: "duniakimia.com", pathPrefix: "/id/karier/" },
    ]);
  });

  it("uses the category prefix for post and category templates", () => {
    for (const recordType of ["post", "category"] as const) {
      const change = templateChange(
        {
          kind: "tenant",
          recordType,
          tenant: "3",
          governed: [row(null, "/category/news")],
        },
        TENANTS,
      );
      expect(change.purge).toEqual([
        { host: "likutelaga.com", pathPrefix: "/en/category/" },
        { host: "likutelaga.com", pathPrefix: "/id/kategori/" },
      ]);
    }
  });

  it("purges no prefix when the base page is not set", () => {
    const change = templateChange(
      { kind: "shared", recordType: "solution", governed, bases: undefined },
      TENANTS,
    );
    expect(change.purge).toEqual([]);
    expect(change.tags).toHaveLength(3);
  });

  it("never purges a prefix of just the locale", () => {
    expect(templateBasePaths("product", { en: "/", id: "" })).toEqual({});
  });
});

describe("referrers and merging", () => {
  it("revalidates the routes that reference a company's settings", () => {
    const change = referrersChange(
      [
        { tenant: "2", paths: { en: "/about" } },
        { tenant: null, paths: { en: "/group", id: "/grup" } },
      ],
      TENANTS,
      "tenant-settings",
      "settings",
    );
    expect(change).toMatchObject({
      collection: "tenant-settings",
      reason: "settings",
    });
    expect(change.tags).toEqual([
      "route:duniakimia:en:/about",
      "route:shared:en:/group",
      "route:shared:id:/grup",
    ]);
    expect(hosts(change.purge)).toEqual(ALL_HOSTS);
  });

  it("merges changes without duplicating tags or targets", () => {
    const one = referrersChange(
      [{ tenant: "2", paths: { en: "/a" } }],
      TENANTS,
      "pages",
      "move",
    );
    const merged = mergeChanges([one, one, one], "pages", "move");
    expect(merged).toEqual(one);
  });

  it("collects tags once however often they are added", () => {
    const collector = new Collector();
    collector.addRoute(row("2", "/a"), TENANTS);
    collector.addRoute(row("2", "/a"), TENANTS);
    expect(collector.build("pages", "update").tags).toHaveLength(1);
    expect(collector.empty).toBe(false);
  });
});
