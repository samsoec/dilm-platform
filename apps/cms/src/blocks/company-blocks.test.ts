import type {
  ArrayField,
  Block,
  BlocksField,
  CollectionConfig,
  Field,
  GroupField,
  NumberField,
  PayloadRequest,
  RelationshipField,
  RichTextField,
  SelectField,
  TextField,
  Where,
} from "payload";
import { array, number, select } from "payload/shared";
import {
  CONTACT_FORM_FIELDS,
  MAX_ENTITY_ITEMS,
  tokenProblem,
} from "@dilm/shared-types";
import { beforeAll, describe, expect, it } from "vitest";

import { DetailTemplates } from "../collections/DetailTemplates";
import { Pages } from "../collections/Pages";
import { SharedDetailTemplates } from "../collections/SharedDetailTemplates";
import { SharedPages } from "../collections/SharedPages";
import { Tenants } from "../collections/Tenants";
import { assertRegistry, layoutField } from "../fields/layout";
import {
  ENTITY_NOT_OFFERED,
  entityScope,
  validateEntityPicks,
  validateOneEntity,
} from "../fields/recordPicks";
import { findField, subfields } from "../testing";
import {
  consentEditor,
  consentMissingMessage,
  isConsentEmpty,
  validateConsent,
} from "./contactInquiry";
import { PICK_A_COMPANY, entityContacts } from "./entityContacts";
import { contactInquiry } from "./contactInquiry";
import { entityMap } from "./entityMap";
import { groupShowcase } from "./groupShowcase";
import { locationMap } from "./locationMap";
import { pageBlocks } from ".";

const blocks: Record<string, Block> = {
  entityMap,
  groupShowcase,
  entityContacts,
  contactInquiry,
  locationMap,
};

const names = (fields: Field[]) =>
  fields.map((field) => ("name" in field ? field.name : ""));

const named = (fields: Field[], ...path: string[]): Field => {
  let field: Field = findField(fields, path[0]);
  for (const name of path.slice(1)) field = findField(subfields(field), name);
  return field;
};

const t = { t: (key: string) => key };

describe("the company blocks are registered (FR-PM-33)", () => {
  it("appends the five blocks after the record blocks", () => {
    expect(pageBlocks.slice(22).map(({ slug }) => slug)).toEqual(
      Object.keys(blocks),
    );
    expect(() => assertRegistry(pageBlocks)).not.toThrow();
  });

  it("puts the three company sections and the two current-company sections in their groups", () => {
    expect(
      Object.values(blocks).map((block) => [block.slug, block.admin?.group]),
    ).toEqual([
      ["entityMap", "Company sections"],
      ["groupShowcase", "Company sections"],
      ["entityContacts", "Company sections"],
      ["contactInquiry", "Current company"],
      ["locationMap", "Current company"],
    ]);
  });

  it("names every interface after its slug, with catalog metadata and a short table name", () => {
    for (const block of Object.values(blocks)) {
      const catalog = block.admin?.custom?.catalog as {
        purpose: string;
        figma: string[];
      };
      expect(block.interfaceName, block.slug).toBe(
        `${block.slug[0].toUpperCase()}${block.slug.slice(1)}Block`,
      );
      expect(catalog.purpose.length, block.slug).toBeGreaterThan(20);
      expect(catalog.figma[0].startsWith("section/"), block.slug).toBe(true);
      const dbName = block.dbName as (args: { tableName: string }) => string;
      expect(dbName({ tableName: "x" }).length, block.slug).toBeLessThan(8);
    }
  });

  it("is offered on every page, shared page and template", () => {
    for (const collection of [
      Pages,
      SharedPages,
      DetailTemplates,
      SharedDetailTemplates,
    ] as CollectionConfig[]) {
      const slugs = (
        findField(collection.fields, "layout") as BlocksField
      ).blocks.map(({ slug }) => slug);
      expect(slugs, collection.slug).toEqual(
        expect.arrayContaining(Object.keys(blocks)),
      );
    }
    expect(layoutField().blocks.length).toBe(pageBlocks.length);
  });

  it("passes the detail-template token scan", () => {
    for (const block of Object.values(blocks)) {
      expect(
        tokenProblem({ blockType: block.slug }, true),
        block.slug,
      ).toBeUndefined();
    }
  });
});

