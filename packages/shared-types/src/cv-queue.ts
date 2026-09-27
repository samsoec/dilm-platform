import { TENANT_SLUGS, type TenantSlug } from "./tenant";

export interface CvSubmissionFields {
  applicantName: string;
  email: string;
  phone: string;
  position: string;
}

export interface CvQueueMessage {
  submissionId: string;
  tenant: TenantSlug;
  fields: CvSubmissionFields;
  resumeFileKey: string;
}

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

const FIELD_NAMES = [
  "applicantName",
  "email",
  "phone",
  "position",
] as const satisfies readonly (keyof CvSubmissionFields)[];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function nonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim() !== "";
}

export function parseCvQueueMessage(body: string): CvQueueMessage {
  let raw: unknown;
  try {
    raw = JSON.parse(body);
  } catch {
    throw new InvalidCvQueueMessageError(["body is not JSON"]);
  }
  if (!isRecord(raw)) {
    throw new InvalidCvQueueMessageError(["body is not a JSON object"]);
  }

  const problems: string[] = [];
  if (!nonEmptyString(raw.submissionId)) problems.push("submissionId missing");
  if (!TENANT_SLUGS.includes(raw.tenant as TenantSlug)) {
    problems.push(`tenant must be one of ${TENANT_SLUGS.join(", ")}`);
  }
  if (!nonEmptyString(raw.resumeFileKey)) {
    problems.push("resumeFileKey missing");
  }
  const fields = isRecord(raw.fields) ? raw.fields : {};
  for (const name of FIELD_NAMES) {
    if (!nonEmptyString(fields[name])) problems.push(`fields.${name} missing`);
  }
  if (problems.length > 0) throw new InvalidCvQueueMessageError(problems);

  return {
    submissionId: raw.submissionId as string,
    tenant: raw.tenant as TenantSlug,
    resumeFileKey: raw.resumeFileKey as string,
    fields: Object.fromEntries(
      FIELD_NAMES.map((name) => [name, (fields[name] as string).trim()]),
    ) as unknown as CvSubmissionFields,
  };
}
