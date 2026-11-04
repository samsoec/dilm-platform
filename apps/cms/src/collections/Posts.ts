import {
  readPublishedOrMembers,
  trashByEditorsDeleteBySuperAdmins,
} from "../access";
import { collectionLabels } from "../admin/labels";
import { navGroup } from "../admin/navGroups";
import { redirectMovedPath } from "../categories";
import { withTrashedBy } from "../fields/authoring";
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
import { PAGE_VERSIONS_PER_DOCUMENT } from "./Pages";

export const todayAsPublishedAt = () => new Date().toISOString();

export const Posts = withTenantAccess(
  withTrashedBy(
    withUpdatedBy({
      slug: "posts",
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
      },
      defaultSort: "-publishedAt",
      custom: { nav: { icon: "newspaper", order: 7 } },
      fields: [
        ...postAddressFields(),
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
              description:
                "The post's address follows its category. Changing it moves the post and leaves a redirect from the old address.",
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
          },
          postBodyField({ name: "body", label: "Body" }),
        ]),
      ],
    }),
  ),
);
