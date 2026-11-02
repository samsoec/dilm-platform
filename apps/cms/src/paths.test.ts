import type { Payload, Where } from "payload";
import { describe, expect, it } from "vitest";

import { Pages } from "./collections/Pages";
import { SharedPages } from "./collections/SharedPages";
import { findField } from "./testing";
import {
  RESERVED_MESSAGE,
  RESERVED_SEGMENTS,
  companyPagesMessage,
  computePath,
  computePaths,
  firstSegment,
  pathProblems,
  problemMessage,
  reservedProblem,
  sharedPageMessage,
  slugForLocale,
  slugsFrom,
  usesSlugFallback,
  validatePageSlug,
  writePath,
  writeSlugFallback,
} from "./paths";

type Row = {
  collection: "pages" | "shared-pages";
  id: number;
  title: string;
  tenant?: number;
  path: Record<string, string>;
};

const tenants: Record<number, string> = {
  1: "Dunia Kimia Utama",
  2: "IndoAcid",
  3: "Liku Telaga",
};

function clauses(where: Where): Where[] {
  return (where as { and?: Where[] }).and ?? [where];
}

function fakePayload(rows: Row[]) {
  const find = async (args: {
    collection: string;
    locale: string;
    where: Where;
  }) => {
    if (args.collection === "tenants") {
      const ids = (
        clauses(args.where)[0] as { id: { in: (number | string)[] } }
      ).id.in.map(Number);
      return { docs: ids.map((id) => ({ id, name: tenants[id] })) };
    }
    let docs = rows.filter((row) => row.collection === args.collection);
    for (const clause of clauses(args.where) as Record<
      string,
      Record<string, string>
    >[]) {
      if (clause.path) {
        docs = docs.filter(
          (row) => row.path[args.locale] === clause.path.equals,
        );
      }
      if (clause.id) {
        docs = docs.filter((row) => String(row.id) !== clause.id.not_equals);
      }
      if (clause.tenant) {
        docs = docs.filter(
          (row) => String(row.tenant) === clause.tenant.equals,
        );
      }
    }
    return { docs };
  };
  const findByID = async ({ id }: { id: string | number }) => {
    const row = rows.find((candidate) => String(candidate.id) === String(id));
    if (!row) throw new Error("missing");
    return row;
  };
  const count = async () => ({ totalDocs: Object.keys(tenants).length });
  return { find, findByID, count } as unknown as Payload;
}

const privacy = (id: number, tenant: number): Row => ({
  collection: "pages",
  id,
  title: "Privacy Policy",
  tenant,
  path: { en: "/privacy-policy", id: "/privacy-policy" },
});

const productsSolutions: Row = {
  collection: "shared-pages",
  id: 50,
  title: "Products & Solutions",
  path: { en: "/products-solutions", id: "/produk-solusi" },
};

const localSlugs = { en: "slug", id: "slug" };