const relationshipCheck = (field: RelationshipField, count: number) =>
  (field.validate as typeof validateEntityPicks)(
    Array.from({ length: count }, (_, index) => index + 1),
    {
      relationTo: field.relationTo,
      minRows: field.minRows,
      maxRows: field.maxRows,
      required: field.required,
      siblingData: { source: "manual" },
      req: {
        t: (key: string) => key,
        payload: {
          collections: { tenants: {} },
          db: { defaultIDType: "number" },
        },
      },
      event: "onChange",
    } as never,
  );

describe("entityMap (§4.5.22)", () => {
  const fields = entityMap.fields;
  const items = named(fields, "items") as ArrayField;

  it("lists the heading and one to six cards", async () => {
    expect(names(fields)).toEqual(["heading", "items"]);
    expect([items.required, items.minRows, items.maxRows]).toEqual([
      true,
      1,
      MAX_ENTITY_ITEMS,
    ]);
    const check = (count: number) =>
      array(
        Array.from({ length: count }, () => ({})),
        {
          minRows: items.minRows,
          maxRows: items.maxRows,
          required: true,
          req: t,
        } as never,
      );
    expect(await check(1)).toBe(true);
    expect(await check(6)).toBe(true);
    expect(await check(0)).toBeTypeOf("string");
    expect(await check(7)).toBeTypeOf("string");
  });

  it("lists the company, photo, hub label, title, description, regions, pin and buttons of a card", () => {
    expect(names(items.fields)).toEqual([
      "entity",
      "image",
      "label",
      "title",
      "description",
      "regions",
      "pin",
      "buttons",
    ]);
  });

  it("leaves the company optional, so a card without one is free", () => {
    const entity = named(items.fields, "entity") as RelationshipField;
    expect(entity.relationTo).toBe("tenants");
    expect(entity.required).toBeFalsy();
    expect(entity.hasMany).toBeFalsy();
  });

  it("leaves every content field optional so it can fall back to the Profile", () => {
    for (const name of ["image", "label", "title", "description", "regions"]) {
      expect(
        (named(items.fields, name) as { required?: boolean }).required,
        name,
      ).toBeFalsy();
    }
  });

  it("keeps the pin within 0 to 100 percent", async () => {
    for (const axis of ["x", "y"]) {
      const field = named(items.fields, "pin", axis) as NumberField;
      expect([field.min, field.max]).toEqual([0, 100]);
      const check = (value: number) =>
        number(value, { min: field.min, max: field.max, req: t } as never);
      expect(await check(0)).toBe(true);
      expect(await check(100)).toBe(true);
      expect(await check(101)).toBeTypeOf("string");
      expect(await check(-1)).toBeTypeOf("string");
    }
  });

  it("allows at most ten regions, like the company Profile", () => {
    expect((named(items.fields, "regions") as ArrayField).maxRows).toBe(10);
  });
});

describe("groupShowcase (§4.5.23)", () => {
  const fields = groupShowcase.fields;

  it("lists the heading, main photo, logo, optional link and one to six ordered companies", async () => {
    expect(names(fields)).toEqual([
      "heading",
      "mainImage",
      "mainLogo",
      "mainLink",
      "entities",
    ]);
    const entities = named(fields, "entities") as RelationshipField;
    expect([
      entities.relationTo,
      entities.hasMany,
      entities.required,
      entities.minRows,
      entities.maxRows,
    ]).toEqual(["tenants", true, true, 1, 6]);
    expect(await relationshipCheck(entities, 1)).toBe(true);
    expect(await relationshipCheck(entities, 6)).toBe(true);
    expect(await relationshipCheck(entities, 7)).toBeTypeOf("string");
    expect(await relationshipCheck(entities, 0)).toBeTypeOf("string");
  });

  it("starts the heading left-aligned and keeps the link optional", async () => {
    const align = named(fields, "heading", "align") as SelectField;
    expect(align.defaultValue).toBe("left");
    const link = named(fields, "mainLink") as GroupField;
    const label = findField(link.fields, "label") as TextField;
    expect(
      await (label.validate as (v: unknown, a: unknown) => unknown)("", {
        siblingData: { type: "internal" },
        req: t,
      } as never),
    ).toBe(true);
  });
});

