import { MAX_RECORD_QUERY } from "@dilm/shared-types";
import { describe, expect, it, vi } from "vitest";

import {
  allQuery,
  cardFor,
  clampLimit,
  latestCards,
  latestQuery,
  manualCards,
  postItemCards,
  type FindRecords,
  type RecordDoc,
  type RecordQuery,
} from "./recordCards";

const NOW = new Date("2026-11-03T08:00:00.000Z");
const FUTURE = "2026-11-20T12:00:00.000Z";
const PAST = "2026-11-01T12:00:00.000Z";

const DOMAINS = { "2": "duniakimia.com", "3": "likutelaga.com" };

const context = (viewerTenant: number | undefined = 2) => ({
  viewerTenant,
  domains: DOMAINS,
  locale: "en",
  now: NOW,
  warn: vi.fn(),
});

const job = (id: number, extra: Partial<RecordDoc> = {}): RecordDoc => ({
  id,
  _status: "published",
  status: "open",
  tenant: 2,
  path: `/careers/job-${id}`,
  ...extra,
});

const post = (id: number, extra: Partial<RecordDoc> = {}): RecordDoc => ({
  id,
  _status: "published",
  tenant: 2,
  path: { en: `/category/news/post-${id}`, id: `/kategori/berita/post-${id}` },
  ...extra,
});

const product = (id: number, extra: Partial<RecordDoc> = {}): RecordDoc => ({
  id,
  _status: "published",
  tenant: 3,
  path: `/products/product-${id}`,
  ...extra,
});

describe("hand-picked cards skip what can't be shown (FR-PM-31)", () => {
  it("drops unpublished, deleted and unreadable picks instead of rendering empty cards", async () => {
    const cards = await manualCards(
      "products",
      [
        product(1),
        product(2, { _status: "draft" }),
        product(3, { deletedAt: "2026-11-02T00:00:00.000Z" }),
        4,
        null,
        product(5),
      ],
      context(),
    );
    expect(cards.map((card) => card.id)).toEqual(["1", "5"]);
    expect(cards.every((card) => card.href.length > 0)).toBe(true);
  });

  it("keeps the editor's order", async () => {
    const cards = await manualCards(
      "products",
      [product(9), product(1), product(5)],
      context(),
    );
    expect(cards.map((card) => card.id)).toEqual(["9", "1", "5"]);
  });

  it("drops a pick with no path in any language", async () => {
    expect(
      await manualCards("products", [product(1, { path: null })], context()),
    ).toEqual([]);
  });

  it("drops closed jobs and jobs past their closing time, as the job sections do", async () => {
    const cards = await manualCards(
      "jobs",
      [
        job(1),
        job(2, { status: "closed" }),
        job(3, { closingDate: PAST }),
        job(4, { closingDate: FUTURE }),
        job(5, { _status: "draft" }),
      ],
      context(),
    );
    expect(cards.map((card) => card.id)).toEqual(["1", "4"]);
  });
});

