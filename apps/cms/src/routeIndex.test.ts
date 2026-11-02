import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import type { AccessArgs, Block, Payload, Where } from "payload";
import { describe, expect, it } from "vitest";

import { Pages } from "./collections/Pages";
import { Routes } from "./collections/Routes";
import { SharedPages } from "./collections/SharedPages";
import {
  ROUTABLE_COLLECTIONS,
  conflictMessage,
  extractRefs,
  findReferrers,
  removeRoutes,
  routeRows,
  syncRouteIndex,
  syncRoutes,
} from "./routeIndex";
import { accessAs, findField, testUser } from "./testing";

const blocks = [
  {
    slug: "productShowcase",
    fields: [
      { name: "heading", type: "text", localized: true },
      { name: "product", type: "relationship", relationTo: "products" },
      {
        name: "items",
        type: "relationship",
        relationTo: ["products", "solutions"],
        hasMany: true,
      },
      { name: "image", type: "upload", relationTo: "media" },
      {
        name: "cta",
        type: "group",
        fields: [
          {
            type: "row",
            fields: [
              {
                name: "target",
                type: "relationship",
                relationTo: ["posts", "categories"],
              },
            ],
          },
        ],
      },
      {
        name: "cards",
        type: "array",
        fields: [{ name: "post", type: "relationship", relationTo: "posts" }],
      },
      {
        name: "nested",
        type: "blocks",
        blocks: [
          {
            slug: "inner",
            fields: [{ name: "job", type: "relationship", relationTo: "jobs" }],
          },
        ],
      },
      {
        type: "tabs",
        tabs: [
          {
            name: "extra",
            fields: [
              { name: "doc", type: "relationship", relationTo: "documents" },
            ],
          },
          {
            label: "Plain",
            fields: [
              { name: "other", type: "relationship", relationTo: "posts" },
            ],
          },
        ],
      },
    ],
  },
  { slug: "plain", fields: [{ name: "body", type: "text" }] },
] as unknown as Block[];

type Stored = {
  id: number;
  tenant: number | null;
  locale: string;
  path: string;
  refs: string[];
  doc: { relationTo: string; value: number };
};

type PageRow = {
  id: number;
  _status: string;
  deletedAt?: string | null;
  tenant?: number | null;
  path: Record<string, string>;
  layout?: unknown[];
};

function matches(row: Stored, where: Where): boolean {
  const clauses = (where as { and?: Where[] }).and ?? [where];
  return (clauses as Record<string, Record<string, unknown>>[]).every(
    (clause) =>
      Object.entries(clause).every(([key, condition]) => {
        if (key === "id") return true;
        if (key === "doc") {
          const wanted = condition.equals as Stored["doc"];
          return (
            row.doc.relationTo === wanted.relationTo &&
            row.doc.value === wanted.value
          );
        }
        return (
          (row as unknown as Record<string, unknown>)[key] === condition.equals
        );
      }),
  );
}

function fakeStore(pages: PageRow[] = []) {
  const routes: Stored[] = [];
  let next = 1;
  const unique = (data: Omit<Stored, "id">, skip?: number) =>
    routes.some(
      (row) =>
        row.id !== skip &&
        row.tenant === data.tenant &&
        row.locale === data.locale &&
        row.path === data.path,
    );
  const payload = {
    find: async (args: { collection: string; where: Where }) => ({
      docs: routes
        .filter((row) => matches(row, args.where))
        .map((row) => structuredClone(row)),
    }),
    findByID: async (args: { id: number }) => {
      const found = pages.find((page) => page.id === args.id);
      if (!found) throw new Error("Not Found");
      return structuredClone(found);
    },
    create: async (args: { data: Omit<Stored, "id"> }) => {
      if (unique(args.data)) throw new Error("duplicate key");
      const row = { id: next++, ...structuredClone(args.data) };
      routes.push(row);
      return row;
    },
    update: async (args: { id: number; data: Omit<Stored, "id"> }) => {
      const row = routes.find((entry) => entry.id === args.id)!;
      Object.assign(row, structuredClone(args.data));
      return row;
    },
    delete: async (args: { id?: number; where?: Where }) => {
      const doomed = routes.filter((row) =>
        args.id !== undefined ? row.id === args.id : matches(row, args.where!),
      );
      for (const row of doomed) routes.splice(routes.indexOf(row), 1);
      return { docs: doomed };
    },
  } as unknown as Payload;
  return { payload, routes, pages };
}

const published = (id: number, extra: Partial<PageRow> = {}): PageRow => ({
  id,
  _status: "published",
  tenant: 1,
  path: { en: `/page-${id}`, id: `/halaman-${id}` },
  layout: [],
  ...extra,
});