describe("entityContacts (§4.5.24)", () => {
  const fields = entityContacts.fields;
  const entities = named(fields, "entities") as RelationshipField;
  const source = named(fields, "source") as SelectField;

  it("offers every other company or a hand-picked list, defaulting to the others", async () => {
    expect(names(fields)).toEqual(["heading", "source", "entities"]);
    expect(source.options).toEqual([
      { value: "others", label: "Every other company" },
      { value: "manual", label: "Hand-picked" },
    ]);
    expect(source.defaultValue).toBe("others");
    expect(await select("others", { ...source, req: t } as never)).toBe(true);
    expect(await select("latest", { ...source, req: t } as never)).toBeTypeOf(
      "string",
    );
  });

  const check = (value: unknown, sourceValue: string | undefined) =>
    (entities.validate as typeof validateEntityPicks)(
      value as never,
      {
        relationTo: entities.relationTo,
        minRows: entities.minRows,
        maxRows: entities.maxRows,
        siblingData: { source: sourceValue },
        req: {
          t: (key: string) => key,
          payload: {
            collections: { tenants: {} },
            db: { defaultIDType: "number" },
          },
        },
        event: "onChange",
      } as never,
    );

  it("needs one to six companies when hand-picked, and nothing otherwise", async () => {
    expect(await check([], "others")).toBe(true);
    expect(await check(undefined, undefined)).toBe(true);
    expect(await check([], "manual")).toBe(PICK_A_COMPANY);
    expect(await check(null, "manual")).toBe(PICK_A_COMPANY);
    expect(await check([1, 2], "manual")).toBe(true);
    expect(await check([1, 2, 3, 4, 5, 6, 7], "manual")).toBeTypeOf("string");
  });

  it("shows the picks for Hand-picked only and drops them on save otherwise", async () => {
    const condition = (
      entities.admin as {
        condition: (d: object, s: object, o: object) => boolean;
      }
    ).condition;
    expect(condition({}, {}, { blockData: { source: "others" } })).toBe(false);
    expect(condition({}, {}, { blockData: { source: "manual" } })).toBe(true);
    const clear = entities.hooks!.beforeChange![0];
    const run = (sourceValue: string) =>
      clear({
        value: [1],
        siblingData: { source: sourceValue },
      } as never);
    expect(await run("others")).toBeNull();
    expect(await run("manual")).toEqual([1]);
  });
});

describe("locationMap (§4.5.27)", () => {
  it("has an optional company and a link label, and no other field", () => {
    expect(names(locationMap.fields)).toEqual(["entity", "linkLabel"]);
    const entity = named(locationMap.fields, "entity") as RelationshipField;
    expect(entity.relationTo).toBe("tenants");
    expect(entity.required).toBeFalsy();
    expect(
      (named(locationMap.fields, "linkLabel") as { localized?: boolean })
        .localized,
    ).toBe(true);
  });
});

describe("contactInquiry (§4.5.26)", () => {
  const form = named(contactInquiry.fields, "form") as GroupField;

  it("lists the heading and the form wording in design order", () => {
    expect(names(contactInquiry.fields)).toEqual(["heading", "form"]);
    expect(names(form.fields)).toEqual([
      "eyebrow",
      "title",
      "description",
      "fields",
      "consentText",
      "submitLabel",
      "successMessage",
      "errorMessage",
    ]);
  });

  it("has exactly the five fixed fields, each with only a label and a placeholder", () => {
    const fixed = named(contactInquiry.fields, "form", "fields") as GroupField;
    expect(names(fixed.fields)).toEqual([...CONTACT_FORM_FIELDS]);
    expect([...CONTACT_FORM_FIELDS]).toEqual([
      "fullName",
      "company",
      "workEmail",
      "phone",
      "message",
    ]);
    for (const field of fixed.fields as (GroupField & { name: string })[]) {
      expect(field.type, field.name).toBe("group");
      expect(names(field.fields), field.name).toEqual(["label", "placeholder"]);
      expect((field.fields[0] as { required?: boolean }).required).toBe(true);
    }
  });

  it("offers no way to add, remove or make a field optional", () => {
    const kinds = (fields: Field[]): string[] =>
      fields.flatMap((field) => [
        field.type,
        ...("fields" in field ? kinds(field.fields) : []),
      ]);
    const used = kinds(form.fields);
    expect(used).not.toContain("array");
    expect(used).not.toContain("blocks");
    expect(used).not.toContain("checkbox");
  });

  it("lets the consent text hold paragraphs and links only", () => {
    const consent = named(
      contactInquiry.fields,
      "form",
      "consentText",
    ) as RichTextField;
    expect(consent.localized).toBe(true);
    expect(consent.admin?.description).toContain("Privacy Policy");
    expect(consentEditor).toBeTypeOf("function");
  });
});

