import type { CollectionAfterChangeHook, Payload } from "payload";
import { afterEach, describe, expect, it } from "vitest";

import { Pages } from "./collections/Pages";
import { SharedPages } from "./collections/SharedPages";
import {
  CASCADE_LIMIT,
  INCOMPLETE_MESSAGE,
  cascadeLimitMessage,
  cascadePathChange,
  freshBreadcrumbIds,
  previewPathChange,
  recordMoveSources,
  rejectOversizedCascade,
  writeAutoRedirect,
  type RecordMoveSource,
} from "./pathCascade";

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

function fakeDb() {
  const tables: Record<string, Row[]> = {
    pages: [],
    "shared-pages": [],
    routes: [],
    redirects: [],
  };
  let next = 100;
  const payload = {
    find: async (args: {
      collection: string;
      where?: Record<string, unknown>;
    }) => ({
      docs: (tables[args.collection] ?? [])
        .filter((row) => !args.where || holds(row, args.where))
        .map((row) => structuredClone(row)),
    }),
    findByID: async (args: { collection: string; id: number }) => {
      const found = tables[args.collection].find(
        (row) => String(row.id) === String(args.id),
      );
      if (!found) throw new Error("Not Found");
      return structuredClone(found);
    },
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
    delete: async (args: { collection: string; id: number }) => {
      const at = tables[args.collection].findIndex((row) => row.id === args.id);
      tables[args.collection].splice(at, 1);
      return {};
    },
  } as unknown as Payload;
  return { payload, tables };
}

type PageSeed = {
  id: number;
  slug: string | Record<string, string>;
  parent?: number | null;
  tenant?: number | null;
  status?: "published" | "draft";
  path?: Record<string, string>;
  idSlug?: string;
};

function addPage(
  tables: Record<string, Row[]>,
  table: "pages" | "shared-pages",
  seed: PageSeed,
) {
  const parent = seed.parent
    ? (tables[table].find((row) => row.id === seed.parent) as Row)
    : undefined;
  const base = (locale: string) =>
    ((parent?.path as Record<string, string> | undefined)?.[locale] ?? "") ||
    "";
  const slug =
    typeof seed.slug === "string"
      ? { en: seed.slug, id: seed.idSlug ?? null }
      : seed.slug;
  const path = seed.path ?? {
    en: `${base("en")}/${slug.en}`,
    id: `${base("id")}/${slug.id ?? slug.en}`,
  };
  const row: Row = {
    id: seed.id,
    slug,
    parent: seed.parent ?? null,
    tenant: table === "pages" ? (seed.tenant ?? 1) : null,
    _status: seed.status ?? "published",
    deletedAt: null,
    path,
  };
  tables[table].push(row);
  if (row._status === "published") {
    for (const locale of ["en", "id"]) {
      tables.routes.push({
        id: 1000 + tables.routes.length,
        tenant: row.tenant,
        locale,
        path: path[locale],
        refs: [],
        doc: { relationTo: table, value: seed.id },
      });
    }
  }
  return row;
}

function tree() {
  const { payload, tables } = fakeDb();
  addPage(tables, "pages", { id: 1, slug: "company" });
  addPage(tables, "pages", { id: 2, slug: "team", parent: 1 });
  addPage(tables, "pages", { id: 3, slug: "board", parent: 2 });
  addPage(tables, "pages", { id: 4, slug: "history", parent: 1 });
  addPage(tables, "pages", {
    id: 5,
    slug: "notes",
    parent: 1,
    status: "draft",
  });
  return { payload, tables };
}

afterEach(() => {
  recordMoveSources.length = 0;
});

