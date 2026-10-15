"use client";

import { Link } from "@payloadcms/ui";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import type { SidebarData } from "../../data/sidebar";
import type { IconName } from "../../icons";
import { MaterialIcon } from "../MaterialIcon";
import { NavGroup } from "./NavGroup";
import {
  isActiveHref,
  isDashboard,
  type NavItem,
  type NavSection,
} from "./sections";

function NavLink({
  href,
  icon,
  label,
  active,
  children,
}: {
  href: string;
  icon: IconName;
  label: string;
  active: boolean;
  children?: ReactNode;
}) {
  return (
    <Link
      aria-current={active ? "page" : undefined}
      className={["dil-nav__item", active && "dil-nav__item--active"]
        .filter(Boolean)
        .join(" ")}
      href={href}
      prefetch={false}
    >
      <MaterialIcon className="dil-nav__item-icon" name={icon} />
      <span className="dil-nav__item-label">{label}</span>
      {children}
    </Link>
  );
}

function ItemStatus({
  item,
  count,
  attention,
}: {
  item: NavItem;
  count: number | undefined;
  attention: boolean;
}) {
  return (
    <>
      {count !== undefined && count > 0 && (
        <span className="dil-nav__badge">
          {count}
          <span className="dil-sr-only"> new</span>
        </span>
      )}
      {item.locked && (
        <span className="dil-nav__lock" title="Read only">
          <MaterialIcon name="lock" />
          <span className="dil-sr-only">Read only</span>
        </span>
      )}
      {attention && (
        <span className="dil-nav__dot" title="Needs attention">
          <span className="dil-sr-only">Needs attention</span>
        </span>
      )}
    </>
  );
}

export function NavLinks({
  sections,
  sidebar,
  attentionSlug,
  adminRoute,
}: {
  sections: NavSection[];
  sidebar: SidebarData;
  attentionSlug: string;
  adminRoute: string;
}) {
  const pathname = usePathname();

  return (
    <div className="dil-nav__links">
      <NavLink
        active={isDashboard(pathname, adminRoute)}
        href={adminRoute}
        icon="space_dashboard"
        label="Dashboard"
      />
      {sections.map((section) => (
        <NavGroup key={section.key} section={section}>
          {section.items.map((item) => (
            <NavLink
              active={isActiveHref(pathname, item.href)}
              href={item.href}
              icon={item.icon}
              key={item.slug}
              label={item.label}
            >
              <ItemStatus
                attention={sidebar.attention && item.slug === attentionSlug}
                count={item.badge ? sidebar.badges[item.badge] : undefined}
                item={item}
              />
            </NavLink>
          ))}
        </NavGroup>
      ))}
    </div>
  );
}
