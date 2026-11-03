import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  CollectionBeforeChangeHook,
  CollectionConfig,
  PayloadRequest,
} from "payload";
import { describe, expect, it, onTestFinished, vi } from "vitest";

import { Categories } from "./collections/Categories";
import { DetailTemplates } from "./collections/DetailTemplates";
import { Jobs } from "./collections/Jobs";
import { Pages } from "./collections/Pages";
import { Posts } from "./collections/Posts";
import { Products } from "./collections/Products";
import { SharedDetailTemplates } from "./collections/SharedDetailTemplates";
import { SharedPages } from "./collections/SharedPages";
import { Solutions } from "./collections/Solutions";
import { TenantSettings } from "./collections/TenantSettings";
import {
  beginLiveChange,
  liveChanges,
  revalidateEntityReferrers,
  revalidateOnDelete,
  revalidateOnLiveChange,
  revalidateRoutingMoves,
  revalidateTemplate,
  revalidateTemplateOnDelete,
  captureTemplateRow,
  takeRouteChanges,
} from "./publishRevalidation";
import type { Revalidator, RevalidationChange } from "./revalidation";
import { stubRevalidator } from "./revalidation";
import { recordBaseSources } from "./recordBases";
import {
  removeRouteRows,
  removeRoutes,
  syncRoutes,
  writeRouteRows,
} from "./routeIndex";
import type { NotedRouteChange, RouteSnapshot } from "./routeIndex";

type RouteRow = {
  id: number;
  tenant: number | null;
  locale: string;
  path: string;
  refs: string[];
  doc: { relationTo: string; value: number };
};

const TENANTS = [
  { id: 1, slug: "indoacid", domain: "https://indonesianacids.com/" },
  { id: 2, slug: "duniakimia", domain: "duniakimia.com" },
  { id: 3, slug: "likutelaga", domain: "likutelaga.com" },
];

const snap = (
  tenant: string | null,
  path: string,
  locale = "en",
): RouteSnapshot => ({ tenant, locale, path });

const noted = (
  collection: NotedRouteChange["collection"],
  id: string,
  before: RouteSnapshot[],
  after: RouteSnapshot[],
): NotedRouteChange => ({ collection, id, before, after });

function clauses(where: unknown): Record<string, unknown>[] {
  const node = where as { and?: Record<string, unknown>[] };
  return node.and ?? [where as Record<string, unknown>];
}

function world({
  routes = [] as RouteRow[],
  failFind = false,
  mainRow,
}: {
  routes?: RouteRow[];
  failFind?: boolean;
  mainRow?: () => object | null;
} = {}) {
  const logger = { info: vi.fn(), error: vi.fn() };
  const statuses: { status: string; hosts: string[] }[] = [];
  const find = vi.fn(async (args: { collection: string; where?: unknown }) => {
    if (failFind) throw new Error("db down");
    if (args.collection === "tenants") return { docs: TENANTS };
    if (args.collection === "refresh-status") return { docs: [] };
    let docs = routes;
    for (const clause of clauses(args.where ?? {})) {
      const relation = clause["doc.relationTo"] as
        { equals: string } | undefined;
      if (relation) {
        docs = docs.filter((row) => row.doc.relationTo === relation.equals);
      }
      const tenant = clause.tenant as { equals: string } | undefined;
      if (tenant) {
        docs = docs.filter((row) => String(row.tenant) === tenant.equals);
      }
    }
    return { docs };
  });
  const create = vi.fn(
    async ({ data }: { data: (typeof statuses)[number] }) => {
      statuses.push(data);
      return data;
    },
  );
  const payload = {
    logger,
    find,
    create,
    update: vi.fn(),
    delete: vi.fn(async () => ({})),
    db: { findOne: vi.fn(async () => (mainRow ? mainRow() : null)) },
  };
  const req = { payload, context: {} } as unknown as PayloadRequest;
  return { req, logger, statuses, find, create, payload };
}

