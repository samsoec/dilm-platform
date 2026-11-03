import { withSameAsEnTag } from "../fields/layoutEditor";
import { headingField } from "./factories";
import { sectionBlock } from "./sectionBlock";

export const DEFAULT_JOB_PAGE_SIZE = 10;

export const MAX_JOB_PAGE_SIZE = 50;

const FILTERS = [
  ["search", "Search box"],
  ["department", "Department filter"],
  ["location", "Location filter"],
  ["jobType", "Job type filter"],
] as const;

export const jobListing = sectionBlock({
  slug: "jobListing",
  interfaceName: "JobListingBlock",
  group: "Records",
  tableName: "jli",
  catalog: {
    name: "Job listing",
    purpose:
      "Every open job of the company, newest first, with a search box, filters and page buttons.",
    figma: ["section/open-positions"],
    summary: "The heading's title, with the page size",
  },
  fields: [
    headingField({ align: "left" }),
    {
      name: "filters",
      type: "group",
      fields: FILTERS.map(([name, label]) => ({
        name,
        label,
        type: "checkbox" as const,
        defaultValue: true,
      })),
    },
    withSameAsEnTag({
      name: "searchPlaceholder",
      type: "text",
      localized: true,
    }),
    {
      name: "pageSize",
      type: "number",
      required: true,
      defaultValue: DEFAULT_JOB_PAGE_SIZE,
      min: 1,
      max: MAX_JOB_PAGE_SIZE,
      admin: { step: 1, description: "How many jobs show per page." },
    },
    withSameAsEnTag({ name: "emptyText", type: "text", localized: true }),
  ],
});
