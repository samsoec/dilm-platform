import { readPublishedOrMembers, superAdmins, tenantMembers } from "../access";
import { collectionLabels } from "../admin/labels";
import { navGroup } from "../admin/navGroups";
import { pageBlocks } from "../blocks";
import {
  allowTemplateTokens,
  keepOneTemplatePerType,
  sharedRecordTypeOptions,
} from "../detailTemplates";
import { LAYOUT_EXCLUSIONS, layoutField } from "../fields/layout";
import { withUpdatedBy } from "../fields/updatedBy";
import {
  captureTemplateRow,
  revalidateTemplate,
  revalidateTemplateOnDelete,
} from "../publishRevalidation";
import { stubRevalidator } from "../revalidation";
import { PAGE_VERSIONS_PER_DOCUMENT } from "./Pages";

export const SharedDetailTemplates = withUpdatedBy({
  slug: "shared-detail-templates",
  labels: collectionLabels("shared-detail-templates"),
  access: {
    read: readPublishedOrMembers,
    readVersions: tenantMembers,
    create: superAdmins,
    update: superAdmins,
    delete: superAdmins,
  },
  versions: { drafts: true, maxPerDoc: PAGE_VERSIONS_PER_DOCUMENT },
  hooks: {
    beforeValidate: [keepOneTemplatePerType, allowTemplateTokens],
    beforeChange: [captureTemplateRow],
    afterChange: [revalidateTemplate("shared", stubRevalidator)],
    afterDelete: [revalidateTemplateOnDelete("shared", stubRevalidator)],
  },
  admin: {
    group: navGroup("content"),
    useAsTitle: "recordType",
    defaultColumns: ["recordType", "_status", "updatedAt"],
    description:
      "One layout for every product and one for every solution, on all three websites. Only Super Admins change them.",
  },
  custom: { nav: { icon: "dashboard_customize", order: 3, omit: true } },
  fields: [
    {
      name: "recordType",
      label: "Template for",
      type: "select",
      enumName: "shared_detail_templates_record_type",
      required: true,
      unique: true,
      options: sharedRecordTypeOptions,
    },
    layoutField(pageBlocks, LAYOUT_EXCLUSIONS["shared-detail-templates"]),
  ],
});
