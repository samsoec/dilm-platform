import { italicHeadingField } from "../fields/italicHeading";
import { withSameAsEnTag } from "../fields/layoutEditor";
import {
  appearanceField,
  buttonsField,
  headingField,
  iconField,
  imageField,
  whenBlock,
} from "./factories";
import { sectionBlock } from "./sectionBlock";

export const MAX_GRID_ITEMS = 12;

export const MAX_MARKER_LENGTH = 3;

export const MARKER_STYLES = ["icon", "number", "letter", "none"] as const;

export const CARD_STYLES = ["card", "plain"] as const;

export const GRID_COLUMNS = ["3", "4"] as const;

export const GRID_LIMIT_MESSAGE =
  "Limit reached: the grid fits 12 items. Numbers (01, 02…) are computed from the order, so there's no marker field.";

export const featureGrid = sectionBlock({
  slug: "featureGrid",
  interfaceName: "FeatureGridBlock",
  group: "Content",
  tableName: "grid",
  catalog: {
    name: "Feature grid",
    purpose:
      "A grid of up to 12 cards or plain items, each marked with an icon, a number, a letter or nothing.",
    figma: [
      "section/about-capabilities",
      "section/solutions-approach",
      "section/management-system-approach",
      "section/management-system-commitment",
      "section/management-system-principles",
      "section/management-system-continuous-improvement",
      "section/life-at",
    ],
    summary: "The heading's title, with the marker style and the item count",
  },
  fields: [
    headingField({ align: "center" }),
    buttonsField({ name: "headingButtons", tableName: "head_btn" }),
    imageField({ name: "topImage", label: "Photo above the heading" }),
    {
      name: "items",
      type: "array",
      required: true,
      minRows: 1,
      maxRows: MAX_GRID_ITEMS,
      labels: { singular: "Item", plural: "Items" },
      admin: { description: GRID_LIMIT_MESSAGE },
      fields: [
        iconField({ condition: whenBlock("markerStyle", "icon", "icon") }),
        withSameAsEnTag({
          name: "marker",
          type: "text",
          localized: true,
          maxLength: MAX_MARKER_LENGTH,
          admin: { condition: whenBlock("markerStyle", "icon", "letter") },
        }),
        withSameAsEnTag({ name: "eyebrow", type: "text", localized: true }),
        withSameAsEnTag({
          name: "title",
          type: "text",
          required: true,
          localized: true,
        }),
        withSameAsEnTag({
          name: "description",
          type: "textarea",
          localized: true,
        }),
      ],
    },
    {
      name: "markerStyle",
      type: "select",
      required: true,
      defaultValue: "icon",
      options: [
        { value: "icon", label: "Icon" },
        { value: "number", label: "Number" },
        { value: "letter", label: "Letter" },
        { value: "none", label: "None" },
      ],
    },
    {
      name: "cardStyle",
      type: "select",
      required: true,
      defaultValue: "card",
      options: [
        { value: "card", label: "Cards" },
        { value: "plain", label: "Plain" },
      ],
    },
    {
      name: "columns",
      type: "select",
      required: true,
      defaultValue: "3",
      options: [
        { value: "3", label: "3 columns" },
        { value: "4", label: "4 columns" },
      ],
    },
    imageField({ name: "bottomImage", label: "Photo below the items" }),
    italicHeadingField({ name: "quote", label: "Quote" }),
    buttonsField({ name: "footerButtons", tableName: "foot_btn" }),
    appearanceField(),
  ],
});
