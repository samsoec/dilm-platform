import type { IconName } from "../../icons";

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
