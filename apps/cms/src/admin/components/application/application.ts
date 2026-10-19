import { parse } from "qs-esm";
import type { Where } from "payload";

import type { IconName } from "../../icons";
import { STATUS_SETS } from "../kit/status";

export const JAKARTA_TIME_ZONE = "Asia/Jakarta";

const LONG = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
  timeZone: JAKARTA_TIME_ZONE,
});

const SHORT = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
  timeZone: JAKARTA_TIME_ZONE,
});

const DAY = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: JAKARTA_TIME_ZONE,
});

function asDate(value: unknown): Date | undefined {
  if (typeof value !== "string" && !(value instanceof Date)) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export function submittedText(value: unknown): string | undefined {
  const date = asDate(value);
  return date && `${LONG.format(date)} WIB`;
}

export function momentText(value: unknown): string | undefined {
  const date = asDate(value);
  return date && SHORT.format(date);
}

export function retainedUntil(submittedAt: unknown, months: number): string {
  const date = asDate(submittedAt);
  if (!date) return "";
  const until = new Date(date);
  until.setUTCMonth(until.getUTCMonth() + months);
  return DAY.format(until);
}

export function recordId(id: number | string, submittedAt: unknown): string {
  const year = asDate(submittedAt)?.getUTCFullYear() ?? "";
  return `CV-${year}-${String(id).padStart(4, "0")}`;
}

export function triesText(count: number): string {
  return `${count} ${count === 1 ? "try" : "tries"}`;
}

export type DeliveryTone = "ok" | "warn" | "danger";

export type DeliveryCell = {
  key: "applicant" | "recruiter" | "platform";
  heading: string;
  tone: DeliveryTone;
  icon: IconName;
  title: string;
  detail: string;
};

export type DeliveryRecord = {
  applicantNotifiedAt?: string | null;
  recruiterNotifiedAt?: string | null;
  externalSyncStatus?: string | null;
  externalSyncAttempts?: number | null;
  externalSyncTriedAt?: string | null;
};

const SENT = { tone: "ok", icon: "check_circle", title: "Sent" } as const;
const PENDING = { tone: "warn", icon: "schedule", title: "Pending" } as const;

export function deliveryCells(
  record: DeliveryRecord,
  recruiterEmail: string | undefined,
): DeliveryCell[] {
  const applicantAt = momentText(record.applicantNotifiedAt);
  const recruiterAt = momentText(record.recruiterNotifiedAt);
  const triedAt = momentText(record.externalSyncTriedAt);
  const attempts = record.externalSyncAttempts ?? 0;

  const applicant: DeliveryCell = applicantAt
    ? {
        key: "applicant",
        heading: "Applicant email",
        ...SENT,
        detail: `Applicant was emailed a confirmation on ${applicantAt}.`,
      }
    : {
        key: "applicant",
        heading: "Applicant email",
        ...PENDING,
        detail: "Confirmation is queued and hasn't been sent yet.",
      };

  const recruiter: DeliveryCell = recruiterAt
    ? {
        key: "recruiter",
        heading: "Recruiter email",
        ...SENT,
        detail: `${recruiterEmail ?? "The recruiter"} was notified on ${recruiterAt}.`,
      }
    : {
        key: "recruiter",
        heading: "Recruiter email",
        ...PENDING,
        detail: recruiterEmail
          ? "Notification is queued and hasn't been sent yet."
          : "No recruiter email is set in Company settings, so nobody is notified yet.",
      };

  const platform: DeliveryCell =
    record.externalSyncStatus === "synced"
      ? {
          key: "platform",
          heading: "Job platform",
          tone: "ok",
          icon: "check_circle",
          title: "Synced",
          detail: triedAt
            ? `Reached the job platform on ${triedAt}.`
            : "Reached the job platform.",
        }
      : record.externalSyncStatus === "failed"
        ? {
            key: "platform",
            heading: "Job platform",
            tone: "danger",
            icon: "sync_problem",
            title: `Failed · ${triesText(attempts)}`,
            detail: triedAt
              ? `Last try ${triedAt}.`
              : "Will try again automatically.",
          }
        : {
            key: "platform",
            heading: "Job platform",
            ...PENDING,
            title:
              attempts > 0 ? `Pending · ${triesText(attempts)}` : "Pending",
            detail: "Will try again automatically.",
          };

  return [applicant, recruiter, platform];
}

type ApplicationStatus = keyof typeof STATUS_SETS.application;

export function statusLabel(status: unknown): string {
  return (
    STATUS_SETS.application[status as ApplicationStatus]?.label ??
    String(status ?? "")
  );
}

export function savedToast(
  status: string,
  previous: string,
  previousCount: number,
): { title: string; body: string } {
  return {
    title: `Marked ${statusLabel(status)}.`,
    body: `${statusLabel(previous)} now has ${previousCount}. The applicant wasn't emailed.`,
  };
}

export const LIST_PARAM = "list";

const SEARCHABLE_FIELDS = ["applicantName", "email"];

export type ListContext = {
  query: string;
  where: Where;
  sort: string;
  status: string | undefined;
};

export function listContext(query: string | undefined): ListContext {
  const parsed = parse(query ?? "", { depth: 10 }) as {
    where?: Where;
    sort?: string;
    search?: string;
  };
  const filters: Where[] = parsed.where ? [parsed.where] : [];
  const search = parsed.search?.trim();
  if (search) {
    filters.push({
      or: SEARCHABLE_FIELDS.map((field) => ({ [field]: { like: search } })),
    });
  }
  const status = (parsed.where as { status?: { equals?: unknown } } | undefined)
    ?.status?.equals;
  return {
    query: query ?? "",
    where: filters.length > 0 ? { and: filters } : {},
    sort: typeof parsed.sort === "string" && parsed.sort ? parsed.sort : "",
    status: typeof status === "string" ? status : undefined,
  };
}

export function backLabel(status: string | undefined, count: number): string {
  return `${status ? statusLabel(status) : "Career applications"} (${count})`;
}
