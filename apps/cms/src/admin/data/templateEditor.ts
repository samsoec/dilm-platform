import type { CollectionSlug, Payload, TypedUser, Where } from "payload";
import { DETAIL_TYPE_LABELS, type DetailRecordType } from "@dilm/shared-types";

import {
  hasTenantAccess,
  isSuperAdmin,
  isTenantEditorOrAbove,
  type RoleHolder,
} from "../../access";
import { countGovernedRecords } from "../../detailTemplates";
import { localization } from "../../localization";
import { relationId } from "../components/editor/urls";
import {
  getPublishStatus,
  type PublishStatus,
} from "../components/kit/publication";
import {
  isSharedType,
  STRIP_ORDER,
  stripReach,
} from "../components/templates/templates";

type Context = { payload: Payload; user: TypedUser; tenant?: string };

export type StripItem = {
  type: DetailRecordType;
  label: string;
  reach: string;
  count: number | null;
  href: string | null;
  current: boolean;
  locked: boolean;
};

export type TemplateEditorData = {
  collection: "detail-templates" | "shared-detail-templates";
  recordType: DetailRecordType | undefined;
  tenant: string | null;
  sites: string[];
  companyName?: string;
  status: PublishStatus;
  strip: StripItem[];
  governed: number;
  categoryPaths: string[];
};

function collectionFor(type: DetailRecordType) {
  return isSharedType(type) ? "shared-detail-templates" : "detail-templates";
}

async function tenantDomains(
  { payload, user }: Context,
  only: string | null,
): Promise<{ domain: string; name: string }[]> {
  const { docs } = await payload.find({
    collection: "tenants",
    select: { domain: true, name: true },
    sort: "id",
    pagination: false,
    depth: 0,
    overrideAccess: false,
    user,
    ...(only ? { where: { id: { equals: only } } } : {}),
  });
  return docs
    .map(({ domain, name }) => ({ domain: String(domain), name: String(name) }))
    .filter(({ domain }) => domain);
}

export async function loadStrip(
  context: Context,
  currentType?: DetailRecordType,
): Promise<StripItem[]> {
  const { payload, user, tenant } = context;
  const admin = payload.config.routes.admin;
  const holder = user as RoleHolder;
  return Promise.all(
    STRIP_ORDER.map(async (type) => {
      const slug = collectionFor(type);
      const shared = isSharedType(type);
      const scoped = shared || tenant !== undefined;
      const where: Where = shared
        ? { recordType: { equals: type } }
        : tenant === undefined
          ? { recordType: { equals: type } }
          : {
              and: [
                { recordType: { equals: type } },
                { tenant: { equals: tenant } },
              ],
            };
      const [found, count] = await Promise.all([
        payload.find({
          collection: slug,
          where,
          depth: 0,
          limit: 1,
          select: { recordType: true },
          overrideAccess: false,
          user,
        }),
        scoped
          ? countGovernedRecords(payload, { recordType: type, tenant })
          : Promise.resolve(null),
      ]);
      const id = found.docs[0]?.id;
      const canEdit = shared
        ? isSuperAdmin(holder)
        : isTenantEditorOrAbove(holder) &&
          (tenant === undefined || hasTenantAccess(holder, tenant));
      return {
        type,
        label: DETAIL_TYPE_LABELS[type],
        reach: stripReach(type),
        count,
        href:
          id !== undefined
            ? `${admin}/collections/${slug}/${id}`
            : canEdit
              ? `${admin}/collections/${slug}/create`
              : null,
        current: type === currentType,
        locked: !canEdit,
      };
    }),
  );
}

export async function loadTemplateEditor(
  payload: Payload,
  user: TypedUser,
  collection: TemplateEditorData["collection"],
  id: string,
  selected?: string,
): Promise<TemplateEditorData> {
  const doc = (await payload.findByID({
    collection: collection as CollectionSlug,
    id,
    draft: true,
    depth: 0,
    overrideAccess: false,
    user,
  })) as unknown as {
    recordType?: DetailRecordType;
    tenant?: unknown;
    _status?: string | null;
  };
  const tenant = relationId(doc.tenant as never) ?? null;
  const context: Context = {
    payload,
    user,
    tenant: tenant ?? selected,
  };
  const recordType = doc.recordType;
  const [live, strip, sites, governed, categories] = await Promise.all([
    payload.findVersions({
      collection: collection as CollectionSlug,
      where: {
        and: [
          { parent: { equals: id } },
          { "version._status": { equals: "published" } },
        ],
      },
      limit: 1,
      depth: 0,
      select: { id: true },
      overrideAccess: false,
      user,
    }),
    loadStrip(context, recordType),
    tenantDomains(context, tenant),
    recordType
      ? countGovernedRecords(payload, {
          recordType,
          tenant: tenant ?? undefined,
        })
      : Promise.resolve(0),
    recordType === "category"
      ? payload.find({
          collection: "categories",
          select: { path: true },
          locale: localization.defaultLocale,
          fallbackLocale: false,
          pagination: false,
          sort: "name",
          depth: 0,
          overrideAccess: false,
          user,
        })
      : Promise.resolve({ docs: [] as { path?: string | null }[] }),
  ]);
  return {
    collection,
    recordType,
    tenant,
    sites: sites.map(({ domain }) => domain),
    companyName: tenant ? sites[0]?.name : undefined,
    status: getPublishStatus(
      { _status: doc._status },
      { hasPublishedVersion: live.totalDocs > 0 },
    ),
    strip,
    governed,
    categoryPaths: categories.docs
      .map(({ path }) => (typeof path === "string" ? path : ""))
      .filter(Boolean),
  };
}