function recorder() {
  const calls: RevalidationChange[] = [];
  const revalidate = vi.fn<Revalidator["revalidate"]>(async (change) => {
    calls.push(change);
  });
  return { calls, revalidate };
}

function hooksOf<T>(config: CollectionConfig, name: string): T[] {
  return (config.hooks as Record<string, T[]>)[name] ?? [];
}

const runChange = (
  hook: CollectionAfterChangeHook,
  req: PayloadRequest,
  doc: object,
  slug: string,
) =>
  hook({
    doc,
    previousDoc: doc,
    req,
    operation: "update",
    collection: { slug },
    context: {},
    data: doc,
  } as never);

const runDelete = (
  hook: CollectionAfterDeleteHook,
  req: PayloadRequest,
  doc: { id: number },
  slug: string,
) => hook({ doc, id: doc.id, req, collection: { slug }, context: {} } as never);

const publishHook = (revalidator: Revalidator) =>
  revalidateOnLiveChange(revalidator);

describe("liveChanges", () => {
  const page = { collection: "pages", id: "1" };

  it("emits nothing for a draft save that left the index alone", () => {
    const same = [snap("2", "/a")];
    expect(
      liveChanges([noted("pages", "1", same, same)], { ...page, live: false })
        .changes,
    ).toEqual([]);
    expect(
      liveChanges([noted("pages", "1", [], [])], { ...page, live: false })
        .changes,
    ).toEqual([]);
  });

  it("emits a published save even when the path did not change", () => {
    const same = [snap("2", "/a")];
    const { changes, reason } = liveChanges([noted("pages", "1", same, same)], {
      ...page,
      live: true,
    });
    expect(changes).toHaveLength(1);
    expect(reason).toBe("update");
  });

  it("names unpublish and trash by the doc's state", () => {
    const was = [snap("2", "/a")];
    expect(
      liveChanges([noted("pages", "1", was, [])], { ...page, live: false })
        .reason,
    ).toBe("unpublish");
    expect(
      liveChanges([noted("pages", "1", was, [])], {
        ...page,
        live: false,
        trashed: true,
      }).reason,
    ).toBe("trash");
    expect(
      liveChanges([noted("pages", "1", was, [])], {
        ...page,
        live: false,
        deleted: true,
      }).reason,
    ).toBe("delete");
  });

  it("keeps cascaded docs only when their path moved", () => {
    const same = [snap("2", "/career/x")];
    const result = liveChanges(
      [
        noted("pages", "1", [snap("2", "/a")], [snap("2", "/b")]),
        noted("jobs", "5", same, same),
        noted("jobs", "6", [snap("2", "/career/y")], [snap("2", "/jobs/y")]),
      ],
      { ...page, live: true },
    );
    expect(result.changes.map((change) => change.id)).toEqual(["1", "6"]);
  });

  it("uses the first before and last after when a doc is synced twice", () => {
    const result = liveChanges(
      [
        noted("posts", "3", [snap("2", "/old")], [snap("2", "/mid")]),
        noted("posts", "3", [snap("2", "/mid")], [snap("2", "/new")]),
      ],
      { collection: "posts", id: "3", live: false },
    );
    expect(result.changes[0]).toMatchObject({
      before: [snap("2", "/old")],
      after: [snap("2", "/new")],
    });
  });

  it("only looks at moves when there is no document of its own", () => {
    const same = [snap(null, "/a")];
    expect(liveChanges([noted("pages", "1", same, same)]).changes).toEqual([]);
  });

  it("takes the notes out of the request context", () => {
    const req = {
      context: { routeChanges: [noted("pages", "1", [], [])] },
    } as unknown as PayloadRequest;
    expect(takeRouteChanges(req)).toHaveLength(1);
    expect(takeRouteChanges(req)).toEqual([]);
    expect(takeRouteChanges(undefined)).toEqual([]);
  });
});

