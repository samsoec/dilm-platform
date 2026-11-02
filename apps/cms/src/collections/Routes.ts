import type { CollectionConfig } from "payload";

import { nobody, superAdmins } from "../access";
import { collectionLabels } from "../admin/labels";
import { navGroup } from "../admin/navGroups";
import { localization } from "../localization";
import { ROUTABLE_COLLECTIONS } from "../routeIndex";

export const Routes: CollectionConfig = {
  slug: "routes",
  labels: collectionLabels("routes"),
  access: {
    read: superAdmins,
    create: nobody,
    update: nobody,
    delete: nobody,
  },
  admin: {
    hidden: true,
    group: navGroup("admin"),
    useAsTitle: "path",
    defaultColumns: ["path", "locale", "tenant", "doc"],
    description:
      "The public address of every published page, written by the system when a page is saved.",
  },
  indexes: [{ fields: ["tenant", "locale", "path"], unique: true }],
  custom: { nav: { icon: "link", order: 9 } },
  fields: [
    {
      name: "tenant",
      type: "relationship",
      relationTo: "tenants",
      index: true,
      admin: {
        description: "Empty for pages served on every company's website.",
      },
    },
    {
      name: "locale",
      type: "select",
      required: true,
      options: localization.locales.map((value) => ({
        value,
        label: value.toUpperCase(),
      })),
    },
    { name: "path", type: "text", required: true, index: true },
    {
      name: "doc",
      type: "relationship",
      relationTo: [...ROUTABLE_COLLECTIONS],
      required: true,
    },
    { name: "refs", type: "json", defaultValue: [] },
  ],
};
