import { Gutter } from "@payloadcms/ui";
import Link from "next/link";
import type { ListViewServerProps } from "payload";
import { formatAdminURL } from "payload/shared";
import { Suspense } from "react";

import { isSuperAdmin, type RoleHolder } from "../../../access";
import { loadCategories, type CategoryRow } from "../../data/categoriesList";
import { Banner } from "../kit/Banner";
import { Skeleton } from "../kit/Loading";
import { PagesRetry } from "../pages/PagesRetry";
import { COMPANY_COLUMNS, READ_ONLY_BANNER } from "./categories";
import { CategoryRowActions } from "./CategoryRowActions";

function Table({
  adminRoute,
  rows,
  canChange,
}: {
  adminRoute: string;
  rows: CategoryRow[];
  canChange: boolean;
}) {
  return (
    <div className="dil-pages__card">
      <table className="dil-products__table dil-categories__table">
        <caption className="dil-sr-only">Categories</caption>
        <thead>
          <tr>
            <th scope="col">Category</th>
            <th scope="col">Slug EN / ID</th>
            {COMPANY_COLUMNS.map(({ label, slug }) => (
              <th className="dil-categories__count" key={slug} scope="col">
                {label}
              </th>
            ))}
            {canChange && (
              <th scope="col">
                <span className="dil-sr-only">Actions</span>
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <th scope="row">
                {canChange ? (
                  <Link
                    className="dil-products__name"
                    href={formatAdminURL({
                      adminRoute,
                      path: `/collections/categories/${row.id}`,
                    })}
                    prefetch={false}
                  >
                    {row.name}
                  </Link>
                ) : (
                  <span className="dil-products__name">{row.name}</span>
                )}
                {row.description && (
                  <span className="dil-categories__description">
                    {row.description}
                  </span>
                )}
              </th>
              <td>
                <code>{row.slugEn}</code> / <code>{row.slugId}</code>
              </td>
              {row.counts.map(({ slug, name, count }) => (
                <td className="dil-categories__count" key={slug}>
                  {count === undefined ? (
                    <span aria-label={`${name}: not shown to you`}>–</span>
                  ) : (
                    count
                  )}
                </td>
              ))}
              {canChange && (
                <td>
                  <CategoryRowActions
                    id={row.id}
                    inUseMessage={row.inUseMessage}
                    name={row.name}
                  />
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

async function CategoriesBody(props: ListViewServerProps) {
  const { payload, user, locale } = props;
  if (!user) return null;
  const canChange = isSuperAdmin(user as RoleHolder);
  const heading = (
    <div className="dil-pages__heading">
      <div>
        <h1 className="dil-pages__title">Categories</h1>
        <p className="dil-pages__intro">
          The groups posts are filed under, shared by all 3 sites.
        </p>
      </div>
    </div>
  );
  try {
    const rows = await loadCategories(payload, user, locale?.code ?? "en");
    return (
      <>
        {heading}
        {!canChange && (
          <Banner className="dil-pages__banner" tone="readonly">
            {READ_ONLY_BANNER}
          </Banner>
        )}
        <Table
          adminRoute={payload.config.routes.admin}
          canChange={canChange}
          rows={rows}
        />
      </>
    );
  } catch (error) {
    payload.logger.error({ err: error, msg: "Couldn't load the categories" });
    return (
      <>
        {heading}
        <Banner
          action={<PagesRetry />}
          className="dil-pages__banner"
          icon="cloud_off"
          tone="error"
        >
          Couldn&apos;t load the categories.
        </Banner>
      </>
    );
  }
}

export function CategoriesView(props: ListViewServerProps) {
  return (
    <div className="collection-list dil-pages-view">
      <Gutter>
        <Suspense
          fallback={
            <div aria-busy="true" className="dil-pages__loading" role="status">
              <span className="dil-sr-only">Loading categories</span>
              <div className="dil-pages__card">
                <Skeleton lines={3} />
              </div>
            </div>
          }
        >
          <CategoriesBody {...props} />
        </Suspense>
      </Gutter>
    </div>
  );
}
