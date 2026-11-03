import type {
  ArrayField,
  Block,
  Field,
  GroupField,
  NumberField,
  SelectField,
  TextField,
  UploadField,
} from "payload";
import { array, number, text, select } from "payload/shared";
import { tokenProblem } from "@dilm/shared-types";
import { describe, expect, it } from "vitest";

import { assertRegistry, layoutField } from "../fields/layout";
import { isPlainOrItalic } from "../admin/footerSections";
import { findField, subfields } from "../testing";
import { featureGrid } from "./featureGrid";
import { heroCarousel } from "./heroCarousel";
import { mediaText } from "./mediaText";
import { pageHero } from "./pageHero";
import { timeline } from "./timeline";
import { visionMission } from "./visionMission";
import { pageBlocks } from ".";
import { whenBlock } from "./factories";

type Catalog = {
  name: string;
  purpose: string;
  figma: string[];
  summary: string;
};

const blocks: Record<string, Block> = {
  heroCarousel,
  pageHero,
  mediaText,
  featureGrid,
  visionMission,
  timeline,
};

const catalogOf = (block: Block) =>
  block.admin?.custom?.catalog as Catalog | undefined;

const named = (fields: Field[], ...path: string[]): Field => {
  let field: Field = findField(fields, path[0]);
  for (const name of path.slice(1)) field = findField(subfields(field), name);
  return field;
};

const arrayAt = (slug: string, ...path: string[]) =>
  named(blocks[slug].fields, ...path) as ArrayField;