describe("previewPathChange (PG-04)", () => {
  it("counts child pages, redirects and old and new URLs per locale", async () => {
    const { payload } = tree();
    const impact = await previewPathChange(
      payload,
      { collection: "pages", id: 1 },
      { slugs: { en: "about", id: "tentang" } },
    );
    expect(impact.urls).toEqual([
      { locale: "en", from: "/company", to: "/about" },
      { locale: "id", from: "/company", to: "/tentang" },
    ]);
    expect(impact.published).toBe(true);
    expect(impact.childPages).toBe(4);
    expect(impact.records).toBe(0);
    expect(impact.redirects).toBe(8);
    expect(impact.overLimit).toBe(false);
  });

  it("falls back to the English slug for a language without its own", async () => {
    const { payload } = tree();
    const impact = await previewPathChange(
      payload,
      { collection: "pages", id: 1 },
      { slugs: { en: "about" } },
    );
    expect(impact.urls.map((url) => url.to)).toEqual(["/about", "/about"]);
    expect(impact.redirects).toBe(8);
  });

  it("moves only the language that changes", async () => {
    const { payload } = tree();
    const impact = await previewPathChange(
      payload,
      { collection: "pages", id: 2 },
      { slugs: { id: "tim" } },
    );
    expect(impact.urls).toEqual([
      { locale: "en", from: "/company/team", to: "/company/team" },
      { locale: "id", from: "/company/team", to: "/company/tim" },
    ]);
    expect(impact.childPages).toBe(1);
    expect(impact.redirects).toBe(2);
  });

  it("follows a new parent", async () => {
    const { payload } = tree();
    const impact = await previewPathChange(
      payload,
      { collection: "pages", id: 3 },
      { parent: 4 },
    );
    expect(impact.urls.map((url) => url.to)).toEqual([
      "/company/history/board",
      "/company/history/board",
    ]);
    expect(impact.childPages).toBe(0);
    expect(impact.redirects).toBe(2);
  });

  it("reports nothing to move when the path stays the same", async () => {
    const { payload } = tree();
    const impact = await previewPathChange(
      payload,
      { collection: "pages", id: 1 },
      { slugs: { en: "company" } },
    );
    expect(impact).toMatchObject({ childPages: 0, redirects: 0, records: 0 });
  });

  it("creates no redirects for a page that has never been live (PG-06)", async () => {
    const { payload, tables } = fakeDb();
    addPage(tables, "pages", { id: 1, slug: "draft", status: "draft" });
    addPage(tables, "pages", {
      id: 2,
      slug: "kid",
      parent: 1,
      status: "draft",
    });
    const impact = await previewPathChange(
      payload,
      { collection: "pages", id: 1 },
      { slugs: { en: "renamed" } },
    );
    expect(impact.published).toBe(false);
    expect(impact.childPages).toBe(1);
    expect(impact.redirects).toBe(0);
  });

  it("gives a draft-only child no redirects while still counting it as moved", async () => {
    const { payload } = tree();
    const impact = await previewPathChange(
      payload,
      { collection: "pages", id: 1 },
      { slugs: { en: "about" } },
    );
    expect(impact.childPages).toBe(4);
    expect(impact.redirects).toBe(8);
  });

  it("lists the pages whose links follow, from routes.refs", async () => {
    const { payload, tables } = tree();
    addPage(tables, "pages", { id: 9, slug: "home-links", tenant: 1 });
    for (const row of tables.routes) {
      const doc = row.doc as { value: number };
      if (doc.value === 9) row.refs = ["pages:2"];
    }
    const impact = await previewPathChange(
      payload,
      { collection: "pages", id: 1 },
      { slugs: { en: "about" } },
    );
    expect(impact.links).toEqual([
      {
        collection: "pages",
        id: "9",
        tenant: "1",
        paths: { en: "/home-links", id: "/home-links" },
      },
    ]);
  });

  it("counts the records based on the page (FR-PM-10)", async () => {
    const { payload } = tree();
    const source: RecordMoveSource = async ({ pages }) => {
      const base = pages.find((page) => page.id === "2");
      if (!base) return [];
      return [1, 2].map((n) => ({
        collection: "jobs",
        id: String(n),
        tenant: "1",
        published: n === 1,
        moves: [
          {
            locale: "en",
            from: `/company/team/j${n}`,
            to: `${base.paths.en}/j${n}`,
          },
          {
            locale: "id",
            from: `/company/team/j${n}`,
            to: `${base.paths.id}/j${n}`,
          },
        ],
        apply: async () => undefined,
      }));
    };
    recordMoveSources.push(source);
    const impact = await previewPathChange(
      payload,
      { collection: "pages", id: 1 },
      { slugs: { en: "about" } },
    );
    expect(impact.records).toBe(2);
    expect(impact.redirects).toBe(8 + 2);
  });

  it("rejects a cascade over 500 documents with the PG-05 message (NFR-PM-02)", async () => {
    const { payload, tables } = fakeDb();
    addPage(tables, "pages", { id: 1, slug: "big" });
    for (let n = 0; n < CASCADE_LIMIT + 1; n++) {
      addPage(tables, "pages", { id: 10 + n, slug: `k${n}`, parent: 1 });
    }
    const impact = await previewPathChange(
      payload,
      { collection: "pages", id: 1 },
      { slugs: { en: "bigger" } },
    );
    expect(impact.overLimit).toBe(true);
    expect(impact.message).toBe(
      "This change would move 501 pages and records. One change can move up to 500. Move some child pages first, then try again.",
    );
  });

  it("allows exactly 500 documents", async () => {
    const { payload, tables } = fakeDb();
    addPage(tables, "pages", { id: 1, slug: "big" });
    for (let n = 0; n < CASCADE_LIMIT; n++) {
      addPage(tables, "pages", { id: 10 + n, slug: `k${n}`, parent: 1 });
    }
    const impact = await previewPathChange(
      payload,
      { collection: "pages", id: 1 },
      { slugs: { en: "bigger" } },
    );
    expect(impact.overLimit).toBe(false);
    expect(impact.childPages).toBe(CASCADE_LIMIT);
  });

  it("counts records toward the 500 limit", async () => {
    const { payload, tables } = fakeDb();
    addPage(tables, "pages", { id: 1, slug: "big" });
    for (let n = 0; n < 300; n++) {
      addPage(tables, "pages", { id: 10 + n, slug: `k${n}`, parent: 1 });
    }
    recordMoveSources.push(async () =>
      Array.from({ length: 201 }, (_, n) => ({
        collection: "jobs",
        id: String(n),
        tenant: "1",
        published: true,
        moves: [{ locale: "en", from: "/a", to: "/b" }],
        apply: async () => undefined,
      })),
    );
    const impact = await previewPathChange(
      payload,
      { collection: "pages", id: 1 },
      { slugs: { en: "bigger" } },
    );
    expect(impact.overLimit).toBe(true);
    expect(impact.message).toBe(cascadeLimitMessage(501));
  });

  it("handles shared pages with no tenant", async () => {
    const { payload, tables } = fakeDb();
    addPage(tables, "shared-pages", { id: 1, slug: "products" });
    addPage(tables, "shared-pages", { id: 2, slug: "item", parent: 1 });
    const impact = await previewPathChange(
      payload,
      { collection: "shared-pages", id: 1 },
      { slugs: { en: "our-products" } },
    );
    expect(impact.childPages).toBe(1);
    expect(impact.redirects).toBe(4);
  });
});

