import type {
  ArrayField,
  CollectionConfig,
  Field,
  RelationshipField,
  TabsField,
} from "payload";
import { describe, expect, it } from "vitest";

import { Documents } from "./Documents";
import { Products, MAX_VARIANTS } from "./Products";
import { Solutions } from "./Solutions";
import { Tenants } from "./Tenants";
import { Users } from "./Users";
import { isScriptsOnly, scriptsOnly } from "../fields/formula";
import {
  accessAs,
  applyMultiTenant,
  childFields,
  findField,
  subfields,
  testUser,
} from "../testing";

const superAdmin = testUser(["super-admin"]);
const editor = testUser(["tenant-editor"], [1]);
const viewer = testUser(["tenant-viewer"], [1]);
const outsiderEditor = testUser(["tenant-editor"], [2]);
const stranger = testUser(["tenant-editor"], []);

async function configured(slug: "products" | "solutions") {
  return (
    await applyMultiTenant([Users, Tenants, Documents, Products, Solutions])
  )(slug);
}

function fieldOf(collection: CollectionConfig, name: string): Field {
  return findField(collection.fields, name);
}

function arrayOf(collection: CollectionConfig, name: string): ArrayField {
  return fieldOf(collection, name) as ArrayField;
}

describe("products (§4.6.1)", () => {
  it("has the card, hero and detail fields", () => {
    for (const name of [
      "name",
      "productGroup",
      "shortDescription",
      "image",
      "formula",
      "casNumber",
      "classification",
      "overview",
      "pdsFile",
      "variants",
      "applications",
      "process",
      "order",
      "slug",
      "path",
    ]) {
      expect(fieldOf(Products, name), name).toBeDefined();
    }
  });

  it("localizes the fields marked L and not the others", () => {
    for (const name of [
      "name",
      "productGroup",
      "shortDescription",
      "classification",
    ]) {
      expect(fieldOf(Products, name)).toMatchObject({ localized: true });
    }
    for (const name of ["casNumber", "formula", "image", "pdsFile"]) {
      expect(fieldOf(Products, name)).not.toMatchObject({ localized: true });
    }
  });

  it("allows up to 20 variants with overrides, packaging, specs and data sheets", () => {
    const variants = arrayOf(Products, "variants");
    expect(variants.maxRows).toBe(MAX_VARIANTS);
    expect(MAX_VARIANTS).toBe(20);
    for (const name of [
      "name",
      "formula",
      "casNumber",
      "classification",
      "packaging",
      "specs",
      "pdsFile",
      "sdsFile",
    ]) {
      expect(findField(variants.fields, name), name).toBeDefined();
    }
  });

  it("takes 1 to 30 spec rows with a bold-row flag", () => {
    const specs = findField(
      arrayOf(Products, "variants").fields,
      "specs",
    ) as ArrayField;
    expect(specs).toMatchObject({ minRows: 1, maxRows: 30 });
    expect(specs.fields.map((field) => "name" in field && field.name)).toEqual([
      "parameter",
      "method",
      "value",
      "emphasized",
    ]);
  });

  it("takes up to 8 applications", () => {
    expect(arrayOf(Products, "applications")).toMatchObject({ maxRows: 8 });
  });

  it("holds the example process with a stat and up to 6 steps", () => {
    const process = fieldOf(Products, "process");
    const stat = findField(subfields(process), "stat");
    expect(
      subfields(stat).map((field) => "name" in field && field.name),
    ).toEqual(["value", "label", "description", "note"]);
    expect(findField(subfields(process), "steps")).toMatchObject({
      maxRows: 6,
    });
    expect(
      subfields(findField(subfields(process), "steps") as Field).some(
        (field) => "name" in field && field.name === "isThisProduct",
      ),
    ).toBe(true);
  });

  it("links data sheets to documents of the same company", () => {
    const pds = fieldOf(Products, "pdsFile");
    expect(pds).toMatchObject({ type: "upload", relationTo: "documents" });
    const filter = (pds as { filterOptions: (args: object) => unknown })
      .filterOptions;
    expect(filter({ data: { tenant: 4 } })).toEqual({
      tenant: { equals: "4" },
    });
  });

  it("keeps drafts, versions and trash on, and meta through the SEO plugin", () => {
    expect(Products.versions).toMatchObject({ drafts: true });
    expect(Products.trash).toBe(true);
    expect(Solutions.versions).toMatchObject({ drafts: true });
    expect(Solutions.trash).toBe(true);
  });

  it("keeps the tabs in the order of the design", () => {
    const tabs = Products.fields.find(
      (field) => field.type === "tabs",
    ) as TabsField;
    expect(tabs.tabs.map((tab) => tab.label)).toEqual([
      "Card & hero",
      "Overview",
      "Variants",
      "Applications",
      "Example process",
    ]);
  });
});

