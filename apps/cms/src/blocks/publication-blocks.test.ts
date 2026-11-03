import { readFileSync } from "node:fs";
import { join } from "node:path";

import type {
  Block,
  BlocksField,
  CollectionConfig,
  Field,
  FilterOptions,
  GroupField,
  NumberField,
  PayloadRequest,
  RelationshipField,
  TextField,
  Where,
} from "payload";
import {
  CURRENT_CATEGORY_WARNING,
  DEFAULT_POST_PAGE_SIZE,
  MAX_HIGHLIGHTS,
  TOKENS_OUTSIDE_TEMPLATES,
  postListingSummary,
  postListingWarnings,
  publicationHeroSummary,
  tokenProblem,
  unknownTokenMessage,
} from "@dilm/shared-types";
import { beforeAll, describe, expect, it } from "vitest";

import { Categories } from "../collections/Categories";
import { DetailTemplates } from "../collections/DetailTemplates";
import { Jobs } from "../collections/Jobs";
import { Pages } from "../collections/Pages";
import { Posts } from "../collections/Posts";
import { Products } from "../collections/Products";
import { SharedDetailTemplates } from "../collections/SharedDetailTemplates";
import { Solutions } from "../collections/Solutions";
import { Tenants } from "../collections/Tenants";
import { Users } from "../collections/Users";
import {
  allowTemplateTokens,
  rejectTokensOutsideTemplates,
} from "../detailTemplates";
import { assertRegistry, layoutField } from "../fields/layout";
import {
  PICK_NOT_OFFERED,
  pickerScope,
  validatePicks,
} from "../fields/recordPicks";
import { applyMultiTenant, findField, subfields } from "../testing";
import { postListing, CATEGORIES_REQUIRED } from "./postListing";
import { publicationHero } from "./publicationHero";
import { pageBlocks } from ".";

const names = (fields: Field[]) =>
  fields.map((field) => ("name" in field ? field.name : ""));

const named = (fields: Field[], ...path: string[]): Field => {
  let field: Field = findField(fields, path[0]);
  for (const name of path.slice(1)) field = findField(subfields(field), name);
  return field;
};

type Validate = (value: unknown, options: unknown) => unknown;

const validateOf = (field: Field) => (field as TextField).validate as Validate;

const t = (key: string) => key;

describe("the publication blocks are registered (FR-PM-33)", () => {
  it("appends publicationHero and postListing after the template blocks", () => {
    expect(pageBlocks.length).toBe(37);
    expect(pageBlocks.slice(35).map(({ slug }) => slug)).toEqual([
      "publicationHero",
      "postListing",
    ]);
    expect(() => assertRegistry(pageBlocks)).not.toThrow();
    expect(layoutField().blocks.map(({ slug }) => slug)).toEqual(
      pageBlocks.map(({ slug }) => slug),
    );
  });

  it("uses unique short table names", () => {
    const suffixes = pageBlocks.map((block) => {
      const dbName = block.dbName as (args: { tableName: string }) => string;
      return dbName({ tableName: "x" }).slice(2);
    });
    expect(new Set(suffixes).size).toBe(pageBlocks.length);
    expect(suffixes.slice(35)).toEqual(["pubhero", "pl"]);
  });

  it("groups them as Hero and Records, with catalog metadata and no record type", () => {
    for (const [block, group] of [
      [publicationHero, "Hero"],
      [postListing, "Records"],
    ] as [Block, string][]) {
      const custom = block.admin?.custom as {
        catalog: { purpose: string; figma: string[]; summary: string };
        recordTypes?: unknown;
      };
      expect(block.admin?.group, block.slug).toBe(group);
      expect(block.interfaceName).toBe(
        `${block.slug[0].toUpperCase()}${block.slug.slice(1)}Block`,
      );
      expect(custom.catalog.purpose.length).toBeGreaterThan(20);
      expect(custom.catalog.summary.length).toBeGreaterThan(10);
      expect(custom.catalog.figma.every((f) => f.startsWith("section/"))).toBe(
        true,
      );
      expect(custom.recordTypes, block.slug).toBeUndefined();
    }
  });
});