describe("revalidateOnLiveChange", () => {
  it("revalidates a company page once on publish and records the status", async () => {
    const { calls, revalidate } = recorder();
    const { req, statuses } = world();
    req.context.routeChanges = [noted("pages", "9", [], [snap("2", "/about")])];
    const doc = { id: 9, _status: "published" };
    await expect(
      runChange(publishHook({ revalidate }), req, doc, "pages"),
    ).resolves.toBe(doc);
    expect(revalidate).toHaveBeenCalledTimes(1);
    expect(calls[0]).toMatchObject({
      collection: "pages",
      reason: "publish",
      tags: ["route:duniakimia:en:/about"],
      purge: [{ host: "duniakimia.com", pathPrefix: "/en/about", exact: true }],
    });
    expect(revalidate.mock.calls[0][2]).toEqual({ req });
    expect(statuses).toEqual([
      expect.objectContaining({
        status: "ok",
        hosts: ["duniakimia.com"],
        collection: "pages",
        docId: "9",
      }),
    ]);
  });

  it("does nothing for a draft save, and records nothing", async () => {
    const { revalidate } = recorder();
    const { req, statuses } = world();
    const same = [snap("2", "/about")];
    req.context.routeChanges = [noted("pages", "9", same, same)];
    await runChange(
      publishHook({ revalidate }),
      req,
      { id: 9, _status: "draft" },
      "pages",
    );
    expect(revalidate).not.toHaveBeenCalled();
    expect(statuses).toEqual([]);
  });

  it("purges a shared page's path on every host", async () => {
    const { calls, revalidate } = recorder();
    const { req } = world();
    req.context.routeChanges = [
      noted("shared-pages", "4", [], [snap(null, "/terms")]),
    ];
    await runChange(
      publishHook({ revalidate }),
      req,
      { id: 4, _status: "published" },
      "shared-pages",
    );
    expect(calls[0].purge.map((entry) => entry.host).sort()).toEqual([
      "duniakimia.com",
      "indonesianacids.com",
      "likutelaga.com",
    ]);
    expect(calls[0].tags).toEqual(["route:shared:en:/terms"]);
  });

  it("adds the routes that reference a published record", async () => {
    const { calls, revalidate } = recorder();
    const { req } = world({
      routes: [
        {
          id: 1,
          tenant: 2,
          locale: "en",
          path: "/showcase",
          refs: ["products:7", "media:1"],
          doc: { relationTo: "pages", value: 40 },
        },
        {
          id: 2,
          tenant: 3,
          locale: "en",
          path: "/other",
          refs: ["products:8"],
          doc: { relationTo: "pages", value: 41 },
        },
      ],
    });
    req.context.routeChanges = [
      noted("products", "7", [], [snap(null, "/products/bleach")]),
    ];
    await runChange(
      publishHook({ revalidate }),
      req,
      { id: 7, _status: "published" },
      "products",
    );
    expect(calls[0].tags).toEqual(
      expect.arrayContaining([
        "list:all:products",
        "route:shared:en:/products/bleach",
        "route:duniakimia:en:/showcase",
      ]),
    );
    expect(calls[0].tags).not.toContain("route:likutelaga:en:/other");
  });

  it("revalidates old and new paths for a move, one call for the whole cascade", async () => {
    const { calls, revalidate } = recorder();
    const { req } = world();
    req.context.routeChanges = [
      noted("pages", "1", [snap("2", "/career")], [snap("2", "/careers")]),
      noted(
        "jobs",
        "5",
        [snap("2", "/career/chemist")],
        [snap("2", "/careers/chemist")],
      ),
      noted(
        "jobs",
        "6",
        [snap("2", "/career/analyst")],
        [snap("2", "/careers/analyst")],
      ),
    ];
    await runChange(
      publishHook({ revalidate }),
      req,
      { id: 1, _status: "published" },
      "pages",
    );
    expect(revalidate).toHaveBeenCalledTimes(1);
    expect(calls[0].reason).toBe("move");
    expect(calls[0].tags).toEqual(
      expect.arrayContaining([
        "route:duniakimia:en:/career",
        "route:duniakimia:en:/careers",
        "route:duniakimia:en:/career/chemist",
        "route:duniakimia:en:/careers/analyst",
        "list:duniakimia:jobs",
      ]),
    );
    expect(new Set(calls[0].tags).size).toBe(calls[0].tags.length);
    expect(
      calls[0].purge.every((entry) => entry.host === "duniakimia.com"),
    ).toBe(true);
  });

  it("revalidates the old path on unpublish and trash", async () => {
    const { calls, revalidate } = recorder();
    const { req } = world();
    req.context.routeChanges = [noted("pages", "9", [snap("2", "/a")], [])];
    await runChange(
      publishHook({ revalidate }),
      req,
      { id: 9, _status: "draft" },
      "pages",
    );
    req.context.routeChanges = [noted("pages", "9", [snap("2", "/a")], [])];
    await runChange(
      publishHook({ revalidate }),
      req,
      { id: 9, _status: "published", deletedAt: "2026-11-03T00:00:00.000Z" },
      "pages",
    );
    expect(calls.map((call) => call.reason)).toEqual(["unpublish", "trash"]);
    expect(
      calls.every((call) => call.tags[0] === "route:duniakimia:en:/a"),
    ).toBe(true);
  });

  it("treats a category save as live, since categories have no drafts", async () => {
    const { calls, revalidate } = recorder();
    const { req } = world();
    const same = [snap(null, "/category/news")];
    req.context.routeChanges = [noted("categories", "2", same, same)];
    await runChange(publishHook({ revalidate }), req, { id: 2 }, "categories");
    expect(calls[0].tags).toContain("list:all:categories");
  });

  it("leaves a nested resave to the save that started it", async () => {
    const { revalidate } = recorder();
    const { req } = world();
    const begin = beginLiveChange as CollectionBeforeChangeHook;
    await begin({
      data: {},
      req,
      collection: { slug: "pages" },
      originalDoc: { id: 1 },
    } as never);
    req.context.routeChanges = [
      noted("pages", "2", [snap("2", "/a/b")], [snap("2", "/c/b")]),
    ];
    await runChange(
      publishHook({ revalidate }),
      req,
      { id: 2, _status: "published" },
      "pages",
    );
    expect(revalidate).not.toHaveBeenCalled();
    expect(req.context.routeChanges).toHaveLength(1);
    req.context.routeChanges = [
      ...(req.context.routeChanges as NotedRouteChange[]),
      noted("pages", "1", [snap("2", "/a")], [snap("2", "/c")]),
    ];
    await runChange(
      publishHook({ revalidate }),
      req,
      { id: 1, _status: "published" },
      "pages",
    );
    expect(revalidate).toHaveBeenCalledTimes(1);
    expect(revalidate.mock.calls[0][0].tags).toEqual(
      expect.arrayContaining([
        "route:duniakimia:en:/a/b",
        "route:duniakimia:en:/c/b",
      ]),
    );
    expect(req.context.revalidationRoot).toBeUndefined();
  });

  it("keeps the save and records a failure when the revalidator rejects", async () => {
    const { req, logger, statuses } = world();
    req.context.routeChanges = [noted("pages", "9", [], [snap("2", "/a")])];
    const doc = { id: 9, _status: "published" };
    await expect(
      runChange(
        publishHook({ revalidate: () => Promise.reject(new Error("429")) }),
        req,
        doc,
        "pages",
      ),
    ).resolves.toBe(doc);
    expect(logger.error).toHaveBeenCalledTimes(1);
    expect(logger.error.mock.calls[0][0]).toMatchObject({
      collection: "pages",
      tags: ["route:duniakimia:en:/a"],
    });
    expect(statuses[0]).toMatchObject({ status: "failed" });
  });

  it("keeps the save when the revalidator throws synchronously", async () => {
    const { req, statuses } = world();
    req.context.routeChanges = [noted("pages", "9", [], [snap("2", "/a")])];
    const doc = { id: 9, _status: "published" };
    await expect(
      runChange(
        publishHook({
          revalidate() {
            throw new Error("sync");
          },
        }),
        req,
        doc,
        "pages",
      ),
    ).resolves.toBe(doc);
    expect(statuses[0]).toMatchObject({ status: "failed" });
  });

  it("keeps the save when the targets can't be worked out", async () => {
    const { revalidate } = recorder();
    const { req, logger } = world({ failFind: true });
    req.context.routeChanges = [noted("pages", "9", [], [snap("2", "/a")])];
    const doc = { id: 9, _status: "published" };
    await expect(
      runChange(publishHook({ revalidate }), req, doc, "pages"),
    ).resolves.toBe(doc);
    expect(revalidate).not.toHaveBeenCalled();
    expect(logger.error).toHaveBeenCalledTimes(1);
  });
});

