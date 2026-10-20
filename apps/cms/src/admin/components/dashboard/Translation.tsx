import Link from "next/link";
import type { WidgetServerProps } from "payload";
import { formatAdminURL } from "payload/shared";
import { Suspense } from "react";

import { dashboardScope, layoutDocs } from "../../data/dashboard";
import { MaterialIcon } from "../MaterialIcon";
import { Frame } from "./Frame";
import { countTranslations, percent } from "./model";
import { WidgetError, WidgetLoading } from "./WidgetStates";

const TITLE = "Indonesian translation";

const SOURCES = [
  { label: "Header", slug: "header", key: "header" },
  { label: "Footer", slug: "footer", key: "footer" },
  { label: "Company settings", slug: "tenant-settings", key: "settings" },
] as const;

export function TranslationWidget(props: WidgetServerProps) {
  return (
    <Suspense fallback={<WidgetLoading title={TITLE} />}>
      <Translation {...props} />
    </Suspense>
  );
}

async function Translation({ cookies, req, user }: WidgetServerProps) {
  const { payload } = req;
  if (!user) return null;
  try {
    const scope = await dashboardScope(payload, user, cookies);
    if (!scope)
      return (
        <Frame title={TITLE}>
          <p className="dil-widget__note">Pick a company in the sidebar.</p>
        </Frame>
      );
    const docs = await layoutDocs(payload, user, scope.tenant);
    const rows = SOURCES.flatMap(({ label, slug, key }) => {
      const doc = docs[key];
      if (!doc) return [];
      return [
        {
          label,
          href: formatAdminURL({
            adminRoute: payload.config.routes.admin,
            path: `/collections/${slug}/${doc.id}?locale=id`,
          }),
          ...countTranslations(payload.collections[slug].config.fields, doc),
        },
      ];
    });
    const total = rows.reduce(
      (sum, row) => ({
        translated: sum.translated + row.translated,
        total: sum.total + row.total,
      }),
      { translated: 0, total: 0 },
    );
    const done = percent(total);
    const complete = total.translated === total.total;
    return (
      <Frame aside="English is the source" title={TITLE}>
        <div className="dil-translation__headline">
          <span className="dil-translation__percent">{done}%</span>
          {complete && (
            <span className="dil-status-chip dil-status-chip--ok">
              <MaterialIcon name="check" />
              Ready for launch
            </span>
          )}
          <span className="dil-translation__count">
            {complete
              ? `${total.translated} of ${total.total} labels`
              : `${total.translated} of ${total.total} labels translated`}
          </span>
        </div>
        <ul className="dil-translation__rows">
          {rows.map((row) => (
            <li key={row.label}>
              <Link
                className="dil-translation__row"
                href={row.href}
                prefetch={false}
              >
                <span className="dil-translation__label">
                  {row.label}
                  {complete && " →"}
                </span>
                <span className="dil-translation__ratio">
                  {row.translated} / {row.total}
                </span>
                {!complete && (
                  <span
                    aria-hidden
                    className="dil-translation__bar"
                    style={{ ["--fill" as string]: `${percent(row)}%` }}
                  />
                )}
              </Link>
            </li>
          ))}
        </ul>
        <p className="dil-widget__note">
          {complete
            ? "A label counts once its ID text exists and differs from EN. Rows open that editor in ID."
            : "Page content will be counted here once pages exist."}
        </p>
      </Frame>
    );
  } catch (error) {
    payload.logger.error({ err: error, msg: "dashboard: translation failed" });
    return <WidgetError title={TITLE} what="translation progress" />;
  }
}