describe("publicationHero (§4.5.37)", () => {
  it("lists the photo, heading, search wording, All label and tabs", () => {
    expect(names(publicationHero.fields)).toEqual([
      "backgroundImage",
      "heading",
      "searchPlaceholder",
      "searchLabel",
      "allLabel",
      "categories",
    ]);
    const heading = named(publicationHero.fields, "heading") as GroupField;
    expect(
      (named(heading.fields, "align") as { defaultValue?: string })
        .defaultValue,
    ).toBe("center");
    for (const name of ["searchPlaceholder", "searchLabel", "allLabel"]) {
      expect(
        (named(publicationHero.fields, name) as TextField).localized,
        name,
      ).toBe(true);
    }
  });

  it("takes an ordered, optional list of categories", () => {
    const tabs = named(
      publicationHero.fields,
      "categories",
    ) as RelationshipField;
    expect([tabs.relationTo, tabs.hasMany, tabs.required]).toEqual([
      "categories",
      true,
      undefined,
    ]);
  });

  it("summarises as the search with the tab count", () => {
    expect(publicationHeroSummary({ categories: [1, 2, 3, 4] })).toBe(
      "Search · 4 tabs",
    );
    expect(publicationHeroSummary({ categories: [1] })).toBe("Search · 1 tab");
    expect(publicationHeroSummary({})).toBe("Search · 0 tabs");
  });
});

describe("postListing fields (§4.5.19)", () => {
  it("lists the fields in design order", () => {
    expect(names(postListing.fields)).toEqual([
      "source",
      "categories",
      "featured",
      "pageSize",
      "resultsLabel",
      "emptyState",
      "highlights",
    ]);
    const empty = named(postListing.fields, "emptyState") as GroupField;
    expect(names(empty.fields)).toEqual(["title", "description", "button"]);
    const highlights = named(postListing.fields, "highlights") as GroupField;
    expect(names(highlights.fields)).toEqual(["title", "items"]);
  });

  it("offers the three sources, all by default", () => {
    const source = named(postListing.fields, "source") as {
      options: { value: string }[];
      defaultValue: string;
      required: boolean;
    };
    expect(source.options.map(({ value }) => value)).toEqual([
      "all",
      "currentCategory",
      "categories",
    ]);
    expect([source.defaultValue, source.required]).toEqual(["all", true]);
  });

  it("pages ten at a time by default", () => {
    const size = named(postListing.fields, "pageSize") as NumberField;
    expect([size.defaultValue, size.required, size.min]).toEqual([10, true, 1]);
    expect(DEFAULT_POST_PAGE_SIZE).toBe(10);
  });

  it("summarises as the source and page size", () => {
    expect(postListingSummary({ source: "all", pageSize: 10 })).toBe(
      "All posts · 10 per page",
    );
    expect(postListingSummary({ source: "currentCategory", pageSize: 6 })).toBe(
      "This category · 6 per page",
    );
    expect(
      postListingSummary({ source: "categories", categories: [1, 2] }),
    ).toBe("2 categories · 10 per page");
    expect(postListingSummary({})).toBe("All posts · 10 per page");
  });
});

describe("source conditions", () => {
  const condition = (name: string) =>
    (
      named(postListing.fields, name) as {
        admin: { condition: (...a: unknown[]) => boolean };
      }
    ).admin.condition;
  const shows = (source?: string) =>
    condition("categories")({}, {}, { blockData: { source } });

  it("shows the category picker only for the categories source", () => {
    expect(shows("categories")).toBe(true);
    expect(shows("all")).toBe(false);
    expect(shows("currentCategory")).toBe(false);
    expect(shows(undefined)).toBe(false);
  });

  const categories = named(
    postListing.fields,
    "categories",
  ) as RelationshipField;
  const validate = (value: unknown, source: string) =>
    (categories.validate as Validate)(value, {
      relationTo: "categories",
      siblingData: { source },
      req: {
        t,
        payload: {
          collections: { categories: {} },
          db: { defaultIDType: "number" },
        },
      },
      event: "onChange",
    });

  it("needs a category when the source is categories, and nothing otherwise", async () => {
    expect(await validate([], "categories")).toBe(CATEGORIES_REQUIRED);
    expect(await validate(undefined, "categories")).toBe(CATEGORIES_REQUIRED);
    expect(await validate([3], "categories")).toBe(true);
    expect(await validate([], "all")).toBe(true);
    expect(await validate(undefined, "currentCategory")).toBe(true);
  });

  it("clears the picks unless the source is categories (the recordPicker contract)", () => {
    const hook = categories.hooks!.beforeChange![0] as (a: unknown) => unknown;
    const run = (source: string) =>
      hook({ value: [3, 4], siblingData: { source } });
    expect(run("categories")).toEqual([3, 4]);
    expect(run("all")).toBeNull();
    expect(run("currentCategory")).toBeNull();
  });
});

