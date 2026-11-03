import type { Payload, PayloadRequest } from "payload";

export const RECORD_COLLECTIONS = ["products", "solutions"] as const;

export type RecordCollection = (typeof RECORD_COLLECTIONS)[number];

export type BasePaths = Record<string, string | null | undefined>;

export type RecordBaseSource = (args: {
  payload: Payload;
  req: Partial<PayloadRequest> | undefined;
}) => Promise<BasePaths | undefined>;

export const recordBaseSources: Partial<
  Record<RecordCollection, RecordBaseSource>
> = {};

export function isRecordCollection(
  collection: string,
): collection is RecordCollection {
  return (RECORD_COLLECTIONS as readonly string[]).includes(collection);
}

export async function recordBasePaths(
  payload: Payload,
  req: Partial<PayloadRequest> | undefined,
  collection: RecordCollection,
): Promise<BasePaths | undefined> {
  const source = recordBaseSources[collection];
  return source ? source({ payload, req }) : {};
}

export type JobBaseSource = (args: {
  payload: Payload;
  req: Partial<PayloadRequest> | undefined;
  tenant: string;
}) => Promise<BasePaths | undefined>;

export const jobBaseSources: { career?: JobBaseSource } = {};

export async function jobBasePaths(
  payload: Payload,
  req: Partial<PayloadRequest> | undefined,
  tenant: string | undefined,
): Promise<BasePaths | undefined> {
  if (!tenant) return undefined;
  const source = jobBaseSources.career;
  return source ? source({ payload, req, tenant }) : {};
}
