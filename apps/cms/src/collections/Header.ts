import type { Condition, TextFieldSingleValidation } from "payload";

import { superAdmins } from "../access";
import { link } from "../fields/link";
import { withTenantAccess } from "../tenancy";

export const NAV_ITEM_TYPES = ["link", "dropdown"] as const;

export const MAX_NAV_ITEMS = 8;

export const MAX_DROPDOWN_LINKS = 6;

type NavItemType = (typeof NAV_ITEM_TYPES)[number];

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
  {
    slug: "header",
    access: {
      delete: superAdmins,
    },
    versions: {
      drafts: false,
    },
    fields: [
      {
        name: "navItems",
        label: "Menu items",
        type: "array",
        maxRows: MAX_NAV_ITEMS,
        admin: {
          initCollapsed: true,
        },
        fields: [
          {
            name: "type",
            type: "radio",
            required: true,
            defaultValue: "link",
            options: [...NAV_ITEM_TYPES],
            admin: { layout: "horizontal" },
          },
          {
            ...link({ required: true }),
            admin: { condition: isNavItem("link") },
          },
          {
            name: "label",
            type: "text",
            localized: true,
            validate: requireDropdownLabel,
            admin: { condition: isNavItem("dropdown") },
          },
          {
            name: "children",
            label: "Dropdown links",
            type: "array",
            minRows: 1,
            maxRows: MAX_DROPDOWN_LINKS,
            required: true,
            admin: { condition: isNavItem("dropdown") },
            fields: [link({ required: true })],
          },
        ],
      },
      {
        type: "row",
        fields: [
          {
            name: "showSearch",
            label: "Show search",
            type: "checkbox",
            defaultValue: false,
          },
          {
            name: "showLanguageSwitcher",
            label: "Show language switcher",
            type: "checkbox",
            defaultValue: true,
          },
        ],
      },
      {
        name: "cta",
        label: "Call-to-action button",
        type: "group",
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
    ],
  },
  { isGlobal: true },
);
