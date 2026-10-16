import type { Condition, TextFieldSingleValidation } from "payload";

import { superAdmins } from "../access";
import { navGroup } from "../admin/navGroups";
import {
  countedArray,
  localeBanner,
  ROW_LABELS,
  sourcedFrom,
  versionInfo,
  withSameAsEnTag,
} from "../fields/layoutEditor";
import { link } from "../fields/link";
import { keepRowStructure, lockStructure } from "../fields/structure";
import { withUpdatedBy } from "../fields/updatedBy";
import { withTenantAccess } from "../tenancy";

export const NAV_ITEM_TYPES = ["link", "dropdown"] as const;

type NavItemType = (typeof NAV_ITEM_TYPES)[number];

export const NAV_ITEM_TYPE_LABELS: Record<NavItemType, string> = {
  link: "Single link",
  dropdown: "Dropdown",
};

export const MAX_NAV_ITEMS = 8;

export const MAX_DROPDOWN_LINKS = 6;

const isNavItem =
  (type: NavItemType): Condition =>
  (_, siblingData) =>
    ((siblingData as { type?: NavItemType } | undefined)?.type ?? "link") ===
    type;

const ctaEnabled: Condition = (_, siblingData) =>
  Boolean((siblingData as { enabled?: boolean } | undefined)?.enabled);

const requireDropdownLabel: TextFieldSingleValidation = (value) =>
  value ? true : "Add the dropdown's label.";

export const Header = withTenantAccess(
  withUpdatedBy({
    slug: "header",
    admin: { group: navGroup("layout") },
    custom: { nav: { icon: "web_asset", order: 1 } },
    access: {
      delete: superAdmins,
    },
    versions: {
      drafts: false,
    },
    hooks: {
      beforeChange: [keepRowStructure],
    },
    fields: [
      localeBanner,
      versionInfo,
      sourcedFrom,
      ...lockStructure([
        countedArray({
          name: "navItems",
          label: "Menu items",
          labels: { singular: "Menu item", plural: "Menu items" },
          type: "array",
          maxRows: MAX_NAV_ITEMS,
          admin: {
            initCollapsed: true,
            components: { RowLabel: ROW_LABELS.navItem },
          },
          fields: [
            {
              name: "type",
              type: "radio",
              required: true,
              defaultValue: "link",
              options: NAV_ITEM_TYPES.map((value) => ({
                value,
                label: NAV_ITEM_TYPE_LABELS[value],
              })),
              admin: { layout: "horizontal" },
            },
            {
              ...link({ required: true }),
              admin: { condition: isNavItem("link") },
            },
            withSameAsEnTag({
              name: "label",
              type: "text",
              localized: true,
              validate: requireDropdownLabel,
              admin: { condition: isNavItem("dropdown") },
            }),
            countedArray({
              name: "children",
              label: "Dropdown links",
              labels: { singular: "Dropdown link", plural: "Dropdown links" },
              type: "array",
              minRows: 1,
              maxRows: MAX_DROPDOWN_LINKS,
              required: true,
              admin: {
                condition: isNavItem("dropdown"),
                components: { RowLabel: ROW_LABELS.link },
              },
              fields: [link({ required: true })],
            }),
          ],
        }),
        {
          name: "showSearch",
          label: "Show search",
          type: "checkbox",
          defaultValue: false,
          admin: { position: "sidebar" },
        },
        {
          name: "showLanguageSwitcher",
          label: "Show language switcher",
          type: "checkbox",
          defaultValue: true,
          admin: { position: "sidebar" },
        },
        {
          name: "cta",
          label: "Call-to-action button",
          type: "group",
          admin: { position: "sidebar" },
          fields: [
            {
              name: "enabled",
              label: "Show the button",
              type: "checkbox",
              defaultValue: false,
            },
            {
              ...link({ required: true }),
              admin: { condition: ctaEnabled },
            },
          ],
        },
      ]),
    ],
  }),
  { isGlobal: true },
);
