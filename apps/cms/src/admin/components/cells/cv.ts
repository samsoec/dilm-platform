import type { IconName } from "../../icons";

export type Tone = "brand" | "muted" | "ok" | "warn" | "danger";

export type CellBadge = {
  icon: IconName;
  label: string;
  tone: Tone;
};

export const STATUS_BADGES: Record<string, CellBadge> = {
  received: { icon: "inbox", label: "Received", tone: "brand" },
  reviewed: { icon: "visibility", label: "Reviewed", tone: "muted" },
  shortlisted: { icon: "check_circle", label: "Shortlisted", tone: "ok" },
  rejected: { icon: "remove", label: "Rejected", tone: "danger" },
};

export function statusBadge(status: unknown): CellBadge | undefined {
  return typeof status === "string" ? STATUS_BADGES[status] : undefined;
}

const jakartaTime = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Jakarta",
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

export function formatJakarta(value: unknown): string | undefined {
  if (typeof value !== "string" && !(value instanceof Date)) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  return jakartaTime.format(date).replace(",", "");
}

export type EmailMark = {
  who: "Applicant" | "Recruiter";
  sent: boolean;
  icon: IconName;
  text: string;
};

function emailMark(
  who: EmailMark["who"],
  sentIcon: IconName,
  at: unknown,
): EmailMark {
  const when = formatJakarta(at);
  return when
    ? { who, sent: true, icon: sentIcon, text: `${who} notified ${when}` }
    : { who, sent: false, icon: "remove", text: `${who} not notified yet` };
}

export function emailMarks(rowData: {
  applicantNotifiedAt?: unknown;
  recruiterNotifiedAt?: unknown;
}): EmailMark[] {
  return [
    emailMark("Applicant", "mark_email_read", rowData.applicantNotifiedAt),
    emailMark("Recruiter", "person_check", rowData.recruiterNotifiedAt),
  ];
}

export function syncBadge(status: unknown, attempts: unknown): CellBadge {
  const tries = typeof attempts === "number" ? attempts : 0;
  if (status === "synced") {
    return { icon: "check_circle", label: "Synced", tone: "ok" };
  }
  if (status === "failed") {
    return {
      icon: "sync_problem",
      label: `Failed · ${tries} ${tries === 1 ? "try" : "tries"}`,
      tone: "danger",
    };
  }
  return { icon: "schedule_send", label: "Pending", tone: "warn" };
}
