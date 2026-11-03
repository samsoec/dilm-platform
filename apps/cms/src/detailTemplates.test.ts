import type { CollectionBeforeValidateHook, Payload, Where } from "payload";
import { describe, expect, it } from "vitest";

import { DetailTemplates } from "./collections/DetailTemplates";
import { Pages } from "./collections/Pages";
import { SharedDetailTemplates } from "./collections/SharedDetailTemplates";
import { SharedPages } from "./collections/SharedPages";
import { Tenants } from "./collections/Tenants";
import { Users } from "./collections/Users";
import { collections } from "./collections";
import {
  allowTemplateTokens,
  countGovernedRecords,
  keepOneTemplatePerType,
  rejectTokensOutsideTemplates,
  templateExistsMessage,
  UNKNOWN_TYPE_MESSAGE,
} from "./detailTemplates";
import { accessAs, applyMultiTenant, findField, testUser } from "./testing";
import { tenantScopedCollections } from "./tenancy";

const superAdmin = testUser(["super-admin"]);
const editor = testUser(["tenant-editor"], [1]);
const viewer = testUser(["tenant-viewer"], [1]);

type Row = Record<string, unknown>;

function matches(row: Row, where: Where): boolean {
  return Object.entries(where).every(([key, condition]) => {
    if (key === "and")
      return (condition as Where[]).every((w) => matches(row, w));
    const rule = condition as { equals?: unknown; not_equals?: unknown };
    if ("equals" in rule) return String(row[key]) === String(rule.equals);
    if ("not_equals" in rule)
      return String(row[key]) !== String(rule.not_equals);
    throw new Error(`unsupported condition on ${key}`);
  });
}

function fakePayload(tables: Record<string, Row[]>): Payload {
  return {
    count: async ({
      collection,
      where,
    }: {
      collection: string;
      where?: Where;
    }) => ({
      totalDocs: (tables[collection] ?? []).filter((row) =>
        where ? matches(row, where) : true,
      ).length,
    }),
  } as unknown as Payload;
}

function runHook(
  hook: CollectionBeforeValidateHook,
  args: {
    slug: string;
    data: Row;
    originalDoc?: Row;
    tables?: Record<string, Row[]>;
  },
) {
  return hook({
    collection: { slug: args.slug },
    data: args.data,
    originalDoc: args.originalDoc,
    operation: args.originalDoc ? "update" : "create",
    req: { payload: fakePayload(args.tables ?? {}) },
  } as unknown as Parameters<CollectionBeforeValidateHook>[0]);
}

const textBlock = (text: string) => [
  { blockType: "sectionHeading", id: "b1", title: text },
];

describe("shared detail templates (FR-PM-45)", () => {
  it("lets only a Super Admin write, and everyone read", () => {
    for (const key of ["create", "update", "delete"] as const) {
      expect(accessAs(SharedDetailTemplates, key, superAdmin)).toBe(true);
      expect(accessAs(SharedDetailTemplates, key, editor)).toBe(false);
      expect(accessAs(SharedDetailTemplates, key, viewer)).toBe(false);
      expect(accessAs(SharedDetailTemplates, key, null)).toBe(false);
    }
    expect(accessAs(SharedDetailTemplates, "read", editor)).toBe(true);
    expect(accessAs(SharedDetailTemplates, "read", null)).toEqual({
      _status: { equals: "published" },
    });
  });

  it("is global: not registered with the multi-tenant plugin", async () => {
    expect(
      Object.keys(
        tenantScopedCollections([SharedDetailTemplates, DetailTemplates]),
      ),
    ).toEqual(["detail-templates"]);
    const configured = (
      await applyMultiTenant([Users, Tenants, SharedDetailTemplates])
    )("shared-detail-templates");
    expect(findField(configured.fields, "tenant")).toBeUndefined();
  });

  it("offers product and solution, once each", () => {
    const field = findField(SharedDetailTemplates.fields, "recordType");
    expect(field).toMatchObject({
      type: "select",
      required: true,
      unique: true,
    });
    expect(
      (field as { options: { value: string }[] }).options.map((o) => o.value),
    ).toEqual(["product", "solution"]);
  });

  it("has drafts and versions and the full layout", () => {
    expect(SharedDetailTemplates.versions).toMatchObject({ drafts: true });
    expect(findField(SharedDetailTemplates.fields, "layout")).toMatchObject({
      type: "blocks",
    });
  });
});

