import type { CollectionSlug, Payload, TypedUser } from "payload";

import { localization } from "../../localization";
import { refId } from "../../pageRules";
import { sectionsReferencing } from "../../publish/usedInSections";
import { findReferrers, refKey } from "../../routeIndex";
import { relationId } from "../components/editor/urls";
import { getPublishStatus } from "../components/kit/publication";
import { getReach } from "../components/kit/reach";
import {
  sectionLabel,
  variantLabel,
  type UsedInData,
  type UsedInRow,
} from "../components/kit/usedIn";

const TYPE_LABELS: Record<string, string> = {
  pages: "Page",
  "shared-pages": "Shared page",
  jobs: "Job",
  posts: "Post",
  categories: "Category",
  solutions: "Solution",
  products: "Product",
  "detail-templates": "Detail template",
  "shared-detail-templates": "Detail template",
};

type Row = Record<string, unknown> & { id: number | string };

function text(value: unknown): string {
  return typeof value === "string" && value ? value : "Untitled";
}

export function typeLabel(collection: string): string {
  return TYPE_LABELS[collection] ?? collection;
}

export async function loadUsedIn(
  payload: Payload,
  user: TypedUser,
  collection: string,
  id: string | undefined,
  locale: string = localization.defaultLocale,
): Promise<UsedInData> {
  const none: UsedInData = { rows: [], hidden: 0, unit: "places" };
  if (id === undefined) return none;
  const admin = payload.config.routes.admin;
  const { docs: tenants } = await payload.find({
    collection: "tenants",
    select: { name: true, domain: true },
    sort: "id",
    pagination: false,
    depth: 0,
    overrideAccess: false,
    user,
  });
  const reachTenants = tenants as unknown as {
    id: number | string;
    name?: string;
    domain?: string;
  }[];

  const read = (slug: string, where: object, extra: object = {}) =>
    payload.find({
      collection: slug as CollectionSlug,
      where: where as never,
      locale: locale as "en",
      fallbackLocale: localization.defaultLocale as "en",
      depth: 0,
      limit: 0,
      pagination: false,
      overrideAccess: false,
      user,
      ...extra,
    }) as unknown as Promise<{ docs: Row[] }>;

  const base = (slug: string, doc: Row) => {
    const tenant = relationId(doc.tenant as never);
    const company = reachTenants.find((row) => String(row.id) === tenant);
    return {
      href: `${admin}/collections/${slug}/${doc.id}`,
      type: typeLabel(slug),
      reach: getReach(doc as never, {
        collection: slug,
        tenants: reachTenants,
        sites: reachTenants.length || undefined,
      }),
      owner: company?.name ?? "All companies",
    };
  };

  const rows: UsedInRow[] = [];
  const referrers = await findReferrers(payload, collection, id);
  const byCollection = new Map<string, string[]>();
  for (const referrer of referrers) {
    byCollection.set(referrer.collection, [
      ...(byCollection.get(referrer.collection) ?? []),
      referrer.id,
    ]);
  }
  let readable = 0;
  const key = refKey(collection, id);
  for (const [slug, ids] of byCollection) {
    const { docs } = await read(slug, { id: { in: ids } });
    readable += docs.length;
    for (const doc of docs) {
      const sections = sectionsReferencing(doc.layout, key);
      rows.push({
        key: `${slug}:${doc.id}`,
        label: sectionLabel(text(doc.title ?? doc.name), sections),
        status: getPublishStatus(doc as never),
        ...base(slug, doc),
      });
    }
  }
  const hidden = referrers.length - readable;

  if (collection === "products") {
    const { docs } = await read(
      "solutions",
      {
        and: [
          { _status: { equals: "published" } },
          {
            or: [
              { supportingProducts: { contains: id } },
              { featuredProduct: { equals: id } },
            ],
          },
        ],
      },
      { draft: false },
    );
    for (const doc of docs) {
      rows.push({
        key: `solutions:${doc.id}`,
        label: sectionLabel(text(doc.name), ["Supporting or featured product"]),
        status: getPublishStatus(doc as never),
        ...base("solutions", doc),
      });
    }
  }

  if (collection === "documents") {
    const { docs } = await read("products", {
      or: [
        { pdsFile: { equals: id } },
        { "variants.pdsFile": { equals: id } },
        { "variants.sdsFile": { equals: id } },
      ],
    });
    const variants: UsedInRow[] = [];
    for (const doc of docs) {
      const list = Array.isArray(doc.variants)
        ? (doc.variants as Record<string, unknown>[])
        : [];
      const names = list
        .filter(
          (variant) =>
            refId(variant.pdsFile as never) === id ||
            refId(variant.sdsFile as never) === id,
        )
        .map((variant) => text(variant.name));
      if (refId(doc.pdsFile as never) === id) names.push("Product PDS");
      for (const name of names) {
        variants.push({
          key: `products:${doc.id}:${name}`,
          label: variantLabel(text(doc.name), name),
          status: getPublishStatus(doc as never),
          ...base("products", doc),
        });
      }
    }
    return {
      rows: [...variants, ...rows],
      hidden,
      unit: rows.length === 0 ? "variants" : "places",
    };
  }

  return { rows, hidden, unit: "places" };
}
