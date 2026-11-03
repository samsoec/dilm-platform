import type { Payload, PayloadRequest, Where } from "payload";
import { MAX_RECORD_QUERY } from "@dilm/shared-types";

import { resolveLink, type TenantDomains } from "./fields/linkResolve";
import { idOf, referenceFilter, type Ref } from "./fields/link";
import { isListed, listedWhere } from "./jobs";

export const RECORD_COLLECTIONS = [
  "products",
  "solutions",
  "jobs",
  "posts",
  "categories",
] as const;

export type RecordCollection = (typeof RECORD_COLLECTIONS)[number];

export type RecordDoc = {
  id: number | string;
  _status?: string | null;
  deletedAt?: string | null;
  tenant?: Ref;
  path?: string | Record<string, string | null | undefined> | null;
  status?: string | null;
  closingDate?: string | Date | null;
  [key: string]: unknown;
};

export type CardContext = {
  viewerTenant?: Ref;
  locale?: string;
  domains?: TenantDomains;
  payload?: Payload;
  req?: PayloadRequest;
  warn?: (message: string) => void;
  now?: Date;
};

export type CardOverrides = {
  eyebrow?: string;
  title?: string;
  description?: string;
  image?: unknown;
};

export type RecordCard<D extends RecordDoc = RecordDoc> = {
  collection: RecordCollection;
  id: string;
  href: string;
  record: D;
  overrides?: CardOverrides;
};

function isDoc(value: unknown): value is RecordDoc {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    (value as { id: unknown }).id !== null &&
    (value as { id: unknown }).id !== undefined
  );
}

export async function cardFor<D extends RecordDoc>(
  collection: RecordCollection,
  doc: D | number | string | null | undefined,
  context: CardContext = {},
): Promise<RecordCard<D> | null> {
  if (!isDoc(doc)) return null;
  if (doc.deletedAt) return null;
  if (collection === "jobs" && !isListed(doc, context.now)) return null;
  const href = await resolveLink(
    { type: "reference", reference: { relationTo: collection, value: doc } },
    {
      tenant: context.viewerTenant,
      locale: context.locale,
      domains: context.domains,
      payload: context.payload,
      req: context.req,
      warn: context.warn,
    },
  );
  if (!href) return null;
  return { collection, id: String(doc.id), href, record: doc as D };
}

export async function manualCards<D extends RecordDoc>(
  collection: RecordCollection,
  items: readonly (D | number | string | null | undefined)[] | null | undefined,
  context: CardContext = {},
): Promise<RecordCard<D>[]> {
  const cards: RecordCard<D>[] = [];
  for (const item of items ?? []) {
    const card = await cardFor(collection, item, context);
    if (card) cards.push(card);
  }
  return cards;
}

export type PostItem = {
  doc?: {
    relationTo: string;
    value?: RecordDoc | number | string | null;
  } | null;
  eyebrow?: string | null;
  title?: string | null;
  description?: string | null;
  image?: unknown;
};

const POST_ITEM_COLLECTIONS: readonly string[] = ["posts", "categories"];

export async function postItemCards(
  items: readonly PostItem[] | null | undefined,
  context: CardContext = {},
): Promise<RecordCard[]> {
  const cards: RecordCard[] = [];
  for (const item of items ?? []) {
    const collection = item.doc?.relationTo;
    if (!collection || !POST_ITEM_COLLECTIONS.includes(collection)) continue;
    const card = await cardFor(
      collection as RecordCollection,
      item.doc?.value,
      context,
    );
    if (!card) continue;
    const overrides: CardOverrides = {};
    if (item.eyebrow) overrides.eyebrow = item.eyebrow;
    if (item.title) overrides.title = item.title;
    if (item.description) overrides.description = item.description;
    if (item.image) overrides.image = item.image;
    cards.push(Object.keys(overrides).length ? { ...card, overrides } : card);
  }
  return cards;
}

export type RecordQuery = {
  collection: RecordCollection;
  where: Where;
  sort: string | string[];
  limit: number;
  page: number;
  depth: number;
};

export function clampLimit(
  limit: number | null | undefined,
  max = MAX_RECORD_QUERY,
) {
  const wanted = Number.isFinite(limit) ? Math.floor(limit as number) : max;
  return Math.min(Math.max(wanted, 1), max);
}

export function allQuery(
  collection: "products" | "solutions",
  { page = 1, limit }: { page?: number; limit?: number } = {},
): RecordQuery {
  return {
    collection,
    where: { _status: { equals: "published" } },
    sort: "order",
    limit: clampLimit(limit),
    page: Math.max(Math.floor(page), 1),
    depth: 1,
  };
}

export type LatestRequest = {
  collection: "jobs" | "posts";
  scopeTenant?: Ref;
  limit: number;
  categories?: readonly Ref[] | null;
  exclude?: { collection: string; id: Ref } | null;
  now?: Date;
};

function allOf(clauses: Where[]): Where {
  return clauses.length === 1 ? clauses[0] : { and: clauses };
}

export function latestQuery({
  collection,
  scopeTenant,
  limit,
  categories,
  exclude,
  now,
}: LatestRequest): RecordQuery {
  const clauses: Where[] = [];
  if (collection === "jobs") {
    clauses.push(listedWhere(now));
    const tenant = idOf(scopeTenant);
    if (tenant) clauses.push({ tenant: { equals: tenant } });
  } else {
    const scope = referenceFilter("posts", scopeTenant);
    if (typeof scope === "object") clauses.push(scope);
    const ids = (categories ?? []).flatMap((category) => idOf(category) ?? []);
    if (ids.length) clauses.push({ primaryCategory: { in: ids } });
  }
  const excluded = exclude?.collection === collection ? idOf(exclude.id) : null;
  if (excluded) clauses.push({ id: { not_equals: excluded } });
  return {
    collection,
    where: allOf(clauses),
    sort: collection === "jobs" ? "-postedDate" : "-publishedAt",
    limit: clampLimit(limit),
    page: 1,
    depth: 1,
  };
}

export type FindRecords = (query: RecordQuery) => Promise<RecordDoc[]>;

export function payloadFinder(
  payload: Payload,
  options: {
    req?: PayloadRequest;
    locale?: string;
    overrideAccess?: boolean;
  } = {},
): FindRecords {
  return async (query) => {
    const result = await payload.find({
      collection: query.collection,
      where: query.where,
      sort: query.sort,
      limit: query.limit,
      page: query.page,
      depth: query.depth,
      draft: false,
      ...(options.locale ? { locale: options.locale as never } : {}),
      ...(options.req ? { req: options.req } : {}),
      overrideAccess: options.overrideAccess ?? false,
    });
    return result.docs as unknown as RecordDoc[];
  };
}

export async function latestCards(
  find: FindRecords,
  request: LatestRequest,
  context: CardContext = {},
): Promise<RecordCard[]> {
  const query = latestQuery(request);
  const docs = await find(query);
  const excluded =
    request.exclude?.collection === request.collection
      ? idOf(request.exclude.id)
      : null;
  const cards = await manualCards(
    request.collection,
    docs.filter((doc) => String(doc.id) !== excluded),
    { now: request.now, ...context },
  );
  return cards.slice(0, query.limit);
}
