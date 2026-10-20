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
  PURGE_STATUSES,
  purgeOnLiveChange,
  stubPurger,
} from "../publish/irPurge";
import { withTenantAccess } from "../tenancy";
import { withTrashedBy, withUploadedBy } from "../fields/authoring";
import { requiredToPublish } from "../admin/components/ir/irEditor";
import { withUpdatedBy } from "../fields/updatedBy";
import { collectionLabels } from "../admin/labels";
import { IR_DOCUMENT_TYPE_OPTIONS } from "../irDocumentTypes";

export const IR_VERSIONS_PER_DOCUMENT = 50;

const IR_CELLS = "/admin/components/ir/IrCells";
const IR_PARTS = "/admin/components/ir/IrEditorParts";

export { IR_DOCUMENT_TYPES } from "../irDocumentTypes";

export const IrDocuments = withTenantAccess(
  withTrashedBy(
    withUploadedBy(
      withUpdatedBy({
        slug: "ir-documents",
        labels: collectionLabels("ir-documents"),
        access: { delete: trashByEditorsDeleteBySuperAdmins },
        versions: { drafts: true, maxPerDoc: IR_VERSIONS_PER_DOCUMENT },
        trash: true,
        hooks: {
          beforeOperation: [randomiseUploadName],
          beforeChange: [
            stampFirstPublished,
            keepPublishedFile,
            captureLiveRow,
          ],
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
            edit: {
              Upload: "/admin/components/ir/IrFilePanel#IrFilePanel",
              PublishButton:
                "/admin/components/ir/IrPublishControls#IrPublishControls",
              SaveDraftButton:
                "/admin/components/ir/IrPublishControls#IrSaveDraftButton",
              UnpublishButton:
                "/admin/components/ir/IrPublishControls#NoUnpublishButton",
              beforeDocumentControls: [
                `${IR_PARTS}#IrStatusTag`,
                `${IR_PARTS}#IrVersionsButton`,
                "/admin/components/document/VersionsDrawer#VersionsDrawer",
              ],
            },
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
            name: "detailsHeading",
            type: "ui",
            admin: { components: { Field: `${IR_PARTS}#DetailsHeading` } },
          },
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
            validate: requiredToPublish("Choose a document type to publish."),
            admin: { components: { Cell: `${IR_CELLS}#TypeLabelCell` } },
          },
          {
            name: "firstPublishedAt",
            type: "date",
            access: systemManagedField,
            admin: { readOnly: true, position: "sidebar" },
          },
          {
            name: "lastPurgeStatus",
            label: "Last site refresh",
            type: "select",
            options: [...PURGE_STATUSES],
            access: systemManagedField,
            admin: {
              readOnly: true,
              position: "sidebar",
              condition: () => false,
            },
          },
          {
            name: "lastPurgeAt",
            label: "Last site refresh at",
            type: "date",
            access: systemManagedField,
            admin: {
              readOnly: true,
              position: "sidebar",
              condition: () => false,
            },
          },
          {
            name: "locale",
            label: "Language",
            type: "select",
            required: true,
            options: [...localization.locales],
            defaultValue: localization.defaultLocale,
            admin: {
              description:
                "One language per file. Upload the English version as its own document.",
              components: {
                Cell: `${IR_CELLS}#LocaleTagCell`,
                Field: `${IR_PARTS}#LanguageField`,
              },
            },
          },
          {
            name: "publishedDate",
            label: "Published date",
            type: "date",
            required: true,
            validate: requiredToPublish("Add the disclosure date to publish."),
            admin: {
              description:
                "The disclosure date shown on the Investor page. It's not the upload date.",
            },
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
          ...(
            [
              ["readyToPublish", `${IR_PARTS}#PublishChecklist`],
              ["disclosureTiming", `${IR_PARTS}#DisclosureTiming`],
              [
                "versionInfo",
                "/admin/components/fields/VersionInfo#VersionInfo",
              ],
              ["moveToTrash", `${IR_PARTS}#IrTrashButton`],
            ] as const
          ).map(([name, Field]) => ({
            name,
            type: "ui" as const,
            admin: { position: "sidebar" as const, components: { Field } },
          })),
        ],
      }),
    ),
  ),
);