describe("company detail templates (FR-PM-45)", () => {
  it("lets Tenant Editors and Super Admins write; a viewer only reads", () => {
    for (const key of ["create", "update"] as const) {
      expect(accessAs(DetailTemplates, key, superAdmin)).toBe(true);
      expect(accessAs(DetailTemplates, key, editor)).toBe(true);
      expect(accessAs(DetailTemplates, key, viewer)).toBe(false);
      expect(accessAs(DetailTemplates, key, null)).toBe(false);
    }
    expect(accessAs(DetailTemplates, "read", viewer)).toBe(true);
    expect(accessAs(DetailTemplates, "read", null)).toEqual({
      _status: { equals: "published" },
    });
  });

  it("keeps deleting a template to Super Admins", () => {
    expect(accessAs(DetailTemplates, "delete", superAdmin)).toBe(true);
    expect(accessAs(DetailTemplates, "delete", editor)).toBe(false);
  });

  it("scopes reads to the user's companies through the multi-tenant plugin", async () => {
    const configured = (
      await applyMultiTenant([Users, Tenants, DetailTemplates])
    )("detail-templates");
    expect(findField(configured.fields, "tenant")).toMatchObject({
      relationTo: "tenants",
    });
    expect(await accessAs(configured, "read", viewer)).toEqual({
      tenant: { in: [1] },
    });
    expect(await accessAs(configured, "read", superAdmin)).toBe(true);
  });

  it("offers job, post and category, with a unique index per company", () => {
    const field = findField(DetailTemplates.fields, "recordType");
    expect(
      (field as { options: { value: string }[] }).options.map((o) => o.value),
    ).toEqual(["job", "post", "category"]);
    expect(DetailTemplates.indexes).toContainEqual({
      fields: ["tenant", "recordType"],
      unique: true,
    });
    expect(DetailTemplates.versions).toMatchObject({ drafts: true });
  });

  it("is registered, and so is the shared collection", () => {
    const slugs = collections.map((collection) => collection.slug);
    expect(slugs).toContain("detail-templates");
    expect(slugs).toContain("shared-detail-templates");
  });
});

describe("one template per type", () => {
  const existing = {
    "detail-templates": [
      { id: 1, tenant: 1, recordType: "job" },
      { id: 2, tenant: 2, recordType: "post" },
    ],
    "shared-detail-templates": [{ id: 7, recordType: "product" }],
  };

  it("refuses a second template of the same type for a company", async () => {
    await expect(
      runHook(keepOneTemplatePerType, {
        slug: "detail-templates",
        data: { tenant: 1, recordType: "job" },
        tables: existing,
      }),
    ).rejects.toThrow(templateExistsMessage("job", "company"));
  });

  it("allows the same type for another company, or another type", async () => {
    for (const data of [
      { tenant: 2, recordType: "job" },
      { tenant: 1, recordType: "post" },
    ]) {
      await expect(
        runHook(keepOneTemplatePerType, {
          slug: "detail-templates",
          data,
          tables: existing,
        }),
      ).resolves.toEqual(data);
    }
  });

  it("lets a template be saved again, but not changed into a taken type", async () => {
    await expect(
      runHook(keepOneTemplatePerType, {
        slug: "detail-templates",
        data: { layout: [] },
        originalDoc: { id: 1, tenant: 1, recordType: "job" },
        tables: existing,
      }),
    ).resolves.toEqual({ layout: [] });
    await expect(
      runHook(keepOneTemplatePerType, {
        slug: "detail-templates",
        data: { recordType: "job" },
        originalDoc: { id: 3, tenant: 1, recordType: "post" },
        tables: existing,
      }),
    ).rejects.toThrow("already has a job template");
  });

  it("reads the company from the saved document when the update leaves it out", async () => {
    await expect(
      runHook(keepOneTemplatePerType, {
        slug: "detail-templates",
        data: { recordType: "post" },
        originalDoc: { id: 1, tenant: 2, recordType: "job" },
        tables: existing,
      }),
    ).rejects.toThrow("already has a post template");
  });

  it("refuses a second shared template of a type, whichever company asks", async () => {
    await expect(
      runHook(keepOneTemplatePerType, {
        slug: "shared-detail-templates",
        data: { recordType: "product" },
        tables: existing,
      }),
    ).rejects.toThrow(templateExistsMessage("product", "shared"));
    await expect(
      runHook(keepOneTemplatePerType, {
        slug: "shared-detail-templates",
        data: { recordType: "solution" },
        tables: existing,
      }),
    ).resolves.toBeDefined();
  });
});

