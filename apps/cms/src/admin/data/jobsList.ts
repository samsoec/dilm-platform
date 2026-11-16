import type { Payload, TypedUser, Where } from "payload";

import { JOB_TYPES } from "../../collections/Jobs";
import { localization } from "../../localization";
import { baseState, baseUnpublishedMessage } from "../../siteRouting";
import { pathsOf } from "../components/editor/urls";
import {
  departmentsOf,
  listingOf,
  matchesJob,
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
  | { state: "unpublished"; message: string }
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
  const where: Where = {
    and: [
      { tenant: { equals: tenant } },
      ...(query.search ? [{ title: { like: query.search } }] : []),
    ],
  };
  const [company, careerInfo, found] = await Promise.all([
    loadCompany(payload, user, tenant),
    loadCareer(payload, user, tenant),
    payload.find({
      collection: "jobs",
      where,
      draft: true,
      sort: "-postedDate",
      limit: CATALOG_LIMIT,
      depth: 0,
      locale,
      fallbackLocale: localization.defaultLocale,
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
      overrideAccess: false,
      user,
    }),
  ]);
  const { docs } = found;
  const published = new Set<string>();
  if (docs.length > 0) {
    const live = await payload.find({
      collection: "jobs",
      where: { id: { in: docs.map(({ id }) => id) } },
      draft: false,
      pagination: false,
      depth: 0,
      select: { _status: true },
      overrideAccess: false,
      user,
    });
    for (const doc of live.docs) {
      if (doc._status === "published") published.add(String(doc.id));
    }
  }
  const all = docs.map((job): JobRow => {
    const status = getPublishStatus(
      { _status: job._status },
      { hasPublishedVersion: published.has(String(job.id)) },
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
  const byDepartment = all.filter(({ department }) =>
    query.department ? department === query.department : true,
  );
  return {
    rows: all.filter((row) => matchesJob(row, query)),
    counts: tabCounts(byDepartment),
    departments: departmentsOf(all),
    truncated: docs.length >= CATALOG_LIMIT,
    company,
    settingsID: careerInfo.settingsID,
    career: careerInfo.career,
    total: all.length,
  };
}
