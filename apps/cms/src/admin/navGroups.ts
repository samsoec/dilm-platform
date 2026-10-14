import type { IconName } from "./icons";

export type NavGroup = {
  key: string;
  label: string;
  icon: IconName;
  superAdminOnly?: boolean;
};

export type CollectionNav = {
  icon: IconName;
  order?: number;
  badge?: string;
};

export const NAV_GROUPS = [
  { key: "content", label: "Website content", icon: "article" },
  { key: "layout", label: "Layout", icon: "web_asset" },
  { key: "inbox", label: "Inbox", icon: "inbox" },
  { key: "investor", label: "Investor relations", icon: "account_balance" },
  { key: "media", label: "Media", icon: "photo_library" },
  { key: "settings", label: "Settings", icon: "tune" },
  {
    key: "admin",
    label: "Administration",
    icon: "shield",
    superAdminOnly: true,
  },
] as const satisfies readonly NavGroup[];

export type NavGroupKey = (typeof NAV_GROUPS)[number]["key"];

export const CONTENT_GROUP_HINT =
  "Pages, products and news appear here once the website build adds them.";

export function navGroup(key: NavGroupKey): string {
  return NAV_GROUPS.find((group) => group.key === key)!.label;
}

export function navGroupByLabel(label: unknown): NavGroup | undefined {
  return NAV_GROUPS.find((group) => group.label === label);
}
