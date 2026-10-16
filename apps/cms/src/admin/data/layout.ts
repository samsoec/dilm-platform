import type { Payload, TypedUser } from "payload";

import type { TenantSetting } from "../../payload-types";

export type LayoutSources = Pick<
  TenantSetting,
  "id" | "contactEmail" | "contactPhone" | "socialLinks"
> & {
  brand?: Pick<
    NonNullable<TenantSetting["brand"]>,
    "logoOnDark" | "logoOnLight" | "legalName" | "address"
  > | null;
};

export function documentTenant(data: unknown): number | string | undefined {
  const tenant = (data as { tenant?: unknown } | undefined)?.tenant;
  if (typeof tenant === "number" || typeof tenant === "string") return tenant;
  if (tenant && typeof tenant === "object" && "id" in tenant) {
    return (tenant as { id: number | string }).id;
  }
  return undefined;
}

export async function loadLayoutSources(
  payload: Payload,
  user: TypedUser | null | undefined,
  tenant: number | string | undefined,
): Promise<LayoutSources | undefined> {
  if (tenant === undefined || !user) return undefined;
  const {
    docs: [settings],
  } = await payload.find({
    collection: "tenant-settings",
    where: { tenant: { equals: tenant } },
    limit: 1,
    pagination: false,
    depth: 0,
    select: {
      contactEmail: true,
      contactPhone: true,
      socialLinks: true,
      brand: {
        logoOnDark: true,
        logoOnLight: true,
        legalName: true,
        address: true,
      },
    },
    overrideAccess: false,
    user,
  });
  return settings as LayoutSources | undefined;
}
