import { withSameAsEnTag } from "../fields/layoutEditor";
import { headingField } from "./factories";
import { sectionBlock } from "./sectionBlock";
import { labelGroup } from "./productSpecifications";

const FEATURED = ["productName", "formula", "casNumber", "variants"] as const;

const FEATURED_TITLES: Record<(typeof FEATURED)[number], string> = {
  productName: "Product name",
  formula: "Formula",
  casNumber: "CAS number",
  variants: "Variants",
};

export const solutionApplications = sectionBlock({
  slug: "solutionApplications",
  interfaceName: "SolutionApplicationsBlock",
  group: "Template",
  tableName: "sapp",
  recordTypes: ["solution"],
  catalog: {
    name: "Solution applications",
    purpose:
      "The solution's numbered application cards, its featured product and the products that support it. The content comes from the solution.",
    figma: ["section/solution-applications-process"],
    summary: "The heading's title",
  },
  fields: [
    headingField({ align: "center" }),
    {
      name: "productsHeading",
      label: "Supporting products heading",
      type: "group",
      fields: [
        withSameAsEnTag({ name: "title", type: "text", localized: true }),
        withSameAsEnTag({
          name: "description",
          type: "textarea",
          localized: true,
        }),
      ],
    },
    labelGroup(
      "featuredLabels",
      "Featured product labels",
      FEATURED,
      FEATURED_TITLES,
    ),
  ],
});
