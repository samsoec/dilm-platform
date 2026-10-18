import { nobody, superAdmins } from "../access";
import { navGroup } from "../admin/navGroups";
import { withTenantAccess } from "../tenancy";
import { collectionLabels } from "../admin/labels";

export const CONSENT_TYPES = ["career-application", "contact-form"] as const;

export const ConsentLogs = withTenantAccess({
  slug: "consent-logs",
  labels: collectionLabels("consent-logs"),
  access: {
    create: nobody,
    update: nobody,
    delete: superAdmins,
  },
  admin: {
    group: navGroup("inbox"),
    defaultColumns: ["timestamp", "consentType", "policyVersion"],
    description:
      "UU PDP consent audit trail, written by the system. Holds no IP addresses.",
  },
  custom: {
    nav: { icon: "verified_user", order: 2 },
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
