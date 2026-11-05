import {
  trashByEditorsDeleteBySuperAdmins,
  readPublishedOrMembers,
} from "../access";
import { collectionLabels } from "../admin/labels";
import { navGroup } from "../admin/navGroups";
import { withTrashedBy } from "../fields/authoring";
import { editorFields, withEditorShell } from "../fields/pageEditor";
import { parentField } from "../fields/pageFields";
import { withUpdatedBy } from "../fields/updatedBy";
import {
  cascadePathChange,
  freshBreadcrumbIds,
  rejectOversizedCascade,
} from "../pathCascade";
import { rejectTokensOutsideTemplates } from "../detailTemplates";
import {
  checkSlugHandler,
  createDraftHandler,
  parentOptionsHandler,
} from "../pageDialog";
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
import { pathImpactHandler } from "../pathImpact";

export const PAGE_VERSIONS_PER_DOCUMENT = 50;

export const Pages = withTenantAccess(
  withEditorShell(
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
        endpoints: [
          {
            path: "/parent-options",
            method: "get",
            handler: parentOptionsHandler,
          },
          { path: "/check-slug", method: "post", handler: checkSlugHandler },
          {
            path: "/:id/path-impact",
            method: "post",
            handler: pathImpactHandler,
          },
          {
            path: "/create-draft",
            method: "post",
            handler: createDraftHandler,
          },
        ],
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
              list: {
                Component: "/admin/components/pages/PagesView#PagesView",
              },
            },
          },
        },
        custom: { nav: { icon: "account_tree", order: 1 } },
        fields: editorFields(parentField("pages", true)),
      }),
    ),
  ),
);
