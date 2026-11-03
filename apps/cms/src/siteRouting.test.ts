import type { Payload } from "payload";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { Jobs } from "./collections/Jobs";
import { Pages } from "./collections/Pages";
import { Products } from "./collections/Products";
import { SharedPages } from "./collections/SharedPages";
import { SiteRouting } from "./collections/SiteRouting";
import { Solutions } from "./collections/Solutions";
import { TenantSettings } from "./collections/TenantSettings";
import { globals } from "./collections";
import { recordMoveSources } from "./pathCascade";
import { computePaths } from "./paths";
import {
  jobBaseSources,
  recordBasePaths,
  recordBaseSources,
} from "./recordBases";
import {
  assertNotBasePage,
  baseUnpublishedMessage,
  baseUnsetMessage,
  cascadeCompanyRouting,
  cascadeSiteRouting,
  checkCompanyRouting,
  checkSiteRouting,
  clearBaseMessage,
  getPublicationPage,
  keepBasePagesOnDelete,
  keepBasePagesOutOfTheTrash,
  keepBasePagesPublished,
  OTHER_COMPANY_PAGE,
  pageNotPublishedMessage,
  previewBaseChange,
  protectionMessage,
  registerSiteRouting,
  requireBase,
} from "./siteRouting";
import { accessAs, findField, testUser } from "./testing";

type Row = Record<string, unknown> & { id: number };

function read(row: Row, key: string): unknown {
  return key.split(".").reduce<unknown>((value, part) => {
    return value && typeof value === "object"
      ? (value as Record<string, unknown>)[part]
      : undefined;
  }, row);
}

function holds(row: Row, where: Record<string, unknown>): boolean {
  return Object.entries(where).every(([key, condition]) => {
    if (key === "and") {
      return (condition as Record<string, unknown>[]).every((part) =>
        holds(row, part),
      );
    }
    if (key === "or") {
      return (condition as Record<string, unknown>[]).some((part) =>
        holds(row, part),
      );
    }
    const value = read(row, key);
    const test = condition as Record<string, unknown>;
    if ("equals" in test) {
      return typeof test.equals === "object" && test.equals !== null
        ? JSON.stringify(value) === JSON.stringify(test.equals)
        : value === test.equals;
    }
    if ("in" in test) {
      return (test.in as unknown[]).map(String).includes(String(value));
    }
    if ("not_equals" in test) return value !== test.not_equals;
    if ("exists" in test) {
      const present = value !== null && value !== undefined;
      return test.exists ? present : !present;
    }
    return true;
  });
}

const TABLES = [
  "pages",
  "shared-pages",
  "products",
  "solutions",
  "jobs",
  "posts",
  "tenant-settings",
  "routes",
  "redirects",
] as const;

function fakeDb() {
  const tables: Record<string, Row[]> = Object.fromEntries(
    TABLES.map((table) => [table, []]),
  );
  const globalDocs: Record<string, Record<string, unknown>> = {
    "site-routing": {},
  };
  let next = 1000;
  const matching = (collection: string, where?: Record<string, unknown>) =>
    tables[collection].filter((row) => !where || holds(row, where));
  const payload = {
    find: async (args: {
      collection: string;
      where?: Record<string, unknown>;
    }) => ({
      docs: matching(args.collection, args.where).map((row) =>
        structuredClone(row),
      ),
    }),
    count: async (args: {
      collection: string;
      where?: Record<string, unknown>;
    }) => ({ totalDocs: matching(args.collection, args.where).length }),
    findByID: async (args: { collection: string; id: number | string }) => {
      const found = tables[args.collection].find(
        (row) => String(row.id) === String(args.id),
      );
      if (!found) throw new Error("Not Found");
      return structuredClone(found);
    },
    findGlobal: async (args: { slug: string }) =>
      structuredClone(globalDocs[args.slug]),
    create: async (args: {
      collection: string;
      data: Record<string, unknown>;
    }) => {
      const row = { id: next++, ...structuredClone(args.data) } as Row;
      tables[args.collection].push(row);
      return row;
    },
    update: async (args: {
      collection: string;
      id: number;
      data: Record<string, unknown>;
    }) => {
      const row = tables[args.collection].find(
        (entry) => entry.id === args.id,
      )!;
      Object.assign(row, structuredClone(args.data));
      return row;
    },
    delete: async (args: {
      collection: string;
      id?: number;
      where?: Record<string, unknown>;
    }) => {
      tables[args.collection] = tables[args.collection].filter((row) =>
        args.where ? !holds(row, args.where) : row.id !== args.id,
      );
      return {};
    },
    db: {
      updateOne: async (args: {
        collection: string;
        id: number;
        data: Record<string, unknown>;
      }) => {
        const row = tables[args.collection].find(
          (entry) => entry.id === args.id,
        )!;
        Object.assign(row, structuredClone(args.data));
      },
    },
  } as unknown as Payload;
  return { payload, tables, globalDocs };
}