describe("card links (FR-PM-31, FR-PM-25)", () => {
  it("links products and solutions to the same-domain path, whichever company owns them", async () => {
    for (const viewer of [2, 3, undefined]) {
      const card = await cardFor("products", product(1, { tenant: 3 }), {
        ...context(),
        viewerTenant: viewer,
      });
      expect(card?.href).toBe("/products/product-1");
    }
    const solution = await cardFor(
      "solutions",
      product(7, { tenant: 2, path: "/solutions/s" }),
      context(3),
    );
    expect(solution?.href).toBe("/solutions/s");
  });

  it("links a job or post of the viewer's own company by path", async () => {
    expect((await cardFor("jobs", job(1), context(2)))?.href).toBe(
      "/careers/job-1",
    );
    expect((await cardFor("posts", post(1), context(2)))?.href).toBe(
      "/category/news/post-1",
    );
  });

  it("links another company's job or post to its absolute URL on that company's domain", async () => {
    expect(
      (await cardFor("jobs", job(1, { tenant: 3 }), context(2)))?.href,
    ).toBe("https://likutelaga.com/careers/job-1");
    expect(
      (await cardFor("posts", post(1, { tenant: 3 }), context(2)))?.href,
    ).toBe("https://likutelaga.com/category/news/post-1");
  });

  it("uses the viewer's language for the path", async () => {
    const card = await cardFor("posts", post(1, { tenant: 3 }), {
      ...context(2),
      locale: "id",
    });
    expect(card?.href).toBe("https://likutelaga.com/kategori/berita/post-1");
  });

  it("links a category by path", async () => {
    const card = await cardFor(
      "categories",
      { id: 4, path: "/category/news" },
      context(2),
    );
    expect(card?.href).toBe("/category/news");
  });

  it("skips another company's card when its domain is unknown, rather than guess", async () => {
    const warn = vi.fn();
    const card = await cardFor("jobs", job(1, { tenant: 9 }), {
      ...context(2),
      warn,
    });
    expect(card).toBeNull();
    expect(warn).toHaveBeenCalled();
  });
});

describe("hand-picked post cards (§4.5.18, PRD Q10)", () => {
  it("links a picked post to that post and keeps its card text overrides", async () => {
    const [card] = await postItemCards(
      [
        {
          doc: { relationTo: "posts", value: post(1) },
          eyebrow: "ENVIRONMENT",
          title: "Protecting Our Environment",
          description: "",
          image: { id: 8 },
        },
      ],
      context(),
    );
    expect(card.href).toBe("/category/news/post-1");
    expect(card.overrides).toEqual({
      eyebrow: "ENVIRONMENT",
      title: "Protecting Our Environment",
      image: { id: 8 },
    });
  });

  it("leaves the card on the record's own text when nothing is overridden", async () => {
    const [card] = await postItemCards(
      [{ doc: { relationTo: "posts", value: post(1) }, title: "" }],
      context(),
    );
    expect(card.overrides).toBeUndefined();
  });

  it("links a picked category to the category and another company's post to its domain", async () => {
    const cards = await postItemCards(
      [
        {
          doc: {
            relationTo: "categories",
            value: { id: 4, path: "/category/esg" },
          },
        },
        { doc: { relationTo: "posts", value: post(2, { tenant: 3 }) } },
      ],
      context(2),
    );
    expect(cards.map((card) => card.href)).toEqual([
      "/category/esg",
      "https://likutelaga.com/category/news/post-2",
    ]);
  });

  it("skips unpublished, deleted and unreadable posts and unknown collections", async () => {
    const cards = await postItemCards(
      [
        { doc: { relationTo: "posts", value: post(1, { _status: "draft" }) } },
        { doc: { relationTo: "posts", value: post(2, { deletedAt: "x" }) } },
        { doc: { relationTo: "posts", value: 3 } },
        { doc: { relationTo: "jobs", value: job(4) } },
        { doc: null },
        { doc: { relationTo: "posts", value: post(5) } },
      ],
      context(),
    );
    expect(cards.map((card) => card.id)).toEqual(["5"]);
  });
});

