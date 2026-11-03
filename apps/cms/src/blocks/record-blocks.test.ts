import type {
  ArrayField,
  Block,
  BlocksField,
  CollectionConfig,
  Field,
  FilterOptions,
  NumberField,
  PayloadRequest,
  RelationshipField,
  SelectField,
  Where,
} from "payload";
import { array, number, select } from "payload/shared";
import { tokenProblem } from "@dilm/shared-types";
import { beforeAll, describe, expect, it } from "vitest";

import { Categories } from "../collections/Categories";
import { DetailTemplates } from "../collections/DetailTemplates";
import { Jobs } from "../collections/Jobs";
import { Pages } from "../collections/Pages";
import { Posts } from "../collections/Posts";
import { Products } from "../collections/Products";
import { SharedDetailTemplates } from "../collections/SharedDetailTemplates";
import { SharedPages } from "../collections/SharedPages";
import { Solutions } from "../collections/Solutions";
import { Tenants } from "../collections/Tenants";
import { Users } from "../collections/Users";
import {
  assertRegistry,
  LAYOUT_EXCLUSIONS,
  layoutField,
} from "../fields/layout";
import { PICK_NOT_OFFERED, validatePicks } from "../fields/recordPicks";
import { IR_DOCUMENT_TYPES } from "../irDocumentTypes";
import { applyMultiTenant, findField, subfields } from "../testing";
import { irDocuments } from "./irDocuments";
import { jobListing } from "./jobListing";
import { jobShowcase } from "./jobShowcase";
import { postShowcase } from "./postShowcase";
import { productShowcase } from "./productShowcase";
import { productsSolutionsTabs } from "./productsSolutionsTabs";
import { solutionShowcase } from "./solutionShowcase";
import { pageBlocks } from ".";

const blocks: Record<string, Block> = {
  productsSolutionsTabs,
  productShowcase,
  solutionShowcase,
  postShowcase,
  jobListing,
  jobShowcase,
  irDocuments,
};

const names = (fields: Field[]) =>
  fields.map((field) => ("name" in field ? field.name : ""));

const named = (fields: Field[], ...path: string[]): Field => {
  let field: Field = findField(fields, path[0]);
  for (const name of path.slice(1)) field = findField(subfields(field), name);
  return field;
};

const optionValues = (field: Field) =>
  (field as SelectField).options.map((option) =>
    typeof option === "string" ? option : option.value,
  );

const shown = (field: Field, blockData: object) =>
  (
    field.admin as {
      condition: (data: object, sibling: object, options: object) => boolean;
    }
  ).condition({}, blockData, { blockData });

const NEAR_LIMIT_ALIASES = [
  "_detail_templates_v__blocks_certifications_items_certificateImages (66)",
  "_shared_detail_templates_v__blocks_certifications_items_certificateImages (73)",
  "_shared_detail_templates_v__blocks_featureGrid_footerButtons (60)",
  "_shared_detail_templates_v__blocks_featureGrid_headingButtons (61)",
  "_shared_detail_templates_v__blocks_heroCarousel_slides_buttons (62)",
  "_shared_detail_templates_v__blocks_visionMission_mission_items (62)",
  "_shared_pages_v__blocks_certifications_items_certificateImages (62)",
  "detail_templates__blocks_certifications_items_certificateImages (63)",
  "shared_detail_templates__blocks_certifications_items_certificateImages (70)",
];

const t = { t: (key: string) => key };

