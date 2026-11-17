import type { ContactQueueMessage } from "@dilm/shared-types";
import type { Payload } from "payload";

import { recordConsent } from "../consent/recordConsent";
import { SYSTEM_WRITE } from "../fields/systemWrite";
import type { ContactSubmission, Tenant } from "../payload-types";
import { type CvIntakeContext, findTenant } from "./intake";

export type ContactStep = (
  submission: ContactSubmission,
  tenant: Tenant,
) => Promise<void>;

export interface ContactIntakeContext extends CvIntakeContext {
  contactSteps?: Record<string, ContactStep>;
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

export const notifyTeam: ContactStep = async () => {
  // TODO(DILM-166): email the tenant's contact inbox and stamp teamNotifiedAt
};

export const notifySender: ContactStep = async () => {
  // TODO(DILM-166): email the sender a confirmation and stamp senderNotifiedAt
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
      await step(submission, tenant);
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
