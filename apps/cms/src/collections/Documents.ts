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
      },
      admin: {
        group: navGroup("content"),
        useAsTitle: "title",
        listSearchableFields: ["title", "filename"],
        defaultColumns: ["title", "filesize", "uploadedBy", "createdAt"],
        description:
          "PDF data sheets and attachments. Upload a file once, then link it from products and posts.",
      },
      defaultSort: "title",
      custom: { nav: { icon: "picture_as_pdf", order: 9 } },
      upload: { mimeTypes: [DOCUMENT_MIME_TYPE] },
      fields: [
        {
          name: "title",
          type: "text",
          required: true,
          admin: {
            description:
              "Visitors download the file under this name, with .pdf added.",
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
