import { readPublishedOrMembers, tenantEditors } from "../access";
import { collectionLabels } from "../admin/labels";
import { navGroup } from "../admin/navGroups";
import {
  allowTemplateTokens,
  keepOneTemplatePerType,
  tenantRecordTypeOptions,
} from "../detailTemplates";
import { layoutField } from "../fields/layout";
import { withUpdatedBy } from "../fields/updatedBy";
import { withTenantAccess } from "../tenancy";
import {
  captureTemplateRow,
  revalidateTemplate,
  revalidateTemplateOnDelete,
} from "../publishRevalidation";
import { stubRevalidator } from "../revalidation";
import { PAGE_VERSIONS_PER_DOCUMENT } from "./Pages";

export const DetailTemplates = withTenantAccess(
  withUpdatedBy({
    slug: "detail-templates",
    labels: collectionLabels("detail-templates"),
    access: {
      read: readPublishedOrMembers,
      delete: tenantEditors,
    },
    versions: { drafts: true, maxPerDoc: PAGE_VERSIONS_PER_DOCUMENT },
    hooks: {
      beforeValidate: [keepOneTemplatePerType, allowTemplateTokens],
      beforeChange: [captureTemplateRow],
      afterChange: [revalidateTemplate("tenant", stubRevalidator)],
      afterDelete: [revalidateTemplateOnDelete("tenant", stubRevalidator)],
    },
    indexes: [{ fields: ["tenant", "recordType"], unique: true }],
    admin: {
      group: navGroup("content"),
      useAsTitle: "recordType",
      defaultColumns: ["recordType", "_status", "updatedAt"],
      description:
        "One layout for all of this company's jobs, one for its posts and one for its categories.",
    },
    custom: { nav: { icon: "space_dashboard", order: 9 } },
    fields: [
      {
        name: "recordType",
        label: "Template for",
        type: "select",
        enumName: "detail_templates_record_type",
        required: true,
        options: tenantRecordTypeOptions,
      },
      layoutField(),
    ],
  }),
);
