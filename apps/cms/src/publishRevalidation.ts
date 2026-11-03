import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  CollectionBeforeChangeHook,
  CollectionSlug,
  GlobalAfterChangeHook,
  Payload,
  PayloadRequest,
  Where,
} from "payload";

import { normalizeDomain } from "./fields/linkResolve";
import { refId, scopedReq } from "./pageRules";
import { jobBasePaths, recordBasePaths } from "./recordBases";
import type { RevalidationChange, Revalidator } from "./revalidation";
import {
  recordRefreshStatus,
  removeRefreshStatus,
  type RefreshStatusKey,
} from "./refreshStatus";
import {
  ROUTE_CHANGES_KEY,
  findReferrersOf,
  storedRoutes,
  type NotedRouteChange,
  type RouteSnapshot,
  type StoredRoute,
} from "./routeIndex";
import {
  TEMPLATE_COLLECTION,
  changeReason,
  documentChange,
  mergeChanges,
  referrersChange,
  templateChange,
  type DocumentChange,
  type Tenant,
  type TemplateKind,
  type TemplateRecordType,
} from "./revalidationTargets";

type Request = Partial<PayloadRequest> | undefined;

const ROOT_KEY = "revalidationRoot";

type Root = { collection: string; id?: string };

type RevalidatableDoc = {
  id: number | string;
  _status?: string | null;
  deletedAt?: string | null;
};

export async function loadTenants(
  payload: Payload,
  req?: Request,
): Promise<Tenant[]> {
  const { docs } = await payload.find({
    collection: "tenants",
    depth: 0,
    limit: 0,
    pagination: false,
    overrideAccess: true,
    select: { slug: true, domain: true },
    req: scopedReq(req),
  });
  return docs.flatMap((doc) =>
    doc.slug && doc.domain
      ? [
          {
            id: String(doc.id),
            slug: doc.slug,
            host: normalizeDomain(doc.domain),
          },
        ]
      : [],
  );
}

export function hostsOf(change: RevalidationChange): string[] {
  return [...new Set(change.purge.map((purge) => purge.host))].sort();
}

function rowKey(row: RouteSnapshot): string {
  return `${row.tenant}|${row.locale}|${row.path}`;
}

function samePaths(a: RouteSnapshot[], b: RouteSnapshot[]): boolean {
  const keys = new Set(a.map(rowKey));
  return a.length === b.length && b.every((row) => keys.has(rowKey(row)));
}

export function takeRouteChanges(req: Request): NotedRouteChange[] {
  const context = req?.context;
  if (!context) return [];
  const noted = (context[ROUTE_CHANGES_KEY] as NotedRouteChange[]) ?? [];
  context[ROUTE_CHANGES_KEY] = [];
  return noted;
}

function movedOrGone(change: NotedRouteChange): boolean {
  return change.before.length > 0 && !samePaths(change.before, change.after);
}

function appeared(change: NotedRouteChange): boolean {
  return change.before.length === 0 && change.after.length > 0;
}

export type LiveChange = {
  changes: DocumentChange[];
  reason?: RevalidationChange["reason"];
};

export function liveChanges(
  noted: NotedRouteChange[],
  own?: {
    collection: string;
    id: string;
    live: boolean;
    trashed?: boolean;
    deleted?: boolean;
  },
): LiveChange {
  const mine = own
    ? noted.filter(
        (change) =>
          change.collection === own.collection && change.id === own.id,
      )
    : [];
  const others = noted.filter((change) => !mine.includes(change));
  const changes: DocumentChange[] = [];
  let reason: LiveChange["reason"];
  if (own && mine.length > 0) {
    const before = mine[0].before;
    const after = mine[mine.length - 1].after;
    const merged: NotedRouteChange = { ...mine[0], before, after };
    if (own.live || movedOrGone(merged) || appeared(merged)) {
      const gone = before.length > 0 && after.length === 0;
      reason = own.deleted
        ? "delete"
        : gone
          ? own.trashed
            ? "trash"
            : "unpublish"
          : changeReason(before, after, "update");
      changes.push({
        collection: own.collection,
        id: own.id,
        before,
        after,
        reason,
      });
    }
  }
  for (const change of others) {
    if (movedOrGone(change) || appeared(change)) {
      changes.push({
        collection: change.collection,
        id: change.id,
        before: change.before,
        after: change.after,
        reason: "move",
      });
    }
  }
  return {
    changes,
    reason: reason ?? (changes.length > 0 ? "move" : undefined),
  };
}

