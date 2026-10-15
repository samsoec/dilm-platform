import type { Payload, TypedUser } from "payload";

export type TenantID = number | string;

export type AdminQueryContext = { payload: Payload; user: TypedUser };

type BadgeQuery = (
  context: AdminQueryContext,
  tenant: TenantID,
) => Promise<number>;

export const NAV_BADGES = {
  "cv-received": async ({ payload, user }, tenant) => {
    const { totalDocs } = await payload.count({
      collection: "cv-submissions",
      where: {
        and: [
          { tenant: { equals: tenant } },
          { status: { equals: "received" } },
        ],
      },
      overrideAccess: false,
      user,
    });
    return totalDocs;
  },
} satisfies Record<string, BadgeQuery>;

export type NavBadgeKey = keyof typeof NAV_BADGES;
