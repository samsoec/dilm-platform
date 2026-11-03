import type { CollectionAfterChangeHook, Payload, Where } from "payload";
import { describe, expect, it } from "vitest";

import { Categories } from "./collections/Categories";
import { Documents } from "./collections/Documents";
import { Posts } from "./collections/Posts";
import { Tenants } from "./collections/Tenants";
import { Users } from "./collections/Users";
import {
  cascadePostPaths,
  categoryInUseMessage,
  countByCompany,
  keepCategoriesWithPosts,
  movedPosts,
  pathsUnder,
  redirectMovedPath,
} from "./categories";
import { computePaths, validatePageSlug } from "./paths";
import { routeRows } from "./routeIndex";
import { tenantScopedCollections } from "./tenancy";
import { accessAs, applyMultiTenant, findField, testUser } from "./testing";

const superAdmin = testUser(["super-admin"]);
const editor = testUser(["tenant-editor"], [1]);
const viewer = testUser(["tenant-viewer"], [1]);

describe("category access (FR-PM-38)", () => {
  it("lets only a Super Admin create, update and delete", () => {
    for (const key of ["create", "update", "delete"] as const) {
      expect(accessAs(Categories, key, superAdmin)).toBe(true);
      expect(accessAs(Categories, key, editor)).toBe(false);
      expect(accessAs(Categories, key, viewer)).toBe(false);
      expect(accessAs(Categories, key, null)).toBe(false);
    }
  });

  it("lets everyone read, so the websites can render the category pages", () => {
    for (const user of [superAdmin, editor, viewer, null]) {
      expect(accessAs(Categories, "read", user)).toBe(true);
    }
  });

  it("is global: not registered with the multi-tenant plugin", async () => {
    expect(Object.keys(tenantScopedCollections([Categories, Posts]))).toEqual([
      "posts",
    ]);
    const configured = (
      await applyMultiTenant([Users, Tenants, Documents, Posts, Categories])
    )("categories");
    expect(findField(configured.fields, "tenant")).toBeUndefined();
  });

  it("has the fields of the table, localized where marked L", () => {
    for (const name of ["name", "slug", "description"]) {
      expect(findField(Categories.fields, name), name).toMatchObject({
        localized: true,
      });
    }
    expect(findField(Categories.fields, "coverImage")).toMatchObject({
      type: "upload",
      relationTo: "media",
    });
    expect(findField(Categories.fields, "coverImage")).not.toMatchObject({
      localized: true,
    });
    expect(findField(Categories.fields, "path")).toMatchObject({
      localized: true,
    });
  });

  it("keeps name and slug nullable for the second language, but required for the first", async () => {
    const name = findField(Categories.fields, "name") as {
      required?: boolean;
      validate: (value: unknown, options: unknown) => unknown;
    };
    const slug = findField(Categories.fields, "slug") as typeof name;
    expect(name.required).toBeFalsy();
    expect(slug.required).toBeFalsy();
    const en = { req: { locale: "en" } };
    const id = { req: { locale: "id" } };
    expect(await name.validate("", en)).toBe("Add the category's name.");
    expect(await name.validate("", id)).toBe(true);
    expect(await slug.validate("", en)).toBe("Add the page's slug.");
    expect(await slug.validate("", id)).toBe(true);
    expect(await slug.validate("Bad Slug", en)).toMatch(/lowercase/);
    expect(await slug.validate("company-news", en)).toBe(true);
  });
});

describe("a category's path (FR-PM-19)", () => {
  const none = {} as Payload;

  it("is the prefix constant of each language plus the slug", async () => {
    expect(
      await computePaths(none, {
        collection: "categories",
        slugs: { en: "sustainability", id: "keberlanjutan" },
      }),
    ).toEqual({
      en: "/category/sustainability",
      id: "/kategori/keberlanjutan",
    });
  });

  it("falls back to the English slug in Indonesian", async () => {
    expect(
      await computePaths(none, {
        collection: "categories",
        slugs: { en: "company-news" },
      }),
    ).toEqual({ en: "/category/company-news", id: "/kategori/company-news" });
  });

  it("allows the reserved prefix, but not a second category at the address", async () => {
    const payload = {
      find: async () => ({
        docs: [{ id: 3, name: "Sustainability", path: "/category/x" }],
      }),
      count: async () => ({ totalDocs: 3 }),
    } as unknown as Payload;
    const { problems } = await validatePageSlug(payload, {
      collection: "categories",
      id: 9,
      slugs: { en: "x" },
    });
    expect(problems.map((problem) => problem.message)).toEqual([
      '/category/x is already the category "Sustainability". Pick another slug.',
      '/kategori/x is already the category "Sustainability". Pick another slug.',
    ]);
  });

  it("is a route row for every company at once, with no tenant", () => {
    expect(
      routeRows("categories", {
        id: 4,
        path: { en: "/category/sustainability", id: "/kategori/keberlanjutan" },
      }),
    ).toEqual([
      {
        tenant: null,
        locale: "en",
        path: "/category/sustainability",
        refs: [],
      },
      {
        tenant: null,
        locale: "id",
        path: "/kategori/keberlanjutan",
        refs: [],
      },
    ]);
  });
});

