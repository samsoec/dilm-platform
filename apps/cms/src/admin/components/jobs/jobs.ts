import type { Where } from "payload";

import type { SearchParams } from "../lists/statusQuery";
import {
  getJobListing,
  type JobListingState,
  type PublishStatus,
} from "../kit/publication";

export const JOB_TABS = ["open", "closed", "draft"] as const;

export type JobTab = (typeof JOB_TABS)[number];

export type JobsQuery = {
  tab: JobTab | undefined;
  department: string;
  search: string;
};

export const TAB_PARAM = "status";
export const DEPARTMENT_PARAM = "department";
export const SEARCH_PARAM = "q";
export const SEARCH_MAX_LENGTH = 100;

export const TAB_LABELS: Record<JobTab | "all", string> = {
  all: "All",
  open: "Open",
  closed: "Closed",
  draft: "Draft",
};

export const CAREER_PROMPT =
  "Choose your Career page first. Job URLs start with its URL, so jobs can't be published until it's set.";
export const CAREER_PROMPT_ACTION = "Set Career page";
export const AUTO_CLOSED_NOTE =
  '"Closed automatically" = published and open, but its closing date has passed. Its page stays reachable without the apply form.';
export const CLOSING_HINT =
  "After this date it leaves the listing automatically.";
export const POSTED_HINT = "Defaults to today.";
export const LOCATION_HINT =
  "Suggests locations you've used, to keep site filters clean.";
export const SUGGESTIONS_HEADING = "Used by your jobs";
export const NOT_LISTED = "Not listed · draft";

export const CLOSE_LEAVES = "It leaves the Career listing and job sections.";
export const CLOSE_REACHABLE =
  "Its page stays reachable, without the application form, so shared links still work.";

export function closeTitle(name: string): string {
  return `Close "${name}"?`;
}

export function noCareerPageReason(company: string): string {
  return `No Career page is set for ${company}. Company settings › Careers.`;
}

function first(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value) ?? "";
}

export function parseJobsQuery(
  searchParams: SearchParams | undefined,
): JobsQuery {
  const params = searchParams ?? {};
  const tab = first(params[TAB_PARAM]);
  return {
    tab: (JOB_TABS as readonly string[]).includes(tab)
      ? (tab as JobTab)
      : undefined,
    department: first(params[DEPARTMENT_PARAM])
      .trim()
      .slice(0, SEARCH_MAX_LENGTH),
    search: first(params[SEARCH_PARAM]).trim().slice(0, SEARCH_MAX_LENGTH),
  };
}

export function jobsHref(pathname: string, query: Partial<JobsQuery>): string {
  const params = new URLSearchParams();
  if (query.tab) params.set(TAB_PARAM, query.tab);
  if (query.department) params.set(DEPARTMENT_PARAM, query.department);
  if (query.search) params.set(SEARCH_PARAM, query.search);
  const text = params.toString();
  return text ? `${pathname}?${text}` : pathname;
}

export type JobFacts = {
  status: PublishStatus;
  listingStatus?: string | null;
  closingDate?: string | null;
};

export function tabOf({ status, listingStatus }: JobFacts): JobTab {
  if (status === "draft" || status === "trashed") return "draft";
  return listingStatus === "closed" ? "closed" : "open";
}

export function listingOf(
  job: JobFacts,
  now: Date = new Date(),
): JobListingState | "notListed" {
  if (job.status === "draft" || job.status === "trashed") return "notListed";
  return getJobListing(
    { status: job.listingStatus, closingDate: job.closingDate },
    now,
  );
}

export function tabCounts(
  jobs: readonly { tab: JobTab }[],
): Record<JobTab | "all", number> {
  const counts = { all: jobs.length, open: 0, closed: 0, draft: 0 };
  for (const job of jobs) counts[job.tab] += 1;
  return counts;
}

export function departmentsOf(
  jobs: readonly { department: string }[],
): string[] {
  return [
    ...new Set(jobs.map(({ department }) => department).filter(Boolean)),
  ].sort((a, b) => a.localeCompare(b));
}

const DAY = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "Asia/Jakarta",
});

export function dayText(value: string | null | undefined): string {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : DAY.format(date);
}

export function jobsText(count: number): string {
  return `${count} ${count === 1 ? "job" : "jobs"}`;
}

export type Suggestion = { value: string; count: number };

export type Option =
  | { kind: "suggestion"; value: string; count: number }
  | { kind: "create"; value: string };

export function comboOptions(
  suggestions: readonly Suggestion[],
  typed: string,
): Option[] {
  const text = typed.trim();
  const needle = text.toLocaleLowerCase();
  const shown: Option[] = suggestions
    .filter(({ value }) => value.toLocaleLowerCase().includes(needle))
    .map(({ value, count }) => ({ kind: "suggestion", value, count }));
  const exact = suggestions.some(
    ({ value }) => value.toLocaleLowerCase() === needle,
  );
  return text && !exact ? [...shown, { kind: "create", value: text }] : shown;
}

export function createLabel(value: string): string {
  return `Create "${value}"`;
}

export type JobsWhereOptions = {
  tenant: number | string;
  published: readonly (number | string)[];
  skipTab?: boolean;
};

export function jobsWhere(
  query: JobsQuery,
  { tenant, published, skipTab = false }: JobsWhereOptions,
): Where {
  const clauses: Where[] = [{ tenant: { equals: tenant } }];
  if (query.search) clauses.push({ title: { like: query.search } });
  if (query.department) {
    clauses.push({ department: { equals: query.department } });
  }
  if (query.tab && !skipTab) {
    if (query.tab === "draft") {
      if (published.length > 0) {
        clauses.push({ id: { not_in: [...published] } });
      }
    } else {
      clauses.push({ status: { equals: query.tab } });
      clauses.push(
        published.length > 0
          ? { id: { in: [...published] } }
          : { id: { exists: false } },
      );
    }
  }
  return { and: clauses };
}
