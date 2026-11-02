import {
  APIError,
  type Block,
  type CollectionAfterChangeHook,
  type CollectionBeforeDeleteHook,
  type CollectionSlug,
  type Field,
  type Payload,
  type PayloadRequest,
  type Where,
} from "payload";

import { pageBlocks } from "./blocks";
import type { LinkData } from "./fields/link";
import { localeCodes, type PageCollection } from "./paths";
import { refId, scopedReq, servesLayout } from "./pageRules";

// TODO(DILM-101): add products, solutions, jobs, posts and categories as their collections land.
export const ROUTABLE_COLLECTIONS = ["pages", "shared-pages"] as const;

export type RoutableCollection = (typeof ROUTABLE_COLLECTIONS)[number];

type Ref = Parameters<typeof refId>[0];

type Request = Partial<PayloadRequest> | undefined;

type PageDoc = {
  id: number | string;
  _status?: string | null;
  deletedAt?: string | null;
  tenant?: Ref;
  path?: Record<string, string | null | undefined> | string | null;
  layout?: unknown;
  redirectTo?: LinkData | null;
};

export type RouteRow = {
  tenant: string | null;
  locale: string;
  path: string;
  refs: string[];
};

export type Referrer = {
  collection: RoutableCollection;
  id: string;
  tenant: string | null;
  paths: Record<string, string>;
};

function asId(id: string): number | string {
  return /^\d+$/.test(id) ? Number(id) : id;
}

