import { publishImpactEndpoint } from "../publish/impact";
import {
  readPublishedOrMembers,
  trashByEditorsDeleteBySuperAdmins,
} from "../access";
import { collectionLabels } from "../admin/labels";
import { navGroup } from "../admin/navGroups";
import { redirectMovedPath } from "../categories";
import { withTrashedBy } from "../fields/authoring";
import { withEditorShell } from "../fields/pageEditor";
import { withMediaPicker } from "../fields/mediaPicker";
import { postBodyField } from "../fields/postBody";
import { postAddressFields } from "../fields/recordFields";
import { lockStructure } from "../fields/structure";
import { withUpdatedBy } from "../fields/updatedBy";
import {
  beginLiveChange,
  revalidateOnDelete,
  revalidateOnLiveChange,
} from "../publishRevalidation";
import { stubRevalidator } from "../revalidation";
import { removeRoutes, syncRoutes } from "../routeIndex";
import { withTenantAccess } from "../tenancy";
import { EXCERPT_LIMIT } from "../admin/components/posts/posts";
import { PAGE_VERSIONS_PER_DOCUMENT } from "./Pages";
import { hideSystemField, ui } from "./Products";

const PARTS = "/admin/components/posts/PostEditorParts";
const SERVER = "/admin/components/posts/server";

export const todayAsPublishedAt = () => new Date().toISOString();

export const Posts = withTenantAccess(
  withEditorShell(
    withTrashedBy(
      withUpdatedBy({
        slug: "posts",
        endpoints: [publishImpactEndpoint("posts")],
        labels: collectionLabels("posts"),
        access: {
          read: readPublishedOrMembers,
          delete: trashByEditorsDeleteBySuperAdmins,
        },
        versions: { drafts: true, maxPerDoc: PAGE_VERSIONS_PER_DOCUMENT },
        trash: true,
        hooks: {
          beforeChange: [beginLiveChange],
          afterChange: [
            redirectMovedPath,
            syncRoutes,
            revalidateOnLiveChange(stubRevalidator),
          ],
          afterDelete: [revalidateOnDelete(stubRevalidator)],
          beforeDelete: [removeRoutes],
        },
        admin: {
          group: navGroup("content"),
          useAsTitle: "title",
          defaultColumns: [
            "title",
            "primaryCategory",
            "publishedAt",
            "_status",
            "updatedAt",
          ],
          listSearchableFields: ["title", "slug"],
          components: {
            views: {
              list: {
                Component: "/admin/components/posts/PostsView#PostsView",
              },
            },
          },
        },
        defaultSort: "-publishedAt",
        custom: { nav: { icon: "newspaper", order: 7 } },
        fields: [
          ui("postHeader", `${SERVER}#PostHeaderField`),
          ui("postActions", `${SERVER}#PostActionsField`),
          ui("postSidebar", `${SERVER}#PostSidebarField`, "sidebar"),
          ...postAddressFields().map(hideSystemField),
          ...lockStructure([
            {
              name: "title",
              label: "Title",
              type: "text",
              localized: true,
              required: true,
            },
            {
              name: "primaryCategory",
              label: "Primary category",
              type: "relationship",
              relationTo: "categories",
              required: true,
              maxDepth: 0,
              admin: {
                components: {
                  Description: `${SERVER}#CategoryDescriptionField`,
                  afterInput: [
                    "/admin/components/editor/PostCategoryNote#PostCategoryNote",
                  ],
                },
              },
            },
            {
              name: "publishedAt",
              label: "Published date",
              type: "date",
              defaultValue: todayAsPublishedAt,
              admin: { date: { pickerAppearance: "dayOnly" } },
            },
            withMediaPicker({
              name: "coverImage",
              label: "Cover image",
              type: "upload",
              relationTo: "media",
            }),
            {
              name: "excerpt",
              label: "Excerpt",
              type: "textarea",
              localized: true,
              admin: {
                components: {
                  Label: {
                    path: "/admin/components/products/ProductEditorParts#ShortDescriptionLabel",
                    clientProps: { limit: EXCERPT_LIMIT },
                  },
                  afterInput: [`${PARTS}#ExcerptOverflow`],
                },
              },
            },
            postBodyField({ name: "body", label: "Body" }),
          ]),
        ],
      }),
    ),
  ),
);
