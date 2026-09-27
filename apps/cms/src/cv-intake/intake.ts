import type { JobPlatformConfig } from "@dilm/runtime-config";
import type { CvQueueMessage, TenantSlug } from "@dilm/shared-types";
import type { Payload } from "payload";

import { tenantSender } from "../email";
import type { CvSubmission, Tenant } from "../payload-types";
import { applicantConfirmation, recruiterNotification } from "./emails";
import { postToJobPlatform } from "./webhook";

export interface CvIntakeContext {
  payload: Payload;
  jobPlatform?: JobPlatformConfig;
  fetch?: typeof fetch;
  now?: () => Date;
}

export class CvIntakeError extends AggregateError {
  constructor(
    readonly submissionId: string,
    errors: unknown[],
  ) {
    super(
      errors,
      `CV submission ${submissionId}: ${errors
        .map((error) => (error as Error).message)
        .join("; ")}`,
    );
    this.name = "CvIntakeError";
  }
}

type Step = (submission: CvSubmission) => Promise<void>;

async function findTenant(payload: Payload, slug: TenantSlug) {
  const {
    docs: [tenant],
  } = await payload.find({
    collection: "tenants",
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
  });
  if (!tenant) throw new Error(`Tenant "${slug}" is not seeded`);
  return tenant;
}

async function findSubmission(payload: Payload, submissionId: string) {
  const {
    docs: [submission],
  } = await payload.find({
    collection: "cv-submissions",
    where: { submissionId: { equals: submissionId } },
    limit: 1,
    depth: 0,
  });
  return submission;
}

export async function upsertSubmission(
  payload: Payload,
  message: CvQueueMessage,
  tenant: Tenant,
  submittedAt: Date,
): Promise<CvSubmission> {
  const existing = await findSubmission(payload, message.submissionId);
  if (existing) return existing;
  try {
    return await payload.create({
      collection: "cv-submissions",
      data: {
        tenant: tenant.id,
        submissionId: message.submissionId,
        ...message.fields,
        resumeFileKey: message.resumeFileKey,
        submittedAt: submittedAt.toISOString(),
        status: "received",
        externalSyncStatus: "pending",
        externalSyncAttempts: 0,
      },
      depth: 0,
    });
  } catch (error) {
    const raced = await findSubmission(payload, message.submissionId);
    if (raced) return raced;
    throw error;
  }
}

async function recruiterEmail(payload: Payload, tenant: Tenant) {
  const {
    docs: [settings],
  } = await payload.find({
    collection: "tenant-settings",
    where: { tenant: { equals: tenant.id } },
    limit: 1,
    depth: 0,
  });
  if (!settings?.recruiterEmail) {
    throw new Error(
      `Tenant "${tenant.slug}" has no recruiterEmail in tenant-settings`,
    );
  }
  return settings.recruiterEmail;
}

export async function processCvMessage(
  context: CvIntakeContext,
  message: CvQueueMessage,
  submittedAt: Date,
): Promise<CvSubmission> {
  const { payload, jobPlatform } = context;
  const now = context.now ?? (() => new Date());
  const slug = message.tenant;
  const tenant = await findTenant(payload, slug);
  let submission = await upsertSubmission(
    payload,
    message,
    tenant,
    submittedAt,
  );
  const log = payload.logger.child({ submissionId: submission.submissionId });

  const stamp = async (data: Partial<CvSubmission>) => {
    submission = await payload.update({
      collection: "cv-submissions",
      id: submission.id,
      data,
      depth: 0,
    });
  };

  const notifyApplicant: Step = async (current) => {
    if (current.applicantNotifiedAt) return;
    await payload.sendEmail({
      from: tenantSender(slug),
      to: current.email,
      ...applicantConfirmation(current, slug, tenant.defaultLocale),
    });
    await stamp({ applicantNotifiedAt: now().toISOString() });
    log.info("applicant confirmation sent");
  };

  const notifyRecruiter: Step = async (current) => {
    if (current.recruiterNotifiedAt) return;
    await payload.sendEmail({
      from: tenantSender(slug),
      to: await recruiterEmail(payload, tenant),
      replyTo: current.email,
      ...recruiterNotification(current, slug),
    });
    await stamp({ recruiterNotifiedAt: now().toISOString() });
    log.info("recruiter notification sent");
  };

  const syncJobPlatform: Step = async (current) => {
    if (current.externalSyncStatus === "synced") return;
    if (!jobPlatform) {
      log.warn("job-platform webhook not configured; left pending");
      return;
    }
    const externalSyncAttempts = current.externalSyncAttempts + 1;
    try {
      await postToJobPlatform(jobPlatform, current, slug, context.fetch);
    } catch (error) {
      await stamp({ externalSyncStatus: "failed", externalSyncAttempts });
      throw error;
    }
    await stamp({ externalSyncStatus: "synced", externalSyncAttempts });
    log.info("sent to the job platform");
  };

  const errors: unknown[] = [];
  for (const step of [notifyApplicant, notifyRecruiter, syncJobPlatform]) {
    try {
      await step(submission);
    } catch (error) {
      errors.push(error);
    }
  }
  if (errors.length > 0) {
    throw new CvIntakeError(submission.submissionId, errors);
  }
  return submission;
}
