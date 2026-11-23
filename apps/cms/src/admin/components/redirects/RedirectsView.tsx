import { Gutter } from "@payloadcms/ui";
import { ListStepNav } from "../topbar/ListStepNav";
import { cookies } from "next/headers";
import type { ListViewServerProps } from "payload";
import { formatAdminURL } from "payload/shared";
import { Suspense } from "react";

import { isSuperAdmin, type RoleHolder } from "../../../access";
import {
  loadRedirects,
  type RedirectRow,
  type RedirectsData,
} from "../../data/redirectsList";
import { selectedTenantID, TENANT_COOKIE } from "../../data/sidebar";
import { MaterialIcon } from "../MaterialIcon";
import { ActionButton } from "../kit/ActionButton";
import { Banner } from "../kit/Banner";
import { Skeleton } from "../kit/Loading";
import { ReachBadge } from "../kit/ReachBadge";
import { getReach } from "../kit/reach";
import { LocaleTag, Tag } from "../kit/Tag";
import type { SearchParams } from "../lists/statusQuery";
import { PagesRetry } from "../pages/PagesRetry";
import { AddRedirect, RedirectRowActions } from "./RedirectActions";
import {
  dayText,
  isLocked,
  KIND_LABELS,
  KIND_PARAM,
  LANG_PARAM,
  LANGUAGE_LABELS,
  liveMessage,
  LOCK_REASON,
  parseRedirectsQuery,
  redirectsText,
  REDIRECT_KINDS,
  REDIRECT_LANGUAGES,
  SEARCH_MAX_LENGTH,
  SEARCH_PARAM,
  type RedirectsQuery,
} from "./redirects";

type Viewer = { canCreate: boolean; canChange: boolean; superAdmin: boolean };

function Heading({
  intro,
  tenant,
  viewer,
}: {
  intro: string;
  tenant: number | string | undefined;
  viewer: Viewer;
}) {
  return (
    <div className="dil-pages__heading">
      <div>
        <h1 className="dil-pages__title">Redirects</h1>
        <p className="dil-pages__intro">{intro}</p>
      </div>
      {viewer.canCreate && tenant !== undefined ? (
        <AddRedirect tenant={tenant} />
      ) : (
        <p className="dil-products__viewer">
          <MaterialIcon name="lock" />
          Viewers can look at redirects but not change them.
        </p>
      )}
    </div>
  );
}

function Toolbar({
  pathname,
  query,
}: {
  pathname: string;
  query: RedirectsQuery;
}) {
  return (
    <form
      action={pathname}
      className="dil-products__search dil-redirects__filters"
      method="get"
      role="search"
    >
      <label className="dil-sr-only" htmlFor="dil-redirects-kind">
        Kind
      </label>
      <select
        className="dil-products__search-input"
        defaultValue={query.kind ?? ""}
        id="dil-redirects-kind"
        name={KIND_PARAM}
      >
        <option value="">Kind: all</option>
        {REDIRECT_KINDS.map((kind) => (
          <option key={kind} value={kind}>
            {KIND_LABELS[kind]}
          </option>
        ))}
      </select>
      <label className="dil-sr-only" htmlFor="dil-redirects-lang">
        Language
      </label>
      <select
        className="dil-products__search-input"
        defaultValue={query.lang ?? ""}
        id="dil-redirects-lang"
        name={LANG_PARAM}
      >
        <option value="">Language: all</option>
        {REDIRECT_LANGUAGES.map((lang) => (
          <option key={lang} value={lang}>
            {LANGUAGE_LABELS[lang]}
          </option>
        ))}
      </select>
      <label className="dil-sr-only" htmlFor="dil-redirects-search">
        Search redirects
      </label>
      <input
        className="dil-products__search-input"
        defaultValue={query.search}
        id="dil-redirects-search"
        maxLength={SEARCH_MAX_LENGTH}
        name={SEARCH_PARAM}
        placeholder="Search old or new URL"
        type="search"
      />
      <ActionButton icon="search" type="submit" variant="secondary">
        Search
      </ActionButton>
    </form>
  );
}

function Target({ row }: { row: RedirectRow }) {
  const { target } = row;
  if (target.kind === "reference") {
    return (
      <>
        <span className="dil-redirects__name">{target.name || "Untitled"}</span>
        {target.path && (
          <code className="dil-redirects__path">{target.path}</code>
        )}
      </>
    );
  }
  return <code>{target.path}</code>;
}

