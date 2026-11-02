import {
  APIError,
  type CollectionBeforeDeleteHook,
  type CollectionBeforeValidateHook,
  type PayloadRequest,
  type Where,
} from "payload";

import { isDefaultLocale } from "./fields/structure";
import { hasTarget, type LinkData } from "./fields/link";
import { localization } from "./localization";

type Ref = number | string | { id: number | string } | null | undefined;

export function refId(value: Ref): string | undefined {
  if (value === null || value === undefined || value === "") return undefined;
  return String(typeof value === "object" ? value.id : value);
}

export function hasRedirect(doc: { redirectTo?: LinkData | null } | undefined) {
  return hasTarget(doc?.redirectTo ?? undefined);
}

export function servesLayout(
  doc: { redirectTo?: LinkData | null } | undefined,
) {
  return !hasRedirect(doc);
}

export function parentTenantProblem(
  parentTenant: Ref,
  tenant: Ref,
): string | undefined {
  return refId(parentTenant) === refId(tenant)
    ? undefined
    : "The parent page belongs to another company. Pick a page of the same company.";
}

export function scopedReq<T extends object>(
  req: T | undefined,
): PayloadRequest {
  return { ...req } as unknown as PayloadRequest;
}

function reject(message: string): never {
  throw new APIError(message, 400, undefined, true);
}

export const keepParentInTenant: CollectionBeforeValidateHook = async ({
  collection,
  data,
  originalDoc,
  req,
}) => {
  if (!data) return data;
  const parent = refId(
    "parent" in data ? data.parent : (originalDoc as { parent?: Ref })?.parent,
  );
  if (!parent) return data;
  if (parent === refId((originalDoc as { id?: Ref })?.id)) {
    reject("A page can't be its own parent.");
  }
  const found = (await req.payload.findByID({
    collection: collection.slug as "pages",
    id: parent,
    depth: 0,
    trash: true,
    overrideAccess: true,
    req: scopedReq(req),
  })) as { tenant?: Ref };
  const problem = parentTenantProblem(
    found.tenant,
    "tenant" in data ? data.tenant : (originalDoc as { tenant?: Ref })?.tenant,
  );
  if (problem) reject(problem);
  return data;
};

const HOME_TAKEN =
  "Home already exists. Give this shared page a slug, only one page can sit at the root.";

const HOME_FIXED = "Home stays at the root. Its slug has to stay empty.";

const HOME_KEPT = "Home can't be moved to the trash or deleted.";

const EMPTY_SLUG: Where = {
  or: [{ slug: { equals: "" } }, { slug: { exists: false } }],
};

async function isHome(req: PayloadRequest, id: Ref): Promise<boolean> {
  const wanted = refId(id);
  if (!wanted) return false;
  const doc = (await req.payload.findByID({
    collection: "shared-pages",
    id: wanted,
    locale: localization.defaultLocale,
    fallbackLocale: false,
    depth: 0,
    trash: true,
    overrideAccess: true,
    req: scopedReq(req),
  })) as { slug?: string | null };
  return !doc.slug;
}

async function otherHomeExists(req: PayloadRequest, id: Ref) {
  const own = refId(id);
  const where: Where = own
    ? { and: [{ id: { not_equals: own } }, EMPTY_SLUG] }
    : EMPTY_SLUG;
  const { totalDocs } = await req.payload.find({
    collection: "shared-pages",
    where,
    locale: localization.defaultLocale,
    fallbackLocale: false,
    limit: 1,
    depth: 0,
    pagination: false,
    trash: true,
    overrideAccess: true,
    req: scopedReq(req),
  });
  return totalDocs > 0;
}

function localeCodes(): string[] {
  return (localization.locales as readonly (string | { code: string })[]).map(
    (locale) => (typeof locale === "string" ? locale : locale.code),
  );
}

function slugFor(
  data: Record<string, unknown>,
  locale: string,
  requestLocale: string | undefined,
): string | null | undefined {
  const slug = data.slug;
  if (slug && typeof slug === "object") {
    return (slug as Record<string, string | null | undefined>)[locale];
  }
  if (!("slug" in data)) return undefined;
  const sent = isDefaultLocale(requestLocale)
    ? localization.defaultLocale
    : requestLocale;
  return sent === locale ? (slug as string | null) : undefined;
}

export const keepSingleHome: CollectionBeforeValidateHook = async ({
  data,
  operation,
  originalDoc,
  req,
}) => {
  if (!data) return data;
  const id = (originalDoc as { id?: Ref } | undefined)?.id;
  const wasHome = operation === "update" && (await isHome(req, id));
  if (wasHome && data.deletedAt) reject(HOME_KEPT);
  const given = localeCodes().map((locale) =>
    slugFor(data, locale, req.locale),
  );
  if (wasHome) {
    if (given.some(Boolean)) reject(HOME_FIXED);
    return data;
  }
  const defaultSlug = slugFor(data, localization.defaultLocale, req.locale);
  const becomesHome =
    operation === "create"
      ? !defaultSlug
      : defaultSlug === null || defaultSlug === "";
  if (becomesHome && (await otherHomeExists(req, id))) reject(HOME_TAKEN);
  return data;
};

export const protectHome: CollectionBeforeDeleteHook = async ({ id, req }) => {
  if (await isHome(req, id)) reject(HOME_KEPT);
};
