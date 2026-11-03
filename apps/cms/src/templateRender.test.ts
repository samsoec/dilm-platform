import { MAX_HIGHLIGHTS } from "@dilm/shared-types";
import type { Where } from "payload";
import { describe, expect, it, vi } from "vitest";

import type { FindRecords, RecordDoc, RecordQuery } from "./recordCards";
import { getPublicationPage } from "./siteRouting";
import {
  heroAttributes,
  heroCrumbs,
  highlightCards,
  highlightDocs,
  neighbourCards,
  neighbourQueries,
  postHeroCrumbs,
} from "./templateRender";

const PUBLICATION = vi.hoisted(() => ({
  id: "9",
  title: "Publications",
  paths: { en: "/publications", id: "/publikasi" },
}));

vi.mock("./siteRouting", () => ({
  getPublicationPage: vi.fn(async () => PUBLICATION),
}));

describe("recordHero breadcrumbs (FR-PM-59)", () => {
  it("starts a post with the Publication page's title, never the category", () => {
    const crumbs = heroCrumbs({
      recordType: "post",
      locale: "en",
      currentLabel: "Detail Article",
      publicationPage: PUBLICATION,
      basePage: { title: "News", href: "/category/news" },
    });
    expect(crumbs).toEqual([
      { label: "Publications", href: "/publications" },
      { label: "Detail Article" },
    ]);
  });

  it("links the Publication crumb in the visitor's language", () => {
    const crumbs = heroCrumbs({
      recordType: "post",
      locale: "id",
      currentLabel: "Detail Artikel",
      publicationPage: PUBLICATION,
    });
    expect(crumbs[0]).toEqual({ label: "Publications", href: "/publikasi" });
  });

  it("leaves out the first crumb of a post when the company has no Publication page", () => {
    expect(
      heroCrumbs({
        recordType: "post",
        locale: "en",
        currentLabel: "Detail Article",
        publicationPage: null,
      }),
    ).toEqual([{ label: "Detail Article" }]);
  });

  it.each(["product", "solution", "job"] as const)(
    "starts a %s with its list page",
    (recordType) => {
      expect(
        heroCrumbs({
          recordType,
          locale: "en",
          currentLabel: "Detail",
          basePage: { title: "Our Products", href: "/products" },
          publicationPage: PUBLICATION,
        }),
      ).toEqual([
        { label: "Our Products", href: "/products" },
        { label: "Detail" },
      ]);
    },
  );

  it("fills {title} in the last crumb and skips an empty one", () => {
    expect(
      heroCrumbs({
        recordType: "job",
        locale: "en",
        currentLabel: "About {title}",
        record: { title: { en: "Chemist" } },
      }),
    ).toEqual([{ label: "About Chemist" }]);
    expect(
      heroCrumbs({ recordType: "job", locale: "en", currentLabel: "  " }),
    ).toEqual([]);
  });

  it("reads the Publication page of the post's company through getPublicationPage", async () => {
    const payload = {} as never;
    const crumbs = await postHeroCrumbs(
      payload,
      2,
      { locale: "id", currentLabel: "Detail Artikel" },
      undefined,
    );
    expect(getPublicationPage).toHaveBeenCalledWith(payload, 2, undefined);
    expect(crumbs).toEqual([
      { label: "Publications", href: "/publikasi" },
      { label: "Detail Artikel" },
    ]);
  });
});

describe("recordHero facts", () => {
  const labels = { formula: "Formula", casNumber: "CAS" };

  it("keeps the fixed order of the record type and drops empty facts", () => {
    expect(
      heroAttributes("product", labels, {
        classification: "Acid",
        casNumber: "7664-93-9",
        formula: "H2SO4",
        totalVariants: 0,
        department: "ignored",
      }),
    ).toEqual([
      { key: "formula", label: "Formula", value: "H2SO4" },
      { key: "casNumber", label: "CAS", value: "7664-93-9" },
      { key: "totalVariants", label: "", value: "0" },
      { key: "classification", label: "", value: "Acid" },
    ]);
    expect(
      heroAttributes("post", null, { category: "", publishedDate: null }),
    ).toEqual([]);
  });

  it("shows a post's category and published date only", () => {
    expect(
      heroAttributes("post", undefined, {
        category: "News",
        publishedDate: "3 Nov 2026",
        location: "x",
      }).map(({ key }) => key),
    ).toEqual(["category", "publishedDate"]);
  });
});

