import { Gutter } from "@payloadcms/ui";
import { ListStepNav } from "../topbar/ListStepNav";
import { cookies } from "next/headers";
import Link from "next/link";
import type { ListViewServerProps } from "payload";
import { formatAdminURL } from "payload/shared";
import { Suspense } from "react";

import type { RoleHolder } from "../../../access";
import { loadCompanies } from "../../data/productsCatalog";
import { loadSolutions } from "../../data/solutionsCatalog";
import { selectedTenantID, TENANT_COOKIE } from "../../data/sidebar";
import { MaterialIcon } from "../MaterialIcon";
import { ActionButton } from "../kit/ActionButton";
import { Banner } from "../kit/Banner";
import { Skeleton } from "../kit/Loading";
import { PublishBadge } from "../kit/PublishBadge";
import { PagesRetry } from "../pages/PagesRetry";
import type { SearchParams } from "../lists/statusQuery";
import {
  canEditProduct,
  catalogHref,
  ownerLabel,
  parseCatalogQuery,
  savedText,
  solutionsText,
} from "../products/catalog";
import { Toolbar } from "../products/ProductsView";

type Viewer = { canCreate: boolean; user: RoleHolder };

function Heading({
  createHref,
  viewer,
}: {
  createHref: string;
  viewer: Viewer;
}) {
  return (
    <div className="dil-pages__heading">
      <div>
        <h1 className="dil-pages__title">Solutions</h1>
        <p className="dil-pages__intro">
          Every company&apos;s solutions. You can edit your own and pick the
          others into your pages.
        </p>
      </div>
      {viewer.canCreate ? (
        <ActionButton el="link" icon="add" url={createHref}>
          New solution
        </ActionButton>
      ) : (
        <p className="dil-products__viewer">
          <MaterialIcon name="lock" />
          Viewers can look at solutions but not change them.
        </p>
      )}
    </div>
  );
}

async function SolutionsBody(props: ListViewServerProps & { viewer: Viewer }) {
  const { payload, user, locale, searchParams, viewer } = props;
  if (!user) return null;
  const adminRoute = payload.config.routes.admin;
  const pathname = formatAdminURL({
    adminRoute,
    path: "/collections/solutions",
  });
  const createHref = formatAdminURL({
    adminRoute,
    path: "/collections/solutions/create",
  });
  const tenant = selectedTenantID(
    user as RoleHolder,
    (await cookies()).get(TENANT_COOKIE)?.value,
  );
  const selected = tenant === undefined ? undefined : String(tenant);
  try {
    const companies = await loadCompanies({ payload, user });
    const query = parseCatalogQuery(
      searchParams as SearchParams | undefined,
      selected,
      companies.map(({ id }) => id),
    );
    const data = await loadSolutions(
      { payload, user },
      query,
      selected,
      locale?.code === "id" ? "id" : "en",
    );
    const names = new Map(companies.map(({ id, name }) => [id, name]));
    const filtered = query.search !== "" || query.status !== undefined;
    return (
      <>
        <Heading createHref={createHref} viewer={viewer} />
        <Toolbar
          companies={companies}
          pathname={pathname}
          query={query}
          searchLabel="Search by solution or industry"
          selected={selected}
        />
        {data.rows.length === 0 ? (
          <section className="dil-empty dil-empty--filtered">
            <span aria-hidden className="dil-empty__icon">
              <MaterialIcon name={filtered ? "search_off" : "lightbulb"} />
            </span>
            <h3 className="dil-empty__title">
              {filtered
                ? "No solutions match these filters"
                : "No solutions yet"}
            </h3>
            {filtered ? (
              <ActionButton
                el="link"
                icon="filter_alt_off"
                url={catalogHref(pathname, { owner: query.owner }, selected)}
                variant="secondary"
              >
                Clear filters
              </ActionButton>
            ) : (
              data.otherCount > 0 && (
                <ActionButton
                  el="link"
                  url={catalogHref(pathname, { owner: "all" }, selected)}
                  variant="secondary"
                >
                  See all companies
                </ActionButton>
              )
            )}
          </section>
        ) : (
          <>
            <div className="dil-pages__card">
              <table className="dil-products__table">
                <caption className="dil-sr-only">Solutions</caption>
                <thead>
                  <tr>
                    <th scope="col">Solution</th>
                    <th scope="col">Industry</th>
                    <th scope="col">Owner</th>
                    <th scope="col">Status</th>
                    <th scope="col">Last saved</th>
                  </tr>
                </thead>
                <tbody>
                  {data.rows.map((row) => {
                    const locked = !canEditProduct(viewer.user, row.owner);
                    const owner = names.get(row.owner) ?? "Another company";
                    return (
                      <tr
                        className={
                          locked ? "dil-products__row--locked" : undefined
                        }
                        key={row.id}
                      >
                        <th scope="row">
                          <Link
                            className="dil-products__name"
                            href={formatAdminURL({
                              adminRoute,
                              path: `/collections/solutions/${row.id}`,
                            })}
                            prefetch={false}
                          >
                            {row.name || "Untitled solution"}
                          </Link>
                          {locked && (
                            <span className="dil-products__lock">
                              <MaterialIcon name="lock" />
                              <span className="dil-sr-only">
                                Read-only, owned by {owner}
                              </span>
                            </span>
                          )}
                        </th>
                        <td>{row.industry}</td>
                        <td>{ownerLabel(row.owner, selected, owner)}</td>
                        <td>
                          <PublishBadge status={row.status} />
                        </td>
                        <td>{savedText(row.updatedAt)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p aria-live="polite" className="dil-products__count">
              {solutionsText(data.rows.length)}
              {data.truncated && " shown. Narrow the search to see the rest."}
            </p>
          </>
        )}
      </>
    );
  } catch (error) {
    payload.logger.error({ err: error, msg: "Couldn't load the solutions" });
    return (
      <>
        <Heading createHref={createHref} viewer={viewer} />
        <Banner
          action={<PagesRetry />}
          className="dil-pages__banner"
          icon="cloud_off"
          tone="error"
        >
          Couldn&apos;t load the solutions.
        </Banner>
      </>
    );
  }
}

export function SolutionsView(props: ListViewServerProps) {
  const viewer: Viewer = {
    canCreate: Boolean(props.permissions?.collections?.solutions?.create),
    user: props.user as RoleHolder,
  };
  return (
    <div className="collection-list dil-pages-view">
      <Gutter>
        <ListStepNav label="Solutions" />
        <Suspense
          fallback={
            <div aria-busy="true" className="dil-pages__loading" role="status">
              <span className="dil-sr-only">Loading solutions</span>
              <div className="dil-pages__card">
                <Skeleton lines={4} />
              </div>
            </div>
          }
        >
          <SolutionsBody {...props} viewer={viewer} />
        </Suspense>
      </Gutter>
    </div>
  );
}
