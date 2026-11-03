import type {
  ArrayField,
  Block,
  BlocksField,
  Field,
  GroupField,
  RelationshipField,
  RichTextField,
  SelectField,
  TextField,
  TextFieldSingleValidation,
  UploadField,
} from "payload";
import type { PageBlockGroup } from "@dilm/shared-types";
import { blocks as validateBlocks } from "payload/shared";
import { describe, expect, it } from "vitest";

import { isPlainOrItalic } from "../admin/footerSections";
import { MEDIA_PICKER_FIELD } from "../fields/mediaPicker";
import { assertRegistry, layoutField } from "../fields/layout";
import { findField, subfields } from "../testing";
import {
  appearanceField,
  buttonsField,
  headingField,
  iconField,
  isAnchorId,
  recordPickerFields,
} from "./factories";
import { pageBlocks, sectionBlock } from ".";
import { extractBlockTypes } from "./exportTypes";

const text = (value: string, format = 0) => ({
  type: "text",
  text: value,
  format,
  version: 1,
});

const shown = (field: Field, siblingData: object) =>
  (
    field.admin as {
      condition?: (data: object, sibling: object) => boolean;
    }
  ).condition!({}, siblingData);

const args = (siblingData: object) =>
  ({ siblingData }) as unknown as Parameters<TextFieldSingleValidation>[1];

describe("heading factory (§4.4.1)", () => {
  const heading = headingField();
  const fields = subfields(heading);

  it("is a group of eyebrow, italic title, description and align", () => {
    expect(heading).toMatchObject({ name: "heading", type: "group" });
    expect(fields.map((field) => ("name" in field ? field.name : ""))).toEqual([
      "eyebrow",
      "title",
      "description",
      "align",
    ]);
    expect(findField(fields, "eyebrow")).toMatchObject({
      type: "text",
      localized: true,
    });
    expect(findField(fields, "description")).toMatchObject({
      type: "textarea",
      localized: true,
    });
  });

  it("offers center, left and split with the block's default", () => {
    const align = findField(fields, "align") as SelectField;
    expect(
      align.options.map((option) =>
        typeof option === "string" ? option : option.value,
      ),
    ).toEqual(["center", "left", "split"]);
    expect(align.defaultValue).toBe("center");
    const left = findField(
      subfields(headingField({ align: "left" })),
      "align",
    ) as SelectField;
    expect(left.defaultValue).toBe("left");
  });

  it("has a localized italic-only title that cleans pasted bold, links and lists", async () => {
    const title = findField(fields, "title") as RichTextField;
    expect(title).toMatchObject({ type: "richText", localized: true });
    const pasted = {
      root: {
        type: "root",
        children: [
          {
            type: "paragraph",
            children: [
              text("Grow ", 1),
              { type: "link", fields: {}, children: [text("Together", 3)] },
            ],
          },
          {
            type: "heading",
            children: [text("Big")],
          },
        ],
      },
    };
    expect(isPlainOrItalic(pasted.root)).toBe(false);
    const cleaned = (await title.hooks!.beforeValidate![0]!({
      value: pasted,
    } as never)) as typeof pasted;
    expect(isPlainOrItalic(cleaned.root)).toBe(true);
    const formats = cleaned.root.children.flatMap(({ children }) =>
      children.map((child) => (child as { format?: number }).format),
    );
    expect(formats).toEqual([0, 2, 0]);
  });

  it("accepts italic text as is", () => {
    const root = {
      type: "root",
      children: [
        { type: "paragraph", children: [text("Key ", 0), text("words", 2)] },
      ],
    };
    expect(isPlainOrItalic(root)).toBe(true);
  });
});

describe("buttons factory (§4.4.2)", () => {
  const buttons = buttonsField() as ArrayField;

  it("is an array of zero to two links with a style", () => {
    expect(buttons).toMatchObject({ type: "array", minRows: 0, maxRows: 2 });
    expect(
      buttons.fields.map((field) => ("name" in field ? field.name : "")),
    ).toEqual(["link", "style"]);
    expect(findField(buttons.fields, "link")).toMatchObject({
      type: "group",
    });
    const style = findField(buttons.fields, "style") as SelectField;
    expect(
      style.options.map((option) =>
        typeof option === "string" ? option : option.value,
      ),
    ).toEqual(["primary", "light", "text"]);
    expect(style.defaultValue).toBe("primary");
  });

  it("takes a name and a row limit per block", () => {
    expect(buttonsField({ name: "footerButtons", maxRows: 1 })).toMatchObject({
      name: "footerButtons",
      maxRows: 1,
    });
  });
});

