import { headers } from "next/headers";
import type { BasePayload } from "payload";
import { cache } from "react";

import { type RelatedCollection, relatedCollection } from "./consent";

const currentUser = cache(async (payload: BasePayload) => {
  const { user } = await payload.auth({ headers: await headers() });
  return user;
});

export const readableRecords = cache(
  async (
    payload: BasePayload,
    collection: RelatedCollection,
  ): Promise<Map<string, number | string>> => {
    const user = await currentUser(payload);
    if (!user) return new Map();
    const { docs } = await payload.find({
      collection,
      select: { submissionId: true },
      pagination: false,
      depth: 0,
      overrideAccess: false,
      user,
    });
    return new Map(docs.map((doc) => [doc.submissionId, doc.id]));
  },
);

export async function relatedRecordURL(
  payload: BasePayload,
  consentType: unknown,
  relatedRecordId: string,
): Promise<string | undefined> {
  const collection = relatedCollection(consentType);
  if (!collection || !relatedRecordId) return;
  const id = (await readableRecords(payload, collection)).get(relatedRecordId);
  if (id === undefined) return;
  return `${payload.config.routes.admin}/collections/${collection}/${encodeURIComponent(String(id))}`;
}
