import { navGroup } from "../admin/navGroups";
import { localization } from "../localization";
import { withTenantAccess } from "../tenancy";
import { collectionLabels } from "../admin/labels";

export const IR_DOCUMENT_TYPES = [
  "annual-report",
  "financial-statement",
  "sustainability-report",
  "public-disclosure",
  "shareholder-meeting",
  "prospectus",
] as const;

export const IrDocuments = withTenantAccess({
  slug: "ir-documents",
  labels: collectionLabels("ir-documents"),
  admin: {
    group: navGroup("investor"),
    useAsTitle: "title",
    defaultColumns: ["title", "documentType", "publishedDate", "locale"],
  },
  custom: {
    nav: { icon: "description" },
  },
  upload: {
    mimeTypes: ["application/pdf"],
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "documentType",
      type: "select",
      required: true,
      options: [...IR_DOCUMENT_TYPES],
    },
    {
      name: "publishedDate",
      type: "date",
      required: true,
    },
    {
      name: "locale",
      type: "select",
      required: true,
      options: [...localization.locales],
      defaultValue: localization.defaultLocale,
    },
  ],
});