const rowsError = async (field: ArrayField, count: number) =>
  array(
    Array.from({ length: count }, () => ({})),
    {
      minRows: field.minRows,
      maxRows: field.maxRows,
      required: field.required,
      req: { t: (key: string) => key },
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

describe("the hero and content blocks are registered (FR-PM-27, FR-PM-33)", () => {
  it("adds the six blocks of §4.5.1 to §4.5.6 to the layout, in catalog order", () => {
    expect(pageBlocks.slice(0, 6).map(({ slug }) => slug)).toEqual([
      "heroCarousel",
      "pageHero",
      "mediaText",
      "featureGrid",
      "visionMission",
      "timeline",
    ]);
    expect(() => assertRegistry(pageBlocks)).not.toThrow();
    expect(layoutField().blocks.map(({ slug }) => slug)).toEqual(
      pageBlocks.map(({ slug }) => slug),
    );
  });

  it("names every interface after its slug and groups Hero and Content", () => {
    expect(
      pageBlocks
        .slice(0, 6)
        .map(({ slug, interfaceName, admin }) => [
          slug,
          interfaceName,
          admin?.group,
        ]),
    ).toEqual([
      ["heroCarousel", "HeroCarouselBlock", "Hero"],
      ["pageHero", "PageHeroBlock", "Hero"],
      ["mediaText", "MediaTextBlock", "Content"],
      ["featureGrid", "FeatureGridBlock", "Content"],
      ["visionMission", "VisionMissionBlock", "Content"],
      ["timeline", "TimelineBlock", "Content"],
    ]);
  });

  it("stores a plain-language name, purpose, Figma sections and summary rule for the catalog", () => {
    expect(
      pageBlocks
        .slice(0, 6)
        .map((block) => [block.slug, catalogOf(block)?.name]),
    ).toEqual([
      ["heroCarousel", "Hero carousel"],
      ["pageHero", "Page hero"],
      ["mediaText", "Media and text"],
      ["featureGrid", "Feature grid"],
      ["visionMission", "Vision and mission"],
      ["timeline", "Timeline"],
    ]);
    for (const block of pageBlocks) {
      const catalog = catalogOf(block)!;
      expect(catalog.purpose.length, block.slug).toBeGreaterThan(20);
      expect(catalog.figma.length, block.slug).toBeGreaterThan(0);
      expect(
        catalog.figma.every((name) => name.startsWith("section/")),
        block.slug,
      ).toBe(true);
      expect(catalog.summary.length, block.slug).toBeGreaterThan(5);
      expect(block.labels, block.slug).toEqual({
        singular: catalog.name,
        plural: catalog.name,
      });
    }
  });

  it("matches the picker line of SC-02 for media and text", () => {
    const catalog = catalogOf(mediaText)!;
    expect(`${catalog.name} · Matches Figma ${catalog.figma[0]}`).toBe(
      "Media and text · Matches Figma section/why-choose-us",
    );
  });

  it("lists every Figma section of §4.5 and §4.11 for the block that owns it", () => {
    expect(catalogOf(heroCarousel)!.figma).toContain(
      "section/hero-home-carousel",
    );
    expect(catalogOf(featureGrid)!.figma).toEqual([
      "section/about-capabilities",
      "section/solutions-approach",
      "section/management-system-approach",
      "section/management-system-commitment",
      "section/management-system-principles",
      "section/management-system-continuous-improvement",
      "section/life-at",
    ]);
    expect(catalogOf(timeline)!.figma).toEqual([
      "section/about-our-journey",
      "section/our-journey-timeline",
    ]);
    expect(catalogOf(visionMission)!.figma).toEqual([
      "section/about-vision-mission",
    ]);
  });
});

describe("array limits are enforced in the schema (FR-PM-34)", () => {
  const limits: [string, string[], number, number][] = [
    ["heroCarousel", ["slides"], 1, 5],
    ["heroCarousel", ["stats"], 0, 4],
    ["heroCarousel", ["slides", "buttons"], 0, 2],
    ["mediaText", ["images"], 1, 2],
    ["mediaText", ["stats"], 0, 4],
    ["mediaText", ["points"], 0, 6],
    ["mediaText", ["buttons"], 0, 2],
    ["featureGrid", ["headingButtons"], 0, 2],
    ["featureGrid", ["items"], 1, 12],
    ["featureGrid", ["footerButtons"], 0, 2],
    ["visionMission", ["mission", "items"], 1, 8],
    ["timeline", ["entries"], 1, 50],
    ["timeline", ["entries", "events"], 0, 12],
    ["timeline", ["buttons"], 0, 2],
  ];

  it.each(limits)(
    "%s.%j accepts %i to %i rows and rejects one fewer or one more",
    async (slug, path, min, max) => {
      const field = arrayAt(slug, ...path);
      expect([field.minRows ?? 0, field.maxRows]).toEqual([min, max]);
      expect(await rowsError(field, min)).toBe(true);
      expect(await rowsError(field, max)).toBe(true);
      expect(await rowsError(field, max + 1)).toBeTypeOf("string");
      if (min > 0) expect(await rowsError(field, min - 1)).toBeTypeOf("string");
    },
  );

  it("shows the limit message of SE-05 on the feature grid's items", () => {
    expect(
      (arrayAt("featureGrid", "items").admin as { description: string })
        .description,
    ).toBe(
      "Limit reached: the grid fits 12 items. Numbers (01, 02…) are computed from the order, so there's no marker field.",
    );
  });
});

describe("heroCarousel (§4.5.1)", () => {
  const slide = subfields(arrayAt("heroCarousel", "slides"));

  it("gives each slide a required photo, heading texts and buttons", () => {
    expect(slide.map((field) => ("name" in field ? field.name : ""))).toEqual([
      "backgroundImage",
      "eyebrow",
      "title",
      "description",
      "buttons",
    ]);
    expect(findField(slide, "backgroundImage")).toMatchObject({
      type: "upload",
      relationTo: "media",
      required: true,
    });
    for (const name of ["eyebrow", "title", "description"]) {
      expect(findField(slide, name), name).toMatchObject({ localized: true });
    }
  });

  it("keeps the slide title to plain or italic text", async () => {
    const title = findField(slide, "title") as {
      hooks: { beforeValidate: ((a: never) => unknown)[] };
    };
    const bold = {
      root: {
        type: "root",
        children: [
          {
            type: "paragraph",
            children: [{ type: "text", text: "Bold", format: 1, version: 1 }],
          },
        ],
      },
    };
    const cleaned = (await title.hooks.beforeValidate[0]({
      value: bold,
    } as never)) as { root: Parameters<typeof isPlainOrItalic>[0] };
    expect(isPlainOrItalic(cleaned.root)).toBe(true);
  });

  it("takes stats with a value and a localized label", () => {
    const stats = subfields(arrayAt("heroCarousel", "stats"));
    expect(findField(stats, "value")).toMatchObject({
      type: "text",
      required: true,
    });
    expect(findField(stats, "label")).toMatchObject({
      type: "text",
      required: true,
      localized: true,
    });
  });

  it("autoplays every 6 seconds by default, 0 means off, and rejects negatives and over a minute", async () => {
    const field = named(heroCarousel.fields, "autoplaySeconds") as NumberField;
    expect(field).toMatchObject({ required: true, min: 0, defaultValue: 6 });
    const check = (value: number) =>
      number(value, {
        min: field.min,
        max: field.max,
        required: true,
        req: { t: (key: string) => key },
      } as never);
    expect(check(0)).toBe(true);
    expect(check(6)).toBe(true);
    expect(check(-1)).toBeTypeOf("string");
    expect(check(61)).toBeTypeOf("string");
  });
});

describe("pageHero (§4.5.2)", () => {
  it("is a required background photo and a centred heading", () => {
    expect(
      pageHero.fields.map((field) => ("name" in field ? field.name : "")),
    ).toEqual(["backgroundImage", "heading"]);
    expect(named(pageHero.fields, "backgroundImage")).toMatchObject({
      type: "upload",
      required: true,
    });
    const align = findField(
      subfields(named(pageHero.fields, "heading")),
      "align",
    ) as SelectField;
    expect(align.defaultValue).toBe("center");
  });
});

describe("mediaText (§4.5.3)", () => {
  const field = (name: string) => named(mediaText.fields, name);

  it("lists the fields of the table in design order", () => {
    expect(
      mediaText.fields.map((entry) => ("name" in entry ? entry.name : "")),
    ).toEqual([
      "heading",
      "body",
      "images",
      "imageLayout",
      "imagePosition",
      "stats",
      "points",
      "pointsLayout",
      "buttons",
      "appearance",
    ]);
  });

  it("aligns the heading left and keeps the body a localized rich text", () => {
    expect(
      (findField(subfields(field("heading")), "align") as SelectField)
        .defaultValue,
    ).toBe("left");
    expect(field("body")).toMatchObject({ type: "richText", localized: true });
  });

  it("offers the layout, position and points placement choices", () => {
    expect(optionValues(field("imageLayout"))).toEqual(["single", "staggered"]);
    expect(optionValues(field("imagePosition"))).toEqual(["right", "left"]);
    expect(optionValues(field("pointsLayout"))).toEqual(["inline", "grid"]);
    expect((field("imageLayout") as SelectField).defaultValue).toBe("single");
    expect((field("imagePosition") as SelectField).defaultValue).toBe("right");
    expect((field("pointsLayout") as SelectField).defaultValue).toBe("inline");
  });

  it("gives each point an SVG or PNG icon, a title and a description", () => {
    const point = subfields(arrayAt("mediaText", "points"));
    expect(point.map((entry) => ("name" in entry ? entry.name : ""))).toEqual([
      "icon",
      "title",
      "description",
    ]);
    expect(findField(point, "icon")).toMatchObject({
      relationTo: "media",
      filterOptions: { mimeType: { in: ["image/svg+xml", "image/png"] } },
    });
    expect(findField(point, "title")).toMatchObject({ required: true });
  });

  it("requires an image in every image row", () => {
    expect(
      findField(subfields(arrayAt("mediaText", "images")), "image"),
    ).toMatchObject({ type: "upload", required: true });
  });
});

describe("featureGrid (§4.5.4)", () => {
  const field = (name: string) => named(featureGrid.fields, name);
  const item = subfields(arrayAt("featureGrid", "items"));

  it("lists the fields of the table in design order", () => {
    expect(
      featureGrid.fields.map((entry) => ("name" in entry ? entry.name : "")),
    ).toEqual([
      "heading",
      "headingButtons",
      "topImage",
      "items",
      "markerStyle",
      "cardStyle",
      "columns",
      "bottomImage",
      "quote",
      "footerButtons",
      "appearance",
    ]);
  });

  it("offers icon, number, letter and none, with numbers computed rather than stored", () => {
    expect(optionValues(field("markerStyle"))).toEqual([
      "icon",
      "number",
      "letter",
      "none",
    ]);
    expect(item.map((entry) => ("name" in entry ? entry.name : ""))).toEqual([
      "icon",
      "marker",
      "eyebrow",
      "title",
      "description",
    ]);
  });

  it("offers cards or plain, and 3 or 4 columns", () => {
    expect(optionValues(field("cardStyle"))).toEqual(["card", "plain"]);
    expect(optionValues(field("columns"))).toEqual(["3", "4"]);
    expect((field("columns") as SelectField).defaultValue).toBe("3");
  });

  it("keeps the quote to plain or italic text and the two photos optional", () => {
    expect(field("quote")).toMatchObject({
      type: "richText",
      localized: true,
    });
    for (const name of ["topImage", "bottomImage"]) {
      expect(field(name), name).toMatchObject({ type: "upload" });
      expect((field(name) as UploadField).required).toBeFalsy();
    }
  });

  it("limits the letter marker to 3 characters", async () => {
    const marker = findField(item, "marker") as TextField;
    expect(marker.maxLength).toBe(3);
    const check = (value: string) =>
      text(value, {
        maxLength: marker.maxLength,
        req: { t: (key: string) => key, payload: { config: {} } },
        data: {},
        siblingData: {},
      } as never);
    expect(await check("PUR")).toBe(true);
    expect(await check("PURE")).toBeTypeOf("string");
  });

  it("shows the icon for the icon style and the marker for the letter style only", () => {
    const icon = findField(item, "icon");
    const marker = findField(item, "marker");
    const rows = (markerStyle?: string) => ({
      blockData: markerStyle ? { markerStyle } : {},
      siblingData: { title: "x" },
    });
    for (const [style, iconShown, markerShown] of [
      ["icon", true, false],
      ["letter", false, true],
      ["number", false, false],
      ["none", false, false],
      [undefined, true, false],
    ] as const) {
      const { blockData, siblingData } = rows(style);
      expect(!hidden(icon, blockData, siblingData), `icon ${style}`).toBe(
        iconShown,
      );
      expect(!hidden(marker, blockData, siblingData), `marker ${style}`).toBe(
        markerShown,
      );
    }
  });

  it("never clears the hidden icon or marker when the style changes", () => {
    for (const entry of [findField(item, "icon"), findField(item, "marker")]) {
      expect((entry as { hooks?: unknown }).hooks).toBeUndefined();
    }
    expect(field("markerStyle")).not.toHaveProperty("hooks");
  });
});

describe("visionMission (§4.5.5)", () => {
  it("has a centred heading, a vision card and a mission card", () => {
    expect(
      visionMission.fields.map((entry) => ("name" in entry ? entry.name : "")),
    ).toEqual(["heading", "vision", "mission"]);
    const vision = named(visionMission.fields, "vision") as GroupField;
    expect(
      vision.fields.map((entry) => ("name" in entry ? entry.name : "")),
    ).toEqual(["title", "statement"]);
    expect(findField(vision.fields, "statement")).toMatchObject({
      type: "richText",
      localized: true,
    });
    const mission = named(visionMission.fields, "mission") as GroupField;
    expect(
      mission.fields.map((entry) => ("name" in entry ? entry.name : "")),
    ).toEqual(["title", "items"]);
    expect(
      findField(
        subfields(arrayAt("visionMission", "mission", "items")),
        "text",
      ),
    ).toMatchObject({ required: true, localized: true });
  });
});

describe("timeline (§4.5.6)", () => {
  const field = (name: string) => named(timeline.fields, name);

  it("is a summary or detailed variant, summary first", () => {
    expect(optionValues(field("variant"))).toEqual(["summary", "detailed"]);
    expect((field("variant") as SelectField).defaultValue).toBe("summary");
  });

  it("shows the heading for the summary and the banner for the detailed variant", () => {
    const summary = { variant: "summary" };
    const detailed = { variant: "detailed" };
    expect(hidden(field("heading"), summary)).toBe(false);
    expect(hidden(field("heading"), detailed)).toBe(true);
    expect(hidden(field("banner"), summary)).toBe(true);
    expect(hidden(field("banner"), detailed)).toBe(false);
    expect(hidden(field("heading"), {})).toBe(false);
    expect(hidden(field("banner"), {})).toBe(true);
  });

  it("shows dated events only for the detailed variant, reading the block from inside a year row", () => {
    const events = findField(
      subfields(arrayAt("timeline", "entries")),
      "events",
    );
    expect(hidden(events, { variant: "summary" }, { year: "2025" })).toBe(true);
    expect(hidden(events, { variant: "detailed" }, { year: "2025" })).toBe(
      false,
    );
  });

  it("keeps the banner fields, year, title and description as the table lists them", () => {
    expect(
      subfields(field("banner")).map((entry) =>
        "name" in entry ? entry.name : "",
      ),
    ).toEqual(["eyebrow", "title", "description", "periodLabel"]);
    const entry = subfields(arrayAt("timeline", "entries"));
    expect(entry.map((child) => ("name" in child ? child.name : ""))).toEqual([
      "year",
      "title",
      "description",
      "events",
    ]);
    expect(findField(entry, "year")).toMatchObject({
      type: "text",
      required: true,
    });
    const events = subfields(arrayAt("timeline", "entries", "events"));
    expect(findField(events, "dateLabel")).toMatchObject({
      required: true,
      localized: true,
    });
  });

  it("never clears hidden variant fields on save (SE-04)", () => {
    for (const name of ["heading", "banner"]) {
      expect(field(name)).not.toHaveProperty("hooks");
    }
    expect(
      findField(subfields(arrayAt("timeline", "entries")), "events"),
    ).not.toHaveProperty("hooks");
  });
});

describe("whenBlock", () => {
  const condition = whenBlock("variant", "summary", "detailed");

  it("reads the nearest block, falls back to the sibling and then to the default", () => {
    expect(
      condition({}, {}, { blockData: { variant: "detailed" } } as never),
    ).toBe(true);
    expect(condition({}, { variant: "detailed" }, {} as never)).toBe(true);
    expect(condition({}, { variant: "summary" }, {} as never)).toBe(false);
    expect(condition({}, {}, {} as never)).toBe(false);
    expect(
      whenBlock("variant", "summary", "summary")({}, {}, {} as never),
    ).toBe(true);
  });
});

describe("select validators accept only the listed values", () => {
  it.each([
    ["mediaText", "imageLayout", "single", "diagonal"],
    ["featureGrid", "markerStyle", "letter", "emoji"],
    ["featureGrid", "columns", "4", "5"],
    ["timeline", "variant", "detailed", "compact"],
  ])("%s.%s takes %s and refuses %s", async (slug, name, good, bad) => {
    const field = named(blocks[slug].fields, name) as SelectField;
    const check = (value: string) =>
      select(value, {
        options: field.options,
        required: true,
        hasMany: false,
        req: { t: (key: string) => key },
      } as never);
    expect(await check(good)).toBe(true);
    expect(await check(bad)).toBeTypeOf("string");
  });
});

describe("detail template tokens inside these blocks (FR-PM-28)", () => {
  const textNode = (value: string) => ({
    root: {
      type: "root",
      children: [
        {
          type: "paragraph",
          children: [{ type: "text", text: value, format: 2, version: 1 }],
        },
      ],
    },
  });
  const layout = (value: string) => [
    {
      blockType: "heroCarousel",
      slides: [{ title: textNode(value), description: value }],
      stats: [{ value: "50+", label: "Years" }],
    },
    {
      blockType: "featureGrid",
      items: [{ title: value, marker: "P" }],
      quote: textNode(value),
    },
    {
      blockType: "timeline",
      variant: "detailed",
      banner: { title: value },
      entries: [
        {
          year: "2025",
          events: [{ dateLabel: "30 JUNE", description: value }],
        },
      ],
    },
  ];

  it("lets {title} through in a template, in headings, rich text and nested rows", () => {
    expect(tokenProblem(layout("About {title}"), true)).toBeUndefined();
  });

  it("rejects an unknown token in a template", () => {
    expect(tokenProblem(layout("About {name}"), true)).toBe(
      "{name} isn't a placeholder. Use {title}.",
    );
  });

  it("rejects any token on a page", () => {
    expect(tokenProblem(layout("About {title}"), false)).toBe(
      "Placeholders only work in detail templates.",
    );
  });

  it("does not mistake stats, years or variants for tokens", () => {
    expect(tokenProblem(layout("About us"), false)).toBeUndefined();
  });
});
