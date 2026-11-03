import {
  APIError,
  type CollectionAfterChangeHook,
  type CollectionBeforeChangeHook,
  type CollectionBeforeDeleteHook,
  type CollectionBeforeValidateHook,
  type CollectionSlug,
  type FilterOptions,
  type GlobalAfterChangeHook,
  type GlobalBeforeChangeHook,
  type Payload,
  type PayloadRequest,
  type Where,
} from "payload";

import { localization } from "./localization";
import { refId, scopedReq } from "./pageRules";
import {
  CASCADE_LIMIT,
  cascadeLimitMessage,
  recordMoveSources,
  writeAutoRedirect,
  type PathMove,
  type RecordMove,
  type RecordMoveSource,
} from "./pathCascade";
import {
  computePath,
  localeCodes,
  slugForLocale,
  type PageCollection,
} from "./paths";
import {
  jobBaseSources,
  recordBaseSources,
  type BasePaths,
} from "./recordBases";
import { asId, syncRouteIndex } from "./routeIndex";

type Request = Partial<PayloadRequest> | undefined;

type LocaleMap = Record<string, string | null | undefined>;

type Ref = Parameters<typeof refId>[0];

export const BASE_SETTINGS = {
  productsPage: {
    collection: "products",
    label: "Our Products",
    where: "Site routing",
    singular: "product",
    plural: "products",
  },
  solutionsPage: {
    collection: "solutions",
    label: "Our Solutions",
    where: "Site routing",
    singular: "solution",
    plural: "solutions",
  },
  careerPage: {
    collection: "jobs",
    label: "Career",
    where: "Company settings",
    singular: "job",
    plural: "jobs",
  },
} as const;

export type BaseSetting = keyof typeof BASE_SETTINGS;

export type GovernedCollection =
  (typeof BASE_SETTINGS)[BaseSetting]["collection"];

export const SITE_ROUTING_SETTINGS = ["productsPage", "solutionsPage"] as const;

const PUBLICATION = {
  where: "Company settings",
  field: "Publication page",
  usedBy: 'the navbar search, the "All Updates" tab and',
  singular: "post breadcrumb",
  plural: "post breadcrumbs",
} as const;

type SpecialSetting = BaseSetting | "publicationPage";

export const publishedSharedPages: FilterOptions = {
  _status: { equals: "published" },
};

export const publishedPagesOfCompany: FilterOptions = ({ data }) => {
  const tenant = refId((data as { tenant?: Ref } | undefined)?.tenant);
  const conditions: Where[] = [{ _status: { equals: "published" } }];
  if (tenant) conditions.push({ tenant: { equals: tenant } });
  return { and: conditions };
};

function fail(message: string): never {
  throw new APIError(message, 400, undefined, true);
}

function pluralize(count: number, one: string, many: string): string {
  return `${count} ${count === 1 ? one : many}`;
}

export function baseUnsetMessage(setting: BaseSetting): string {
  const base = BASE_SETTINGS[setting];
  return setting === "careerPage"
    ? `No "${base.label}" page is set in ${base.where}, so jobs have no URL. Set it there first.`
    : `No "${base.label}" page is set in ${base.where}, so ${base.plural} have no URL. Ask a Super Admin to set it.`;
}

export function baseUnpublishedMessage(
  setting: BaseSetting,
  title: string,
): string {
  const base = BASE_SETTINGS[setting];
  return `The page "${title}" is set as "${base.label}" in ${base.where} but isn't published, so ${base.plural} have no URL. Publish it first.`;
}

export function pageNotPublishedMessage(title: string): string {
  return `"${title}" isn't published. Pick a published page.`;
}

export const OTHER_COMPANY_PAGE =
  "That page belongs to another company. Pick a page of the same company.";

export function clearBaseMessage(setting: BaseSetting, count: number): string {
  const base = BASE_SETTINGS[setting];
  return `Can't clear "${base.label}". ${pluralize(count, `published ${base.singular} lives`, `published ${base.plural} live`)} under its URL and would stop working. Pick another page instead.`;
}

