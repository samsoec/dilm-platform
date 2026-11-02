import type { Payload, Where } from "payload";
import { afterEach, describe, expect, it } from "vitest";

import { Products } from "./collections/Products";
import { Solutions } from "./collections/Solutions";
import {
  RECORD_COLLECTIONS,
  isRecordCollection,
  recordBaseSources,
} from "./recordBases";
import { ROUTABLE_COLLECTIONS, routeRows } from "./routeIndex";
import {
  computePaths,
  pathProblems,
  recordClashMessage,
  validatePageSlug,
} from "./paths";
import { findField } from "./testing";

type Row = {
  collection: "pages" | "shared-pages" | "products" | "solutions";
  id: number;
  title?: string;
  name?: string;
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
    }
    return { docs };
  };
  const count = async () => ({ totalDocs: Object.keys(tenants).length });
  return { find, count } as unknown as Payload;
}

const sulfuric = (
  collection: "products" | "solutions",
  id: number,
  tenant: number,
  name = "Sulfuric Acid",
): Row => ({
  collection,
  id,
  name,
  tenant,
  path: {
    en: "/products-solutions/our-products/sulfuric-acid",
    id: "/produk-solusi/produk-kami/sulfuric-acid",
  },
});

afterEach(() => {
  delete recordBaseSources.products;
  delete recordBaseSources.solutions;
});

function productsBase() {
  recordBaseSources.products = async () => ({
    en: "/products-solutions/our-products",
    id: "/produk-solusi/produk-kami",
  });
}

