import {
  HERO_ATTRIBUTES,
  MAX_HIGHLIGHTS,
  renderTokens,
  type HeroRecordType,
  type TokenRecord,
} from "@dilm/shared-types";
import type { Payload, PayloadRequest } from "payload";

import { idOf, referenceFilter, type Ref } from "./fields/link";
import {
  manualCards,
  type CardContext,
  type FindRecords,
  type RecordCard,
  type RecordDoc,
  type RecordQuery,
} from "./recordCards";
import { getPublicationPage, type PublicationPage } from "./siteRouting";

export type Crumb = { label: string; href?: string };

export type BasePageCrumb = { title: string; href?: string } | null;

export type HeroCrumbInput = {
  recordType: HeroRecordType;
  locale: string;
  currentLabel?: string | null;
  record?: TokenRecord | null;
  basePage?: BasePageCrumb;
  publicationPage?: PublicationPage | null;
};

export function heroCrumbs({
  recordType,
  locale,
  currentLabel,
  record,
  basePage,
  publicationPage,
}: HeroCrumbInput): Crumb[] {
  const crumbs: Crumb[] = [];
  if (recordType === "post") {
    if (publicationPage?.title) {
      const href = publicationPage.paths[locale];
      crumbs.push({
        label: publicationPage.title,
        ...(href ? { href } : {}),
      });
    }
  } else if (basePage?.title) {
    crumbs.push({
      label: basePage.title,
      ...(basePage.href ? { href: basePage.href } : {}),
    });
  }
  const current = currentLabel
    ? renderTokens(currentLabel, record, locale).trim()
    : "";
  if (current) crumbs.push({ label: current });
  return crumbs;
}

export async function postHeroCrumbs(
  payload: Payload,
  tenant: number | string,
  input: Omit<HeroCrumbInput, "recordType" | "publicationPage" | "basePage">,
  req?: Partial<PayloadRequest>,
): Promise<Crumb[]> {
  return heroCrumbs({
    ...input,
    recordType: "post",
    publicationPage: await getPublicationPage(payload, tenant, req),
  });
}

export type HeroAttribute = { key: string; label: string; value: string };

export function heroAttributes(
  recordType: HeroRecordType,
  labels: Record<string, string | null | undefined> | null | undefined,
  values: Record<string, string | number | null | undefined>,
): HeroAttribute[] {
  return HERO_ATTRIBUTES[recordType].flatMap((key) => {
    const value = values[key];
    if (value === null || value === undefined || String(value).trim() === "") {
      return [];
    }
    return [{ key, label: labels?.[key] ?? "", value: String(value) }];
  });
}

function isLive(doc: RecordDoc): boolean {
  return !doc.deletedAt && (!doc._status || doc._status === "published");
}

export function highlightDocs(
  items: readonly (RecordDoc | number | string | null | undefined)[] | null,
  current: Ref,
  max = MAX_HIGHLIGHTS,
): (RecordDoc | number | string)[] {
  const own = idOf(current);
  const seen = new Set<string>();
  const kept: (RecordDoc | number | string)[] = [];
  for (const item of items ?? []) {
    if (item === null || item === undefined) continue;
    const id = idOf(item as Ref);
    if (!id || id === own || seen.has(id)) continue;
    if (typeof item === "object" && !isLive(item)) continue;
    seen.add(id);
    kept.push(item);
  }
  return kept.slice(0, max);
}

export async function highlightCards(
  items: readonly (RecordDoc | number | string | null | undefined)[] | null,
  current: Ref,
  context: CardContext = {},
): Promise<RecordCard[]> {
  return (
    await manualCards("posts", highlightDocs(items, current), context)
  ).slice(0, MAX_HIGHLIGHTS);
}

export type NeighbourPost = {
  id: Ref;
  tenant?: Ref;
  publishedAt?: string | Date | null;
};

export type NeighbourQueries = {
  previous: RecordQuery;
  next: RecordQuery;
};

export const NEIGHBOUR_WINDOW = 3;

export function neighbourQueries(post: NeighbourPost): NeighbourQueries | null {
  const own = idOf(post.id);
  const moment = post.publishedAt
    ? new Date(post.publishedAt).toISOString()
    : null;
  if (!own || !moment) return null;
  const scope = referenceFilter("posts", post.tenant);
  const base = typeof scope === "object" ? [scope] : [];
  const side = (older: boolean): RecordQuery => ({
    collection: "posts",
    where: {
      and: [
        ...base,
        { publishedAt: { exists: true } },
        {
          or: [
            { publishedAt: { [older ? "less_than" : "greater_than"]: moment } },
            {
              and: [
                { publishedAt: { equals: moment } },
                { id: { [older ? "less_than" : "greater_than"]: own } },
              ],
            },
          ],
        },
      ],
    },
    sort: older ? ["-publishedAt", "-id"] : ["publishedAt", "id"],
    limit: NEIGHBOUR_WINDOW,
    page: 1,
    depth: 1,
  });
  return { previous: side(true), next: side(false) };
}

export type Neighbours = {
  previous: RecordCard | null;
  next: RecordCard | null;
};

export async function neighbourCards(
  find: FindRecords,
  post: NeighbourPost,
  context: CardContext = {},
): Promise<Neighbours> {
  const queries = neighbourQueries(post);
  if (!queries) return { previous: null, next: null };
  const own = idOf(post.id);
  const pick = async (query: RecordQuery): Promise<RecordCard | null> => {
    const docs = (await find(query)).filter((doc) => String(doc.id) !== own);
    return (await manualCards("posts", docs, context))[0] ?? null;
  };
  const [previous, next] = await Promise.all([
    pick(queries.previous),
    pick(queries.next),
  ]);
  return { previous, next };
}
