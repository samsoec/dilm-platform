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

type Source = { label: string; detail: string; ok: boolean };

function filled(value: unknown): boolean {
  return typeof value === "string" ? value.trim() !== "" : value != null;
}

function headerSources(sources: LayoutSources | undefined): Source[] {
  const brand = sources?.brand;
  return [
    {
      label: "Logos",
      detail: "Company settings › Brand",
      ok: filled(brand?.logoOnDark) && filled(brand?.logoOnLight),
    },
  ];
}

function footerSources(sources: LayoutSources | undefined): Source[] {
  const brand = sources?.brand;
  const social = sources?.socialLinks?.length ?? 0;
  return [
    { label: "Logo", detail: "Brand", ok: filled(brand?.logoOnDark) },
    { label: "Address", detail: "Brand", ok: filled(brand?.address) },
    {
      label: "Email and phone",
      detail: "Contact",
      ok: filled(sources?.contactEmail) || filled(sources?.contactPhone),
    },
    {
      label: social === 1 ? "1 social link" : `${social} social links`,
      detail: "Social",
      ok: social > 0,
    },
    {
      label: "Legal name for {legalName}",
      detail: "Brand",
      ok: filled(brand?.legalName),
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
  const settingsHref = sources
    ? formatAdminURL({
        adminRoute: payload.config.routes.admin,
        path: `/collections/tenant-settings/${sources.id}`,
      })
    : undefined;

  return (
    <section className="dil-side-panel">
      <h3 className="dil-side-panel__title">
        {footer ? "Also in the footer" : "Comes from elsewhere"}
      </h3>
      <ul className="dil-side-panel__list">
        {items.map(({ label, detail, ok }) => (
          <li
            className={`dil-side-panel__item dil-tone--${ok ? "ok" : "warn"}`}
            key={label}
          >
            <MaterialIcon name={STATE_ICON[ok ? "ok" : "missing"]} />
            <span>
              {label}
              <span className="dil-side-panel__detail">
                {ok ? detail : `Missing · ${detail}`}
              </span>
            </span>
          </li>
        ))}
      </ul>
      {settingsHref && (
        <Link
          className="dil-side-panel__link"
          href={settingsHref}
          prefetch={false}
        >
          Open company settings
          <MaterialIcon name="chevron_right" />
        </Link>
      )}
    </section>
  );
}
