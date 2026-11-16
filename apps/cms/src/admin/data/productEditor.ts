import type { Payload, TypedUser } from "payload";

import type { RoleHolder } from "../../access";
import { pathsOf, relationId } from "../components/editor/urls";
import {
  getPublishStatus,
  type PublishStatus,
} from "../components/kit/publication";
import { canEditProduct } from "../components/products/catalog";
import { peopleNames } from "./pagesTree";

export type ProductEditorData = {
  status: PublishStatus;
  path: string;
  domains: string[];
  owner: string;
  canEdit: boolean;
  liveSince: string | null;
  savedAt: string | null;
  savedBy: string | null;
  versions: number;
};

export function blankProductEditor(): ProductEditorData {
  return {
    status: "draft",
    path: "",
    domains: [],
    owner: "Your company",
    canEdit: true,
    liveSince: null,
    savedAt: null,
    savedBy: null,
    versions: 1,
  };
}

export async function loadProductEditor(
  payload: Payload,
  user: TypedUser,
  id: string | undefined,
  locale: string,
  collection: "products" | "solutions" = "products",
): Promise<ProductEditorData> {
  const context = { payload, user };
  const { docs: tenants } = await payload.find({
    collection: "tenants",
    select: { name: true, domain: true },
    sort: "id",
    pagination: false,
    depth: 0,
    overrideAccess: false,
    user,
  });
  const domains = tenants.map(({ domain }) => domain).filter(Boolean);
  if (id === undefined) return { ...blankProductEditor(), domains };

  const doc = await payload.findByID({
    collection,
    id,
    draft: true,
    depth: 0,
    locale: locale as "en",
    fallbackLocale: "en",
    trash: true,
    overrideAccess: false,
    user,
  });
  const owner = relationId(doc.tenant as never);
  const company = tenants.find(({ id: tenant }) => String(tenant) === owner);
  const [live, count] = await Promise.all([
    payload.findVersions({
      collection,
      where: {
        and: [
          { parent: { equals: id } },
          { "version._status": { equals: "published" } },
        ],
      },
      sort: "-updatedAt",
      limit: 1,
      depth: 0,
      overrideAccess: false,
      user,
    }),
    payload.countVersions({
      collection,
      where: { parent: { equals: id } },
      overrideAccess: false,
      user,
    }),
  ]);
  const saver = relationId(doc.updatedBy as never);
  const names = saver ? await peopleNames(context, [saver]) : new Map();
  const path = pathsOf(doc);
  return {
    status: getPublishStatus(
      { _status: doc._status, deletedAt: doc.deletedAt },
      { hasPublishedVersion: live.totalDocs > 0 },
    ),
    path: path[locale] ?? path.en ?? Object.values(path)[0] ?? "",
    domains,
    owner: company?.name ?? "another company",
    canEdit: owner !== undefined && canEditProduct(user as RoleHolder, owner),
    liveSince: live.docs[0]?.updatedAt ?? null,
    savedAt: doc.updatedAt ?? null,
    savedBy: saver ? (names.get(saver) ?? null) : null,
    versions: Math.max(count.totalDocs, 1),
  };
}
