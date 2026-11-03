import type { CollectionConfig } from "payload";

import { nobody, tenantMembers } from "../access";
import { collectionLabels } from "../admin/labels";
import { navGroup } from "../admin/navGroups";
import { REFRESH_STATUSES } from "../refreshStatus";

export const RefreshStatus: CollectionConfig = {
  slug: "refresh-status",
  labels: collectionLabels("refresh-status"),
  access: {
    read: tenantMembers,
    create: nobody,
    update: nobody,
    delete: nobody,
  },
  admin: {
    hidden: true,
    group: navGroup("admin"),
    useAsTitle: "docId",
    defaultColumns: ["collection", "docId", "status", "at"],
    description:
      "Whether the website was told about the last published change to each page, record or template. Written by the system.",
  },
  indexes: [{ fields: ["collection", "docId"], unique: true }],
  custom: { nav: { icon: "link", order: 10 } },
  fields: [
    { name: "collection", type: "text", required: true, index: true },
    { name: "docId", type: "text", required: true },
    {
      name: "status",
      type: "select",
      enumName: "refresh_outcome",
      required: true,
      options: [...REFRESH_STATUSES],
    },
    { name: "at", type: "date", required: true },
    { name: "hosts", type: "json", defaultValue: [] },
  ],
};