async function referrers(
  payload: Payload,
  req: Request,
  targets: { collection: string; id: string }[],
) {
  if (targets.length === 0) return [];
  return (await findReferrersOf(payload, targets, req)).map((entry) => ({
    tenant: entry.tenant,
    paths: entry.paths,
  }));
}

async function deliver({
  revalidator,
  payload,
  req,
  change,
  status,
}: {
  revalidator: Revalidator;
  payload: Payload;
  req: PayloadRequest;
  change: RevalidationChange | undefined;
  status?: RefreshStatusKey;
}): Promise<void> {
  const { logger } = payload;
  let outcome: "ok" | "failed" = "ok";
  try {
    if (!change) return;
    await revalidator.revalidate(change, logger, { req });
  } catch (error) {
    outcome = "failed";
    logger.error(
      {
        err: error,
        collection: change?.collection,
        reason: change?.reason,
        tags: change?.tags,
      },
      "Site refresh failed; the save stands and the site refreshes when the cache expires",
    );
  }
  if (!status) return;
  await recordRefreshStatus(
    payload,
    status,
    outcome,
    change ? hostsOf(change) : [],
  );
}

export const beginLiveChange: CollectionBeforeChangeHook = ({
  data,
  originalDoc,
  collection,
  req,
}) => {
  if (req.context[ROOT_KEY] === undefined) {
    const id = (originalDoc as { id?: number | string } | undefined)?.id;
    req.context[ROOT_KEY] = {
      collection: collection.slug,
      ...(id === undefined ? {} : { id: String(id) }),
    } satisfies Root;
  }
  return data;
};

function isRoot(req: PayloadRequest, collection: string, id: string): boolean {
  const root = req.context[ROOT_KEY] as Root | undefined;
  return (
    root === undefined ||
    (root.collection === collection &&
      (root.id === undefined || root.id === id))
  );
}

function isLive(collection: string, doc: RevalidatableDoc): boolean {
  if (doc.deletedAt) return false;
  return collection === "categories" || doc._status === "published";
}

export function revalidateOnLiveChange(
  revalidator: Revalidator,
): CollectionAfterChangeHook {
  return async ({ doc, req, collection }) => {
    const subject = doc as RevalidatableDoc;
    const id = String(subject.id);
    if (!isRoot(req, collection.slug, id)) return doc;
    delete req.context[ROOT_KEY];
    try {
      const { payload } = req;
      const { changes } = liveChanges(takeRouteChanges(req), {
        collection: collection.slug,
        id,
        live: isLive(collection.slug, subject),
        trashed: Boolean(subject.deletedAt),
      });
      if (changes.length === 0) return doc;
      const own = changes.find(
        (change) => change.collection === collection.slug,
      );
      const [tenants, found] = await Promise.all([
        loadTenants(payload, req),
        referrers(
          payload,
          req,
          changes.map(({ collection: target, id: targetId }) => ({
            collection: target,
            id: targetId,
          })),
        ),
      ]);
      const change = documentChange(
        changes,
        found,
        tenants,
        collection.slug,
        own?.reason ?? changes[0].reason,
      );
      await deliver({
        revalidator,
        payload,
        req,
        change: change.tags.length > 0 ? change : undefined,
        status: { collection: collection.slug, docId: id },
      });
    } catch (error) {
      req.payload.logger.error(
        { err: error, collection: collection.slug, id },
        "Site refresh could not start; the save stands and the site refreshes when the cache expires",
      );
    }
    return doc;
  };
}

