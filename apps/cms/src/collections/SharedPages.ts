import { publishImpactEndpoint } from "../publish/impact";
import { readPublishedOrMembers, superAdmins, tenantMembers } from "../access";
import { collectionLabels } from "../admin/labels";
import { navGroup } from "../admin/navGroups";
import { rejectTokensOutsideTemplates } from "../detailTemplates";
import { withTrashedBy } from "../fields/authoring";
import { editorFields, withEditorShell } from "../fields/pageEditor";
import { parentField } from "../fields/pageFields";
import { withUpdatedBy } from "../fields/updatedBy";
import {
  cascadePathChange,
  freshBreadcrumbIds,
  rejectOversizedCascade,
} from "../pathCascade";
import { keepSingleHome, protectHome } from "../pageRules";
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
import { PAGE_VERSIONS_PER_DOCUMENT } from "./Pages";

export const SharedPages = withEditorShell(
  withTrashedBy(
    withUpdatedBy({
      slug: "shared-pages",
      endpoints: [publishImpactEndpoint("shared-pages")],
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
        beforeValidate: [
          keepSingleHome,
          keepBasePagesOutOfTheTrash,
          rejectTokensOutsideTemplates,
        ],
        beforeDelete: [protectHome, keepBasePagesOnDelete, removeRoutes],
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
      },
      admin: {
        group: navGroup("content"),
        useAsTitle: "title",
        defaultColumns: ["title", "slug", "parent", "_status", "updatedAt"],
        components: {
          views: {
            list: {
              Component:
                "/admin/components/pages/SharedPagesView#SharedPagesView",
            },
          },
        },
      },
      custom: { nav: { icon: "public", order: 2 } },
      fields: editorFields(parentField("shared-pages", false), true),
    }),
  ),
);
