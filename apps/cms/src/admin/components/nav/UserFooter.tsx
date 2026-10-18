"use client";

import {
  Link,
  type Theme,
  useConfig,
  useTheme,
  useTranslation,
} from "@payloadcms/ui";
import { formatAdminURL } from "payload/shared";
import { type KeyboardEvent, useEffect, useId, useRef, useState } from "react";

import type { IconName } from "../../icons";

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

type ThemeChoice = "light" | "dark" | "auto";

const THEMES: { value: ThemeChoice; icon: IconName; label: string }[] = [
  { value: "light", icon: "light_mode", label: "Light theme" },
  { value: "dark", icon: "dark_mode", label: "Dark theme" },
  { value: "auto", icon: "computer", label: "Follow system theme" },
];

const LANGUAGES = [
  { value: "en", label: "EN", name: "English" },
  { value: "id", label: "ID", name: "Bahasa Indonesia" },
] as const;

export function UserFooter({
  user,
  accountHref,
  logoutHref,
}: {
  user: FooterUser;
  accountHref: string;
  logoutHref: string;
}) {
  const { autoMode, theme, setTheme } = useTheme();
  const { i18n, switchLanguage } = useTranslation();
  const companies = useCompanySlugs(!user.allTenants);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const scope = user.allTenants ? "all companies" : companies?.join(", ");
  const roleLine = [user.role, scope].filter(Boolean).join(" · ");
  const currentTheme: ThemeChoice = autoMode ? "auto" : theme;

  useEffect(() => {
    if (!open) return;
    menuRef.current?.querySelector<HTMLElement>("a, button")?.focus();
    const closeOnOutside = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", closeOnOutside);
    return () => document.removeEventListener("mousedown", closeOnOutside);
  }, [open]);

  const close = () => {
    setOpen(false);
    buttonRef.current?.focus();
  };

  const onMenuKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      close();
      return;
    }
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    event.preventDefault();
    const items = Array.from(
      menuRef.current?.querySelectorAll<HTMLElement>("a, button") ?? [],
    );
    const index = items.indexOf(document.activeElement as HTMLElement);
    const step = event.key === "ArrowDown" ? 1 : -1;
    items[(index + step + items.length) % items.length]?.focus();
  };

  return (
    <div className="dil-nav__user" ref={rootRef}>
      {open && (
        <div
          aria-label="Account"
          className="dil-user-menu"
          id={menuId}
          onKeyDown={onMenuKeyDown}
          ref={menuRef}
          role="menu"
        >
          <div className="dil-user-menu__who">
            <b>{user.name || user.email}</b>
            {user.name && user.email && <span>{user.email}</span>}
          </div>
          <div className="dil-user-menu__divider" role="separator" />
          <Link
            className="dil-user-menu__item"
            href={accountHref}
            onClick={() => setOpen(false)}
            prefetch={false}
            role="menuitem"
          >
            <MaterialIcon name="person" />
            My account
          </Link>
          <div
            className="dil-user-menu__row"
            role="group"
            aria-label="Interface language"
          >
            <MaterialIcon name="language" />
            <span className="dil-user-menu__label">Interface</span>
            <span className="dil-user-menu__choices">
              {LANGUAGES.map((language) => (
                <button
                  aria-label={language.name}
                  aria-pressed={i18n.language === language.value}
                  className="dil-user-menu__choice"
                  key={language.value}
                  lang={language.value}
                  onClick={() => void switchLanguage?.(language.value)}
                  role="menuitemradio"
                  aria-checked={i18n.language === language.value}
                  type="button"
                >
                  {language.label}
                </button>
              ))}
            </span>
          </div>
          <div className="dil-user-menu__row" role="group" aria-label="Theme">
            <MaterialIcon name="contrast" />
            <span className="dil-user-menu__label">Theme</span>
            <span className="dil-user-menu__choices">
              {THEMES.map((choice) => (
                <button
                  aria-checked={currentTheme === choice.value}
                  aria-label={choice.label}
                  className="dil-user-menu__choice dil-user-menu__choice--icon"
                  key={choice.value}
                  onClick={() => setTheme(choice.value as Theme)}
                  role="menuitemradio"
                  title={choice.label}
                  type="button"
                >
                  <MaterialIcon name={choice.icon} />
                </button>
              ))}
            </span>
          </div>
          <div className="dil-user-menu__divider" role="separator" />
          <Link
            className="dil-user-menu__item"
            href={logoutHref}
            prefetch={false}
            role="menuitem"
          >
            <MaterialIcon name="logout" />
            Sign out
          </Link>
        </div>
      )}
      <button
        aria-controls={open ? menuId : undefined}
        aria-expanded={open}
        aria-haspopup="menu"
        className="dil-nav__account"
        onClick={() => (open ? close() : setOpen(true))}
        ref={buttonRef}
        type="button"
      >
        <span aria-hidden="true" className="dil-avatar">
          {initials(user)}
        </span>
        <span className="dil-nav__user-text">
          <span className="dil-nav__user-name">{user.name || user.email}</span>
          {roleLine && <span className="dil-nav__user-role">{roleLine}</span>}
        </span>
        <MaterialIcon
          className="dil-nav__user-chevron"
          name={open ? "expand_more" : "expand_less"}
        />
      </button>
    </div>
  );
}