type Fake = ReturnType<typeof fakeDb>;

function addPage(
  { tables }: Fake,
  table: "pages" | "shared-pages",
  seed: {
    id: number;
    slug: string;
    parent?: number;
    tenant?: number;
    status?: "published" | "draft";
    deletedAt?: string | null;
    title?: string;
  },
) {
  const parent = seed.parent
    ? (tables[table].find((row) => row.id === seed.parent) as Row)
    : undefined;
  const above = (locale: string) =>
    ((parent?.path as Record<string, string> | undefined)?.[locale] ?? "") ||
    "";
  tables[table].push({
    id: seed.id,
    title: { en: seed.title ?? seed.slug, id: seed.title ?? seed.slug },
    slug: { en: seed.slug, id: seed.slug },
    parent: seed.parent ?? null,
    tenant: table === "pages" ? (seed.tenant ?? 1) : null,
    _status: seed.status ?? "published",
    deletedAt: seed.deletedAt ?? null,
    path: {
      en: `${above("en")}/${seed.slug}`,
      id: `${above("id")}/${seed.slug}`,
    },
  });
}

function addRecord(
  { tables }: Fake,
  table: "products" | "solutions" | "jobs",
  seed: {
    id: number;
    slug: string;
    path: string;
    tenant?: number;
    status?: "published" | "draft";
  },
) {
  tables[table].push({
    id: seed.id,
    slug: { en: seed.slug, id: seed.slug },
    path: seed.path
      ? { en: `${seed.path}/${seed.slug}`, id: `${seed.path}/${seed.slug}` }
      : { en: "", id: "" },
    tenant: table === "jobs" ? (seed.tenant ?? 1) : null,
    _status: seed.status ?? "published",
    deletedAt: null,
  });
}

function settings({ tables }: Fake, tenant: number, routing: object) {
  tables["tenant-settings"].push({ id: 500 + tenant, tenant, routing });
}

const editor = testUser(["tenant-editor"], [1]);
const superAdmin = testUser(["super-admin"]);

const run = <T>(hook: unknown, args: object): Promise<T> =>
  (hook as (args: object) => Promise<T>)(args);

beforeEach(() => {
  registerSiteRouting();
});

afterEach(() => {
  delete recordBaseSources.products;
  delete recordBaseSources.solutions;
  delete jobBaseSources.career;
  recordMoveSources.length = 0;
});

describe("site-routing global (US-RTG-1)", () => {
  it("is registered with two shared-page relationships", () => {
    expect(globals).toContain(SiteRouting);
    expect(SiteRouting.slug).toBe("site-routing");
    for (const name of ["productsPage", "solutionsPage"]) {
      expect(findField(SiteRouting.fields, name)).toMatchObject({
        type: "relationship",
        relationTo: "shared-pages",
        filterOptions: { _status: { equals: "published" } },
      });
    }
  });

  it("lets only Super Admins write and every signed-in role read", () => {
    const access = SiteRouting.access!;
    const args = (user: object | null) => ({ req: { user } }) as never;
    expect(access.update!(args(superAdmin))).toBe(true);
    expect(access.update!(args(editor))).toBe(false);
    expect(access.update!(args(null))).toBe(false);
    expect(access.read!(args(editor))).toBe(true);
    expect(access.read!(args(superAdmin))).toBe(true);
    expect(access.read!(args(null))).toBe(false);
  });
});

