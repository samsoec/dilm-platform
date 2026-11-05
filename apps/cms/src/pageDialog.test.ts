import type { PayloadRequest } from "payload";
import { describe, expect, it, vi } from "vitest";

import { Pages } from "./collections/Pages";
import {
  checkSlugHandler,
  createDraftHandler,
  parentOptionsHandler,
  toOption,
} from "./pageDialog";

type Doc = Record<string, unknown> & { id: number };

type Store = {
  pages: (Doc & { path: string; tenant: number; title: string })[];
  shared: (Doc & { path: string; title: string })[];
};

const editor = {
  id: 5,
  collection: "users",
  roles: ["tenant-editor"],
  tenants: [{ tenant: 2 }],
};
const viewer = { ...editor, id: 6, roles: ["tenant-viewer"] };
const outsider = { ...editor, id: 7, tenants: [{ tenant: 9 }] };
const superAdmin = { ...editor, id: 8, roles: ["super-admin"], tenants: [] };

type ApiBody = {
  ok: boolean;
  id: number;
  message: string;
  indonesianSlug: string;
  paths: Record<string, string>;
  problems: {
    field: string;
    kind: string;
    message: string;
    open?: { collection: string; id: string };
  }[];
  options: {
    id: string;
    title: string;
    shared: boolean;
    collection: string;
    paths: Record<string, string>;
  }[];
};

type Call = Record<string, unknown>;

type Query = { collection: string; where?: Record<string, { equals: string }> };

function wanted(where: unknown, key: string): string | undefined {
  const clauses = (where as { and?: Record<string, { equals?: string }>[] })
    .and;
  return clauses?.find((clause) => clause[key])?.[key]?.equals;
}

function stub(store: Store, extra: Record<string, unknown> = {}) {
  const find = vi.fn(async ({ collection, where }: Query) => {
    if (collection === "pages" && where?.tenant) {
      return {
        docs: store.pages.filter(
          (p) => String(p.tenant) === where.tenant.equals,
        ),
      };
    }
    if (collection === "shared-pages" && !where) return { docs: store.shared };
    const path = wanted(where, "path");
    if (collection === "shared-pages") {
      return { docs: store.shared.filter((doc) => doc.path === path) };
    }
    if (collection === "pages") {
      const tenant = wanted(where, "tenant");
      return {
        docs: store.pages.filter(
          (doc) =>
            doc.path === path && (!tenant || String(doc.tenant) === tenant),
        ),
      };
    }
    return { docs: [] };
  });
  const findByID = vi.fn(async ({ id }: { id: string | number }) => {
    const found = store.pages.find((doc) => String(doc.id) === String(id));
    if (!found) throw new Error("Not found");
    return { ...found, path: { en: found.path, id: found.path } };
  });
  const create = vi.fn<(args: Call) => Promise<{ id: number }>>(async () => ({
    id: 41,
  }));
  const update = vi.fn<(args: Call) => Promise<{ id: number }>>(async () => ({
    id: 41,
  }));
  return {
    find,
    findByID,
    create,
    update,
    count: vi.fn(async () => ({ totalDocs: 3 })),
    logger: { error: vi.fn() },
    ...extra,
  };
}

function request(
  payload: ReturnType<typeof stub>,
  user: unknown,
  options: { body?: unknown; query?: Record<string, string> } = {},
) {
  return {
    payload,
    user,
    query: options.query ?? {},
    json: async () => options.body,
    locale: "en",
  } as unknown as PayloadRequest;
}

const store = (): Store => ({
  pages: [
    { id: 1, title: "About Us", tenant: 2, path: "/about-us" },
    { id: 2, title: "Our Journey", tenant: 2, path: "/about-us/our-journey" },
    { id: 3, title: "Elsewhere", tenant: 9, path: "/elsewhere" },
  ],
  shared: [
    { id: 11, title: "Home", path: "/" },
    { id: 12, title: "Products & Solutions", path: "/products-solutions" },
  ],
});

async function run(
  handler: Parameters<typeof request>[0] extends never
    ? never
    : (req: PayloadRequest) => Promise<Response> | Response,
  payload: ReturnType<typeof stub>,
  user: unknown,
  options?: Parameters<typeof request>[2],
) {
  const response = await handler(request(payload, user, options));
  return {
    status: response.status,
    body: (await response.json()) as ApiBody,
  };
}

describe("Pages endpoints", () => {
  it("registers the three dialog endpoints on the collection", () => {
    expect(
      (Pages.endpoints || []).map(({ path, method }) => `${method} ${path}`),
    ).toEqual([
      "get /parent-options",
      "post /check-slug",
      "post /create-draft",
    ]);
  });
});

