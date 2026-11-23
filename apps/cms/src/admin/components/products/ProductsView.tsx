import { Gutter } from "@payloadcms/ui";
import { ListStepNav } from "../topbar/ListStepNav";
import { cookies } from "next/headers";
import Link from "next/link";
import type { ListViewServerProps } from "payload";
import { formatAdminURL } from "payload/shared";
import { Suspense } from "react";

import type { RoleHolder } from "../../../access";
import {
  type CatalogCompany,
  type CatalogData,
  loadCatalog,
  loadCompanies,
} from "../../data/productsCatalog";
import { selectedTenantID, TENANT_COOKIE } from "../../data/sidebar";
import { MaterialIcon } from "../MaterialIcon";
import { ActionButton } from "../kit/ActionButton";
import { Banner } from "../kit/Banner";
import { Skeleton } from "../kit/Loading";
import { PublishBadge } from "../kit/PublishBadge";
import { PagesRetry } from "../pages/PagesRetry";
import type { SearchParams } from "../lists/statusQuery";
import {
  ALL_COMPANIES,
  CATALOG_STATUSES,
  canEditProduct,
  catalogHref,
  emptyCatalogText,
  ownerLabel,
  parseCatalogQuery,
  productsText,
  savedText,
  SEARCH_MAX_LENGTH,
  type CatalogQuery,
} from "./catalog";
import { STATUS_SETS } from "../kit/status";

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
        <h1 className="dil-pages__title">Products</h1>
        <p className="dil-pages__intro">
          Every company&apos;s products. You can edit your own and pick the
          others into your pages.
        </p>
      </div>
      {viewer.canCreate ? (
        <ActionButton el="link" icon="add" url={createHref}>
          New product
        </ActionButton>
      ) : (
        <p className="dil-products__viewer">
          <MaterialIcon name="lock" />
          Viewers can look at products but not change them.
        </p>
      )}
    </div>
  );
}

export function Toolbar({
  companies,
  pathname,
  query,
  selected,
  searchLabel = "Search by name, formula or CAS number",
}: {
  searchLabel?: string;
  companies: CatalogCompany[];
  pathname: string;
  query: CatalogQuery;
  selected: string | undefined;
}) {
  const owners = [
    ...companies
      .filter(({ id }) => id === selected)
      .map(({ id, name }) => ({ key: id, label: `${name} (yours)` })),
    ...companies
      .filter(({ id }) => id !== selected)
      .map(({ id, name }) => ({ key: id, label: name })),
    { key: ALL_COMPANIES, label: "All companies" },
  ];
  const statuses = [
    { key: undefined, label: "Any status" },
    ...CATALOG_STATUSES.map((key) => ({
      key,
      label: STATUS_SETS.document[key].label,
    })),
  ];
  return (
    <div className="dil-products__toolbar">
      <nav aria-label="Filter by owner" className="dil-products__chips">
        {owners.map(({ key, label }) => (
          <Link
            aria-current={query.owner === key ? "page" : undefined}
            className="dil-products__chip"
            href={catalogHref(pathname, { ...query, owner: key }, selected)}
            key={key}
            prefetch={false}
          >
            {label}
          </Link>
        ))}
      </nav>
      <nav aria-label="Filter by status" className="dil-products__chips">
        {statuses.map(({ key, label }) => (
          <Link
            aria-current={query.status === key ? "page" : undefined}
            className="dil-products__chip"
            href={catalogHref(pathname, { ...query, status: key }, selected)}
            key={label}
            prefetch={false}
          >
            {label}
          </Link>
        ))}
      </nav>
      <form
        action={pathname}
        className="dil-products__search"
        method="get"
        role="search"
      >
        {query.owner !== (selected ?? ALL_COMPANIES) && (
          <input name="owner" type="hidden" value={query.owner} />
        )}
        {query.status && (
          <input name="status" type="hidden" value={query.status} />
        )}
        <label className="dil-sr-only" htmlFor="dil-products-search">
          {searchLabel}
        </label>
        <input
          className="dil-products__search-input"
          defaultValue={query.search}
          id="dil-products-search"
          maxLength={SEARCH_MAX_LENGTH}
          name="q"
          placeholder={searchLabel}
          type="search"
        />
        <ActionButton icon="search" type="submit" variant="secondary">
          Search
        </ActionButton>
      </form>
    </div>
  );
}

function Table({
  adminRoute,
  data,
  selected,
  viewer,
}: {
  adminRoute: string;
  data: CatalogData;
  selected: string | undefined;
  viewer: Viewer;
}) {
  const names = new Map(data.companies.map(({ id, name }) => [id, name]));
  return (
    <div className="dil-pages__card">
      <table className="dil-products__table">
        <caption className="dil-sr-only">Products</caption>
        <thead>
          <tr>
            <th scope="col">Image</th>
            <th scope="col">Name</th>
            <th scope="col">Product group</th>
            <th scope="col">Owner</th>
            <th scope="col">Variants</th>
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
                className={locked ? "dil-products__row--locked" : undefined}
                key={row.id}
              >
                <td>
                  {row.image ? (
                    <img
                      alt={row.image.alt}
                      className="dil-products__image"
                      height={40}
                      src={row.image.url}
                      width={40}
                    />
                  ) : (
                    <span
                      aria-hidden="true"
                      className="dil-products__image dil-products__image--none"
                    >
                      <MaterialIcon name="science" />
                    </span>
                  )}
                </td>
                <th scope="row">
                  <Link
                    className="dil-products__name"
                    href={formatAdminURL({
                      adminRoute,
                      path: `/collections/products/${row.id}`,
                    })}
                    prefetch={false}
                  >
                    {row.name || "Untitled product"}
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
                <td>{row.productGroup}</td>
                <td>{ownerLabel(row.owner, selected, owner)}</td>
                <td>{row.variants}</td>
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
  );
}

