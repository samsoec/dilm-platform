"use client";

import { Link, Logout, useConfig, useTheme } from "@payloadcms/ui";
import { formatAdminURL } from "payload/shared";
import { useEffect, useState } from "react";

import { initials } from "../../initials";
import { MaterialIcon } from "../MaterialIcon";

export type FooterUser = {
  name?: string;
  email?: string;
  role?: string;
  allTenants: boolean;
};

function useCompanySlugs(enabled: boolean): string[] | undefined {
  const {
    config: { routes, serverURL },
  } = useConfig();
  const [slugs, setSlugs] = useState<string[]>();

  useEffect(() => {
    if (!enabled) return;
    const request = new AbortController();
    const url = formatAdminURL({
      apiRoute: routes.api,
      serverURL,
      path: "/tenants?depth=0&limit=100&sort=name&select[slug]=true",
    });
    fetch(url, { credentials: "include", signal: request.signal })
      .then((response) => (response.ok ? response.json() : undefined))
      .then((body: { docs?: { slug: string }[] } | undefined) =>
        setSlugs(body?.docs?.map(({ slug }) => slug)),
      )
      .catch(() => undefined);
    return () => request.abort();
  }, [enabled, routes.api, serverURL]);

  return slugs;
}

export function UserFooter({
  user,
  accountHref,
}: {
  user: FooterUser;
  accountHref: string;
}) {
  const { theme, setTheme } = useTheme();
  const companies = useCompanySlugs(!user.allTenants);
  const next = theme === "dark" ? "light" : "dark";
  const scope = user.allTenants ? "all companies" : companies?.join(", ");
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
