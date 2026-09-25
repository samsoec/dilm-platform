import {
  TENANT_DOMAINS,
  TENANT_SLUGS,
  type TenantSlug,
} from "@dilm/shared-types";
import type { Payload } from "payload";

import { localization } from "../localization";
import type { Tenant } from "../payload-types";

export type TenantSeed = Pick<Tenant, "name" | "domain" | "defaultLocale"> & {
  slug: TenantSlug;
};

const TENANT_NAMES: Record<TenantSlug, string> = {
  indoacid: "Indonesian Acids Industry",
  duniakimia: "Dunia Kimia Utama",
  likutelaga: "Liku Telaga",
};

export const TENANT_SEED: TenantSeed[] = TENANT_SLUGS.map((slug) => ({
  name: TENANT_NAMES[slug],
  slug,
  domain: TENANT_DOMAINS[slug],
  defaultLocale: localization.defaultLocale,
}));

export type SeedOutcome = "created" | "updated" | "unchanged";

export type SeedTenantsResult = {
  outcomes: Record<TenantSlug, SeedOutcome>;
  unexpectedSlugs: string[];
};

export async function seedTenants(
  payload: Payload,
): Promise<SeedTenantsResult> {
  const outcomes = {} as Record<TenantSlug, SeedOutcome>;

  for (const tenant of TENANT_SEED) {
    const {
      docs: [existing],
    } = await payload.find({
      collection: "tenants",
      where: { slug: { equals: tenant.slug } },
      limit: 1,
      depth: 0,
    });

    if (!existing) {
      await payload.create({ collection: "tenants", data: tenant });
      outcomes[tenant.slug] = "created";
    } else if (
      existing.name === tenant.name &&
      existing.domain === tenant.domain &&
      existing.defaultLocale === tenant.defaultLocale
    ) {
      outcomes[tenant.slug] = "unchanged";
    } else {
      await payload.update({
        collection: "tenants",
        id: existing.id,
        data: tenant,
      });
      outcomes[tenant.slug] = "updated";
    }
  }

  const { docs: unexpected } = await payload.find({
    collection: "tenants",
    where: { slug: { not_in: [...TENANT_SLUGS] } },
    pagination: false,
    depth: 0,
  });

  return { outcomes, unexpectedSlugs: unexpected.map((doc) => doc.slug) };
}
