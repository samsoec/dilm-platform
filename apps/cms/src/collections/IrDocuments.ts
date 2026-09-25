import { localization } from "../localization";
import { withTenantAccess } from "../tenancy";

export const IR_DOCUMENT_TYPES = [
  "annual-report",
  "financial-statement",
  "sustainability-report",
  "public-disclosure",
  "shareholder-meeting",
  "prospectus",
] as const;

// TODO(DILM-18): store on S3 under the public bucket's ir-documents/ prefix.
export const IrDocuments = withTenantAccess({
  slug: "ir-documents",
  labels: { singular: "IR document", plural: "IR documents" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "documentType", "publishedDate", "locale"],
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
