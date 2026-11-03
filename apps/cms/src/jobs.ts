import type { PayloadHandler, Where } from "payload";

import { hasAnyRole, hasTenantAccess } from "./access";
import { localization } from "./localization";
import { scopedReq } from "./pageRules";

export const JOB_STATUSES = ["open", "closed"] as const;

export type JobStatus = (typeof JOB_STATUSES)[number];

export const SUGGESTION_FIELDS = ["department", "location"] as const;

export type SuggestionField = (typeof SUGGESTION_FIELDS)[number];

export type Suggestion = { value: string; count: number };

export type JobSuggestions = Record<SuggestionField, Suggestion[]>;

type ListingState = {
  _status?: string | null;
  status?: string | null;
  closingDate?: string | Date | null;
};

export function isListed(job: ListingState, now: Date = new Date()): boolean {
  if (job._status !== "published" || job.status !== "open") return false;
  if (!job.closingDate) return true;
  return new Date(job.closingDate).getTime() > now.getTime();
}

export function listedWhere(now: Date = new Date()): Where {
  return {
    and: [
      { _status: { equals: "published" } },
      { status: { equals: "open" } },
      {
        or: [
          { closingDate: { exists: false } },
          { closingDate: { greater_than: now.toISOString() } },
        ],
      },
    ],
  };
}

export function countSuggestions(
  jobs: Partial<Record<SuggestionField, string | null | undefined>>[],
): JobSuggestions {
  return Object.fromEntries(
    SUGGESTION_FIELDS.map((field) => {
      const seen = new Map<string, Suggestion>();
      for (const job of jobs) {
        const value = job[field]?.trim();
        if (!value) continue;
        const key = value.toLocaleLowerCase();
        const entry = seen.get(key);
        if (entry) entry.count += 1;
        else seen.set(key, { value, count: 1 });
      }
      const sorted = [...seen.values()].sort(
        (a, b) => b.count - a.count || a.value.localeCompare(b.value),
      );
      return [field, sorted];
    }),
  ) as JobSuggestions;
}

function json(body: unknown, status = 200): Response {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export const jobSuggestionsHandler: PayloadHandler = async (req) => {
  if (!hasAnyRole(req.user)) return json({ message: "Unauthorized" }, 401);
  const query = (req.query ?? {}) as Record<string, unknown>;
  const tenant = typeof query.tenant === "string" ? query.tenant : "";
  if (!tenant) return json({ message: "Pass the company as ?tenant=." }, 400);
  if (!hasTenantAccess(req.user, tenant)) {
    return json({ message: "Forbidden" }, 403);
  }
  const locale =
    typeof query.locale === "string" &&
    (localization.locales as readonly string[]).includes(query.locale)
      ? query.locale
      : localization.defaultLocale;
  const { docs } = await req.payload.find({
    collection: "jobs",
    where: { tenant: { equals: tenant } },
    locale: locale as "en" | "id",
    fallbackLocale: localization.defaultLocale,
    draft: true,
    depth: 0,
    limit: 0,
    pagination: false,
    overrideAccess: true,
    req: scopedReq(req),
  });
  return json(
    countSuggestions(
      docs as unknown as {
        department?: string | null;
        location?: string | null;
      }[],
    ),
  );
};
