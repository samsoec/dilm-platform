import {
  MAX_POST_ITEMS,
  POST_CARD_EYEBROWS,
  POST_LAYOUTS,
  type PostCardEyebrow,
  type PostLayout,
} from "@dilm/shared-types";
import type { FieldHook } from "payload";

import { withSameAsEnTag } from "../fields/layoutEditor";
import { pickerScope, validateOnePick } from "../fields/recordPicks";
import { unscopedRelationship } from "../tenancy";
import {
  appearanceField,
  buttonsField,
  headingField,
  imageField,
  tableNamed,
  whenBlock,
} from "./factories";
import { sectionBlock } from "./sectionBlock";

export const POST_LAYOUT_LABELS: Record<PostLayout, string> = {
  carousel: "Carousel of news cards",
  overlay: "Photo cards with the text over the image",
  featured: "First card full width, then a carousel",
};

export const POST_EYEBROW_LABELS: Record<PostCardEyebrow, string> = {
  category: "The post's category",
  entity: "The company's name",
};

export const DEFAULT_POST_LIMIT = 3;

export const MAX_POST_LIMIT = MAX_POST_ITEMS;

type BlockData = { source?: string | null };

const clearUnless =
  (source: string, empty: [] | null): FieldHook =>
  ({ value, siblingData }) =>
    ((siblingData as BlockData | undefined)?.source ?? "manual") === source
      ? value
      : empty;

export const postShowcase = sectionBlock({
  slug: "postShowcase",
  interfaceName: "PostShowcaseBlock",
  group: "Records",
  tableName: "pos",
  catalog: {
    name: "Post showcase",
    purpose:
      "News or story cards, hand-picked posts and categories with optional wording and photo, or the latest posts.",
    figma: [
      "section/news",
      "section/environmental-responsibility",
      "section/our-impact-stories",
    ],
    summary: "The heading's title, with the source and card count",
  },
  fields: [
    headingField({ align: "center" }),
    buttonsField({ tableName: "btn" }),
    {
      name: "source",
      type: "select",
      required: true,
      defaultValue: "manual",
      options: [
        { value: "manual", label: "Hand-picked" },
        { value: "latest", label: "Latest" },
      ],
    },
    {
      name: "items",
      type: "array",
      dbName: tableNamed("it"),
      required: true,
      minRows: 1,
      maxRows: MAX_POST_ITEMS,
      labels: { singular: "Card", plural: "Cards" },
      hooks: { beforeChange: [clearUnless("manual", [])] },
      admin: { condition: whenBlock("source", "manual", "manual") },
      fields: [
        unscopedRelationship({
          name: "doc",
          label: "Post or category",
          type: "relationship",
          relationTo: ["posts", "categories"],
          required: true,
          maxDepth: 1,
          filterOptions: pickerScope,
          validate: validateOnePick,
          admin: {
            description:
              "Published posts only; a post card links to that post.",
          },
        }),
        withSameAsEnTag({ name: "eyebrow", type: "text", localized: true }),
        withSameAsEnTag({ name: "title", type: "text", localized: true }),
        withSameAsEnTag({
          name: "description",
          type: "textarea",
          localized: true,
        }),
        imageField({ name: "image", label: "Photo (optional)" }),
      ],
    },
    {
      name: "categories",
      type: "relationship",
      relationTo: "categories",
      hasMany: true,
      maxDepth: 0,
      hooks: { beforeChange: [clearUnless("latest", null)] },
      admin: {
        condition: whenBlock("source", "manual", "latest"),
        description: "Leave empty to use posts from every category.",
      },
    },
    {
      name: "limit",
      type: "number",
      required: true,
      defaultValue: DEFAULT_POST_LIMIT,
      min: 1,
      max: MAX_POST_LIMIT,
      hooks: { beforeChange: [clearUnless("latest", null)] },
      admin: {
        step: 1,
        condition: whenBlock("source", "manual", "latest"),
      },
    },
    {
      name: "layout",
      type: "select",
      required: true,
      defaultValue: "carousel",
      options: POST_LAYOUTS.map((value) => ({
        value,
        label: POST_LAYOUT_LABELS[value],
      })),
    },
    {
      name: "cardEyebrow",
      type: "select",
      required: true,
      defaultValue: "category",
      options: POST_CARD_EYEBROWS.map((value) => ({
        value,
        label: POST_EYEBROW_LABELS[value],
      })),
    },
    withSameAsEnTag({ name: "readMoreLabel", type: "text", localized: true }),
    appearanceField(),
  ],
});
