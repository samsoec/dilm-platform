import { CONTENT_LOCALES } from "./detail-templates";
import { TENANT_SLUGS, type TenantSlug } from "./tenant";

export interface CvSubmissionFields {
  applicantName: string;
  email: string;
  phone: string;
  position: string;
}

type ContentLocale = (typeof CONTENT_LOCALES)[number];

export interface QueueConsent {
  policyVersion: string;
}

export interface CvQueueMessage {
  kind: "cv";
  submissionId: string;
  tenant: TenantSlug;
  fields: CvSubmissionFields;
  resumeFileKey: string;
  consent: QueueConsent;
}

export interface ContactSubmissionFields {
  fullName: string;
  company: string;
  workEmail: string;
  phone: string;
  message: string;
}

export interface ContactQueueMessage {
  kind: "contact";
  submissionId: string;
  tenant: TenantSlug;
  locale: ContentLocale;
  fields: ContactSubmissionFields;
  consent: QueueConsent;
}

export type QueueMessage = CvQueueMessage | ContactQueueMessage;

export const CONTACT_FIELD_LIMITS = {
  fullName: 120,
  company: 160,
  workEmail: 254,
  phone: 32,
  message: 4000,
} as const satisfies Record<keyof ContactSubmissionFields, number>;

export const CV_CONSUMER_TIMEOUT_SECONDS = 60;
export const CV_CONSUMER_MAX_CONCURRENCY = 2;
export const CV_CONSUMER_BATCH_SIZE = 1;
export const CV_QUEUE_VISIBILITY_TIMEOUT_SECONDS =
  6 * CV_CONSUMER_TIMEOUT_SECONDS;
export const CV_QUEUE_MAX_RECEIVE_COUNT = 5;

export class InvalidCvQueueMessageError extends Error {
  constructor(readonly problems: string[]) {
    super(`Invalid CV queue message: ${problems.join("; ")}.`);
    this.name = "InvalidCvQueueMessageError";
  }
}

const CV_FIELD_NAMES = [
  "applicantName",
  "email",
  "phone",
  "position",
] as const satisfies readonly (keyof CvSubmissionFields)[];

const CONTACT_FIELD_NAMES = Object.keys(
  CONTACT_FIELD_LIMITS,
) as (keyof ContactSubmissionFields)[];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function nonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim() !== "";
}

function trimmedFields<Name extends string>(
  names: readonly Name[],
  fields: Record<string, unknown>,
): Record<Name, string> {
  return Object.fromEntries(
    names.map((name) => [name, (fields[name] as string).trim()]),
  ) as Record<Name, string>;
}

export function parseQueueMessage(body: string): QueueMessage {
  let raw: unknown;
  try {
    raw = JSON.parse(body);
  } catch {
    throw new InvalidCvQueueMessageError(["body is not JSON"]);
  }
  if (!isRecord(raw)) {
    throw new InvalidCvQueueMessageError(["body is not a JSON object"]);
  }
  if (raw.kind !== "cv" && raw.kind !== "contact") {
    throw new InvalidCvQueueMessageError(["kind must be one of cv, contact"]);
  }
  const kind = raw.kind;

  const problems: string[] = [];
  if (!nonEmptyString(raw.submissionId)) problems.push("submissionId missing");
  if (!TENANT_SLUGS.includes(raw.tenant as TenantSlug)) {
    problems.push(`tenant must be one of ${TENANT_SLUGS.join(", ")}`);
  }
  if (kind === "contact" && !CONTENT_LOCALES.includes(raw.locale as never)) {
    problems.push(`locale must be one of ${CONTENT_LOCALES.join(", ")}`);
  }
  if (kind === "cv" && !nonEmptyString(raw.resumeFileKey)) {
    problems.push("resumeFileKey missing");
  }
  const consent = isRecord(raw.consent) ? raw.consent : {};
  if (!nonEmptyString(consent.policyVersion)) {
    problems.push("consent.policyVersion missing");
  }
  const fields = isRecord(raw.fields) ? raw.fields : {};
  const names: readonly string[] =
    kind === "cv" ? CV_FIELD_NAMES : CONTACT_FIELD_NAMES;
  for (const name of names) {
    const value = fields[name];
    if (!nonEmptyString(value)) {
      problems.push(`fields.${name} missing`);
      continue;
    }
    if (kind === "contact") {
      const limit = CONTACT_FIELD_LIMITS[name as keyof ContactSubmissionFields];
      if (value.trim().length > limit) {
        problems.push(`fields.${name} is longer than ${limit} characters`);
      }
    }
  }
  if (
    kind === "contact" &&
    nonEmptyString(fields.workEmail) &&
    !EMAIL_PATTERN.test(fields.workEmail.trim())
  ) {
    problems.push("fields.workEmail is not an email address");
  }
  if (problems.length > 0) throw new InvalidCvQueueMessageError(problems);

  const common = {
    submissionId: raw.submissionId as string,
    tenant: raw.tenant as TenantSlug,
    consent: { policyVersion: (consent.policyVersion as string).trim() },
  };
  if (kind === "cv") {
    return {
      kind,
      ...common,
      resumeFileKey: raw.resumeFileKey as string,
      fields: trimmedFields(CV_FIELD_NAMES, fields),
    };
  }
  return {
    kind,
    ...common,
    locale: raw.locale as ContentLocale,
    fields: trimmedFields(CONTACT_FIELD_NAMES, fields),
  };
}
