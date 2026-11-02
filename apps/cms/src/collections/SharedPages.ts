import { readPublishedOrMembers, superAdmins, tenantMembers } from "../access";
import { collectionLabels } from "../admin/labels";
import { navGroup } from "../admin/navGroups";
import { withTrashedBy } from "../fields/authoring";
import { pageFields, parentField } from "../fields/pageFields";
import { withUpdatedBy } from "../fields/updatedBy";
import { keepSingleHome, protectHome } from "../pageRules";
import { removeRoutes, syncRoutes } from "../routeIndex";
import { PAGE_VERSIONS_PER_DOCUMENT } from "./Pages";

export const SharedPages = withTrashedBy(
  withUpdatedBy({
    slug: "shared-pages",
    labels: collectionLabels("shared-pages"),
    access: {
      read: readPublishedOrMembers,
      readVersions: tenantMembers,
      create: superAdmins,
      update: superAdmins,
      delete: superAdmins,
    },
    versions: { drafts: true, maxPerDoc: PAGE_VERSIONS_PER_DOCUMENT },
    trash: true,
    hooks: {
      beforeValidate: [keepSingleHome],
      beforeDelete: [protectHome, removeRoutes],
      afterChange: [syncRoutes],
    },
    admin: {
      group: navGroup("content"),
      useAsTitle: "title",
      defaultColumns: ["title", "slug", "parent", "_status", "updatedAt"],
    },
    custom: { nav: { icon: "public", order: 2 } },
    fields: pageFields(parentField("shared-pages", false), false),
  }),
);