describe("the formula field", () => {
  it("is a rich text field that keeps only subscript and superscript", () => {
    expect(fieldOf(Products, "formula")).toMatchObject({ type: "richText" });
    type Node = {
      type: string;
      format?: number;
      text?: string;
      children?: Node[];
    };
    const text = (format: number, value = "x"): Node => ({
      type: "text",
      text: value,
      format,
    });
    const root = (children: Node[]): Node => ({
      type: "root",
      children: [{ type: "paragraph", children }],
    });
    expect(
      isScriptsOnly(root([text(0, "H"), text(32, "2"), text(64, "+")])),
    ).toBe(true);
    expect(isScriptsOnly(root([text(1)]))).toBe(false);
    expect(isScriptsOnly(root([text(2)]))).toBe(false);
    const cleaned = scriptsOnly(root([text(1 | 32, "2"), text(2 | 64, "3")]));
    expect(isScriptsOnly(cleaned)).toBe(true);
    expect(
      (cleaned.children![0].children as { format: number }[]).map(
        (node) => node.format,
      ),
    ).toEqual([32, 64]);
  });

  it("drops links and lists into plain text", () => {
    const cleaned = scriptsOnly({
      type: "root",
      children: [
        {
          type: "paragraph",
          children: [
            {
              type: "link",
              children: [{ type: "text", text: "a", format: 0 }],
            },
          ],
        },
        {
          type: "list",
          children: [
            {
              type: "listitem",
              children: [{ type: "text", text: "b", format: 0 }],
            },
          ],
        },
      ],
    });
    expect(isScriptsOnly(cleaned)).toBe(true);
    expect(cleaned.children).toHaveLength(2);
  });
});

describe("ownership of products and solutions (FR-PM-37, §4.12)", () => {
  it.each(["products", "solutions"] as const)(
    "%s: the owning company's editor edits, other editors only read",
    async (slug) => {
      const collection = await configured(slug);
      expect(await accessAs(collection, "update", superAdmin)).toBe(true);
      expect(await accessAs(collection, "update", editor)).toEqual({
        tenant: { in: [1] },
      });
      expect(await accessAs(collection, "update", outsiderEditor)).toEqual({
        tenant: { in: [2] },
      });
      expect(await accessAs(collection, "delete", editor)).toBe(false);
      expect(await accessAs(collection, "delete", superAdmin)).toBe(true);
      expect(await accessAs(collection, "create", viewer)).toBe(false);
      expect(await accessAs(collection, "update", viewer)).toBe(false);
    },
  );

  it.each(["products", "solutions"] as const)(
    "%s: every role reads every company's records",
    async (slug) => {
      const collection = await configured(slug);
      expect(await accessAs(collection, "read", superAdmin)).toBe(true);
      expect(await accessAs(collection, "read", editor)).toBe(true);
      expect(await accessAs(collection, "read", outsiderEditor)).toBe(true);
      expect(await accessAs(collection, "read", viewer)).toBe(true);
    },
  );

  it.each(["products", "solutions"] as const)(
    "%s: the public reads published records only",
    async (slug) => {
      const collection = await configured(slug);
      expect(await accessAs(collection, "read", null)).toEqual({
        _status: { equals: "published" },
      });
    },
  );

  it("shows editors a user with no company nothing", async () => {
    const collection = await configured("products");
    expect(await accessAs(collection, "read", stranger)).toBe(false);
  });

  it("lists every company's records, not just the selected one", async () => {
    const collection = await configured("products");
    expect(collection.admin?.baseFilter).toBeUndefined();
    expect(collection.admin?.baseListFilter).toBeUndefined();
  });

  it("makes the required tenant field the owner", async () => {
    const collection = await configured("products");
    expect(fieldOf(collection, "tenant")).toMatchObject({
      type: "relationship",
      relationTo: "tenants",
      validate: expect.any(Function),
    });
    const validate = (
      fieldOf(collection, "tenant") as {
        validate: (...args: unknown[]) => unknown;
      }
    ).validate;
    expect(
      await validate(undefined, {
        req: { t: (key: string) => key },
        required: true,
      }),
    ).not.toBe(true);
  });
});

describe("solutions (§4.6.2)", () => {
  it("has every field", () => {
    for (const name of [
      "name",
      "heroTitle",
      "industryLabel",
      "shortDescription",
      "image",
      "keyApplications",
      "industriesServed",
      "supportingProducts",
      "featuredProduct",
      "impact",
      "applications",
      "order",
      "slug",
      "path",
    ]) {
      expect(fieldOf(Solutions, name), name).toBeDefined();
    }
    expect(arrayOf(Solutions, "keyApplications")).toMatchObject({
      maxRows: 10,
    });
    expect(arrayOf(Solutions, "industriesServed")).toMatchObject({
      maxRows: 10,
    });
    expect(arrayOf(Solutions, "applications")).toMatchObject({ maxRows: 8 });
    const impact = fieldOf(Solutions, "impact");
    expect(findField(childFields(impact), "points")).toMatchObject({
      maxRows: 6,
    });
  });

  it("orders several supporting products", () => {
    expect(fieldOf(Solutions, "supportingProducts")).toMatchObject({
      relationTo: "products",
      hasMany: true,
    });
  });

  it("offers every company's published products, not just the owner's", async () => {
    const collection = await configured("solutions");
    for (const name of ["supportingProducts", "featuredProduct"]) {
      const field = fieldOf(collection, name) as RelationshipField;
      expect(field.filterOptions).toEqual({ _status: { equals: "published" } });
    }
  });

  it("runs the featured rule on featuredProduct", () => {
    expect(fieldOf(Solutions, "featuredProduct")).toMatchObject({
      validate: expect.any(Function),
    });
  });
});