const lexical = (text: string, link = false) => ({
  root: {
    type: "root",
    children: [
      {
        type: "paragraph",
        children: link
          ? [{ type: "link", children: [{ type: "text", text }] }]
          : [{ type: "text", text }],
      },
    ],
  },
});

const empty = {
  root: { type: "root", children: [{ type: "paragraph", children: [] }] },
};

describe("the consent gate (US-BLD-9.4)", () => {
  it("reads empty, blank and missing editor values as empty, and any text or link text as filled", () => {
    expect(isConsentEmpty(undefined)).toBe(true);
    expect(isConsentEmpty(null)).toBe(true);
    expect(isConsentEmpty(empty)).toBe(true);
    expect(isConsentEmpty(lexical("   "))).toBe(true);
    expect(isConsentEmpty(lexical("I agree"))).toBe(false);
    expect(isConsentEmpty(lexical("Privacy Policy", true))).toBe(false);
  });

  const stored = (consent: Record<string, unknown> | null) => ({
    layout: [{ id: "blk", form: { consentText: consent } }],
  });

  const run = (
    value: unknown,
    {
      locale = "en",
      doc = stored(null),
      id = 7 as number | undefined,
    }: { locale?: string; doc?: unknown; id?: number | undefined } = {},
  ) => {
    const calls: unknown[] = [];
    const result = validateConsent(
      value as never,
      {
        id,
        collectionSlug: "pages",
        blockData: { id: "blk" },
        req: {
          locale,
          t: (key: string) => key,
          payload: {
            findByID: async (args: unknown) => {
              calls.push(args);
              return doc;
            },
          },
        },
      } as never,
    );
    return { result, calls };
  };

  it("says what is missing in Indonesian, with why and that drafts still save", async () => {
    const { result } = run(lexical("I agree"), {
      doc: stored({ en: lexical("I agree"), id: empty }),
    });
    const message = await result;
    expect(message).toBe(consentMissingMessage(["id"]));
    expect(message).toBe(
      "Add the consent text in Indonesian. Visitors can't send the form without agreeing to it, so the page can't be published. Save draft still works.",
    );
  });

  it("blocks when the current language is empty", async () => {
    const { result } = run(empty, {
      doc: stored({ en: empty, id: lexical("Saya setuju") }),
    });
    expect(await result).toBe(consentMissingMessage(["en"]));
  });

  it("blocks when both are empty and names both", async () => {
    const message = await run(undefined, { doc: stored(null) }).result;
    expect(message).toBe(consentMissingMessage(["en", "id"]));
    expect(message).toContain("English and Indonesian");
  });

  it("passes when every language has text, reading the other one from the saved draft", async () => {
    const { result, calls } = run(lexical("I agree"), {
      doc: stored({ id: lexical("Saya setuju") }),
    });
    expect(await result).toBe(true);
    expect(calls).toEqual([
      expect.objectContaining({
        collection: "pages",
        id: 7,
        draft: true,
        locale: "all",
        fallbackLocale: false,
      }),
    ]);
  });

  it("works from the Indonesian side too", async () => {
    const { result } = run(lexical("Saya setuju"), {
      locale: "id",
      doc: stored({ en: lexical("I agree") }),
    });
    expect(await result).toBe(true);
  });

  it("passes when a request carries both languages at once", async () => {
    const both = { en: lexical("I agree"), id: lexical("Saya setuju") };
    const { result, calls } = run(both);
    expect(await result).toBe(true);
    expect(calls).toEqual([]);
    expect(await run({ en: lexical("I agree"), id: empty }).result).toBe(
      consentMissingMessage(["id"]),
    );
  });

  it("treats a new page, or a block that was never saved, as missing the other language", async () => {
    expect(await run(lexical("I agree"), { id: undefined }).result).toBe(
      consentMissingMessage(["id"]),
    );
    expect(
      await run(lexical("I agree"), {
        doc: {
          layout: [
            { id: "other", form: { consentText: { id: lexical("x") } } },
          ],
        },
      }).result,
    ).toBe(consentMissingMessage(["id"]));
  });

  it("checks only the language in hand where there is no database, as in the browser", async () => {
    const result = await validateConsent(
      lexical("I agree") as never,
      {
        blockData: { id: "blk" },
        req: { locale: "en", t: (key: string) => key },
      } as never,
    );
    expect(result).toBe(consentMissingMessage(["id"]));
  });

  it("lets Payload skip it on a draft save, because no layout collection validates drafts", () => {
    for (const collection of [
      Pages,
      SharedPages,
      DetailTemplates,
      SharedDetailTemplates,
    ] as CollectionConfig[]) {
      const drafts = (
        collection.versions as { drafts?: boolean | { validate?: boolean } }
      ).drafts;
      expect(drafts, collection.slug).toBeTruthy();
      expect(
        typeof drafts === "object" ? drafts.validate : undefined,
        collection.slug,
      ).toBeFalsy();
    }
  });
});

