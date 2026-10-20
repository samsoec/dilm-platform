import Link from "next/link";
import type { WidgetServerProps } from "payload";
import { formatAdminURL } from "payload/shared";
import { Suspense } from "react";

import { dashboardScope, englishOnly, layoutDocs } from "../../data/dashboard";
import {
  type CompletenessInput,
  settingsCompleteness,
} from "../../data/completeness";
import { MaterialIcon } from "../MaterialIcon";
import { Frame } from "./Frame";
import { attentionItems, countTranslations } from "./model";
import { WidgetError, WidgetLoading } from "./WidgetStates";

const TITLE = "Needs attention";

export function NeedsAttentionWidget(props: WidgetServerProps) {
  return (
    <Suspense fallback={<WidgetLoading title={TITLE} />}>
      <NeedsAttention {...props} />
    </Suspense>
  );
}

async function NeedsAttention({
  cookies,
  permissions,
  req,
  user,
}: WidgetServerProps) {
  const { payload } = req;
  if (!user) return null;
  const admin = payload.config.routes.admin;
  const url = (path: `/${string}`) =>
    formatAdminURL({ adminRoute: admin, path });
  try {
    const scope = await dashboardScope(payload, user, cookies);
    if (!scope)
      return (
        <Frame title={TITLE}>
          <p className="dil-widget__note">
            Pick a company in the sidebar to see what needs attention.
          </p>
        </Frame>
      );
    const inTenant = { tenant: { equals: scope.tenant } };
    const [docs, received, failed] = await Promise.all([
      layoutDocs(payload, user, scope.tenant),
      payload.find({
        collection: "cv-submissions",
        where: { and: [inTenant, { status: { equals: "received" } }] },
        sort: "submittedAt",
        limit: 1,
        depth: 0,
        select: { submittedAt: true },
        overrideAccess: false,
        user,
      }),
      payload.find({
        collection: "cv-submissions",
        where: {
          and: [inTenant, { externalSyncStatus: { equals: "failed" } }],
        },
        sort: "-externalSyncAttempts",
        limit: 1,
        depth: 0,
        select: { externalSyncAttempts: true },
        overrideAccess: false,
        user,
      }),
    ]);
    const statuses = settingsCompleteness(
      englishOnly(docs.settings) as CompletenessInput,
    );
    const recruiterEmailMissing = statuses.some(
      ({ section, complete }) => section === "careers" && !complete,
    );
    const otherLaunchGaps = statuses
      .filter(
        ({ section, severity }) =>
          severity === "error" && section !== "careers",
      )
      .reduce((sum, { missing }) => sum + missing.length, 0);
    const untranslated = (
      [
        ["Header", "header", docs.header],
        ["Footer", "footer", docs.footer],
      ] as const
    ).flatMap(([label, slug, doc]) => {
      if (!doc) return [];
      const { translated, total } = countTranslations(
        payload.collections[slug].config.fields,
        doc,
      );
      return [
        {
          label,
          count: total - translated,
          href: url(`/collections/${slug}/${doc.id}?locale=id`),
        },
      ];
    });
    const items = attentionItems(
      {
        canEdit: Boolean(permissions?.collections?.["cv-submissions"]?.update),
        recruiterEmailMissing,
        otherLaunchGaps,
        settingsHref: docs.settings
          ? url(`/collections/tenant-settings/${docs.settings.id}`)
          : undefined,
        received: {
          count: received.totalDocs,
          oldest: received.docs[0]?.submittedAt,
        },
        syncFailed: {
          count: failed.totalDocs,
          attempts: failed.docs[0]?.externalSyncAttempts,
        },
        untranslated,
        links: {
          received: url(
            "/collections/cv-submissions?where[status][equals]=received",
          ),
          syncFailed: url(
            "/collections/cv-submissions?where[externalSyncStatus][in][0]=failed",
          ),
        },
      },
      new Date(),
    );
    return (
      <Frame
        aside={`${items.length} ${items.length === 1 ? "item" : "items"}`}
        title={TITLE}
      >
        {items.length === 0 ? (
          <div className="dil-widget__state">
            <MaterialIcon
              className="dil-widget__state-icon dil-widget__state-icon--ok"
              name="check_circle"
            />
            <b>All clear</b>
            <span>Nothing needs you on {scope.domain} right now.</span>
          </div>
        ) : (
          <ul className="dil-attention">
            {items.map((item) => (
              <li className="dil-attention__item" key={item.key}>
                <span
                  className={`dil-attention__icon dil-attention__icon--${item.tone}`}
                >
                  <MaterialIcon name={item.icon} />
                </span>
                <span className="dil-attention__text">
                  <b>{item.title}</b>
                  <span>{item.body}</span>
                </span>
                <Link
                  className={`dil-attention__action${item.primary ? " dil-attention__action--primary" : ""}`}
                  href={item.href}
                  prefetch={false}
                >
                  {item.action === "View" && <MaterialIcon name="visibility" />}
                  {item.action}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Frame>
    );
  } catch (error) {
    payload.logger.error({
      err: error,
      msg: "dashboard: needs attention failed",
    });
    return <WidgetError title={TITLE} what="what needs attention" />;
  }
}
