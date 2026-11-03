import type { CollectionConfig } from "payload";

import { anyone, superAdmins } from "../access";
import { collectionLabels } from "../admin/labels";
import { navGroup } from "../admin/navGroups";
import {
  cascadePostPaths,
  keepCategoriesWithPosts,
  redirectMovedPath,
} from "../categories";
import {
  categoryAddressFields,
  categoryNameField,
} from "../fields/recordFields";
import { lockStructure } from "../fields/structure";
import {
  beginLiveChange,
  revalidateOnDelete,
  revalidateOnLiveChange,
} from "../publishRevalidation";
import { stubRevalidator } from "../revalidation";
import { removeRoutes, syncRoutes } from "../routeIndex";

export const Categories: CollectionConfig = {
  slug: "categories",
  labels: collectionLabels("categories"),
  access: {
    read: anyone,
    create: superAdmins,
    update: superAdmins,
    delete: superAdmins,
  },
  hooks: {
    beforeChange: [beginLiveChange],
    afterChange: [
      redirectMovedPath,
      syncRoutes,
      cascadePostPaths,
      revalidateOnLiveChange(stubRevalidator),
    ],
    afterDelete: [revalidateOnDelete(stubRevalidator)],
    beforeDelete: [keepCategoriesWithPosts, removeRoutes],
  },
  admin: {
    group: navGroup("content"),
    useAsTitle: "name",
    defaultColumns: ["name", "slug", "updatedAt"],
    listSearchableFields: ["name", "slug"],
    description:
      "The groups posts are filed under. Shared by all three companies; only Super Admins change them.",
  },
  custom: { nav: { icon: "bookmark", order: 7 } },
  fields: [
    ...categoryAddressFields(),
    ...lockStructure([
      categoryNameField,
      {
        name: "description",
        label: "Description",
        type: "textarea",
        localized: true,
      },
      {
        name: "coverImage",
        label: "Cover image",
        type: "upload",
        relationTo: "media",
      },
    ]),
  ],
};
