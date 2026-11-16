import type { PayloadHandler } from "payload";

import { hasAnyRole, hasTenantAccess } from "./access";
import type {
  RoutingImpact,
  RoutingPage,
  RoutingSetting,
} from "./admin/components/routing/routing";
import { localization } from "./localization";
import { json } from "./pageDialog";
import { asId } from "./routeIndex";
import { refId, scopedReq } from "./pageRules";
import { localeCodes } from "./paths";
import {
  baseState,
  BASE_SETTINGS,
  loadBasePage,
  previewBaseChange,
  type BasePage,
} from "./siteRouting";

const SETTINGS: RoutingSetting[] = [
  "productsPage",
  "solutionsPage",
  "careerPage",
  "publicationPage",
];

function pageOf(page: BasePage | undefined): RoutingPage | null {
  if (!page) return null;
  const fallback = page.paths[localization.defaultLocale] ?? "";
  return {
    title: page.title,
    paths: Object.fromEntries(
      localeCodes().map((locale) => [locale, page.paths[locale] || fallback]),
    ),
  };
}

export const routingImpactHandler: PayloadHandler = async (req) => {
  if (!hasAnyRole(req.user)) return json({ message: "Unauthorized" }, 401);
  const query = req.searchParams;
  const setting = query.get("setting") as RoutingSetting | null;
  if (!setting || !SETTINGS.includes(setting)) {
    return json({ message: "Pass the setting to check." }, 400);
  }
  const payload = req.payload;
  const career = setting === "careerPage" || setting === "publicationPage";
  const next = query.get("page");
  if (next && !/^\d+$/.test(next)) {
    return json({ message: "The page isn't valid." }, 400);
  }

  let tenant = query.get("tenant") ?? undefined;
  const settingsDoc = query.get("doc");
  if (career && !tenant && settingsDoc && /^\d+$/.test(settingsDoc)) {
    try {
      const doc = (await payload.findByID({
        collection: "tenant-settings",
        id: settingsDoc,
        depth: 0,
        overrideAccess: false,
        user: req.user,
        req: scopedReq(req),
      })) as { tenant?: unknown };
      tenant = refId(doc.tenant as never);
    } catch {
      return json({ message: "Forbidden" }, 403);
    }
  }
  if (career) {
    if (!tenant || !/^\d+$/.test(tenant)) {
      return json({ message: "Pass the company as tenant." }, 400);
    }
    if (!hasTenantAccess(req.user, tenant)) {
      return json({ message: "Forbidden" }, 403);
    }
  }

  const { docs: tenants } = await payload.find({
    collection: "tenants",
    where: career ? { id: { equals: asId(tenant!) } } : {},
    depth: 0,
    limit: 0,
    pagination: false,
    overrideAccess: false,
    user: req.user,
    req: scopedReq(req),
  });
  const domains = (tenants as { domain?: string | null }[])
    .map(({ domain }) => domain)
    .filter((domain): domain is string => Boolean(domain));

  const nextPage = next
    ? await loadBasePage(payload, req, career ? "pages" : "shared-pages", next)
    : undefined;
  if (nextPage && career && nextPage.tenant !== tenant) {
    return json({ message: "That page belongs to another company." }, 422);
  }

  if (setting === "publicationPage") {
    const body: RoutingImpact = {
      setting,
      domains,
      locales: localeCodes(),
      current: null,
      next: pageOf(nextPage),
      total: 0,
      records: 0,
      redirects: 0,
      overLimit: false,
    };
    return json(body);
  }

  const collection = BASE_SETTINGS[setting].collection;
  const current = await baseState(payload, req, setting, tenant);
  const { totalDocs } = await payload.count({
    collection,
    ...(career ? { where: { tenant: { equals: asId(tenant!) } } } : {}),
    overrideAccess: false,
    user: req.user,
    req: scopedReq(req),
  });
  const impact = await previewBaseChange(
    payload,
    { setting, page: next ?? null, tenant },
    req,
  );
  const body: RoutingImpact = {
    setting,
    domains,
    locales: localeCodes(),
    current: current.state === "unset" ? null : pageOf(current.page),
    next: pageOf(nextPage),
    total: totalDocs,
    ...impact,
  };
  return json(body);
};
