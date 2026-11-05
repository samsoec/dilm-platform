import type { PayloadHandler } from "payload";

import { hasAnyRole, hasTenantAccess, isTenantEditorOrAbove } from "./access";
import { bodyOf, json, MAX_SLUG, parentProblem } from "./pageDialog";
import { scopedReq, refId } from "./pageRules";
import { previewPathChange, type PathChange } from "./pathCascade";
import { localeCodes } from "./pathCompute";

export const MAX_IMPACT_LINKS = 25;

type Json = Record<string, unknown>;

type Parsed =
  | { ok: true; change: PathChange; parent: string | null | undefined }
  | { ok: false; response: Response };

function bad(message: string, status = 400): Parsed {
  return { ok: false, response: json({ message }, status) };
}

function parse(body: Json): Parsed {
  const change: PathChange = {};
  let parent: string | null | undefined;
  if (body.slugs !== undefined) {
    if (
      !body.slugs ||
      typeof body.slugs !== "object" ||
      Array.isArray(body.slugs)
    ) {
      return bad("The slugs aren't valid.");
    }
    const known = new Set(localeCodes());
    const slugs: Record<string, string> = {};
    for (const [locale, value] of Object.entries(body.slugs as Json)) {
      if (!known.has(locale)) return bad("The slugs aren't valid.");
      if (typeof value !== "string") return bad("The slugs aren't valid.");
      if (value.length > MAX_SLUG) {
        return bad(`A slug can have up to ${MAX_SLUG} characters.`, 422);
      }
      slugs[locale] = value.trim();
    }
    change.slugs = slugs;
  }
  if (body.parent !== undefined) {
    if (body.parent === null || body.parent === "") {
      parent = null;
    } else if (
      (typeof body.parent === "string" || typeof body.parent === "number") &&
      /^\d+$/.test(String(body.parent))
    ) {
      parent = String(body.parent);
    } else {
      return bad("The parent page isn't valid.");
    }
    change.parent = parent === null ? null : Number(parent);
  }
  return { ok: true, change, parent };
}

export const pathImpactHandler: PayloadHandler = async (req) => {
  if (!hasAnyRole(req.user)) return json({ message: "Unauthorized" }, 401);
  if (!isTenantEditorOrAbove(req.user)) {
    return json({ message: "Forbidden" }, 403);
  }
  const id = req.routeParams?.id;
  if (typeof id !== "string" || !/^\d+$/.test(id)) {
    return json({ message: "The page isn't valid." }, 400);
  }
  const body = await bodyOf(req);
  if (!body) return json({ message: "Send a JSON body." }, 400);
  const parsed = parse(body);
  if (!parsed.ok) return parsed.response;

  let page: { tenant?: unknown };
  try {
    page = (await req.payload.findByID({
      collection: "pages",
      id,
      depth: 0,
      draft: false,
      trash: true,
      overrideAccess: false,
      user: req.user,
      req: scopedReq(req),
    })) as { tenant?: unknown };
  } catch {
    return json({ message: "The page wasn't found." }, 404);
  }
  const tenant = refId(page.tenant as never);
  if (!tenant || !hasTenantAccess(req.user, tenant)) {
    return json({ message: "Forbidden" }, 403);
  }
  if (parsed.parent) {
    const problem = await parentProblem(req, tenant, parsed.parent);
    if (problem) return json({ message: problem }, 422);
  }

  try {
    const impact = await previewPathChange(
      req.payload,
      { collection: "pages", id },
      parsed.change,
      req,
    );
    const links = impact.links.filter(
      (link) => link.tenant === null || link.tenant === tenant,
    );
    return json({
      ok: true,
      published: impact.published,
      urls: impact.urls,
      childPages: impact.childPages,
      records: impact.records,
      redirects: impact.redirects,
      overLimit: impact.overLimit,
      ...(impact.message ? { message: impact.message } : {}),
      linkCount: links.length,
      links: links.slice(0, MAX_IMPACT_LINKS).map((link) => ({
        collection: link.collection,
        id: link.id,
        paths: link.paths,
      })),
    });
  } catch (error) {
    req.payload.logger.error({
      err: error,
      msg: "Couldn't preview a URL change",
    });
    return json({ message: "The impact couldn't be worked out." }, 500);
  }
};