describe("placeholders (FR-PM-28, TP-02)", () => {
  it("accepts {title} in a template layout", async () => {
    const data = { layout: textBlock("Available {title} Products") };
    expect(
      await runHook(allowTemplateTokens, { slug: "detail-templates", data }),
    ).toBe(data);
  });

  it("names an unknown placeholder in a template", async () => {
    await expect(
      runHook(allowTemplateTokens, {
        slug: "detail-templates",
        data: { layout: textBlock("Hello {name}") },
      }),
    ).rejects.toThrow("{name} isn't a placeholder. Use {title}.");
  });

  it("rejects placeholders on pages and shared pages", async () => {
    for (const slug of ["pages", "shared-pages"]) {
      await expect(
        runHook(rejectTokensOutsideTemplates, {
          slug,
          data: { layout: textBlock("About {title}") },
        }),
      ).rejects.toThrow("Placeholders only work in detail templates.");
    }
  });

  it("leaves a save without a layout alone", async () => {
    const data = { title: "Home" };
    expect(
      await runHook(rejectTokensOutsideTemplates, { slug: "pages", data }),
    ).toBe(data);
    expect(
      await runHook(allowTemplateTokens, { slug: "detail-templates", data }),
    ).toBe(data);
  });

  it("runs the right hook on each collection", () => {
    const validators = (collection: {
      hooks?: { beforeValidate?: unknown[] };
    }) => collection.hooks?.beforeValidate ?? [];
    expect(validators(DetailTemplates)).toContain(allowTemplateTokens);
    expect(validators(SharedDetailTemplates)).toContain(allowTemplateTokens);
    expect(validators(Pages)).toContain(rejectTokensOutsideTemplates);
    expect(validators(SharedPages)).toContain(rejectTokensOutsideTemplates);
    expect(validators(Pages)).not.toContain(allowTemplateTokens);
  });
});

describe("countGovernedRecords (FR-PM-46, TP-03)", () => {
  const tables = {
    products: [
      { _status: "published" },
      { _status: "published" },
      { _status: "draft" },
    ],
    solutions: [{ _status: "published" }],
    jobs: [
      { _status: "published", tenant: 1 },
      { _status: "published", tenant: 1 },
      { _status: "draft", tenant: 1 },
      { _status: "published", tenant: 2 },
    ],
    posts: [
      { _status: "published", tenant: 1 },
      { _status: "published", tenant: 2 },
      { _status: "published", tenant: 2 },
    ],
    categories: [{ id: 1 }, { id: 2 }, { id: 3 }],
  };
  const payload = fakePayload(tables);

  it("counts the published products or solutions of every company", async () => {
    expect(await countGovernedRecords(payload, { recordType: "product" })).toBe(
      2,
    );
    expect(
      await countGovernedRecords(payload, { recordType: "solution" }),
    ).toBe(1);
  });

  it("counts only the company's own published jobs and posts", async () => {
    expect(
      await countGovernedRecords(payload, { recordType: "job", tenant: 1 }),
    ).toBe(2);
    expect(
      await countGovernedRecords(payload, {
        recordType: "job",
        tenant: { id: 2 },
      }),
    ).toBe(1);
    expect(
      await countGovernedRecords(payload, { recordType: "post", tenant: 2 }),
    ).toBe(2);
  });

  it("counts every category, which all companies share", async () => {
    expect(
      await countGovernedRecords(payload, {
        recordType: "category",
        tenant: 1,
      }),
    ).toBe(3);
  });

  it("counts nothing for a company template without a company", async () => {
    expect(await countGovernedRecords(payload, { recordType: "job" })).toBe(0);
  });
});

describe("a record type the collection does not offer", () => {
  it("is refused with a plain message instead of reaching the database", async () => {
    await expect(
      runHook(keepOneTemplatePerType, {
        slug: "detail-templates",
        data: { tenant: 1, recordType: "product" },
      }),
    ).rejects.toThrow(UNKNOWN_TYPE_MESSAGE);
    await expect(
      runHook(keepOneTemplatePerType, {
        slug: "shared-detail-templates",
        data: { recordType: "job" },
      }),
    ).rejects.toThrow(UNKNOWN_TYPE_MESSAGE);
  });
});
