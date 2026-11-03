import { withSameAsEnTag } from "../fields/layoutEditor";
import { richTextBodyField } from "../fields/richTextBody";
import { headingField, whenBlock } from "./factories";
import { sectionBlock } from "./sectionBlock";

export const richText = sectionBlock({
  slug: "richText",
  interfaceName: "RichTextBlock",
  group: "Content",
  tableName: "rich",
  catalog: {
    name: "Rich text",
    purpose:
      "Long-form text with headings, lists, links, images, tables and quotes, and an optional On This Page list built from the main headings.",
    figma: ["section/detail-article"],
    summary: "The heading's title, or the first words of the text",
  },
  fields: [
    headingField({ align: "left" }),
    richTextBodyField({ name: "body", label: "Body", required: true }),
    {
      name: "showTableOfContents",
      type: "checkbox",
      defaultValue: false,
      label: "Show an On This Page list",
      admin: {
        description: "Built from the main (H2) headings of the text.",
      },
    },
    withSameAsEnTag({
      name: "tocTitle",
      type: "text",
      localized: true,
      label: "On This Page title",
      admin: { condition: whenBlock("showTableOfContents", "false", "true") },
    }),
  ],
});
