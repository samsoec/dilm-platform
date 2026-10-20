import { nobody, superAdmins } from "../access";
import { navGroup } from "../admin/navGroups";
import { withTenantAccess } from "../tenancy";
import { collectionLabels } from "../admin/labels";

export const CONSENT_TYPES = ["career-application", "contact-form"] as const;

const CELLS = {
  timestamp: "/admin/components/consent/ConsentCells#TimestampCell",
  consentType: "/admin/components/consent/ConsentCells#ConsentTypeCell",
  mono: "/admin/components/consent/ConsentCells#MonoCell",
  related: "/admin/components/consent/RelatedRecordCell#RelatedRecordCell",
};

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
    defaultColumns: [
      "timestamp",
      "consentType",
      "policyVersion",
      "relatedRecordId",
    ],
    description:
      "UU PDP consent audit trail, written by the system. Holds no IP addresses.",
    pagination: { defaultLimit: 20, limits: [20, 50, 100] },
    components: {
      Description: "/admin/components/lists/ListIntro#ListIntro",
      beforeListTable: [
        "/admin/components/consent/ConsentToolbar#ConsentToolbar",
      ],
      afterListTable: [
        "/admin/components/consent/ConsentListFooter#ConsentListFooter",
      ],
      views: {
        edit: {
          default: {
            Component:
              "/admin/components/consent/ConsentRecordView#ConsentRecordView",
          },
        },
      },
    },
  },
  defaultSort: "-timestamp",
  custom: {
    nav: { icon: "verified_user", order: 2 },
  },
  fields: [
    {
      name: "timestamp",
      type: "date",
      required: true,
      admin: {
        date: { pickerAppearance: "dayAndTime" },
        components: { Cell: CELLS.timestamp },
      },
    },
    {
      name: "policyVersion",
      type: "text",
      required: true,
      admin: { components: { Cell: CELLS.mono } },
    },
    {
      name: "relatedRecordId",
      label: "Related record",
      type: "text",
      required: true,
      admin: { components: { Cell: CELLS.related } },
    },
    {
      name: "consentType",
      type: "select",
      required: true,
      options: [...CONSENT_TYPES],
      admin: { components: { Cell: CELLS.consentType } },
    },
  ],
});
