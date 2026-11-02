import type { Payload, PayloadRequest } from "payload";

export const RECORD_COLLECTIONS = ["products", "solutions"] as const;

export type RecordCollection = (typeof RECORD_COLLECTIONS)[number];

export type BasePaths = Record<string, string | null | undefined>;

export type RecordBaseSource = (args: {
  payload: Payload;
  req: Partial<PayloadRequest> | undefined;
}) => Promise<BasePaths | undefined>;

// TODO(DILM-106): register the site-routing sources for products and solutions once that global exists.
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
): Promise<BasePaths> {
  const source = recordBaseSources[collection];
  return (await source?.({ payload, req })) ?? {};
}
