import { cookies } from "next/headers";
import Link from "next/link";
import type { BeforeListTableServerProps } from "payload";
import { formatAdminURL } from "payload/shared";

import type { RoleHolder } from "../../../access";
import { CV_STATUSES } from "../../../collections/CvSubmissions";
import {
  type CvStatusCounts,
  loadStatusCounts,
} from "../../data/cvSubmissions";
import { selectedTenantID, TENANT_COOKIE } from "../../data/sidebar";
import { STATUS_SETS } from "../kit/status";
import { activeStatus, type SearchParams, statusTabHref } from "./statusQuery";

export async function StatusTabs({
  collectionSlug,
  payload,
  searchParams,
  user,
}: BeforeListTableServerProps) {
  if (!user) return null;
  const tenant = selectedTenantID(
    user as RoleHolder,
    (await cookies()).get(TENANT_COOKIE)?.value,
  );
  const counts: CvStatusCounts | undefined =
    tenant === undefined
      ? undefined
      : await loadStatusCounts({ payload, user }, tenant);

  const params = (searchParams ?? {}) as SearchParams;
  const active = activeStatus(params);
  const pathname = formatAdminURL({
    adminRoute: payload.config.routes.admin,
    path: `/collections/${collectionSlug}`,
  });
  const tabs = [
    ...CV_STATUSES.map((status) => ({
      key: status,
      label: STATUS_SETS.application[status].label,
      count: counts?.[status],
    })),
    {
      key: undefined,
      label: "All",
      count: counts && Object.values(counts).reduce((sum, n) => sum + n, 0),
    },
  ];

  return (
    <nav aria-label="Filter by status" className="dil-status-tabs">
      {tabs.map(({ key, label, count }) => {
        const current = key === active;
        return (
          <Link
            aria-current={current ? "page" : undefined}
            className={`dil-status-tab${current ? " dil-status-tab--active" : ""}`}
            href={statusTabHref(pathname, params, key)}
            key={label}
            prefetch={false}
          >
            {label}
            {count !== undefined && (
              <span className="dil-status-tab__count">
                {count}
                <span className="dil-sr-only">
                  {count === 1 ? " application" : " applications"}
                </span>
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