describe("deleting a category with posts (CT-02)", () => {
  it("words the refusal like the design, with the count per company", () => {
    expect(
      categoryInUseMessage("Events & Activities", [
        { company: "DKU", count: 3 },
        { company: "IndoAcid", count: 6 },
        { company: "Liku Telaga", count: 2 },
      ]),
    ).toBe(
      '"Events & Activities" can\'t be deleted. It has 11 posts (DKU 3, IndoAcid 6, Liku Telaga 2). Move them to another category first.',
    );
  });

  it("uses the singular for one post", () => {
    expect(
      categoryInUseMessage("Sustainability", [{ company: "DKU", count: 1 }]),
    ).toBe(
      '"Sustainability" can\'t be deleted. It has 1 post (DKU 1). Move it to another category first.',
    );
  });

  it("counts per company, sorted by name", () => {
    expect(
      countByCompany(
        [2, { id: 1 }, "2", 3, 2, 2, 1, 2, 2, 2, 3],
        new Map([
          ["1", "IndoAcid"],
          ["2", "DKU"],
          ["3", "Liku Telaga"],
        ]),
      ),
    ).toEqual([
      { company: "DKU", count: 7 },
      { company: "IndoAcid", count: 2 },
      { company: "Liku Telaga", count: 2 },
    ]);
  });

  function deleteArgs(posts: { tenant: number }[]) {
    const finds: { collection: string; where: Where; trash?: boolean }[] = [];
    const payload = {
      find: async (args: {
        collection: string;
        where: Where;
        trash?: boolean;
      }) => {
        finds.push(args);
        return args.collection === "posts"
          ? { docs: posts }
          : {
              docs: [
                { id: 1, name: "IndoAcid" },
                { id: 2, name: "DKU" },
              ],
            };
      },
      findByID: async () => ({ name: "Events & Activities" }),
    } as unknown as Payload;
    return { args: { id: 7, req: { payload } } as never, finds };
  }

  it("refuses the delete while any company still has posts in it", async () => {
    const { args, finds } = deleteArgs([
      { tenant: 2 },
      { tenant: 2 },
      { tenant: 1 },
    ]);
    await expect(keepCategoriesWithPosts(args)).rejects.toThrow(
      '"Events & Activities" can\'t be deleted. It has 3 posts (DKU 2, IndoAcid 1). Move them to another category first.',
    );
    expect(finds[0]).toMatchObject({
      collection: "posts",
      where: { primaryCategory: { equals: 7 } },
      trash: true,
    });
  });

  it("goes through for a category nobody uses", async () => {
    const { args } = deleteArgs([]);
    await expect(keepCategoriesWithPosts(args)).resolves.toBeUndefined();
  });

  it("is a before-delete hook on the collection", () => {
    expect(Categories.hooks?.beforeDelete).toContain(keepCategoriesWithPosts);
  });
});

describe("post paths follow the category (FR-PM-11)", () => {
  it("recomputes every post's path when the category slug changes", () => {
    expect(
      pathsUnder(
        { en: "/category/company-news", id: "/kategori/berita" },
        { en: "al-falah", id: "al-falah-id" },
      ),
    ).toEqual({
      en: "/category/company-news/al-falah",
      id: "/kategori/berita/al-falah-id",
    });
    expect(
      movedPosts({ en: "/category/new", id: "/kategori/new" }, [
        {
          id: 1,
          slug: { en: "a" },
          path: { en: "/category/old/a", id: "/kategori/old/a" },
        },
        {
          id: 2,
          slug: { en: "b" },
          path: { en: "/category/new/b", id: "/kategori/new/b" },
        },
        { id: 3, slug: { en: null }, path: { en: null } },
      ]).map((move) => [move.post.id, move.paths]),
    ).toEqual([[1, { en: "/category/new/a", id: "/kategori/new/a" }]]);
  });
});

type Stored = {
  id: number;
  tenant: number | null;
  locale: string;
  path: string;
  refs: string[];
  doc: { relationTo: string; value: number };
};

