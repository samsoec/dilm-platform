import Link from "next/link";
import type { UIFieldServerProps } from "payload";
import { formatAdminURL } from "payload/shared";

import {
  documentTenant,
  type LayoutSources,
  loadLayoutSources,
} from "../../data/layout";
import type { IconName } from "../../icons";
import { MaterialIcon } from "../MaterialIcon";

type Tab = "brand" | "contact" | "social";

type Source = { label: string; tab: Tab; ok: boolean };

const TAB_NAMES: Record<Tab, string> = {
  brand: "Brand",
  contact: "Contact",
  social: "Social",
};

function filled(value: unknown): boolean {
  return typeof value === "string" ? value.trim() !== "" : value != null;
}

function headerSources(sources: LayoutSources | undefined): Source[] {
  const brand = sources?.brand;
  return [
    {
      label: "Logo for light backgrounds",
      tab: "brand",
      ok: filled(brand?.logoOnLight),
    },
    {
      label: "Logo for dark backgrounds",
      tab: "brand",
      ok: filled(brand?.logoOnDark),
    },
  ];
}

function footerSources(sources: LayoutSources | undefined): Source[] {
  const brand = sources?.brand;
  const social = sources?.socialLinks?.length ?? 0;
  return [
    { label: "Logo", tab: "brand", ok: filled(brand?.logoOnDark) },
    { label: "Tagline", tab: "brand", ok: filled(brand?.tagline) },
    { label: "Phone", tab: "contact", ok: filled(sources?.contactPhone) },
    { label: "Email", tab: "contact", ok: filled(sources?.contactEmail) },
    { label: "Address", tab: "brand", ok: filled(brand?.address) },
    {
      label: social > 0 ? `Social links · ${social}` : "Social links",
      tab: "social",
      ok: social > 0,
    },
  ];
}

const STATE_ICON: Record<"ok" | "missing", IconName> = {
  ok: "check_circle",
  missing: "warning",
};

export async function SourcedFromPanel({
  collectionSlug,
  data,
  payload,
  req,
}: UIFieldServerProps) {
  const sources = await loadLayoutSources(
    payload,
    req.user,
    documentTenant(data),
  );
  const footer = collectionSlug === "footer";
  const items = footer ? footerSources(sources) : headerSources(sources);
  const settingsHref = (tab: Tab) =>
    sources
      ? formatAdminURL({
          adminRoute: payload.config.routes.admin,
          path: `/collections/tenant-settings/${sources.id}?tab=${tab}`,
        })
      : undefined;

  return (
    <section className="dil-side-panel">
      <h3 className="dil-side-panel__title">
        {footer ? "Comes from Company settings" : "Comes from elsewhere"}
      </h3>
      <ul className="dil-side-panel__list">
        {items.map(({ label, tab, ok }) => {
          const href = settingsHref(tab);
          return (
            <li
              className={`dil-side-panel__item dil-side-panel__item--linked dil-tone--${ok ? "ok" : "warn"}`}
              key={label}
            >
              <MaterialIcon name={STATE_ICON[ok ? "ok" : "missing"]} />
              <span className={ok ? undefined : "dil-side-panel__missing"}>
                {label}
                {!ok && " · missing"}
              </span>
              {href && (
                <Link
                  className="dil-side-panel__item-link"
                  href={href}
                  prefetch={false}
                >
                  {ok ? TAB_NAMES[tab] : "Add"} →
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