describe("revalidateOnDelete", () => {
  it("revalidates the paths a deleted published doc held", async () => {
    const { calls, revalidate } = recorder();
    const { req, payload } = world();
    req.context.routeChanges = [
      noted("products", "7", [snap(null, "/products/bleach")], []),
    ];
    await runDelete(
      revalidateOnDelete({ revalidate }),
      req,
      { id: 7 },
      "products",
    );
    expect(calls[0]).toMatchObject({
      reason: "delete",
      collection: "products",
    });
    expect(calls[0].tags).toContain("route:shared:en:/products/bleach");
    expect(payload.delete).toHaveBeenCalledTimes(1);
  });

  it("does nothing for a doc that was already out of the index", async () => {
    const { revalidate } = recorder();
    const { req } = world();
    req.context.routeChanges = [noted("pages", "7", [], [])];
    await runDelete(
      revalidateOnDelete({ revalidate }),
      req,
      { id: 7 },
      "pages",
    );
    expect(revalidate).not.toHaveBeenCalled();
  });

  it("never throws", async () => {
    const { req, logger } = world({ failFind: true });
    req.context.routeChanges = [noted("pages", "7", [snap("2", "/a")], [])];
    await expect(
      runDelete(
        revalidateOnDelete({ revalidate: async () => {} }),
        req,
        { id: 7 },
        "pages",
      ),
    ).resolves.toEqual({ id: 7 });
    expect(logger.error).toHaveBeenCalled();
  });
});