describe("the routes collection (FR-PM-12)", () => {
  it("is hidden from the admin navigation", () => {
    expect(Routes.admin?.hidden).toBe(true);
  });

  it("lets only Super Admins read and nobody write through the API", () => {
    const users = [
      testUser(["super-admin"]),
      testUser(["tenant-editor"], [1]),
      testUser(["tenant-viewer"], [1]),
      null,
    ];
    expect(users.map((user) => accessAs(Routes, "read", user))).toEqual([
      true,
      false,
      false,
      false,
    ]);
    for (const key of ["create", "update", "delete"] as const) {
      expect(users.map((user) => accessAs(Routes, key, user))).toEqual([
        false,
        false,
        false,
        false,
      ]);
    }
    expect(
      (Routes.access!.create as (args: AccessArgs) => boolean)({
        req: { user: testUser(["super-admin"]) },
      } as AccessArgs),
    ).toBe(false);
  });

  it("stores tenant, locale, path, doc and refs", () => {
    expect(findField(Routes.fields, "tenant")).toMatchObject({
      type: "relationship",
      relationTo: "tenants",
    });
    expect(
      (findField(Routes.fields, "tenant") as { required?: boolean }).required,
    ).toBeFalsy();
    expect(findField(Routes.fields, "locale")).toMatchObject({
      type: "select",
      required: true,
    });
    expect(findField(Routes.fields, "path")).toMatchObject({
      type: "text",
      required: true,
    });
    expect(findField(Routes.fields, "doc")).toMatchObject({
      type: "relationship",
      relationTo: [...ROUTABLE_COLLECTIONS],
      required: true,
    });
    expect(findField(Routes.fields, "refs")).toMatchObject({ type: "json" });
  });

  it("declares a unique (tenant, locale, path) index", () => {
    expect(Routes.indexes).toEqual([
      { fields: ["tenant", "locale", "path"], unique: true },
    ]);
  });

  it("creates that index NULLS NOT DISTINCT in a committed migration (FR-PM-13)", () => {
    const dir = path.join(
      path.dirname(fileURLToPath(import.meta.url)),
      "migrations",
    );
    const file = readdirSync(dir).find(
      (name) => name.includes("dilm_99_routes_index") && name.endsWith(".ts"),
    )!;
    expect(readFileSync(path.join(dir, file), "utf8")).toMatch(
      /CREATE UNIQUE INDEX "tenant_locale_path_idx" ON "routes" USING btree \("tenant_id","locale","path"\) NULLS NOT DISTINCT/,
    );
  });

  it("is kept in step by the page and shared page hooks (FR-PM-14)", () => {
    expect(Pages.hooks?.afterChange).toContain(syncRoutes);
    expect(Pages.hooks?.beforeDelete).toContain(removeRoutes);
    expect(SharedPages.hooks?.afterChange).toContain(syncRoutes);
    expect(SharedPages.hooks?.beforeDelete).toContain(removeRoutes);
  });
});

describe("extractRefs (FR-PM-50)", () => {
  it("lists every record a block references, however deep", () => {
    const layout = [
      {
        blockType: "productShowcase",
        heading: "x",
        product: 3,
        items: [
          { relationTo: "products", value: 4 },
          { relationTo: "solutions", value: 5 },
        ],
        image: 9,
        cta: { target: { relationTo: "categories", value: 2 } },
        cards: [{ post: 7 }, { post: { id: 8 } }],
        nested: [{ blockType: "inner", job: 6 }],
        extra: { doc: 11 },
        other: 12,
      },
      { blockType: "plain", body: "text" },
    ];
    expect(extractRefs(layout, blocks)).toEqual([
      "categories:2",
      "documents:11",
      "jobs:6",
      "posts:12",
      "posts:7",
      "posts:8",
      "products:3",
      "products:4",
      "solutions:5",
    ]);
  });

  it("skips uploads, empty values, unknown blocks and non-arrays", () => {
    expect(
      extractRefs(
        [
          { blockType: "productShowcase", product: null, items: [], image: 1 },
          { blockType: "ghost", product: 1 },
        ],
        blocks,
      ),
    ).toEqual([]);
    expect(extractRefs(undefined, blocks)).toEqual([]);
    expect(extractRefs("nope", blocks)).toEqual([]);
  });

  it("de-duplicates repeated references", () => {
    expect(
      extractRefs(
        [
          { blockType: "productShowcase", product: 3 },
          { blockType: "productShowcase", product: 3 },
        ],
        blocks,
      ),
    ).toEqual(["products:3"]);
  });

  it("reads references stored per language", () => {
    const localized = [
      {
        slug: "x",
        fields: [
          {
            name: "pick",
            type: "relationship",
            relationTo: "posts",
            localized: true,
          },
        ],
      },
    ] as unknown as Block[];
    expect(
      extractRefs([{ blockType: "x", pick: { en: 1, id: 2 } }], localized),
    ).toEqual(["posts:1", "posts:2"]);
  });
});

