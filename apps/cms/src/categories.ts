import {
  APIError,
  type CollectionAfterChangeHook,
  type CollectionBeforeDeleteHook,
  type CollectionSlug,
  type Payload,
  type PayloadRequest,
} from "payload";

import { localization } from "./localization";
import { refId, scopedReq } from "./pageRules";
import {
  CASCADE_LIMIT,
  cascadeLimitMessage,
  writeAutoRedirect,
} from "./pathCascade";
import {
  computePath,
  localeCodes,
  slugForLocale,
  type LocalizedSlugs,
} from "./paths";
import {
  routeRows,
  storedRoutes,
  syncRouteIndex,
  type RoutableCollection,
} from "./routeIndex";

type Request = Partial<PayloadRequest> | undefined;

type LocaleMap = Record<string, string | null | undefined>;

export type PostCount = { company: string; count: number };

function plural(count: number, one: string, many: string): string {
  return count === 1 ? one : many;
}

export function categoryInUseMessage(
  name: string,
  counts: PostCount[],
): string {
  const total = counts.reduce((sum, entry) => sum + entry.count, 0);
  const listed = counts
    .map((entry) => `${entry.company} ${entry.count}`)
    .join(", ");
  return `"${name}" can't be deleted. It has ${total} ${plural(total, "post", "posts")} (${listed}). Move ${plural(total, "it", "them")} to another category first.`;
}

export function countByCompany(
  tenants: (number | string | { id: number | string } | null | undefined)[],
  names: Map<string, string>,
): PostCount[] {
  const totals = new Map<string, number>();
  for (const tenant of tenants) {
    const id = refId(tenant) ?? "";
    totals.set(id, (totals.get(id) ?? 0) + 1);
  }
  return [...totals.entries()]
    .map(([id, count]) => ({
      company: names.get(id) ?? "Another company",
      count,
    }))
    .sort((a, b) => a.company.localeCompare(b.company));
}

export async function postCountsFor(
  payload: Payload,
  req: Request,
  categoryId: number | string,
): Promise<PostCount[]> {
  const { docs } = await payload.find({
    collection: "posts",
    where: { primaryCategory: { equals: categoryId } },
    depth: 0,
    limit: 0,
    pagination: false,
    trash: true,
    select: { tenant: true } as never,
    overrideAccess: true,
    req: scopedReq(req),
  });
  if (docs.length === 0) return [];
  const tenants = (
    docs as unknown as { tenant?: Parameters<typeof refId>[0] }[]
  ).map((doc) => doc.tenant);
  const ids = [...new Set(tenants.map((tenant) => refId(tenant)!))].filter(
    Boolean,
  );
  const names = new Map<string, string>();
  if (ids.length > 0) {
    const found = await payload.find({
      collection: "tenants",
      where: { id: { in: ids } },
      depth: 0,
      limit: ids.length,
      pagination: false,
      overrideAccess: true,
      req: scopedReq(req),
    });
    for (const tenant of found.docs as unknown as {
      id: number | string;
      name: string;
    }[]) {
      names.set(String(tenant.id), tenant.name);
    }
  }
  return countByCompany(tenants, names);
}

export const keepCategoriesWithPosts: CollectionBeforeDeleteHook = async ({
  id,
  req,
}) => {
  const counts = await postCountsFor(req.payload, req, id);
  if (counts.length === 0) return;
  const category = (await req.payload.findByID({
    collection: "categories",
    id,
    locale: localization.defaultLocale,
    fallbackLocale: false,
    depth: 0,
    overrideAccess: true,
    req: scopedReq(req),
  })) as { name?: string | null };
  throw new APIError(
    categoryInUseMessage(category.name || "This category", counts),
    400,
    undefined,
    true,
  );
};

export async function writeMovedRedirects(
  payload: Payload,
  req: Request,
  collection: RoutableCollection,
  id: number | string,
): Promise<void> {
  const doc = (await payload.findByID({
    collection: collection as CollectionSlug,
    id,
    locale: "all",
    fallbackLocale: false,
    depth: 0,
    draft: false,
    trash: true,
    overrideAccess: true,
    req: scopedReq(req),
  })) as unknown as Parameters<typeof routeRows>[1];
  const rows = routeRows(collection, doc);
  if (rows.length === 0) return;
  const before = await storedRoutes(payload, req, {
    doc: { equals: { relationTo: collection, value: id } },
  });
  for (const row of rows) {
    const old = before.find((entry) => entry.locale === row.locale);
    if (!old || old.path === row.path) continue;
    await writeAutoRedirect(
      payload,
      req,
      { tenant: row.tenant, locale: row.locale },
      old.path,
      row.path,
    );
  }
}

export const redirectMovedPath: CollectionAfterChangeHook = async ({
  collection,
  doc,
  req,
}) => {
  await writeMovedRedirects(
    req.payload,
    req,
    collection.slug as RoutableCollection,
    (doc as { id: number | string }).id,
  );
  return doc;
};

type StoredPost = {
  id: number | string;
  slug?: LocaleMap | string | null;
  path?: LocaleMap | string | null;
  [field: string]: unknown;
};

function asMap(value: LocaleMap | string | null | undefined): LocaleMap {
  if (typeof value === "string") return { [localization.defaultLocale]: value };
  return value ?? {};
}

export function pathsUnder(
  categoryPaths: LocaleMap,
  slugs: LocalizedSlugs,
): Record<string, string> {
  const paths: Record<string, string> = {};
  for (const locale of localeCodes()) {
    const { slug } = slugForLocale(slugs, locale);
    paths[locale] = slug
      ? computePath(
          categoryPaths[locale] || categoryPaths[localization.defaultLocale],
          slug,
        )
      : "";
  }
  return paths;
}

export function movedPosts(
  categoryPaths: LocaleMap,
  posts: StoredPost[],
): { post: StoredPost; paths: Record<string, string> }[] {
  return posts.flatMap((post) => {
    const paths = pathsUnder(categoryPaths, asMap(post.slug));
    const stored = asMap(post.path);
    const changed = localeCodes().some(
      (locale) => paths[locale] && paths[locale] !== stored[locale],
    );
    return changed ? [{ post, paths }] : [];
  });
}

export const cascadePostPaths: CollectionAfterChangeHook = async ({
  doc,
  req,
}) => {
  const payload = req.payload;
  const id = (doc as { id: number | string }).id;
  const category = (await payload.findByID({
    collection: "categories",
    id,
    locale: "all",
    fallbackLocale: false,
    depth: 0,
    overrideAccess: true,
    req: scopedReq(req),
  })) as unknown as { path?: LocaleMap | string | null };
  const { docs } = await payload.find({
    collection: "posts",
    where: { primaryCategory: { equals: id } },
    locale: "all",
    fallbackLocale: false,
    draft: false,
    trash: true,
    depth: 0,
    limit: 0,
    pagination: false,
    overrideAccess: true,
    req: scopedReq(req),
  });
  const moved = movedPosts(
    asMap(category.path),
    docs as unknown as StoredPost[],
  );
  if (moved.length > CASCADE_LIMIT) {
    throw new APIError(cascadeLimitMessage(moved.length), 400, undefined, true);
  }
  for (const { post, paths } of moved) {
    await payload.db.updateOne({
      collection: "posts",
      id: post.id,
      data: { ...post, path: { ...asMap(post.path), ...paths } },
      locale: "all",
      returning: false,
      req: scopedReq(req),
    } as never);
    await writeMovedRedirects(payload, req, "posts", post.id);
    await syncRouteIndex(payload, "posts", post.id, req);
  }
  return doc;
};
