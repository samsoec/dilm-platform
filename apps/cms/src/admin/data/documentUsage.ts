import type { CollectionSlug, Payload, TypedUser } from "payload";

import { localization } from "../../localization";
import { refId } from "../../pageRules";
import { asId, findReferrersByTarget, refKey } from "../../routeIndex";

export type DocumentUsage = { count: number; live: number };

type Row = Record<string, unknown> & { id: number | string };

const none = (): DocumentUsage => ({ count: 0, live: 0 });

export function productUses(
  products: Row[],
  ids: string[],
): Map<string, DocumentUsage> {
  const usage = new Map<string, DocumentUsage>();
  const add = (id: string, live: boolean) => {
    const entry = usage.get(id) ?? none();
    entry.count += 1;
    if (live) entry.live += 1;
    usage.set(id, entry);
  };
  const wanted = new Set(ids);
  for (const product of products) {
    const live = product._status === "published";
    const own = refId(product.pdsFile as never);
    if (own && wanted.has(own)) add(own, live);
    const variants = Array.isArray(product.variants)
      ? (product.variants as Record<string, unknown>[])
      : [];
    for (const variant of variants) {
      const linked = new Set(
        [
          refId(variant.pdsFile as never),
          refId(variant.sdsFile as never),
        ].filter((id): id is string => Boolean(id) && wanted.has(id as string)),
      );
      for (const id of linked) add(id, live);
    }
  }
  return usage;
}

export async function loadDocumentUsage(
  payload: Payload,
  user: TypedUser,
  ids: string[],
): Promise<Map<string, DocumentUsage>> {
  const usage = new Map<string, DocumentUsage>(ids.map((id) => [id, none()]));
  if (ids.length === 0) return usage;
  const read = (collection: string, where: object) =>
    payload.find({
      collection: collection as CollectionSlug,
      where: where as never,
      locale: localization.defaultLocale as "en",
      fallbackLocale: localization.defaultLocale as "en",
      depth: 0,
      limit: 0,
      pagination: false,
      overrideAccess: false,
      user,
    }) as unknown as Promise<{ docs: Row[] }>;
  const bump = (id: string, live: boolean) => {
    const entry = usage.get(id) ?? none();
    entry.count += 1;
    if (live) entry.live += 1;
    usage.set(id, entry);
  };

  const keys = ids.map(asId);
  const { docs: products } = await read("products", {
    or: [
      { pdsFile: { in: keys } },
      { "variants.pdsFile": { in: keys } },
      { "variants.sdsFile": { in: keys } },
    ],
  });
  for (const [id, entry] of productUses(products, ids)) {
    const total = usage.get(id) ?? none();
    total.count += entry.count;
    total.live += entry.live;
    usage.set(id, total);
  }

  const referrers = await findReferrersByTarget(
    payload,
    ids.map((id) => ({ collection: "documents", id })),
  );
  const wanted = new Map<string, Set<string>>();
  for (const list of referrers.values()) {
    for (const referrer of list) {
      const set = wanted.get(referrer.collection) ?? new Set<string>();
      set.add(referrer.id);
      wanted.set(referrer.collection, set);
    }
  }
  const readable = new Map<string, boolean>();
  for (const [collection, set] of wanted) {
    const { docs } = await read(collection, { id: { in: [...set].map(asId) } });
    for (const doc of docs) {
      readable.set(refKey(collection, doc.id), doc._status === "published");
    }
  }
  for (const id of ids) {
    for (const referrer of referrers.get(refKey("documents", id)) ?? []) {
      const live = readable.get(refKey(referrer.collection, referrer.id));
      if (live !== undefined) bump(id, live);
    }
  }
  return usage;
}