describe("tenant-settings routing group (US-PG-7.3)", () => {
  const group = findField(TenantSettings.fields, "routing") as {
    fields: unknown[];
  };

  it("points both settings at pages, published and in the same company", () => {
    for (const name of ["careerPage", "publicationPage"]) {
      const field = findField(group.fields as never, name) as {
        relationTo: string;
        filterOptions: (args: never) => unknown;
      };
      expect(field.relationTo).toBe("pages");
      expect(field.filterOptions({ data: { tenant: 3 } } as never)).toEqual({
        and: [
          { _status: { equals: "published" } },
          { tenant: { equals: "3" } },
        ],
      });
    }
  });

  it("stays writable by Tenant Editors and not by Tenant Viewers", () => {
    expect(accessAs(TenantSettings, "update", editor)).toBe(true);
    expect(
      accessAs(TenantSettings, "update", testUser(["tenant-viewer"], [1])),
    ).toBe(false);
  });

  it("runs the routing hooks", () => {
    expect(TenantSettings.hooks!.beforeChange).toContain(checkCompanyRouting);
    expect(TenantSettings.hooks!.afterChange).toContain(cascadeCompanyRouting);
  });
});

describe("record paths with no base (FR-PM-17)", () => {
  it("leaves the path empty while the base page is unset", async () => {
    const fake = fakeDb();
    expect(await recordBasePaths(fake.payload, undefined, "products")).toBe(
      undefined,
    );
    expect(
      await computePaths(fake.payload, {
        collection: "products",
        slugs: { en: "sulfuric-acid" },
      }),
    ).toEqual({ en: "", id: "" });
  });

  it("builds the path from the base page once it is set", async () => {
    const fake = fakeDb();
    addPage(fake, "shared-pages", { id: 1, slug: "our-products" });
    fake.globalDocs["site-routing"] = { productsPage: 1 };
    expect(
      await computePaths(fake.payload, {
        collection: "products",
        slugs: { en: "sulfuric-acid", id: "asam-sulfat" },
      }),
    ).toEqual({
      en: "/our-products/sulfuric-acid",
      id: "/our-products/asam-sulfat",
    });
  });

  it("builds a job's path from its own company's career page", async () => {
    const fake = fakeDb();
    addPage(fake, "pages", { id: 1, slug: "career", tenant: 1 });
    addPage(fake, "pages", { id: 2, slug: "join-us", tenant: 2 });
    settings(fake, 1, { careerPage: 1 });
    settings(fake, 2, { careerPage: 2 });
    const pathFor = (tenant: number) =>
      computePaths(fake.payload, {
        collection: "jobs",
        tenant,
        slugs: { en: "analyst" },
      });
    expect(await pathFor(1)).toEqual({
      en: "/career/analyst",
      id: "/career/analyst",
    });
    expect(await pathFor(2)).toEqual({
      en: "/join-us/analyst",
      id: "/join-us/analyst",
    });
    expect(await pathFor(3)).toEqual({ en: "", id: "" });
  });
});

