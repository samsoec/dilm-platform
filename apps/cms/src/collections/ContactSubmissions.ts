import type { Field } from "payload";
import { CONTACT_FIELD_LIMITS, CONTENT_LOCALES } from "@dilm/shared-types";

import { nobody, superAdmins, systemManagedField } from "../access";
import { navGroup } from "../admin/navGroups";
import { collectionLabels } from "../admin/labels";
import { withTenantAccess } from "../tenancy";

const CELLS = {
  sender: "/admin/components/contact/ContactCells#SenderCell",
  submitted: "/admin/components/contact/ContactCells#SubmittedCell",
  delivery: "/admin/components/contact/ContactCells#DeliveryCell",
};

function systemManaged<T extends Field>(field: T): T {
  return {
    ...field,
    access: systemManagedField,
    admin: { ...field.admin, readOnly: true },
  };
}

const dateTime = { date: { pickerAppearance: "dayAndTime" as const } };

export const ContactSubmissions = withTenantAccess({
  slug: "contact-submissions",
  labels: collectionLabels("contact-submissions"),
  access: {
    create: nobody,
    update: nobody,
    delete: superAdmins,
  },
  admin: {
    group: navGroup("inbox"),
    useAsTitle: "fullName",
    description:
      "Messages sent from the contact form, written by the system and kept read-only.",
    listSearchableFields: ["fullName", "workEmail"],
    defaultColumns: ["fullName", "company", "submittedAt", "teamNotifiedAt"],
    pagination: { defaultLimit: 20, limits: [20, 50, 100] },
    components: {
      Description: "/admin/components/lists/ListIntro#ListIntro",
      beforeListTable: ["/admin/components/lists/EmptyState#EmptyState"],
      views: {
        edit: {
          default: {
            Component:
              "/admin/components/contact/ContactMessageView#ContactMessageView",
          },
        },
      },
    },
  },
  defaultSort: "-submittedAt",
  custom: {
    nav: { icon: "mail", order: 3 },
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
      name: "fullName",
      label: "Sender",
      type: "text",
      required: true,
      maxLength: CONTACT_FIELD_LIMITS.fullName,
      admin: { components: { Cell: CELLS.sender } },
    }),
    systemManaged({
      name: "company",
      type: "text",
      required: true,
      maxLength: CONTACT_FIELD_LIMITS.company,
    }),
    systemManaged({
      name: "workEmail",
      type: "email",
      required: true,
      maxLength: CONTACT_FIELD_LIMITS.workEmail,
    }),
    systemManaged({
      name: "phone",
      type: "text",
      maxLength: CONTACT_FIELD_LIMITS.phone,
    }),
    systemManaged({
      name: "message",
      type: "textarea",
      required: true,
      maxLength: CONTACT_FIELD_LIMITS.message,
    }),
    systemManaged({
      name: "locale",
      type: "select",
      required: true,
      options: [...CONTENT_LOCALES],
    }),
    systemManaged({
      name: "submittedAt",
      label: "Submitted",
      type: "date",
      required: true,
      admin: { ...dateTime, components: { Cell: CELLS.submitted } },
    }),
    systemManaged({
      name: "teamNotifiedAt",
      label: "Email delivery",
      type: "date",
      admin: { ...dateTime, components: { Cell: CELLS.delivery } },
    }),
    systemManaged({
      name: "senderNotifiedAt",
      type: "date",
      admin: dateTime,
    }),
  ],
});
