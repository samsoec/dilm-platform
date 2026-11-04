import {
  trashByEditorsDeleteBySuperAdmins,
  readPublishedOrMembers,
} from "../access";
import { collectionLabels } from "../admin/labels";
import { navGroup } from "../admin/navGroups";
import { withTrashedBy } from "../fields/authoring";
import { pageFields, parentField } from "../fields/pageFields";
import { withUpdatedBy } from "../fields/updatedBy";
import {
  cascadePathChange,
  freshBreadcrumbIds,
  rejectOversizedCascade,
} from "../pathCascade";
import { rejectTokensOutsideTemplates } from "../detailTemplates";
import { keepParentInTenant } from "../pageRules";
import {
  beginLiveChange,
  revalidateOnDelete,
  revalidateOnLiveChange,
} from "../publishRevalidation";
import { stubRevalidator } from "../revalidation";
import { removeRoutes, syncRoutes } from "../routeIndex";
import {
  keepBasePagesOnDelete,
  keepBasePagesOutOfTheTrash,
  keepBasePagesPublished,
} from "../siteRouting";
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
      hooks: {
        beforeValidate: [
          keepParentInTenant,
          keepBasePagesOutOfTheTrash,
          rejectTokensOutsideTemplates,
        ],
        beforeChange: [
          rejectOversizedCascade,
          freshBreadcrumbIds,
          beginLiveChange,
        ],
        afterChange: [
          keepBasePagesPublished,
          cascadePathChange,
          syncRoutes,
          revalidateOnLiveChange(stubRevalidator),
        ],
        afterDelete: [revalidateOnDelete(stubRevalidator)],
        beforeDelete: [keepBasePagesOnDelete, removeRoutes],
      },
      admin: {
        group: navGroup("content"),
        useAsTitle: "title",
        defaultColumns: ["title", "slug", "parent", "_status", "updatedAt"],
        components: {
          views: {
            list: { Component: "/admin/components/pages/PagesView#PagesView" },
          },
        },
      },
      custom: { nav: { icon: "account_tree", order: 1 } },
      fields: pageFields(parentField("pages", true), true),
    }),
  ),
);
