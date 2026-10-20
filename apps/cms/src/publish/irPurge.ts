import type {
  CollectionAfterChangeHook,
  CollectionBeforeChangeHook,
  PayloadRequest,
} from "payload";

export const IR_COLLECTION = "ir-documents";

export const SKIP_IR_PURGE = "skipIrPurge";

export type IrTransition = "publish" | "update" | "unpublish" | "trash";

export type PurgeStatus = "ok" | "failed";

export const PURGE_STATUSES: PurgeStatus[] = ["ok", "failed"];

export type LiveRow = {
  id?: number | string;
  _status?: unknown;
  deletedAt?: unknown;
  updatedAt?: unknown;
  locale?: unknown;
  filename?: unknown;
  tenant?: unknown;
};

export type PurgeRequest = {
  transition: IrTransition;
  documentId: number | string;
  tenant: number | string;
  host?: string;
  paths: string[];
  files: string[];
  tags: string[];
};

export type PurgeLogger = Pick<PayloadRequest["payload"]["logger"], "info">;

export type CachePurger = (
  request: PurgeRequest,
  logger: PurgeLogger,
) => Promise<void>;

function isLive(row: LiveRow | null | undefined): boolean {
  return row?._status === "published" && !row.deletedAt;
}

export function irTransition(
  before: LiveRow | null | undefined,
  after: LiveRow | null | undefined,
): IrTransition | undefined {
  if (!after) return undefined;
  if (before && String(before.updatedAt) === String(after.updatedAt)) {
    return undefined;
  }
  const was = isLive(before);
  const is = isLive(after);
  if (!was && is) return "publish";
  if (was && is) return "update";
  if (was && after.deletedAt) return "trash";
  if (was) return "unpublish";
  return undefined;
}

function idOf(value: unknown): number | string | undefined {
  if (value && typeof value === "object")
    return idOf((value as { id?: unknown }).id);
  return typeof value === "number" || typeof value === "string"
    ? value
    : undefined;
}

function unique(values: unknown[]): string[] {
  return [
    ...new Set(
      values.filter(
        (value): value is string => typeof value === "string" && value !== "",
      ),
    ),
  ];
}

export function purgeRequest({
  transition,
  before,
  after,
  host,
}: {
  transition: IrTransition;
  before: LiveRow | null | undefined;
  after: LiveRow;
  host?: string;
}): PurgeRequest | undefined {
  const tenant = idOf(after.tenant) ?? idOf(before?.tenant);
  const documentId = idOf(after.id);
  if (tenant === undefined || documentId === undefined) return undefined;
  return {
    transition,
    documentId,
    tenant,
    host,
    paths: unique([before?.locale, after.locale]).map(
      (locale) => `/${locale}/investor`,
    ),
    files: unique([before?.filename, after.filename]),
    tags: [IR_COLLECTION, `${IR_COLLECTION}:tenant:${tenant}`],
  };
}

// TODO(DILM-32): swap for the Cloudflare cache purge + apps/web revalidation once that mechanism exists.
export const stubPurger: CachePurger = async (request, logger) => {
  logger.info({ purge: request }, "IR cache purge (stubbed until DILM-32)");
};

const contextKey = (id: number | string) => `irLiveRowBefore:${id}`;

async function liveRow(
  req: PayloadRequest,
  id: number | string,
): Promise<LiveRow | null> {
  return (await req.payload.db.findOne({
    collection: IR_COLLECTION,
    where: { id: { equals: id } },
    req,
  })) as LiveRow | null;
}

export const captureLiveRow: CollectionBeforeChangeHook = async ({
  data,
  operation,
  originalDoc,
  req,
}) => {
  if (operation !== "update" || originalDoc?.id === undefined) return data;
  req.context[contextKey(originalDoc.id)] = await liveRow(req, originalDoc.id);
  return data;
};

async function tenantHost(
  req: PayloadRequest,
  tenant: number | string,
): Promise<string | undefined> {
  const found = await req.payload
    .findByID({
      collection: "tenants",
      id: tenant,
      depth: 0,
      select: { domain: true },
      req,
    })
    .catch(() => undefined);
  return typeof found?.domain === "string" && found.domain
    ? found.domain
    : undefined;
}

export function purgeOnLiveChange(
  purger: CachePurger,
): CollectionAfterChangeHook {
  return async ({ doc, operation, req }) => {
    if (req.context[SKIP_IR_PURGE] || doc?.id === undefined) return doc;
    const key = contextKey(doc.id);
    const before =
      operation === "create"
        ? undefined
        : (req.context[key] as LiveRow | null | undefined);
    delete req.context[key];
    let request: PurgeRequest | undefined;
    let status: PurgeStatus = "ok";
    try {
      const after = await liveRow(req, doc.id);
      const transition = irTransition(before, after);
      if (!transition || !after) return doc;
      const tenant = idOf(after.tenant) ?? idOf(before?.tenant);
      request = purgeRequest({
        transition,
        before,
        after,
        host: tenant === undefined ? undefined : await tenantHost(req, tenant),
      });
      if (!request) return doc;
      await purger(request, req.payload.logger);
    } catch (error) {
      status = "failed";
      req.payload.logger.error(
        { err: error, documentId: doc.id },
        "IR cache purge failed; the save stands and the site refreshes when the cache expires",
      );
    }
    const stamp = {
      lastPurgeStatus: status,
      lastPurgeAt: new Date().toISOString(),
    };
    try {
      await req.payload.db.updateOne({
        collection: IR_COLLECTION,
        id: doc.id,
        data: stamp,
        req,
      });
    } catch (error) {
      req.payload.logger.error(
        { err: error, documentId: doc.id },
        "Couldn't record the IR cache purge status",
      );
    }
    return { ...doc, ...stamp };
  };
}
