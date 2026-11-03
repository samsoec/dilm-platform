import type {
  ArrayField,
  Block,
  CheckboxField,
  DateField,
  Field,
  GroupField,
  NumberField,
  SelectField,
} from "payload";
import { array, number, select } from "payload/shared";
import { describe, expect, it } from "vitest";

import { assertRegistry, layoutField } from "../fields/layout";
import {
  RICH_TEXT_HEADING_SIZES,
  richTextBodyFeatures,
} from "../fields/richTextBody";
import { findField, subfields } from "../testing";
import { articleHeader } from "./articleHeader";
import { awards } from "./awards";
import { certificateGallery } from "./certificateGallery";
import { certifications } from "./certifications";
import { bottomCtaField, ctaBanner, ctaBannerFields } from "./ctaBanner";
import { hotspotIllustration } from "./hotspotIllustration";
import { imageCarousel } from "./imageCarousel";
import { richText } from "./richText";
import { testimonials } from "./testimonials";
import { pageBlocks } from ".";

const blocks: Record<string, Block> = {
  certifications,
  certificateGallery,
  awards,
  imageCarousel,
  testimonials,
  hotspotIllustration,
  ctaBanner,
  richText,
  articleHeader,
};

const names = (fields: Field[]) =>
  fields.map((field) => ("name" in field ? field.name : ""));

const named = (fields: Field[], ...path: string[]): Field => {
  let field: Field = findField(fields, path[0]);
  for (const name of path.slice(1)) field = findField(subfields(field), name);
  return field;
};

const arrayAt = (slug: string, ...path: string[]) =>
  named(blocks[slug].fields, ...path) as ArrayField;

const t = { t: (key: string) => key };

const rowsError = async (field: ArrayField, count: number) =>
  array(
    Array.from({ length: count }, () => ({})),
    {
      minRows: field.minRows,
      maxRows: field.maxRows,
      required: field.required,
      req: t,
    } as never,
  );

const optionValues = (field: Field) =>
  (field as SelectField).options.map((option) =>
    typeof option === "string" ? option : option.value,
  );

const hidden = (field: Field, blockData: object, siblingData = blockData) =>
  !(
    field.admin as {
      condition: (data: object, sibling: object, options: object) => boolean;
    }
  ).condition({}, siblingData, { blockData });

describe("the remaining content blocks are registered (FR-PM-27, FR-PM-33)", () => {
  it("appends the nine blocks of §4.5.7 to §4.5.14 and §4.5.38 after the first six", () => {
    expect(pageBlocks.slice(6, 15).map(({ slug }) => slug)).toEqual([
      "certifications",
      "certificateGallery",
      "awards",
      "imageCarousel",
      "testimonials",
      "hotspotIllustration",
      "ctaBanner",
      "richText",
      "articleHeader",
    ]);
    expect(() => assertRegistry(pageBlocks)).not.toThrow();
    expect(layoutField().blocks.map(({ slug }) => slug)).toEqual(
      pageBlocks.map(({ slug }) => slug),
    );
  });

  it("names every interface after its slug, in the Content group, with catalog metadata", () => {
    for (const block of Object.values(blocks)) {
      const catalog = block.admin?.custom?.catalog as {
        name: string;
        purpose: string;
        figma: string[];
        summary: string;
      };
      expect(block.interfaceName, block.slug).toBe(
        `${block.slug[0].toUpperCase()}${block.slug.slice(1)}Block`,
      );
      expect(block.admin?.group, block.slug).toBe("Content");
      expect(catalog.purpose.length, block.slug).toBeGreaterThan(20);
      expect(catalog.figma.length, block.slug).toBeGreaterThan(0);
      expect(
        catalog.figma.every((entry) => entry.startsWith("section/")),
        block.slug,
      ).toBe(true);
      expect(block.labels, block.slug).toEqual({
        singular: catalog.name,
        plural: catalog.name,
      });
    }
  });

  it("lists the Figma sections of §4.5 and §4.11 for the block that owns them", () => {
    const figma = (slug: string) =>
      (blocks[slug].admin?.custom?.catalog as { figma: string[] }).figma;
    expect(figma("certifications")).toEqual([
      "section/certifications",
      "section/about-awards-certifications",
      "section/certifications-list",
    ]);
    expect(figma("certificateGallery")).toEqual(["section/sni"]);
    expect(figma("awards")).toEqual(["section/awards-recognition"]);
    expect(figma("imageCarousel")).toEqual(["section/industry-sectors"]);
    expect(figma("testimonials")).toEqual(["section/testimonials"]);
    expect(figma("hotspotIllustration")).toEqual([
      "section/environmental-responsibility",
    ]);
    expect(figma("richText")).toEqual(["section/detail-article"]);
    expect(figma("articleHeader")).toEqual(["section/hero-detail-article"]);
  });

  it("gives every block and nested array its own short table name", () => {
    const suffixes = pageBlocks.map((block) => {
      const dbName = block.dbName as (args: { tableName: string }) => string;
      return dbName({ tableName: "x" }).slice(2);
    });
    expect(new Set(suffixes).size).toBe(pageBlocks.length);
    expect(suffixes.slice(6, 15)).toEqual([
      "cf",
      "cgal",
      "awd",
      "icar",
      "testi",
      "hot",
      "cta",
      "rich",
      "ahead",
    ]);
  });
});