const post = (id: number, extra: Partial<RecordDoc> = {}): RecordDoc => ({
  id,
  _status: "published",
  tenant: 2,
  path: `/category/news/post-${id}`,
  ...extra,
});

describe("the highlights leave the post in context out (FR-PM-30, US-PST-5)", () => {
  it("drops the post being read, at any position", () => {
    expect(highlightDocs([1, 2, 3], 2)).toEqual([1, 3]);
    expect(
      highlightDocs([post(1), post(2)], 1).map((d) => (d as RecordDoc).id),
    ).toEqual([2]);
    expect(highlightDocs([post(1)], "1")).toEqual([]);
  });

  it("returns all five when the post in context isn't among them", () => {
    expect(highlightDocs([1, 2, 3, 4, 5], 99)).toEqual([1, 2, 3, 4, 5]);
  });

  it("never exceeds five, and removes repeats", () => {
    expect(highlightDocs([1, 1, 2, 3, 4, 5, 6, 7], 99)).toEqual([
      1, 2, 3, 4, 5,
    ]);
    expect(MAX_HIGHLIGHTS).toBe(5);
  });

  it("drops unpublished, deleted and empty picks", () => {
    expect(
      highlightDocs(
        [
          post(1, { _status: "draft" }),
          post(2, { deletedAt: "2026-11-01" }),
          null,
          undefined,
          post(3),
        ],
        99,
      ),
    ).toEqual([post(3)]);
  });

  it("shows nothing when none are picked", () => {
    expect(highlightDocs(null, 1)).toEqual([]);
    expect(highlightDocs([], 1)).toEqual([]);
  });

  it("builds cards without the post in context and with five at most", async () => {
    const picks = [1, 2, 3, 4, 5, 6].map((id) => post(id));
    const cards = await highlightCards(picks, 3, {
      viewerTenant: 2,
      locale: "en",
      domains: { "2": "duniakimia.com" },
    });
    expect(cards.map((card) => card.id)).toEqual(["1", "2", "4", "5", "6"]);
    expect(cards[0].href).toBe("/category/news/post-1");
  });

  it("draws a post that is only an id by skipping it, since it can't be shown", async () => {
    expect(await highlightCards([7], 1, { viewerTenant: 2 })).toEqual([]);
  });
});

type Stored = RecordDoc & { publishedAt?: string | null };

function compare(value: unknown, op: string, wanted: unknown): boolean {
  if (op === "exists") {
    return (value !== null && value !== undefined) === wanted;
  }
  if (value === null || value === undefined) return false;
  if (op === "equals") return String(value) === String(wanted);
  if (op === "not_equals") return String(value) !== String(wanted);
  const left =
    typeof wanted === "string" && /^\d{4}-/.test(wanted)
      ? new Date(String(value)).getTime()
      : Number(value);
  const right =
    typeof wanted === "string" && /^\d{4}-/.test(wanted)
      ? new Date(wanted).getTime()
      : Number(wanted);
  if (op === "less_than") return left < right;
  if (op === "greater_than") return left > right;
  throw new Error(`Unsupported operator ${op}`);
}

function matches(doc: Stored, where: Where): boolean {
  if (where.and) return (where.and as Where[]).every((w) => matches(doc, w));
  if (where.or) return (where.or as Where[]).some((w) => matches(doc, w));
  return Object.entries(where).every(([key, condition]) =>
    Object.entries(condition as Record<string, unknown>).every(([op, wanted]) =>
      compare((doc as Record<string, unknown>)[key], op, wanted),
    ),
  );
}

function finderOver(docs: Stored[]): FindRecords & {
  calls: RecordQuery[];
} {
  const calls: RecordQuery[] = [];
  const find = (async (query: RecordQuery) => {
    calls.push(query);
    const keys = ([] as string[]).concat(query.sort);
    return docs
      .filter((doc) => matches(doc, query.where))
      .sort((a, b) => {
        for (const key of keys) {
          const field = key.replace("-", "");
          const sign = key.startsWith("-") ? -1 : 1;
          const x = (a as Record<string, unknown>)[field] as string | number;
          const y = (b as Record<string, unknown>)[field] as string | number;
          if (x === y) continue;
          return (x < y ? -1 : 1) * sign;
        }
        return 0;
      })
      .slice(0, query.limit);
  }) as FindRecords & { calls: RecordQuery[] };
  find.calls = calls;
  return find;
}

const at = (id: number, day: string, extra: Partial<Stored> = {}): Stored =>
  post(id, { publishedAt: `${day}T00:00:00.000Z`, ...extra });