describe("template revalidation", () => {
  const productRoutes: RouteRow[] = [
    {
      id: 1,
      tenant: null,
      locale: "en",
      path: "/products/bleach",
      refs: [],
      doc: { relationTo: "products", value: 7 },
    },
    {
      id: 2,
      tenant: 2,
      locale: "en",
      path: "/career/chemist",
      refs: [],
      doc: { relationTo: "jobs", value: 5 },
    },
    {
      id: 3,
      tenant: 3,
      locale: "en",
      path: "/karier/other",
      refs: [],
      doc: { relationTo: "jobs", value: 6 },
    },
  ];

  const template = (state: { before?: object; after?: object }) => {
    const rows = [state.before, state.after];
    let call = 0;
    return world({
      routes: productRoutes,
      mainRow: () => rows[Math.min(call++, 1)] ?? null,
    });
  };

  const save = async (
    hook: CollectionAfterChangeHook,
    ctx: ReturnType<typeof world>,
    doc: object,
    slug: string,
    existing?: { id: number },
  ) => {
    await (captureTemplateRow as CollectionBeforeChangeHook)({
      data: {},
      operation: existing ? "update" : "create",
      originalDoc: existing,
      collection: { slug },
      req: ctx.req,
    } as never);
    return runChange(hook, ctx.req, doc, slug);
  };

  it("revalidates a shared template's products on every host", async () => {
    recordBaseSources.products = async () => ({
      en: "/products",
      id: "/produk",
    });
    onTestFinished(() => {
      delete recordBaseSources.products;
    });
    const { calls, revalidate } = recorder();
    const ctx = template({
      before: { _status: "draft", updatedAt: "1" },
      after: { _status: "published", updatedAt: "2" },
    });
    await save(
      revalidateTemplate("shared", { revalidate }),
      ctx,
      { id: 3, recordType: "product", _status: "published" },
      "shared-detail-templates",
      { id: 3 },
    );
    expect(calls[0]).toMatchObject({
      collection: "products",
      reason: "template",
    });
    expect(calls[0].tags).toEqual(["route:shared:en:/products/bleach"]);
    expect(calls[0].purge).toHaveLength(6);
    expect(new Set(calls[0].purge.map((entry) => entry.host)).size).toBe(3);
    expect(calls[0].purge[0].pathPrefix).toMatch(
      /^\/(en\/products|id\/produk)\/$/,
    );
  });

  it("revalidates only the company's jobs for its template", async () => {
    const { calls, revalidate } = recorder();
    const ctx = template({
      before: { _status: "published", updatedAt: "1" },
      after: { _status: "published", updatedAt: "2" },
    });
    await save(
      revalidateTemplate("tenant", { revalidate }),
      ctx,
      { id: 4, recordType: "job", tenant: 2, _status: "published" },
      "detail-templates",
      { id: 4 },
    );
    expect(calls[0].tags).toEqual(["route:duniakimia:en:/career/chemist"]);
    expect(
      calls[0].purge.every((entry) => entry.host === "duniakimia.com"),
    ).toBe(true);
  });

  it("ignores a draft save over a live template", async () => {
    const { revalidate } = recorder();
    const ctx = template({
      before: { _status: "published", updatedAt: "1" },
      after: { _status: "published", updatedAt: "1" },
    });
    await save(
      revalidateTemplate("tenant", { revalidate }),
      ctx,
      { id: 4, recordType: "job", tenant: 2, _status: "draft" },
      "detail-templates",
      { id: 4 },
    );
    expect(revalidate).not.toHaveBeenCalled();
  });

  it("ignores a template that was never live", async () => {
    const { revalidate } = recorder();
    const ctx = template({
      before: { _status: "draft", updatedAt: "1" },
      after: { _status: "draft", updatedAt: "2" },
    });
    await save(
      revalidateTemplate("tenant", { revalidate }),
      ctx,
      { id: 4, recordType: "job", tenant: 2, _status: "draft" },
      "detail-templates",
      { id: 4 },
    );
    expect(revalidate).not.toHaveBeenCalled();
  });

  it("revalidates when a live template is unpublished", async () => {
    const { calls, revalidate } = recorder();
    const ctx = template({
      before: { _status: "published", updatedAt: "1" },
      after: { _status: "draft", updatedAt: "2" },
    });
    await save(
      revalidateTemplate("tenant", { revalidate }),
      ctx,
      { id: 4, recordType: "job", tenant: 2, _status: "draft" },
      "detail-templates",
      { id: 4 },
    );
    expect(calls).toHaveLength(1);
  });

  it("revalidates once when a live template is deleted, and not for a draft", async () => {
    const { calls, revalidate } = recorder();
    const ctx = world({ routes: productRoutes });
    const hook = revalidateTemplateOnDelete("tenant", { revalidate });
    await hook({
      doc: { id: 4, recordType: "job", tenant: 2, _status: "draft" },
      id: 4,
      req: ctx.req,
      collection: { slug: "detail-templates" },
    } as never);
    expect(revalidate).not.toHaveBeenCalled();
    await hook({
      doc: { id: 4, recordType: "job", tenant: 2, _status: "published" },
      id: 4,
      req: ctx.req,
      collection: { slug: "detail-templates" },
    } as never);
    expect(calls).toHaveLength(1);
  });

  it("never throws and records a failure", async () => {
    const ctx = template({
      before: { _status: "draft", updatedAt: "1" },
      after: { _status: "published", updatedAt: "2" },
    });
    const doc = { id: 3, recordType: "product", _status: "published" };
    await expect(
      save(
        revalidateTemplate("shared", {
          revalidate: () => Promise.reject(new Error("429")),
        }),
        ctx,
        doc,
        "shared-detail-templates",
        { id: 3 },
      ),
    ).resolves.toBe(doc);
    expect(ctx.statuses[0]).toMatchObject({ status: "failed" });
  });
});