describe("array limits are enforced in the schema (FR-PM-34)", () => {
  const limits: [string, string[], number, number][] = [
    ["certifications", ["buttons"], 0, 2],
    ["certifications", ["items"], 1, 24],
    ["certifications", ["items", "certificateImages"], 0, 10],
    ["certificateGallery", ["items"], 1, 20],
    ["awards", ["items"], 1, 100],
    ["imageCarousel", ["items"], 1, 20],
    ["testimonials", ["logos"], 0, 30],
    ["testimonials", ["items"], 0, 20],
    ["hotspotIllustration", ["hotspots"], 1, 8],
    ["ctaBanner", ["buttons"], 0, 2],
  ];

  it.each(limits)(
    "%s.%j accepts %i to %i rows and rejects one fewer or one more",
    async (slug, path, min, max) => {
      const field = arrayAt(slug, ...path);
      expect([field.minRows ?? 0, field.maxRows]).toEqual([min, max]);
      expect(await rowsError(field, min)).toBe(true);
      expect(await rowsError(field, max)).toBe(true);
      expect(await rowsError(field, max + 1)).toBeTypeOf("string");
      if (min > 0) {
        expect(await rowsError(field, min - 1)).toBeTypeOf("string");
        expect(field.required).toBe(true);
      }
    },
  );
});

describe("certifications (§4.5.7)", () => {
  const field = (name: string) => named(certifications.fields, name);
  const item = () => subfields(arrayAt("certifications", "items"));

  it("lists the fields of the table in design order", () => {
    expect(names(certifications.fields)).toEqual([
      "heading",
      "buttons",
      "variant",
      "layout",
      "items",
      "appearance",
    ]);
    expect(names(item())).toEqual([
      "logo",
      "code",
      "title",
      "description",
      "certificateImages",
    ]);
  });

  it("offers logos or cards, and grid or carousel", () => {
    expect(optionValues(field("variant"))).toEqual(["logos", "cards"]);
    expect(optionValues(field("layout"))).toEqual(["grid", "carousel"]);
    expect((field("variant") as SelectField).defaultValue).toBe("logos");
    expect((field("layout") as SelectField).defaultValue).toBe("grid");
  });

  it("requires a logo in every item and a page image in every certificate page", () => {
    expect(findField(item(), "logo")).toMatchObject({
      type: "upload",
      relationTo: "media",
      required: true,
    });
    expect(
      findField(
        subfields(arrayAt("certifications", "items", "certificateImages")),
        "image",
      ),
    ).toMatchObject({ type: "upload", required: true });
  });

  it("localizes title and description but not the code", () => {
    expect(findField(item(), "code")).not.toHaveProperty("localized");
    expect(findField(item(), "title")).toMatchObject({ localized: true });
    expect(findField(item(), "description")).toMatchObject({ localized: true });
  });

  it("hides the code, title and description with the logos variant and shows them with cards (SE-04)", () => {
    for (const name of ["code", "title", "description"]) {
      const entry = findField(item(), name);
      expect(hidden(entry, { variant: "logos" }, { logo: 1 }), name).toBe(true);
      expect(hidden(entry, { variant: "cards" }, { logo: 1 }), name).toBe(
        false,
      );
      expect(hidden(entry, {}, { logo: 1 }), `${name} default`).toBe(true);
    }
  });

  it("keeps hidden texts on save so the editor can switch back (SE-04)", () => {
    for (const name of ["code", "title", "description"]) {
      expect(findField(item(), name), name).not.toHaveProperty("hooks");
    }
    expect(field("variant")).not.toHaveProperty("hooks");
  });

  it("keeps the certificate pages visible in both variants", () => {
    const pages = findField(item(), "certificateImages");
    expect(pages.admin?.condition).toBeUndefined();
  });
});

