import type { Payload, PayloadRequest } from "payload";

import { localization } from "../localization";
import { TENANT_OWNED, type LinkData } from "./link";

type TenantRef =
  | number
  | string
  | { id: number | string; slug?: string | null; domain?: string | null }
  | null
  | undefined;

export type TenantDomains = Record<string, string>;

export type ResolveOptions = {
  tenant?: TenantRef;
  locale?: string;
  domains?: TenantDomains;
  payload?: Payload;
  req?: PayloadRequest;
  warn?: (message: string) => void;
};

const DOMAIN_CACHE_MS = 60_000;

const domainCache = new WeakMap<
  object,
  { at: number; domains: Promise<TenantDomains> }
>();

export function normalizeDomain(value: string): string {
  return value
    .trim()
    .replace(/^[a-z][a-z0-9+.-]*:\/\//i, "")
    .replace(/\/.*$/, "")
    .toLowerCase();
}

export function loadTenantDomains(
  payload: Payload,
  req?: PayloadRequest,
): Promise<TenantDomains> {
  const key: object = req ?? payload;
  const cached = domainCache.get(key);
  if (cached && Date.now() - cached.at < DOMAIN_CACHE_MS) {
    return cached.domains;
  }
  const domains = payload
    .find({
      collection: "tenants",
      depth: 0,
      limit: 0,
      pagination: false,
      overrideAccess: true,
      select: { domain: true },
      ...(req ? { req } : {}),
    })
    .then(({ docs }) => {
      const map: TenantDomains = {};
      for (const doc of docs) {
        if (doc.domain) map[String(doc.id)] = normalizeDomain(doc.domain);
      }
      return map;
    });
  domainCache.set(key, { at: Date.now(), domains });
  domains.catch(() => domainCache.delete(key));
  return domains;
}

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

function populatedDomain(owner: NonNullable<TenantRef>): string | undefined {
  if (typeof owner === "object" && owner.domain) {
    return normalizeDomain(owner.domain);
  }
  return undefined;
}

export async function resolveLink(
  link: LinkData | null | undefined,
  {
    tenant,
    locale = localization.defaultLocale,
    domains,
    payload,
    req,
    warn,
  }: ResolveOptions = {},
): Promise<string | null> {
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
  const ownerRef = target.tenant as NonNullable<TenantRef>;
  let domain = populatedDomain(ownerRef) ?? domains?.[owner];
  if (!domain && payload) {
    domain = (await loadTenantDomains(payload, req))[owner];
  }
  if (!domain) {
    log(
      `Link target ${label} belongs to company ${owner} with no known domain; showing the label only.`,
    );
    return null;
  }
  return `https://${domain}${path}`;
}