function asMap(value: LocaleMap | string | null | undefined): LocaleMap {
  if (typeof value === "string") return { [localization.defaultLocale]: value };
  return value ?? {};
}

function titleOf(value: LocaleMap | string | null | undefined): string {
  const map = asMap(value);
  return (
    map[localization.defaultLocale] ||
    Object.values(map).find(Boolean) ||
    "Untitled"
  );
}

type BasePage = {
  id: string;
  title: string;
  live: boolean;
  paths: LocaleMap;
  parent: string | undefined;
  tenant: string | undefined;
};

type StoredPage = {
  id: number | string;
  title?: LocaleMap | string | null;
  path?: LocaleMap | string | null;
  parent?: Ref;
  tenant?: Ref;
  _status?: string | null;
  deletedAt?: string | null;
};

async function loadBasePage(
  payload: Payload,
  req: Request,
  collection: PageCollection,
  id: string,
): Promise<BasePage | undefined> {
  try {
    const page = (await payload.findByID({
      collection: collection as CollectionSlug,
      id,
      locale: "all",
      fallbackLocale: false,
      depth: 0,
      draft: false,
      trash: true,
      overrideAccess: true,
      req: scopedReq(req),
    })) as unknown as StoredPage;
    return {
      id: String(page.id),
      title: titleOf(page.title),
      live: page._status === "published" && !page.deletedAt,
      paths: asMap(page.path),
      parent: refId(page.parent),
      tenant: refId(page.tenant),
    };
  } catch {
    return undefined;
  }
}

type SiteRoutingDoc = { productsPage?: Ref; solutionsPage?: Ref };

type RoutingGroup = { careerPage?: Ref; publicationPage?: Ref };

async function readSiteRouting(
  payload: Payload,
  req: Request,
): Promise<SiteRoutingDoc> {
  return (await payload.findGlobal({
    slug: "site-routing",
    depth: 0,
    overrideAccess: true,
    req: scopedReq(req),
  })) as unknown as SiteRoutingDoc;
}

async function readRouting(
  payload: Payload,
  req: Request,
  tenant: string,
): Promise<RoutingGroup> {
  const { docs } = await payload.find({
    collection: "tenant-settings",
    where: { tenant: { equals: asId(tenant) } },
    depth: 0,
    limit: 1,
    pagination: false,
    overrideAccess: true,
    req: scopedReq(req),
  });
  return (
    (docs[0] as unknown as { routing?: RoutingGroup } | undefined)?.routing ??
    {}
  );
}

export type BaseState =
  { state: "unset" } | { state: "unpublished" | "live"; page: BasePage };

export async function baseState(
  payload: Payload,
  req: Request,
  setting: BaseSetting,
  tenant?: string,
): Promise<BaseState> {
  const career = setting === "careerPage";
  if (career && !tenant) return { state: "unset" };
  const id = career
    ? refId((await readRouting(payload, req, tenant!)).careerPage)
    : refId((await readSiteRouting(payload, req))[setting]);
  if (!id) return { state: "unset" };
  const page = await loadBasePage(
    payload,
    req,
    career ? "pages" : "shared-pages",
    id,
  );
  if (!page) return { state: "unset" };
  return { state: page.live ? "live" : "unpublished", page };
}

async function sourceFor(
  payload: Payload,
  req: Request,
  setting: BaseSetting,
  tenant?: string,
): Promise<BasePaths | undefined> {
  const state = await baseState(payload, req, setting, tenant);
  return state.state === "unset" ? undefined : state.page.paths;
}

export function registerSiteRouting(): void {
  recordBaseSources.products = ({ payload, req }) =>
    sourceFor(payload, req, "productsPage");
  recordBaseSources.solutions = ({ payload, req }) =>
    sourceFor(payload, req, "solutionsPage");
  jobBaseSources.career = ({ payload, req, tenant }) =>
    sourceFor(payload, req, "careerPage", tenant);
  if (!recordMoveSources.includes(baseRecordMoves)) {
    recordMoveSources.push(baseRecordMoves);
  }
}