describe("rejectOversizedCascade", () => {
  const hook = (
    payload: Payload,
    data: Record<string, unknown>,
    context = {},
  ) =>
    rejectOversizedCascade({
      collection: { slug: "pages" },
      data,
      operation: "update",
      originalDoc: { id: 1 },
      req: { payload, context, locale: "en" },
    } as never);

  it("throws the PG-05 message when publishing a rename moves over 500", async () => {
    const { payload, tables } = fakeDb();
    addPage(tables, "pages", { id: 1, slug: "big" });
    for (let n = 0; n < 501; n++) {
      addPage(tables, "pages", { id: 10 + n, slug: `k${n}`, parent: 1 });
    }
    await expect(
      hook(payload, { slug: "bigger", _status: "published" }),
    ).rejects.toThrow(cascadeLimitMessage(501));
  });

  it("lets a draft save through", async () => {
    const { payload, tables } = fakeDb();
    addPage(tables, "pages", { id: 1, slug: "big" });
    for (let n = 0; n < 501; n++) {
      addPage(tables, "pages", { id: 10 + n, slug: `k${n}`, parent: 1 });
    }
    const data = { slug: "bigger", _status: "draft" };
    await expect(hook(payload, data)).resolves.toBe(data);
  });

  it("marks the request so child saves skip the check", async () => {
    const { payload } = tree();
    const context: Record<string, unknown> = {};
    await hook(payload, { slug: "about", _status: "published" }, context);
    expect(context).toMatchObject({
      pathCascadeChecked: true,
      pathCascadeRoot: "1",
    });
  });

  it("is registered on pages and shared pages", () => {
    expect(Pages.hooks?.beforeChange).toContain(rejectOversizedCascade);
    expect(SharedPages.hooks?.beforeChange).toContain(rejectOversizedCascade);
    expect(Pages.hooks?.afterChange).toContain(cascadePathChange);
    expect(SharedPages.hooks?.afterChange).toContain(cascadePathChange);
  });

  it("runs the redirects before the route index is rewritten", () => {
    const hooks = Pages.hooks!.afterChange!;
    expect(hooks.indexOf(cascadePathChange)).toBeLessThan(
      hooks.findIndex((entry) => entry.name === "syncRoutes"),
    );
  });
});

