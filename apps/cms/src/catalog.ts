import {
  APIError,
  type CollectionBeforeDeleteHook,
  type CollectionBeforeValidateHook,
  type FilterOptions,
  type Payload,
  type PayloadRequest,
  type RelationshipFieldSingleValidation,
  type UploadField,
} from "payload";
import { relationship } from "payload/shared";

import { localization } from "./localization";
import { refId, scopedReq } from "./pageRules";

type Ref = Parameters<typeof refId>[0];

type Request = Partial<PayloadRequest> | undefined;

export const publishedProducts: FilterOptions = {
  _status: { equals: "published" },
};

export const FEATURED_NOT_SUPPORTING =
  "The featured product has to be one of the supporting products. Add it there first, or clear the featured product.";

export const validateFeaturedProduct: RelationshipFieldSingleValidation =
  async (value, args) => {
    const base = await relationship(value, args);
    if (base !== true) return base;
    const featured = refId(value as Ref);
    if (!featured) return true;
    const supporting = (
      args.siblingData as { supportingProducts?: Ref | Ref[] } | undefined
    )?.supportingProducts;
    const ids = (Array.isArray(supporting) ? supporting : [supporting])
      .map((entry) => refId(entry))
      .filter(Boolean);
    return ids.includes(featured) ? true : FEATURED_NOT_SUPPORTING;
  };

export function sameCompanyDocuments(): UploadField["filterOptions"] {
  return ({ data }) => {
    const tenant = refId((data as { tenant?: Ref } | undefined)?.tenant);
    return tenant ? { tenant: { equals: tenant } } : true;
  };
}

type Variant = {
  name?: string | null;
  pdsFile?: Ref;
  sdsFile?: Ref;
};

type LinkingProduct = {
  id: number | string;
  name?: string | null;
  pdsFile?: Ref;
  variants?: Variant[] | null;
};

export type DocumentUse = { product: string; places: string[] };

export function documentUses(
  products: LinkingProduct[],
  documentId: number | string,
): DocumentUse[] {
  const wanted = String(documentId);
  return products.flatMap((product) => {
    const places = (product.variants ?? [])
      .filter(
        (variant) =>
          refId(variant.pdsFile) === wanted ||
          refId(variant.sdsFile) === wanted,
      )
      .map((variant) => variant.name || "unnamed variant");
    if (refId(product.pdsFile) === wanted) places.push("product PDS");
    return places.length > 0
      ? [{ product: product.name || "Untitled product", places }]
      : [];
  });
}

export function documentInUseMessage(
  verb: "trash" | "delete",
  title: string,
  uses: DocumentUse[],
): string {
  const listed = uses
    .map((use) => `${use.product} (${use.places.join(", ")})`)
    .join("; ");
  return `Can't ${verb} "${title}". Published products link it: ${listed}. Unlink it or replace the file instead.`;
}

export async function publishedProductsLinking(
  payload: Payload,
  req: Request,
  documentId: number | string,
): Promise<DocumentUse[]> {
  const { docs } = await payload.find({
    collection: "products",
    where: {
      and: [
        { _status: { equals: "published" } },
        {
          or: [
            { pdsFile: { equals: documentId } },
            { "variants.pdsFile": { equals: documentId } },
            { "variants.sdsFile": { equals: documentId } },
          ],
        },
      ],
    },
    locale: localization.defaultLocale,
    fallbackLocale: false,
    depth: 0,
    limit: 0,
    pagination: false,
    overrideAccess: true,
    req: scopedReq(req),
  });
  return documentUses(docs as unknown as LinkingProduct[], documentId);
}

async function reject(
  verb: "trash" | "delete",
  payload: Payload,
  req: Request,
  id: number | string,
  title: string | null | undefined,
): Promise<void> {
  const uses = await publishedProductsLinking(payload, req, id);
  if (uses.length > 0) {
    throw new APIError(
      documentInUseMessage(verb, title || "this document", uses),
      400,
      undefined,
      true,
    );
  }
}

// TODO(DILM-104): include published posts that attach the document in the body.
export const keepLinkedDocuments: CollectionBeforeValidateHook = async ({
  data,
  originalDoc,
  req,
}) => {
  const trashing = Boolean(data?.deletedAt) && !originalDoc?.deletedAt;
  if (trashing && originalDoc?.id !== undefined) {
    await reject(
      "trash",
      req.payload,
      req,
      originalDoc.id,
      originalDoc.title as string | undefined,
    );
  }
  return data;
};

export const keepLinkedDocumentsOnDelete: CollectionBeforeDeleteHook = async ({
  id,
  req,
}) => {
  const doc = (await req.payload.findByID({
    collection: "documents",
    id,
    depth: 0,
    trash: true,
    overrideAccess: true,
    req: scopedReq(req),
  })) as { title?: string | null };
  await reject("delete", req.payload, req, id, doc.title);
};
