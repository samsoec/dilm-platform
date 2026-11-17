import { TENANT_NAMES, type TenantSlug } from "@dilm/shared-types";

import type { ContactSubmission } from "../payload-types";

export interface ContactEmailContent {
  subject: string;
  text: string;
  html: string;
}

type InquiryDetails = Pick<
  ContactSubmission,
  | "submissionId"
  | "fullName"
  | "company"
  | "workEmail"
  | "phone"
  | "message"
  | "locale"
  | "submittedAt"
>;

function oneLine(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function jakartaTime(iso: string): string {
  return `${new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Jakarta",
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso))} WIB`;
}

function paragraphs(lines: string[]): string {
  return lines
    .map((line) =>
      line === "" ? "" : `<p>${escapeHtml(line).replace(/\n/g, "<br>")}</p>`,
    )
    .filter(Boolean)
    .join("\n");
}

function build(subject: string, lines: string[]): ContactEmailContent {
  return { subject, text: lines.join("\n"), html: paragraphs(lines) };
}

export function teamNotification(
  inquiry: InquiryDetails,
  tenant: TenantSlug,
): ContactEmailContent {
  const name = oneLine(inquiry.fullName);
  const company = oneLine(inquiry.company);
  return build(`New inquiry from ${name} (${company})`, [
    `A new inquiry was submitted on the ${TENANT_NAMES[tenant]} website.`,
    "",
    `Name: ${name}`,
    `Company: ${company}`,
    `Work email: ${oneLine(inquiry.workEmail)}`,
    `Phone: ${oneLine(inquiry.phone ?? "") || "-"}`,
    `Message:\n${inquiry.message}`,
    "",
    `Submitted: ${jakartaTime(inquiry.submittedAt)}`,
    `Reference: ${inquiry.submissionId}`,
  ]);
}

export function senderConfirmation(
  inquiry: InquiryDetails,
  tenant: TenantSlug,
): ContactEmailContent {
  const company = TENANT_NAMES[tenant];
  const name = oneLine(inquiry.fullName);

  if (inquiry.locale === "id") {
    return build(`Pesan Anda telah kami terima`, [
      `Halo ${name},`,
      "",
      `Terima kasih telah menghubungi ${company}. Pesan Anda telah kami terima dan tim kami akan segera menanggapinya.`,
      "",
      `Pesan Anda:\n${inquiry.message}`,
      "",
      "Email ini dikirim otomatis, mohon tidak membalas.",
      company,
    ]);
  }

  return build(`We received your message`, [
    `Hello ${name},`,
    "",
    `Thank you for contacting ${company}. We have received your message and our team will respond shortly.`,
    "",
    `Your message:\n${inquiry.message}`,
    "",
    "This email was sent automatically; please do not reply.",
    company,
  ]);
}
