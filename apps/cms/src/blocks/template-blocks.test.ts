import type {
  Block,
  BlocksField,
  CollectionConfig,
  Field,
  FilterOptions,
  GroupField,
  PayloadRequest,
  RelationshipField,
  RichTextField,
  Where,
} from "payload";
import {
  DETAIL_RECORD_TYPES,
  HERO_ATTRIBUTES,
  HERO_ATTRIBUTE_KEYS,
  JOB_FORM_FIELDS,
  MAX_HIGHLIGHTS,
  TEMPLATE_BLOCK_RECORD_TYPES,
  TOKENS_OUTSIDE_TEMPLATES,
  availabilityNote,
  isBlockInContext,
  tokenProblem,
  wrongContextMessage,
} from "@dilm/shared-types";
import { beforeAll, describe, expect, it } from "vitest";

import { Categories } from "../collections/Categories";
import { DetailTemplates } from "../collections/DetailTemplates";
import { Jobs } from "../collections/Jobs";
import { Posts } from "../collections/Posts";
import { Products } from "../collections/Products";
import { SharedDetailTemplates } from "../collections/SharedDetailTemplates";
import { Solutions } from "../collections/Solutions";
import { Tenants } from "../collections/Tenants";
import { Users } from "../collections/Users";
import { assertRegistry, layoutField } from "../fields/layout";
import {
  PICK_NOT_OFFERED,
  pickerScope,
  validatePicks,
} from "../fields/recordPicks";
import { applyMultiTenant, findField, subfields } from "../testing";
import {
  consentMissingMessage,
  consentText,
  validateConsent,
} from "./consentForm";
import { contactInquiry } from "./contactInquiry";
import { jobDetail } from "./jobDetail";
import { postArticle } from "./postArticle";
import { productApplications } from "./productApplications";
import { productOverview } from "./productOverview";
import { productSpecifications } from "./productSpecifications";
import { recordHero } from "./recordHero";
import { solutionApplications } from "./solutionApplications";
import { solutionImpact } from "./solutionImpact";
import { pageBlocks } from ".";

const blocks: Record<string, Block> = {
  recordHero,
  productOverview,
  productSpecifications,
  productApplications,
  solutionImpact,
  solutionApplications,
  jobDetail,
  postArticle,
};

const names = (fields: Field[]) =>
  fields.map((field) => ("name" in field ? field.name : ""));

const named = (fields: Field[], ...path: string[]): Field => {
  let field: Field = findField(fields, path[0]);
  for (const name of path.slice(1)) field = findField(subfields(field), name);
  return field;
};

