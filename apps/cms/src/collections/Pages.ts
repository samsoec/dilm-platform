import {
  trashByEditorsDeleteBySuperAdmins,
  readPublishedOrMembers,
} from "../access";
import { collectionLabels } from "../admin/labels";
import { navGroup } from "../admin/navGroups";
import { withTrashedBy } from "../fields/authoring";
import { pageFields, parentField } from "../fields/pageFields";
import { withUpdatedBy } from "../fields/updatedBy";
import { keepParentInTenant } from "../pageRules";
import { withTenantAccess } from "../tenancy";

export const PAGE_VERSIONS_PER_DOCUMENT = 50;

export const Pages = withTenantAccess(
  withTrashedBy(
    withUpdatedBy({
      slug: "pages",
      labels: collectionLabels("pages"),
      access: {
        read: readPublishedOrMembers,
        delete: trashByEditorsDeleteBySuperAdmins,
      },
      versions: { drafts: true, maxPerDoc: PAGE_VERSIONS_PER_DOCUMENT },
      trash: true,
      hooks: { beforeValidate: [keepParentInTenant] },
      admin: {
        group: navGroup("content"),
        useAsTitle: "title",
        defaultColumns: ["title", "slug", "parent", "_status", "updatedAt"],
      },
      custom: { nav: { icon: "article", order: 1 } },
      fields: pageFields(parentField("pages", true), true),
    }),
  ),
);
