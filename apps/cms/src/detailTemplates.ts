import {
  APIError,
  type CollectionBeforeValidateHook,
  type Payload,
  type PayloadRequest,
  type Where,
} from "payload";
import {
  DETAIL_TYPE_LABELS,
  type DetailRecordType,
  SHARED_TEMPLATE_RECORD_TYPES,
  TENANT_TEMPLATE_RECORD_TYPES,
  tokenProblem,
} from "@dilm/shared-types";

import { refId, scopedReq } from "./pageRules";

export { isBlockInContext, renderTokens } from "@dilm/shared-types";

type Request = Partial<PayloadRequest> | undefined;

export type TemplateCollection = "shared-detail-templates" | "detail-templates";

export const RECORD_TYPE_LABELS = DETAIL_TYPE_LABELS;

export function recordTypeOptions(types: readonly DetailRecordType[]) {
  return types.map((value) => ({ value, label: RECORD_TYPE_LABELS[value] }));
}

export const sharedRecordTypeOptions = recordTypeOptions(
  SHARED_TEMPLATE_RECORD_TYPES,
);

export const tenantRecordTypeOptions = recordTypeOptions(
  TENANT_TEMPLATE_RECORD_TYPES,
);

export const UNKNOWN_TYPE_MESSAGE =
  "This kind of template isn't offered here. Pick one from the list.";

function reject(message: string): never {
  throw new APIError(message, 400, undefined, true);
}

export const allowTemplateTokens: CollectionBeforeValidateHook = async ({
  data,
}) => {
  const problem = data && tokenProblem(data.layout, true);
  if (problem) reject(problem);
  return data;
};

export const rejectTokensOutsideTemplates: CollectionBeforeValidateHook =
  async ({ data }) => {
    const problem = data && tokenProblem(data.layout, false);
    if (problem) reject(problem);
    return data;
  };

export function templateExistsMessage(
  recordType: string,
  scope: "shared" | "company",
): string {
  const label =
    RECORD_TYPE_LABELS[recordType as DetailRecordType] ?? recordType;
  return scope === "shared"
    ? `The ${label.toLowerCase()} template already exists. Edit it instead of adding a second one.`
    : `This company already has a ${label.toLowerCase()} template. Edit it instead of adding a second one.`;
}

export const keepOneTemplatePerType: CollectionBeforeValidateHook = async ({
  collection,
  data,
  originalDoc,
  req,
}) => {
  if (!data) return data;
  const original = originalDoc as
    { id?: number | string; recordType?: string; tenant?: unknown } | undefined;
  const recordType =
    "recordType" in data ? data.recordType : original?.recordType;
  const shared = collection.slug === "shared-detail-templates";
  const allowed: readonly string[] = shared
    ? SHARED_TEMPLATE_RECORD_TYPES
    : TENANT_TEMPLATE_RECORD_TYPES;
  if (!recordType) return data;
  if (!allowed.includes(recordType as string)) reject(UNKNOWN_TYPE_MESSAGE);
  const tenant = refId(
    ("tenant" in data ? data.tenant : original?.tenant) as Parameters<
      typeof refId
    >[0],
  );
  if (!shared && !tenant) return data;
  const clauses: Where[] = [{ recordType: { equals: recordType } }];
  if (!shared) clauses.push({ tenant: { equals: tenant } });
  const own = refId(original?.id);
  if (own) clauses.push({ id: { not_equals: own } });
  const { totalDocs } = await req.payload.count({
    collection: collection.slug as TemplateCollection,
    where: { and: clauses },
    overrideAccess: true,
    req: scopedReq(req),
  });
  if (totalDocs > 0) {
    reject(
      templateExistsMessage(
        recordType as string,
        shared ? "shared" : "company",
      ),
    );
  }
  return data;
};

export type GovernedTemplate = {
  recordType: DetailRecordType;
  tenant?: Parameters<typeof refId>[0];
};

export async function countGovernedRecords(
  payload: Payload,
  template: GovernedTemplate,
  req?: Request,
): Promise<number> {
  const tenant = refId(template.tenant);
  const published: Where = { _status: { equals: "published" } };
  const base = {
    overrideAccess: true,
    req: scopedReq(req),
  } as const;
  switch (template.recordType) {
    case "product":
      return (
        await payload.count({
          collection: "products",
          where: published,
          ...base,
        })
      ).totalDocs;
    case "solution":
      return (
        await payload.count({
          collection: "solutions",
          where: published,
          ...base,
        })
      ).totalDocs;
    case "category":
      return (await payload.count({ collection: "categories", ...base }))
        .totalDocs;
    case "job":
    case "post": {
      if (!tenant) return 0;
      return (
        await payload.count({
          collection: template.recordType === "job" ? "jobs" : "posts",
          where: { and: [published, { tenant: { equals: tenant } }] },
          ...base,
        })
      ).totalDocs;
    }
  }
}
