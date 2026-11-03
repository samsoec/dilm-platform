import {
  APIError,
  type CollectionAfterChangeHook,
  type CollectionBeforeChangeHook,
  type CollectionSlug,
  type Payload,
  type PayloadRequest,
  type Where,
} from "payload";

import { localization } from "./localization";
import {
  computePath,
  computePaths,
  localeCodes,
  slugForLocale,
  slugsFrom,
  type LocalizedSlugs,
  type PageCollection,
} from "./paths";
import { refId, scopedReq } from "./pageRules";
import {
  asId,
  findReferrersOf,
  routeRows,
  storedRoutes,
  type Referrer,
} from "./routeIndex";

export const CASCADE_LIMIT = 500;

export const INCOMPLETE_MESSAGE =
  "Some child pages couldn't be moved, so nothing was saved. Try again, and if it keeps failing, ask a developer to check the server log.";

export function cascadeLimitMessage(count: number): string {
  return `This change would move ${count} pages and records. One change can move up to ${CASCADE_LIMIT}. Move some child pages first, then try again.`;
}

type Ref = Parameters<typeof refId>[0];

type Request = Partial<PayloadRequest> | undefined;

type LocaleMap = Record<string, string | null | undefined>;

export type PathMove = { locale: string; from: string; to: string };

export type MovedPage = {
  collection: PageCollection;
  id: string;
  tenant: string | null;
  paths: Record<string, string>;
};

export type RecordMove = {
  collection: string;
  id: string;
  tenant: string | null;
  published: boolean;
  moves: PathMove[];
  apply: (payload: Payload, req: Request) => Promise<void>;
};

export type RecordMoveSource = (args: {
  payload: Payload;
  req: Request;
  pages: MovedPage[];
}) => Promise<RecordMove[]>;

export const recordMoveSources: RecordMoveSource[] = [];

export type PathChange = { slugs?: LocalizedSlugs; parent?: Ref };

export type PathImpact = {
  published: boolean;
  urls: PathMove[];
  childPages: number;
  records: number;
  redirects: number;
  links: Referrer[];
  overLimit: boolean;
  message?: string;
};

type StoredPage = {
  id: number | string;
  tenant?: Ref;
  parent?: Ref;
  slug?: LocaleMap | string | null;
  path?: LocaleMap | string | null;
  _status?: string | null;
  deletedAt?: string | null;
};

type PageMove = {
  id: string;
  tenant: string | null;
  published: boolean;
  moves: PathMove[];
};

function asMap(value: LocaleMap | string | null | undefined): LocaleMap {
  if (typeof value === "string") return { [localization.defaultLocale]: value };
  return value ?? {};
}

function isLive(page: StoredPage): boolean {
  return page._status === "published" && !page.deletedAt;
}

async function loadPage(
  payload: Payload,
  req: Request,
  collection: PageCollection,
  id: number | string,
): Promise<StoredPage> {
  return (await payload.findByID({
    collection: collection as CollectionSlug,
    id,
    locale: "all",
    fallbackLocale: false,
    depth: 0,
    draft: false,
    trash: true,
    overrideAccess: true,
    req: scopedReq(req),
  })) as unknown as StoredPage;
}

async function childrenOf(
  payload: Payload,
  req: Request,
  collection: PageCollection,
  parents: string[],
): Promise<StoredPage[]> {
  const { docs } = await payload.find({
    collection: collection as CollectionSlug,
    where: { parent: { in: parents } },
    locale: "all",
    fallbackLocale: false,
    depth: 0,
    draft: false,
    trash: true,
    limit: 0,
    pagination: false,
    select: {
      slug: true,
      path: true,
      parent: true,
      tenant: true,
      _status: true,
      deletedAt: true,
    } as never,
    overrideAccess: true,
    req: scopedReq(req),
  });
  return docs as unknown as StoredPage[];
}

function differences(from: LocaleMap, to: Record<string, string>): PathMove[] {
  return localeCodes().flatMap((locale) => {
    const old = from[locale] || from[localization.defaultLocale];
    return old && old !== to[locale]
      ? [{ locale, from: old, to: to[locale] }]
      : [];
  });
}

async function descendantMoves(
  payload: Payload,
  req: Request,
  collection: PageCollection,
  rootId: string,
  rootPaths: Record<string, string>,
): Promise<{ moved: PageMove[]; pages: MovedPage[]; truncated: boolean }> {
  const moved: PageMove[] = [];
  const pages: MovedPage[] = [];
  const seen = new Set<string>([rootId]);
  let level = new Map<string, Record<string, string>>([[rootId, rootPaths]]);
  while (level.size > 0) {
    const kids = await childrenOf(payload, req, collection, [...level.keys()]);
    const next = new Map<string, Record<string, string>>();
    for (const kid of kids) {
      const id = String(kid.id);
      if (seen.has(id)) continue;
      seen.add(id);
      const above = level.get(refId(kid.parent) ?? "") ?? rootPaths;
      const slugs = asMap(kid.slug);
      const paths: Record<string, string> = {};
      for (const locale of localeCodes()) {
        paths[locale] = computePath(
          above[locale] || above[localization.defaultLocale],
          slugForLocale(slugs, locale).slug,
        );
      }
      next.set(id, paths);
      const moves = differences(asMap(kid.path), paths);
      if (moves.length === 0) continue;
      const tenant =
        collection === "pages" ? (refId(kid.tenant) ?? null) : null;
      moved.push({ id, tenant, published: isLive(kid), moves });
      pages.push({ collection, id, tenant, paths });
    }
    if (moved.length > CASCADE_LIMIT) {
      return { moved, pages, truncated: true };
    }
    level = next;
  }
  return { moved, pages, truncated: false };
}

