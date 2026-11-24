import type {
  CollectionAfterChangeHook,
  Payload,
  PayloadRequest,
} from "payload";

import {
  REVALIDATE_PATH,
  getRuntimeConfig,
  revalidationHeaders,
  signRevalidation,
} from "@dilm/runtime-config";

import { normalizeDomain } from "./fields/linkResolve";
import { localization } from "./localization";

type Logger = Payload["logger"];

type TenantRef =
  | number
  | string
  | {
      id: number | string;
      slug?: string | null;
      domain?: string | null;
    }
  | null
  | undefined;

export type PurgePrefix = {
  host: string;
  pathPrefix: string;
  exact?: boolean;
};

export type RevalidationReason =
  | "layout"
  | "publish"
  | "update"
  | "move"
  | "unpublish"
  | "trash"
  | "delete"
  | "template"
  | "settings";

export type RevalidationChange = {
  tags: string[];
  purge: PurgePrefix[];
  collection?: string;
  reason?: RevalidationReason;
};

export type RevalidationContext = {
  req?: Partial<PayloadRequest>;
};

export type Revalidator = {
  revalidate(
    change: RevalidationChange,
    logger: Logger,
    context?: RevalidationContext,
  ): Promise<void>;
};

export type TenantIdentity = {
  slug: string;
  host: string;
};

export function layoutTag(tenantSlug: string): string {
  return `layout:${tenantSlug}`;
}

export function localePrefixes(
  locales: readonly string[] = localization.locales,
): string[] {
  return locales.map((locale) => `/${locale}/`);
}

export function layoutChange(
  tenant: TenantIdentity,
  locales: readonly string[] = localization.locales,
): RevalidationChange {
  return {
    reason: "layout",
    tags: [layoutTag(tenant.slug)],
    purge: localePrefixes(locales).map((pathPrefix) => ({
      host: tenant.host,
      pathPrefix,
    })),
  };
}

export type SiteRevalidatorOptions = {
  secret?: () => Promise<string | undefined>;
  send?: (
    url: string,
    init: { method: "POST"; headers: Record<string, string>; body: string },
  ) => Promise<{ ok: boolean; status: number; json(): Promise<unknown> }>;
  now?: () => number;
  timeoutMs?: number;
};

export const REVALIDATION_REQUESTED = "Revalidation requested";
export const REVALIDATE_TIMEOUT_MS = 20_000;

export function revalidateUrl(host: string): string {
  const local = host.endsWith(".localhost") || /:\d+$/.test(host);
  return `${local ? "http" : "https"}://${host}${REVALIDATE_PATH}`;
}

export function requestsFor(
  change: RevalidationChange,
): { host: string; body: string }[] {
  const hosts = [...new Set(change.purge.map((purge) => purge.host))].sort();
  return hosts.map((host) => ({
    host,
    body: JSON.stringify({
      tags: change.tags,
      purge: change.purge.filter((purge) => purge.host === host),
    }),
  }));
}

export function createSiteRevalidator(
  options: SiteRevalidatorOptions = {},
): Revalidator {
  const secretOf =
    options.secret ??
    (async () =>
      process.env.REVALIDATE_SECRET ||
      (await getRuntimeConfig().catch(() => undefined))?.revalidateSecret);
  const send =
    options.send ??
    ((url, init) =>
      fetch(url, {
        ...init,
        signal: AbortSignal.timeout(options.timeoutMs ?? REVALIDATE_TIMEOUT_MS),
      }));
  return {
    async revalidate(change, logger) {
      logger.info(
        {
          tags: change.tags,
          purge: change.purge,
          collection: change.collection,
          reason: change.reason,
        },
        REVALIDATION_REQUESTED,
      );
      const requests = requestsFor(change);
      if (requests.length === 0) {
        logger.info(
          { tags: change.tags, collection: change.collection },
          "Revalidation has no host to send to; skipped",
        );
        return;
      }
      const secret = await secretOf();
      if (!secret) {
        logger.info(
          { hosts: requests.map((r) => r.host), tags: change.tags },
          "Revalidation skipped: REVALIDATE_SECRET is not set",
        );
        return;
      }
      const failures: string[] = [];
      for (const { host, body } of requests) {
        try {
          const signed = signRevalidation(body, secret, options.now?.());
          const response = await send(revalidateUrl(host), {
            method: "POST",
            headers: {
              "content-type": "application/json",
              ...revalidationHeaders(signed),
            },
            body,
          });
          const answer = (await response.json().catch(() => ({}))) as {
            ok?: boolean;
          };
          if (!response.ok || answer.ok === false) {
            failures.push(host);
            logger.error(
              { host, status: response.status, answer },
              "The site answered the revalidation with a failure",
            );
          } else {
            logger.info(
              {
                host,
                tags: change.tags.length,
                collection: change.collection,
                reason: change.reason,
              },
              "Revalidation delivered",
            );
          }
        } catch (error) {
          failures.push(host);
          logger.error(
            { err: error, host },
            "The site could not be reached for revalidation",
          );
        }
      }
      if (failures.length > 0) {
        throw new Error(`Revalidation failed for ${failures.join(", ")}`);
      }
    },
  };
}

export const siteRevalidator: Revalidator = createSiteRevalidator();

function tenantId(value: TenantRef): number | string | undefined {
  if (value === null || value === undefined || value === "") return undefined;
  return typeof value === "object" ? value.id : value;
}

function identityOf(
  slug: string | null | undefined,
  domain: string | null | undefined,
): TenantIdentity | undefined {
  const host = domain ? normalizeDomain(domain) : "";
  return slug && host ? { slug, host } : undefined;
}

export function revalidateTenantLayout(
  revalidator: Revalidator,
): CollectionAfterChangeHook {
  return async ({ doc, req, collection }) => {
    const { logger } = req.payload;
    const record = doc as { tenant?: TenantRef; _status?: string | null };
    if (record._status === "draft") return doc;
    const id = tenantId(record.tenant);
    if (id === undefined) return doc;
    try {
      const owner = record.tenant;
      const populated =
        typeof owner === "object" && owner
          ? identityOf(owner.slug, owner.domain)
          : undefined;
      const tenant =
        populated ??
        (await req.payload
          .findByID({
            collection: "tenants",
            id,
            depth: 0,
            overrideAccess: true,
            req,
          })
          .then((found) => identityOf(found.slug, found.domain)));
      if (!tenant) {
        logger.error(
          { tenant: id, collection: collection.slug },
          "Layout revalidation skipped: the company has no slug or domain",
        );
        return doc;
      }
      const change = layoutChange(tenant);
      try {
        await revalidator.revalidate(change, logger, { req });
      } catch (error) {
        logger.error(
          {
            err: error,
            tenant: tenant.slug,
            collection: collection.slug,
            tags: change.tags,
          },
          "Layout revalidation failed; the save stands and the site refreshes when the cache expires",
        );
      }
    } catch (error) {
      logger.error(
        { err: error, tenant: id, collection: collection.slug },
        "Layout revalidation could not start; the save stands and the site refreshes when the cache expires",
      );
    }
    return doc;
  };
}
