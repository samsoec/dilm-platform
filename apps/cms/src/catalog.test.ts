import type { Payload, PayloadRequest, Where } from "payload";
import { describe, expect, it } from "vitest";

import {
  FEATURED_NOT_SUPPORTING,
  documentInUseMessage,
  documentUses,
  keepLinkedDocuments,
  keepLinkedDocumentsOnDelete,
  sameCompanyDocuments,
  validateFeaturedProduct,
} from "./catalog";

function validate(
  value: unknown,
  supportingProducts: unknown,
): ReturnType<typeof validateFeaturedProduct> {
  return validateFeaturedProduct(
    value as never,
    {
      event: "onChange",
      relationTo: "products",
      required: false,
      siblingData: { supportingProducts },
      req: {
        t: (key: string) => key,
        payload: { collections: {}, db: { defaultIDType: "number" } },
      },
    } as never,
  );
}

describe("the featured product rule (FR-PM-39)", () => {
  it("accepts a featured product that is one of the supporting products", async () => {
    expect(await validate(2, [1, 2, 3])).toBe(true);
    expect(await validate(2, ["2"])).toBe(true);
  });

  it("accepts no featured product", async () => {
    expect(await validate(null, [1])).toBe(true);
    expect(await validate(undefined, undefined)).toBe(true);
  });

  it("refuses a featured product that is not supporting", async () => {
    expect(await validate(4, [1, 2, 3])).toBe(FEATURED_NOT_SUPPORTING);
    expect(await validate(4, [])).toBe(FEATURED_NOT_SUPPORTING);
    expect(await validate(4, undefined)).toBe(FEATURED_NOT_SUPPORTING);
  });
});

describe("documents a product links", () => {
  const aluminium = {
    id: 1,
    name: "Aluminium Sulfate",
    pdsFile: 9,
    variants: [
      { name: "DILMasul101", pdsFile: 5, sdsFile: 6 },
      { name: "DILMasul102", pdsFile: 9, sdsFile: null },
    ],
  };

  it("names the variants and the product data sheet that use the file", () => {
    expect(documentUses([aluminium], 9)).toEqual([
      { product: "Aluminium Sulfate", places: ["DILMasul102", "product PDS"] },
    ]);
  });

  it("finds a safety data sheet link", () => {
    expect(documentUses([aluminium], 6)).toEqual([
      { product: "Aluminium Sulfate", places: ["DILMasul101"] },
    ]);
  });

  it("matches populated documents too", () => {
    expect(
      documentUses([{ id: 2, name: "X", pdsFile: { id: 9 } }], "9"),
    ).toEqual([{ product: "X", places: ["product PDS"] }]);
  });

  it("finds nothing for an unlinked file", () => {
    expect(documentUses([aluminium], 77)).toEqual([]);
  });

  it("words the refusal like the design (DC-03)", () => {
    expect(
      documentInUseMessage("trash", "PDS – DILMasul102", [
        {
          product: "Aluminium Sulfate",
          places: ["DILMasul102", "product PDS"],
        },
      ]),
    ).toBe(
      'Can\'t trash "PDS – DILMasul102". Published products link it: Aluminium Sulfate (DILMasul102, product PDS). Unlink it or replace the file instead.',
    );
  });
});

function fakePayload(products: object[]) {
  const finds: Where[] = [];
  const payload = {
    find: async (args: { collection: string; where: Where }) => {
      finds.push(args.where);
      return { docs: products };
    },
    findByID: async () => ({ title: "PDS – DILMasul102" }),
  } as unknown as Payload;
  return { payload, finds };
}

const linked = {
  id: 1,
  name: "Aluminium Sulfate",
  variants: [{ name: "DILMasul102", pdsFile: 9 }],
  pdsFile: 9,
};

function hookArgs(
  payload: Payload,
  data: object,
  originalDoc: object | undefined,
) {
  return {
    data,
    originalDoc,
    req: { payload } as unknown as PayloadRequest,
  } as never;
}

describe("trashing a document (FR-PM-40)", () => {
  const original = { id: 9, title: "PDS – DILMasul102" };

  it("is refused while a published product or variant links it, listing them", async () => {
    const { payload, finds } = fakePayload([linked]);
    await expect(
      keepLinkedDocuments(
        hookArgs(payload, { deletedAt: "2026-11-02" }, original),
      ),
    ).rejects.toThrow(
      'Can\'t trash "PDS – DILMasul102". Published products link it: Aluminium Sulfate (DILMasul102, product PDS). Unlink it or replace the file instead.',
    );
    expect(JSON.stringify(finds[0])).toContain("published");
    expect(JSON.stringify(finds[0])).toContain("variants.sdsFile");
  });

  it("goes through when no published product links it", async () => {
    const { payload } = fakePayload([]);
    const data = { deletedAt: "2026-11-02" };
    expect(await keepLinkedDocuments(hookArgs(payload, data, original))).toBe(
      data,
    );
  });

  it("does not check ordinary edits or restores", async () => {
    const { payload, finds } = fakePayload([linked]);
    const edit = { title: "New title" };
    expect(await keepLinkedDocuments(hookArgs(payload, edit, original))).toBe(
      edit,
    );
    const restore = { deletedAt: null };
    expect(
      await keepLinkedDocuments(
        hookArgs(payload, restore, { ...original, deletedAt: "x" }),
      ),
    ).toBe(restore);
    expect(finds).toEqual([]);
  });

  it("also protects a permanent delete", async () => {
    const { payload } = fakePayload([linked]);
    await expect(
      keepLinkedDocumentsOnDelete({
        id: 9,
        req: { payload } as unknown as PayloadRequest,
      } as never),
    ).rejects.toThrow("Can't delete");
  });
});

describe("picking a document for a product", () => {
  it("offers only the product's own company's documents", () => {
    const filter = sameCompanyDocuments() as (args: unknown) => unknown;
    expect(filter({ data: { tenant: 2 } })).toEqual({
      tenant: { equals: "2" },
    });
    expect(filter({ data: { tenant: { id: 3 } } })).toEqual({
      tenant: { equals: "3" },
    });
    expect(filter({ data: {} })).toBe(true);
  });
});