describe("certificateGallery (§4.5.8)", () => {
  it("has a left-aligned heading, an optional badge and the certificate list", () => {
    expect(names(certificateGallery.fields)).toEqual([
      "heading",
      "badge",
      "items",
    ]);
    expect(
      (
        findField(
          subfields(named(certificateGallery.fields, "heading")),
          "align",
        ) as SelectField
      ).defaultValue,
    ).toBe("left");
    const badge = named(certificateGallery.fields, "badge");
    expect(badge).toMatchObject({ type: "upload", relationTo: "media" });
    expect((badge as { required?: boolean }).required).toBeFalsy();
  });

  it("takes a required image and a localized caption per certificate", () => {
    const entry = subfields(arrayAt("certificateGallery", "items"));
    expect(names(entry)).toEqual(["image", "caption"]);
    expect(findField(entry, "image")).toMatchObject({ required: true });
    expect(findField(entry, "caption")).toMatchObject({ localized: true });
  });
});

describe("awards (§4.5.9)", () => {
  const pageSize = named(awards.fields, "pageSize") as NumberField;
  const check = (value: number | undefined) =>
    number(
      value as number,
      {
        min: pageSize.min,
        max: pageSize.max,
        required: true,
        req: t,
      } as never,
    );

  it("lists an award with photo, year, title, description and issuer", () => {
    expect(names(awards.fields)).toEqual(["heading", "items", "pageSize"]);
    const entry = subfields(arrayAt("awards", "items"));
    expect(names(entry)).toEqual([
      "image",
      "year",
      "title",
      "description",
      "issuer",
    ]);
    expect(findField(entry, "year")).toMatchObject({ type: "text" });
    for (const name of ["title", "description", "issuer"]) {
      expect(findField(entry, name), name).toMatchObject({ localized: true });
    }
    expect(findField(entry, "title")).toMatchObject({ required: true });
  });

  it("shows 8 awards a page by default and refuses zero, negatives and an unbounded page", () => {
    expect(pageSize).toMatchObject({ required: true, defaultValue: 8 });
    expect(check(8)).toBe(true);
    expect(check(1)).toBe(true);
    expect(check(0)).toBeTypeOf("string");
    expect(check(-4)).toBeTypeOf("string");
    expect(check(pageSize.max! + 1)).toBeTypeOf("string");
    expect(check(undefined)).toBeTypeOf("string");
  });
});

describe("imageCarousel (§4.5.10)", () => {
  it("has a split heading and cards with a photo, label and optional link", () => {
    expect(names(imageCarousel.fields)).toEqual(["heading", "items"]);
    expect(
      (
        findField(
          subfields(named(imageCarousel.fields, "heading")),
          "align",
        ) as SelectField
      ).defaultValue,
    ).toBe("split");
    const entry = subfields(arrayAt("imageCarousel", "items"));
    expect(names(entry)).toEqual(["image", "label", "link"]);
    expect(findField(entry, "image")).toMatchObject({ required: true });
    expect(findField(entry, "label")).toMatchObject({
      required: true,
      localized: true,
    });
    const link = findField(entry, "link") as GroupField;
    expect(link.type).toBe("group");
    expect(findField(subfields(link), "type")).toBeDefined();
    expect(findField(subfields(link), "label")).toBeUndefined();
  });
});

describe("testimonials (§4.5.11)", () => {
  it("takes up to 30 named client logos and up to 20 quotes, both optional", () => {
    expect(names(testimonials.fields)).toEqual(["heading", "logos", "items"]);
    const logo = subfields(arrayAt("testimonials", "logos"));
    expect(names(logo)).toEqual(["image", "name"]);
    expect(findField(logo, "image")).toMatchObject({ required: true });
    expect(findField(logo, "name")).toMatchObject({ required: true });
  });

  it("leaves the avatar optional and localizes the quote and role", () => {
    const entry = subfields(arrayAt("testimonials", "items"));
    expect(names(entry)).toEqual(["quote", "name", "role", "avatar"]);
    expect(findField(entry, "quote")).toMatchObject({
      type: "textarea",
      required: true,
      localized: true,
    });
    expect(findField(entry, "role")).toMatchObject({ localized: true });
    expect(findField(entry, "avatar")).toMatchObject({ type: "upload" });
    expect(
      (findField(entry, "avatar") as { required?: boolean }).required,
    ).toBeFalsy();
    expect(findField(entry, "name")).toMatchObject({ required: true });
  });
});

