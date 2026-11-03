import { withSameAsEnTag } from "../fields/layoutEditor";
import { headingField } from "./factories";
import { sectionBlock } from "./sectionBlock";

export const articleHeader = sectionBlock({
  slug: "articleHeader",
  interfaceName: "ArticleHeaderBlock",
  group: "Content",
  tableName: "ahead",
  catalog: {
    name: "Article header",
    purpose:
      "The top of a long text page such as Terms and Conditions: heading, a label like Legal information and a last-updated date.",
    figma: ["section/hero-detail-article"],
    summary: "The heading's title, with the last-updated date",
  },
  fields: [
    headingField({ align: "left" }),
    withSameAsEnTag({ name: "metaLabel", type: "text", localized: true }),
    withSameAsEnTag({
      name: "lastUpdatedLabel",
      type: "text",
      localized: true,
    }),
    {
      name: "lastUpdated",
      type: "date",
      admin: { date: { pickerAppearance: "dayOnly" } },
    },
  ],
});
