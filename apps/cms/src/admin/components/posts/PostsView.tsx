import { Gutter } from "@payloadcms/ui";
import { cookies } from "next/headers";
import Link from "next/link";
import type { ListViewServerProps } from "payload";
import { formatAdminURL } from "payload/shared";
import { Suspense } from "react";

import type { RoleHolder } from "../../../access";
import { loadPosts, type PostRow, type PostsData } from "../../data/postsList";
import { selectedTenantID, TENANT_COOKIE } from "../../data/sidebar";
import { MaterialIcon } from "../MaterialIcon";
import { ActionButton } from "../kit/ActionButton";
import { Banner } from "../kit/Banner";
import { Skeleton } from "../kit/Loading";
import { PublishBadge } from "../kit/PublishBadge";
import type { SearchParams } from "../lists/statusQuery";
import { PagesRetry } from "../pages/PagesRetry";
import {
  dayText,
  parsePostsQuery,
  postsHref,
  postsText,
  PUBLICATION_PROMPT,
  PUBLICATION_PROMPT_ACTION,
  SEARCH_MAX_LENGTH,
  type PostsQuery,
} from "./posts";

type Viewer = { canCreate: boolean };

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
        <h1 className="dil-pages__title">Posts</h1>
        <p className="dil-pages__intro">
          News, events and stories, filed under a category.
        </p>
      </div>
      {viewer.canCreate ? (
        <ActionButton el="link" icon="add" url={createHref}>
          New post
        </ActionButton>
      ) : (
        <p className="dil-products__viewer">
          <MaterialIcon name="lock" />
          Viewers can look at posts but not change them.
        </p>
      )}
    </div>
  );
}

function Toolbar({
  data,
  pathname,
  query,
}: {
  data: PostsData;
  pathname: string;
  query: PostsQuery;
}) {
  const chips = [
    { id: "", name: "All", count: data.all },
    ...data.chips.map(({ id, name, count }) => ({ id, name, count })),
  ];
  return (
    <div className="dil-products__toolbar">
      <nav aria-label="Filter by category" className="dil-products__chips">
        {chips.map(({ id, name, count }) => (
          <Link
            aria-current={query.category === id ? "page" : undefined}
            className="dil-products__chip"
            href={postsHref(pathname, { ...query, category: id })}
            key={id || "all"}
            prefetch={false}
          >
            {name} · {count}
          </Link>
        ))}
      </nav>
      <form
        action={pathname}
        className="dil-products__search"
        method="get"
        role="search"
      >
        {query.category && (
          <input name="category" type="hidden" value={query.category} />
        )}
        <label className="dil-sr-only" htmlFor="dil-posts-search">
          Search post title
        </label>
        <input
          className="dil-products__search-input"
          defaultValue={query.search}
          id="dil-posts-search"
          maxLength={SEARCH_MAX_LENGTH}
          name="q"
          placeholder="Search post title"
          type="search"
        />
        <ActionButton icon="search" type="submit" variant="secondary">
          Search
        </ActionButton>
      </form>
    </div>
  );
}

