import type { Field } from "payload";

import { nobody, superAdmins, systemManagedField } from "../access";
import { withTenantAccess } from "../tenancy";

export const CV_STATUSES = [
  "received",
  "reviewed",
  "shortlisted",
  "rejected",
] as const;

export const EXTERNAL_SYNC_STATUSES = ["pending", "synced", "failed"] as const;

function systemManaged<T extends Field>(field: T): T {
  return {
    ...field,
    access: systemManagedField,
    admin: { ...field.admin, readOnly: true },
  };
}

export const CvSubmissions = withTenantAccess({
  slug: "cv-submissions",
  labels: { singular: "CV submission", plural: "CV submissions" },
  access: {
    create: nobody,
    delete: superAdmins,
  },
  admin: {
    useAsTitle: "applicantName",
    defaultColumns: ["applicantName", "position", "status", "submittedAt"],
  },
  fields: [
    systemManaged({
      name: "submissionId",
      type: "text",
      required: true,
      unique: true,
      index: true,
    }),
    systemManaged({ name: "applicantName", type: "text", required: true }),
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
    },
    systemManaged({
      name: "applicantNotifiedAt",
      type: "date",
      admin: { date: { pickerAppearance: "dayAndTime" } },
    }),
    systemManaged({
      name: "recruiterNotifiedAt",
      type: "date",
      admin: { date: { pickerAppearance: "dayAndTime" } },
    }),
    systemManaged({
      name: "externalSyncStatus",
      type: "select",
      required: true,
      options: [...EXTERNAL_SYNC_STATUSES],
      defaultValue: "pending",
    }),
    systemManaged({
      name: "externalSyncAttempts",
      type: "number",
      required: true,
      min: 0,
      defaultValue: 0,
    }),
  ],
});