export function revalidateOnDelete(
  revalidator: Revalidator,
): CollectionAfterDeleteHook {
  return async ({ doc, id, req, collection }) => {
    const key = String(id);
    try {
      const { payload } = req;
      const { changes } = liveChanges(takeRouteChanges(req), {
        collection: collection.slug,
        id: key,
        live: false,
        deleted: true,
      });
      await removeRefreshStatus(payload, {
        collection: collection.slug,
        docId: key,
      });
      if (changes.length === 0) return doc;
      const [tenants, found] = await Promise.all([
        loadTenants(payload, req),
        referrers(
          payload,
          req,
          changes.map(({ collection: target, id: targetId }) => ({
            collection: target,
            id: targetId,
          })),
        ),
      ]);
      const change = documentChange(
        changes,
        found,
        tenants,
        collection.slug,
        "delete",
      );
      await deliver({ revalidator, payload, req, change });
    } catch (error) {
      req.payload.logger.error(
        { err: error, collection: collection.slug, id: key },
        "Site refresh could not start; the delete stands and the site refreshes when the cache expires",
      );
    }
    return doc;
  };
}

type TemplateDoc = RevalidatableDoc & {
  recordType?: string | null;
  tenant?: Parameters<typeof refId>[0];
};

const TEMPLATE_TYPES = Object.keys(TEMPLATE_COLLECTION);

async function governedRows(
  payload: Payload,
  req: Request,
  recordType: TemplateRecordType,
  tenant: string | undefined,
): Promise<RouteSnapshot[]> {
  const collection = TEMPLATE_COLLECTION[recordType];
  const clauses: Where[] = [{ "doc.relationTo": { equals: collection } }];
  if (tenant && (recordType === "job" || recordType === "post")) {
    clauses.push({ tenant: { equals: tenant } });
  }
  const rows: StoredRoute[] = await storedRoutes(payload, req, {
    and: clauses,
  });
  return rows.map((row) => ({
    tenant: refId(row.tenant) ?? null,
    locale: row.locale,
    path: row.path,
  }));
}

export async function templateRevalidation(
  payload: Payload,
  req: Request,
  kind: TemplateKind,
  template: { recordType: string; tenant?: string },
): Promise<RevalidationChange | undefined> {
  if (!TEMPLATE_TYPES.includes(template.recordType)) return undefined;
  const recordType = template.recordType as TemplateRecordType;
  const tenant = kind === "tenant" ? template.tenant : undefined;
  if (kind === "tenant" && !tenant) return undefined;
  const [tenants, governed] = await Promise.all([
    loadTenants(payload, req),
    governedRows(payload, req, recordType, tenant),
  ]);
  const bases =
    recordType === "product" || recordType === "solution"
      ? await recordBasePaths(
          payload,
          req,
          TEMPLATE_COLLECTION[recordType] as "products",
        )
      : recordType === "job"
        ? await jobBasePaths(payload, req, tenant)
        : undefined;
  return templateChange({ kind, recordType, tenant, governed, bases }, tenants);
}

type MainRow = { _status?: unknown; updatedAt?: unknown };

const templateKey = (collection: string, id: number | string) =>
  `templateMainRow:${collection}:${id}`;

async function mainRow(
  req: PayloadRequest,
  collection: string,
  id: number | string,
): Promise<MainRow | null> {
  return (await req.payload.db.findOne({
    collection: collection as CollectionSlug,
    where: { id: { equals: id } },
    req,
  })) as MainRow | null;
}

export const captureTemplateRow: CollectionBeforeChangeHook = async ({
  data,
  operation,
  originalDoc,
  collection,
  req,
}) => {
  const id = (originalDoc as { id?: number | string } | undefined)?.id;
  if (operation === "update" && id !== undefined) {
    req.context[templateKey(collection.slug, id)] = await mainRow(
      req,
      collection.slug,
      id,
    );
  }
  return data;
};

async function isTemplateLive(
  doc: TemplateDoc,
  collection: string,
  req: PayloadRequest,
): Promise<boolean> {
  const key = templateKey(collection, doc.id);
  const before = req.context[key] as MainRow | null | undefined;
  delete req.context[key];
  const after = await mainRow(req, collection, doc.id);
  const was = before?._status === "published";
  const is = after?._status === "published";
  if (was && !is) return true;
  if (!is) return false;
  return !was || String(before?.updatedAt) !== String(after?.updatedAt);
}