export function refKey(collection: string, id: number | string): string {
  return `${collection}:${id}`;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function relationValues(
  field: { relationTo: string | string[] },
  value: unknown,
): string[] {
  const values = Array.isArray(value) ? value : [value];
  return values.flatMap((entry) => {
    if (entry === null || entry === undefined || entry === "") return [];
    if (isPlainObject(entry) && "relationTo" in entry && "value" in entry) {
      const id = refId(entry.value as Ref);
      return id ? [refKey(String(entry.relationTo), id)] : [];
    }
    const id = refId(entry as Ref);
    if (!id || Array.isArray(field.relationTo)) return [];
    return [refKey(field.relationTo, id)];
  });
}

function localeValues(field: Field, value: unknown): unknown[] {
  const localized = "localized" in field && field.localized;
  if (!localized || !isPlainObject(value)) return [value];
  const keys = Object.keys(value);
  const isLocaleMap =
    keys.length > 0 && keys.every((key) => localeCodes().includes(key));
  return isLocaleMap ? Object.values(value) : [value];
}

function walk(fields: Field[], data: unknown, found: Set<string>): void {
  if (!isPlainObject(data)) return;
  for (const field of fields) {
    if (field.type === "tabs") {
      for (const tab of field.tabs) {
        walk(
          tab.fields,
          "name" in tab && tab.name ? data[tab.name] : data,
          found,
        );
      }
      continue;
    }
    if (!("name" in field) || !field.name) {
      if ("fields" in field) walk(field.fields, data, found);
      continue;
    }
    for (const value of localeValues(field, data[field.name])) {
      if (value === null || value === undefined) continue;
      if (field.type === "relationship") {
        for (const key of relationValues(field, value)) found.add(key);
      } else if (field.type === "group") {
        walk(field.fields, value, found);
      } else if (field.type === "array" && Array.isArray(value)) {
        for (const row of value) walk(field.fields, row, found);
      } else if (field.type === "blocks" && Array.isArray(value)) {
        for (const row of value) {
          const block = field.blocks.find(
            (candidate) =>
              isPlainObject(row) && candidate.slug === row.blockType,
          );
          if (block) walk(block.fields, row, found);
        }
      }
    }
  }
}

export function extractRefs(
  layout: unknown,
  blocks: readonly Block[] = pageBlocks,
): string[] {
  const found = new Set<string>();
  if (Array.isArray(layout)) {
    for (const row of layout) {
      const block = blocks.find(
        (candidate) => isPlainObject(row) && candidate.slug === row.blockType,
      );
      if (block) walk(block.fields, row, found);
    }
  }
  return [...found].sort();
}

export function routeRows(
  collection: RoutableCollection,
  doc: PageDoc,
  blocks: readonly Block[] = pageBlocks,
): RouteRow[] {
  if (doc._status !== "published" || doc.deletedAt) return [];
  const tenant = collection === "pages" ? (refId(doc.tenant) ?? null) : null;
  const refs = servesLayout(doc) ? extractRefs(doc.layout, blocks) : [];
  const paths =
    typeof doc.path === "string" ? { [localeCodes()[0]]: doc.path } : doc.path;
  return localeCodes().flatMap((locale) => {
    const path = paths?.[locale];
    return path ? [{ tenant, locale, path, refs }] : [];
  });
}

export function conflictMessage(path: string, locale: string): string {
  return `${path} is already used by another published page${locale === localeCodes()[0] ? "" : ` in ${locale.toUpperCase()}`}. Pick another slug.`;
}

type StoredRoute = {
  id: number | string;
  tenant?: Ref;
  locale: string;
  path: string;
  refs?: unknown;
  doc: { relationTo: string; value: Ref };
};

const SELF_DOC = (collection: string, id: number | string): Where => ({
  doc: { equals: { relationTo: collection, value: id } },
});

async function storedRoutes(
  payload: Payload,
  req: Request,
  where: Where,
): Promise<StoredRoute[]> {
  const { docs } = await payload.find({
    collection: "routes",
    where,
    depth: 0,
    limit: 0,
    pagination: false,
    overrideAccess: true,
    req: scopedReq(req),
  });
  return docs as unknown as StoredRoute[];
}

function tenantsClash(a: string | null, b: string | null): boolean {
  return a === null || b === null || a === b;
}

function sameRefs(a: unknown, b: string[]): boolean {
  return (
    Array.isArray(a) &&
    a.length === b.length &&
    a.every((entry, index) => entry === b[index])
  );
}

export async function removeRouteRows(
  payload: Payload,
  collection: RoutableCollection,
  id: number | string,
  req?: Request,
): Promise<void> {
  await payload.delete({
    collection: "routes",
    where: SELF_DOC(collection, id),
    overrideAccess: true,
    req: scopedReq(req),
  });
}

export async function writeRouteRows(
  payload: Payload,
  collection: RoutableCollection,
  id: number | string,
  rows: RouteRow[],
  req?: Request,
): Promise<void> {
  const scoped = scopedReq(req);
  const existing = await storedRoutes(payload, req, SELF_DOC(collection, id));

  for (const row of rows) {
    const sharing = await storedRoutes(payload, req, {
      and: [{ locale: { equals: row.locale } }, { path: { equals: row.path } }],
    });
    const rivals = sharing.filter(
      (rival) =>
        !(
          rival.doc.relationTo === collection &&
          refId(rival.doc.value) === String(id)
        ),
    );
    if (
      rivals.some((rival) =>
        tenantsClash(refId(rival.tenant) ?? null, row.tenant),
      )
    ) {
      throw new APIError(
        conflictMessage(row.path, row.locale),
        400,
        undefined,
        true,
      );
    }
  }

  const wanted = new Set(rows.map((row) => row.locale));
  for (const stale of existing) {
    if (!wanted.has(stale.locale)) {
      await payload.delete({
        collection: "routes",
        id: stale.id,
        overrideAccess: true,
        req: scoped,
      });
    }
  }
  for (const row of rows) {
    const current = existing.find((entry) => entry.locale === row.locale);
    const data = {
      tenant: row.tenant === null ? null : asId(row.tenant),
      locale: row.locale as "en" | "id",
      path: row.path,
      refs: row.refs,
      doc: { relationTo: collection, value: id },
    };
    if (!current) {
      await payload.create({
        collection: "routes",
        data: data as never,
        overrideAccess: true,
        req: scoped,
      });
    } else if (
      current.path !== row.path ||
      (refId(current.tenant) ?? null) !== row.tenant ||
      !sameRefs(current.refs, row.refs)
    ) {
      await payload.update({
        collection: "routes",
        id: current.id,
        data: data as never,
        overrideAccess: true,
        req: scoped,
      });
    }
  }
}

export async function syncRouteIndex(
  payload: Payload,
  collection: RoutableCollection,
  id: number | string,
  req?: Request,
): Promise<void> {
  let doc: PageDoc | undefined;
  try {
    doc = (await payload.findByID({
      collection: collection as CollectionSlug,
      id,
      locale: "all",
      fallbackLocale: false,
      depth: 0,
      draft: false,
      trash: true,
      overrideAccess: true,
      req: scopedReq(req),
    })) as unknown as PageDoc;
  } catch {
    doc = undefined;
  }
  const rows = doc ? routeRows(collection, doc) : [];
  if (rows.length === 0) {
    await removeRouteRows(payload, collection, id, req);
    return;
  }
  await writeRouteRows(payload, collection, id, rows, req);
}

export const syncRoutes: CollectionAfterChangeHook = async ({
  collection,
  doc,
  req,
}) => {
  await syncRouteIndex(
    req.payload,
    collection.slug as PageCollection,
    (doc as { id: number | string }).id,
    req,
  );
  return doc;
};

export const removeRoutes: CollectionBeforeDeleteHook = async ({
  collection,
  id,
  req,
}) => {
  await removeRouteRows(
    req.payload,
    collection.slug as PageCollection,
    id,
    req,
  );
};

export async function findReferrers(
  payload: Payload,
  collection: string,
  id: number | string,
  req?: Request,
): Promise<Referrer[]> {
  const key = refKey(collection, id);
  // TODO(DILM-137): narrow with a jsonb containment query once the Used in panel needs it at scale.
  const rows = await storedRoutes(payload, req, { id: { exists: true } });
  const grouped = new Map<string, Referrer>();
  for (const row of rows) {
    if (!Array.isArray(row.refs) || !row.refs.includes(key)) continue;
    const referrerId = refId(row.doc.value);
    if (!referrerId) continue;
    const mapKey = refKey(row.doc.relationTo, referrerId);
    const entry = grouped.get(mapKey) ?? {
      collection: row.doc.relationTo as RoutableCollection,
      id: referrerId,
      tenant: refId(row.tenant) ?? null,
      paths: {},
    };
    entry.paths[row.locale] = row.path;
    grouped.set(mapKey, entry);
  }
  return [...grouped.values()];
}
