import { createHmac } from "node:crypto";

import type { JobPlatformConfig } from "@dilm/runtime-config";
import type { TenantSlug } from "@dilm/shared-types";

import type { CvSubmission } from "../payload-types";

export const JOB_PLATFORM_TIMEOUT_MS = 10_000;
export const SIGNATURE_HEADER = "X-DILM-Signature";
export const IDEMPOTENCY_HEADER = "Idempotency-Key";

export class JobPlatformError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "JobPlatformError";
  }
}

export function signWebhookBody(body: string, secret: string): string {
  return `sha256=${createHmac("sha256", secret).update(body).digest("hex")}`;
}

// TODO(job-platform contract): replace this provisional payload, header
// names and the résumé hand-off once the platform's webhook spec is agreed.
export function jobPlatformPayload(
  submission: CvSubmission,
  tenant: TenantSlug,
) {
  return {
    submissionId: submission.submissionId,
    tenant,
    applicantName: submission.applicantName,
    email: submission.email,
    phone: submission.phone,
    position: submission.position,
    submittedAt: submission.submittedAt,
    resumeFileKey: submission.resumeFileKey,
  };
}

export async function postToJobPlatform(
  config: JobPlatformConfig,
  submission: CvSubmission,
  tenant: TenantSlug,
  fetchImpl: typeof fetch = fetch,
): Promise<void> {
  const body = JSON.stringify(jobPlatformPayload(submission, tenant));
  let response: Response;
  try {
    response = await fetchImpl(config.webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        [IDEMPOTENCY_HEADER]: submission.submissionId,
        [SIGNATURE_HEADER]: signWebhookBody(body, config.webhookSecret),
      },
      body,
      signal: AbortSignal.timeout(JOB_PLATFORM_TIMEOUT_MS),
    });
  } catch (error) {
    throw new JobPlatformError(
      `Job-platform webhook request failed: ${(error as Error).message}`,
    );
  }
  if (!response.ok) {
    throw new JobPlatformError(
      `Job-platform webhook answered HTTP ${response.status}`,
      response.status,
    );
  }
}