describe("token rules (PS-08)", () => {
  const listing = (resultsLabel: string, title = "") => [
    { blockType: "postListing", resultsLabel, emptyState: { title } },
  ];

  it("accepts {count} and {query} in the results line", () => {
    for (const layout of [
      listing('Showing {count} results for "{query}"'),
      listing("{count}"),
      listing("{query} {count} {query}"),
      listing("No placeholders"),
    ]) {
      expect(tokenProblem(layout, true)).toBeUndefined();
      expect(tokenProblem(layout, false)).toBeUndefined();
    }
  });

  it("rejects any other token in the results line with the PS-08 wording", () => {
    for (const inTemplate of [true, false]) {
      expect(tokenProblem(listing("{total} results"), inTemplate)).toBe(
        "{total} isn't a placeholder. Use {count} or {query}.",
      );
      expect(tokenProblem(listing("{title} results"), inTemplate)).toBe(
        "{title} isn't a placeholder. Use {count} or {query}.",
      );
    }
  });

  it("accepts only {query} in the empty title", () => {
    expect(tokenProblem(listing("", 'No Results for "{query}"'), true)).toBe(
      undefined,
    );
    for (const title of ["{count} found", "{title}", "{total}", "{query}{x}"]) {
      expect(tokenProblem(listing("", title), true), title).toBe(
        "Only {query} works in this title.",
      );
      expect(tokenProblem(listing("", title), false), title).toBe(
        "Only {query} works in this title.",
      );
    }
  });

  it("still rejects {count}, {query} and {title} everywhere else", () => {
    const elsewhere = (text: string) => [
      {
        blockType: "postListing",
        resultsLabel: "{count}",
        emptyState: { title: "{query}", description: text },
        highlights: { title: text },
      },
    ];
    expect(tokenProblem(elsewhere("{query}"), false)).toBe(
      TOKENS_OUTSIDE_TEMPLATES,
    );
    expect(tokenProblem(elsewhere("{title}"), false)).toBe(
      TOKENS_OUTSIDE_TEMPLATES,
    );
    expect(tokenProblem(elsewhere("{count}"), true)).toBe(
      unknownTokenMessage("count"),
    );
    expect(tokenProblem(elsewhere("{title}"), true)).toBeUndefined();
    expect(
      tokenProblem(
        [{ blockType: "richText", body: "{count}" }, ...listing("{count}")],
        true,
      ),
    ).toBe(unknownTokenMessage("count"));
    expect(
      tokenProblem([{ blockType: "pageHero", resultsLabel: "{count}" }], true),
    ).toBe(unknownTokenMessage("count"));
  });

  it("runs through the page and template hooks and the field validators", async () => {
    const run = (hook: unknown, layout: unknown) =>
      (hook as (a: unknown) => Promise<unknown>)({ data: { layout } });
    const ok = listing('Showing {count} for "{query}"', "{query}");
    await expect(run(rejectTokensOutsideTemplates, ok)).resolves.toBeDefined();
    await expect(run(allowTemplateTokens, ok)).resolves.toBeDefined();
    const bad = listing("{total}");
    await expect(run(rejectTokensOutsideTemplates, bad)).rejects.toThrow(
      "{total} isn't a placeholder. Use {count} or {query}.",
    );
    await expect(run(allowTemplateTokens, bad)).rejects.toThrow(
      "{total} isn't a placeholder. Use {count} or {query}.",
    );
    expect(Pages.hooks?.beforeValidate).toContain(rejectTokensOutsideTemplates);
    expect(DetailTemplates.hooks?.beforeValidate).toContain(
      allowTemplateTokens,
    );
    expect(SharedDetailTemplates.hooks?.beforeValidate).toContain(
      allowTemplateTokens,
    );

    const results = validateOf(named(postListing.fields, "resultsLabel"));
    expect(results("{count} for {query}", {})).toBe(true);
    expect(results("{total}", {})).toBe(
      "{total} isn't a placeholder. Use {count} or {query}.",
    );
    const title = validateOf(named(postListing.fields, "emptyState", "title"));
    expect(title("None for {query}", {})).toBe(true);
    expect(title("{count}", {})).toBe("Only {query} works in this title.");
  });
});

