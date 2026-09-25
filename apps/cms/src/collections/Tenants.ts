import type { CollectionConfig } from "payload";

import { localization } from "../localization";

// TODO(DILM-15): restrict create, update and delete to Super Admins.
export const Tenants: CollectionConfig = {
  slug: "tenants",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "slug", "domain", "defaultLocale"],
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
    },
    {
      name: "domain",
      type: "text",
      required: true,
      unique: true,
    },
    {
      name: "defaultLocale",
      type: "select",
      required: true,
      options: [...localization.locales],
      defaultValue: localization.defaultLocale,
    },
  ],
};
