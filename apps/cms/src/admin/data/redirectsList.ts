import type { Payload, TypedUser } from "payload";

import type { LinkData } from "../../fields/link";
import { liveKey, livePagesAt } from "../../redirectLive";
import { routePathOf } from "../../redirectRules";
import { loadCompany } from "./jobsList";
import { CATALOG_LIMIT } from "./productsCatalog";
import {
  redirectsWhere,
  type RedirectsQuery,
} from "../components/redirects/redirects";

export type RedirectTarget = {
  kind: "reference" | "internal" | "external";
  name: string;
  path: string;
};

export type RedirectRow = {
  id: string;
  from: string;
  target: RedirectTarget;
  locale: string;
  createdAt: string | null;
  createdBy: string | null;
  origin: "auto" | "manual";
  allSites: boolean;
  liveName: string | undefined;
};

export type RedirectsData = {
  rows: RedirectRow[];
  truncated: boolean;
  total: number;
  company: { name: string; domain: string };
};

type Localized = Record<string, string | null | undefined> | string | null;

type StoredRow = {
  id: number | string;
  from: string;
  locale: string;
  origin: "auto" | "manual";
  tenant?: unknown;
  createdAt?: string | null;
  createdBy?: { name?: string | null } | number | string | null;
  to?: LinkData & {
    reference?: {
      relationTo: string;
      value?: {
        title?: Localized;
        name?: Localized;
        slug?: Localized;
      } | null;
    } | null;
  };
};

function text(value: Localized | undefined): string {
  if (typeof value === "string") return value;
  return value?.en ?? "";
}

async function targetOf(
  payload: Payload,
  row: StoredRow,
): Promise<RedirectTarget> {
  const link = row.to;
  if (link?.type === "reference") {
    const value = link.reference?.value;
    const name =
      value && typeof value === "object"
        ? text(value.title) || text(value.name) || text(value.slug)
        : "";
    const path = await routePathOf({ payload }, link, row.locale);
    return { kind: "reference", name, path: path ?? "" };
  }
  if (link?.type === "external") {
    return { kind: "external", name: "", path: link.externalUrl ?? "" };
  }
  return { kind: "internal", name: "", path: link?.internalPath ?? "" };
}

export async function loadRedirects(
  payload: Payload,
  user: TypedUser,
  tenant: number | string,
  query: RedirectsQuery,
): Promise<RedirectsData> {
  const [company, found] = await Promise.all([
    loadCompany(payload, user, tenant),
    payload.find({
      collection: "redirects",
      where: redirectsWhere(query, tenant),
      sort: ["-createdAt", "-id"],
      limit: CATALOG_LIMIT,
      depth: 1,
      locale: "en",
      overrideAccess: false,
      user,
    }),
  ]);
  const docs = found.docs as unknown as StoredRow[];
  const live = await livePagesAt(
    payload,
    tenant,
    docs.map(({ from }) => from),
  );
  const rows = await Promise.all(
    docs.map(async (row): Promise<RedirectRow> => ({
      id: String(row.id),
      from: row.from,
      target: await targetOf(payload, row),
      locale: row.locale,
      createdAt: row.createdAt ?? null,
      createdBy:
        row.createdBy && typeof row.createdBy === "object"
          ? (row.createdBy.name ?? null)
          : null,
      origin: row.origin,
      allSites: row.tenant === null || row.tenant === undefined,
      liveName: live.get(liveKey(row.locale, row.from)),
    })),
  );
  return {
    rows,
    truncated: found.totalDocs > CATALOG_LIMIT,
    total: found.totalDocs,
    company,
  };
}