describe("source = currentCategory outside the category template", () => {
  const layout = [
    { blockType: "richText" },
    { blockType: "postListing", source: "currentCategory" },
    { blockType: "postListing", source: "all" },
  ];

  it("is a warning with the This category hint, only away from the category template", () => {
    expect(CURRENT_CATEGORY_WARNING).toBe(
      '"This category" is for the Category template.',
    );
    for (const context of [undefined, null, { recordType: "post" as const }]) {
      expect(postListingWarnings(layout, context)).toEqual([
        { index: 1, message: CURRENT_CATEGORY_WARNING },
      ]);
    }
    expect(postListingWarnings(layout, { recordType: "category" })).toEqual([]);
    expect(postListingWarnings(undefined)).toEqual([]);
  });

  it("never blocks a save: the hooks and validators accept it", async () => {
    const data = {
      layout: [{ blockType: "postListing", source: "currentCategory" }],
    };
    await expect(
      (rejectTokensOutsideTemplates as (a: unknown) => Promise<unknown>)({
        data,
      }),
    ).resolves.toBe(data);
    const source = named(postListing.fields, "source") as {
      validate?: unknown;
      admin: { description: string };
    };
    expect(source.validate).toBeUndefined();
    expect(source.admin.description).toContain(CURRENT_CATEGORY_WARNING);
  });
});

type Doc = { id: number; _status: string; tenant: number };

const POSTS: Doc[] = [
  { id: 11, _status: "published", tenant: 2 },
  { id: 12, _status: "published", tenant: 3 },
  { id: 13, _status: "draft", tenant: 2 },
];

