import { TENANT_DOMAINS, type TenantSlug } from "@dilm/shared-types";

import { localization } from "../localization";
import { TENANT_OWNED, type LinkData } from "./link";

type TenantRef =
  | number
  | string
  | { id: number | string; slug?: string | null; domain?: string | null }
  | null
  | undefined;

export type ResolveOptions = {
  tenant?: TenantRef;
  locale?: string;
  domains?: Record<string, string>;
  warn?: (message: string) => void;
};

type TargetDoc = {
  id?: number | string;
  _status?: string | null;
  deletedAt?: string | null;
  tenant?: TenantRef;
  path?: string | Record<string, string | null | undefined> | null;
};

function tenantId(value: TenantRef): string | undefined {
  if (value === null || value === undefined || value === "") return undefined;
  return String(typeof value === "object" ? value.id : value);
}

function pathIn(path: TargetDoc["path"], locale: string): string | undefined {
  if (!path) return undefined;
  if (typeof path === "string") return path;
  return path[locale] || path[localization.defaultLocale] || undefined;
}

function domainOf(
  owner: NonNullable<TenantRef>,
  domains: Record<string, string> | undefined,
): string | undefined {
  if (typeof owner === "object") {
    if (owner.domain) return owner.domain;
    if (owner.slug && owner.slug in TENANT_DOMAINS) {
      return TENANT_DOMAINS[owner.slug as TenantSlug];
    }
  }
  return domains?.[String(typeof owner === "object" ? owner.id : owner)];
}

export function resolveLink(
  link: LinkData | null | undefined,
  {
    tenant,
    locale = localization.defaultLocale,
    domains,
    warn,
  }: ResolveOptions = {},
): string | null {
  if (!link) return null;
  const type = link.type ?? "internal";
  if (type === "internal") return link.internalPath || null;
  if (type === "external") return link.externalUrl || null;

  const log = warn ?? ((message: string) => console.warn(message));
  const reference = link.reference;
  const label = reference
    ? `${reference.relationTo}:${tenantId(reference.value as TenantRef)}`
    : "empty";
  const doc = reference?.value;
  if (!doc || typeof doc !== "object") {
    log(
      `Link target ${label} is missing or unreadable; showing the label only.`,
    );
    return null;
  }
  const target = doc as TargetDoc;
  const live =
    reference.relationTo === "categories" || target._status === "published";
  if (!live || target.deletedAt) {
    log(`Link target ${label} is not published; showing the label only.`);
    return null;
  }
  const path = pathIn(target.path, locale);
  if (!path) {
    log(
      `Link target ${label} has no path in ${locale}; showing the label only.`,
    );
    return null;
  }
  const owner = tenantId(target.tenant);
  if (
    !owner ||
    !TENANT_OWNED.includes(reference.relationTo) ||
    owner === tenantId(tenant)
  ) {
    return path;
  }
  const domain = domainOf(target.tenant as NonNullable<TenantRef>, domains);
  if (!domain) {
    log(
      `Link target ${label} belongs to company ${owner} with no known domain; showing the label only.`,
    );
    return null;
  }
  return `https://${domain}${path}`;
}