describe("publish gate (FR-PM-17)", () => {
  const publishing = (data: object, originalDoc?: object) => ({
    data,
    originalDoc,
    req: {},
  });

  async function gate(
    fake: Fake,
    collection: "products" | "solutions" | "jobs",
    data: object,
    originalDoc?: object,
  ) {
    return run(requireBase(collection), {
      ...publishing(data, originalDoc),
      req: { payload: fake.payload },
    });
  }

  it("refuses to publish a product while the base is unset, with PR-04", async () => {
    const fake = fakeDb();
    await expect(
      gate(fake, "products", { _status: "published" }),
    ).rejects.toThrow(
      'No "Our Products" page is set in Site routing, so products have no URL. Ask a Super Admin to set it.',
    );
    expect(baseUnsetMessage("solutionsPage")).toContain('"Our Solutions"');
  });

  it("refuses while the base page is unpublished and names it", async () => {
    const fake = fakeDb();
    addPage(fake, "shared-pages", {
      id: 1,
      slug: "our-products",
      status: "draft",
      title: "Our Products",
    });
    fake.globalDocs["site-routing"] = { productsPage: 1 };
    await expect(
      gate(fake, "products", { _status: "published" }),
    ).rejects.toThrow(baseUnpublishedMessage("productsPage", "Our Products"));
  });

  it("lets a draft save through without any base", async () => {
    const fake = fakeDb();
    const data = { _status: "draft", name: "x" };
    expect(await gate(fake, "products", data)).toBe(data);
    expect(await gate(fake, "jobs", data)).toBe(data);
  });

  it("treats an update without a status as the document's own status", async () => {
    const fake = fakeDb();
    await expect(
      gate(fake, "solutions", {}, { _status: "published" }),
    ).rejects.toThrow("Our Solutions");
    const data = {};
    expect(await gate(fake, "solutions", data, { _status: "draft" })).toBe(
      data,
    );
  });

  it("does not stand in the way of trashing", async () => {
    const fake = fakeDb();
    const data = { deletedAt: "2026-11-03", _status: "published" };
    expect(await gate(fake, "products", data)).toBe(data);
  });

  it("publishes once the base page is live", async () => {
    const fake = fakeDb();
    addPage(fake, "shared-pages", { id: 1, slug: "our-products" });
    fake.globalDocs["site-routing"] = { productsPage: 1 };
    const data = { _status: "published" };
    expect(await gate(fake, "products", data)).toBe(data);
  });

  it("checks a job against its own company's career page", async () => {
    const fake = fakeDb();
    addPage(fake, "pages", { id: 1, slug: "career", tenant: 1 });
    settings(fake, 1, { careerPage: 1 });
    const data = { _status: "published", tenant: 1 };
    expect(await gate(fake, "jobs", data)).toBe(data);
    await expect(
      gate(fake, "jobs", { _status: "published", tenant: 2 }),
    ).rejects.toThrow(baseUnsetMessage("careerPage"));
    await expect(
      gate(fake, "jobs", { _status: "published" }, { tenant: 2 }),
    ).rejects.toThrow('No "Career" page is set in Company settings');
  });

  it("is wired into products, solutions and jobs", () => {
    for (const collection of [Products, Solutions, Jobs]) {
      expect(collection.hooks!.beforeChange!.length).toBeGreaterThan(0);
    }
  });
});

