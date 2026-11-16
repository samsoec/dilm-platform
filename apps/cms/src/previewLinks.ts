import type { CollectionSlug, PayloadHandler, PayloadRequest } from "payload";

import { hasAnyRole } from "./access";
import { localization } from "./localization";
import { json } from "./pageDialog";
import { refId } from "./pageRules";
import {
  LISTING_STATES,
  PREVIEW_COLLECTIONS,
  TEMPLATE_COLLECTIONS,
  TEMPLATE_RECORD_COLLECTION,
  buildPreviewUrl,
  listingQuery,
  type ListingState,
  type PreviewCollection,
} from "./previewUrl";

const RECORD_CHOICES = 25;

type Doc = Record<string, unknown>;

export type PreviewSite = {
  id: number | string;
  name: string;
  domain: string;
  url: string | null;
};

export type PreviewRecordChoice = { id: number | string; title: string };

function titleOf(doc: Doc): string {
  return String(doc.title ?? doc.name ?? doc.id);
}

function hasPostListing(doc: Doc): boolean {
  return JSON.stringify(doc.layout ?? null).includes(
    '"blockType":"postListing"',
  );
}

export const previewLinksHandler: PayloadHandler = async (req) => {
  if (!hasAnyRole(req.user)) return json({ message: "Unauthorized" }, 401);
  const url = new URL(req.url ?? "http://localhost");
  const collection = url.searchParams.get("collection") as PreviewCollection;
  const id = url.searchParams.get("id") ?? "";
  const locale = (url.searchParams.get("locale") ??
    localization.defaultLocale) as "en" | "id";
  const state = (url.searchParams.get("state") ?? "initial") as ListingState;
  if (
    !PREVIEW_COLLECTIONS.includes(collection) ||
    !/^\d+$/.test(id) ||
    !(localization.locales as readonly string[]).includes(locale) ||
    !LISTING_STATES.includes(state)
  ) {
    return json({ message: "The preview request isn't valid." }, 400);
  }
  const { payload, user } = req;
  try {
    const doc = (await payload.findByID({
      collection: collection as CollectionSlug,
      id,
      locale,
      draft: true,
      depth: 0,
      overrideAccess: false,
      user,
    })) as unknown as Doc;

    const owner = refId(doc.tenant as never);
    const tenants = await payload.find({
      collection: "tenants",
      depth: 0,
      limit: 10,
      pagination: false,
      overrideAccess: false,
      user,
      ...(owner ? { where: { id: { equals: owner } } } : {}),
    });

    const isTemplate = (TEMPLATE_COLLECTIONS as readonly string[]).includes(
      collection,
    );
    let records: PreviewRecordChoice[] = [];
    let record: Doc | null = null;
    if (isTemplate) {
      const recordCollection =
        TEMPLATE_RECORD_COLLECTION[String(doc.recordType)];
      const found = recordCollection
        ? await payload.find({
            collection: recordCollection as CollectionSlug,
            locale,
            draft: true,
            depth: 0,
            limit: RECORD_CHOICES,
            sort: "-updatedAt",
            overrideAccess: false,
            user,
            ...(owner && recordCollection !== "categories"
              ? { where: { tenant: { equals: owner } } }
              : {}),
          })
        : { docs: [] };
      const docs = found.docs as unknown as Doc[];
      records = docs.map((entry) => ({
        id: entry.id as number | string,
        title: titleOf(entry),
      }));
      const wanted = url.searchParams.get("record");
      record =
        docs.find((entry) => String(entry.id) === wanted) ?? docs[0] ?? null;
    }

    const sites: PreviewSite[] = (tenants.docs as unknown as Doc[]).map(
      (tenant) => {
        const domain = String(tenant.domain ?? "");
        let built: string | null;
        try {
          built = buildPreviewUrl({
            doc,
            collection,
            tenant: { domain },
            locale,
            record,
            q: listingQuery(state),
          });
        } catch {
          built = null;
        }
        return {
          id: tenant.id as number | string,
          name: String(tenant.name ?? domain),
          domain,
          url: built,
        };
      },
    );

    return json({
      ok: true,
      sites,
      records,
      record: record ? record.id : null,
      listing:
        collection === "pages" || collection === "shared-pages"
          ? hasPostListing(doc)
          : false,
    });
  } catch (error) {
    const status = (error as { status?: number }).status;
    if (status === 403 || status === 404) {
      return json({ message: "Forbidden" }, status);
    }
    req.payload.logger.error({ err: error, msg: "Couldn't build the preview" });
    return json({ message: "The preview couldn't be built." }, 500);
  }
};

export function withAdminPreview<
  C extends { slug: string; admin?: Record<string, unknown> },
>(collection: C): C {
  if (!(PREVIEW_COLLECTIONS as readonly string[]).includes(collection.slug)) {
    return collection;
  }
  const preview = async (
    doc: Doc,
    { locale, req }: { locale: string; req: PayloadRequest },
  ) => {
    const owner = refId(doc.tenant as never);
    const tenants = await req.payload.find({
      collection: "tenants",
      depth: 0,
      limit: 1,
      sort: "id",
      overrideAccess: false,
      user: req.user,
      ...(owner ? { where: { id: { equals: owner } } } : {}),
    });
    const tenant = tenants.docs[0] as unknown as Doc | undefined;
    return (
      buildPreviewUrl({
        doc,
        collection: collection.slug as PreviewCollection,
        tenant: { domain: String(tenant?.domain ?? "") },
        locale,
      }) ?? ""
    );
  };
  return { ...collection, admin: { ...collection.admin, preview } };
}
