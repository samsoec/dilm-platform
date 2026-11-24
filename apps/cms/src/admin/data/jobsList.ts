import type { Payload, TypedUser } from "payload";

import { JOB_TYPES } from "../../collections/Jobs";
import { localization } from "../../localization";
import { baseState, baseUnpublishedMessage } from "../../siteRouting";
import { pathsOf } from "../components/editor/urls";
import {
  departmentsOf,
  jobsWhere,
  listingOf,
  tabCounts,
  tabOf,
  type JobsQuery,
  type JobTab,
} from "../components/jobs/jobs";
import {
  getPublishStatus,
  type JobListingState,
  type PublishStatus,
} from "../components/kit/publication";
import { CATALOG_LIMIT } from "./productsCatalog";

export type JobRow = {
  id: string;
  title: string;
  department: string;
  jobType: string;
  location: string;
  posted: string | null;
  closing: string | null;
  listing: JobListingState | "notListed";
  status: PublishStatus;
  tab: JobTab;
};

export type CareerState =
  | { state: "unset" }
  | { state: "unpublished"; message: string; pageID: string }
  | { state: "live"; path: string };

export type JobsData = {
  rows: JobRow[];
  counts: Record<JobTab | "all", number>;
  departments: string[];
  truncated: boolean;
  company: { name: string; domain: string };
  settingsID: string | undefined;
  career: CareerState;
  total: number;
};

const TYPE_LABELS = new Map(
  JOB_TYPES.map(({ value, label }) => [value, label.en]),
);

export async function loadCompany(
  payload: Payload,
  user: TypedUser,
  tenant: number | string,
): Promise<{ name: string; domain: string }> {
  const { docs } = await payload.find({
    collection: "tenants",
    where: { id: { equals: tenant } },
    select: { name: true, domain: true },
    limit: 1,
    depth: 0,
    overrideAccess: false,
    user,
  });
  return { name: docs[0]?.name ?? "", domain: docs[0]?.domain ?? "" };
}

export async function loadCareer(
  payload: Payload,
  user: TypedUser,
  tenant: number | string,
): Promise<{ career: CareerState; settingsID: string | undefined }> {
  const { docs } = await payload.find({
    collection: "tenant-settings",
    where: { tenant: { equals: tenant } },
    select: { routing: true },
    limit: 1,
    depth: 0,
    overrideAccess: false,
    user,
  });
  const settingsID = docs[0] ? String(docs[0].id) : undefined;
  if (!docs[0]) return { career: { state: "unset" }, settingsID };
  const state = await baseState(
    payload,
    { user },
    "careerPage",
    String(tenant),
  );
  if (state.state === "unset") return { career: state, settingsID };
  if (state.state === "unpublished") {
    return {
      career: {
        state: "unpublished",
        message: baseUnpublishedMessage("careerPage", state.page.title),
        pageID: state.page.id,
      },
      settingsID,
    };
  }
  const paths = pathsOf({ path: state.page.paths });
  return {
    career: { state: "live", path: paths.en ?? Object.values(paths)[0] ?? "" },
    settingsID,
  };
}

export async function loadJobs(
  payload: Payload,
  user: TypedUser,
  tenant: number | string,
  query: JobsQuery,
  locale: "en" | "id" = localization.defaultLocale,
): Promise<JobsData> {
  const live = await payload.find({
    collection: "jobs",
    where: {
      and: [
        { tenant: { equals: tenant } },
        { _status: { equals: "published" } },
      ],
    },
    draft: false,
    pagination: false,
    depth: 0,
    select: { _status: true },
    overrideAccess: false,
    user,
  });
  const published = live.docs.map(({ id }) => id);
  const publishedSet = new Set(published.map(String));
  const common = {
    collection: "jobs" as const,
    draft: true,
    depth: 0,
    locale,
    fallbackLocale: localization.defaultLocale,
  };
  const [company, careerInfo, found, forCounts, forDepartments] =
    await Promise.all([
      loadCompany(payload, user, tenant),
      loadCareer(payload, user, tenant),
      payload.find({
        ...common,
        where: jobsWhere(query, { tenant, published }),
        overrideAccess: false,
        user,
        sort: "-postedDate",
        limit: CATALOG_LIMIT,
        select: {
          title: true,
          department: true,
          jobType: true,
          location: true,
          postedDate: true,
          closingDate: true,
          status: true,
          _status: true,
        },
      }),
      payload.find({
        ...common,
        where: jobsWhere(query, { tenant, published, skipTab: true }),
        overrideAccess: false,
        user,
        pagination: false,
        select: { status: true },
      }),
      payload.find({
        ...common,
        where: { tenant: { equals: tenant } },
        overrideAccess: false,
        user,
        pagination: false,
        select: { department: true },
      }),
    ]);
  const { docs } = found;
  const rows = docs.map((job): JobRow => {
    const status = getPublishStatus(
      { _status: job._status },
      { hasPublishedVersion: publishedSet.has(String(job.id)) },
    );
    const facts = {
      status,
      listingStatus: job.status,
      closingDate: job.closingDate ?? null,
    };
    return {
      id: String(job.id),
      title: job.title ?? "",
      department: job.department ?? "",
      jobType: job.jobType ? (TYPE_LABELS.get(job.jobType) ?? "") : "",
      location: job.location ?? "",
      posted: job.postedDate ?? null,
      closing: job.closingDate ?? null,
      listing: listingOf(facts),
      status,
      tab: tabOf(facts),
    };
  });
  return {
    rows,
    counts: tabCounts(
      forCounts.docs.map((job) => ({
        tab: tabOf({
          status: publishedSet.has(String(job.id)) ? "published" : "draft",
          listingStatus: job.status,
        }),
      })),
    ),
    departments: departmentsOf(
      forDepartments.docs.map((job) => ({ department: job.department ?? "" })),
    ),
    truncated: found.totalDocs > CATALOG_LIMIT,
    company,
    settingsID: careerInfo.settingsID,
    career: careerInfo.career,
    total: found.totalDocs,
  };
}
