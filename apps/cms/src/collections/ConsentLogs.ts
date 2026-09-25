import { nobody, superAdmins } from "../access";
import { withTenantAccess } from "../tenancy";

export const CONSENT_TYPES = ["career-application", "contact-form"] as const;

export const ConsentLogs = withTenantAccess({
  slug: "consent-logs",
  access: {
    create: nobody,
    update: nobody,
    delete: superAdmins,
  },
  admin: {
    defaultColumns: ["timestamp", "consentType", "policyVersion"],
    description:
      "UU PDP consent audit trail, written by the system. Holds no IP addresses.",
  },
  fields: [
    {
      name: "timestamp",
      type: "date",
      required: true,
      admin: { date: { pickerAppearance: "dayAndTime" } },
    },
    {
      name: "policyVersion",
      type: "text",
      required: true,
    },
    {
      name: "relatedRecordId",
      type: "text",
      required: true,
    },
    {
      name: "consentType",
      type: "select",
      required: true,
      options: [...CONSENT_TYPES],
    },
  ],
});