type Tenant = { id: number; domain?: string | null };

const TENANTS: Tenant[] = [
  { id: 1, domain: "indonesianacids.com" },
  { id: 2, domain: "duniakimia.com" },
  { id: 3, domain: "" },
  { id: 4, domain: null },
];

function matchesDomain(doc: Tenant, where: Where): boolean {
  if (where.and) {
    return (where.and as Where[]).every((clause) => matchesDomain(doc, clause));
  }
  return Object.entries(where).every(([key, condition]) => {
    const value = (doc as Record<string, unknown>)[key];
    const ops = condition as Record<string, unknown>;
    if ("in" in ops) return (ops.in as unknown[]).includes(value);
    if ("exists" in ops) {
      return (value !== null && value !== undefined) === ops.exists;
    }
    if ("not_equals" in ops) return value !== ops.not_equals;
    throw new Error(`Unsupported ${JSON.stringify(where)}`);
  });
}

describe("company picker scope", () => {
  let collection: (slug: string) => CollectionConfig;

  beforeAll(() => {
    collection = (slug) =>
      [Pages, SharedPages].find((candidate) => candidate.slug === slug)!;
  });

  const offered = async () => {
    const where = (await (entityScope as (args: unknown) => unknown)({
      relationTo: "tenants",
      data: {},
      req: {} as PayloadRequest,
    })) as Where;
    return TENANTS.filter((doc) => matchesDomain(doc, where)).map(
      (doc) => doc.id,
    );
  };

  it("offers only companies that have a website address", async () => {
    expect(await offered()).toEqual([1, 2]);
  });

  it.each(["pages", "shared-pages"])(
    "uses that scope on every company picker of %s",
    (slug) => {
      const layout = findField(
        collection(slug).fields,
        "layout",
      ) as BlocksField;
      const pickers: [string, string[]][] = [
        ["entityMap", ["items", "entity"]],
        ["groupShowcase", ["entities"]],
        ["entityContacts", ["entities"]],
        ["locationMap", ["entity"]],
      ];
      for (const [slugOfBlock, path] of pickers) {
        const block = layout.blocks.find((b) => b.slug === slugOfBlock)!;
        const field = named(block.fields, ...path) as RelationshipField;
        expect(field.filterOptions, slugOfBlock).toBe(entityScope);
        expect(field.relationTo).toBe("tenants");
      }
    },
  );

  const pick = (value: unknown, stored: unknown) =>
    (
      validateOneEntity as unknown as (
        v: unknown,
        a: unknown,
      ) => Promise<string | true>
    )(value, {
      relationTo: "tenants",
      filterOptions: entityScope,
      data: {},
      id: 5,
      path: ["layout", 0, "entity"],
      collectionSlug: "shared-pages",
      siblingData: {},
      req: {
        t: (key: string) => key,
        payload: {
          collections: { tenants: {} },
          db: { defaultIDType: "number" },
          findByID: async () => stored,
        },
        payloadDataLoader: {
          find: async ({ where }: { where: Where }) => ({
            docs: TENANTS.filter((doc) => matchesDomain(doc, where)),
          }),
        },
        user: { id: 1 },
      },
    });

  it("accepts a real company and refuses one with no website address at publish", async () => {
    const none = { _status: "published", layout: [] };
    expect(await pick(2, none)).toBe(true);
    expect(await pick(3, none)).toBe(ENTITY_NOT_OFFERED);
  });

  it("lets through a company the published version already holds, never one held only by a draft", async () => {
    const published = { _status: "published", layout: [{ entity: 3 }] };
    const draft = { _status: "draft", layout: [{ entity: 3 }] };
    expect(await pick(3, published)).toBe(true);
    expect(await pick(3, draft)).toBe(ENTITY_NOT_OFFERED);
  });

  it("is the shared tenants collection that the pickers read", () => {
    expect(Tenants.slug).toBe("tenants");
  });
});
