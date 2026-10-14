"use client";

import { useTenantSelection } from "@payloadcms/plugin-multi-tenant/client";
import { Link, Logout, useTheme } from "@payloadcms/ui";

import { initials } from "../../initials";
import { MaterialIcon } from "../MaterialIcon";

export type FooterUser = {
  name?: string;
  email?: string;
  role?: string;
  allTenants: boolean;
};

export function UserFooter({
  user,
  accountHref,
}: {
  user: FooterUser;
  accountHref: string;
}) {
  const { theme, setTheme } = useTheme();
  const { options } = useTenantSelection();
  const next = theme === "dark" ? "light" : "dark";
  const scope = user.allTenants
    ? "all tenants"
    : options.map(({ label }) => String(label)).join(", ");
  const roleLine = [user.role, scope].filter(Boolean).join(" · ");

  return (
    <div className="dil-nav__user">
      <Link className="dil-nav__account" href={accountHref} prefetch={false}>
        <span aria-hidden="true" className="dil-avatar">
          {initials(user)}
        </span>
        <span className="dil-nav__user-text">
          <span className="dil-nav__user-name">{user.name || user.email}</span>
          {roleLine && <span className="dil-nav__user-role">{roleLine}</span>}
        </span>
      </Link>
      <button
        aria-label={`Switch to ${next} theme`}
        className="dil-nav__icon-button"
        onClick={() => setTheme(next)}
        title={`Switch to ${next} theme`}
        type="button"
      >
        <MaterialIcon name="contrast" />
      </button>
      <Logout />
    </div>
  );
}