describe("what the 'all' and 'latest' sources ask the database for (FR-PM-30)", () => {
  it("lists every published product or solution by hand-set order, one bounded page at a time", () => {
    expect(allQuery("products")).toMatchObject({
      collection: "products",
      where: { _status: { equals: "published" } },
      sort: "order",
      page: 1,
      limit: MAX_RECORD_QUERY,
    });
    expect(allQuery("solutions", { page: 3, limit: 24 })).toMatchObject({
      page: 3,
      limit: 24,
    });
    expect(allQuery("products", { limit: 100000 }).limit).toBe(
      MAX_RECORD_QUERY,
    );
    expect(allQuery("products", { page: 0 }).page).toBe(1);
  });

  it("keeps a limit between 1 and the cap", () => {
    expect(clampLimit(0)).toBe(1);
    expect(clampLimit(-5)).toBe(1);
    expect(clampLimit(3.9)).toBe(3);
    expect(clampLimit(undefined)).toBe(MAX_RECORD_QUERY);
    expect(clampLimit(Number.NaN)).toBe(MAX_RECORD_QUERY);
  });

  it("asks a company page for that company's open jobs, newest first", () => {
    const query = latestQuery({
      collection: "jobs",
      scopeTenant: 2,
      limit: 3,
      now: NOW,
    });
    expect(query.sort).toBe("-postedDate");
    expect(query.limit).toBe(3);
    expect(JSON.stringify(query.where)).toContain('"tenant":{"equals":"2"}');
    expect(JSON.stringify(query.where)).toContain('"status":{"equals":"open"}');
    expect(JSON.stringify(query.where)).toContain(NOW.toISOString());
  });

  it("asks a shared page for every company's open jobs", () => {
    const query = latestQuery({ collection: "jobs", limit: 3, now: NOW });
    expect(JSON.stringify(query.where)).not.toContain("tenant");
  });

  it("leaves the job in context out of the query", () => {
    const query = latestQuery({
      collection: "jobs",
      scopeTenant: 2,
      limit: 3,
      exclude: { collection: "jobs", id: 17 },
      now: NOW,
    });
    expect(JSON.stringify(query.where)).toContain('"id":{"not_equals":"17"}');
    const other = latestQuery({
      collection: "jobs",
      limit: 3,
      exclude: { collection: "posts", id: 17 },
    });
    expect(JSON.stringify(other.where)).not.toContain("not_equals");
  });

  it("filters posts by category and company, newest first", () => {
    const company = latestQuery({
      collection: "posts",
      scopeTenant: 2,
      categories: [4, { id: 5 }],
      limit: 6,
    });
    expect(company.sort).toBe("-publishedAt");
    expect(company.where).toEqual({
      and: [
        {
          and: [
            { _status: { equals: "published" } },
            { tenant: { equals: "2" } },
          ],
        },
        { primaryCategory: { in: ["4", "5"] } },
      ],
    });
    expect(latestQuery({ collection: "posts", limit: 6 }).where).toEqual({
      _status: { equals: "published" },
    });
  });
});

describe("latest cards", () => {
  const finder = (docs: RecordDoc[]) => {
    const seen: RecordQuery[] = [];
    const find: FindRecords = async (query) => {
      seen.push(query);
      return docs;
    };
    return { find, seen };
  };

  it("excludes the job in context", async () => {
    const { find, seen } = finder([job(1), job(2), job(3)]);
    const cards = await latestCards(
      find,
      {
        collection: "jobs",
        scopeTenant: 2,
        limit: 3,
        exclude: { collection: "jobs", id: 2 },
        now: NOW,
      },
      context(),
    );
    expect(cards.map((card) => card.id)).toEqual(["1", "3"]);
    expect(JSON.stringify(seen[0].where)).toContain('"not_equals":"2"');
  });

  it("never returns more than the limit, nor an unlisted job the database let through", async () => {
    const { find } = finder([
      job(1, { status: "closed" }),
      job(2),
      job(3),
      job(4),
    ]);
    const cards = await latestCards(
      find,
      { collection: "jobs", limit: 2, now: NOW },
      context(),
    );
    expect(cards.map((card) => card.id)).toEqual(["2", "3"]);
  });

  it("links a shared page's latest posts to each company's own domain", async () => {
    const { find } = finder([post(1, { tenant: 2 }), post(2, { tenant: 3 })]);
    const cards = await latestCards(
      find,
      { collection: "posts", limit: 6 },
      context(2),
    );
    expect(cards.map((card) => card.href)).toEqual([
      "/category/news/post-1",
      "https://likutelaga.com/category/news/post-2",
    ]);
  });
});
