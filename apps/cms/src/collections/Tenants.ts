import type { CollectionConfig } from "payload";

import {
  superAdmins,
  systemCriticalFieldAccess,
  tenantMembers,
} from "../access";
import {
  normalizeBrandColorHook,
  validateBrandColor,
} from "../admin/brandColor";
import { navGroup } from "../admin/navGroups";
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
    group: navGroup("admin"),
    useAsTitle: "name",
    defaultColumns: ["name", "slug", "domain", "defaultLocale"],
  },
  custom: {
    nav: { icon: "domain", order: 2 },
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
      name: "brandColor",
      label: "Brand colour",
      type: "text",
      access: systemCriticalFieldAccess,
      validate: validateBrandColor,
      hooks: { beforeValidate: [normalizeBrandColorHook] },
      admin: {
        placeholder: "#1e3a8a",
        description:
          "Hex colour behind the tenant card in the admin sidebar. White text must reach 4.5:1 on it.",
      },
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