describe("base change cascade (FR-PM-18)", () => {
  function catalog() {
    const fake = fakeDb();
    addPage(fake, "shared-pages", { id: 1, slug: "our-products" });
    addPage(fake, "shared-pages", { id: 2, slug: "catalog" });
    fake.globalDocs["site-routing"] = { productsPage: 1 };
    for (let n = 1; n <= 24; n++) {
      addRecord(fake, "products", {
        id: n,
        slug: `p${n}`,
        path: "/our-products",
        status: n <= 22 ? "published" : "draft",
      });
    }
    return fake;
  }

  it("counts records and redirects for a base change (RT-02)", async () => {
    const fake = catalog();
    const impact = await previewBaseChange(fake.payload, {
      setting: "productsPage",
      page: 2,
    });
    expect(impact).toEqual({ records: 24, redirects: 44, overLimit: false });
  });

  it("counts 24 products in two languages as 48 redirects", async () => {
    const fake = catalog();
    for (const product of fake.tables.products) product._status = "published";
    const impact = await previewBaseChange(fake.payload, {
      setting: "productsPage",
      page: 2,
    });
    expect(impact.records).toBe(24);
    expect(impact.redirects).toBe(48);
  });

  it("counts nothing when the base does not change anything", async () => {
    const fake = catalog();
    expect(
      await previewBaseChange(fake.payload, {
        setting: "productsPage",
        page: 1,
      }),
    ).toEqual({ records: 0, redirects: 0, overLimit: false });
  });

  it("rewrites every product path, redirects the published ones and re-indexes", async () => {
    const fake = catalog();
    fake.globalDocs["site-routing"] = { productsPage: 2 };
    await run(cascadeSiteRouting, {
      doc: { productsPage: 2 },
      previousDoc: { productsPage: 1 },
      req: { payload: fake.payload },
    });
    expect(fake.tables.products[0].path).toEqual({
      en: "/catalog/p1",
      id: "/catalog/p1",
    });
    expect(fake.tables.products[23].path).toEqual({
      en: "/catalog/p24",
      id: "/catalog/p24",
    });
    const redirects = fake.tables.redirects;
    expect(redirects).toHaveLength(44);
    expect(redirects[0]).toMatchObject({
      from: "/our-products/p1",
      to: { internalPath: "/catalog/p1" },
      origin: "auto",
    });
    expect(redirects.some((row) => String(row.from).endsWith("/p23"))).toBe(
      false,
    );
    expect(
      fake.tables.routes.filter((row) =>
        String(row.path).startsWith("/catalog"),
      ).length,
    ).toBe(44);
  });

  it("leaves other settings and unchanged bases alone", async () => {
    const fake = catalog();
    await run(cascadeSiteRouting, {
      doc: { productsPage: 1, solutionsPage: null },
      previousDoc: { productsPage: 1, solutionsPage: null },
      req: { payload: fake.payload },
    });
    expect(fake.tables.redirects).toEqual([]);
  });

  it("empties draft paths when a base is cleared and writes no redirect", async () => {
    const fake = fakeDb();
    addPage(fake, "shared-pages", { id: 1, slug: "our-solutions" });
    addRecord(fake, "solutions", {
      id: 1,
      slug: "s1",
      path: "/our-solutions",
      status: "draft",
    });
    await run(cascadeSiteRouting, {
      doc: { solutionsPage: null },
      previousDoc: { solutionsPage: 1 },
      req: { payload: fake.payload },
    });
    expect(fake.tables.solutions[0].path).toEqual({ en: "", id: "" });
    expect(fake.tables.redirects).toEqual([]);
  });

  it("moves the governed records when the base page itself is renamed", async () => {
    const fake = catalog();
    const [source] = recordMoveSources;
    const moves = await source({
      payload: fake.payload,
      req: undefined,
      pages: [
        {
          collection: "shared-pages",
          id: "1",
          tenant: null,
          paths: { en: "/renamed", id: "/renamed" },
        },
      ],
    });
    expect(moves).toHaveLength(24);
    expect(moves[0].moves).toEqual([
      { locale: "en", from: "/our-products/p1", to: "/renamed/p1" },
      { locale: "id", from: "/our-products/p1", to: "/renamed/p1" },
    ]);
    const unrelated = await source({
      payload: fake.payload,
      req: undefined,
      pages: [
        {
          collection: "shared-pages",
          id: "2",
          tenant: null,
          paths: { en: "/x", id: "/x" },
        },
      ],
    });
    expect(unrelated).toEqual([]);
  });

  it("moves a company's jobs when its career page moves, and no other company's", async () => {
    const fake = fakeDb();
    addPage(fake, "pages", { id: 1, slug: "career", tenant: 1 });
    addPage(fake, "pages", { id: 2, slug: "career", tenant: 2 });
    settings(fake, 1, { careerPage: 1 });
    settings(fake, 2, { careerPage: 2 });
    addRecord(fake, "jobs", { id: 1, slug: "a", path: "/career", tenant: 1 });
    addRecord(fake, "jobs", { id: 2, slug: "b", path: "/career", tenant: 2 });
    const [source] = recordMoveSources;
    const moves = await source({
      payload: fake.payload,
      req: undefined,
      pages: [
        {
          collection: "pages",
          id: "1",
          tenant: "1",
          paths: { en: "/about/career", id: "/about/career" },
        },
      ],
    });
    expect(moves.map((move) => [move.id, move.tenant])).toEqual([["1", "1"]]);
    expect(moves[0].moves[0].to).toBe("/about/career/a");
  });

  it("moves jobs when the career page setting changes", async () => {
    const fake = fakeDb();
    addPage(fake, "pages", { id: 1, slug: "career", tenant: 1 });
    addPage(fake, "pages", { id: 3, slug: "join-us", tenant: 1 });
    settings(fake, 1, { careerPage: 3 });
    addRecord(fake, "jobs", { id: 1, slug: "a", path: "/career", tenant: 1 });
    addRecord(fake, "jobs", { id: 2, slug: "b", path: "/career", tenant: 2 });
    await run(cascadeCompanyRouting, {
      doc: { tenant: 1, routing: { careerPage: 3 } },
      previousDoc: { tenant: 1, routing: { careerPage: 1 } },
      req: { payload: fake.payload },
    });
    expect(fake.tables.jobs[0].path).toEqual({
      en: "/join-us/a",
      id: "/join-us/a",
    });
    expect(fake.tables.jobs[1].path).toEqual({
      en: "/career/b",
      id: "/career/b",
    });
    expect(fake.tables.redirects).toHaveLength(2);
    expect(fake.tables.redirects[0]).toMatchObject({ tenant: 1 });
  });

  it("moves no post URL when the Publication page changes (FR-PM-59)", async () => {
    const fake = fakeDb();
    addPage(fake, "pages", { id: 1, slug: "publication", tenant: 1 });
    addPage(fake, "pages", { id: 3, slug: "news", tenant: 1 });
    fake.tables.posts.push({
      id: 1,
      tenant: 1,
      _status: "published",
      path: { en: "/category/news/a", id: "/kategori/berita/a" },
    });
    settings(fake, 1, { publicationPage: 3 });
    await run(cascadeCompanyRouting, {
      doc: { tenant: 1, routing: { publicationPage: 3 } },
      previousDoc: { tenant: 1, routing: { publicationPage: 1 } },
      req: { payload: fake.payload },
    });
    expect(fake.tables.posts[0].path).toEqual({
      en: "/category/news/a",
      id: "/kategori/berita/a",
    });
    expect(fake.tables.redirects).toEqual([]);
  });

  it("refuses a cascade over the limit before anything is saved", async () => {
    const fake = fakeDb();
    addPage(fake, "shared-pages", { id: 1, slug: "a" });
    addPage(fake, "shared-pages", { id: 2, slug: "b" });
    for (let n = 1; n <= 501; n++) {
      addRecord(fake, "products", { id: n, slug: `p${n}`, path: "/a" });
    }
    await expect(
      run(checkSiteRouting, {
        data: { productsPage: 2 },
        originalDoc: { productsPage: 1 },
        req: { payload: fake.payload },
      }),
    ).rejects.toThrow("501 pages and records");
  });
});

