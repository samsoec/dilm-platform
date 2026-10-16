import { CV_STATUSES } from "../../collections/CvSubmissions";
import type { AdminQueryContext, TenantID } from "./badges";

export type CvStatus = (typeof CV_STATUSES)[number];

export type CvStatusCounts = Record<CvStatus, number>;

export async function loadStatusCounts(
  { payload, user }: AdminQueryContext,
  tenant: TenantID,
): Promise<CvStatusCounts> {
  const counts = await Promise.all(
    CV_STATUSES.map(async (status) => {
      const { totalDocs } = await payload.count({
        collection: "cv-submissions",
        where: {
          and: [{ tenant: { equals: tenant } }, { status: { equals: status } }],
        },
        overrideAccess: false,
        user,
      });
      return [status, totalDocs] as const;
    }),
  );
  return Object.fromEntries(counts) as CvStatusCounts;
}
