import type { CollectionConfig } from "payload";

import {
  superAdmins,
  systemCriticalFieldAccess,
  tenantMembers,
} from "../access";
import { localization } from "../localization";

export const Tenants: CollectionConfig = {
  slug: "tenants",
  access: {
    read: tenantMembers,
    create: superAdmins,
    update: superAdmins,
    delete: superAdmins,
  },
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
      access: systemCriticalFieldAccess,
    },
    {
      name: "domain",
      type: "text",
      required: true,
      unique: true,
      access: systemCriticalFieldAccess,
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