type StoredRecord = {
  id: number | string;
  slug?: LocaleMap | string | null;
  path?: LocaleMap | string | null;
  tenant?: Ref;
  _status?: string | null;
  deletedAt?: string | null;
};

function pathsUnder(
  base: BasePaths | undefined,
  slugs: LocaleMap,
): Record<string, string> {
  const paths: Record<string, string> = {};
  for (const locale of localeCodes()) {
    const { slug } = slugForLocale(slugs, locale);
    paths[locale] =
      base && slug
        ? computePath(base[locale] || base[localization.defaultLocale], slug)
        : "";
  }
  return paths;
}

export async function baseMoves(
  payload: Payload,
  req: Request,
  collection: GovernedCollection,
  base: BasePaths | undefined,
  tenant?: string,
): Promise<RecordMove[]> {
  const where: Where | undefined = tenant
    ? { tenant: { equals: asId(tenant) } }
    : undefined;
  const { docs } = await payload.find({
    collection: collection as CollectionSlug,
    ...(where ? { where } : {}),
    locale: "all",
    fallbackLocale: false,
    draft: false,
    trash: true,
    depth: 0,
    limit: 0,
    pagination: false,
    overrideAccess: true,
    req: scopedReq(req),
  });
  const moves: RecordMove[] = [];
  for (const record of docs as unknown as StoredRecord[]) {
    const stored = asMap(record.path);
    const paths = pathsUnder(base, asMap(record.slug));
    if (
      !localeCodes().some((locale) => (stored[locale] || "") !== paths[locale])
    ) {
      continue;
    }
    const changes: PathMove[] = localeCodes().flatMap((locale) =>
      stored[locale] && paths[locale] && stored[locale] !== paths[locale]
        ? [{ locale, from: stored[locale]!, to: paths[locale] }]
        : [],
    );
    moves.push({
      collection,
      id: String(record.id),
      tenant: collection === "jobs" ? (refId(record.tenant) ?? null) : null,
      published: record._status === "published" && !record.deletedAt,
      moves: changes,
      apply: async (target, request) => {
        await target.db.updateOne({
          collection,
          id: record.id,
          data: { ...record, path: { ...stored, ...paths } },
          locale: "all",
          returning: false,
          req: scopedReq(request),
        } as never);
        await syncRouteIndex(target, collection, record.id, request);
      },
    });
  }
  return moves;
}

const baseRecordMoves: RecordMoveSource = async ({ payload, req, pages }) => {
  const found: RecordMove[] = [];
  let site: SiteRoutingDoc | undefined;
  for (const page of pages) {
    if (page.collection === "shared-pages") {
      site ??= await readSiteRouting(payload, req);
      for (const setting of SITE_ROUTING_SETTINGS) {
        if (refId(site[setting]) !== page.id) continue;
        found.push(
          ...(await baseMoves(
            payload,
            req,
            BASE_SETTINGS[setting].collection,
            page.paths,
          )),
        );
      }
      continue;
    }
    if (!page.tenant) continue;
    const routing = await readRouting(payload, req, page.tenant);
    if (refId(routing.careerPage) === page.id) {
      found.push(
        ...(await baseMoves(payload, req, "jobs", page.paths, page.tenant)),
      );
    }
  }
  return found;
};

export type BaseChange = {
  setting: BaseSetting;
  page: number | string | null;
  tenant?: string;
};

export type BaseImpact = {
  records: number;
  redirects: number;
  overLimit: boolean;
  message?: string;
};

async function planBaseChange(
  payload: Payload,
  req: Request,
  change: BaseChange,
): Promise<RecordMove[]> {
  const career = change.setting === "careerPage";
  const page = change.page
    ? await loadBasePage(
        payload,
        req,
        career ? "pages" : "shared-pages",
        String(change.page),
      )
    : undefined;
  return baseMoves(
    payload,
    req,
    BASE_SETTINGS[change.setting].collection,
    page?.paths,
    career ? change.tenant : undefined,
  );
}

