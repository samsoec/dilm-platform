import { Gutter } from "@payloadcms/ui";
import { cookies } from "next/headers";
import Link from "next/link";
import type { AdminViewServerProps } from "payload";
import { formatAdminURL } from "payload/shared";

import { dashboardScope } from "../../data/dashboard";
import { translationRows } from "../../data/translationProgress";
import { TENANT_COOKIE } from "../../data/sidebar";
import {
  itemsHeading,
  SLUG_STATE_LABELS,
  sourceByKey,
  textsLeftText,
} from "../../translationProgress";

export async function UntranslatedView({
  initPageResult,
  params,
  payload,
}: AdminViewServerProps) {
  const user = initPageResult.req.user;
  if (!user) return null;
  const source = sourceByKey(params?.segments?.[1] ?? "");
  const adminRoute = payload.config.routes.admin;
  const jar = await cookies();
  const scope = await dashboardScope(
    payload,
    user,
    new Map([[TENANT_COOKIE, jar.get(TENANT_COOKIE)?.value ?? ""]]),
  );
  const back = (
    <Link
      className="dil-untranslated__back"
      href={formatAdminURL({ adminRoute, path: "" })}
    >
      Back to the dashboard
    </Link>
  );
  if (!source || !scope) {
    return (
      <Gutter>
        <p className="dil-widget__note">
          {source ? "Pick a company in the sidebar." : "Nothing to show here."}
        </p>
        {back}
      </Gutter>
    );
  }
  const rows = await translationRows(payload, user, scope.tenant);
  const row = rows.find(({ key }) => key === source.key);
  const items = row?.items ?? [];
  return (
    <Gutter>
      <div className="dil-untranslated">
        {back}
        <h1 className="dil-untranslated__title">
          {itemsHeading(source.label, items.length)}
        </h1>
        {items.length > 0 && (
          <ul className="dil-untranslated__list">
            {items.map((item) => (
              <li key={item.id}>
                <Link
                  className="dil-untranslated__item"
                  href={formatAdminURL({
                    adminRoute,
                    path: `/collections/${source.collection}/${item.id}?locale=id`,
                  })}
                  prefetch={false}
                >
                  <span className="dil-untranslated__name">{item.title}</span>
                  <span className="dil-untranslated__left">
                    {textsLeftText(item.left)}
                  </span>
                  {item.slug && item.slug !== "own" && (
                    <span className="dil-untranslated__slug">
                      {SLUG_STATE_LABELS[item.slug]}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Gutter>
  );
}
