import { withSameAsEnTag } from "../fields/layoutEditor";
import { buttonsField } from "./factories";
import { sectionBlock } from "./sectionBlock";

export const productOverview = sectionBlock({
  slug: "productOverview",
  interfaceName: "ProductOverviewBlock",
  group: "Template",
  tableName: "povw",
  recordTypes: ["product"],
  catalog: {
    name: "Product overview",
    purpose:
      "The product's title, text and photo, with Contact Us and a data sheet download. Everything but the wording comes from the product.",
    figma: ["section/overview"],
    summary: "The eyebrow",
  },
  fields: [
    withSameAsEnTag({ name: "eyebrow", type: "text", localized: true }),
    buttonsField({ tableName: "btn" }),
    withSameAsEnTag({
      name: "pdsLabel",
      label: "Product Data Sheet button",
      type: "text",
      localized: true,
      admin: { description: "Hidden when the product has no data sheet." },
    }),
  ],
});