describe("the template blocks are registered (FR-PM-28, FR-PM-33)", () => {
  it("appends the eight blocks after the company blocks", () => {
    expect(pageBlocks.length).toBe(35);
    expect(pageBlocks.slice(27).map(({ slug }) => slug)).toEqual(
      Object.keys(blocks),
    );
    expect(() => assertRegistry(pageBlocks)).not.toThrow();
    expect(layoutField().blocks.map(({ slug }) => slug)).toEqual(
      pageBlocks.map(({ slug }) => slug),
    );
  });

  it("puts them in the Template group with catalog metadata and an interface named after the slug", () => {
    for (const block of Object.values(blocks)) {
      const catalog = block.admin?.custom?.catalog as {
        purpose: string;
        figma: string[];
      };
      expect(block.admin?.group, block.slug).toBe("Template");
      expect(block.interfaceName, block.slug).toBe(
        `${block.slug[0].toUpperCase()}${block.slug.slice(1)}Block`,
      );
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
    expect(suffixes.slice(27)).toEqual([
      "rhero",
      "povw",
      "pspec",
      "papp",
      "simp",
      "sapp",
      "jdet",
      "part",
    ]);
  });

  it("is offered on every page and template", () => {
    for (const collection of [
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
  });
});

describe("record types (FR-PM-29)", () => {
  const declared = (block: Block) =>
    block.admin?.custom?.recordTypes as string[] | undefined;

  it("declares admin.custom.recordTypes on every block, matching the template registry", () => {
    for (const block of Object.values(blocks)) {
      expect(declared(block), block.slug).toEqual([
        ...TEMPLATE_BLOCK_RECORD_TYPES[block.slug],
      ]);
    }
  });

  it("registers exactly the blocks that declare record types, and exactly the Template group", () => {
    const declaring = pageBlocks
      .filter((block) => declared(block) !== undefined)
      .map(({ slug }) => slug);
    const template = pageBlocks
      .filter((block) => block.admin?.group === "Template")
      .map(({ slug }) => slug);
    expect(declaring.sort()).toEqual(
      Object.keys(TEMPLATE_BLOCK_RECORD_TYPES).sort(),
    );
    expect(template.sort()).toEqual(declaring);
  });

  it("declares no record type outside the detail types", () => {
    for (const block of Object.values(blocks)) {
      for (const type of declared(block)!) {
        expect(DETAIL_RECORD_TYPES as readonly string[], block.slug).toContain(
          type,
        );
      }
    }
  });

  it("renders a block exactly in the contexts its own metadata names", () => {
    for (const block of Object.values(blocks)) {
      for (const recordType of DETAIL_RECORD_TYPES) {
        expect(
          isBlockInContext(block.slug, { recordType }),
          `${block.slug} on ${recordType}`,
        ).toBe(declared(block)!.includes(recordType));
      }
      expect(isBlockInContext(block.slug, undefined), block.slug).toBe(false);
    }
  });

  it("serves the catalog and the admin warning in the design's words (SC-03, SE-13)", () => {
    expect(availabilityNote(declared(productSpecifications) as never)).toBe(
      "Works on detail templates only · Product",
    );
    expect(wrongContextMessage(declared(jobDetail) as never)).toBe(
      "This section only shows on job pages. It won't appear here.",
    );
    expect(wrongContextMessage(declared(recordHero) as never)).toBe(
      "This section only shows on product, solution, job and post pages. It won't appear here.",
    );
  });

  it("passes the detail-template token scan on a template and on a page", () => {
    for (const block of Object.values(blocks)) {
      expect(
        tokenProblem({ blockType: block.slug }, true),
        block.slug,
      ).toBeUndefined();
    }
  });

  it("accepts {title} in the headings of a template only", () => {
    const layout = [
      {
        blockType: "productSpecifications",
        heading: { title: "Available {title} Products" },
      },
    ];
    expect(tokenProblem(layout, true)).toBeUndefined();
    expect(tokenProblem(layout, false)).toBe(TOKENS_OUTSIDE_TEMPLATES);
    for (const slug of [
      "productSpecifications",
      "productApplications",
      "solutionApplications",
      "jobDetail",
    ]) {
      const heading = named(blocks[slug].fields, "heading") as GroupField;
      expect(names(heading.fields), slug).toContain("title");
    }
  });
});

describe("recordHero (§4.5.28)", () => {
  it("has the last crumb and one label for every fact of every record type", () => {
    expect(names(recordHero.fields)).toEqual(["currentLabel", "metaLabels"]);
    const labels = named(recordHero.fields, "metaLabels") as GroupField;
    expect(names(labels.fields)).toEqual([...HERO_ATTRIBUTE_KEYS]);
    expect(HERO_ATTRIBUTES).toEqual({
      product: ["formula", "casNumber", "totalVariants", "classification"],
      solution: ["keyApplications", "supportingProducts", "industriesServed"],
      job: ["department", "experience", "jobType", "location", "postedDate"],
      post: ["category", "publishedDate"],
    });
    for (const field of labels.fields as { localized?: boolean }[]) {
      expect(field.localized).toBe(true);
    }
  });
});

describe("the product and solution blocks (§4.5.29-§4.5.33)", () => {
  it("lists only labels and wording, in design order", () => {
    expect(names(productOverview.fields)).toEqual([
      "eyebrow",
      "buttons",
      "pdsLabel",
    ]);
    expect(names(productSpecifications.fields)).toEqual([
      "heading",
      "columnLabels",
      "sideLabels",
      "contact",
      "pdsLabel",
      "sdsLabel",
    ]);
    expect(names(productApplications.fields)).toEqual(["heading"]);
    expect(names(solutionImpact.fields)).toEqual(["eyebrow", "buttons"]);
    expect(names(solutionApplications.fields)).toEqual([
      "heading",
      "productsHeading",
      "featuredLabels",
    ]);
  });

  it("labels the specification columns and the side card", () => {
    expect(
      names(
        (named(productSpecifications.fields, "columnLabels") as GroupField)
          .fields,
      ),
    ).toEqual(["parameter", "method", "value"]);
    expect(
      names(
        (named(productSpecifications.fields, "sideLabels") as GroupField)
          .fields,
      ),
    ).toEqual(["formula", "casNumber", "classification", "packaging"]);
  });

  it("holds no record content: no photo to upload", () => {
    const kinds = (fields: Field[]): string[] =>
      fields.flatMap((field) => [
        field.type,
        ...("fields" in field ? kinds(field.fields) : []),
      ]);
    for (const slug of [
      "recordHero",
      "productOverview",
      "productSpecifications",
      "productApplications",
      "solutionImpact",
      "solutionApplications",
    ]) {
      const used = kinds(blocks[slug].fields);
      expect(used, slug).not.toContain("upload");
    }
  });
});

describe("jobDetail (§4.5.34)", () => {
  const form = named(jobDetail.fields, "form") as GroupField;
  const contactForm = named(contactInquiry.fields, "form") as GroupField;

  it("lists the heading and the form wording like the inquiry form", () => {
    expect(names(jobDetail.fields)).toEqual(["heading", "form"]);
    expect(names(form.fields)).toEqual(names(contactForm.fields));
  });

  it("has exactly the five fixed fields, each with only a label and a placeholder", () => {
    const fixed = named(jobDetail.fields, "form", "fields") as GroupField;
    expect(names(fixed.fields)).toEqual([...JOB_FORM_FIELDS]);
    expect([...JOB_FORM_FIELDS]).toEqual([
      "fullName",
      "email",
      "phone",
      "coverLetter",
      "resume",
    ]);
    for (const field of fixed.fields as (GroupField & { name: string })[]) {
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

  it("uses the inquiry form's consent field and publish gate", () => {
    const consent = named(
      jobDetail.fields,
      "form",
      "consentText",
    ) as RichTextField;
    expect(consent).toBe(consentText);
    expect(consent.validate).toBe(validateConsent);
    expect(named(contactInquiry.fields, "form", "consentText")).toBe(consent);
  });

  const lexical = (text: string) => ({
    root: {
      type: "root",
      children: [{ type: "paragraph", children: [{ type: "text", text }] }],
    },
  });

  const publish = (
    value: unknown,
    stored: Record<string, unknown> | null,
    read: () => Promise<unknown> = async () => ({
      layout: [{ id: "job", form: { consentText: stored } }],
    }),
  ) => {
    const consent = named(
      jobDetail.fields,
      "form",
      "consentText",
    ) as RichTextField;
    return (consent.validate as typeof validateConsent)(
      value as never,
      {
        id: 3,
        collectionSlug: "detail-templates",
        blockData: { id: "job" },
        req: {
          locale: "en",
          t: (key: string) => key,
          payload: { findByID: read },
        },
      } as never,
    );
  };

  it("refuses to publish without the consent text in every language, and names the missing one", async () => {
    expect(await publish(lexical("I agree"), { id: lexical("  ") })).toBe(
      consentMissingMessage(["id"]),
    );
    expect(await publish(lexical("I agree"), null)).toBe(
      consentMissingMessage(["id"]),
    );
  });

  it("publishes once both languages have text", async () => {
    expect(
      await publish(lexical("I agree"), { id: lexical("Saya setuju") }),
    ).toBe(true);
  });

  it("fails closed when the saved draft can't be read", async () => {
    const result = await publish(lexical("I agree"), null, async () => {
      throw new Error("down");
    });
    expect(result).toBeTypeOf("string");
    expect(result).not.toBe(true);
  });

  it("lets draft saves through, as for the inquiry form", () => {
    for (const collection of [
      DetailTemplates,
      SharedDetailTemplates,
    ] as CollectionConfig[]) {
      const drafts = (
        collection.versions as { drafts?: boolean | { validate?: boolean } }
      ).drafts;
      expect(
        typeof drafts === "object" ? drafts.validate : undefined,
        collection.slug,
      ).toBeFalsy();
    }
  });
});

describe("postArticle (§4.5.35)", () => {
  it("lists the highlights and the two neighbour labels", () => {
    expect(names(postArticle.fields)).toEqual([
      "highlights",
      "previousLabel",
      "nextLabel",
    ]);
    const highlights = named(postArticle.fields, "highlights") as GroupField;
    expect(names(highlights.fields)).toEqual(["title", "items"]);
    for (const name of ["previousLabel", "nextLabel"]) {
      expect(
        (named(postArticle.fields, name) as { localized?: boolean }).localized,
        name,
      ).toBe(true);
    }
  });

  const items = named(
    postArticle.fields,
    "highlights",
    "items",
  ) as RelationshipField;

  it("takes up to five hand-picked posts, none required", async () => {
    expect([
      items.relationTo,
      items.hasMany,
      items.minRows,
      items.maxRows,
      items.required,
    ]).toEqual(["posts", true, 0, MAX_HIGHLIGHTS, undefined]);
    expect(MAX_HIGHLIGHTS).toBe(5);
    const check = (count: number) =>
      (items.validate as typeof validatePicks)(
        Array.from({ length: count }, (_, index) => index + 1),
        {
          relationTo: items.relationTo,
          minRows: items.minRows,
          maxRows: items.maxRows,
          required: items.required,
          req: {
            t: (key: string) => key,
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

describe("the highlights picker (FR-PM-30)", () => {
  let collection: (slug: string) => CollectionConfig;

  beforeAll(async () => {
    collection = await applyMultiTenant([
      Users,
      Tenants,
      DetailTemplates,
      SharedDetailTemplates,
      Products,
      Solutions,
      Jobs,
      Posts,
      Categories,
    ]);
  });

  const field = () => {
    const layout = findField(
      collection("detail-templates").fields,
      "layout",
    ) as BlocksField;
    const block = layout.blocks.find(({ slug }) => slug === "postArticle")!;
    return named(block.fields, "highlights", "items") as RelationshipField;
  };

  const offered = async () => {
    const where = await (field().filterOptions as (a: unknown) => unknown)({
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

  it("keeps the company scope when the multi-tenant plugin is applied", () => {
    expect(field().filterOptions).toBe(pickerScope);
  });

  it("offers this company's published posts only", async () => {
    expect(await offered()).toEqual([11]);
  });

  const publish = (value: unknown, stored: unknown) =>
    validatePicks(
      value as never,
      {
        relationTo: "posts",
        filterOptions: field().filterOptions as FilterOptions,
        data: { tenant: 2 },
        id: 5,
        path: ["layout", 0, "highlights", "items"],
        collectionSlug: "detail-templates",
        siblingData: {},
        req: {
          t: (key: string) => key,
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

  it("accepts a published post of the company at publish", async () => {
    expect(await publish([11], published)).toBe(true);
  });

  it("refuses another company's post and a draft post at publish", async () => {
    expect(await publish([12], published)).toBe(PICK_NOT_OFFERED);
    expect(await publish([13], published)).toBe(PICK_NOT_OFFERED);
    expect(await publish([11, 13], published)).toBe(PICK_NOT_OFFERED);
  });

  it("checks against the published version, so a draft save can't smuggle a pick in", async () => {
    const keeps = {
      _status: "published",
      layout: [{ highlights: { items: [13] } }],
    };
    expect(await publish([13], keeps)).toBe(true);
    expect(await publish([13, 12], keeps)).toBe(PICK_NOT_OFFERED);
    expect(await publish([13], { ...keeps, _status: "draft" })).toBe(
      PICK_NOT_OFFERED,
    );
  });
});
