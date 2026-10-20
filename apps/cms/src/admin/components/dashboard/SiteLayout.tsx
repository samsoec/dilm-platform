import Link from "next/link";
import type { WidgetServerProps } from "payload";
import { formatAdminURL } from "payload/shared";
import { Suspense } from "react";

import { dashboardScope, englishOnly, layoutDocs } from "../../data/dashboard";
import {
  type CompletenessInput,
  settingsCompleteness,
} from "../../data/completeness";
import type { IconName } from "../../icons";
import { MaterialIcon } from "../MaterialIcon";
import { Frame } from "./Frame";
import { footerSummary, headerSummary, savedLine } from "./model";
import { WidgetError, WidgetLoading } from "./WidgetStates";

const TITLE = "Site layout";

type Card = {
  key: string;
  icon: IconName;
  title: string;
  summary: string;
  meta?: string;
  badge?: { text: string; warn?: boolean };
  href: string;
  action: string;
};

export function SiteLayoutWidget(props: WidgetServerProps) {
  return (
    <Suspense fallback={<WidgetLoading title={TITLE} />}>
      <SiteLayout {...props} />
    </Suspense>
  );
}

function relationID(value: unknown): number | undefined {
  if (typeof value === "number") return value;
  if (value && typeof value === "object" && "id" in value)
    return (value as { id: number }).id;
  return undefined;
}

async function SiteLayout({
  cookies,
  permissions,
  req,
  user,
}: WidgetServerProps) {
  const { payload } = req;
  if (!user) return null;
  const admin = payload.config.routes.admin;
  try {
    const scope = await dashboardScope(payload, user, cookies);
    if (!scope)
      return (
        <Frame title={TITLE}>
          <p className="dil-widget__note">Pick a company in the sidebar.</p>
        </Frame>
      );
    const { header, footer, settings } = await layoutDocs(
      payload,
      user,
      scope.tenant,
    );
    const versions = (
      collection: "header" | "footer" | "tenant-settings",
      id?: number,
    ) =>
      id === undefined
        ? Promise.resolve(0)
        : payload
            .countVersions({
              collection,
              where: { parent: { equals: id } },
              overrideAccess: false,
              user,
            })
            .then(({ totalDocs }) => totalDocs);
    const [headerVersions, footerVersions, settingsVersions] =
      await Promise.all([
        versions("header", header?.id),
        versions("footer", footer?.id),
        versions("tenant-settings", settings?.id),
      ]);
    const authorIds = [header, footer]
      .map((doc) => relationID(doc?.updatedBy))
      .filter((id): id is number => id !== undefined);
    const { docs: authors } =
      authorIds.length === 0
        ? { docs: [] }
        : await payload.find({
            collection: "users",
            where: { id: { in: authorIds } },
            select: { name: true },
            pagination: false,
            depth: 0,
            overrideAccess: false,
            user,
          });
    const authorName = (doc?: Record<string, unknown>) =>
      authors.find(({ id }) => id === relationID(doc?.updatedBy))?.name ??
      undefined;
    const now = new Date();
    const edit = (collection: string) =>
      Boolean(permissions?.collections?.[collection]?.update);
    const href = (slug: string, id?: number) =>
      formatAdminURL({
        adminRoute: admin,
        path:
          id === undefined
            ? `/collections/${slug}`
            : `/collections/${slug}/${id}`,
      });
    const missing = settingsCompleteness(
      englishOnly(settings) as CompletenessInput,
    ).reduce((sum, { missing: gaps }) => sum + gaps.length, 0);
    const cards: Card[] = [
      {
        key: "header",
        icon: "web_asset",
        title: "Header",
        summary: header
          ? headerSummary(englishOnly(header) as never)
          : "Not set up yet",
        meta: header
          ? savedLine(header.updatedAt, authorName(header), now)
          : undefined,
        badge: headerVersions ? { text: `v${headerVersions}` } : undefined,
        href: href("header", header?.id),
        action: edit("header") ? "Edit header" : "View header",
      },
      {
        key: "footer",
        icon: "call_to_action",
        title: "Footer",
        summary: footer
          ? footerSummary(englishOnly(footer) as never)
          : "Not set up yet",
        meta: footer
          ? savedLine(footer.updatedAt, authorName(footer), now)
          : undefined,
        badge: footerVersions ? { text: `v${footerVersions}` } : undefined,
        href: href("footer", footer?.id),
        action: edit("footer") ? "Edit footer" : "View footer",
      },
      {
        key: "settings",
        icon: "tune",
        title: "Company settings",
        summary: "Brand, contacts, SEO, GA4",
        meta: "Logos used by header & footer",
        badge:
          missing > 0
            ? { text: `${missing} missing`, warn: true }
            : settingsVersions
              ? { text: `v${settingsVersions}` }
              : undefined,
        href: href("tenant-settings", settings?.id),
        action: edit("tenant-settings") ? "Edit settings" : "View settings",
      },
    ];
    return (
      <Frame aside="Shown on every page" title={TITLE}>
        <ul className="dil-layout-cards">
          {cards.map((card) => (
            <li className="dil-layout-card" key={card.key}>
              <span className="dil-layout-card__top">
                <MaterialIcon name={card.icon} />
                {card.badge && (
                  <span
                    className={`dil-layout-card__badge${card.badge.warn ? " dil-layout-card__badge--warn" : ""}`}
                  >
                    {card.badge.text}
                  </span>
                )}
              </span>
              <b>{card.title}</b>
              <span className="dil-layout-card__summary">{card.summary}</span>
              {card.meta && (
                <span className="dil-layout-card__meta">{card.meta}</span>
              )}
              <Link
                className="dil-layout-card__link"
                href={card.href}
                prefetch={false}
              >
                {card.action} →
              </Link>
            </li>
          ))}
        </ul>
      </Frame>
    );
  } catch (error) {
    payload.logger.error({ err: error, msg: "dashboard: site layout failed" });
    return <WidgetError title={TITLE} what="the site layout" />;
  }
}
