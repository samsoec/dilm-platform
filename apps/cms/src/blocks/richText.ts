import { withSameAsEnTag } from "../fields/layoutEditor";
import { richTextBodyField } from "../fields/richTextBody";
import { tocAnchorsHook } from "../legal/legalFields";
import { TOC_BUILT_FROM, TOC_TOGGLE_LABEL } from "../legal/legalText";
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
      label: TOC_TOGGLE_LABEL,
      admin: { description: TOC_BUILT_FROM },
    },
    withSameAsEnTag({
      name: "tocTitle",
      type: "text",
      localized: true,
      label: "List title",
      admin: { condition: whenBlock("showTableOfContents", "false", "true") },
    }),
    {
      name: "tocSummary",
      type: "ui",
      admin: {
        components: {
          Field: "/admin/components/legal/TocSummary#TocSummary",
        },
      },
    },
    {
      name: "tocAnchors",
      type: "json",
      localized: true,
      admin: { hidden: true },
      hooks: { beforeChange: [tocAnchorsHook] },
    },
  ],
});
