import type { PayloadHandler, PayloadRequest } from "payload";

import {
  dialogProblem,
  shapeProblems,
  type CheckBody,
  type CreateBody,
  type DialogProblem,
  type ParentOption,
} from "./admin/components/pages/newPage";
import { hasAnyRole, hasTenantAccess, isTenantEditorOrAbove } from "./access";
import { localization } from "./localization";
import { localeCodes } from "./pathCompute";
import { parentTenantProblem, scopedReq } from "./pageRules";
import { validatePageSlug, type PathProblem } from "./paths";

type Json = Record<string, unknown>;

export function json(body: Json, status = 200): Response {
  return Response.json(body, { status });
}

type Gate = { ok: true; tenant: string } | { ok: false; response: Response };

export function gate(req: PayloadRequest, tenant: unknown): Gate {
  if (!hasAnyRole(req.user)) {
    return { ok: false, response: json({ message: "Unauthorized" }, 401) };
  }
  if (typeof tenant !== "string" || !/^\d+$/.test(tenant)) {
    return {
      ok: false,
      response: json({ message: "Pass the company as tenant." }, 400),
    };
  }
  if (!isTenantEditorOrAbove(req.user) || !hasTenantAccess(req.user, tenant)) {
    return { ok: false, response: json({ message: "Forbidden" }, 403) };
  }
  return { ok: true, tenant };
}

export async function bodyOf(req: PayloadRequest): Promise<Json | undefined> {
  try {
    const body: unknown = await req.json?.();
    return body && typeof body === "object" ? (body as Json) : undefined;
  } catch {
    return undefined;
  }
}

export const MAX_TITLE = 200;
export const MAX_SLUG = 100;

