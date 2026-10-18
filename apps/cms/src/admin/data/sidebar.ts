import { hasTenantAccess, isSuperAdmin, type RoleHolder } from "../../access";
import { localization } from "../../localization";
import type { Media, Tenant } from "../../payload-types";
import { type TenantColors, tenantColors } from "../brandColor";
import {
  type AdminQueryContext,
  NAV_BADGES,
  type NavBadgeKey,
  type TenantID,
} from "./badges";
import { COMPLETENESS_SELECT, settingsNeedAttention } from "./completeness";

export const TENANT_COOKIE = "payload-tenant";

export type SidebarTenant = {
  id: TenantID;
  name: string;
  slug?: string;
  domain?: string;
  colors: TenantColors;
  logo?: { url: string; alt: string };
};

export type SidebarData = {
  tenant?: SidebarTenant;
  attention: boolean;
  badges: Partial<Record<NavBadgeKey, number>>;
};

type TenantRow = { tenant: number | string | { id: number | string } };

function rowTenantID({ tenant }: TenantRow): TenantID {
  return typeof tenant === "object" ? tenant.id : tenant;
}

export function selectedTenantID(
  user: RoleHolder,
  cookie: string | undefined,
): TenantID | undefined {
  if (cookie && hasTenantAccess(user, cookie)) {
    return /^\d+$/.test(cookie) ? Number(cookie) : cookie;
  }
  const rows = (user?.tenants ?? []) as TenantRow[];
  if (!isSuperAdmin(user) && rows.length === 1) return rowTenantID(rows[0]);
  return undefined;
}

function sidebarTenant(
  tenant: Pick<Tenant, "id" | "name" | "slug" | "domain" | "brandColor">,
  logo: Media | number | null | undefined,
): SidebarTenant {
  return {
    id: tenant.id,
    name: tenant.name,
    slug: tenant.slug,
    domain: tenant.domain,
    colors: tenantColors(tenant.brandColor),
    logo:
      typeof logo === "object" && logo?.url
        ? { url: logo.url, alt: logo.alt }
        : undefined,
  };
}

async function loadTenantCard(
  { payload, user }: AdminQueryContext,
  tenant: TenantID,
): Promise<Pick<SidebarData, "tenant" | "attention">> {
  const {
    docs: [settings],
  } = await payload.find({
    collection: "tenant-settings",
    where: { tenant: { equals: tenant } },
    limit: 1,
    pagination: false,
    depth: 1,
    locale: localization.defaultLocale,
    select: { ...COMPLETENESS_SELECT, tenant: true },
    populate: {
      tenants: { name: true, slug: true, domain: true, brandColor: true },
    },
    overrideAccess: false,
    user,
  });

  if (settings && typeof settings.tenant === "object" && settings.tenant) {
    return {
      tenant: sidebarTenant(settings.tenant, settings.brand?.logoOnDark),
      attention: settingsNeedAttention(settings),
    };
  }

  return { tenant: undefined, attention: true };
}

async function loadBadges(
  context: AdminQueryContext,
  tenant: TenantID,
  keys: NavBadgeKey[],
): Promise<SidebarData["badges"]> {
  const counts = await Promise.all(
    keys.map(async (key) => [key, await NAV_BADGES[key](context, tenant)]),
  );
  return Object.fromEntries(counts);
}

export async function loadSidebar(
  context: AdminQueryContext,
  tenant: TenantID | undefined,
  badgeKeys: NavBadgeKey[],
  withSettings: boolean,
): Promise<SidebarData> {
  if (tenant === undefined) return { attention: false, badges: {} };
  const [card, badges] = await Promise.all([
    withSettings
      ? loadTenantCard(context, tenant)
      : Promise.resolve({ tenant: undefined, attention: false }),
    loadBadges(context, tenant, [...new Set(badgeKeys)]),
  ]);
  return { ...card, attention: withSettings && card.attention, badges };
}

export type NavPreferences = {
  groups?: Record<string, { open?: boolean }>;
};