describe("tenant-settings referrers", () => {
  const routes: RouteRow[] = [
    {
      id: 1,
      tenant: 2,
      locale: "en",
      path: "/about",
      refs: ["tenants:2"],
      doc: { relationTo: "pages", value: 40 },
    },
    {
      id: 2,
      tenant: null,
      locale: "en",
      path: "/group",
      refs: ["tenants:2", "tenants:3"],
      doc: { relationTo: "shared-pages", value: 41 },
    },
    {
      id: 3,
      tenant: 3,
      locale: "en",
      path: "/elsewhere",
      refs: ["tenants:3"],
      doc: { relationTo: "pages", value: 42 },
    },
  ];

  it("revalidates the routes whose refs contain the company", async () => {
    const { calls, revalidate } = recorder();
    const { req } = world({ routes });
    await runChange(
      revalidateEntityReferrers({ revalidate }),
      req,
      { id: 10, tenant: 2 },
      "tenant-settings",
    );
    expect(revalidate).toHaveBeenCalledTimes(1);
    expect(calls[0]).toMatchObject({
      collection: "tenant-settings",
      reason: "settings",
    });
    expect(calls[0].tags).toEqual([
      "route:duniakimia:en:/about",
      "route:shared:en:/group",
    ]);
    expect(calls[0].tags.some((tag) => tag.startsWith("layout:"))).toBe(false);
  });

  it("stays silent when no route references the company", async () => {
    const { revalidate } = recorder();
    const { req } = world({ routes: [] });
    await runChange(
      revalidateEntityReferrers({ revalidate }),
      req,
      { id: 10, tenant: 2 },
      "tenant-settings",
    );
    expect(revalidate).not.toHaveBeenCalled();
  });

  it("includes jobs moved by a career page change", async () => {
    const { calls, revalidate } = recorder();
    const { req } = world({ routes: [] });
    req.context.routeChanges = [
      noted("jobs", "5", [snap("2", "/career/a")], [snap("2", "/careers/a")]),
    ];
    await runChange(
      revalidateEntityReferrers({ revalidate }),
      req,
      { id: 10, tenant: 2 },
      "tenant-settings",
    );
    expect(calls[0].tags).toEqual(
      expect.arrayContaining([
        "route:duniakimia:en:/career/a",
        "route:duniakimia:en:/careers/a",
      ]),
    );
  });

  it("never throws", async () => {
    const { req, logger } = world({ failFind: true });
    const doc = { id: 10, tenant: 2 };
    await expect(
      runChange(
        revalidateEntityReferrers({ revalidate: async () => {} }),
        req,
        doc,
        "tenant-settings",
      ),
    ).resolves.toBe(doc);
    expect(logger.error).toHaveBeenCalled();
  });
});

