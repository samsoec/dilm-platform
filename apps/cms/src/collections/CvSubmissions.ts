import type { Field } from "payload";

import { nobody, superAdmins, systemManagedField } from "../access";
import { navGroup } from "../admin/navGroups";
import { withTenantAccess } from "../tenancy";
import {
  stampStatusChange,
  statusChangedAtField,
  statusChangedByField,
} from "../fields/authoring";
import { collectionLabels } from "../admin/labels";

export const CV_STATUSES = [
  "received",
  "reviewed",
  "shortlisted",
  "rejected",
] as const;

export const EXTERNAL_SYNC_STATUSES = ["pending", "synced", "failed"] as const;

const LABELS = {
  emails: "/admin/components/lists/CvColumnLabel#EmailsLabel",
  jobPlatform: "/admin/components/lists/CvColumnLabel#JobPlatformLabel",
};

const CELLS = {
  applicant: "/admin/components/cells/ApplicantCell#ApplicantCell",
  status: "/admin/components/cells/StatusPill#StatusPill",
  emails: "/admin/components/cells/EmailsCell#EmailsCell",
  sync: "/admin/components/cells/SyncCell#SyncCell",
};

function systemManaged<T extends Field>(field: T): T {
  return {
    ...field,
    access: systemManagedField,
    admin: { ...field.admin, readOnly: true },
  };
}

export const CvSubmissions = withTenantAccess({
  slug: "cv-submissions",
  labels: collectionLabels("cv-submissions"),
  enableQueryPresets: true,
  access: {
    create: nobody,
    delete: superAdmins,
  },
  admin: {
    group: navGroup("inbox"),
    useAsTitle: "applicantName",
    description:
      "Applications sent from the careers page. Open one to read it and set its status as you review.",
    listSearchableFields: ["applicantName", "email"],
    defaultColumns: [
      "applicantName",
      "position",
      "status",
      "submittedAt",
      "applicantNotifiedAt",
      "externalSyncStatus",
    ],
    pagination: { defaultLimit: 20, limits: [20, 50, 100] },
    components: {
      Description: "/admin/components/lists/ListIntro#ListIntro",
      beforeListTable: [
        "/admin/components/lists/StatusTabs#StatusTabs",
        "/admin/components/lists/CvToolbar#CvToolbar",
      ],
      afterListTable: ["/admin/components/lists/CvListFooter#CvListFooter"],
      views: {
        edit: {
          default: {
            Component:
              "/admin/components/application/ApplicationView#ApplicationView",
          },
        },
      },
    },
  },
  custom: {
    nav: { icon: "badge", order: 1, badge: "cv-received" },
  },
  hooks: {
    beforeChange: [stampStatusChange],
  },
  fields: [
    systemManaged({
      name: "submissionId",
      type: "text",
      required: true,
      unique: true,
      index: true,
    }),
    systemManaged({
      name: "applicantName",
      label: "Applicant",
      type: "text",
      required: true,
      admin: { components: { Cell: CELLS.applicant } },
    }),
    systemManaged({ name: "email", type: "email", required: true }),
    systemManaged({ name: "phone", type: "text", required: true }),
    systemManaged({ name: "position", type: "text", required: true }),
    systemManaged({
      name: "resumeFileKey",
      type: "text",
      required: true,
      admin: {
        description: "S3 key of the résumé in the private CV bucket.",
      },
    }),
    systemManaged({
      name: "submittedAt",
      label: "Submitted",
      type: "date",
      required: true,
      admin: { date: { pickerAppearance: "dayAndTime" } },
    }),
    {
      name: "status",
      type: "select",
      required: true,
      options: [...CV_STATUSES],
      defaultValue: "received",
      admin: { components: { Cell: CELLS.status } },
    },
    statusChangedByField,
    statusChangedAtField,
    systemManaged({
      name: "applicantNotifiedAt",
      type: "date",
      admin: {
        date: { pickerAppearance: "dayAndTime" },
        components: { Cell: CELLS.emails, Label: LABELS.emails },
      },
    }),
    systemManaged({
      name: "recruiterNotifiedAt",
      type: "date",
      admin: { date: { pickerAppearance: "dayAndTime" } },
    }),
    systemManaged({
      name: "externalSyncStatus",
      label: "Job platform",
      type: "select",
      required: true,
      options: [...EXTERNAL_SYNC_STATUSES],
      defaultValue: "pending",
      admin: { components: { Cell: CELLS.sync, Label: LABELS.jobPlatform } },
    }),
    systemManaged({
      name: "externalSyncAttempts",
      type: "number",
      required: true,
      min: 0,
      defaultValue: 0,
    }),
    systemManaged({
      name: "externalSyncTriedAt",
      label: "Last job platform try",
      type: "date",
      admin: { date: { pickerAppearance: "dayAndTime" } },
    }),
  ],
});