describe("the record blocks are registered (FR-PM-27, FR-PM-33)", () => {
  it("appends the seven Records blocks of DILM-111 after the content blocks", () => {
    expect(pageBlocks.slice(15).map(({ slug }) => slug)).toEqual(
      Object.keys(blocks),
    );
    expect(() => assertRegistry(pageBlocks)).not.toThrow();
    expect(layoutField().blocks.map(({ slug }) => slug)).toEqual(
      pageBlocks.map(({ slug }) => slug),
    );
  });

  it("names every interface after its slug, in the Records group, with catalog metadata", () => {
    for (const block of Object.values(blocks)) {
      const catalog = block.admin?.custom?.catalog as {
        purpose: string;
        figma: string[];
      };
      expect(block.interfaceName, block.slug).toBe(
        `${block.slug[0].toUpperCase()}${block.slug.slice(1)}Block`,
      );
      expect(block.admin?.group, block.slug).toBe("Records");
      expect(catalog.purpose.length, block.slug).toBeGreaterThan(20);
      expect(
        catalog.figma.every((entry) => entry.startsWith("section/")),
        block.slug,
      ).toBe(true);
    }
  });

  it("gives every block its own short table name", () => {
    const suffixes = pageBlocks.map((block) => {
      const dbName = block.dbName as (args: { tableName: string }) => string;
      return dbName({ tableName: "x" }).slice(2);
    });
    expect(new Set(suffixes).size).toBe(pageBlocks.length);
    expect(suffixes.slice(15)).toEqual([
      "pt",
      "ps",
      "ss",
      "pos",
      "jli",
      "jsh",
      "ird",
    ]);
  });

  it("keeps every table alias Payload builds for every layout block distinct within Postgres's 63 characters", () => {
    const layouts = [
      Pages,
      SharedPages,
      DetailTemplates,
      SharedDetailTemplates,
    ];
    const localized = (fields: Field[]): boolean =>
      fields.some(
        (field) =>
          field.type !== "array" &&
          field.type !== "blocks" &&
          (("localized" in field && field.localized === true) ||
            ("fields" in field && localized(field.fields)) ||
            (field.type === "tabs" &&
              field.tabs.some(
                (tab) =>
                  ("localized" in tab && tab.localized === true) ||
                  localized(tab.fields),
              ))),
      );
    const clashes: string[] = [];
    const nearLimit: string[] = [];
    let checked = 0;
    for (const collection of layouts) {
      const offered = (findField(collection.fields, "layout") as BlocksField)
        .blocks;
      const table = collection.slug.replaceAll("-", "_");
      for (const prefix of [table, `_${table}_v`]) {
        const seen = new Map<string, string>();
        const add = (alias: string, hasLocales: boolean) => {
          for (const name of hasLocales
            ? [alias, `${alias}__locales`]
            : [alias]) {
            const cut = name.slice(0, 63);
            if (seen.has(cut)) {
              clashes.push(`${collection.slug}: ${seen.get(cut)} / ${name}`);
            }
            seen.set(cut, name);
            checked += 1;
            if (!name.endsWith("__locales") && name.length >= 60) {
              nearLimit.push(`${name} (${name.length})`);
            }
          }
        };
        const walk = (fields: Field[], alias: string) => {
          for (const field of fields) {
            if (field.type === "array") {
              const next = `${alias}_${field.name}`;
              add(next, localized(field.fields));
              walk(field.fields, next);
            } else if (field.type === "group" && "name" in field) {
              walk(field.fields, `${alias}_${field.name}`);
            } else if (field.type === "tabs") {
              for (const tab of field.tabs) {
                walk(
                  tab.fields,
                  "name" in tab ? `${alias}_${tab.name}` : alias,
                );
              }
            } else if ("fields" in field) {
              walk(field.fields, alias);
            }
          }
        };
        for (const block of offered) {
          const base = `${prefix}__blocks_${block.slug}`;
          add(base, localized(block.fields));
          walk(block.fields, base);
        }
      }
    }
    expect(checked).toBeGreaterThan(500);
    expect(clashes).toEqual([]);
    expect(nearLimit.sort()).toEqual(NEAR_LIMIT_ALIASES);
  });

  it("offers every block in every layout except the declared exclusions", () => {
    const slugs = (collection: CollectionConfig) =>
      (findField(collection.fields, "layout") as BlocksField).blocks.map(
        ({ slug }) => slug,
      );
    const all = pageBlocks.map(({ slug }) => slug);
    for (const collection of [Pages, SharedPages, DetailTemplates]) {
      expect(slugs(collection), collection.slug).toEqual(all);
    }
    expect(slugs(SharedDetailTemplates)).toEqual(
      all.filter((slug) => slug !== "hotspotIllustration"),
    );
    expect(LAYOUT_EXCLUSIONS["shared-detail-templates"]).toEqual([
      "hotspotIllustration",
    ]);
    expect(() => layoutField(pageBlocks, ["nope"])).toThrow(/unknown block/);
  });

  it("passes the detail-template token scan with nothing a token could match", () => {
    for (const block of Object.values(blocks)) {
      expect(
        tokenProblem(
          { blockType: block.slug, documentTypes: IR_DOCUMENT_TYPES },
          true,
        ),
        block.slug,
      ).toBeUndefined();
    }
  });
});

