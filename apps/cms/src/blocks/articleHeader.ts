import { withSameAsEnTag } from "../fields/layoutEditor";
import { stampTextHook, validateLastUpdated } from "../legal/legalFields";
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
    withSameAsEnTag({
      name: "metaLabel",
      label: "Label",
      type: "text",
      localized: true,
    }),
    withSameAsEnTag({
      name: "lastUpdatedLabel",
      label: "Last updated label",
      type: "text",
      localized: true,
    }),
    {
      name: "lastUpdated",
      label: "Last updated",
      type: "date",
      required: true,
      validate: validateLastUpdated,
      admin: {
        date: { pickerAppearance: "dayOnly" },
        components: {
          afterInput: [
            "/admin/components/legal/TextChangedFlag#TextChangedFlag",
          ],
        },
      },
    },
    {
      name: "textStamp",
      type: "text",
      localized: true,
      admin: { hidden: true },
      hooks: { beforeChange: [stampTextHook] },
    },
  ],
});
