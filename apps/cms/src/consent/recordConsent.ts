import type { Payload } from "payload";

import { CONSENT_TYPES } from "../collections/ConsentLogs";
import { SYSTEM_WRITE } from "../fields/systemWrite";

export type ConsentType = (typeof CONSENT_TYPES)[number];

export interface RecordConsentInput {
  payload: Payload;
  tenant: number;
  consentType: ConsentType;
  relatedRecordId: string;
  policyVersion: string;
  timestamp: Date | string;
}

export interface RecordConsentResult {
  id: number;
  created: boolean;
}

async function findExisting(
  payload: Payload,
  consentType: ConsentType,
  relatedRecordId: string,
) {
  const {
    docs: [existing],
  } = await payload.find({
    collection: "consent-logs",
    where: {
      consentType: { equals: consentType },
      relatedRecordId: { equals: relatedRecordId },
    },
    limit: 1,
    depth: 0,
    pagination: false,
    overrideAccess: true,
    context: SYSTEM_WRITE,
  });
  return existing;
}

export async function recordConsent(
  input: RecordConsentInput,
): Promise<RecordConsentResult> {
  const { payload, tenant, consentType, relatedRecordId, policyVersion } =
    input;
  const timestamp =
    input.timestamp instanceof Date
      ? input.timestamp.toISOString()
      : input.timestamp;

  const existing = await findExisting(payload, consentType, relatedRecordId);
  if (existing) return { id: existing.id, created: false };

  try {
    const row = await payload.create({
      collection: "consent-logs",
      data: { tenant, consentType, relatedRecordId, policyVersion, timestamp },
      context: SYSTEM_WRITE,
      depth: 0,
    });
    return { id: row.id, created: true };
  } catch (error) {
    const raced = await findExisting(payload, consentType, relatedRecordId);
    if (raced) return { id: raced.id, created: false };
    throw error;
  }
}
