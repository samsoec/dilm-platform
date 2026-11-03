import { DEFAULT_JOB_LIMIT, MAX_JOB_ITEMS } from "@dilm/shared-types";

import { pickerScope, validateManyPicks } from "../fields/recordPicks";
import {
  appearanceField,
  buttonsField,
  headingField,
  recordPickerFields,
} from "./factories";
import { sectionBlock } from "./sectionBlock";

export const jobShowcase = sectionBlock({
  slug: "jobShowcase",
  interfaceName: "JobShowcaseBlock",
  group: "Records",
  tableName: "jsh",
  catalog: {
    name: "Job showcase",
    purpose:
      "A few job cards, hand-picked or the newest open jobs; on a job page the job itself is left out.",
    figma: ["section/other-opportunities"],
    summary: "The heading's title, with the source and job count",
  },
  fields: [
    headingField({ align: "center" }),
    ...recordPickerFields({
      collection: "jobs",
      sources: ["manual", "latest"],
      minItems: 1,
      maxItems: MAX_JOB_ITEMS,
      limit: { default: DEFAULT_JOB_LIMIT, max: MAX_JOB_ITEMS },
      filterOptions: pickerScope,
      validate: validateManyPicks,
    }),
    buttonsField({ tableName: "btn" }),
    appearanceField(),
  ],
});
