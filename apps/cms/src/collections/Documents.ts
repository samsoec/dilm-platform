import {
  systemManagedField,
  trashByEditorsDeleteBySuperAdmins,
} from "../access";
import { keepLinkedDocuments, keepLinkedDocumentsOnDelete } from "../catalog";
import { navGroup } from "../admin/navGroups";
import { collectionLabels } from "../admin/labels";
import { withTrashedBy, withUploadedBy } from "../fields/authoring";
import { withTenantAccess } from "../tenancy";
import {
  checkDocumentUpload,
  DOCUMENT_MIME_TYPE,
  downloadNameFromTitle,
} from "../uploads/documentFiles";
import { attachDocumentUsage } from "../uploads/documentUsage";

const DOCUMENT_CELLS = "/admin/components/documents/DocumentCells";

export const Documents = withTenantAccess(
  withTrashedBy(
    withUploadedBy({
      slug: "documents",
      labels: collectionLabels("documents"),
      access: { delete: trashByEditorsDeleteBySuperAdmins },
      trash: true,
      hooks: {
        beforeOperation: [checkDocumentUpload],
        beforeValidate: [keepLinkedDocuments],
        beforeDelete: [keepLinkedDocumentsOnDelete],
        afterOperation: [attachDocumentUsage],
      },
      admin: {
        group: navGroup("content"),
        useAsTitle: "title",
        listSearchableFields: ["title", "filename"],
        defaultColumns: [
          "title",
          "filesize",
          "usedInCount",
          "createdAt",
          "linkStatus",
        ],
        description:
          "PDF data sheets and attachments. Upload a file once, then link it from products and posts.",
        components: {
          beforeListTable: [
            "/admin/components/documents/DocumentsUploader#DocumentsUploader",
            "/admin/components/lists/EmptyState#EmptyState",
          ],
        },
      },
      defaultSort: "title",
      custom: { nav: { icon: "picture_as_pdf", order: 9 } },
      upload: { mimeTypes: [DOCUMENT_MIME_TYPE] },
      fields: [
        {
          name: "usedIn",
          type: "ui",
          admin: {
            position: "sidebar",
            components: {
              Field: "/admin/components/usedIn/server#DocumentUsedInField",
            },
          },
        },
        {
          name: "title",
          type: "text",
          required: true,
          admin: {
            components: { Cell: `${DOCUMENT_CELLS}#DocumentTitleCell` },
            description:
              "Visitors download the file under this name, with .pdf added.",
          },
        },
        {
          name: "createdAt",
          label: "Uploaded",
          type: "date",
          index: true,
          admin: {
            disableBulkEdit: true,
            hidden: true,
            components: { Cell: `${DOCUMENT_CELLS}#UploadedCell` },
          },
        },
        {
          name: "usedInCount",
          label: "Used in",
          type: "number",
          virtual: true,
          access: systemManagedField,
          admin: {
            hidden: true,
            components: { Cell: `${DOCUMENT_CELLS}#UsedInCountCell` },
          },
        },
        {
          name: "linkStatus",
          label: "Status",
          type: "text",
          virtual: true,
          access: systemManagedField,
          admin: {
            hidden: true,
            components: { Cell: `${DOCUMENT_CELLS}#LinkStatusCell` },
          },
        },
        {
          name: "downloadName",
          type: "text",
          virtual: true,
          access: systemManagedField,
          hooks: { afterRead: [downloadNameFromTitle] },
          admin: { hidden: true },
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
      ],
    }),
  ),
);
