import { readPublishedOrMembers, superAdmins, tenantMembers } from "../access";
import { collectionLabels } from "../admin/labels";
import { navGroup } from "../admin/navGroups";
import {
  allowTemplateTokens,
  keepOneTemplatePerType,
  sharedRecordTypeOptions,
} from "../detailTemplates";
import { layoutField } from "../fields/layout";
import { withUpdatedBy } from "../fields/updatedBy";
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
  hooks: { beforeValidate: [keepOneTemplatePerType, allowTemplateTokens] },
  admin: {
    group: navGroup("content"),
    useAsTitle: "recordType",
    defaultColumns: ["recordType", "_status", "updatedAt"],
    description:
      "One layout for every product and one for every solution, on all three websites. Only Super Admins change them.",
  },
  custom: { nav: { icon: "space_dashboard", order: 8 } },
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
    layoutField(),
  ],
});