function lifecycle() {
  const routes: Stored[] = [
    {
      id: 1,
      tenant: 2,
      locale: "en",
      path: "/category/sustainability/al-falah",
      refs: [],
      doc: { relationTo: "posts", value: 10 },
    },
    {
      id: 2,
      tenant: 2,
      locale: "id",
      path: "/kategori/sustainability/al-falah",
      refs: [],
      doc: { relationTo: "posts", value: 10 },
    },
  ];
  const categories: Record<number, Record<string, unknown>> = {
    4: {
      id: 4,
      path: {
        en: "/category/company-news",
        id: "/kategori/company-news",
      },
    },
  };
  const post: Record<string, unknown> = {
    id: 10,
    _status: "published",
    tenant: 2,
    primaryCategory: 4,
    title: { en: "Al Falah" },
    slug: { en: "al-falah" },
    path: {
      en: "/category/company-news/al-falah",
      id: "/kategori/company-news/al-falah",
    },
  };
  const created: Record<string, unknown>[] = [];
  const updates: Record<string, unknown>[] = [];
  const payload = {
    findByID: async (args: { collection: string; id: number }) =>
      args.collection === "categories" ? categories[args.id] : post,
    find: async (args: { collection: string; where: Where }) => {
      if (args.collection === "posts") return { docs: [post] };
      if (args.collection === "routes") {
        const wanted = (args.where as { doc?: { equals: Stored["doc"] } }).doc
          ?.equals;
        return {
          docs: routes.filter(
            (row) =>
              !wanted ||
              (row.doc.relationTo === wanted.relationTo &&
                row.doc.value === wanted.value),
          ),
        };
      }
      return { docs: [] };
    },
    create: async (args: {
      collection: string;
      data: Record<string, unknown>;
    }) => {
      created.push({ collection: args.collection, ...args.data });
      return args.data;
    },
    update: async () => ({}),
    delete: async () => ({ docs: [] }),
    db: {
      updateOne: async (args: { data: Record<string, unknown> }) => {
        updates.push(args.data);
        Object.assign(post, args.data);
      },
    },
  } as unknown as Payload;
  return { payload, created, updates, post, categories };
}

describe("moving a post when its category changes (PS-02)", () => {
  const redirects = (created: Record<string, unknown>[]) =>
    created
      .filter((row) => row.collection === "redirects")
      .map((row) => [
        row.tenant,
        row.locale,
        row.from,
        (row.to as { internalPath: string }).internalPath,
        row.origin,
      ]);

  it("writes a redirect from the old address in both languages", async () => {
    const { payload, created } = lifecycle();
    await (redirectMovedPath as CollectionAfterChangeHook)({
      collection: { slug: "posts" },
      doc: { id: 10 },
      req: { payload },
    } as never);
    expect(redirects(created)).toEqual([
      [
        2,
        "en",
        "/category/sustainability/al-falah",
        "/category/company-news/al-falah",
        "auto",
      ],
      [
        2,
        "id",
        "/kategori/sustainability/al-falah",
        "/kategori/company-news/al-falah",
        "auto",
      ],
    ]);
  });

  it("writes nothing when the address did not change", async () => {
    const { payload, created, post } = lifecycle();
    post.path = {
      en: "/category/sustainability/al-falah",
      id: "/kategori/sustainability/al-falah",
    };
    await (redirectMovedPath as CollectionAfterChangeHook)({
      collection: { slug: "posts" },
      doc: { id: 10 },
      req: { payload },
    } as never);
    expect(created).toEqual([]);
  });

  it("computes the new path from the new primary category", async () => {
    const payload = {
      findByID: async () => ({
        path: { en: "/category/company-news", id: "/kategori/berita" },
      }),
    } as unknown as Payload;
    expect(
      await computePaths(payload, {
        collection: "posts",
        tenant: 2,
        category: 4,
        slugs: { en: "al-falah", id: "al-falah" },
      }),
    ).toEqual({
      en: "/category/company-news/al-falah",
      id: "/kategori/berita/al-falah",
    });
  });

  it("leaves the path empty until the post has a category and a slug", async () => {
    const payload = {} as Payload;
    expect(
      await computePaths(payload, {
        collection: "posts",
        tenant: 2,
        slugs: { en: "al-falah" },
      }),
    ).toEqual({ en: "", id: "" });
  });
});

describe("renaming a category's slug moves its posts (FR-PM-11)", () => {
  it("rewrites each post's path in place and redirects the old address", async () => {
    const { payload, created, updates, categories } = lifecycle();
    categories[4].path = {
      en: "/category/company-news-2",
      id: "/kategori/company-news-2",
    };
    await (cascadePostPaths as CollectionAfterChangeHook)({
      doc: { id: 4 },
      req: { payload },
    } as never);
    expect(updates).toHaveLength(1);
    expect(updates[0]).toMatchObject({
      title: { en: "Al Falah" },
      slug: { en: "al-falah" },
      path: {
        en: "/category/company-news-2/al-falah",
        id: "/kategori/company-news-2/al-falah",
      },
    });
    expect(
      created
        .filter((row) => row.collection === "redirects")
        .map((row) => row.from),
    ).toEqual([
      "/category/sustainability/al-falah",
      "/kategori/sustainability/al-falah",
    ]);
  });
});