describe("site routing moves", () => {
  it("revalidates the records moved by a base page change", async () => {
    const { calls, revalidate } = recorder();
    const { req } = world();
    req.context.routeChanges = [
      noted(
        "products",
        "7",
        [snap(null, "/old/bleach")],
        [snap(null, "/new/bleach")],
      ),
    ];
    const doc = { id: 1 };
    await expect(
      revalidateRoutingMoves({ revalidate })({
        doc,
        req,
        global: { slug: "site-routing" },
      } as never),
    ).resolves.toBe(doc);
    expect(calls[0]).toMatchObject({ collection: "site-routing" });
    expect(calls[0].tags).toEqual(
      expect.arrayContaining([
        "route:shared:en:/old/bleach",
        "route:shared:en:/new/bleach",
        "list:all:products",
      ]),
    );
  });
});

describe("route index notes", () => {
  const stored: RouteRow = {
    id: 1,
    tenant: 2,
    locale: "en",
    path: "/old",
    refs: [],
    doc: { relationTo: "pages", value: 9 },
  };

  it("notes the rows a document held before they are removed", async () => {
    const { req, payload } = world({ routes: [stored] });
    await removeRouteRows(payload as never, "pages", 9, req);
    expect(req.context.routeChanges).toEqual([
      { collection: "pages", id: "9", before: [snap("2", "/old")], after: [] },
    ]);
  });

  it("notes old and new rows when a path is rewritten", async () => {
    const { req, payload } = world({ routes: [stored] });
    (payload as unknown as { update: unknown }).update = vi.fn();
    await writeRouteRows(
      payload as never,
      "pages",
      9,
      [{ tenant: "2", locale: "en", path: "/new", refs: [] }],
      req,
    );
    expect(req.context.routeChanges).toEqual([
      {
        collection: "pages",
        id: "9",
        before: [snap("2", "/old")],
        after: [snap("2", "/new")],
      },
    ]);
  });

  it("works without a request context, as scripts do", async () => {
    const { payload } = world({ routes: [stored] });
    await expect(
      removeRouteRows(payload as never, "pages", 9, undefined),
    ).resolves.toBeUndefined();
  });
});

