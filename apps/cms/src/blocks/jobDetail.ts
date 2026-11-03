import { JOB_FORM_FIELDS, type JobFormField } from "@dilm/shared-types";

import { applicationFormFields } from "./consentForm";
import { headingField } from "./factories";
import { sectionBlock } from "./sectionBlock";

export const JOB_FIELD_LABELS: Record<JobFormField, string> = {
  fullName: "Full name",
  email: "Email",
  phone: "Phone",
  coverLetter: "Cover letter",
  resume: "Resume / CV",
};

export const jobDetail = sectionBlock({
  slug: "jobDetail",
  interfaceName: "JobDetailBlock",
  group: "Template",
  tableName: "jdet",
  recordTypes: ["job"],
  catalog: {
    name: "Job details and application",
    purpose:
      "The job's description sections and an application form with five fixed fields. The description comes from the job; you set the heading and the form wording.",
    figma: ["section/about-role"],
    summary: "The heading's title",
  },
  fields: [
    headingField({ align: "left" }),
    {
      name: "form",
      type: "group",
      fields: applicationFormFields(JOB_FORM_FIELDS, JOB_FIELD_LABELS),
    },
  ],
});