describe("routeRows", () => {
  it("writes one row per language for a published page", () => {
    expect(routeRows("pages", published(1))).toEqual([
      { tenant: "1", locale: "en", path: "/page-1", refs: [] },
      { tenant: "1", locale: "id", path: "/halaman-1", refs: [] },
    ]);
  });

  it("gives shared pages a null tenant", () => {
    expect(
      routeRows("shared-pages", published(1, { tenant: 7 })).map(
        (row) => row.tenant,
      ),
    ).toEqual([null, null]);
  });

  it("writes nothing for drafts or trashed pages", () => {
    expect(routeRows("pages", published(1, { _status: "draft" }))).toEqual([]);
    expect(
      routeRows("pages", published(1, { deletedAt: "2026-11-02" })),
    ).toEqual([]);
  });

  it("skips a language that has no path", () => {
    expect(
      routeRows("pages", published(1, { path: { en: "/only" } })).map(
        (row) => row.locale,
      ),
    ).toEqual(["en"]);
  });

  it("leaves refs empty for a page that only redirects", () => {
    const rows = routeRows(
      "pages",
      {
        ...published(1),
        redirectTo: { type: "internal", internalPath: "/elsewhere" },
        layout: [{ blockType: "productShowcase", product: 3 }],
      },
      blocks,
    );
    expect(rows[0].refs).toEqual([]);
    expect(
      routeRows(
        "pages",
        {
          ...published(1),
          layout: [{ blockType: "productShowcase", product: 3 }],
        },
        blocks,
      )[0].refs,
    ).toEqual(["products:3"]);
  });
});