describe("record paths (FR-PM-8, FR-PM-23)", () => {
  it("knows which collections are records and routes them", () => {
    expect([...RECORD_COLLECTIONS]).toEqual(["products", "solutions"]);
    expect(isRecordCollection("products")).toBe(true);
    expect(isRecordCollection("pages")).toBe(false);
    expect(ROUTABLE_COLLECTIONS).toEqual(
      expect.arrayContaining(["products", "solutions"]),
    );
  });

  it("builds the path from the base page path and the slug in each language", async () => {
    productsBase();
    expect(
      await computePaths(fakePayload([]), {
        collection: "products",
        slugs: { en: "sulfuric-acid", id: "asam-sulfat" },
      }),
    ).toEqual({
      en: "/products-solutions/our-products/sulfuric-acid",
      id: "/produk-solusi/produk-kami/asam-sulfat",
    });
  });

  it("falls back to the English slug under the Indonesian base", async () => {
    productsBase();
    expect(
      await computePaths(fakePayload([]), {
        collection: "products",
        slugs: { en: "sulfuric-acid" },
      }),
    ).toMatchObject({ id: "/produk-solusi/produk-kami/sulfuric-acid" });
  });

  it("leaves the path empty while a draft has no slug yet", async () => {
    productsBase();
    expect(
      await computePaths(fakePayload([]), {
        collection: "products",
        slugs: {},
      }),
    ).toEqual({ en: "", id: "" });
  });

  it("rejects a slug another company's product already uses, naming both (PR-03)", async () => {
    productsBase();
    const payload = fakePayload([sulfuric("products", 7, 2)]);
    const { problems } = await validatePageSlug(payload, {
      collection: "products",
      id: 8,
      tenant: 1,
      slugs: { en: "sulfuric-acid", id: "sulfuric-acid" },
    });
    expect(problems.map((problem) => problem.message)).toEqual([
      '"Sulfuric Acid" by IndoAcid already uses this URL. Products share one catalog across the 3 sites, so slugs must be unique.',
    ]);
  });

  it("rejects a clash with the same company's product too", async () => {
    productsBase();
    const payload = fakePayload([sulfuric("products", 7, 1)]);
    const { problems } = await validatePageSlug(payload, {
      collection: "products",
      id: 8,
      tenant: 1,
      slugs: { en: "sulfuric-acid" },
    });
    expect(problems[0].message).toContain('"Sulfuric Acid" by Dunia Kimia');
  });

  it("allows the product to keep its own slug", async () => {
    productsBase();
    const payload = fakePayload([sulfuric("products", 7, 2)]);
    const { problems } = await validatePageSlug(payload, {
      collection: "products",
      id: 7,
      tenant: 2,
      slugs: { en: "sulfuric-acid" },
    });
    expect(problems).toEqual([]);
  });

  it("allows a fresh slug", async () => {
    productsBase();
    const payload = fakePayload([sulfuric("products", 7, 2)]);
    const { problems } = await validatePageSlug(payload, {
      collection: "products",
      tenant: 3,
      slugs: { en: "nitric-acid" },
    });
    expect(problems).toEqual([]);
  });

  it("does not check a draft that has no slug", async () => {
    productsBase();
    const payload = fakePayload([]);
    expect(
      await pathProblems(
        payload,
        { collection: "products", slugs: {} },
        { en: "", id: "" },
      ),
    ).toEqual([]);
  });

  it("flags a clash with a page of any company or a shared page", async () => {
    productsBase();
    const payload = fakePayload([
      {
        collection: "pages",
        id: 1,
        title: "Sulfuric Acid",
        tenant: 3,
        path: {
          en: "/products-solutions/our-products/sulfuric-acid",
          id: "/produk-solusi/produk-kami/sulfuric-acid",
        },
      },
      {
        collection: "shared-pages",
        id: 2,
        title: "Shared one",
        path: {
          en: "/products-solutions/our-products/sulfuric-acid",
          id: "/x",
        },
      },
    ]);
    const { problems } = await validatePageSlug(payload, {
      collection: "products",
      slugs: { en: "sulfuric-acid" },
    });
    const messages = problems.map((problem) => problem.message);
    expect(
      messages.some((text) => text.includes('shared page "Shared one"')),
    ).toBe(true);
    expect(messages.some((text) => text.includes("Liku Telaga"))).toBe(true);
  });

  it("flags a clash between a product and a solution", async () => {
    recordBaseSources.solutions = async () => ({
      en: "/products-solutions/our-products",
      id: "/produk-solusi/produk-kami",
    });
    const payload = fakePayload([sulfuric("products", 7, 2)]);
    const { problems } = await validatePageSlug(payload, {
      collection: "solutions",
      tenant: 1,
      slugs: { en: "sulfuric-acid" },
    });
    expect(problems[0].message).toBe(
      'The product "Sulfuric Acid" by IndoAcid already uses this URL. Products and solutions share one catalog across the 3 sites, so slugs must be unique.',
    );
  });

  it("words the solutions version of the message", () => {
    expect(
      recordClashMessage(
        "solutions",
        { collection: "solutions", name: "Water Treatment", company: "DKU" },
        3,
      ),
    ).toBe(
      '"Water Treatment" by DKU already uses this URL. Solutions share one catalog across the 3 sites, so slugs must be unique.',
    );
  });
});

describe("record route rows (FR-PM-13)", () => {
  it("indexes a published product with tenant null, whoever owns it", () => {
    expect(
      routeRows("products", {
        id: 7,
        _status: "published",
        tenant: 2,
        path: { en: "/p/sulfuric-acid", id: "/p/asam-sulfat" },
      }),
    ).toEqual([
      { tenant: null, locale: "en", path: "/p/sulfuric-acid", refs: [] },
      { tenant: null, locale: "id", path: "/p/asam-sulfat", refs: [] },
    ]);
  });

  it("indexes nothing for a draft, a trashed product or an empty path", () => {
    expect(
      routeRows("solutions", { id: 1, _status: "draft", path: {} }),
    ).toEqual([]);
    expect(
      routeRows("products", {
        id: 1,
        _status: "published",
        deletedAt: "2026-11-02",
        path: { en: "/p/x" },
      }),
    ).toEqual([]);
    expect(
      routeRows("products", {
        id: 1,
        _status: "published",
        path: { en: "", id: "" },
      }),
    ).toEqual([]);
  });

  it("gives both collections a localized slug and path", () => {
    for (const collection of [Products, Solutions]) {
      expect(findField(collection.fields, "slug")).toMatchObject({
        localized: true,
        required: true,
      });
      expect(findField(collection.fields, "path")).toMatchObject({
        localized: true,
      });
    }
  });
});
