import type {
  CollectionAfterChangeHook,
  Payload,
  PayloadRequest,
} from "payload";

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

// TODO(DILM-32): replace with the authenticated revalidateTag call to apps/web and the Cloudflare prefix purge.
export const stubRevalidator: Revalidator = {
  async revalidate(change, logger) {
    logger.info(
      {
        tags: change.tags,
        purge: change.purge,
        collection: change.collection,
        reason: change.reason,
      },
      "Revalidation (stubbed until DILM-32)",
    );
  },
};

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