export function revalidateTemplate(
  kind: TemplateKind,
  revalidator: Revalidator,
): CollectionAfterChangeHook {
  return async ({ doc, req, collection }) => {
    const subject = doc as TemplateDoc;
    try {
      if (!(await isTemplateLive(subject, collection.slug, req))) {
        return doc;
      }
      const change = await templateRevalidation(req.payload, req, kind, {
        recordType: String(subject.recordType),
        tenant: refId(subject.tenant),
      });
      await deliver({
        revalidator,
        payload: req.payload,
        req,
        change,
        status: { collection: collection.slug, docId: String(subject.id) },
      });
    } catch (error) {
      req.payload.logger.error(
        { err: error, collection: collection.slug, id: subject.id },
        "Site refresh could not start; the save stands and the site refreshes when the cache expires",
      );
    }
    return doc;
  };
}

export function revalidateTemplateOnDelete(
  kind: TemplateKind,
  revalidator: Revalidator,
): CollectionAfterDeleteHook {
  return async ({ doc, id, req, collection }) => {
    const subject = doc as TemplateDoc;
    try {
      await removeRefreshStatus(req.payload, {
        collection: collection.slug,
        docId: String(id),
      });
      if (subject._status !== "published") return doc;
      const change = await templateRevalidation(req.payload, req, kind, {
        recordType: String(subject.recordType),
        tenant: refId(subject.tenant),
      });
      await deliver({ revalidator, payload: req.payload, req, change });
    } catch (error) {
      req.payload.logger.error(
        { err: error, collection: collection.slug, id },
        "Site refresh could not start; the delete stands and the site refreshes when the cache expires",
      );
    }
    return doc;
  };
}

export function revalidateEntityReferrers(
  revalidator: Revalidator,
): CollectionAfterChangeHook {
  return async ({ doc, req, collection }) => {
    const subject = doc as RevalidatableDoc & {
      tenant?: Parameters<typeof refId>[0];
    };
    const tenantId = refId(subject.tenant);
    try {
      const { payload } = req;
      const { changes } = liveChanges(takeRouteChanges(req));
      const found = tenantId
        ? await referrers(payload, req, [
            { collection: "tenants", id: tenantId },
          ])
        : [];
      if (changes.length === 0 && found.length === 0) return doc;
      const tenants = await loadTenants(payload, req);
      const parts = [
        ...(changes.length > 0
          ? [documentChange(changes, [], tenants, collection.slug, "move")]
          : []),
        ...(found.length > 0
          ? [referrersChange(found, tenants, collection.slug, "settings")]
          : []),
      ];
      const change = mergeChanges(parts, collection.slug, "settings");
      await deliver({
        revalidator,
        payload,
        req,
        change: change.tags.length > 0 ? change : undefined,
        status: { collection: collection.slug, docId: String(subject.id) },
      });
    } catch (error) {
      req.payload.logger.error(
        { err: error, collection: collection.slug, id: subject.id },
        "Site refresh could not start; the save stands and the site refreshes when the cache expires",
      );
    }
    return doc;
  };
}

export function revalidateRoutingMoves(
  revalidator: Revalidator,
): GlobalAfterChangeHook {
  return async ({ doc, req, global }) => {
    try {
      const { payload } = req;
      const { changes } = liveChanges(takeRouteChanges(req));
      if (changes.length === 0) return doc;
      const [tenants, found] = await Promise.all([
        loadTenants(payload, req),
        referrers(
          payload,
          req,
          changes.map(({ collection, id }) => ({ collection, id })),
        ),
      ]);
      await deliver({
        revalidator,
        payload,
        req,
        change: documentChange(changes, found, tenants, global.slug, "move"),
      });
    } catch (error) {
      req.payload.logger.error(
        { err: error, global: global.slug },
        "Site refresh could not start; the save stands and the site refreshes when the cache expires",
      );
    }
    return doc;
  };
}
