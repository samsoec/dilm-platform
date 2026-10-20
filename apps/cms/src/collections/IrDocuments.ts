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
import {
  captureLiveRow,
  purgeOnLiveChange,
  stubPurger,
} from "../publish/irPurge";
import { withTenantAccess } from "../tenancy";
import { withTrashedBy } from "../fields/authoring";
import { withUpdatedBy } from "../fields/updatedBy";
import { collectionLabels } from "../admin/labels";
import { IR_DOCUMENT_TYPE_OPTIONS } from "../irDocumentTypes";

export const IR_VERSIONS_PER_DOCUMENT = 50;

const IR_CELLS = "/admin/components/ir/IrCells";

export { IR_DOCUMENT_TYPES } from "../irDocumentTypes";

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
        beforeChange: [stampFirstPublished, keepPublishedFile, captureLiveRow],
        afterChange: [purgeOnLiveChange(stubPurger)],
      },
      admin: {
        group: navGroup("investor"),
        useAsTitle: "title",
        description:
          "Investor-relations PDFs shown on the Investor page. Each file is for one language.",
        defaultColumns: [
          "title",
          "documentType",
          "publishedDate",
          "locale",
          "filesize",
          "_status",
        ],
        components: {
          Description: "/admin/components/lists/ListIntro#ListIntro",
          beforeListTable: [
            "/admin/components/trash/TrashToggle#TrashToggle",
            "/admin/components/ir/IrToolbar#IrToolbar",
            "/admin/components/trash/TrashTable#TrashTable",
          ],
          afterListTable: ["/admin/components/ir/IrCells#IrListFooter"],
        },
      },
      defaultSort: "-publishedDate",
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
          admin: { components: { Cell: `${IR_CELLS}#PdfTitleCell` } },
        },
        {
          name: "documentType",
          label: "Document type",
          type: "select",
          required: true,
          options: IR_DOCUMENT_TYPE_OPTIONS.map(({ value, label }) => ({
            value,
            label,
          })),
          admin: { components: { Cell: `${IR_CELLS}#TypeLabelCell` } },
        },
        {
          name: "publishedDate",
          label: "Published date",
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
          label: "Language",
          type: "select",
          required: true,
          options: [...localization.locales],
          defaultValue: localization.defaultLocale,
          admin: { components: { Cell: `${IR_CELLS}#LocaleTagCell` } },
        },
        {
          name: "filesize",
          label: "Size",
          type: "number",
          admin: {
            components: {
              Cell: "/admin/components/media/MediaCells#FileSizeCell",
            },
          },
        },
        {
          name: "_status",
          label: "Status",
          type: "select",
          options: [],
          admin: {
            components: {
              Cell: "/admin/components/ir/IrStatusCell#IrStatusCell",
            },
          },
        },
      ],
    }),
  ),
);