describe("row limits are enforced (FR-PM-34)", () => {
  const relationshipError = (field: RelationshipField, count: number) =>
    (field.validate as typeof validatePicks)(
      Array.from({ length: count }, (_, index) => index + 1),
      {
        relationTo: field.relationTo,
        minRows: field.minRows,
        maxRows: field.maxRows,
        required: field.required,
        req: {
          t: (key: string) => key,
          payload: {
            collections: { products: {}, solutions: {}, jobs: {} },
            db: { defaultIDType: "number" },
          },
        },
        event: "onChange",
      } as never,
    );

  const picks: [string, string[], number, number][] = [
    ["productsSolutionsTabs", ["solutionsTab", "items"], 1, 9],
    ["productsSolutionsTabs", ["productsTab", "items"], 1, 9],
    ["productShowcase", ["items"], 1, 24],
    ["solutionShowcase", ["items"], 1, 24],
    ["jobShowcase", ["items"], 1, 6],
  ];

  it.each(picks)(
    "%s.%j accepts %i to %i picks and rejects one fewer or one more",
    async (slug, path, min, max) => {
      const field = named(blocks[slug].fields, ...path) as RelationshipField;
      expect([field.minRows, field.maxRows, field.required]).toEqual([
        min,
        max,
        true,
      ]);
      expect(await relationshipError(field, min)).toBe(true);
      expect(await relationshipError(field, max)).toBe(true);
      expect(await relationshipError(field, max + 1)).toBeTypeOf("string");
      expect(await relationshipError(field, min - 1)).toBeTypeOf("string");
    },
  );

  const rows: [string, string[], number, number][] = [
    ["postShowcase", ["items"], 1, 12],
    ["irDocuments", ["sideNav"], 0, 12],
  ];

  it.each(rows)(
    "%s.%j accepts %i to %i rows and rejects one fewer or one more",
    async (slug, path, min, max) => {
      const field = named(blocks[slug].fields, ...path) as ArrayField;
      const check = (count: number) =>
        array(
          Array.from({ length: count }, () => ({})),
          {
            minRows: field.minRows,
            maxRows: field.maxRows,
            required: field.required,
            req: t,
          } as never,
        );
      expect([field.minRows ?? 0, field.maxRows]).toEqual([min, max]);
      expect(await check(min)).toBe(true);
      expect(await check(max)).toBe(true);
      expect(await check(max + 1)).toBeTypeOf("string");
      if (min > 0) {
        expect(await check(min - 1)).toBeTypeOf("string");
        expect(field.required).toBe(true);
      }
    },
  );
});