function Table({ data, viewer }: { data: RedirectsData; viewer: Viewer }) {
  return (
    <div className="dil-pages__card">
      <table className="dil-products__table dil-redirects__table">
        <caption className="dil-sr-only">Redirects</caption>
        <thead>
          <tr>
            <th scope="col">Old URL</th>
            <th scope="col">Goes to</th>
            <th scope="col">Language</th>
            <th scope="col">Created</th>
            <th scope="col">Kind</th>
            <th scope="col">Reach</th>
            <th scope="col">
              <span className="dil-sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row) => {
            const locked = isLocked(row, viewer);
            return (
              <tr
                className={[
                  locked && "dil-products__row--locked",
                  row.liveName && "dil-redirects__row--live",
                ]
                  .filter(Boolean)
                  .join(" ")}
                key={row.id}
              >
                <th scope="row">
                  <code>{row.from}</code>
                  {row.liveName && (
                    <p className="dil-redirects__live">
                      <MaterialIcon name="warning" />
                      {liveMessage(row.liveName)}
                    </p>
                  )}
                </th>
                <td>
                  <Target row={row} />
                </td>
                <td>
                  <LocaleTag locale={row.locale} />
                </td>
                <td>
                  {dayText(row.createdAt)}
                  <span className="dil-redirects__by">
                    {row.origin === "auto"
                      ? "Automatic"
                      : (row.createdBy ?? "A team member")}
                  </span>
                </td>
                <td>
                  <Tag tone={row.origin === "auto" ? "neutral" : "tenant"}>
                    {KIND_LABELS[row.origin]}
                  </Tag>
                </td>
                <td>
                  <ReachBadge
                    compact
                    reach={getReach(
                      row.allSites
                        ? null
                        : { tenant: { domain: data.company.domain } },
                    )}
                  />
                </td>
                <td>
                  {locked ? (
                    viewer.canChange && (
                      <span className="dil-products__lock" title={LOCK_REASON}>
                        <MaterialIcon name="lock" />
                        <span className="dil-sr-only">{LOCK_REASON}</span>
                      </span>
                    )
                  ) : (
                    <RedirectRowActions id={row.id} from={row.from} />
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

async function RedirectsBody(props: ListViewServerProps & { viewer: Viewer }) {
  const { payload, user, searchParams, viewer } = props;
  if (!user) return null;
  const adminRoute = payload.config.routes.admin;
  const pathname = formatAdminURL({
    adminRoute,
    path: "/collections/redirects",
  });
  const tenant = selectedTenantID(
    user as RoleHolder,
    (await cookies()).get(TENANT_COOKIE)?.value,
  );
  if (tenant === undefined) {
    return (
      <>
        <Heading intro="" tenant={undefined} viewer={viewer} />
        <Banner className="dil-pages__banner" icon="domain" tone="info">
          Choose a company in the sidebar to see its redirects.
        </Banner>
      </>
    );
  }
  try {
    const query = parseRedirectsQuery(searchParams as SearchParams | undefined);
    const data = await loadRedirects(payload, user, tenant, query);
    const filtered =
      query.search !== "" ||
      query.kind !== undefined ||
      query.lang !== undefined;
    return (
      <>
        <Heading
          intro={`Old addresses that send visitors on, for ${data.company.name} and for all sites. Automatic ones are written when a page moves.`}
          tenant={tenant}
          viewer={viewer}
        />
        <Banner className="dil-pages__banner" tone="info" icon="info">
          Automatic and all-site rows are locked for editors. A row whose old
          URL is now a live page is flagged amber.
        </Banner>
        <Toolbar pathname={pathname} query={query} />
        {data.rows.length === 0 ? (
          <section className="dil-empty dil-empty--filtered">
            <span aria-hidden className="dil-empty__icon">
              <MaterialIcon name={filtered ? "search_off" : "alt_route"} />
            </span>
            <h3 className="dil-empty__title">
              {filtered
                ? "No redirects match these filters"
                : "No redirects yet"}
            </h3>
            {filtered ? (
              <ActionButton
                el="link"
                icon="filter_alt_off"
                url={pathname}
                variant="secondary"
              >
                Clear filters
              </ActionButton>
            ) : (
              <p className="dil-empty__line">
                Redirects appear here when a page moves, or when you add one.
              </p>
            )}
          </section>
        ) : (
          <>
            <Table data={data} viewer={viewer} />
            <p aria-live="polite" className="dil-products__count">
              {redirectsText(data.rows.length)}
              {data.truncated &&
                ` shown of ${data.total}. Narrow the search to see the rest.`}
            </p>
          </>
        )}
      </>
    );
  } catch (error) {
    payload.logger.error({ err: error, msg: "Couldn't load the redirects" });
    return (
      <>
        <Heading intro="" tenant={undefined} viewer={viewer} />
        <Banner
          action={<PagesRetry />}
          className="dil-pages__banner"
          icon="cloud_off"
          tone="error"
        >
          Couldn&apos;t load the redirects.
        </Banner>
      </>
    );
  }
}

export function RedirectsView(props: ListViewServerProps) {
  const collection = props.permissions?.collections?.redirects;
  const viewer: Viewer = {
    canCreate: Boolean(collection?.create),
    canChange: Boolean(collection?.update),
    superAdmin: isSuperAdmin(props.user as RoleHolder),
  };
  return (
    <div className="collection-list dil-pages-view">
      <Gutter>
        <ListStepNav label="Redirects" />
        <Suspense
          fallback={
            <div aria-busy="true" className="dil-pages__loading" role="status">
              <span className="dil-sr-only">Loading redirects</span>
              <div className="dil-pages__card">
                <Skeleton lines={4} />
              </div>
            </div>
          }
        >
          <RedirectsBody {...props} viewer={viewer} />
        </Suspense>
      </Gutter>
    </div>
  );
}