describe("appearance factory (§4.4.3)", () => {
  const appearance = appearanceField() as GroupField;
  const image = findField(appearance.fields, "backgroundImage") as UploadField;
  const anchor = findField(appearance.fields, "anchorId") as TextField;

  it("offers the four backgrounds, default first", () => {
    const background = findField(
      appearance.fields,
      "background",
    ) as SelectField;
    expect(
      background.options.map((option) =>
        typeof option === "string" ? option : option.value,
      ),
    ).toEqual(["default", "muted", "dark", "image"]);
    expect(background.defaultValue).toBe("default");
  });

  it("requires the background image only when the background is image", async () => {
    const validate = image.validate as (
      value: unknown,
      options: object,
    ) => string | true;
    expect(validate(null, args({ background: "muted" }))).toBe(true);
    expect(validate(null, args({ background: "image" }))).toBeTypeOf("string");
    expect(validate(7, args({ background: "image" }))).toBe(true);
    expect(shown(image, { background: "image" })).toBe(true);
    expect(shown(image, { background: "dark" })).toBe(false);
    expect(image.relationTo).toBe("media");
    expect(image.admin?.components?.Field).toMatchObject({
      path: MEDIA_PICKER_FIELD,
    });
  });

  it("clears a stale background image when the background changes", async () => {
    const clear = image.hooks!.beforeChange![0]!;
    expect(
      await clear({ value: 7, siblingData: { background: "dark" } } as never),
    ).toBeNull();
    expect(
      await clear({ value: 7, siblingData: { background: "image" } } as never),
    ).toBe(7);
  });

  it("accepts anchors of a-z, 0-9 and hyphens only", () => {
    expect(anchor.validate).toBe(isAnchorId);
    const check = (value: string) => isAnchorId(value, args({}));
    expect(check("")).toBe(true);
    expect(check("our-products-2")).toBe(true);
    for (const bad of ["Our Products", "a_b", "a/b", "ÅB", "A"]) {
      expect(check(bad), bad).toBeTypeOf("string");
    }
  });
});

describe("record picker factory (§4.4.4)", () => {
  const fields = recordPickerFields({
    collection: "media",
    sources: ["manual", "latest"],
  });
  const named = (name: string) => findField(fields, name);

  it("offers only the sources the block passes", () => {
    const source = named("source") as SelectField;
    expect(
      source.options.map((option) =>
        typeof option === "string" ? option : option.value,
      ),
    ).toEqual(["manual", "latest"]);
    expect(source.defaultValue).toBe("manual");
    const all = recordPickerFields({ collection: "media" });
    expect(all.map((field) => ("name" in field ? field.name : ""))).toEqual([
      "source",
      "items",
      "limit",
    ]);
    expect(
      recordPickerFields({ collection: "media", sources: ["all"] }),
    ).toHaveLength(1);
  });

  it("keeps hand-picked items as an ordered hasMany relationship", () => {
    expect(named("items")).toMatchObject({
      type: "relationship",
      relationTo: "media",
      hasMany: true,
    });
    expect((named("items") as RelationshipField).hasMany).toBe(true);
  });

  it("shows items only for manual and limit only for latest", () => {
    expect(shown(named("items"), { source: "manual" })).toBe(true);
    expect(shown(named("items"), { source: "latest" })).toBe(false);
    expect(shown(named("limit"), { source: "latest" })).toBe(true);
    expect(shown(named("limit"), { source: "manual" })).toBe(false);
  });

  it("drops the value of a hidden field on save", async () => {
    const dropItems = (named("items") as RelationshipField).hooks!
      .beforeChange![0]!;
    expect(
      await dropItems({
        value: [1],
        siblingData: { source: "latest" },
      } as never),
    ).toBeNull();
    expect(
      await dropItems({
        value: [1],
        siblingData: { source: "manual" },
      } as never),
    ).toEqual([1]);
  });
});