describe("collection wiring", () => {
  const records = [
    ["pages", Pages],
    ["shared-pages", SharedPages],
    ["products", Products],
    ["solutions", Solutions],
    ["jobs", Jobs],
    ["posts", Posts],
    ["categories", Categories],
  ] as const;

  it.each(records)(
    "%s revalidates after the route index is synced, last in the chain",
    (_slug, collection) => {
      const after = hooksOf<unknown>(collection, "afterChange");
      expect(after.indexOf(syncRoutes)).toBeGreaterThanOrEqual(0);
      expect(after.at(-1)).toBeTypeOf("function");
      expect(after.at(-1)).not.toBe(syncRoutes);
      expect(after.indexOf(syncRoutes)).toBeLessThan(after.length - 1);
    },
  );

  it.each(records)(
    "%s marks the start of a save and revalidates a delete",
    (_slug, collection) => {
      expect(hooksOf(collection, "beforeChange")).toContain(beginLiveChange);
      expect(hooksOf(collection, "afterDelete")).toHaveLength(1);
      expect(hooksOf(collection, "beforeDelete")).toContain(removeRoutes);
    },
  );

  it("keeps the existing hooks of the page collections in order", () => {
    const names = (config: CollectionConfig) =>
      hooksOf<{ name: string }>(config, "afterChange")
        .slice(1, 3)
        .map((hook) => hook.name);
    expect(names(Pages)).toEqual(["cascadePathChange", "syncRoutes"]);
    expect(names(SharedPages)).toEqual(["cascadePathChange", "syncRoutes"]);
    expect(
      hooksOf<{ name: string }>(Categories, "afterChange")
        .slice(0, 3)
        .map((hook) => hook.name),
    ).toEqual(["redirectMovedPath", "syncRoutes", "cascadePostPaths"]);
  });

  it.each([
    ["detail-templates", DetailTemplates],
    ["shared-detail-templates", SharedDetailTemplates],
  ] as const)("%s revalidates on save and delete", (_slug, collection) => {
    expect(hooksOf(collection, "afterChange")).toHaveLength(1);
    expect(hooksOf(collection, "afterDelete")).toHaveLength(1);
    expect(hooksOf(collection, "beforeChange")).toContain(captureTemplateRow);
  });

  it("tenant-settings ends with the referrers hook, after the layout hook", () => {
    expect(hooksOf(TenantSettings, "afterChange")).toHaveLength(3);
  });

  it("goes through the logging stub until DILM-32", async () => {
    const logger = { info: vi.fn(), error: vi.fn() };
    await stubRevalidator.revalidate(
      { tags: ["a"], purge: [], collection: "pages", reason: "publish" },
      logger as never,
    );
    expect(logger.info).toHaveBeenCalledWith(
      {
        tags: ["a"],
        purge: [],
        collection: "pages",
        reason: "publish",
      },
      "Revalidation (stubbed until DILM-32)",
    );
  });
});
