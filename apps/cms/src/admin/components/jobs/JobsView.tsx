import { Gutter } from "@payloadcms/ui";
import { cookies } from "next/headers";
import Link from "next/link";
import type { ListViewServerProps } from "payload";
import { formatAdminURL } from "payload/shared";
import { Suspense } from "react";

import type { RoleHolder } from "../../../access";
import { loadJobs, type JobRow, type JobsData } from "../../data/jobsList";
import { selectedTenantID, TENANT_COOKIE } from "../../data/sidebar";
import { MaterialIcon } from "../MaterialIcon";
import { ActionButton } from "../kit/ActionButton";
import { Banner } from "../kit/Banner";
import { Skeleton } from "../kit/Loading";
import { JobListingBadge, PublishBadge } from "../kit/PublishBadge";
import type { SearchParams } from "../lists/statusQuery";
import { PagesRetry } from "../pages/PagesRetry";
import {
  AUTO_CLOSED_NOTE,
  CAREER_PROMPT,
  CAREER_PROMPT_ACTION,
  dayText,
  jobsHref,
  jobsText,
  NOT_LISTED,
  parseJobsQuery,
  SEARCH_MAX_LENGTH,
  TAB_LABELS,
  type JobsQuery,
} from "./jobs";

type Viewer = { canCreate: boolean };

