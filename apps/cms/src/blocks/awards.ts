import { withSameAsEnTag } from "../fields/layoutEditor";
import { headingField, imageField } from "./factories";
import { sectionBlock } from "./sectionBlock";

export const MAX_AWARDS = 100;

export const DEFAULT_AWARDS_PAGE_SIZE = 8;

export const MAX_AWARDS_PAGE_SIZE = 24;

export const awards = sectionBlock({
  slug: "awards",
  interfaceName: "AwardsBlock",
  group: "Content",
  tableName: "awd",
  catalog: {
    name: "Awards",
    purpose:
      "Award cards with a photo, year, title, description and issuer, shown a page at a time.",
    figma: ["section/awards-recognition"],
    summary: "The heading's title, with the award count",
  },
  fields: [
    headingField({ align: "center" }),
    {
      name: "items",
      type: "array",
      required: true,
      minRows: 1,
      maxRows: MAX_AWARDS,
      labels: { singular: "Award", plural: "Awards" },
      fields: [
        imageField({ name: "image" }),
        { name: "year", type: "text" },
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
        withSameAsEnTag({ name: "issuer", type: "text", localized: true }),
      ],
    },
    {
      name: "pageSize",
      type: "number",
      required: true,
      defaultValue: DEFAULT_AWARDS_PAGE_SIZE,
      min: 1,
      max: MAX_AWARDS_PAGE_SIZE,
      admin: {
        step: 1,
        description: "How many awards show before the page buttons.",
      },
    },
  ],
});