describe("computing a path (FR-PM-08, §3.2)", () => {
  it("joins the parent path and the slug", () => {
    expect(computePath("/about-us", "overview")).toBe("/about-us/overview");
    expect(computePath(undefined, "about-us")).toBe("/about-us");
    expect(computePath(null, "about-us")).toBe("/about-us");
  });

  it("puts Home at the root and nests under Home without a double slash", () => {
    expect(computePath(undefined, "")).toBe("/");
    expect(computePath(undefined, null)).toBe("/");
    expect(computePath("/", "products-solutions")).toBe("/products-solutions");
  });

  it("never carries a locale prefix", () => {
    expect(computePath("/about-us", "overview")).not.toMatch(/^\/(en|id)\//);
  });

  it("works out the first segment", () => {
    expect(firstSegment("/")).toBe("");
    expect(firstSegment("/admin/users")).toBe("admin");
    expect(firstSegment("/sitemap.xml")).toBe("sitemap.xml");
  });
});

describe("falling back to the English slug (FR-PM-09)", () => {
  it("uses the locale's own slug when there is one", () => {
    expect(slugForLocale({ en: "about", id: "tentang" }, "id")).toEqual({
      slug: "tentang",
      fellBack: false,
    });
  });

  it("uses the en slug when the id slug is missing, and says so", () => {
    expect(slugForLocale({ en: "about", id: "" }, "id")).toEqual({
      slug: "about",
      fellBack: true,
    });
    expect(slugForLocale({ en: "about" }, "id")).toMatchObject({
      slug: "about",
      fellBack: true,
    });
    expect(slugForLocale({ en: "about" }, "en").fellBack).toBe(false);
  });

  it("raises the flag only when a fallback was used", () => {
    expect(usesSlugFallback({ en: "about", id: "tentang" })).toBe(false);
    expect(usesSlugFallback({ en: "about" })).toBe(true);
    expect(usesSlugFallback({})).toBe(false);
    expect(usesSlugFallback({ en: "", id: "" })).toBe(false);
  });

  it("merges the submitted slug over the stored ones for the request locale", () => {
    expect(slugsFrom("tentang", { en: "about" }, "id")).toEqual({
      en: "about",
      id: "tentang",
    });
    expect(slugsFrom(undefined, { en: "about" }, "id")).toEqual({
      en: "about",
    });
    expect(slugsFrom("about", undefined, undefined)).toEqual({ en: "about" });
    expect(slugsFrom({ en: "a", id: "b" }, undefined, "all")).toEqual({
      en: "a",
      id: "b",
    });
  });

  it("computes the id path from the en slug under the parent's id path", async () => {
    const payload = fakePayload([productsSolutions]);
    expect(
      await computePaths(payload, {
        collection: "shared-pages",
        parent: 50,
        slugs: { en: "our-products" },
      }),
    ).toEqual({
      en: "/products-solutions/our-products",
      id: "/produk-solusi/our-products",
    });
  });

  it("gives Home the root path in both locales", async () => {
    expect(
      await computePaths(fakePayload([]), {
        collection: "shared-pages",
        slugs: {},
      }),
    ).toEqual({ en: "/", id: "/" });
  });
});

describe("reserved first segments (FR-PM-15, FR-PM-19)", () => {
  it("lists the category prefix in both locales and the system paths", () => {
    expect([...RESERVED_SEGMENTS].sort()).toEqual(
      [
        "category",
        "kategori",
        "api",
        "admin",
        "_next",
        "media",
        "sitemap.xml",
        "robots.txt",
      ].sort(),
    );
  });

  it.each([...RESERVED_SEGMENTS])(
    "rejects %s with the PG-02 wording",
    (word) => {
      expect(reservedProblem(`/${word}`)).toBe(RESERVED_MESSAGE);
      expect(reservedProblem(`/${word}/child`)).toBe(RESERVED_MESSAGE);
    },
  );

  it("only looks at the first segment", () => {
    expect(reservedProblem("/about/admin")).toBeUndefined();
    expect(reservedProblem("/administration")).toBeUndefined();
    expect(reservedProblem("/")).toBeUndefined();
  });

  it("refuses a page nested under nothing but named after a reserved word", async () => {
    const { problems } = await validatePageSlug(fakePayload([]), {
      collection: "pages",
      tenant: 1,
      slugs: { en: "api" },
    });
    expect(problems[0].message).toBe(
      "URLs can't start with a reserved word: category, kategori, api, admin, _next, media.",
    );
  });
});

describe("collisions (FR-PM-05, FR-PM-13)", () => {
  const paths = { en: "/privacy-policy", id: "/privacy-policy" };

  it("accepts /privacy-policy on two companies", async () => {
    const payload = fakePayload([privacy(10, 1)]);
    expect(
      await pathProblems(
        payload,
        { collection: "pages", tenant: 2, slugs: localSlugs },
        paths,
      ),
    ).toEqual([]);
  });

  it("rejects the same path twice on one company, naming the page", async () => {
    const payload = fakePayload([privacy(10, 1)]);
    const problems = await pathProblems(
      payload,
      { collection: "pages", tenant: 1, slugs: localSlugs },
      paths,
    );
    expect(problems).toHaveLength(1);
    expect(problems[0].message).toBe(
      '/privacy-policy is already used by "Privacy Policy" on Dunia Kimia Utama. Pick another slug.',
    );
  });

  it("lets a page keep its own path when it is saved again", async () => {
    const payload = fakePayload([privacy(10, 1)]);
    expect(
      await pathProblems(
        payload,
        { collection: "pages", id: 10, tenant: 1, slugs: localSlugs },
        paths,
      ),
    ).toEqual([]);
  });

  it("rejects a tenant page on a shared page's path, in the PG-02 wording", async () => {
    const payload = fakePayload([productsSolutions]);
    const problems = await pathProblems(
      payload,
      { collection: "pages", tenant: 1, slugs: localSlugs },
      { en: "/products-solutions", id: "/produk-solusi" },
    );
    expect(problems.map((problem) => problem.message)).toEqual([
      '/products-solutions is the shared page "Products & Solutions", on all 3 sites. Pick another slug.',
      '/produk-solusi is the shared page "Products & Solutions", on all 3 sites. Pick another slug.',
    ]);
  });

  it("rejects a shared page on any company's path, in the SP-03 wording", async () => {
    const payload = fakePayload([
      {
        ...privacy(11, 1),
        title: "Sustainability",
        path: { en: "/sustainability", id: "/sustainability" },
      },
      {
        ...privacy(12, 2),
        title: "Sustainability",
        path: { en: "/sustainability", id: "/sustainability" },
      },
      {
        ...privacy(13, 3),
        title: "Sustainability",
        path: { en: "/sustainability", id: "/sustainability" },
      },
    ]);
    const problems = await pathProblems(
      payload,
      { collection: "shared-pages", slugs: localSlugs },
      { en: "/sustainability", id: "/sustainability" },
    );
    expect(problems).toHaveLength(1);
    expect(problems[0].message).toBe(
      'Used by 3 companies: "Sustainability" on Dunia Kimia Utama, IndoAcid and Liku Telaga.',
    );
  });

  it("rejects a second shared page on the same path", async () => {
    const payload = fakePayload([productsSolutions]);
    const problems = await pathProblems(
      payload,
      { collection: "shared-pages", id: 51, slugs: localSlugs },
      { en: "/products-solutions", id: "/other" },
    );
    expect(problems[0].message).toBe(
      '/products-solutions is already the shared page "Products & Solutions". Pick another slug.',
    );
  });

  it("only compares within a locale", async () => {
    const payload = fakePayload([productsSolutions]);
    expect(
      await pathProblems(
        payload,
        { collection: "pages", tenant: 1, slugs: localSlugs },
        { en: "/produk-solusi", id: "/products-solutions" },
      ),
    ).toEqual([]);
  });

  it("words the messages for one company and for several titles", () => {
    expect(
      companyPagesMessage([{ title: "Careers", company: "IndoAcid" }]),
    ).toBe('Used by 1 company: "Careers" on IndoAcid.');
    expect(
      companyPagesMessage([
        { title: "Careers", company: "IndoAcid" },
        { title: "Jobs", company: "Liku Telaga" },
      ]),
    ).toBe(
      'Used by 2 companies: "Careers" on IndoAcid; "Jobs" on Liku Telaga.',
    );
    expect(sharedPageMessage("/x", "X", 3)).toBe(
      '/x is the shared page "X", on all 3 sites. Pick another slug.',
    );
  });

  it("names the other language when the clash is not in the one being saved", () => {
    const problem = { locale: "id", path: "/x", message: "Boom." };
    expect(problemMessage(problem, "en")).toBe("ID address: Boom.");
    expect(problemMessage(problem, "id")).toBe("Boom.");
    expect(problemMessage(problem, undefined)).toBe("Boom.");
  });
});

function hookArgs(
  collection: string,
  payload: Payload,
  overrides: Record<string, unknown> = {},
) {
  return {
    collection: { slug: collection },
    data: { tenant: 1 },
    originalDoc: undefined,
    siblingData: {},
    siblingDocWithLocales: {},
    req: { payload, locale: "en", t: (key: string) => key },
    ...overrides,
  } as never;
}

describe("the path field (FR-PM-08, FR-PM-09)", () => {
  it("writes the path through a beforeChange field hook on both collections", () => {
    for (const collection of [Pages, SharedPages]) {
      const field = findField(collection.fields, "path") as {
        hooks: { beforeChange: unknown[] };
      };
      expect(field.hooks.beforeChange).toContain(writePath);
      const flag = findField(collection.fields, "slugFallback") as {
        hooks: { beforeChange: unknown[] };
      };
      expect(flag.hooks.beforeChange).toContain(writeSlugFallback);
    }
  });

  it("returns the request locale's path and fills the other locales", async () => {
    const siblingDocWithLocales: Record<string, unknown> = {};
    const result = await writePath(
      hookArgs("pages", fakePayload([]), {
        siblingData: { slug: "about-us" },
        siblingDocWithLocales,
      }),
    );
    expect(result).toBe("/about-us");
    expect(siblingDocWithLocales.path).toEqual({
      en: "/about-us",
      id: "/about-us",
    });
  });

  it("keeps the id slug when saving en, from the stored document", async () => {
    const siblingDocWithLocales: Record<string, unknown> = {
      slug: { en: "about-us", id: "tentang-kami" },
    };
    await writePath(
      hookArgs("pages", fakePayload([]), {
        siblingData: { slug: "about" },
        siblingDocWithLocales,
      }),
    );
    expect(siblingDocWithLocales.path).toEqual({
      en: "/about",
      id: "/tentang-kami",
    });
  });

  it("throws a field-level error on slug for a reserved word", async () => {
    await expect(
      writePath(
        hookArgs("pages", fakePayload([]), { siblingData: { slug: "admin" } }),
      ),
    ).rejects.toMatchObject({
      status: 400,
      data: {
        errors: [{ path: "slug", message: RESERVED_MESSAGE }],
      },
    });
  });

  it("throws a field-level error on slug for a collision", async () => {
    await expect(
      writePath(
        hookArgs("pages", fakePayload([privacy(10, 1)]), {
          siblingData: { slug: "privacy-policy" },
        }),
      ),
    ).rejects.toMatchObject({
      data: {
        errors: [
          {
            path: "slug",
            message:
              '/privacy-policy is already used by "Privacy Policy" on Dunia Kimia Utama. Pick another slug.',
          },
        ],
      },
    });
  });

  it("accepts /privacy-policy on a second company", async () => {
    await expect(
      writePath(
        hookArgs("pages", fakePayload([privacy(10, 1)]), {
          data: { tenant: 2 },
          siblingData: { slug: "privacy-policy" },
        }),
      ),
    ).resolves.toBe("/privacy-policy");
  });

  it("writes every locale's path when a slug is saved as locale all", async () => {
    await expect(
      writePath(
        hookArgs("pages", fakePayload([]), {
          siblingData: { slug: { en: "about", id: "tentang" } },
          req: {
            payload: fakePayload([]),
            locale: "all",
            t: (key: string) => key,
          },
        }),
      ),
    ).resolves.toEqual({ en: "/about", id: "/tentang" });
  });

  it("computes the slug fallback flag", () => {
    const run = (
      siblingData: Record<string, unknown>,
      stored?: Record<string, unknown>,
    ) =>
      writeSlugFallback({
        req: { locale: "en" },
        siblingData,
        siblingDocWithLocales: stored,
      } as never);
    expect(run({ slug: "about" })).toBe(true);
    expect(run({ slug: "about" }, { slug: { id: "tentang" } })).toBe(false);
    expect(run({})).toBe(false);
  });

  it("leaves the request locale alone while it looks other pages up", async () => {
    const req = { payload: fakePayload([productsSolutions]), locale: "en" };
    const payload = {
      ...req.payload,
      findByID: async (args: { req: { locale: string } }) => {
        args.req.locale = "id";
        return productsSolutions;
      },
    } as unknown as Payload;
    await computePaths(
      payload,
      { collection: "shared-pages", parent: 50, slugs: { en: "x" } },
      req as never,
    );
    expect(req.locale).toBe("en");
  });
});