describe("role gating", () => {
  const body = { tenant: "2", title: "History", slugs: { en: "history" } };

  it.each([
    ["a viewer", viewer, 403],
    ["an editor of another company", outsider, 403],
    ["nobody", undefined, 401],
  ])(
    "turns %s away from every endpoint without touching the data",
    async (_who, user, status) => {
      const payload = stub(store());
      for (const handler of [checkSlugHandler, createDraftHandler]) {
        expect((await run(handler, payload, user, { body })).status).toBe(
          status,
        );
      }
      expect(
        (
          await run(parentOptionsHandler, payload, user, {
            query: { tenant: "2" },
          })
        ).status,
      ).toBe(status);
      expect(payload.find).not.toHaveBeenCalled();
      expect(payload.create).not.toHaveBeenCalled();
    },
  );

  it("lets a super admin act on any company", async () => {
    const payload = stub(store());
    const { status } = await run(parentOptionsHandler, payload, superAdmin, {
      query: { tenant: "9" },
    });
    expect(status).toBe(200);
  });

  it("asks for a numeric company and a JSON body", async () => {
    const payload = stub(store());
    expect(
      (
        await run(parentOptionsHandler, payload, editor, {
          query: { tenant: "x" },
        })
      ).status,
    ).toBe(400);
    expect((await run(checkSlugHandler, payload, editor, {})).status).toBe(400);
  });
});

describe("parent options", () => {
  it("lists this company's pages and the shared pages marked shared", async () => {
    const payload = stub(store());
    const { body } = await run(parentOptionsHandler, payload, editor, {
      query: { tenant: "2" },
    });
    expect(body.options).toEqual([
      expect.objectContaining({
        id: "1",
        title: "About Us",
        shared: false,
        collection: "pages",
      }),
      expect.objectContaining({ id: "2", shared: false }),
      expect.objectContaining({
        id: "11",
        title: "Home",
        shared: true,
        collection: "shared-pages",
        paths: { en: "/" },
      }),
      expect.objectContaining({ id: "12", shared: true }),
    ]);
  });

  it("reads as the user, scoped to the company", async () => {
    const payload = stub(store());
    await run(parentOptionsHandler, payload, editor, {
      query: { tenant: "2" },
    });
    for (const [args] of payload.find.mock.calls) {
      expect(args).toMatchObject({ overrideAccess: false, user: editor });
    }
    expect(payload.find.mock.calls[0][0].where).toEqual({
      tenant: { equals: "2" },
    });
  });

  it("flattens localized titles and string paths", () => {
    expect(
      toOption(
        { id: 4, title: { en: "Hello", id: "Halo" }, path: "/hello" },
        "pages",
      ),
    ).toEqual({
      id: "4",
      collection: "pages",
      title: "Hello",
      paths: { en: "/hello" },
      shared: false,
    });
    expect(
      toOption({ id: 5, title: null, path: null }, "shared-pages").title,
    ).toBe("Untitled");
  });
});

describe("check-slug", () => {
  const check = (
    payload: ReturnType<typeof stub>,
    input: Record<string, unknown>,
  ) =>
    run(checkSlugHandler, payload, editor, {
      body: { tenant: "2", slugs: { en: "", id: "" }, ...input },
    });

  it("answers an empty slug without a parent from the shape rules, no lookups", async () => {
    const payload = stub(store());
    const { body } = await check(payload, {});
    expect(body.ok).toBe(false);
    expect(body.problems).toEqual([
      expect.objectContaining({
        kind: "root",
        message: "The root URL / is the shared Home. Give this page a slug.",
      }),
    ]);
    expect(payload.find).not.toHaveBeenCalled();
  });

  it("rejects invalid characters", async () => {
    const { body } = await check(stub(store()), {
      slugs: { en: "Bad Slug", id: "" },
    });
    expect(body.problems[0]).toMatchObject({
      kind: "invalid",
      message: "Use lowercase letters, numbers and hyphens only (a-z, 0-9, -).",
    });
  });

  it("rejects a reserved first segment, also under no parent", async () => {
    const { body } = await check(stub(store()), {
      slugs: { en: "media", id: "" },
    });
    expect(body.problems[0]).toMatchObject({
      kind: "reserved",
      field: "slug-en",
      message:
        "URLs can't start with a reserved word: category, kategori, api, admin, _next, media.",
    });
  });

  it("names the shared page that holds the URL", async () => {
    const { body } = await check(stub(store()), {
      slugs: { en: "products-solutions", id: "" },
    });
    expect(body.problems[0]).toMatchObject({
      kind: "shared",
      message:
        '/products-solutions is the shared page "Products & Solutions", on all 3 sites. Pick another slug.',
    });
  });

  it("points at the page of this company that already uses the URL", async () => {
    const { body } = await check(stub(store()), {
      parent: "1",
      slugs: { en: "our-journey", id: "" },
    });
    expect(body.problems[0]).toEqual({
      field: "slug-en",
      locale: "en",
      kind: "same-site",
      message: '"Our Journey" already uses /about-us/our-journey in English.',
      open: { collection: "pages", id: "2" },
    });
  });

  it("accepts the same slug that only another company uses", async () => {
    const { body } = await check(stub(store()), {
      slugs: { en: "elsewhere", id: "" },
    });
    expect(body).toMatchObject({ ok: true, problems: [] });
  });

  it("returns the computed addresses of both languages", async () => {
    const { body } = await check(stub(store()), {
      parent: "1",
      slugs: { en: "history", id: "sejarah" },
    });
    expect(body.paths).toEqual({
      en: "/about-us/history",
      id: "/about-us/sejarah",
    });
  });

  it("refuses a parent that belongs to another company or does not exist", async () => {
    expect(
      (await check(stub(store()), { parent: "3", slugs: { en: "x" } })).status,
    ).toBe(422);
    expect(
      (await check(stub(store()), { parent: "99", slugs: { en: "x" } })).status,
    ).toBe(422);
    expect(
      (await check(stub(store()), { parent: "1; drop", slugs: { en: "x" } }))
        .status,
    ).toBe(400);
  });

  it("reads the parent as the user", async () => {
    const payload = stub(store());
    await check(payload, { parent: "1", slugs: { en: "x" } });
    expect(payload.findByID.mock.calls[0][0]).toMatchObject({
      collection: "pages",
      overrideAccess: false,
      user: editor,
    });
  });
});

