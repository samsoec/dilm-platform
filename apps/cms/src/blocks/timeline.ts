import { withSameAsEnTag } from "../fields/layoutEditor";
import { buttonsField, headingField, tableNamed, whenBlock } from "./factories";
import { sectionBlock } from "./sectionBlock";

export const MAX_TIMELINE_ENTRIES = 50;

export const MAX_TIMELINE_EVENTS = 12;

export const TIMELINE_VARIANTS = ["summary", "detailed"] as const;

const heading = headingField({ align: "center" });

const banner = {
  name: "banner",
  type: "group" as const,
  admin: { condition: whenBlock("variant", "summary", "detailed") },
  fields: [
    withSameAsEnTag({ name: "eyebrow", type: "text", localized: true }),
    withSameAsEnTag({ name: "title", type: "text", localized: true }),
    withSameAsEnTag({
      name: "description",
      type: "textarea",
      localized: true,
    }),
    withSameAsEnTag({ name: "periodLabel", type: "text", localized: true }),
  ],
};

export const timeline = sectionBlock({
  slug: "timeline",
  interfaceName: "TimelineBlock",
  group: "Content",
  tableName: "tl",
  catalog: {
    name: "Timeline",
    purpose:
      "The company's story by year: a short summary strip or the full alternating timeline with dated events.",
    figma: ["section/about-our-journey", "section/our-journey-timeline"],
    summary:
      "The heading's title or banner title, with the variant and the year count",
  },
  fields: [
    {
      name: "variant",
      type: "select",
      required: true,
      defaultValue: "summary",
      options: [
        { value: "summary", label: "Summary" },
        { value: "detailed", label: "Detailed" },
      ],
    },
    {
      ...heading,
      admin: { condition: whenBlock("variant", "summary", "summary") },
    },
    banner,
    {
      name: "entries",
      type: "array",
      required: true,
      minRows: 1,
      maxRows: MAX_TIMELINE_ENTRIES,
      labels: { singular: "Year", plural: "Years" },
      fields: [
        { name: "year", type: "text", required: true },
        withSameAsEnTag({
          name: "title",
          type: "text",
          localized: true,
        }),
        withSameAsEnTag({
          name: "description",
          type: "textarea",
          localized: true,
        }),
        {
          name: "events",
          type: "array",
          dbName: tableNamed("evt"),
          minRows: 0,
          maxRows: MAX_TIMELINE_EVENTS,
          labels: { singular: "Dated event", plural: "Dated events" },
          admin: { condition: whenBlock("variant", "summary", "detailed") },
          fields: [
            withSameAsEnTag({
              name: "dateLabel",
              type: "text",
              required: true,
              localized: true,
            }),
            withSameAsEnTag({
              name: "description",
              type: "textarea",
              required: true,
              localized: true,
            }),
          ],
        },
      ],
    },
    buttonsField(),
  ],
});