function countRedirects(moves: RecordMove[]): number {
  return moves.reduce(
    (sum, move) => sum + (move.published ? move.moves.length : 0),
    0,
  );
}

export async function previewBaseChange(
  payload: Payload,
  change: BaseChange,
  req?: Request,
): Promise<BaseImpact> {
  const moves = await planBaseChange(payload, req, change);
  const overLimit = moves.length > CASCADE_LIMIT;
  return {
    records: moves.length,
    redirects: countRedirects(moves),
    overLimit,
    ...(overLimit ? { message: cascadeLimitMessage(moves.length) } : {}),
  };
}

async function applyBaseChange(
  payload: Payload,
  req: Request,
  change: BaseChange,
): Promise<void> {
  const moves = await planBaseChange(payload, req, change);
  if (moves.length > CASCADE_LIMIT) fail(cascadeLimitMessage(moves.length));
  for (const move of moves) {
    await move.apply(payload, req);
    if (!move.published) continue;
    for (const change of move.moves) {
      await writeAutoRedirect(
        payload,
        req,
        { tenant: move.tenant, locale: change.locale },
        change.from,
        change.to,
      );
    }
  }
}

async function publishedCount(
  payload: Payload,
  req: Request,
  collection: "products" | "solutions" | "jobs" | "posts",
  tenant?: string,
): Promise<number> {
  const where: Where = {
    and: [
      { _status: { equals: "published" } },
      ...(tenant ? [{ tenant: { equals: asId(tenant) } }] : []),
    ],
  };
  const { totalDocs } = await payload.count({
    collection,
    where,
    overrideAccess: true,
    req: scopedReq(req),
  });
  return totalDocs;
}

async function assertPublishedSharedPage(
  payload: Payload,
  req: Request,
  id: string,
): Promise<void> {
  const page = await loadBasePage(payload, req, "shared-pages", id);
  if (!page || !page.live)
    fail(pageNotPublishedMessage(page?.title ?? "That page"));
}

async function assertPublishedCompanyPage(
  payload: Payload,
  req: Request,
  id: string,
  tenant: string | undefined,
): Promise<void> {
  const page = await loadBasePage(payload, req, "pages", id);
  if (!page || !page.live)
    fail(pageNotPublishedMessage(page?.title ?? "That page"));
  if (page.tenant !== tenant) fail(OTHER_COMPANY_PAGE);
}

export const checkSiteRouting: GlobalBeforeChangeHook = async ({
  data,
  originalDoc,
  req,
}) => {
  const payload = req.payload;
  for (const setting of SITE_ROUTING_SETTINGS) {
    if (!(setting in data)) continue;
    const next = refId(data[setting]);
    const before = refId(
      (originalDoc as SiteRoutingDoc | undefined)?.[setting],
    );
    if (next === before) continue;
    if (next) {
      await assertPublishedSharedPage(payload, req, next);
    } else {
      const count = await publishedCount(
        payload,
        req,
        BASE_SETTINGS[setting].collection,
      );
      if (count > 0) fail(clearBaseMessage(setting, count));
    }
    const impact = await previewBaseChange(
      payload,
      { setting, page: next ?? null },
      req,
    );
    if (impact.overLimit) fail(impact.message!);
  }
  return data;
};

export const cascadeSiteRouting: GlobalAfterChangeHook = async ({
  doc,
  previousDoc,
  req,
}) => {
  for (const setting of SITE_ROUTING_SETTINGS) {
    const next = refId((doc as SiteRoutingDoc)[setting]);
    if (
      next === refId((previousDoc as SiteRoutingDoc | undefined)?.[setting])
    ) {
      continue;
    }
    await applyBaseChange(req.payload, req, { setting, page: next ?? null });
  }
  return doc;
};

type TenantSettingsData = {
  tenant?: Ref;
  routing?: RoutingGroup | null;
};

