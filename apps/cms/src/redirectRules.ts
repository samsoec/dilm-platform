import {
  ValidationError,
  type CollectionBeforeChangeHook,
  type CollectionBeforeValidateHook,
  type CollectionSlug,
  type PayloadRequest,
  type Where,
} from "payload";

import { idOf, type LinkData } from "./fields/link";
import { refId, scopedReq } from "./pageRules";
import { asId, storedRoutes } from "./routeIndex";
import { isInternalPath } from "./validation";

export const CHAIN_LIMIT = 20;

export const SELF_LOOP_MESSAGE =
  "The old address and the new address are the same, so visitors would go round in circles.";

export const CHAIN_LOOP_MESSAGE =
  "That would send visitors round in circles: another redirect leads back to this old address.";

export function duplicateMessage(from: string): string {
  return `A redirect from ${from} already exists. Edit it instead.`;
}

export function normalizeFrom(value: string): string {
  const text = value.trim();
  return text.length > 1 ? text.replace(/\/+$/, "") || "/" : text;
}

export function fromProblem(from: string): string | undefined {
  if (!from) return "Enter the old address.";
  const verdict = isInternalPath(from, {} as never);
  return verdict === true ? undefined : String(verdict);
}

export type RedirectFacts = {
  id?: string;
  from: string;
  locale: string;
  tenant: string | null;
  targetPath: string | undefined;
};

export type KnownRedirect = {
  id: string;
  from: string;
  tenant: string | null;
  targetPath: string | undefined;
};

export type RedirectProblem = { path: "from" | "to"; message: string };

function overlaps(a: string | null, b: string | null): boolean {
  return a === null || b === null || a === b;
}

export function redirectProblem(
  facts: RedirectFacts,
  known: readonly KnownRedirect[],
): RedirectProblem | undefined {
  const format = fromProblem(facts.from);
  if (format) return { path: "from", message: format };
  const others = known.filter(
    (row) => row.id !== facts.id && overlaps(row.tenant, facts.tenant),
  );
  if (others.some((row) => row.from === facts.from)) {
    return { path: "from", message: duplicateMessage(facts.from) };
  }
  if (facts.targetPath === facts.from) {
    return { path: "to", message: SELF_LOOP_MESSAGE };
  }
  const seen = new Set<string>();
  let current = facts.targetPath;
  for (let hop = 0; current && hop < CHAIN_LIMIT; hop += 1) {
    if (seen.has(current)) break;
    seen.add(current);
    const next = others.find((row) => row.from === current);
    if (!next?.targetPath) break;
    if (next.targetPath === facts.from) {
      return { path: "to", message: CHAIN_LOOP_MESSAGE };
    }
    current = next.targetPath;
  }
  return undefined;
}

type Request = Partial<PayloadRequest> | undefined;

export async function routePathOf(
  req: Request,
  link: LinkData | null | undefined,
  locale: string,
): Promise<string | undefined> {
  if (!link) return undefined;
  if (link.type === "reference") {
    const relationTo = link.reference?.relationTo;
    const id = idOf(link.reference?.value);
    if (!relationTo || !id || !req?.payload) return undefined;
    const rows = await storedRoutes(req.payload, req, {
      and: [
        { doc: { equals: { relationTo, value: asId(id) } } },
        { locale: { equals: locale } },
      ],
    });
    return rows[0]?.path;
  }
  if (link.type === "external") return undefined;
  return link.internalPath || undefined;
}

type StoredRedirect = {
  id: number | string;
  from: string;
  tenant?: number | string | { id: number | string } | null;
  to?: LinkData | null;
};

function tenantWhere(tenant: string | null): Where {
  if (tenant === null) return { id: { exists: true } };
  return {
    or: [{ tenant: { equals: asId(tenant) } }, { tenant: { exists: false } }],
  };
}

export async function knownRedirects(
  req: PayloadRequest,
  locale: string,
  tenant: string | null,
): Promise<KnownRedirect[]> {
  const { docs } = await req.payload.find({
    collection: "redirects" as CollectionSlug,
    where: { and: [{ locale: { equals: locale } }, tenantWhere(tenant)] },
    depth: 0,
    limit: 0,
    pagination: false,
    overrideAccess: true,
    req: scopedReq(req),
  });
  return Promise.all(
    (docs as unknown as StoredRedirect[]).map(async (row) => ({
      id: String(row.id),
      from: row.from,
      tenant: refId(row.tenant) ?? null,
      targetPath: await routePathOf(req, row.to, locale),
    })),
  );
}

type Draft = {
  from?: string | null;
  to?: LinkData | null;
  locale?: string | null;
  tenant?: number | string | { id: number | string } | null;
  origin?: string | null;
};

export const checkManualRedirect: CollectionBeforeValidateHook = async ({
  data,
  originalDoc,
  req,
}) => {
  if (!data) return data;
  const merged = { ...(originalDoc as Draft | undefined), ...data } as Draft;
  if ((merged.origin ?? "manual") !== "manual") return data;
  const from = normalizeFrom(String(merged.from ?? ""));
  const locale = merged.locale ?? "en";
  const tenant = refId(merged.tenant) ?? null;
  const id = (originalDoc as { id?: number | string } | undefined)?.id;
  const problem = redirectProblem(
    {
      id: id === undefined ? undefined : String(id),
      from,
      locale,
      tenant,
      targetPath: await routePathOf(req, merged.to, locale),
    },
    await knownRedirects(req, locale, tenant),
  );
  if (problem) {
    throw new ValidationError({
      errors: [{ path: problem.path, message: problem.message }],
    });
  }
  return { ...data, from };
};

export const stampCreatedBy: CollectionBeforeChangeHook = ({
  data,
  operation,
  originalDoc,
  req,
}) => {
  const next = { ...data } as Record<string, unknown>;
  if (operation === "create") {
    next.createdBy = req.user?.id ?? null;
  } else {
    next.createdBy = (originalDoc as { createdBy?: unknown } | undefined)
      ?.createdBy;
  }
  return next;
};