describe("writeAutoRedirect (FR-PM-16)", () => {
  const find = (tables: Record<string, Row[]>) =>
    tables.redirects.map((row) => [
      row.from,
      (row.to as { internalPath: string }).internalPath,
      row.tenant ?? null,
      row.locale,
      row.origin,
    ]);

  it("writes an automatic 301 scoped to the tenant", async () => {
    const { payload, tables } = fakeDb();
    await writeAutoRedirect(
      payload,
      undefined,
      { tenant: "1", locale: "en" },
      "/a",
      "/b",
    );
    expect(find(tables)).toEqual([["/a", "/b", 1, "en", "auto"]]);
  });

  it("writes a redirect with no tenant for shared pages", async () => {
    const { payload, tables } = fakeDb();
    await writeAutoRedirect(
      payload,
      undefined,
      { tenant: null, locale: "id" },
      "/a",
      "/b",
    );
    expect(find(tables)).toEqual([["/a", "/b", null, "id", "auto"]]);
  });

  it("repoints redirects that pointed at the old path (chain collapse)", async () => {
    const { payload, tables } = fakeDb();
    await writeAutoRedirect(
      payload,
      undefined,
      { tenant: "1", locale: "en" },
      "/a",
      "/b",
    );
    await writeAutoRedirect(
      payload,
      undefined,
      { tenant: "1", locale: "en" },
      "/b",
      "/c",
    );
    expect(find(tables)).toEqual([
      ["/a", "/c", 1, "en", "auto"],
      ["/b", "/c", 1, "en", "auto"],
    ]);
  });

  it("repoints manual redirects too", async () => {
    const { payload, tables } = fakeDb();
    tables.redirects.push({
      id: 1,
      from: "/legacy",
      to: { type: "internal", internalPath: "/a" },
      tenant: 1,
      locale: "en",
      origin: "manual",
    });
    await writeAutoRedirect(
      payload,
      undefined,
      { tenant: "1", locale: "en" },
      "/a",
      "/b",
    );
    expect(find(tables)[0]).toEqual(["/legacy", "/b", 1, "en", "manual"]);
  });

  it("leaves the other language alone", async () => {
    const { payload, tables } = fakeDb();
    tables.redirects.push({
      id: 1,
      from: "/legacy",
      to: { type: "internal", internalPath: "/a" },
      tenant: 1,
      locale: "id",
      origin: "auto",
    });
    await writeAutoRedirect(
      payload,
      undefined,
      { tenant: "1", locale: "en" },
      "/a",
      "/b",
    );
    expect(find(tables)[0]).toEqual(["/legacy", "/a", 1, "id", "auto"]);
  });

  it("does not repoint another company's redirects for a company page", async () => {
    const { payload, tables } = fakeDb();
    tables.redirects.push({
      id: 1,
      from: "/legacy",
      to: { type: "internal", internalPath: "/a" },
      tenant: 2,
      locale: "en",
      origin: "auto",
    });
    await writeAutoRedirect(
      payload,
      undefined,
      { tenant: "1", locale: "en" },
      "/a",
      "/b",
    );
    expect(find(tables)[0]).toEqual(["/legacy", "/a", 2, "en", "auto"]);
  });

  it("repoints every company's redirects for a shared page", async () => {
    const { payload, tables } = fakeDb();
    for (const tenant of [1, 2]) {
      tables.redirects.push({
        id: tenant,
        from: `/legacy${tenant}`,
        to: { type: "internal", internalPath: "/a" },
        tenant,
        locale: "en",
        origin: "auto",
      });
    }
    await writeAutoRedirect(
      payload,
      undefined,
      { tenant: null, locale: "en" },
      "/a",
      "/b",
    );
    expect(
      find(tables)
        .slice(0, 2)
        .map((row) => row[1]),
    ).toEqual(["/b", "/b"]);
  });

  it("drops a redirect that would point at itself after a move back", async () => {
    const { payload, tables } = fakeDb();
    await writeAutoRedirect(
      payload,
      undefined,
      { tenant: "1", locale: "en" },
      "/a",
      "/b",
    );
    await writeAutoRedirect(
      payload,
      undefined,
      { tenant: "1", locale: "en" },
      "/b",
      "/a",
    );
    expect(find(tables)).toEqual([["/b", "/a", 1, "en", "auto"]]);
  });

  it("keeps a manual redirect already sitting on the old path", async () => {
    const { payload, tables } = fakeDb();
    tables.redirects.push({
      id: 1,
      from: "/a",
      to: { type: "internal", internalPath: "/elsewhere" },
      tenant: 1,
      locale: "en",
      origin: "manual",
    });
    await writeAutoRedirect(
      payload,
      undefined,
      { tenant: "1", locale: "en" },
      "/a",
      "/b",
    );
    expect(find(tables)).toEqual([["/a", "/elsewhere", 1, "en", "manual"]]);
  });

  it("does nothing when the path is the same", async () => {
    const { payload, tables } = fakeDb();
    await writeAutoRedirect(
      payload,
      undefined,
      { tenant: "1", locale: "en" },
      "/a",
      "/a",
    );
    expect(tables.redirects).toEqual([]);
  });
});