async function recordMoves(
  payload: Payload,
  req: Request,
  pages: MovedPage[],
): Promise<RecordMove[]> {
  const found: RecordMove[] = [];
  for (const source of recordMoveSources) {
    found.push(...(await source({ payload, req, pages })));
  }
  return found;
}

const NO_IMPACT: Omit<PathImpact, "published" | "urls"> = {
  childPages: 0,
  records: 0,
  redirects: 0,
  links: [],
  overLimit: false,
};

export async function previewPathChange(
  payload: Payload,
  doc: { collection: PageCollection; id: number | string },
  change: PathChange,
  req?: Request,
): Promise<PathImpact> {
  const page = await loadPage(payload, req, doc.collection, doc.id);
  const tenant = doc.collection === "pages" ? page.tenant : null;
  const newPaths = await computePaths(
    payload,
    {
      collection: doc.collection,
      id: doc.id,
      tenant,
      parent: change.parent !== undefined ? change.parent : page.parent,
      slugs: { ...asMap(page.slug), ...change.slugs },
    },
    req,
  );
  const published = isLive(page);
  const stored = asMap(page.path);
  const urls = localeCodes().map((locale) => ({
    locale,
    from: stored[locale] || stored[localization.defaultLocale] || "",
    to: newPaths[locale],
  }));
  const rootMoves = urls.filter((url) => url.from !== url.to);
  if (rootMoves.length === 0) return { ...NO_IMPACT, published, urls };

  const id = String(doc.id);
  const below = await descendantMoves(
    payload,
    req,
    doc.collection,
    id,
    newPaths,
  );
  const pages: MovedPage[] = [
    {
      collection: doc.collection,
      id,
      tenant: refId(tenant) ?? null,
      paths: newPaths,
    },
    ...below.pages,
  ];
  const records = below.truncated ? [] : await recordMoves(payload, req, pages);
  const count = below.moved.length + records.length;
  const overLimit = below.truncated || count > CASCADE_LIMIT;

  const redirects =
    (published ? rootMoves.length : 0) +
    below.moved.reduce(
      (sum, page) => sum + (page.published ? page.moves.length : 0),
      0,
    ) +
    records.reduce(
      (sum, record) => sum + (record.published ? record.moves.length : 0),
      0,
    );

  const links = await findReferrersOf(
    payload,
    [
      { collection: doc.collection, id },
      ...below.moved.map((moved) => ({
        collection: doc.collection as string,
        id: moved.id,
      })),
      ...records.map((record) => ({
        collection: record.collection,
        id: record.id,
      })),
    ],
    req,
  );

  return {
    published,
    urls,
    childPages: below.moved.length,
    records: records.length,
    redirects,
    links,
    overLimit,
    ...(overLimit ? { message: cascadeLimitMessage(count) } : {}),
  };
}

function submittedSlugs(
  data: Record<string, unknown>,
  requestLocale: string | undefined,
): LocalizedSlugs {
  return slugsFrom(data.slug, {}, requestLocale);
}

export const rejectOversizedCascade: CollectionBeforeChangeHook = async ({
  collection,
  data,
  operation,
  originalDoc,
  req,
}) => {
  const id = (originalDoc as { id?: number | string } | undefined)?.id;
  if (operation !== "update" || id === undefined) return data;
  if (!data || data._status !== "published") return data;
  if (req.context.pathCascadeChecked) return data;
  const impact = await previewPathChange(
    req.payload,
    { collection: collection.slug as PageCollection, id },
    {
      slugs: submittedSlugs(data, req.locale),
      ...("parent" in data
        ? { parent: (data as { parent?: Ref }).parent }
        : {}),
    },
    req,
  );
  if (impact.overLimit) {
    throw new APIError(impact.message!, 400, undefined, true);
  }
  if (impact.urls.some((url) => url.from !== url.to)) {
    req.context.pathCascadeChecked = true;
    req.context.pathCascadeRoot = String(id);
  }
  return data;
};

export const freshBreadcrumbIds: CollectionBeforeChangeHook = ({ data }) => {
  const crumbs = (data as { breadcrumbs?: unknown }).breadcrumbs;
  if (!Array.isArray(crumbs)) return data;
  return {
    ...data,
    breadcrumbs: crumbs.map((crumb: Record<string, unknown>) =>
      Object.fromEntries(Object.entries(crumb).filter(([key]) => key !== "id")),
    ),
  };
};