describe("hotspotIllustration (§4.5.12)", () => {
  const spot = () => subfields(arrayAt("hotspotIllustration", "hotspots"));

  it("has a left heading, a required image and the hotspot list", () => {
    expect(names(hotspotIllustration.fields)).toEqual([
      "heading",
      "image",
      "hotspots",
    ]);
    expect(named(hotspotIllustration.fields, "image")).toMatchObject({
      type: "upload",
      required: true,
    });
    expect(names(spot())).toEqual([
      "tone",
      "x",
      "y",
      "eyebrow",
      "title",
      "description",
    ]);
  });

  it("offers green, orange and navy tones", async () => {
    const tone = findField(spot(), "tone") as SelectField;
    expect(optionValues(tone)).toEqual(["green", "orange", "navy"]);
    const check = (value: string) =>
      select(value, {
        options: tone.options,
        required: true,
        hasMany: false,
        req: t,
      } as never);
    expect(await check("navy")).toBe(true);
    expect(await check("red")).toBeTypeOf("string");
  });

  it.each(["x", "y"])("keeps %s between 0 and 100 percent", (name) => {
    const coordinate = findField(spot(), name) as NumberField;
    expect(coordinate).toMatchObject({ required: true, min: 0, max: 100 });
    const check = (value: number) =>
      number(value, {
        min: coordinate.min,
        max: coordinate.max,
        required: true,
        req: t,
      } as never);
    expect(check(0)).toBe(true);
    expect(check(100)).toBe(true);
    expect(check(42.5)).toBe(true);
    expect(check(-1)).toBeTypeOf("string");
    expect(check(100.5)).toBeTypeOf("string");
  });
});

describe("ctaBanner (§4.5.13)", () => {
  it("is a localized title and description with up to two buttons", () => {
    expect(names(ctaBanner.fields)).toEqual([
      "title",
      "description",
      "buttons",
    ]);
    expect(named(ctaBanner.fields, "title")).toMatchObject({ localized: true });
    expect(named(ctaBanner.fields, "description")).toMatchObject({
      type: "textarea",
      localized: true,
    });
  });

  it("exports a group with the same title and description and two optional buttons for the record blocks' bottomCta", () => {
    const group = bottomCtaField();
    expect(group).toMatchObject({ type: "group", name: "bottomCta" });
    expect(names(group.fields)).toEqual([
      "title",
      "description",
      "first",
      "firstStyle",
      "second",
      "secondStyle",
    ]);
    expect(names(ctaBannerFields())).toEqual(names(ctaBanner.fields));
    expect(bottomCtaField({ name: "footer" }).name).toBe("footer");
  });

  it("keeps the bottom bar's two buttons out of an array, because a localized array under a group makes Payload's version query collide on Postgres's 63-character alias limit", () => {
    const group = bottomCtaField();
    expect(JSON.stringify(group)).not.toContain('"type":"array"');
    expect(findField(group.fields, "first")).toMatchObject({ type: "group" });
    expect(findField(group.fields, "secondStyle")).toMatchObject({
      type: "select",
      defaultValue: "primary",
    });
  });
});

describe("richText (§4.5.14)", () => {
  const field = (name: string) => named(richText.fields, name);

  it("lists an optional heading, the body and the table of contents settings", () => {
    expect(names(richText.fields)).toEqual([
      "heading",
      "body",
      "showTableOfContents",
      "tocTitle",
    ]);
    expect(field("body")).toMatchObject({
      type: "richText",
      localized: true,
      required: true,
    });
  });

  it("enables H2 to H4, lists, links, bold, italic, images, tables and quotes", () => {
    expect(RICH_TEXT_HEADING_SIZES).toEqual(["h2", "h3", "h4"]);
    const keys = richTextBodyFeatures().map(({ key }) => key);
    expect(keys).toEqual(
      expect.arrayContaining([
        "heading",
        "unorderedList",
        "orderedList",
        "link",
        "bold",
        "italic",
        "upload",
        "blockquote",
        "experimental_table",
      ]),
    );
  });

  it("starts with the table of contents off and shows its title only when it is on", () => {
    expect((field("showTableOfContents") as CheckboxField).defaultValue).toBe(
      false,
    );
    expect(field("tocTitle")).toMatchObject({ type: "text", localized: true });
    expect(hidden(field("tocTitle"), { showTableOfContents: true })).toBe(
      false,
    );
    expect(hidden(field("tocTitle"), { showTableOfContents: false })).toBe(
      true,
    );
    expect(hidden(field("tocTitle"), {})).toBe(true);
  });

  it("keeps the table of contents title on save when the list is switched off", () => {
    expect(field("tocTitle")).not.toHaveProperty("hooks");
  });
});

describe("articleHeader (§4.5.38)", () => {
  const field = (name: string) => named(articleHeader.fields, name);

  it("lists the left heading, the label and the last-updated label and date", () => {
    expect(names(articleHeader.fields)).toEqual([
      "heading",
      "metaLabel",
      "lastUpdatedLabel",
      "lastUpdated",
    ]);
    expect(
      (findField(subfields(field("heading")), "align") as SelectField)
        .defaultValue,
    ).toBe("left");
    expect(field("metaLabel")).toMatchObject({ localized: true });
    expect(field("lastUpdatedLabel")).toMatchObject({ localized: true });
  });

  it("stores the date without a time of day", () => {
    const date = field("lastUpdated") as DateField;
    expect(date.type).toBe("date");
    expect(date.localized).toBeFalsy();
    expect(date.admin?.date?.pickerAppearance).toBe("dayOnly");
  });
});