describe("base setting checks", () => {
  it("accepts only a published shared page for Site routing", async () => {
    const fake = fakeDb();
    addPage(fake, "shared-pages", { id: 1, slug: "a", status: "draft" });
    addPage(fake, "shared-pages", { id: 2, slug: "b" });
    const check = (productsPage: number) =>
      run(checkSiteRouting, {
        data: { productsPage },
        originalDoc: {},
        req: { payload: fake.payload },
      });
    await expect(check(1)).rejects.toThrow(pageNotPublishedMessage("a"));
    await expect(check(2)).resolves.toEqual({ productsPage: 2 });
  });

  it("refuses to clear a base that published records depend on", async () => {
    const fake = fakeDb();
    addPage(fake, "shared-pages", { id: 1, slug: "a" });
    addRecord(fake, "products", { id: 1, slug: "p", path: "/a" });
    await expect(
      run(checkSiteRouting, {
        data: { productsPage: null },
        originalDoc: { productsPage: 1 },
        req: { payload: fake.payload },
      }),
    ).rejects.toThrow(clearBaseMessage("productsPage", 1));
    fake.tables.products[0]._status = "draft";
    await expect(
      run(checkSiteRouting, {
        data: { productsPage: null },
        originalDoc: { productsPage: 1 },
        req: { payload: fake.payload },
      }),
    ).resolves.toEqual({ productsPage: null });
  });

  it("only takes a published page of the same company for company routing", async () => {
    const fake = fakeDb();
    addPage(fake, "pages", { id: 1, slug: "career", tenant: 1 });
    addPage(fake, "pages", { id: 2, slug: "career", tenant: 2 });
    addPage(fake, "pages", {
      id: 3,
      slug: "draft",
      tenant: 1,
      status: "draft",
    });
    const check = (routing: object) =>
      run(checkCompanyRouting, {
        data: { tenant: 1, routing },
        originalDoc: undefined,
        req: { payload: fake.payload },
      });
    await expect(check({ careerPage: 2 })).rejects.toThrow(OTHER_COMPANY_PAGE);
    await expect(check({ publicationPage: 2 })).rejects.toThrow(
      OTHER_COMPANY_PAGE,
    );
    await expect(check({ careerPage: 3 })).rejects.toThrow(
      pageNotPublishedMessage("draft"),
    );
    await expect(check({ careerPage: 1, publicationPage: 1 })).resolves.toEqual(
      { tenant: 1, routing: { careerPage: 1, publicationPage: 1 } },
    );
  });

  it("refuses to clear the career page while its jobs are live, not the Publication page", async () => {
    const fake = fakeDb();
    addPage(fake, "pages", { id: 1, slug: "career", tenant: 1 });
    addRecord(fake, "jobs", { id: 1, slug: "a", path: "/career", tenant: 1 });
    const clear = (routing: object) =>
      run(checkCompanyRouting, {
        data: { tenant: 1, routing },
        originalDoc: {
          tenant: 1,
          routing: { careerPage: 1, publicationPage: 1 },
        },
        req: { payload: fake.payload },
      });
    await expect(clear({ careerPage: null })).rejects.toThrow(
      clearBaseMessage("careerPage", 1),
    );
    await expect(clear({ publicationPage: null })).resolves.toBeDefined();
  });
});