function Heading({
  createHref,
  intro,
  viewer,
}: {
  createHref: string;
  intro: string;
  viewer: Viewer;
}) {
  return (
    <div className="dil-pages__heading">
      <div>
        <h1 className="dil-pages__title">Jobs</h1>
        <p className="dil-pages__intro">{intro}</p>
      </div>
      {viewer.canCreate ? (
        <ActionButton el="link" icon="add" url={createHref}>
          New job
        </ActionButton>
      ) : (
        <p className="dil-products__viewer">
          <MaterialIcon name="lock" />
          Viewers can look at jobs but not change them.
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
  data: JobsData;
  pathname: string;
  query: JobsQuery;
}) {
  const tabs = (["all", "open", "closed", "draft"] as const).map((key) => ({
    key: key === "all" ? undefined : key,
    label: TAB_LABELS[key],
    count: data.counts[key],
  }));
  return (
    <div className="dil-products__toolbar">
      <nav aria-label="Filter by status" className="dil-products__chips">
        {tabs.map(({ key, label, count }) => (
          <Link
            aria-current={query.tab === key ? "page" : undefined}
            className="dil-products__chip"
            href={jobsHref(pathname, { ...query, tab: key })}
            key={label}
            prefetch={false}
          >
            {label} · {count}
          </Link>
        ))}
      </nav>
      <form
        action={pathname}
        className="dil-products__search"
        method="get"
        role="search"
      >
        {query.tab && <input name="status" type="hidden" value={query.tab} />}
        <label className="dil-sr-only" htmlFor="dil-jobs-department">
          Department
        </label>
        <select
          className="dil-products__search-input"
          defaultValue={query.department}
          id="dil-jobs-department"
          name="department"
        >
          <option value="">Department: all</option>
          {data.departments.map((department) => (
            <option key={department} value={department}>
              {department}
            </option>
          ))}
        </select>
        <label className="dil-sr-only" htmlFor="dil-jobs-search">
          Search job title
        </label>
        <input
          className="dil-products__search-input"
          defaultValue={query.search}
          id="dil-jobs-search"
          maxLength={SEARCH_MAX_LENGTH}
          name="q"
          placeholder="Search job title"
          type="search"
        />
        <ActionButton icon="search" type="submit" variant="secondary">
          Search
        </ActionButton>
      </form>
    </div>
  );
}

function ListingCell({ row }: { row: JobRow }) {
  if (row.listing === "notListed") {
    return <span className="dil-jobs__unlisted">{NOT_LISTED}</span>;
  }
  return <JobListingBadge listing={row.listing} />;
}

function Table({ adminRoute, rows }: { adminRoute: string; rows: JobRow[] }) {
  return (
    <div className="dil-pages__card">
      <table className="dil-products__table">
        <caption className="dil-sr-only">Jobs</caption>
        <thead>
          <tr>
            <th scope="col">Job</th>
            <th scope="col">Job Type</th>
            <th scope="col">Location</th>
            <th scope="col">Posted</th>
            <th scope="col">Closes</th>
            <th scope="col">Listing</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <th scope="row">
                <Link
                  className="dil-products__name"
                  href={formatAdminURL({
                    adminRoute,
                    path: `/collections/jobs/${row.id}`,
                  })}
                  prefetch={false}
                >
                  {row.title || "Untitled job"}
                </Link>
                {row.department && (
                  <span className="dil-jobs__department">{row.department}</span>
                )}
              </th>
              <td>{row.jobType}</td>
              <td>{row.location}</td>
              <td>{dayText(row.posted)}</td>
              <td
                className={
                  row.listing === "closedAutomatically"
                    ? "dil-jobs__closed-auto"
                    : undefined
                }
              >
                {dayText(row.closing)}
              </td>
              <td>
                <ListingCell row={row} />
              </td>
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

async function JobsBody(props: ListViewServerProps & { viewer: Viewer }) {
  const { payload, user, locale, searchParams, viewer } = props;
  if (!user) return null;
  const adminRoute = payload.config.routes.admin;
  const pathname = formatAdminURL({
    adminRoute,
    path: "/collections/jobs",
  });
  const createHref = formatAdminURL({
    adminRoute,
    path: "/collections/jobs/create",
  });
  const tenant = selectedTenantID(
    user as RoleHolder,
    (await cookies()).get(TENANT_COOKIE)?.value,
  );
  if (tenant === undefined) {
    return (
      <>
        <Heading createHref={createHref} intro="" viewer={viewer} />
        <Banner className="dil-pages__banner" icon="domain" tone="info">
          Choose a company in the sidebar to see its jobs.
        </Banner>
      </>
    );
  }
  try {
    const query = parseJobsQuery(searchParams as SearchParams | undefined);
    const data = await loadJobs(
      payload,
      user,
      tenant,
      query,
      locale?.code === "id" ? "id" : "en",
    );
    const careerPath =
      data.career.state === "live" ? data.career.path : undefined;
    const intro =
      careerPath === undefined
        ? "Open positions on your Career page. Applications arrive in Career applications."
        : `Open positions listed on ${data.company.domain}/en${careerPath === "/" ? "" : careerPath}. Applications arrive in Career applications.`;
    const filtered =
      query.search !== "" || query.department !== "" || query.tab !== undefined;
    const settingsHref = formatAdminURL({
      adminRoute,
      path: data.settingsID
        ? `/collections/tenant-settings/${data.settingsID}?tab=careers`
        : "/collections/tenant-settings",
    });
    return (
      <>
        <Heading createHref={createHref} intro={intro} viewer={viewer} />
        {data.career.state === "unset" && (
          <Banner
            action={<Link href={settingsHref}>{CAREER_PROMPT_ACTION}</Link>}
            className="dil-pages__banner"
            icon="route"
            tone="warning"
          >
            {CAREER_PROMPT}
          </Banner>
        )}
        {data.career.state === "unpublished" && (
          <Banner
            action={<Link href={settingsHref}>{CAREER_PROMPT_ACTION}</Link>}
            className="dil-pages__banner"
            icon="route"
            tone="warning"
          >
            {data.career.message}
          </Banner>
        )}
        <Toolbar data={data} pathname={pathname} query={query} />
        {data.rows.length === 0 ? (
          <section className="dil-empty dil-empty--filtered">
            <span aria-hidden className="dil-empty__icon">
              <MaterialIcon name={filtered ? "search_off" : "work"} />
            </span>
            <h3 className="dil-empty__title">
              {filtered ? "No jobs match these filters" : "No jobs yet"}
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
            <p className="dil-products__count">{AUTO_CLOSED_NOTE}</p>
            <p aria-live="polite" className="dil-products__count">
              {jobsText(data.rows.length)}
              {data.truncated && " shown. Narrow the search to see the rest."}
            </p>
          </>
        )}
      </>
    );
  } catch (error) {
    payload.logger.error({ err: error, msg: "Couldn't load the jobs" });
    return (
      <>
        <Heading createHref={createHref} intro="" viewer={viewer} />
        <Banner
          action={<PagesRetry />}
          className="dil-pages__banner"
          icon="cloud_off"
          tone="error"
        >
          Couldn&apos;t load the jobs.
        </Banner>
      </>
    );
  }
}

export function JobsView(props: ListViewServerProps) {
  const viewer: Viewer = {
    canCreate: Boolean(props.permissions?.collections?.jobs?.create),
  };
  return (
    <div className="collection-list dil-pages-view">
      <Gutter>
        <Suspense
          fallback={
            <div aria-busy="true" className="dil-pages__loading" role="status">
              <span className="dil-sr-only">Loading jobs</span>
              <div className="dil-pages__card">
                <Skeleton lines={4} />
              </div>
            </div>
          }
        >
          <JobsBody {...props} viewer={viewer} />
        </Suspense>
      </Gutter>
    </div>
  );
}