describe("productsSolutionsTabs (§4.5.15)", () => {
  const fields = productsSolutionsTabs.fields;

  it("lists the heading, the two tabs, the first tab, the last card, the bottom bar and the look", () => {
    expect(names(fields)).toEqual([
      "heading",
      "solutionsTab",
      "productsTab",
      "defaultTab",
      "ctaCard",
      "bottomCta",
      "appearance",
    ]);
    expect(names(subfields(named(fields, "solutionsTab")))).toEqual([
      "label",
      "items",
    ]);
    expect(named(fields, "solutionsTab", "items")).toMatchObject({
      relationTo: "solutions",
      hasMany: true,
    });
    expect(named(fields, "productsTab", "items")).toMatchObject({
      relationTo: "products",
      hasMany: true,
    });
    expect(named(fields, "solutionsTab", "label")).toMatchObject({
      localized: true,
    });
  });

  it("opens on the solutions tab unless the editor picks products", () => {
    const tab = named(fields, "defaultTab") as SelectField;
    expect(optionValues(tab)).toEqual(["solutions", "products"]);
    expect(tab.defaultValue).toBe("solutions");
  });

  it("has an optional last card and an optional bottom bar with two optional buttons", () => {
    expect(names(subfields(named(fields, "ctaCard")))).toEqual([
      "text",
      "link",
    ]);
    expect(named(fields, "ctaCard", "link")).toMatchObject({ type: "group" });
    expect(named(fields, "ctaCard", "text")).toMatchObject({
      localized: true,
    });
    expect(names(subfields(named(fields, "bottomCta")))).toEqual([
      "title",
      "description",
      "first",
      "firstStyle",
      "second",
      "secondStyle",
    ]);
  });
});

describe("productShowcase and solutionShowcase (§4.5.16, §4.5.17)", () => {
  const cases: [string, Block, string, string[], string][] = [
    [
      "productShowcase",
      productShowcase,
      "products",
      ["imageOverlay", "imageCard", "textCard"],
      "imageCard",
    ],
    [
      "solutionShowcase",
      solutionShowcase,
      "solutions",
      ["imageCard", "textCard", "imageTitle"],
      "imageCard",
    ],
  ];

  it.each(cases)(
    "%s offers Hand-picked or All, its card styles and the shared extras",
    (_, block, collection, styles, fallback) => {
      expect(names(block.fields)).toEqual([
        "heading",
        "buttons",
        "source",
        "items",
        "cardStyle",
        "ctaCard",
        "bottomCta",
        "appearance",
      ]);
      const source = named(block.fields, "source") as SelectField;
      expect(optionValues(source)).toEqual(["manual", "all"]);
      expect(source.defaultValue).toBe("manual");
      expect(named(block.fields, "items")).toMatchObject({
        relationTo: collection,
        hasMany: true,
      });
      const style = named(block.fields, "cardStyle") as SelectField;
      expect(optionValues(style)).toEqual(styles);
      expect([style.required, style.defaultValue]).toEqual([true, fallback]);
      const buttons = named(block.fields, "buttons") as ArrayField;
      expect([buttons.minRows, buttons.maxRows]).toEqual([0, 2]);
    },
  );

  it("shows the picks only for Hand-picked and drops them on save otherwise", async () => {
    const items = named(productShowcase.fields, "items") as RelationshipField;
    expect(shown(items, { source: "manual" })).toBe(true);
    expect(shown(items, { source: "all" })).toBe(false);
    const drop = items.hooks!.beforeChange![0]!;
    expect(
      await drop({ value: [1], siblingData: { source: "all" } } as never),
    ).toBeNull();
    expect(
      await drop({ value: [1], siblingData: { source: "manual" } } as never),
    ).toEqual([1]);
  });
});

