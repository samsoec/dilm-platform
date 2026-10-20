import {
  systemManagedField,
  trashByEditorsDeleteBySuperAdmins,
} from "../access";
import { navGroup } from "../admin/navGroups";
import {
  keepPublishedFile,
  randomiseUploadName,
  stampFirstPublished,
} from "../uploads/irFiles";
import { localization } from "../localization";
import { withTenantAccess } from "../tenancy";
import { withTrashedBy } from "../fields/authoring";
import { withUpdatedBy } from "../fields/updatedBy";
import { collectionLabels } from "../admin/labels";

export const IR_VERSIONS_PER_DOCUMENT = 50;

export const IR_DOCUMENT_TYPES = [
  "annual-report",
  "financial-statement",
  "sustainability-report",
  "public-disclosure",
  "shareholder-meeting",
  "prospectus",
] as const;

export const IrDocuments = withTenantAccess(
  withTrashedBy(
    withUpdatedBy({
      slug: "ir-documents",
      labels: collectionLabels("ir-documents"),
      access: { delete: trashByEditorsDeleteBySuperAdmins },
      versions: { drafts: true, maxPerDoc: IR_VERSIONS_PER_DOCUMENT },
      trash: true,
      hooks: {
        beforeOperation: [randomiseUploadName],
        beforeChange: [stampFirstPublished, keepPublishedFile],
      },
      admin: {
        group: navGroup("investor"),
        useAsTitle: "title",
        defaultColumns: ["title", "documentType", "publishedDate", "locale"],
        components: {
          beforeListTable: [
            "/admin/components/trash/TrashToggle#TrashToggle",
            "/admin/components/trash/TrashTable#TrashTable",
          ],
        },
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
          name: "firstPublishedAt",
          type: "date",
          access: systemManagedField,
          admin: { readOnly: true, position: "sidebar" },
        },
        {
          name: "locale",
          type: "select",
          required: true,
          options: [...localization.locales],
          defaultValue: localization.defaultLocale,
        },
      ],
    }),
  ),
);