function Table({ adminRoute, rows }: { adminRoute: string; rows: PostRow[] }) {
  return (
    <div className="dil-pages__card">
      <table className="dil-products__table">
        <caption className="dil-sr-only">Posts</caption>
        <thead>
          <tr>
            <th scope="col">
              <span className="dil-sr-only">Cover</span>
            </th>
            <th scope="col">Post</th>
            <th scope="col">Category</th>
            <th scope="col">Published</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>
                {row.cover ? (
                  <img
                    alt={row.cover.alt}
                    className="dil-products__image"
                    height={40}
                    src={row.cover.url}
                    width={40}
                  />
                ) : (
                  <span
                    aria-hidden="true"
                    className="dil-products__image dil-products__image--none"
                  >
                    <MaterialIcon name="newspaper" />
                  </span>
                )}
              </td>
              <th scope="row">
                <Link
                  className="dil-products__name"
                  href={formatAdminURL({
                    adminRoute,
                    path: `/collections/posts/${row.id}`,
                  })}
                  prefetch={false}
                >
                  {row.title || "Untitled post"}
                </Link>
              </th>
              <td>{row.category}</td>
              <td>{dayText(row.publishedAt)}</td>
              <td>
                <PublishBadge status={row.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

async function PostsBody(props: ListViewServerProps & { viewer: Viewer }) {
  const { payload, user, locale, searchParams, viewer } = props;
  if (!user) return null;
  const adminRoute = payload.config.routes.admin;
  const pathname = formatAdminURL({ adminRoute, path: "/collections/posts" });
  const createHref = formatAdminURL({
    adminRoute,
    path: "/collections/posts/create",
  });
  const tenant = selectedTenantID(
    user as RoleHolder,
    (await cookies()).get(TENANT_COOKIE)?.value,
  );
  if (tenant === undefined) {
    return (
      <>
        <Heading createHref={createHref} viewer={viewer} />
        <Banner className="dil-pages__banner" icon="domain" tone="info">
          Choose a company in the sidebar to see its posts.
        </Banner>
      </>
    );
  }
  try {
    const query = parsePostsQuery(searchParams as SearchParams | undefined);
    const data = await loadPosts(
      payload,
      user,
      tenant,
      query,
      locale?.code === "id" ? "id" : "en",
    );
    const filtered = query.search !== "" || query.category !== "";
    const settingsHref = formatAdminURL({
      adminRoute,
      path: data.publication.settingsID
        ? `/collections/tenant-settings/${data.publication.settingsID}?tab=general`
        : "/collections/tenant-settings",
    });
    return (
      <>
        <Heading createHref={createHref} viewer={viewer} />
        {data.publication.state === "unset" && (
          <Banner
            action={
              <Link href={settingsHref}>{PUBLICATION_PROMPT_ACTION}</Link>
            }
            className="dil-pages__banner"
            icon="route"
            tone="warning"
          >
            {PUBLICATION_PROMPT}
          </Banner>
        )}
        <Toolbar data={data} pathname={pathname} query={query} />
        {data.rows.length === 0 ? (
          <section className="dil-empty dil-empty--filtered">
            <span aria-hidden className="dil-empty__icon">
              <MaterialIcon name={filtered ? "search_off" : "newspaper"} />
            </span>
            <h3 className="dil-empty__title">
              {filtered ? "No posts match these filters" : "No posts yet"}
            </h3>
            {filtered && (
              <ActionButton
                el="link"
                icon="filter_alt_off"
                url={pathname}
                variant="secondary"
              >
                Clear filters
              </ActionButton>
            )}
          </section>
        ) : (
          <>
            <Table adminRoute={adminRoute} rows={data.rows} />
            <p aria-live="polite" className="dil-products__count">
              {data.truncated
                ? `Showing ${postsText(data.rows.length)} of ${data.total}. Narrow the search to see the rest.`
                : postsText(data.rows.length)}
            </p>
          </>
        )}
      </>
    );
  } catch (error) {
    payload.logger.error({ err: error, msg: "Couldn't load the posts" });
    return (
      <>
        <Heading createHref={createHref} viewer={viewer} />
        <Banner
          action={<PagesRetry />}
          className="dil-pages__banner"
          icon="cloud_off"
          tone="error"
        >
          Couldn&apos;t load the posts.
        </Banner>
      </>
    );
  }
}

export function PostsView(props: ListViewServerProps) {
  const viewer: Viewer = {
    canCreate: Boolean(props.permissions?.collections?.posts?.create),
  };
  return (
    <div className="collection-list dil-pages-view">
      <Gutter>
        <Suspense
          fallback={
            <div aria-busy="true" className="dil-pages__loading" role="status">
              <span className="dil-sr-only">Loading posts</span>
              <div className="dil-pages__card">
                <Skeleton lines={4} />
              </div>
            </div>
          }
        >
          <PostsBody {...props} viewer={viewer} />
        </Suspense>
      </Gutter>
    </div>
  );
}
