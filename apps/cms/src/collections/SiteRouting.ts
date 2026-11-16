import type { GlobalConfig } from "payload";

import { superAdmins, tenantMembers } from "../access";
import { routingNote } from "../admin/components/routing/fieldConfig";
import { navGroup } from "../admin/navGroups";
import { revalidateRoutingMoves } from "../publishRevalidation";
import { stubRevalidator } from "../revalidation";
import {
  cascadeSiteRouting,
  checkSiteRouting,
  publishedSharedPages,
} from "../siteRouting";

const ROUTING_SAVE_BUTTON =
  "/admin/components/routing/RoutingSaveButton#RoutingSaveButton";
const ROUTING_HEADER =
  "/admin/components/routing/SiteRoutingHeader#SiteRoutingHeader";

export const SiteRouting: GlobalConfig = {
  slug: "site-routing",
  label: { en: "Site routing", id: "Rute situs" },
  access: { read: tenantMembers, update: superAdmins },
  admin: {
    group: navGroup("settings"),
    components: {
      elements: { SaveButton: ROUTING_SAVE_BUTTON },
    },
  },
  custom: { nav: { icon: "route", order: 3 } },
  hooks: {
    beforeChange: [checkSiteRouting],
    afterChange: [cascadeSiteRouting, revalidateRoutingMoves(stubRevalidator)],
  },
  fields: [
    {
      name: "routingHeader",
      type: "ui",
      admin: { components: { Field: ROUTING_HEADER } },
    },
    {
      name: "productsPage",
      label: "Products live under",
      type: "relationship",
      relationTo: "shared-pages",
      filterOptions: publishedSharedPages,
      admin: {
        description:
          "Every product's URL is this page's URL plus the product's slug, on all companies' websites.",
      },
    },
    {
      name: "productsPageNote",
      type: "ui",
      admin: { components: { Field: routingNote("productsPage") } },
    },
    {
      name: "solutionsPage",
      label: "Solutions live under",
      type: "relationship",
      relationTo: "shared-pages",
      filterOptions: publishedSharedPages,
      admin: {
        description:
          "Every solution's URL is this page's URL plus the solution's slug, on all companies' websites.",
      },
    },
    {
      name: "solutionsPageNote",
      type: "ui",
      admin: { components: { Field: routingNote("solutionsPage") } },
    },
  ],
};