describe("cascadePathChange hook", () => {
  const run = (
    payload: Payload,
    id: number,
    context: Record<string, unknown> = {},
  ) =>
    (cascadePathChange as CollectionAfterChangeHook)({
      collection: { slug: "pages" },
      doc: { id },
      req: { payload, context },
    } as never);

  function renamed() {
    const { payload, tables } = tree();
    for (const row of tables.pages) {
      const path = row.path as Record<string, string>;
      for (const locale of ["en", "id"]) {
        path[locale] = path[locale].replace("/company", "/about");
      }
    }
    return { payload, tables };
  }

  it("writes a 301 per locale from the published path to the new one", async () => {
    const { payload, tables } = renamed();
    await run(payload, 2);
    expect(
      tables.redirects.map((row) => [
        row.locale,
        row.from,
        row.tenant,
        row.origin,
      ]),
    ).toEqual([
      ["en", "/company/team", 1, "auto"],
      ["id", "/company/team", 1, "auto"],
    ]);
  });

  it("writes nothing for a page that has never been published", async () => {
    const { payload, tables } = renamed();
    await run(payload, 5);
    expect(tables.redirects).toEqual([]);
  });

  it("writes nothing when the path did not change", async () => {
    const { payload, tables } = tree();
    await run(payload, 2);
    expect(tables.redirects).toEqual([]);
  });

  it("collapses chains created by the same save", async () => {
    const { payload, tables } = renamed();
    tables.redirects.push({
      id: 1,
      from: "/old-team",
      to: { type: "internal", internalPath: "/company/team" },
      tenant: 1,
      locale: "en",
      origin: "auto",
    });
    await run(payload, 2);
    expect(
      tables.redirects.find((row) => row.from === "/old-team")?.to,
    ).toMatchObject({ internalPath: "/about/team" });
  });

  it("moves the records based on the page and redirects the published ones", async () => {
    const { payload, tables } = renamed();
    const moved: string[] = [];
    recordMoveSources.push(async ({ pages }) => [
      {
        collection: "jobs",
        id: "7",
        tenant: "1",
        published: true,
        moves: [
          {
            locale: "en",
            from: "/company/team/j",
            to: `${pages[0].paths.en}/j`,
          },
        ],
        apply: async () => {
          moved.push("7");
        },
      },
      {
        collection: "jobs",
        id: "8",
        tenant: "1",
        published: false,
        moves: [
          {
            locale: "en",
            from: "/company/team/k",
            to: `${pages[0].paths.en}/k`,
          },
        ],
        apply: async () => {
          moved.push("8");
        },
      },
    ]);
    await run(payload, 2);
    expect(moved).toEqual(["7", "8"]);
    expect(
      tables.redirects.filter((row) => (row.from as string).endsWith("/j")),
    ).toHaveLength(1);
    expect(
      tables.redirects.filter((row) => (row.from as string).endsWith("/k")),
    ).toHaveLength(0);
  });

  it("fails loudly when the saving page's move did not persist", async () => {
    const { payload } = tree();
    await expect(run(payload, 2, { pathCascadeRoot: "2" })).rejects.toThrow(
      INCOMPLETE_MESSAGE,
    );
  });

  it("fails loudly when a published child was left behind", async () => {
    const { payload, tables } = tree();
    const page = tables.pages.find((row) => row.id === 1)!;
    page.path = { en: "/about", id: "/about" };
    await expect(run(payload, 1, { pathCascadeRoot: "1" })).rejects.toThrow(
      INCOMPLETE_MESSAGE,
    );
  });
});

describe("freshBreadcrumbIds", () => {
  it("drops the row ids so each language gets its own rows", async () => {
    const result = await freshBreadcrumbIds({
      data: { breadcrumbs: [{ id: "x", doc: 1, label: "a", url: "/a" }] },
    } as never);
    expect(result).toEqual({
      breadcrumbs: [{ doc: 1, label: "a", url: "/a" }],
    });
  });

  it("leaves data without breadcrumbs alone", async () => {
    const data = { title: "a" };
    expect(await freshBreadcrumbIds({ data } as never)).toBe(data);
  });
});
