import { CONTACT_FORM_FIELDS, type ContactFormField } from "@dilm/shared-types";

import { applicationFormFields } from "./consentForm";
import { headingField } from "./factories";
import { sectionBlock } from "./sectionBlock";

export {
  CONSENT_CHECK_FAILED,
  consentEditor,
  consentMissingMessage,
  isConsentEmpty,
  validateConsent,
} from "./consentForm";

export const CONTACT_FIELD_LABELS: Record<ContactFormField, string> = {
  fullName: "Full name",
  company: "Company",
  workEmail: "Work email",
  phone: "Phone",
  message: "Message",
};

export const contactInquiry = sectionBlock({
  slug: "contactInquiry",
  interfaceName: "ContactInquiryBlock",
  group: "Current company",
  tableName: "cin",
  catalog: {
    name: "Contact details and inquiry form",
    purpose:
      "The company's address, phone and email beside an inquiry form with five fixed fields. It shows the company of the site it is viewed on, so a shared page fits every site.",
    figma: ["section/contact-details-inquiry"],
    summary: "The heading's title",
  },
  fields: [
    headingField({ align: "left" }),
    {
      name: "form",
      type: "group",
      fields: applicationFormFields(CONTACT_FORM_FIELDS, CONTACT_FIELD_LABELS),
    },
  ],
});