function Empty({
  adminRoute,
  data,
  query,
  selected,
  viewer,
  pathname,
}: {
  adminRoute: string;
  data: CatalogData;
  query: CatalogQuery;
  selected: string | undefined;
  viewer: Viewer;
  pathname: string;
}) {
  const own = data.companies.find(({ id }) => id === selected);
  const filtered = query.search !== "" || query.status !== undefined;
  const ownCatalog = own && query.owner === selected && !filtered;
  if (ownCatalog && data.otherCount > 0) {
    const others = data.companies.filter(({ id }) => id !== selected);
    return (
      <section className="dil-empty">
        <span aria-hidden className="dil-empty__icon">
          <MaterialIcon name="science" />
        </span>
        <h3 className="dil-empty__title">No products yet</h3>
        <p className="dil-empty__line">
          {emptyCatalogText(
            own.name,
            data.otherCount,
            others.map(({ name }) => name),
            own.domain,
          )}
        </p>
        <div className="dil-products__empty-actions">
          <ActionButton
            el="link"
            url={catalogHref(pathname, { owner: ALL_COMPANIES }, selected)}
            variant="secondary"
          >
            See all companies
          </ActionButton>
          {viewer.canCreate && (
            <ActionButton
              el="link"
              icon="add"
              url={formatAdminURL({
                adminRoute,
                path: "/collections/products/create",
              })}
            >
              New product
            </ActionButton>
          )}
        </div>
      </section>
    );
  }
  return (
    <section className="dil-empty dil-empty--filtered">
      <span aria-hidden className="dil-empty__icon">
        <MaterialIcon name={filtered ? "search_off" : "science"} />
      </span>
      <h3 className="dil-empty__title">
        {filtered ? "No products match these filters" : "No products yet"}
      </h3>
      {filtered && (
        <ActionButton
          el="link"
          icon="filter_alt_off"
          url={catalogHref(pathname, { owner: query.owner }, selected)}
          variant="secondary"
        >
          Clear filters
        </ActionButton>
      )}
    </section>
  );
}

async function CatalogBody(props: ListViewServerProps & { viewer: Viewer }) {
  const { payload, user, locale, searchParams, viewer } = props;
  if (!user) return null;
  const adminRoute = payload.config.routes.admin;
  const pathname = formatAdminURL({
    adminRoute,
    path: "/collections/products",
  });
  const createHref = formatAdminURL({
    adminRoute,
    path: "/collections/products/create",
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
    const data = await loadCatalog(
      { payload, user },
      companies,
      query,
      selected,
      locale?.code === "id" ? "id" : "en",
    );
    return (
      <>
        <Heading createHref={createHref} viewer={viewer} />
        <Toolbar
          companies={data.companies}
          pathname={pathname}
          query={query}
          selected={selected}
        />
        {data.rows.length === 0 ? (
          <Empty
            adminRoute={adminRoute}
            data={data}
            pathname={pathname}
            query={query}
            selected={selected}
            viewer={viewer}
          />
        ) : (
          <>
            <Table
              adminRoute={adminRoute}
              data={data}
              selected={selected}
              viewer={viewer}
            />
            <p aria-live="polite" className="dil-products__count">
              {productsText(data.rows.length)}
              {data.truncated && " shown. Narrow the search to see the rest."}
            </p>
          </>
        )}
      </>
    );
  } catch (error) {
    payload.logger.error({ err: error, msg: "Couldn't load the products" });
    return (
      <>
        <Heading createHref={createHref} viewer={viewer} />
        <Banner
          action={<PagesRetry />}
          className="dil-pages__banner"
          icon="cloud_off"
          tone="error"
        >
          Couldn&apos;t load the products.
        </Banner>
      </>
    );
  }
}

export function ProductsView(props: ListViewServerProps) {
  const viewer: Viewer = {
    canCreate: Boolean(props.permissions?.collections?.products?.create),
    user: props.user as RoleHolder,
  };
  return (
    <div className="collection-list dil-pages-view">
      <Gutter>
        <ListStepNav label="Products" />
        <Suspense
          fallback={
            <div aria-busy="true" className="dil-pages__loading" role="status">
              <span className="dil-sr-only">Loading products</span>
              <div className="dil-pages__card">
                <Skeleton lines={4} />
              </div>
            </div>
          }
        >
          <CatalogBody {...props} viewer={viewer} />
        </Suspense>
      </Gutter>
    </div>
  );
}