export const checkCompanyRouting: CollectionBeforeChangeHook = async ({
  data,
  originalDoc,
  req,
}) => {
  const payload = req.payload;
  const routing = (data as TenantSettingsData).routing;
  if (!routing) return data;
  const before = (originalDoc as TenantSettingsData | undefined)?.routing;
  const tenant = refId(
    (data as TenantSettingsData).tenant ??
      (originalDoc as TenantSettingsData | undefined)?.tenant,
  );
  if ("publicationPage" in routing) {
    const next = refId(routing.publicationPage);
    if (next && next !== refId(before?.publicationPage)) {
      await assertPublishedCompanyPage(payload, req, next, tenant);
    }
  }
  if ("careerPage" in routing) {
    const next = refId(routing.careerPage);
    if (next !== refId(before?.careerPage)) {
      if (next) {
        await assertPublishedCompanyPage(payload, req, next, tenant);
      } else if (tenant) {
        const count = await publishedCount(payload, req, "jobs", tenant);
        if (count > 0) fail(clearBaseMessage("careerPage", count));
      }
      if (tenant) {
        const impact = await previewBaseChange(
          payload,
          { setting: "careerPage", page: next ?? null, tenant },
          req,
        );
        if (impact.overLimit) fail(impact.message!);
      }
    }
  }
  return data;
};

export const cascadeCompanyRouting: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  req,
}) => {
  const next = refId((doc as TenantSettingsData).routing?.careerPage);
  const before = refId(
    (previousDoc as TenantSettingsData | undefined)?.routing?.careerPage,
  );
  const tenant = refId((doc as TenantSettingsData).tenant);
  if (next === before || !tenant) return doc;
  await applyBaseChange(req.payload, req, {
    setting: "careerPage",
    page: next ?? null,
    tenant,
  });
  return doc;
};

export function requireBase(
  collection: GovernedCollection,
): CollectionBeforeChangeHook {
  const setting = (Object.keys(BASE_SETTINGS) as BaseSetting[]).find(
    (key) => BASE_SETTINGS[key].collection === collection,
  )!;
  return async ({ data, originalDoc, req }) => {
    if (data.deletedAt) return data;
    const original = originalDoc as
      { _status?: string | null; tenant?: Ref } | undefined;
    if ((data._status ?? original?._status) !== "published") return data;
    const tenant =
      collection === "jobs"
        ? refId(data.tenant ?? original?.tenant)
        : undefined;
    const state = await baseState(req.payload, req, setting, tenant);
    if (state.state === "unset") fail(baseUnsetMessage(setting));
    if (state.state === "unpublished") {
      fail(baseUnpublishedMessage(setting, state.page.title));
    }
    return data;
  };
}

export type Dependency = {
  setting: SpecialSetting;
  target: string;
  direct: boolean;
};

export function protectionMessage(
  verb: "trash" | "delete",
  title: string,
  dependency: Dependency,
  count: number,
): string {
  const who = dependency.direct
    ? "It's"
    : `It holds "${dependency.target}", which is`;
  if (dependency.setting === "publicationPage") {
    const action = verb === "delete" ? "delete" : "trash or unpublish";
    return `Can't ${action} "${title}". ${who} set in ${PUBLICATION.where} › ${PUBLICATION.field}, used by ${PUBLICATION.usedBy} ${pluralize(count, PUBLICATION.singular, PUBLICATION.plural)}. Pick another page there first.`;
  }
  const base = BASE_SETTINGS[dependency.setting];
  const action = verb === "delete" ? "deleted" : "trashed or unpublished";
  const head = `"${title}" can't be ${action}. ${who} the ${base.label} page in ${base.where}.`;
  if (count === 0) return `${head} Pick another page there first.`;
  return `${head} ${pluralize(count, `${base.singular} lives`, `${base.plural} live`)} under its URL and would stop working.`;
}

async function ancestry(
  payload: Payload,
  req: Request,
  collection: PageCollection,
  id: string,
): Promise<string[]> {
  const chain: string[] = [];
  let next: string | undefined = id;
  while (next && !chain.includes(next) && chain.length < 50) {
    chain.push(next);
    next = (await loadBasePage(payload, req, collection, next))?.parent;
  }
  return chain;
}

