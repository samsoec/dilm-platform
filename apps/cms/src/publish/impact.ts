import type {
  CollectionSlug,
  Payload,
  PayloadHandler,
  PayloadRequest,
} from "payload";
import { DETAIL_TYPE_LABELS, type DetailRecordType } from "@dilm/shared-types";

import { consentMissingMessage, isConsentEmpty } from "../blocks/consentForm";
import {
  type RoleHolder,
  hasAnyRole,
  hasTenantAccess,
  isTenantEditorOrAbove,
} from "../access";
import { countGovernedRecords } from "../detailTemplates";
import {
  ALL_SITE_COLLECTIONS,
  allSitesLabel,
} from "../admin/components/kit/reach";
import { localization } from "../localization";
import { json } from "../pageDialog";
import { refId, scopedReq } from "../pageRules";
import { findReferrers, refKey, type Referrer } from "../routeIndex";
import { sectionsReferencing } from "./usedInSections";
import { COOKIE_POLICY_LOCKED, findCookiePolicyLinks } from "../siteMessages";
import {
  baseState,
  baseUnpublishedMessage,
  baseUnsetMessage,
  firstDependency,
} from "../siteRouting";
import {
  placementsIn,
  type Impact,
  type LinkRef,
  type Placement,
  type PublishBlock,
  type SiteUrls,
  type TrashRefusal,
} from "./confirmations";

export const MAX_LISTED_LINKS = 25;

type Doc = Record<string, unknown> & {
  id: number | string;
  _status?: string | null;
  deletedAt?: string | null;
};

type Tenant = { id: number | string; domain?: string | null };

type Map = Record<string, string | null | undefined>;

const PAGE_COLLECTIONS = ["pages", "shared-pages"] as const;

function asMap(value: unknown): Map {
  if (typeof value === "string") return { [localization.defaultLocale]: value };
  return value && typeof value === "object" ? (value as Map) : {};
}

function titleOf(value: unknown): string {
  const map = asMap(value);
  return (
    map[localization.defaultLocale] ||
    Object.values(map).find(Boolean) ||
    "Untitled"
  );
}

function localeCodes(): string[] {
  return (localization.locales as readonly (string | { code: string })[]).map(
    (locale) => (typeof locale === "string" ? locale : locale.code),
  );
}

export function urlsFor(
  domain: string,
  paths: Map,
): { locale: string; url: string }[] {
  return localeCodes().flatMap((locale) => {
    const path = paths[locale] || paths[localization.defaultLocale];
    if (!path) return [];
    const tail = path === "/" ? "" : path;
    return [{ locale, url: `${domain}/${locale}${tail}` }];
  });
}

async function loadTenants(
  payload: Payload,
  req: PayloadRequest,
): Promise<Tenant[]> {
  const { docs } = await payload.find({
    collection: "tenants",
    depth: 0,
    pagination: false,
    overrideAccess: true,
    req: scopedReq(req),
  });
  return docs as unknown as Tenant[];
}

async function referrerTitle(
  payload: Payload,
  req: PayloadRequest,
  referrer: Referrer,
  key: string,
): Promise<LinkRef> {
  let title: string;
  let sections: string[] = [];
  try {
    const doc = (await payload.findByID({
      collection: referrer.collection as CollectionSlug,
      id: referrer.id,
      locale: "all",
      fallbackLocale: false,
      depth: 0,
      overrideAccess: true,
      req: scopedReq(req),
    })) as unknown as { title?: unknown };
    title = titleOf(doc.title);
    sections = sectionsReferencing((doc as { layout?: unknown }).layout, key);
  } catch {
    title = "Untitled";
  }
  return {
    collection: referrer.collection,
    id: referrer.id,
    title,
    sections,
    paths: referrer.paths,
  };
}

export function splitByVisibility<T extends object>(
  docs: T[],
  user: RoleHolder,
  onlyTenant?: string,
): { visible: T[]; hidden: number } {
  const visible = docs.filter((doc) => {
    const tenant = refId((doc as { tenant?: unknown }).tenant as never);
    if (!tenant) return true;
    if (onlyTenant !== undefined && tenant !== onlyTenant) return false;
    return hasTenantAccess(user, tenant);
  });
  return { visible, hidden: docs.length - visible.length };
}

