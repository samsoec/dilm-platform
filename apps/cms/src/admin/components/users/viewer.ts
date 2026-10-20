import { headers } from "next/headers";
import type { BasePayload } from "payload";
import { cache } from "react";

import { isSuperAdmin, type RoleHolder } from "../../../access";
import { userStatus, type UserStatus } from "./users";

export const currentUser = cache(async (payload: BasePayload) => {
  const { user } = await payload.auth({ headers: await headers() });
  return user;
});

const lockTimes = cache(
  async (payload: BasePayload): Promise<Map<string, string | null>> => {
    const user = await currentUser(payload);
    if (!user || !isSuperAdmin(user as RoleHolder)) return new Map();
    const { docs } = await payload.find({
      collection: "users",
      select: { lockUntil: true },
      showHiddenFields: true,
      pagination: false,
      depth: 0,
      overrideAccess: false,
      user,
    });
    return new Map(
      docs.map((doc) => [
        String(doc.id),
        (doc as { lockUntil?: string | null }).lockUntil ?? null,
      ]),
    );
  },
);

export async function rowStatus(
  payload: BasePayload,
  row: Record<string, unknown>,
): Promise<UserStatus> {
  const lockUntil = (await lockTimes(payload)).get(String(row.id));
  return userStatus(
    { lastLoginAt: row.lastLoginAt as string | null | undefined, lockUntil },
    new Date(),
  );
}

export type Company = {
  id: number;
  name: string;
  domain?: string;
  brandColor?: string | null;
};

export const companies = cache(
  async (payload: BasePayload): Promise<Company[]> => {
    const user = await currentUser(payload);
    if (!user) return [];
    const { docs } = await payload.find({
      collection: "tenants",
      select: { name: true, domain: true, brandColor: true },
      sort: "name",
      pagination: false,
      depth: 0,
      overrideAccess: false,
      user,
    });
    return docs as Company[];
  },
);

type TenantRef = { tenant?: number | string | { id: number | string } };

export function tenantIDs(row: Record<string, unknown>): number[] {
  const rows = Array.isArray(row.tenants) ? (row.tenants as TenantRef[]) : [];
  return rows.map(({ tenant }) =>
    Number(typeof tenant === "object" ? tenant.id : tenant),
  );
}
