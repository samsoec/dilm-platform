import type { GlobalConfig } from "payload";

import { superAdmins, tenantMembers } from "../access";
import { navGroup } from "../admin/navGroups";
import {
  cascadeSiteRouting,
  checkSiteRouting,
  publishedSharedPages,
} from "../siteRouting";

export const SiteRouting: GlobalConfig = {
  slug: "site-routing",
  label: { en: "Site routing", id: "Rute situs" },
  access: { read: tenantMembers, update: superAdmins },
  admin: { group: navGroup("settings") },
  custom: { nav: { icon: "link", order: 2 } },
  hooks: {
    beforeChange: [checkSiteRouting],
    afterChange: [cascadeSiteRouting],
  },
  fields: [
    {
      name: "productsPage",
      label: "Our Products page",
      type: "relationship",
      relationTo: "shared-pages",
      filterOptions: publishedSharedPages,
      admin: {
        description:
          "Every product's URL is this page's URL plus the product's slug, on all companies' websites.",
      },
    },
    {
      name: "solutionsPage",
      label: "Our Solutions page",
      type: "relationship",
      relationTo: "shared-pages",
      filterOptions: publishedSharedPages,
      admin: {
        description:
          "Every solution's URL is this page's URL plus the solution's slug, on all companies' websites.",
      },
    },
  ],
};
