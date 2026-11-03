import { withSameAsEnTag } from "../fields/layoutEditor";
import { buttonsField } from "./factories";
import { sectionBlock } from "./sectionBlock";

export const solutionImpact = sectionBlock({
  slug: "solutionImpact",
  interfaceName: "SolutionImpactBlock",
  group: "Template",
  tableName: "simp",
  recordTypes: ["solution"],
  catalog: {
    name: "Solution impact",
    purpose:
      "The solution's impact title, text, value points and photo, with Contact Us and a link to its applications. The content comes from the solution.",
    figma: ["section/solution-impact-value"],
    summary: "The eyebrow",
  },
  fields: [
    withSameAsEnTag({ name: "eyebrow", type: "text", localized: true }),
    buttonsField({ tableName: "btn" }),
  ],
});