function matches(doc: Doc, where: Where): boolean {
  if (where.and) return (where.and as Where[]).every((w) => matches(doc, w));
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

describe("the pickers (FR-PM-30)", () => {
  let collection: (slug: string) => CollectionConfig;

  beforeAll(async () => {
    collection = await applyMultiTenant([
      Users,
      Tenants,
      Pages,
      DetailTemplates,
      SharedDetailTemplates,
      Products,
      Solutions,
      Jobs,
      Posts,
      Categories,
    ]);
  });

  const field = (...path: string[]) => {
    const layout = findField(
      collection("detail-templates").fields,
      "layout",
    ) as BlocksField;
    const block = layout.blocks.find(({ slug }) => slug === "postListing")!;
    return named(block.fields, ...path) as RelationshipField;
  };

  const offered = async (which: RelationshipField) => {
    const where = await (which.filterOptions as (a: unknown) => unknown)({
      relationTo: "posts",
      data: { tenant: 2 },
      id: 5,
      req: {} as PayloadRequest,
      siblingData: {},
    });
    return POSTS.filter((doc) => matches(doc, where as Where)).map(
      (doc) => doc.id,
    );
  };

  it("offers this company's published posts for the featured story and the highlights", async () => {
    expect(field("featured").filterOptions).toBe(pickerScope);
    expect(field("highlights", "items").filterOptions).toBe(pickerScope);
    expect(await offered(field("featured"))).toEqual([11]);
    expect(await offered(field("highlights", "items"))).toEqual([11]);
  });

  it("takes the featured story as one optional post and categories from the global list", () => {
    const featured = field("featured");
    expect([featured.relationTo, featured.hasMany, featured.required]).toEqual([
      "posts",
      undefined,
      undefined,
    ]);
    expect(field("categories").filterOptions).toBeUndefined();
    expect(field("categories").relationTo).toBe("categories");
  });

  it("limits the highlights to five, none required", async () => {
    const items = field("highlights", "items");
    expect([items.hasMany, items.minRows, items.maxRows]).toEqual([
      true,
      0,
      MAX_HIGHLIGHTS,
    ]);
    const check = (count: number) =>
      (items.validate as typeof validatePicks)(
        Array.from({ length: count }, (_, index) => index + 1),
        {
          relationTo: items.relationTo,
          minRows: items.minRows,
          maxRows: items.maxRows,
          required: items.required,
          req: {
            t,
            payload: {
              collections: { posts: {} },
              db: { defaultIDType: "number" },
            },
          },
          event: "onChange",
        } as never,
      );
    expect(await check(0)).toBe(true);
    expect(await check(5)).toBe(true);
    expect(await check(6)).toBeTypeOf("string");
  });

  const publish = (
    which: RelationshipField,
    path: unknown[],
    value: unknown,
    stored: unknown,
  ) =>
    validatePicks(
      value as never,
      {
        relationTo: "posts",
        filterOptions: which.filterOptions as FilterOptions,
        data: { tenant: 2 },
        id: 5,
        path,
        collectionSlug: "detail-templates",
        siblingData: {},
        req: {
          t,
          payload: {
            collections: { posts: {} },
            db: { defaultIDType: "number" },
            findByID: async () => stored,
          },
          payloadDataLoader: {
            find: async ({ where }: { where: Where }) => ({
              docs: POSTS.filter((doc) => matches(doc, where)),
            }),
          },
          user: { id: 1 },
        },
      } as never,
    );

  const published = { _status: "published", layout: [] };

  it("refuses another company's post and a draft post at publish, for both pickers", async () => {
    const featured = field("featured");
    const items = field("highlights", "items");
    const featuredPath = ["layout", 0, "featured"];
    const itemsPath = ["layout", 0, "highlights", "items"];
    expect(await publish(featured, featuredPath, 11, published)).toBe(true);
    expect(await publish(featured, featuredPath, 12, published)).toBe(
      PICK_NOT_OFFERED,
    );
    expect(await publish(featured, featuredPath, 13, published)).toBe(
      PICK_NOT_OFFERED,
    );
    expect(await publish(items, itemsPath, [11], published)).toBe(true);
    expect(await publish(items, itemsPath, [11, 13], published)).toBe(
      PICK_NOT_OFFERED,
    );
  });

  it("re-checks against the published version only, never a draft", async () => {
    const items = field("highlights", "items");
    const itemsPath = ["layout", 0, "highlights", "items"];
    const keeps = {
      _status: "published",
      layout: [{ highlights: { items: [13] } }],
    };
    expect(await publish(items, itemsPath, [13], keeps)).toBe(true);
    expect(await publish(items, itemsPath, [13, 12], keeps)).toBe(
      PICK_NOT_OFFERED,
    );
    expect(
      await publish(items, itemsPath, [13], { ...keeps, _status: "draft" }),
    ).toBe(PICK_NOT_OFFERED);
    const featuredKeeps = {
      _status: "published",
      layout: [{ featured: 13 }],
    };
    expect(
      await publish(
        field("featured"),
        ["layout", 0, "featured"],
        13,
        featuredKeeps,
      ),
    ).toBe(true);
    expect(
      await publish(field("featured"), ["layout", 0, "featured"], 13, {
        ...featuredKeeps,
        _status: "draft",
      }),
    ).toBe(PICK_NOT_OFFERED);
  });

  it("leaves draft saves unvalidated", () => {
    for (const slug of ["detail-templates", "pages"]) {
      const drafts = (
        collection(slug).versions as {
          drafts?: boolean | { validate?: boolean };
        }
      ).drafts;
      expect(
        typeof drafts === "object" ? drafts.validate : undefined,
        slug,
      ).toBeFalsy();
    }
  });
});

describe("the DILM-149 migration identifiers", () => {
  const dir = join(import.meta.dirname, "..", "migrations");
  const sql = readFileSync(
    join(dir, "20261103_145749_dilm_149_publication_blocks.ts"),
    "utf8",
  ).split("export async function down")[0];
  const identifiers = new Set([
    ...[...sql.matchAll(/"([A-Za-z0-9_]+)"/g)].map((m) => m[1]),
    ...[...sql.matchAll(/(?:INDEX|CONSTRAINT)\s+"?(\w+)"?/g)].map((m) => m[1]),
  ]);

  it("has no identifier over 63 characters except the one Postgres truncates safely", () => {
    const long = [...identifiers].filter((name) => name.length > 63);
    expect(long).toEqual([
      "__shared_detail_templates_v_pubhero_v_background_image_id_media_id_fk",
    ]);
  });

  it("has no two identifiers that collide once cut to 63 characters", () => {
    const cut = new Map<string, string>();
    for (const name of identifiers) {
      const key = name.slice(0, 63);
      expect(cut.get(key) ?? name, key).toBe(name);
      cut.set(key, name);
    }
    expect(identifiers.size).toBeGreaterThan(100);
  });
});