describe("icon helper (FR-PM-32, FR-PM-35)", () => {
  const icon = iconField();

  it("is a media upload limited to SVG and PNG with a 48px preview", () => {
    expect(icon).toMatchObject({
      name: "icon",
      type: "upload",
      relationTo: "media",
      filterOptions: { mimeType: { in: ["image/svg+xml", "image/png"] } },
    });
    expect(icon.admin?.components?.Field).toMatchObject({
      path: MEDIA_PICKER_FIELD,
      clientProps: {
        previewSize: 48,
        mimeTypes: ["image/svg+xml", "image/png"],
      },
    });
  });

  it("relies on the media collection requiring alt text", async () => {
    const { Media } = await import("../collections/Media");
    expect(findField(Media.fields, "alt")).toMatchObject({ required: true });
  });
});

describe("layout blocks field (FR-PM-03, NFR-PM-03)", () => {
  const block = (slug: string, group: PageBlockGroup = "Content"): Block =>
    sectionBlock({
      slug,
      interfaceName: `${slug}Block`,
      group,
      fields: [{ name: "x", type: "text" }],
    });

  it("is one blocks field named layout capped at 30", () => {
    const layout = layoutField([block("a")]);
    expect(layout).toMatchObject({
      name: "layout",
      type: "blocks",
      maxRows: 30,
    });
    expect(layout.blocks.map(({ slug }) => slug)).toEqual(["a"]);
    expect(layoutField().blocks).toEqual(pageBlocks);
  });

  it("accepts 30 sections and rejects the 31st", async () => {
    const layout = layoutField([block("a")]) as BlocksField;
    const check = (count: number) =>
      validateBlocks(
        Array.from({ length: count }, () => ({ blockType: "a" })),
        {
          maxRows: layout.maxRows,
          minRows: layout.minRows,
          req: { t: (key: string) => key },
        } as never,
      );
    expect(await check(30)).toBe(true);
    expect(await check(31)).toBeTypeOf("string");
  });

  it("groups blocks under the catalog groups and rejects anything else", () => {
    expect(block("a", "Hero").admin?.group).toBe("Hero");
    expect(() =>
      assertRegistry([{ slug: "a", interfaceName: "A", fields: [] }]),
    ).toThrow(/group/);
    expect(() =>
      assertRegistry([
        {
          slug: "a",
          interfaceName: "A",
          admin: { group: "Misc" },
          fields: [],
        },
      ]),
    ).toThrow(/group/);
  });

  it("rejects a block registered twice or without an interfaceName", () => {
    expect(() => assertRegistry([block("a"), block("a")])).toThrow(/twice/);
    expect(() =>
      assertRegistry([{ slug: "a", admin: { group: "Hero" }, fields: [] }]),
    ).toThrow(/interfaceName/);
  });
});

describe("block type export (NFR-PM-05)", () => {
  const source = `
export interface Media { id: number; alt: string }
export interface Unrelated { id: number }
export type Align = 'left' | 'right'
export interface HeroBlock { image: number | Media; align: Align; blockType: 'hero' }
`;

  it("copies block interfaces and what they reference", () => {
    const out = extractBlockTypes(source, ["HeroBlock"]);
    expect(out).toContain("interface HeroBlock");
    expect(out).toContain("interface Media");
    expect(out).toContain("type Align");
    expect(out).not.toContain("Unrelated");
  });

  it("writes an empty module while no block exists", () => {
    expect(extractBlockTypes(source, [])).toBe("export {};\n");
  });
});

describe("assembled sample block", () => {
  it("sanitizes in a Payload config alongside media and generates a typed interface", async () => {
    const { sanitizeConfig } = await import("payload");
    const { Media } = await import("../collections/Media");
    const sample = sectionBlock({
      slug: "sampleSection",
      interfaceName: "SampleSectionBlock",
      group: "Content",
      fields: [
        headingField(),
        buttonsField(),
        appearanceField(),
        iconField(),
        ...recordPickerFields({ collection: "media" }),
      ],
    });
    const config = await sanitizeConfig({
      secret: "x",
      db: {} as never,
      editor: (await import("@payloadcms/richtext-lexical")).lexicalEditor(),
      collections: [
        Media,
        {
          slug: "pages",
          fields: [layoutField([sample])],
        },
        ...[
          "shared-pages",
          "products",
          "solutions",
          "jobs",
          "posts",
          "categories",
        ].map((slug) => ({ slug, fields: [] })),
      ],
    } as never);
    const pages = config.collections.find(
      ({ slug }) => (slug as string) === "pages",
    )!;
    const layout = findField(pages.fields, "layout") as BlocksField;
    expect(layout.blocks[0]).toMatchObject({
      slug: "sampleSection",
      interfaceName: "SampleSectionBlock",
    });
    expect(layout.maxRows).toBe(30);
  });
});