describe("syncRouteIndex lifecycle (FR-PM-14)", () => {
  it("adds rows on publish and writes none for a draft", async () => {
    const store = fakeStore([published(1, { _status: "draft" }), published(2)]);
    await syncRouteIndex(store.payload, "pages", 1);
    expect(store.routes).toEqual([]);
    await syncRouteIndex(store.payload, "pages", 2);
    expect(store.routes.map((row) => `${row.locale}${row.path}`)).toEqual([
      "en/page-2",
      "id/halaman-2",
    ]);
  });

  it("is idempotent", async () => {
    const store = fakeStore([published(1)]);
    await syncRouteIndex(store.payload, "pages", 1);
    const first = structuredClone(store.routes);
    await syncRouteIndex(store.payload, "pages", 1);
    expect(store.routes).toEqual(first);
  });

  it("updates rows when the path changes", async () => {
    const store = fakeStore([published(1)]);
    await syncRouteIndex(store.payload, "pages", 1);
    store.pages[0].path = { en: "/moved", id: "/pindah" };
    await syncRouteIndex(store.payload, "pages", 1);
    expect(store.routes.map((row) => row.path)).toEqual(["/moved", "/pindah"]);
    expect(store.routes).toHaveLength(2);
  });

  it("drops the row of a language that lost its path", async () => {
    const store = fakeStore([published(1)]);
    await syncRouteIndex(store.payload, "pages", 1);
    store.pages[0].path = { en: "/page-1" };
    await syncRouteIndex(store.payload, "pages", 1);
    expect(store.routes.map((row) => row.locale)).toEqual(["en"]);
  });

  it("removes rows on unpublish", async () => {
    const store = fakeStore([published(1)]);
    await syncRouteIndex(store.payload, "pages", 1);
    store.pages[0]._status = "draft";
    await syncRouteIndex(store.payload, "pages", 1);
    expect(store.routes).toEqual([]);
  });

  it("removes rows on trash and brings them back on restore", async () => {
    const store = fakeStore([published(1)]);
    await syncRouteIndex(store.payload, "pages", 1);
    store.pages[0].deletedAt = "2026-11-02";
    await syncRouteIndex(store.payload, "pages", 1);
    expect(store.routes).toEqual([]);
    store.pages[0].deletedAt = null;
    await syncRouteIndex(store.payload, "pages", 1);
    expect(store.routes).toHaveLength(2);
  });

  it("removes rows when the page is gone", async () => {
    const store = fakeStore([published(1)]);
    await syncRouteIndex(store.payload, "pages", 1);
    store.pages.splice(0, 1);
    await syncRouteIndex(store.payload, "pages", 1);
    expect(store.routes).toEqual([]);
  });

  it("removes rows through the delete hook", async () => {
    const store = fakeStore([published(1), published(2)]);
    await syncRouteIndex(store.payload, "pages", 1);
    await syncRouteIndex(store.payload, "pages", 2);
    await removeRoutes({
      collection: { slug: "pages" },
      id: 1,
      req: { payload: store.payload },
    } as unknown as Parameters<typeof removeRoutes>[0]);
    expect(store.routes.map((row) => row.doc.value)).toEqual([2, 2]);
  });

  it("syncs through the change hook and returns the document", async () => {
    const store = fakeStore([published(1)]);
    const doc = { id: 1 };
    const result = await syncRoutes({
      collection: { slug: "pages" },
      doc,
      req: { payload: store.payload },
    } as unknown as Parameters<typeof syncRoutes>[0]);
    expect(result).toBe(doc);
    expect(store.routes).toHaveLength(2);
  });

  it("keeps the same path apart for two companies", async () => {
    const store = fakeStore([
      published(1, { tenant: 1, path: { en: "/same", id: "/sama" } }),
      published(2, { tenant: 2, path: { en: "/same", id: "/sama" } }),
    ]);
    await syncRouteIndex(store.payload, "pages", 1);
    await syncRouteIndex(store.payload, "pages", 2);
    expect(store.routes).toHaveLength(4);
  });

  it("rejects a company page at a shared page's path (null tenant conflict)", async () => {
    const store = fakeStore([
      published(1, { tenant: null, path: { en: "/same", id: "/sama" } }),
      published(2, { tenant: 2, path: { en: "/same", id: "/sama" } }),
    ]);
    await syncRouteIndex(store.payload, "shared-pages", 1);
    await expect(syncRouteIndex(store.payload, "pages", 2)).rejects.toThrow(
      conflictMessage("/same", "en"),
    );
  });

  it("rejects a shared page at any company's path", async () => {
    const store = fakeStore([
      published(1, { tenant: 3, path: { en: "/same", id: "/sama" } }),
      published(2, { tenant: null, path: { en: "/same", id: "/sama" } }),
    ]);
    await syncRouteIndex(store.payload, "pages", 1);
    await expect(
      syncRouteIndex(store.payload, "shared-pages", 2),
    ).rejects.toThrow(/already used by another published page/);
  });

  it("rejects the same company at the same path", async () => {
    const store = fakeStore([
      published(1, { path: { en: "/same", id: "/sama" } }),
      published(2, { path: { en: "/same", id: "/sama" } }),
    ]);
    await syncRouteIndex(store.payload, "pages", 1);
    await expect(syncRouteIndex(store.payload, "pages", 2)).rejects.toThrow();
  });

  it("names the language when only the Indonesian address clashes", async () => {
    const store = fakeStore([
      published(1, { path: { en: "/a", id: "/sama" } }),
      published(2, { path: { en: "/b", id: "/sama" } }),
    ]);
    await syncRouteIndex(store.payload, "pages", 1);
    await expect(syncRouteIndex(store.payload, "pages", 2)).rejects.toThrow(
      /in ID/,
    );
  });

  it("does not clash with itself across a collection of the same id", async () => {
    const store = fakeStore([published(1, { tenant: null })]);
    await syncRouteIndex(store.payload, "shared-pages", 1);
    await expect(
      syncRouteIndex(store.payload, "shared-pages", 1),
    ).resolves.toBeUndefined();
  });
});

describe("findReferrers (FR-PM-50)", () => {
  async function seeded() {
    const store = fakeStore();
    const add = (
      tenant: number | null,
      locale: string,
      pathValue: string,
      refs: string[],
      doc: Stored["doc"],
    ) =>
      store.payload.create({
        collection: "routes",
        data: { tenant, locale, path: pathValue, refs, doc },
      } as never);
    await add(1, "en", "/a", ["products:1", "posts:2"], {
      relationTo: "pages",
      value: 10,
    });
    await add(1, "id", "/b", ["products:1"], {
      relationTo: "pages",
      value: 10,
    });
    await add(null, "en", "/c", ["products:12"], {
      relationTo: "shared-pages",
      value: 11,
    });
    return store.payload;
  }

  it("returns each referring document once with its paths", async () => {
    expect(await findReferrers(await seeded(), "products", 1)).toEqual([
      {
        collection: "pages",
        id: "10",
        tenant: "1",
        paths: { en: "/a", id: "/b" },
      },
    ]);
  });

  it("matches the exact record, not one that shares a prefix", async () => {
    expect(await findReferrers(await seeded(), "products", 12)).toEqual([
      {
        collection: "shared-pages",
        id: "11",
        tenant: null,
        paths: { en: "/c" },
      },
    ]);
  });

  it("returns nothing for an unreferenced record", async () => {
    expect(await findReferrers(await seeded(), "products", 99)).toEqual([]);
  });
});
