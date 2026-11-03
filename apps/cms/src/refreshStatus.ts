import type { CollectionSlug, Payload } from "payload";

import { joinNames } from "./paths";

export const REFRESH_STATUS_COLLECTION = "refresh-status";

export const REFRESH_STATUSES = ["ok", "failed"] as const;

export type RefreshStatus = (typeof REFRESH_STATUSES)[number];

export type RefreshStatusKey = { collection: string; docId: string };

export const REFRESH_FAILED_MESSAGE =
  "Published, but the site hasn't refreshed yet. It will retry; the administrator has been told. You don't need to publish again.";

export function refreshingMessage(hosts: string[]): string {
  if (hosts.length === 0) {
    return "The site is refreshing; the change shows within minutes.";
  }
  return `${joinNames(hosts)} ${hosts.length === 1 ? "is" : "are"} refreshing; the change shows within minutes.`;
}

export function refreshMessage(
  status: RefreshStatus | null | undefined,
  hosts: string[] = [],
): string | undefined {
  if (status === "failed") return REFRESH_FAILED_MESSAGE;
  if (status === "ok") return refreshingMessage(hosts);
  return undefined;
}

type StatusRow = {
  id: number | string;
  status: RefreshStatus;
  at: string;
  hosts?: unknown;
};

const slug = REFRESH_STATUS_COLLECTION as CollectionSlug;

async function findRow(
  payload: Payload,
  key: RefreshStatusKey,
): Promise<StatusRow | undefined> {
  const { docs } = await payload.find({
    collection: slug,
    where: {
      and: [
        { collection: { equals: key.collection } },
        { docId: { equals: key.docId } },
      ],
    },
    depth: 0,
    limit: 1,
    pagination: false,
    overrideAccess: true,
  });
  return docs[0] as unknown as StatusRow | undefined;
}

export async function readRefreshStatus(
  payload: Payload,
  key: RefreshStatusKey,
): Promise<
  | { status: RefreshStatus; at: string; hosts: string[]; message: string }
  | undefined
> {
  const row = await findRow(payload, key);
  if (!row) return undefined;
  const hosts = Array.isArray(row.hosts)
    ? row.hosts.filter((host): host is string => typeof host === "string")
    : [];
  return {
    status: row.status,
    at: row.at,
    hosts,
    message: refreshMessage(row.status, hosts)!,
  };
}

export async function recordRefreshStatus(
  payload: Payload,
  key: RefreshStatusKey,
  status: RefreshStatus,
  hosts: string[],
): Promise<void> {
  try {
    const row = await findRow(payload, key);
    const data = { ...key, status, hosts, at: new Date().toISOString() };
    if (row) {
      await payload.update({
        collection: slug,
        id: row.id,
        data: data as never,
        overrideAccess: true,
      });
    } else {
      await payload.create({
        collection: slug,
        data: data as never,
        overrideAccess: true,
      });
    }
  } catch (error) {
    payload.logger.error(
      { err: error, ...key },
      "Couldn't record the site refresh status",
    );
  }
}

export async function removeRefreshStatus(
  payload: Payload,
  key: RefreshStatusKey,
): Promise<void> {
  try {
    await payload.delete({
      collection: slug,
      where: {
        and: [
          { collection: { equals: key.collection } },
          { docId: { equals: key.docId } },
        ],
      },
      overrideAccess: true,
    });
  } catch (error) {
    payload.logger.error(
      { err: error, ...key },
      "Couldn't clear the site refresh status",
    );
  }
}