describe("postShowcase (§4.5.18)", () => {
  const fields = postShowcase.fields;
  const card = () => subfields(named(fields, "items"));

  it("lists the heading, buttons, source, cards, filter, limit and card settings in design order", () => {
    expect(names(fields)).toEqual([
      "heading",
      "buttons",
      "source",
      "items",
      "categories",
      "limit",
      "layout",
      "cardEyebrow",
      "readMoreLabel",
      "appearance",
    ]);
    expect(optionValues(named(fields, "source"))).toEqual(["manual", "latest"]);
    expect(optionValues(named(fields, "layout"))).toEqual([
      "carousel",
      "overlay",
      "featured",
    ]);
    expect(optionValues(named(fields, "cardEyebrow"))).toEqual([
      "category",
      "entity",
    ]);
    expect(named(fields, "readMoreLabel")).toMatchObject({ localized: true });
  });

  it("picks a post or a category per card, with optional wording and photo", () => {
    expect(names(card())).toEqual([
      "doc",
      "eyebrow",
      "title",
      "description",
      "image",
    ]);
    expect(named(fields, "items", "doc")).toMatchObject({
      relationTo: ["posts", "categories"],
      required: true,
    });
    for (const name of ["eyebrow", "title", "description"]) {
      expect(named(fields, "items", name)).toMatchObject({
        localized: true,
      });
      expect(named(fields, "items", name)).not.toHaveProperty("required");
    }
    expect(named(fields, "items", "image")).toMatchObject({ required: false });
  });

  it("takes a latest limit of 1 to 12 and an optional category filter", async () => {
    const limit = named(fields, "limit") as NumberField;
    const check = (value: number) =>
      number(value, {
        min: limit.min,
        max: limit.max,
        required: limit.required,
        req: t,
      } as never);
    expect(await check(1)).toBe(true);
    expect(await check(12)).toBe(true);
    expect(await check(0)).toBeTypeOf("string");
    expect(await check(13)).toBeTypeOf("string");
    expect(named(fields, "categories")).toMatchObject({
      relationTo: "categories",
      hasMany: true,
    });
    expect(named(fields, "categories")).not.toHaveProperty("required");
  });

  it("shows cards for Hand-picked and the filter and limit for Latest", () => {
    const manual = { source: "manual" };
    const latest = { source: "latest" };
    expect(shown(named(fields, "items"), manual)).toBe(true);
    expect(shown(named(fields, "items"), {})).toBe(true);
    expect(shown(named(fields, "items"), latest)).toBe(false);
    for (const name of ["categories", "limit"]) {
      expect(shown(named(fields, name), latest), name).toBe(true);
      expect(shown(named(fields, name), manual), name).toBe(false);
    }
  });

  it("drops the hidden source's data on save", async () => {
    const hooks = (name: string) =>
      (named(fields, name) as ArrayField).hooks!.beforeChange![0]!;
    expect(
      await hooks("items")({
        value: [{ doc: 1 }],
        siblingData: { source: "latest" },
      } as never),
    ).toEqual([]);
    expect(
      await hooks("limit")({
        value: 3,
        siblingData: { source: "manual" },
      } as never),
    ).toBeNull();
    expect(
      await hooks("limit")({
        value: 3,
        siblingData: { source: "latest" },
      } as never),
    ).toBe(3);
  });
});

describe("jobListing (§4.5.20)", () => {
  const fields = jobListing.fields;

  it("lists the left heading, the four toggles, the placeholder, the page size and the empty text", () => {
    expect(names(fields)).toEqual([
      "heading",
      "filters",
      "searchPlaceholder",
      "pageSize",
      "emptyText",
    ]);
    expect(names(subfields(named(fields, "filters")))).toEqual([
      "search",
      "department",
      "location",
      "jobType",
    ]);
    for (const field of subfields(named(fields, "filters"))) {
      expect(field).toMatchObject({ type: "checkbox", defaultValue: true });
    }
    expect(
      (named(fields, "heading", "align") as SelectField).defaultValue,
    ).toBe("left");
    expect((named(fields, "pageSize") as NumberField).defaultValue).toBe(10);
  });

  it("has no record picks, because it lists the company's open jobs itself", () => {
    expect(JSON.stringify(fields)).not.toContain("relationship");
  });
});

describe("jobShowcase (§4.5.21)", () => {
  const fields = jobShowcase.fields;

  it("lists the heading, source, picks, limit, buttons and the look", () => {
    expect(names(fields)).toEqual([
      "heading",
      "source",
      "items",
      "limit",
      "buttons",
      "appearance",
    ]);
    expect(optionValues(named(fields, "source"))).toEqual(["manual", "latest"]);
    expect(named(fields, "items")).toMatchObject({ relationTo: "jobs" });
  });

  it("defaults the limit to 3 and keeps it within the six picks", async () => {
    const limit = named(fields, "limit") as NumberField;
    expect(limit.defaultValue).toBe(3);
    expect([limit.min, limit.max]).toEqual([1, 6]);
    expect(shown(limit, { source: "latest" })).toBe(true);
    expect(shown(limit, { source: "manual" })).toBe(false);
  });
});

