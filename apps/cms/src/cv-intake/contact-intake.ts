import type { ContactQueueMessage, TenantSlug } from "@dilm/shared-types";
import type { Payload } from "payload";

import { recordConsent } from "../consent/recordConsent";
import { tenantSender } from "../email";
import { SYSTEM_WRITE } from "../fields/systemWrite";
import type { ContactSubmission, Tenant } from "../payload-types";
import { senderConfirmation, teamNotification } from "./contact-emails";
import { type CvIntakeContext, findTenant } from "./intake";

export interface ContactStepContext {
  payload: Payload;
  now: () => Date;
}

export type ContactStep = (
  submission: ContactSubmission,
  tenant: Tenant,
  context: ContactStepContext,
) => Promise<void>;

export interface ContactIntakeContext extends CvIntakeContext {
  contactSteps?: Record<string, ContactStep>;
}

function oneLine(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

export class ContactIntakeError extends AggregateError {
  constructor(
    readonly submissionId: string,
    errors: unknown[],
  ) {
    super(
      errors,
      `Contact submission ${submissionId}: ${errors.length} notification step(s) failed`,
    );
    this.name = "ContactIntakeError";
  }
}

async function contactEmail(payload: Payload, tenant: Tenant) {
  const {
    docs: [settings],
  } = await payload.find({
    collection: "tenant-settings",
    where: { tenant: { equals: tenant.id } },
    limit: 1,
    depth: 0,
  });
  if (!settings?.contactEmail) {
    throw new Error(
      `Tenant "${tenant.slug}" has no contactEmail in tenant-settings`,
    );
  }
  return settings.contactEmail;
}

async function stampNotified(
  { payload, now }: ContactStepContext,
  submission: ContactSubmission,
  flag: "teamNotifiedAt" | "senderNotifiedAt",
) {
  await payload.update({
    collection: "contact-submissions",
    id: submission.id,
    data: { [flag]: now().toISOString() },
    context: SYSTEM_WRITE,
    depth: 0,
  });
}

export const notifyTeam: ContactStep = async (submission, tenant, context) => {
  if (submission.teamNotifiedAt) return;
  const { payload } = context;
  const slug = tenant.slug as TenantSlug;
  await payload.sendEmail({
    from: tenantSender(slug),
    to: await contactEmail(payload, tenant),
    replyTo: oneLine(submission.workEmail),
    ...teamNotification(submission, slug),
  });
  await stampNotified(context, submission, "teamNotifiedAt");
  payload.logger.info(
    { submissionId: submission.submissionId },
    "team notification sent",
  );
};

export const notifySender: ContactStep = async (
  submission,
  tenant,
  context,
) => {
  if (submission.senderNotifiedAt) return;
  const { payload } = context;
  const slug = tenant.slug as TenantSlug;
  await payload.sendEmail({
    from: tenantSender(slug),
    to: oneLine(submission.workEmail),
    ...senderConfirmation(submission, slug),
  });
  await stampNotified(context, submission, "senderNotifiedAt");
  payload.logger.info(
    { submissionId: submission.submissionId },
    "sender confirmation sent",
  );
};

async function findSubmission(payload: Payload, submissionId: string) {
  const {
    docs: [submission],
  } = await payload.find({
    collection: "contact-submissions",
    where: { submissionId: { equals: submissionId } },
    limit: 1,
    depth: 0,
  });
  return submission;
}

export async function upsertContactSubmission(
  payload: Payload,
  message: ContactQueueMessage,
  tenant: Tenant,
  submittedAt: Date,
): Promise<ContactSubmission> {
  const existing = await findSubmission(payload, message.submissionId);
  if (existing) return existing;
  try {
    return await payload.create({
      collection: "contact-submissions",
      data: {
        tenant: tenant.id,
        submissionId: message.submissionId,
        ...message.fields,
        locale: message.locale,
        submittedAt: submittedAt.toISOString(),
      },
      context: SYSTEM_WRITE,
      depth: 0,
    });
  } catch (error) {
    const raced = await findSubmission(payload, message.submissionId);
    if (raced) return raced;
    throw error;
  }
}

export async function processContactMessage(
  context: ContactIntakeContext,
  message: ContactQueueMessage,
  submittedAt: Date,
): Promise<ContactSubmission> {
  const { payload } = context;
  const tenant = await findTenant(payload, message.tenant);
  const submission = await upsertContactSubmission(
    payload,
    message,
    tenant,
    submittedAt,
  );
  await recordConsent({
    payload,
    tenant: tenant.id,
    consentType: "contact-form",
    relatedRecordId: message.submissionId,
    policyVersion: message.consent.policyVersion,
    timestamp: submittedAt,
  });
  const steps = context.contactSteps ?? { notifyTeam, notifySender };
  const errors: unknown[] = [];
  for (const [name, step] of Object.entries(steps)) {
    try {
      await step(submission, tenant, {
        payload,
        now: context.now ?? (() => new Date()),
      });
    } catch (error) {
      payload.logger.error(
        { submissionId: message.submissionId, step: name },
        "contact notification step failed",
      );
      errors.push(error);
    }
  }
  if (errors.length > 0) {
    throw new ContactIntakeError(message.submissionId, errors);
  }
  return submission;
}
