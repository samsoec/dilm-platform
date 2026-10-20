import { headers } from "next/headers";
import type { BasePayload } from "payload";
import { cache } from "react";

const currentUser = cache(async (payload: BasePayload) => {
  const { user } = await payload.auth({ headers: await headers() });
  return user;
});

export const readableApplications = cache(
  async (payload: BasePayload): Promise<Map<string, number | string>> => {
    const user = await currentUser(payload);
    if (!user) return new Map();
    const { docs } = await payload.find({
      collection: "cv-submissions",
      select: { submissionId: true },
      pagination: false,
      depth: 0,
      overrideAccess: false,
      user,
    });
    return new Map(docs.map((doc) => [doc.submissionId, doc.id]));
  },
);

export async function relatedApplicationURL(
  payload: BasePayload,
  consentType: unknown,
  relatedRecordId: string,
): Promise<string | undefined> {
  if (consentType !== "career-application" || !relatedRecordId) return;
  const id = (await readableApplications(payload)).get(relatedRecordId);
  if (id === undefined) return;
  return `${payload.config.routes.admin}/collections/cv-submissions/${encodeURIComponent(String(id))}`;
}