const CONTEXT = {
  viewerTenant: 2,
  locale: "en",
  domains: { "2": "duniakimia.com", "3": "likutelaga.com" },
};

describe("previous and next posts (PS-11)", () => {
  const posts: Stored[] = [
    at(1, "2026-09-01", { primaryCategory: 10 }),
    at(2, "2026-10-01", { primaryCategory: 11 }),
    at(3, "2026-10-15", { primaryCategory: 10 }),
    at(4, "2026-11-01", { primaryCategory: 12 }),
    at(5, "2026-10-10", { tenant: 3 }),
    at(6, "2026-10-12", { _status: "draft" }),
    at(7, "2026-10-14", { deletedAt: "2026-10-20" }),
  ];
  const ids = (card: { id: string } | null) => card?.id ?? null;
  const open = (id: number) => posts.find((doc) => doc.id === id)!;

  it("finds the adjacent published posts by date across every category", async () => {
    const result = await neighbourCards(finderOver(posts), open(3), CONTEXT);
    expect(ids(result.previous)).toBe("2");
    expect(ids(result.next)).toBe("4");
    expect(open(2).primaryCategory).not.toBe(open(3).primaryCategory);
    expect(open(4).primaryCategory).not.toBe(open(3).primaryCategory);
  });

  it("hides the previous side on the oldest post", async () => {
    const result = await neighbourCards(finderOver(posts), open(1), CONTEXT);
    expect(result.previous).toBeNull();
    expect(ids(result.next)).toBe("2");
  });

  it("hides the next side on the newest post", async () => {
    const result = await neighbourCards(finderOver(posts), open(4), CONTEXT);
    expect(ids(result.previous)).toBe("3");
    expect(result.next).toBeNull();
  });

  it("hides both sides when the post is the only one", async () => {
    const result = await neighbourCards(
      finderOver([open(3)]),
      open(3),
      CONTEXT,
    );
    expect(result).toEqual({ previous: null, next: null });
  });

  it("never offers another company's post, a draft or a deleted one", async () => {
    const result = await neighbourCards(finderOver(posts), open(3), CONTEXT);
    expect([ids(result.previous), ids(result.next)]).not.toContain("5");
    expect([ids(result.previous), ids(result.next)]).not.toContain("6");
    expect([ids(result.previous), ids(result.next)]).not.toContain("7");
  });

  it("orders posts published on the same day by id, so no post is skipped or repeated", async () => {
    const same = [
      at(21, "2026-10-01"),
      at(22, "2026-10-01"),
      at(23, "2026-10-01"),
    ];
    const find = finderOver(same);
    const middle = await neighbourCards(find, same[1], CONTEXT);
    expect([ids(middle.previous), ids(middle.next)]).toEqual(["21", "23"]);
    const first = await neighbourCards(find, same[0], CONTEXT);
    expect([ids(first.previous), ids(first.next)]).toEqual([null, "22"]);
    const last = await neighbourCards(find, same[2], CONTEXT);
    expect([ids(last.previous), ids(last.next)]).toEqual(["22", null]);
  });

  it("skips a neighbour that can't be shown and uses the next one along", async () => {
    const withGap = [
      at(31, "2026-10-01"),
      at(32, "2026-10-02", { path: null }),
      at(33, "2026-10-03"),
    ];
    const result = await neighbourCards(
      finderOver(withGap),
      withGap[2],
      CONTEXT,
    );
    expect(ids(result.previous)).toBe("31");
  });

  it("hides both sides for a post with no published date, which has no place in the order", async () => {
    const find = finderOver(posts);
    const result = await neighbourCards(
      find,
      post(40, { publishedAt: null }),
      CONTEXT,
    );
    expect(result).toEqual({ previous: null, next: null });
    expect(find.calls).toEqual([]);
    expect(neighbourQueries({ id: 40, tenant: 2 })).toBeNull();
  });

  it("asks for published posts of the post's own company only", () => {
    const queries = neighbourQueries(open(3))!;
    for (const query of [queries.previous, queries.next]) {
      expect(query.collection).toBe("posts");
      expect(JSON.stringify(query.where)).toContain(
        JSON.stringify({ _status: { equals: "published" } }),
      );
      expect(JSON.stringify(query.where)).toContain(
        JSON.stringify({ tenant: { equals: "2" } }),
      );
      expect(JSON.stringify(query.where)).not.toContain("primaryCategory");
    }
    expect(queries.previous.sort).toEqual(["-publishedAt", "-id"]);
    expect(queries.next.sort).toEqual(["publishedAt", "id"]);
  });
});