describe("create-draft", () => {
  const create = (
    payload: ReturnType<typeof stub>,
    input: Record<string, unknown>,
  ) =>
    run(createDraftHandler, payload, editor, {
      body: {
        tenant: "2",
        title: "History",
        slugs: { en: "history", id: "" },
        ...input,
      },
    });

  it("saves a draft as the user with the company, parent and English slug", async () => {
    const payload = stub(store());
    const { status, body } = await create(payload, { parent: "1" });
    expect(status).toBe(201);
    expect(body).toEqual({ ok: true, id: 41 });
    expect(payload.create).toHaveBeenCalledTimes(1);
    expect(payload.create.mock.calls[0][0]).toMatchObject({
      collection: "pages",
      locale: "en",
      draft: true,
      overrideAccess: false,
      user: editor,
      data: {
        tenant: 2,
        _status: "draft",
        title: "History",
        slug: "history",
        parent: 1,
      },
    });
    expect(payload.update).not.toHaveBeenCalled();
  });

  it("never publishes", async () => {
    const payload = stub(store());
    await create(payload, {});
    const call = payload.create.mock.calls[0][0] as {
      draft: boolean;
      data: Record<string, unknown>;
    };
    expect(call.draft).toBe(true);
    expect(call.data._status).toBe("draft");
    expect(call.data).not.toHaveProperty("parent");
  });

  it("saves the Indonesian slug as a second draft write in that language", async () => {
    const payload = stub(store());
    await create(payload, { slugs: { en: "history", id: "sejarah" } });
    expect(payload.update.mock.calls[0][0]).toMatchObject({
      collection: "pages",
      id: 41,
      locale: "id",
      draft: true,
      overrideAccess: false,
      user: editor,
      data: { slug: "sejarah" },
    });
  });

  it("still opens the page when only the Indonesian slug failed", async () => {
    const payload = stub(store(), {
      update: vi.fn(async () => {
        throw new Error("boom");
      }),
    });
    const { status, body } = await create(payload, {
      slugs: { en: "history", id: "sejarah" },
    });
    expect(status).toBe(201);
    expect(body).toMatchObject({ ok: true, id: 41, indonesianSlug: "boom" });
  });

  it("checks the slug again and refuses with the PG-02 problems", async () => {
    const payload = stub(store());
    const { status, body } = await create(payload, {
      parent: "1",
      slugs: { en: "our-journey", id: "" },
    });
    expect(status).toBe(422);
    expect(body.problems[0]).toMatchObject({ kind: "same-site" });
    expect(payload.create).not.toHaveBeenCalled();
  });

  it("needs a title", async () => {
    const payload = stub(store());
    const { status, body } = await create(payload, { title: "   " });
    expect(status).toBe(422);
    expect(body.message).toBe("Add the page's title.");
    expect(payload.create).not.toHaveBeenCalled();
  });

  it("refuses a crafted parent from another company before creating anything", async () => {
    const payload = stub(store());
    const { status } = await create(payload, { parent: "3" });
    expect(status).toBe(422);
    expect(payload.create).not.toHaveBeenCalled();
  });

  it("surfaces the save hook's own message when the write fails", async () => {
    const payload = stub(store(), {
      create: vi.fn(async () => {
        throw Object.assign(new Error("invalid"), {
          data: { errors: [{ message: "Hook said no." }] },
        });
      }),
    });
    const { status, body } = await create(payload, {});
    expect(status).toBe(422);
    expect(body).toMatchObject({ ok: false, message: "Hook said no." });
    expect(payload.logger.error).toHaveBeenCalled();
  });
});