describe("irDocuments (§4.5.25)", () => {
  const fields = irDocuments.fields;

  it("lists the side menu, the left heading, the document types and the page size", () => {
    expect(names(fields)).toEqual([
      "sideNav",
      "heading",
      "documentTypes",
      "pageSize",
    ]);
    expect(
      (named(fields, "heading", "align") as SelectField).defaultValue,
    ).toBe("left");
    expect(names(subfields(named(fields, "sideNav")))).toEqual(["link"]);
    expect((named(fields, "pageSize") as NumberField).defaultValue).toBe(5);
  });

  it("offers every IR document type as a multi-select that may stay empty", async () => {
    const types = named(fields, "documentTypes") as SelectField;
    expect(types).toMatchObject({ hasMany: true });
    expect(types.required).toBeFalsy();
    expect(optionValues(types)).toEqual(IR_DOCUMENT_TYPES);
    const check = (value: string[]) =>
      select(
        value as never,
        {
          hasMany: true,
          options: types.options,
          req: t,
        } as never,
      );
    expect(await check(["annual-report", "prospectus"])).toBe(true);
    expect(await check(["unknown"])).toBeTypeOf("string");
  });
});

type Doc = {
  id: number;
  _status?: string;
  tenant?: number;
  deletedAt?: string | null;
};

const DATA: Record<string, Doc[]> = {
  jobs: [
    { id: 1, _status: "published", tenant: 2 },
    { id: 2, _status: "published", tenant: 3 },
    { id: 3, _status: "draft", tenant: 2 },
  ],
  posts: [
    { id: 11, _status: "published", tenant: 2 },
    { id: 12, _status: "published", tenant: 3 },
    { id: 13, _status: "draft", tenant: 3 },
  ],
  products: [
    { id: 21, _status: "published", tenant: 2 },
    { id: 22, _status: "published", tenant: 3 },
    { id: 23, _status: "draft", tenant: 3 },
  ],
  solutions: [
    { id: 31, _status: "published", tenant: 2 },
    { id: 32, _status: "draft", tenant: 3 },
  ],
  categories: [{ id: 41 }, { id: 42 }],
};

function matches(doc: Doc, where: Where): boolean {
  if (where.and) return (where.and as Where[]).every((w) => matches(doc, w));
  if (where.or) return (where.or as Where[]).some((w) => matches(doc, w));
  return Object.entries(where).every(([key, condition]) => {
    const value = (doc as Record<string, unknown>)[key];
    const ops = condition as Record<string, unknown>;
    if ("equals" in ops) return String(value) === String(ops.equals);
    if ("not_equals" in ops) return String(value) !== String(ops.not_equals);
    if ("in" in ops) {
      return (ops.in as unknown[]).map(String).includes(String(value));
    }
    throw new Error(`Unsupported operator in ${JSON.stringify(condition)}`);
  });
}

type Filter = Extract<
  NonNullable<FilterOptions>,
  (...args: never[]) => unknown
>;

async function offered(
  filter: Filter,
  relationTo: string,
  data: object,
): Promise<number[]> {
  const where = await filter({
    relationTo,
    data,
    id: 5,
    req: {} as PayloadRequest,
    siblingData: {},
    user: undefined,
  } as never);
  if (where === false) return [];
  return DATA[relationTo]
    .filter((doc) => where === true || matches(doc, where as Where))
    .map((doc) => doc.id);
}