async function pickingSolutions(
  payload: Payload,
  req: PayloadRequest,
  id: string,
  onlyTenant?: string,
): Promise<{ links: LinkRef[]; visible: number; hidden: number }> {
  const { docs } = await payload.find({
    collection: "solutions",
    where: {
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
    locale: "all",
    fallbackLocale: false,
    depth: 0,
    limit: 200,
    pagination: false,
    overrideAccess: true,
    req: scopedReq(req),
  });
  const { visible, hidden } = splitByVisibility(
    docs as unknown as Doc[],
    req.user,
    onlyTenant,
  );
  const links = visible.slice(0, MAX_LISTED_LINKS).map((doc) => ({
    collection: "solutions",
    id: String(doc.id),
    title: titleOf(doc.name),
    sections: ["Supporting or featured product"],
    paths: Object.fromEntries(
      Object.entries(asMap(doc.path)).flatMap(([locale, path]) =>
        path ? [[locale, path]] : [],
      ),
    ),
  }));
  return { links, visible: visible.length, hidden };
}

export function visibleReferrers(
  referrers: Referrer[],
  user: RoleHolder,
  onlyTenant?: string,
): Referrer[] {
  return referrers.filter((link) => {
    if (link.tenant === null) return true;
    if (onlyTenant !== undefined && link.tenant !== onlyTenant) return false;
    return hasTenantAccess(user, link.tenant);
  });
}

export function errorStatus(error: unknown): number | undefined {
  const status = (error as { status?: unknown } | null)?.status;
  return typeof status === "number" ? status : undefined;
}

export function consentBlock(layout: unknown): PublishBlock | null {
  if (!Array.isArray(layout)) return null;
  const locales = localeCodes();
  for (const row of layout as {
    form?: { consentText?: Record<string, unknown> | null } | null;
  }[]) {
    const text = row?.form?.consentText;
    if (text === undefined) continue;
    const missing = locales.filter((code) => isConsentEmpty(text?.[code]));
    if (missing.length > 0) {
      return { kind: "consent", message: consentMissingMessage(missing) };
    }
  }
  return null;
}

// TODO(DILM-130): scans every page and shared page; narrow with a routes.refs-style index if lists grow.
async function postPlacements(
  payload: Payload,
  req: PayloadRequest,
  postId: string,
): Promise<Placement[]> {
  const placements: Placement[] = [];
  for (const collection of PAGE_COLLECTIONS) {
    const { docs } = await payload.find({
      collection,
      locale: "all",
      fallbackLocale: false,
      depth: 0,
      draft: false,
      pagination: false,
      overrideAccess: true,
      req: scopedReq(req),
    });
    for (const doc of docs as unknown as (Doc & { layout?: unknown })[]) {
      for (const kind of placementsIn(doc.layout, postId)) {
        placements.push({
          kind,
          collection,
          pageId: String(doc.id),
          pageTitle: titleOf(doc.title),
        });
      }
    }
  }
  return placements;
}

async function childrenOf(
  payload: Payload,
  req: PayloadRequest,
  id: string,
): Promise<{ id: string; title: string }[]> {
  const { docs } = await payload.find({
    collection: "pages",
    where: { parent: { equals: id } },
    locale: "all",
    fallbackLocale: false,
    depth: 0,
    pagination: false,
    overrideAccess: true,
    req: scopedReq(req),
  });
  return (docs as unknown as Doc[]).map((doc) => ({
    id: String(doc.id),
    title: titleOf(doc.title),
  }));
}

async function trashRefusal(
  payload: Payload,
  req: PayloadRequest,
  collection: "pages" | "shared-pages",
  id: string,
): Promise<TrashRefusal | null> {
  if (collection === "pages") {
    const children = await childrenOf(payload, req, id);
    if (children.length > 0) return { kind: "children", children };
  }
  const dependency = await firstDependency(payload, req, collection, id);
  if (dependency) {
    if (dependency.dependency.setting === "publicationPage") {
      return { kind: "publication", message: dependency.message };
    }
    return {
      kind: "recordBase",
      message: dependency.message,
      label: "Open Company settings",
    };
  }
  const cookie = await findCookiePolicyLinks(id, { payload, req });
  if (cookie.length > 0) {
    return { kind: "cookiePolicy", message: COOKIE_POLICY_LOCKED };
  }
  return null;
}

function isPageCollection(collection: string): boolean {
  return (PAGE_COLLECTIONS as readonly string[]).includes(collection);
}

async function publishBlock(
  payload: Payload,
  req: PayloadRequest,
  collection: string,
  doc: Doc,
): Promise<PublishBlock | null> {
  const tenant = refId(doc.tenant as never);
  if (isPageCollection(collection)) {
    return consentBlock((doc as { layout?: unknown }).layout);
  }
  if (collection === "products" || collection === "solutions") {
    const setting =
      collection === "products" ? "productsPage" : "solutionsPage";
    const state = await baseState(payload, req, setting);
    if (state.state === "unset") {
      return { kind: "routing", message: baseUnsetMessage(setting) };
    }
    if (state.state === "unpublished") {
      return {
        kind: "routing",
        message: baseUnpublishedMessage(setting, state.page.title),
      };
    }
  }
  if (collection === "jobs") {
    const state = await baseState(payload, req, "careerPage", tenant);
    if (state.state === "unset") {
      return { kind: "career", message: baseUnsetMessage("careerPage") };
    }
    if (state.state === "unpublished") {
      return {
        kind: "career",
        message: baseUnpublishedMessage("careerPage", state.page.title),
      };
    }
  }
  return null;
}

export async function publishImpact(
  req: PayloadRequest,
  collection: string,
  id: string,
): Promise<Impact> {
  const { payload } = req;
  const doc = (await payload.findByID({
    collection: collection as CollectionSlug,
    id,
    locale: "all",
    fallbackLocale: false,
    depth: 0,
    draft: true,
    trash: true,
    overrideAccess: false,
    user: req.user,
    req: scopedReq(req),
  })) as unknown as Doc;
  const tenantId = refId(doc.tenant as never);
  if (tenantId && !hasTenantAccess(req.user, tenantId)) {
    throw new Error("forbidden");
  }
  const tenants = await loadTenants(payload, req);
  const shared =
    (ALL_SITE_COLLECTIONS as readonly string[]).includes(collection) ||
    !tenantId;
  const affected = shared
    ? tenants
    : tenants.filter((tenant) => String(tenant.id) === tenantId);
  const paths = asMap(doc.path);
  const sites: SiteUrls[] = affected
    .filter((tenant) => tenant.domain)
    .map((tenant) => ({
      domain: tenant.domain as string,
      urls: urlsFor(tenant.domain as string, paths),
    }));

  const referrers = visibleReferrers(
    await findReferrers(payload, collection, id, req),
    req.user,
    shared ? undefined : tenantId,
  );
  const pageLinks = await Promise.all(
    referrers
      .slice(0, MAX_LISTED_LINKS)
      .map((referrer) =>
        referrerTitle(payload, req, referrer, refKey(collection, id)),
      ),
  );
  const picking =
    collection === "products"
      ? await pickingSolutions(payload, req, id, shared ? undefined : tenantId)
      : { links: [], visible: 0, hidden: 0 };
  const pageKeys = new Set(
    pageLinks.map((link) => `${link.collection}:${link.id}`),
  );
  const pickedLinks = picking.links.filter(
    (link) => !pageKeys.has(`${link.collection}:${link.id}`),
  );
  const links = [...pageLinks, ...pickedLinks];
  const duplicates = picking.links.length - pickedLinks.length;

  const isPage = (PAGE_COLLECTIONS as readonly string[]).includes(collection);
  const detail = collection.endsWith("detail-templates");
  let template: Impact["template"] = null;
  if (detail) {
    const recordType = doc.recordType as DetailRecordType;
    template = {
      type: DETAIL_TYPE_LABELS[recordType] ?? String(recordType),
      count: await countGovernedRecords(
        payload,
        { recordType, tenant: doc.tenant as never },
        req,
      ),
      sites: sites.map((site) => site.domain),
    };
  }

  return {
    title: titleOf(doc.title ?? doc.name),
    collection,
    reach: shared
      ? {
          scope: "all",
          sites: tenants.length,
          label: allSitesLabel(tenants.length),
        }
      : {
          scope: "tenant",
          sites: 1,
          label: sites[0]?.domain ?? "This company",
        },
    sites,
    links,
    linkCount: referrers.length + picking.visible - duplicates,
    hiddenCount: picking.hidden,
    placements:
      collection === "posts" ? await postPlacements(payload, req, id) : [],
    refusal: isPage
      ? await trashRefusal(
          payload,
          req,
          collection as "pages" | "shared-pages",
          id,
        )
      : null,
    block: await publishBlock(payload, req, collection, doc),
    template,
    live: doc._status === "published" && !doc.deletedAt,
  };
}

export function publishImpactHandler(collection: string): PayloadHandler {
  return async (req) => {
    if (!hasAnyRole(req.user)) return json({ message: "Unauthorized" }, 401);
    if (!isTenantEditorOrAbove(req.user)) {
      return json({ message: "Forbidden" }, 403);
    }
    const id = req.routeParams?.id;
    if (typeof id !== "string" || !/^\d+$/.test(id)) {
      return json({ message: "The document isn't valid." }, 400);
    }
    try {
      return json({
        ok: true,
        impact: await publishImpact(req, collection, id),
      });
    } catch (error) {
      if (error instanceof Error && error.message === "forbidden") {
        return json({ message: "Forbidden" }, 403);
      }
      const status = errorStatus(error);
      if (status === 403 || status === 404) {
        return json({ message: "Forbidden" }, 403);
      }
      req.payload.logger.error({
        err: error,
        msg: "Couldn't work out the publish impact",
      });
      return json({ message: "The impact couldn't be worked out." }, 500);
    }
  };
}

export function publishImpactEndpoint(collection: string) {
  return {
    path: "/:id/publish-impact",
    method: "get" as const,
    handler: publishImpactHandler(collection),
  };
}