type RedirectRow = {
  id: number | string;
  from: string;
  origin?: string | null;
  to?: { type?: string | null; internalPath?: string | null } | null;
};

function tenantIs(tenant: string | null): Where {
  return tenant === null
    ? { tenant: { exists: false } }
    : { tenant: { equals: asId(tenant) } };
}

async function redirectRows(
  payload: Payload,
  req: Request,
  where: Where,
): Promise<RedirectRow[]> {
  const { docs } = await payload.find({
    collection: "redirects" as CollectionSlug,
    where,
    depth: 0,
    limit: 0,
    pagination: false,
    overrideAccess: true,
    req: scopedReq(req),
  });
  return docs as unknown as RedirectRow[];
}

export async function writeAutoRedirect(
  payload: Payload,
  req: Request,
  scope: { tenant: string | null; locale: string },
  from: string,
  to: string,
): Promise<void> {
  if (from === to) return;
  const scoped = scopedReq(req);
  const remove = (id: number | string) =>
    payload.delete({
      collection: "redirects" as CollectionSlug,
      id,
      overrideAccess: true,
      req: scoped,
    });
  const language: Where = { locale: { equals: scope.locale } };

  const looping = await redirectRows(payload, req, {
    and: [
      language,
      tenantIs(scope.tenant),
      { from: { equals: to } },
      { origin: { equals: "auto" } },
    ],
  });
  for (const row of looping) await remove(row.id);

  const reach: Where =
    scope.tenant === null
      ? { id: { exists: true } }
      : { or: [tenantIs(scope.tenant), tenantIs(null)] };
  const pointing = await redirectRows(payload, req, {
    and: [language, reach, { "to.internalPath": { equals: from } }],
  });
  for (const row of pointing) {
    if (row.from === to) {
      await remove(row.id);
      continue;
    }
    await payload.update({
      collection: "redirects" as CollectionSlug,
      id: row.id,
      data: { to: { ...row.to, type: "internal", internalPath: to } } as never,
      overrideAccess: true,
      req: scoped,
    });
  }

  const [existing] = await redirectRows(payload, req, {
    and: [language, tenantIs(scope.tenant), { from: { equals: from } }],
  });
  const target = { type: "internal", internalPath: to };
  if (!existing) {
    await payload.create({
      collection: "redirects" as CollectionSlug,
      data: {
        from,
        to: target,
        tenant: scope.tenant === null ? null : asId(scope.tenant),
        locale: scope.locale,
        origin: "auto",
      } as never,
      overrideAccess: true,
      req: scoped,
    });
  } else if (existing.origin === "auto") {
    await payload.update({
      collection: "redirects" as CollectionSlug,
      id: existing.id,
      data: { to: target } as never,
      overrideAccess: true,
      req: scoped,
    });
  }
}

export const cascadePathChange: CollectionAfterChangeHook = async ({
  collection,
  doc,
  req,
}) => {
  const payload = req.payload;
  const slug = collection.slug as PageCollection;
  const id = (doc as { id: number | string }).id;
  const page = await loadPage(payload, req, slug, id);
  const rows = routeRows(slug, page as never);
  const isRoot = req.context.pathCascadeRoot === String(id);
  if (isRoot) req.context.pathCascadeRoot = undefined;
  if (rows.length === 0) {
    if (isRoot) throw new APIError(INCOMPLETE_MESSAGE, 500, undefined, true);
    return doc;
  }
  const before = await storedRoutes(payload, req, {
    doc: { equals: { relationTo: slug, value: id } },
  });
  const moves = rows.flatMap((row) => {
    const old = before.find((entry) => entry.locale === row.locale);
    return old && old.path !== row.path
      ? [
          {
            tenant: row.tenant,
            locale: row.locale,
            from: old.path,
            to: row.path,
          },
        ]
      : [];
  });
  if (moves.length === 0) {
    if (isRoot) throw new APIError(INCOMPLETE_MESSAGE, 500, undefined, true);
    return doc;
  }
  if (isRoot) {
    const paths: Record<string, string> = {};
    for (const row of rows) paths[row.locale] = row.path;
    const left = await descendantMoves(payload, req, slug, String(id), paths);
    if (left.moved.some((page) => page.published)) {
      throw new APIError(INCOMPLETE_MESSAGE, 500, undefined, true);
    }
  }
  for (const move of moves) {
    await writeAutoRedirect(
      payload,
      req,
      { tenant: move.tenant, locale: move.locale },
      move.from,
      move.to,
    );
  }
  if (recordMoveSources.length === 0) return doc;
  const paths: Record<string, string> = {};
  for (const row of rows) paths[row.locale] = row.path;
  const records = await recordMoves(payload, req, [
    { collection: slug, id: String(id), tenant: rows[0].tenant, paths },
  ]);
  for (const record of records) {
    await record.apply(payload, req);
    if (!record.published) continue;
    for (const move of record.moves) {
      await writeAutoRedirect(
        payload,
        req,
        { tenant: record.tenant, locale: move.locale },
        move.from,
        move.to,
      );
    }
  }
  return doc;
};
