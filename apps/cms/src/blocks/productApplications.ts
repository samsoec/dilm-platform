import { headingField } from "./factories";
import { sectionBlock } from "./sectionBlock";

export const productApplications = sectionBlock({
  slug: "productApplications",
  interfaceName: "ProductApplicationsBlock",
  group: "Template",
  tableName: "papp",
  recordTypes: ["product"],
  catalog: {
    name: "Product applications",
    purpose:
      "The product's application cards and the steps of its process. The content comes from the product; you set the heading.",
    figma: ["section/applications-process"],
    summary: "The heading's title",
  },
  fields: [headingField({ align: "center" })],
});