async function dependenciesOf(
  payload: Payload,
  req: Request,
  collection: PageCollection,
  page: BasePage,
): Promise<Dependency[]> {
  const settings: { setting: SpecialSetting; id: string | undefined }[] = [];
  if (collection === "shared-pages") {
    const site = await readSiteRouting(payload, req);
    for (const setting of SITE_ROUTING_SETTINGS) {
      settings.push({ setting, id: refId(site[setting]) });
    }
  } else if (page.tenant) {
    const routing = await readRouting(payload, req, page.tenant);
    settings.push(
      { setting: "careerPage", id: refId(routing.careerPage) },
      { setting: "publicationPage", id: refId(routing.publicationPage) },
    );
  }
  const found: Dependency[] = [];
  for (const { setting, id } of settings) {
    if (!id) continue;
    const chain = await ancestry(payload, req, collection, id);
    if (!chain.includes(page.id)) continue;
    const direct = id === page.id;
    const target = direct
      ? page.title
      : ((await loadBasePage(payload, req, collection, id))?.title ?? "a page");
    found.push({ setting, target, direct });
  }
  return found;
}

async function dependentCount(
  payload: Payload,
  req: Request,
  setting: SpecialSetting,
  tenant: string | undefined,
): Promise<number> {
  if (setting === "publicationPage") {
    return publishedCount(payload, req, "posts", tenant);
  }
  return publishedCount(
    payload,
    req,
    BASE_SETTINGS[setting].collection,
    setting === "careerPage" ? tenant : undefined,
  );
}

export async function assertNotBasePage(
  payload: Payload,
  req: Request,
  collection: PageCollection,
  id: number | string,
  verb: "trash" | "delete",
): Promise<void> {
  const page = await loadBasePage(payload, req, collection, String(id));
  if (!page) return;
  const [first] = await dependenciesOf(payload, req, collection, page);
  if (!first) return;
  const count = await dependentCount(payload, req, first.setting, page.tenant);
  fail(protectionMessage(verb, page.title, first, count));
}

export const keepBasePagesOutOfTheTrash: CollectionBeforeValidateHook = async ({
  collection,
  data,
  originalDoc,
  req,
}) => {
  const id = (originalDoc as { id?: number | string } | undefined)?.id;
  const trashing =
    Boolean(data?.deletedAt) &&
    !(originalDoc as StoredPage | undefined)?.deletedAt;
  if (trashing && id !== undefined) {
    await assertNotBasePage(
      req.payload,
      req,
      collection.slug as PageCollection,
      id,
      "trash",
    );
  }
  return data;
};

export const keepBasePagesPublished: CollectionAfterChangeHook = async ({
  collection,
  doc,
  previousDoc,
  req,
}) => {
  const before = previousDoc as StoredPage | undefined;
  if (before?._status !== "published" || before.deletedAt) return doc;
  const slug = collection.slug as PageCollection;
  const id = (doc as { id: number | string }).id;
  const page = await loadBasePage(req.payload, req, slug, String(id));
  if (page && !page.live) {
    await assertNotBasePage(req.payload, req, slug, id, "trash");
  }
  return doc;
};

export const keepBasePagesOnDelete: CollectionBeforeDeleteHook = async ({
  collection,
  id,
  req,
}) => {
  await assertNotBasePage(
    req.payload,
    req,
    collection.slug as PageCollection,
    id,
    "delete",
  );
};

export type PublicationPage = {
  id: string;
  title: string;
  paths: Record<string, string>;
};

export async function getPublicationPage(
  payload: Payload,
  tenant: number | string,
  req?: Request,
): Promise<PublicationPage | null> {
  const id = refId(
    (await readRouting(payload, req, String(tenant))).publicationPage,
  );
  if (!id) return null;
  const page = await loadBasePage(payload, req, "pages", id);
  if (!page || !page.live || page.tenant !== String(tenant)) return null;
  return {
    id: page.id,
    title: page.title,
    paths: Object.fromEntries(
      localeCodes().map((locale) => [
        locale,
        page.paths[locale] || page.paths[localization.defaultLocale] || "",
      ]),
    ),
  };
}