function textOf(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function slugsOf(value: unknown): Record<string, string> {
  const given =
    value && typeof value === "object" ? (value as Json) : ({} as Json);
  return Object.fromEntries(
    localeCodes().map((locale) => [locale, textOf(given[locale]).trim()]),
  );
}

function parentOf(value: unknown): string | undefined {
  if (value === undefined || value === null || value === "") return undefined;
  return typeof value === "string" || typeof value === "number"
    ? String(value)
    : "";
}

type Parsed =
  { ok: true; value: CreateBody } | { ok: false; response: Response };

async function parse(req: PayloadRequest): Promise<Parsed> {
  const body = await bodyOf(req);
  if (!body) {
    return { ok: false, response: json({ message: "Send a JSON body." }, 400) };
  }
  const allowed = gate(req, body.tenant);
  if (!allowed.ok) return allowed;
  const title = textOf(body.title).trim();
  const slugs = slugsOf(body.slugs);
  if (title.length > MAX_TITLE) {
    return {
      ok: false,
      response: json(
        { message: `The title can have up to ${MAX_TITLE} characters.` },
        422,
      ),
    };
  }
  if (Object.values(slugs).some((slug) => slug.length > MAX_SLUG)) {
    return {
      ok: false,
      response: json(
        { message: `A slug can have up to ${MAX_SLUG} characters.` },
        422,
      ),
    };
  }
  const parent = parentOf(body.parent);
  if (parent !== undefined && !/^\d+$/.test(parent)) {
    return {
      ok: false,
      response: json({ message: "The parent page isn't valid." }, 400),
    };
  }
  return {
    ok: true,
    value: {
      tenant: allowed.tenant,
      parent,
      slugs,
      title,
    },
  };
}

export async function parentProblem(
  req: PayloadRequest,
  tenant: string,
  parent: string | undefined,
): Promise<string | undefined> {
  if (!parent) return undefined;
  try {
    const found = (await req.payload.findByID({
      collection: "pages",
      id: parent,
      depth: 0,
      overrideAccess: false,
      user: req.user,
      req: scopedReq(req),
    })) as { tenant?: unknown };
    return parentTenantProblem(found.tenant as never, tenant);
  } catch {
    return "The parent page can't be used. Pick another page.";
  }
}

export async function checkSlugs(
  req: PayloadRequest,
  input: CheckBody,
): Promise<{
  problems: DialogProblem[];
  paths: Record<string, string>;
}> {
  const hasParent = Boolean(input.parent);
  const shape = shapeProblems(input.slugs, hasParent);
  if (shape.length > 0) return { problems: shape, paths: {} };
  const { paths, problems } = await validatePageSlug(
    req.payload,
    {
      collection: "pages",
      tenant: input.tenant,
      parent: input.parent,
      slugs: input.slugs,
    },
    req,
  );
  return {
    paths,
    problems: problems.map((problem: PathProblem) => dialogProblem(problem)),
  };
}

export const checkSlugHandler: PayloadHandler = async (req) => {
  const parsed = await parse(req);
  if (!parsed.ok) return parsed.response;
  const { tenant, parent, slugs } = parsed.value;
  const bad = await parentProblem(req, tenant, parent);
  if (bad) return json({ message: bad }, 422);
  const result = await checkSlugs(req, { tenant, parent, slugs });
  return json({ ok: result.problems.length === 0, ...result });
};

export const createDraftHandler: PayloadHandler = async (req) => {
  const parsed = await parse(req);
  if (!parsed.ok) return parsed.response;
  const { tenant, parent, slugs, title } = parsed.value;
  if (!title) return json({ message: "Add the page's title." }, 422);
  const bad = await parentProblem(req, tenant, parent);
  if (bad) return json({ message: bad }, 422);
  const checked = await checkSlugs(req, { tenant, parent, slugs });
  if (checked.problems.length > 0) {
    return json({ ok: false, problems: checked.problems }, 422);
  }
  const written = (locale: "en" | "id") => ({
    collection: "pages" as const,
    locale,
    draft: true,
    depth: 0,
    overrideAccess: false,
    user: req.user,
    req: scopedReq(req),
  });
  let id: number | string;
  try {
    const created = await req.payload.create({
      ...written("en"),
      data: {
        tenant: Number(tenant),
        _status: "draft",
        title,
        slug: slugs.en,
        ...(parent ? { parent: Number(parent) } : {}),
      } as never,
    });
    id = created.id;
  } catch (error) {
    req.payload.logger.error({
      err: error,
      msg: "Couldn't create a draft page",
    });
    return json({ ok: false, message: errorMessage(error) }, 422);
  }
  if (!slugs.id) return json({ ok: true, id }, 201);
  try {
    await req.payload.update({
      ...written("id"),
      id,
      data: { slug: slugs.id } as never,
    });
    return json({ ok: true, id }, 201);
  } catch (error) {
    req.payload.logger.error({
      err: error,
      msg: "Couldn't save the Indonesian slug of a new draft page",
    });
    return json({ ok: true, id, indonesianSlug: errorMessage(error) }, 201);
  }
};

function errorMessage(error: unknown): string {
  const first = (
    error as { data?: { errors?: { message?: string }[] } } | undefined
  )?.data?.errors?.[0]?.message;
  if (first) return first;
  return error instanceof Error && error.message
    ? error.message
    : "The page couldn't be created.";
}

function titleOf(title: unknown): string {
  if (typeof title === "string") return title;
  if (!title || typeof title !== "object") return "";
  const byLocale = title as Record<string, unknown>;
  const own = textOf(byLocale[localization.defaultLocale]);
  return (
    own ||
    (Object.values(byLocale).find(
      (value) => typeof value === "string" && value,
    ) as string | undefined) ||
    ""
  );
}

export function toOption(
  doc: {
    id: number | string;
    title?: unknown;
    path?: Record<string, string | null> | string | null;
  },
  collection: ParentOption["collection"],
): ParentOption {
  const paths =
    typeof doc.path === "string"
      ? { [localization.defaultLocale]: doc.path }
      : Object.fromEntries(
          Object.entries(doc.path ?? {}).filter(
            (entry): entry is [string, string] => typeof entry[1] === "string",
          ),
        );
  return {
    id: String(doc.id),
    collection,
    title: titleOf(doc.title) || "Untitled",
    paths,
    shared: collection === "shared-pages",
  };
}

export const parentOptionsHandler: PayloadHandler = async (req) => {
  const query = (req.query ?? {}) as Record<string, unknown>;
  const allowed = gate(req, query.tenant);
  if (!allowed.ok) return allowed.response;
  const read = async (collection: ParentOption["collection"]) => {
    const { docs } = await req.payload.find({
      collection,
      ...(collection === "pages"
        ? { where: { tenant: { equals: allowed.tenant } } }
        : {}),
      locale: "all",
      fallbackLocale: false,
      depth: 0,
      limit: 0,
      pagination: false,
      select: { title: true, path: true } as never,
      overrideAccess: false,
      user: req.user,
      req: scopedReq(req),
    });
    return (docs as unknown as Parameters<typeof toOption>[0][]).map((doc) =>
      toOption(doc, collection),
    );
  };
  const [pages, shared] = await Promise.all([
    read("pages"),
    read("shared-pages"),
  ]);
  return json({ options: [...pages, ...shared] });
};
