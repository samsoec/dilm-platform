import type { CollectionConfig } from "payload";

import {
  nobody,
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
import { collectionLabels } from "../admin/labels";

const COMPONENTS = "/admin/components/companies";

export const Tenants: CollectionConfig = {
  slug: "tenants",
  labels: collectionLabels("tenants"),
  access: {
    read: tenantMembers,
    create: nobody,
    update: superAdmins,
    delete: nobody,
  },
  admin: {
    group: navGroup("admin"),
    useAsTitle: "name",
    description:
      "The three DIL Group sites run from this CMS. Companies are added by the platform setup script, so they can't be created or deleted here.",
    defaultColumns: ["name", "domain", "defaultLocale", "brandColor", "edit"],
    components: {
      Description: "/admin/components/lists/ListIntro#ListIntro",
      edit: {
        SaveButton: `${COMPONENTS}/CompanySaveButton#CompanySaveButton`,
      },
    },
  },
  custom: {
    nav: { icon: "domain", order: 2 },
  },
  fields: [
    {
      name: "name",
      label: "Company",
      type: "text",
      required: true,
      admin: {
        components: { Cell: `${COMPONENTS}/CompanyCells#CompanyCell` },
      },
    },
    {
      type: "row",
      fields: [
        {
          name: "slug",
          type: "text",
          required: true,
          unique: true,
          access: systemCriticalFieldAccess,
          admin: { width: "34%", className: "dil-company-field--mono" },
        },
        {
          name: "domain",
          type: "text",
          required: true,
          unique: true,
          access: systemCriticalFieldAccess,
          admin: {
            width: "66%",
            className: "dil-company-field--mono",
            components: { Cell: `${COMPONENTS}/CompanyCells#DomainCell` },
          },
        },
      ],
    },
    {
      name: "domainWarning",
      type: "ui",
      admin: {
        disableListColumn: true,
        components: { Field: `${COMPONENTS}/DomainWarning#DomainWarning` },
      },
    },
    {
      name: "defaultLocale",
      label: "Default lang.",
      type: "select",
      required: true,
      options: [...localization.locales],
      defaultValue: localization.defaultLocale,
      admin: {
        components: {
          Cell: `${COMPONENTS}/CompanyCells#LocaleCell`,
          Field: `${COMPONENTS}/LocaleField#LocaleField`,
        },
      },
    },
    {
      name: "brandColor",
      label: "Brand colour",
      type: "text",
      access: systemCriticalFieldAccess,
      validate: validateBrandColor,
      hooks: { beforeValidate: [normalizeBrandColorHook] },
      admin: {
        components: {
          Cell: `${COMPONENTS}/CompanyCells#ColorCell`,
          Field: `${COMPONENTS}/BrandColorField#BrandColorField`,
        },
      },
    },
    {
      name: "edit",
      label: " ",
      type: "ui",
      admin: {
        components: { Cell: `${COMPONENTS}/CompanyCells#EditCell` },
      },
    },
  ],
};