function pickValidator(path: string[], stored?: unknown) {
  return (
    value: unknown,
    relationTo: string | string[],
    filterOptions: FilterOptions,
    data: object,
    id: number | undefined = 5,
  ) =>
    validatePicks(value, {
      relationTo,
      filterOptions,
      data,
      id,
      path,
      collectionSlug: "pages",
      siblingData: {},
      req: {
        t: (key: string) => key,
        payload: {
          collections: Object.fromEntries(
            Object.keys(DATA).map((slug) => [slug, {}]),
          ),
          db: { defaultIDType: "number" },
          findByID: async () =>
            stored === undefined
              ? { _status: "published", layout: [] }
              : stored,
        },
        payloadDataLoader: {
          find: async ({
            collection,
            where,
          }: {
            collection: string;
            where: Where;
          }) => ({
            docs: DATA[collection].filter((doc) => matches(doc, where)),
          }),
        },
        user: { id: 1 },
      },
    } as never);
}

describe("record picker scope (FR-PM-30, NFR-PM-01)", () => {
  let collection: (slug: string) => CollectionConfig;

  beforeAll(async () => {
    collection = await applyMultiTenant([
      Users,
      Tenants,
      Pages,
      SharedPages,
      DetailTemplates,
      SharedDetailTemplates,
      Products,
      Solutions,
      Jobs,
      Posts,
      Categories,
    ]);
  });

  const pickField = (slug: string, block: string, ...path: string[]) => {
    const layout = findField(collection(slug).fields, "layout") as {
      blocks: Block[];
    };
    const found = layout.blocks.find((candidate) => candidate.slug === block)!;
    return named(found.fields, ...path) as RelationshipField;
  };

  const company = { tenant: 2 };
  const shared = {};

  const pickers: [string, string, string[], string][] = [
    ["jobShowcase", "items", [], "jobs"],
    ["postShowcase", "items", ["doc"], "posts"],
    ["productShowcase", "items", [], "products"],
    ["solutionShowcase", "items", [], "solutions"],
    ["productsSolutionsTabs", "solutionsTab", ["items"], "solutions"],
    ["productsSolutionsTabs", "productsTab", ["items"], "products"],
  ];

  it.each(["pages", "detail-templates"])(
    "on a company document (%s), offers the company's published jobs and posts, and every company's published products and solutions",
    async (slug) => {
      const filter = (block: string, ...path: string[]) =>
        pickField(slug, block, ...path).filterOptions as Filter;
      expect(
        await offered(filter("jobShowcase", "items"), "jobs", company),
      ).toEqual([1]);
      expect(
        await offered(filter("postShowcase", "items", "doc"), "posts", company),
      ).toEqual([11]);
      expect(
        await offered(filter("productShowcase", "items"), "products", company),
      ).toEqual([21, 22]);
      expect(
        await offered(
          filter("solutionShowcase", "items"),
          "solutions",
          company,
        ),
      ).toEqual([31]);
      expect(
        await offered(
          filter("productsSolutionsTabs", "productsTab", "items"),
          "products",
          company,
        ),
      ).toEqual([21, 22]);
    },
  );

  it.each(["shared-pages", "shared-detail-templates"])(
    "on a shared document (%s), offers every company's published jobs and posts too",
    async (slug) => {
      const filter = (block: string, ...path: string[]) =>
        pickField(slug, block, ...path).filterOptions as Filter;
      expect(
        await offered(filter("jobShowcase", "items"), "jobs", shared),
      ).toEqual([1, 2]);
      expect(
        await offered(filter("postShowcase", "items", "doc"), "posts", shared),
      ).toEqual([11, 12]);
      expect(
        await offered(filter("productShowcase", "items"), "products", shared),
      ).toEqual([21, 22]);
    },
  );

  it("never offers drafts, in any collection, on any kind of document", async () => {
    for (const [block, field, path, relationTo] of pickers) {
      for (const slug of ["pages", "shared-pages"]) {
        const filter = pickField(slug, block, field, ...path)
          .filterOptions as Filter;
        const ids = await offered(
          filter,
          relationTo,
          slug === "pages" ? company : shared,
        );
        const drafts = DATA[relationTo]
          .filter((doc) => doc._status === "draft")
          .map((doc) => doc.id);
        expect(
          ids.filter((id) => drafts.includes(id)),
          `${block}/${slug}`,
        ).toEqual([]);
        expect(ids.length, `${block}/${slug}`).toBeGreaterThan(0);
      }
    }
  });

  it("always offers categories, whichever company the page belongs to", async () => {
    const filter = pickField("pages", "postShowcase", "items", "doc")
      .filterOptions as Filter;
    expect(await offered(filter, "categories", company)).toEqual([41, 42]);
    expect(await offered(filter, "categories", shared)).toEqual([41, 42]);
  });

  it("ignores the company chosen in the admin's company switcher", async () => {
    const filter = pickField("shared-pages", "jobShowcase", "items")
      .filterOptions as (args: unknown) => Promise<unknown>;
    const where = await filter({
      relationTo: "jobs",
      data: {},
      req: { cookies: new Map([["payload-tenant", "2"]]) },
    } as never);
    expect(where).toEqual({ _status: { equals: "published" } });
  });

  describe("publishing", () => {
    const jobs = (slug = "pages") =>
      pickField(slug, "jobShowcase", "items").filterOptions as Filter;
    const check = pickValidator(["layout", 0, "items"] as never);

    it("accepts picks the picker would have offered", async () => {
      expect(await check([1], "jobs", jobs(), company)).toBe(true);
    });

    it("refuses a draft pick that a draft save let through", async () => {
      expect(await check([3], "jobs", jobs(), company)).toBe(PICK_NOT_OFFERED);
      expect(await check([1, 3], "jobs", jobs(), company)).toBe(
        PICK_NOT_OFFERED,
      );
    });

    it("refuses another company's job on a company page, but not on a shared page", async () => {
      expect(await check([2], "jobs", jobs(), company)).toBe(PICK_NOT_OFFERED);
      expect(await check([2], "jobs", jobs("shared-pages"), shared)).toBe(true);
    });

    it("refuses a pick on a new page the same way", async () => {
      expect(await check([2], "jobs", jobs(), company, undefined)).toBe(
        PICK_NOT_OFFERED,
      );
    });

    it("keeps the required and row-count rules on an empty list", async () => {
      expect(
        await validatePicks([], {
          relationTo: "jobs",
          required: true,
          minRows: 1,
          filterOptions: jobs(),
          data: company,
          req: { t: (key: string) => key },
        } as never),
      ).toBe("validation:required");
    });

    it("lets a pick through that the last published version already holds", async () => {
      const keep = pickValidator(["layout", 0, "items"] as never, {
        _status: "published",
        layout: [{ items: [3] }],
      });
      expect(await keep([3], "jobs", jobs(), company)).toBe(true);
      expect(await keep([3, 2], "jobs", jobs(), company)).toBe(
        PICK_NOT_OFFERED,
      );
    });

    it("does not trust a stored version that is only a draft", async () => {
      const draft = pickValidator(["layout", 0, "items"] as never, {
        _status: "draft",
        layout: [{ items: [3] }],
      });
      expect(await draft([3], "jobs", jobs(), company)).toBe(PICK_NOT_OFFERED);
    });

    it("checks a polymorphic post or category pick one by one", async () => {
      const doc = pickField("pages", "postShowcase", "items", "doc")
        .filterOptions as Filter;
      const one = pickValidator(["layout", 0, "items", 0, "doc"] as never);
      expect(
        await one(
          { relationTo: "posts", value: 11 },
          ["posts", "categories"],
          doc,
          company,
        ),
      ).toBe(true);
      expect(
        await one(
          { relationTo: "posts", value: 12 },
          ["posts", "categories"],
          doc,
          company,
        ),
      ).toBe(PICK_NOT_OFFERED);
      expect(
        await one(
          { relationTo: "posts", value: 13 },
          ["posts", "categories"],
          doc,
          shared,
        ),
      ).toBe(PICK_NOT_OFFERED);
      expect(
        await one(
          { relationTo: "categories", value: 41 },
          ["posts", "categories"],
          doc,
          company,
        ),
      ).toBe(true);
    });
  });
});
