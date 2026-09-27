import { TENANT_NAMES, type TenantSlug } from "@dilm/shared-types";

import type { CvSubmission } from "../payload-types";
import type { localization } from "../localization";

type Locale = (typeof localization.locales)[number];

export interface EmailContent {
  subject: string;
  text: string;
}

type SubmissionDetails = Pick<
  CvSubmission,
  | "submissionId"
  | "applicantName"
  | "email"
  | "phone"
  | "position"
  | "submittedAt"
>;

function oneLine(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function jakartaTime(iso: string): string {
  return `${new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Jakarta",
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso))} WIB`;
}

export function applicantConfirmation(
  submission: SubmissionDetails,
  tenant: TenantSlug,
  locale: Locale,
): EmailContent {
  const company = TENANT_NAMES[tenant];
  const name = oneLine(submission.applicantName);
  const position = oneLine(submission.position);

  if (locale === "id") {
    return {
      subject: `Lamaran Anda untuk posisi ${position} telah kami terima`,
      text: [
        `Halo ${name},`,
        "",
        `Terima kasih telah melamar posisi ${position} di ${company}. Lamaran dan CV Anda telah kami terima dan akan ditinjau oleh tim rekrutmen kami.`,
        "Kami akan menghubungi Anda apabila profil Anda sesuai dengan kebutuhan kami.",
        "",
        `Nomor referensi: ${submission.submissionId}`,
        "",
        "Email ini dikirim otomatis, mohon tidak membalas.",
        company,
      ].join("\n"),
    };
  }

  return {
    subject: `We received your application for ${position}`,
    text: [
      `Hello ${name},`,
      "",
      `Thank you for applying for the ${position} position at ${company}. We have received your application and CV, and our recruitment team will review it.`,
      "We will contact you if your profile matches what we are looking for.",
      "",
      `Reference number: ${submission.submissionId}`,
      "",
      "This email was sent automatically; please do not reply.",
      company,
    ].join("\n"),
  };
}

export function recruiterNotification(
  submission: SubmissionDetails,
  tenant: TenantSlug,
): EmailContent {
  const name = oneLine(submission.applicantName);
  const position = oneLine(submission.position);
  return {
    subject: `New application: ${position} — ${name}`,
    text: [
      `A new application was submitted on the ${TENANT_NAMES[tenant]} website.`,
      "",
      `Name: ${name}`,
      `Email: ${oneLine(submission.email)}`,
      `Phone: ${oneLine(submission.phone)}`,
      `Position: ${position}`,
      `Submitted: ${jakartaTime(submission.submittedAt)}`,
      `Reference: ${submission.submissionId}`,
      "",
      "Open CV submissions in the CMS admin panel to read the résumé and update the status.",
    ].join("\n"),
  };
}