describe("base page guard (FR-PM-58, FR-PM-59)", () => {
  function company() {
    const fake = fakeDb();
    addPage(fake, "pages", { id: 1, slug: "company", tenant: 1 });
    addPage(fake, "pages", { id: 2, slug: "career", parent: 1, tenant: 1 });
    addPage(fake, "pages", { id: 3, slug: "publication", tenant: 1 });
    addPage(fake, "pages", { id: 4, slug: "other", tenant: 1 });
    addPage(fake, "pages", { id: 5, slug: "career", tenant: 2 });
    settings(fake, 1, { careerPage: 2, publicationPage: 3 });
    for (let n = 1; n <= 7; n++) {
      addRecord(fake, "jobs", {
        id: n,
        slug: `j${n}`,
        path: "/company/career",
        tenant: 1,
      });
    }
    addRecord(fake, "jobs", {
      id: 8,
      slug: "draft",
      path: "/company/career",
      tenant: 1,
      status: "draft",
    });
    for (let n = 1; n <= 31; n++) {
      fake.tables.posts.push({ id: n, tenant: 1, _status: "published" });
    }
    return fake;
  }

  const trash = (fake: Fake, id: number) =>
    assertNotBasePage(fake.payload, undefined, "pages", id, "trash");

  it("names the Career page and its live jobs (PG-16)", async () => {
    const fake = company();
    await expect(trash(fake, 2)).rejects.toThrow(
      `"career" can't be trashed or unpublished. It's the Career page in Company settings. 7 jobs live under its URL and would stop working.`,
    );
  });

  it("blocks an ancestor of the Career page and names the page below", async () => {
    const fake = company();
    await expect(trash(fake, 1)).rejects.toThrow(
      `"company" can't be trashed or unpublished. It holds "career", which is the Career page in Company settings. 7 jobs live under its URL and would stop working.`,
    );
  });

  it("names the Publication page setting and the post breadcrumbs (PS-13)", async () => {
    const fake = company();
    await expect(trash(fake, 3)).rejects.toThrow(
      `Can't trash or unpublish "publication". It's set in Company settings › Publication page, used by the navbar search, the "All Updates" tab and 31 post breadcrumbs. Pick another page there first.`,
    );
  });

  it("uses delete wording for a delete", async () => {
    const fake = company();
    await expect(
      assertNotBasePage(fake.payload, undefined, "pages", 2, "delete"),
    ).rejects.toThrow(`"career" can't be deleted.`);
    await expect(
      assertNotBasePage(fake.payload, undefined, "pages", 3, "delete"),
    ).rejects.toThrow(`Can't delete "publication".`);
  });

  it("leaves other pages and other companies' pages alone", async () => {
    const fake = company();
    await expect(trash(fake, 4)).resolves.toBeUndefined();
    await expect(trash(fake, 5)).resolves.toBeUndefined();
  });

  it("guards the Site routing pages and their ancestors", async () => {
    const fake = fakeDb();
    addPage(fake, "shared-pages", { id: 1, slug: "products-solutions" });
    addPage(fake, "shared-pages", {
      id: 2,
      slug: "our-products",
      parent: 1,
      title: "Our Products",
    });
    fake.globalDocs["site-routing"] = { productsPage: 2 };
    for (let n = 1; n <= 24; n++) {
      addRecord(fake, "products", {
        id: n,
        slug: `p${n}`,
        path: "/products-solutions/our-products",
      });
    }
    await expect(
      assertNotBasePage(fake.payload, undefined, "shared-pages", 2, "trash"),
    ).rejects.toThrow(
      `"Our Products" can't be trashed or unpublished. It's the Our Products page in Site routing. 24 products live under its URL and would stop working.`,
    );
    await expect(
      assertNotBasePage(fake.payload, undefined, "shared-pages", 1, "delete"),
    ).rejects.toThrow(
      `It holds "Our Products", which is the Our Products page`,
    );
  });

  it("shapes the message for zero and one dependants", () => {
    expect(
      protectionMessage(
        "trash",
        "Career",
        { setting: "careerPage", target: "Career", direct: true },
        0,
      ),
    ).toBe(
      `"Career" can't be trashed or unpublished. It's the Career page in Company settings. Pick another page there first.`,
    );
    expect(
      protectionMessage(
        "trash",
        "Career",
        { setting: "careerPage", target: "Career", direct: true },
        1,
      ),
    ).toContain("1 job lives under its URL");
  });

  it("blocks trashing through the validate hook and ignores other saves", async () => {
    const fake = company();
    const hook = (data: object, id = 2, originalDoc: object = { id }) =>
      run(keepBasePagesOutOfTheTrash, {
        collection: { slug: "pages" },
        data,
        originalDoc,
        req: { payload: fake.payload },
      });
    await expect(hook({ deletedAt: "2026-11-03" })).rejects.toThrow(
      "can't be trashed or unpublished",
    );
    await expect(hook({ title: "x" })).resolves.toEqual({ title: "x" });
    await expect(
      hook({ deletedAt: "2026-11-03" }, 2, { id: 2, deletedAt: "earlier" }),
    ).resolves.toBeDefined();
  });

  it("blocks unpublishing but not a draft save of a published page", async () => {
    const fake = company();
    const after = (previousStatus: string) =>
      run(keepBasePagesPublished, {
        collection: { slug: "pages" },
        doc: { id: 2 },
        previousDoc: { _status: previousStatus },
        req: { payload: fake.payload },
      });
    await expect(after("published")).resolves.toEqual({ id: 2 });
    fake.tables.pages.find((row) => row.id === 2)!._status = "draft";
    await expect(after("published")).rejects.toThrow(
      "can't be trashed or unpublished",
    );
    await expect(after("draft")).resolves.toEqual({ id: 2 });
  });

  it("blocks deleting through the delete hook", async () => {
    const fake = company();
    await expect(
      run(keepBasePagesOnDelete, {
        collection: { slug: "pages" },
        id: 3,
        req: { payload: fake.payload },
      }),
    ).rejects.toThrow(`Can't delete "publication"`);
  });

  it("is wired into pages and shared pages", () => {
    for (const collection of [Pages, SharedPages]) {
      expect(collection.hooks!.beforeValidate).toContain(
        keepBasePagesOutOfTheTrash,
      );
      expect(collection.hooks!.afterChange).toContain(keepBasePagesPublished);
      expect(collection.hooks!.beforeDelete).toContain(keepBasePagesOnDelete);
    }
  });
});

describe("getPublicationPage", () => {
  it("returns the company's live Publication page with its paths", async () => {
    const fake = fakeDb();
    addPage(fake, "pages", {
      id: 3,
      slug: "publication",
      title: "Publication",
    });
    settings(fake, 1, { publicationPage: 3 });
    expect(await getPublicationPage(fake.payload, 1)).toEqual({
      id: "3",
      title: "Publication",
      paths: { en: "/publication", id: "/publication" },
    });
  });

  it("returns null when unset, unpublished, trashed or another company's", async () => {
    const fake = fakeDb();
    expect(await getPublicationPage(fake.payload, 1)).toBeNull();
    addPage(fake, "pages", { id: 3, slug: "a", status: "draft" });
    addPage(fake, "pages", { id: 4, slug: "b", deletedAt: "2026-11-03" });
    addPage(fake, "pages", { id: 5, slug: "c", tenant: 2 });
    for (const id of [3, 4, 5]) {
      fake.tables["tenant-settings"] = [
        { id: 1, tenant: 1, routing: { publicationPage: id } },
      ];
      expect(await getPublicationPage(fake.payload, 1)).toBeNull();
    }
  });
});
