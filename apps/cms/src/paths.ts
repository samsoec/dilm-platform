import {
  ValidationError,
  type CollectionSlug,
  type FieldHook,
  type Payload,
  type PayloadRequest,
  type Where,
} from "payload";

import { localization } from "./localization";
import {
  computePath,
  localeCodes,
  slugForLocale,
  usesSlugFallback,
  type LocalizedSlugs,
} from "./pathCompute";
import { refId, scopedReq } from "./pageRules";
import {
  RECORD_COLLECTIONS,
  isRecordCollection,
  jobBasePaths,
  recordBasePaths,
  type RecordCollection,
} from "./recordBases";

export const CATEGORY_PREFIX = {
  en: "category",
  id: "kategori",
} as const;

export const CATEGORY_PREFIX_PATHS: Record<string, string> = {
  en: `/${CATEGORY_PREFIX.en}`,
  id: `/${CATEGORY_PREFIX.id}`,
};

export const RESERVED_SEGMENTS = [
  ...Object.values(CATEGORY_PREFIX),
  "api",
  "admin",
  "_next",
  "media",
  "sitemap.xml",
  "robots.txt",
] as const;

export const RESERVED_MESSAGE =
  "URLs can't start with a reserved word: category, kategori, api, admin, _next, media.";

export { computePath, localeCodes, slugForLocale, usesSlugFallback };
export type { LocalizedSlugs };

export type PageCollection = "pages" | "shared-pages";

export type PathCollection =
  PageCollection | RecordCollection | "jobs" | "posts" | "categories";

export type PathProblem = {
  locale: string;
  path: string;
  message: string;
};

export type PathInput = {
  collection: PathCollection;
  id?: number | string | null;
  tenant?: number | string | { id: number | string } | null;
  parent?: number | string | { id: number | string } | null;
  category?: number | string | { id: number | string } | null;
  slugs: LocalizedSlugs;
};

export function firstSegment(path: string): string {
  return path.split("/").filter(Boolean)[0] ?? "";
}

export function reservedProblem(path: string): string | undefined {
  return (RESERVED_SEGMENTS as readonly string[]).includes(firstSegment(path))
    ? RESERVED_MESSAGE
    : undefined;
}

export function joinNames(names: string[]): string {
  if (names.length <= 1) return names.join("");
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}

export function sharedPageMessage(
  path: string,
  title: string,
  sites: number,
): string {
  return `${path} is the shared page "${title}", on all ${sites} sites. Pick another slug.`;
}

export type TenantPage = { title: string; company: string };

export function companyPagesMessage(pages: TenantPage[]): string {
  const companies = new Set(pages.map((page) => page.company));
  const titles = [...new Set(pages.map((page) => page.title))];
  const where = titles.map((title) => {
    const names = pages
      .filter((page) => page.title === title)
      .map((page) => page.company);
    return `"${title}" on ${joinNames(names)}`;
  });
  const count = companies.size;
  return `Used by ${count} ${count === 1 ? "company" : "companies"}: ${where.join("; ")}.`;
}

export function samePageMessage(
  path: string,
  title: string,
  company?: string,
): string {
  return company
    ? `${path} is already used by "${title}" on ${company}. Pick another slug.`
    : `${path} is already the shared page "${title}". Pick another slug.`;
}

export function recordClashMessage(
  collection: RecordCollection,
  rival: { collection: RecordCollection; name: string; company: string },
  sites: number,
): string {
  const same = rival.collection === collection;
  const noun = collection === "products" ? "Products" : "Solutions";
  const other = rival.collection === "products" ? "product" : "solution";
  const catalog = same
    ? `${noun} share one catalog across the ${sites} sites`
    : `Products and solutions share one catalog across the ${sites} sites`;
  const subject = same ? `"${rival.name}"` : `The ${other} "${rival.name}"`;
  return `${subject} by ${rival.company} already uses this URL. ${catalog}, so slugs must be unique.`;
}

export function catalogJobClashMessage(
  path: string,
  kind: "product" | "solution" | "job",
  name: string,
  company: string,
): string {
  return `${path} is already used by the ${kind} "${name}" on ${company}. Pick another slug.`;
}

export function categoryClashMessage(path: string, name: string): string {
  return `${path} is already the category "${name}". Pick another slug.`;
}

type Doc = {
  id: number | string;
  title?: string | null;
  name?: string | null;
  tenant?: number | string | { id: number | string; name?: string } | null;
  path?: string | null;
};

async function findAt(
  payload: Payload,
  req: Partial<PayloadRequest> | undefined,
  collection: PathCollection,
  locale: string,
  where: Where,
) {
  const { docs } = await payload.find({
    collection: collection as CollectionSlug,
    where,
    locale: locale as "en" | "id",
    fallbackLocale: localization.defaultLocale,
    depth: 0,
    limit: 100,
    pagination: false,
    overrideAccess: true,
    req: scopedReq(req),
  });
  return docs as unknown as Doc[];
}

async function companyNames(
  payload: Payload,
  req: Partial<PayloadRequest> | undefined,
  ids: (number | string)[],
): Promise<Map<string, string>> {
  const names = new Map<string, string>();
  if (ids.length === 0) return names;
  const { docs } = await payload.find({
    collection: "tenants",
    where: { id: { in: ids } },
    depth: 0,
    limit: ids.length,
    pagination: false,
    overrideAccess: true,
    req: scopedReq(req),
  });
  for (const tenant of docs as unknown as {
    id: number | string;
    name: string;
  }[]) {
    names.set(String(tenant.id), tenant.name);
  }
  return names;
}

async function parentPaths(
  payload: Payload,
  req: Partial<PayloadRequest> | undefined,
  collection: PageCollection,
  parent: string,
): Promise<Record<string, string | null | undefined>> {
  const found = (await payload.findByID({
    collection: collection as CollectionSlug,
    id: parent,
    locale: "all",
    fallbackLocale: false,
    depth: 0,
    trash: true,
    overrideAccess: true,
    req: scopedReq(req),
  })) as unknown as { path?: Record<string, string | null> | string | null };
  if (typeof found.path === "string") {
    return { [localization.defaultLocale]: found.path };
  }
  return found.path ?? {};
}

async function categoryPathsOf(
  payload: Payload,
  req: Partial<PayloadRequest> | undefined,
  category: string,
): Promise<Record<string, string | null | undefined>> {
  try {
    const found = (await payload.findByID({
      collection: "categories" as CollectionSlug,
      id: category,
      locale: "all",
      fallbackLocale: false,
      depth: 0,
      overrideAccess: true,
      req: scopedReq(req),
    })) as unknown as { path?: Record<string, string | null> | string | null };
    if (typeof found.path === "string") {
      return { [localization.defaultLocale]: found.path };
    }
    return found.path ?? {};
  } catch {
    return {};
  }
}

export async function computePaths(
  payload: Payload,
  input: PathInput,
  req?: Partial<PayloadRequest>,
): Promise<Record<string, string>> {
  const parent = refId(input.parent);
  const job = input.collection === "jobs";
  const category = refId(input.category);
  const record =
    isRecordCollection(input.collection) ||
    job ||
    input.collection === "posts" ||
    input.collection === "categories";
  const above = isRecordCollection(input.collection)
    ? await recordBasePaths(payload, req, input.collection)
    : input.collection === "jobs"
      ? await jobBasePaths(payload, req, refId(input.tenant))
      : input.collection === "categories"
        ? CATEGORY_PREFIX_PATHS
        : input.collection === "posts"
          ? category
            ? await categoryPathsOf(payload, req, category)
            : undefined
          : parent
            ? await parentPaths(payload, req, input.collection, parent)
            : {};
  const paths: Record<string, string> = {};
  for (const locale of localeCodes()) {
    const { slug } = slugForLocale(input.slugs, locale);
    if ((record && !slug) || !above) {
      paths[locale] = "";
      continue;
    }
    const parentPath = above[locale] || above[localization.defaultLocale];
    paths[locale] = computePath(parentPath, slug);
  }
  return paths;
}

async function categoryTreeProblems(
  payload: Payload,
  req: Partial<PayloadRequest> | undefined,
  input: PathInput,
  locale: string,
  path: string,
  tenant: string | undefined,
  notSelf: (collection: PathCollection) => Where[],
): Promise<PathProblem[]> {
  const matches: Where = { path: { equals: path } };
  if (input.collection === "categories") {
    const rivals = await findAt(payload, req, "categories", locale, {
      and: [matches, ...notSelf("categories")],
    });
    return rivals.map((doc) => ({
      locale,
      path,
      message: categoryClashMessage(path, doc.name ?? "Untitled"),
    }));
  }
  const rivals = await findAt(payload, req, "posts", locale, {
    and: [
      matches,
      ...(tenant ? [{ tenant: { equals: tenant } }] : []),
      ...notSelf("posts"),
    ],
  });
  if (rivals.length === 0) return [];
  const names = await companyNames(
    payload,
    req,
    rivals.map((doc) => refId(doc.tenant)!).filter(Boolean),
  );
  return rivals.map((doc) => ({
    locale,
    path,
    message: samePageMessage(
      path,
      doc.title ?? "Untitled",
      names.get(refId(doc.tenant) ?? "") ?? "this company",
    ),
  }));
}

export async function pathProblems(
  payload: Payload,
  input: PathInput,
  paths: Record<string, string>,
  req?: Partial<PayloadRequest>,
): Promise<PathProblem[]> {
  const problems: PathProblem[] = [];
  const own = refId(input.id);
  const tenant = refId(input.tenant);
  const notSelf = (collection: PathCollection): Where[] =>
    own && collection === input.collection ? [{ id: { not_equals: own } }] : [];
  const record = isRecordCollection(input.collection);
  const job = input.collection === "jobs";
  const post = input.collection === "posts";
  const category = input.collection === "categories";
  let sites: number | undefined;
  const siteCount = async () =>
    (sites ??= (
      await payload.count({
        collection: "tenants",
        overrideAccess: true,
        req: scopedReq(req),
      })
    ).totalDocs);

  for (const locale of localeCodes()) {
    const path = paths[locale];
    if ((record || job || post || category) && !path) continue;
    if (post || category) {
      problems.push(
        ...(await categoryTreeProblems(
          payload,
          req,
          input,
          locale,
          path,
          tenant,
          notSelf,
        )),
      );
      continue;
    }
    const reserved = reservedProblem(path);
    if (reserved) {
      problems.push({ locale, path, message: reserved });
      continue;
    }
    const matches: Where = { path: { equals: path } };

    const shared = await findAt(payload, req, "shared-pages", locale, {
      and: [matches, ...notSelf("shared-pages")],
    });
    for (const doc of shared) {
      const count = await siteCount();
      problems.push({
        locale,
        path,
        message:
          input.collection === "shared-pages"
            ? samePageMessage(path, doc.title ?? "Untitled")
            : sharedPageMessage(path, doc.title ?? "Untitled", count),
      });
    }

    const tenantFilter: Where[] =
      (input.collection === "pages" || job) && tenant
        ? [{ tenant: { equals: tenant } }]
        : [];
    if (
      input.collection === "shared-pages" ||
      record ||
      tenantFilter.length > 0
    ) {
      const pages = await findAt(payload, req, "pages", locale, {
        and: [matches, ...tenantFilter, ...notSelf("pages")],
      });
      if (pages.length > 0) {
        const names = await companyNames(
          payload,
          req,
          pages.map((doc) => refId(doc.tenant)!).filter(Boolean),
        );
        const listed = pages.map((doc) => ({
          title: doc.title ?? "Untitled",
          company: names.get(refId(doc.tenant) ?? "") ?? "another company",
        }));
        problems.push({
          locale,
          path,
          message:
            input.collection === "shared-pages" || record
              ? companyPagesMessage(listed)
              : samePageMessage(path, listed[0].title, listed[0].company),
        });
      }
    }

    if (job) {
      const rivals = await findAt(payload, req, "jobs", locale, {
        and: [
          matches,
          ...(tenant ? [{ tenant: { equals: tenant } }] : []),
          ...notSelf("jobs"),
        ],
      });
      if (rivals.length > 0) {
        const names = await companyNames(
          payload,
          req,
          rivals.map((doc) => refId(doc.tenant)!).filter(Boolean),
        );
        for (const doc of rivals) {
          problems.push({
            locale,
            path,
            message: samePageMessage(
              path,
              doc.title ?? "Untitled",
              names.get(refId(doc.tenant) ?? "") ?? "this company",
            ),
          });
        }
      }
    }

    if (job || record) {
      const targets: ("products" | "solutions" | "jobs")[] = job
        ? [...RECORD_COLLECTIONS]
        : ["jobs"];
      for (const target of targets) {
        const rivals = await findAt(payload, req, target, locale, {
          and: [matches],
        });
        if (rivals.length === 0) continue;
        const names = await companyNames(
          payload,
          req,
          rivals.map((doc) => refId(doc.tenant)!).filter(Boolean),
        );
        for (const doc of rivals) {
          problems.push({
            locale,
            path,
            message: catalogJobClashMessage(
              path,
              target === "products"
                ? "product"
                : target === "solutions"
                  ? "solution"
                  : "job",
              doc.name ?? doc.title ?? "Untitled",
              names.get(refId(doc.tenant) ?? "") ?? "another company",
            ),
          });
        }
      }
    }

    if (isRecordCollection(input.collection)) {
      for (const target of RECORD_COLLECTIONS) {
        const rivals = await findAt(payload, req, target, locale, {
          and: [matches, ...notSelf(target)],
        });
        if (rivals.length === 0) continue;
        const names = await companyNames(
          payload,
          req,
          rivals.map((doc) => refId(doc.tenant)!).filter(Boolean),
        );
        const count = await siteCount();
        for (const doc of rivals) {
          problems.push({
            locale,
            path,
            message: recordClashMessage(
              input.collection,
              {
                collection: target,
                name: doc.name ?? "Untitled",
                company:
                  names.get(refId(doc.tenant) ?? "") ?? "another company",
              },
              count,
            ),
          });
        }
      }
    }
  }
  const seen = new Set<string>();
  return problems.filter((problem) => {
    if (seen.has(problem.message)) return false;
    seen.add(problem.message);
    return true;
  });
}

export async function validatePageSlug(
  payload: Payload,
  input: PathInput,
  req?: Partial<PayloadRequest>,
): Promise<{ paths: Record<string, string>; problems: PathProblem[] }> {
  const paths = await computePaths(payload, input, req);
  return { paths, problems: await pathProblems(payload, input, paths, req) };
}

export function problemMessage(
  problem: PathProblem,
  requestLocale: string | undefined,
): string {
  const label =
    requestLocale && requestLocale !== "all" && requestLocale !== problem.locale
      ? `${problem.locale.toUpperCase()} address: `
      : "";
  return `${label}${problem.message}`;
}

type SiblingBag = Record<string, unknown> | undefined;

function asLocaleMap(value: unknown): LocalizedSlugs {
  return value && typeof value === "object" ? (value as LocalizedSlugs) : {};
}

export function slugsFrom(
  submitted: unknown,
  stored: unknown,
  requestLocale: string | undefined,
): LocalizedSlugs {
  const slugs: LocalizedSlugs = { ...asLocaleMap(stored) };
  if (submitted && typeof submitted === "object") {
    return { ...slugs, ...(submitted as LocalizedSlugs) };
  }
  if (submitted === undefined) return slugs;
  const locale =
    !requestLocale || requestLocale === "all"
      ? localization.defaultLocale
      : requestLocale;
  slugs[locale] = submitted as string | null;
  return slugs;
}

export const writePath: FieldHook = async ({
  collection,
  data,
  originalDoc,
  req,
  siblingData,
  siblingDocWithLocales,
}) => {
  if (!collection) return undefined;
  const bag = siblingData as SiblingBag;
  const stored = (siblingDocWithLocales as SiblingBag)?.slug;
  const slugs = slugsFrom(bag?.slug, stored, req.locale);
  const original = (originalDoc ?? {}) as { id?: number | string };
  const input: PathInput = {
    collection: collection.slug as PageCollection,
    id: (data as { id?: number | string } | undefined)?.id ?? original.id,
    tenant:
      (data as { tenant?: PathInput["tenant"] } | undefined)?.tenant ??
      (originalDoc as { tenant?: PathInput["tenant"] } | undefined)?.tenant,
    parent:
      data && "parent" in data
        ? (data as { parent?: PathInput["parent"] }).parent
        : (originalDoc as { parent?: PathInput["parent"] } | undefined)?.parent,
    category:
      data && "primaryCategory" in data
        ? (data as { primaryCategory?: PathInput["category"] }).primaryCategory
        : (
            originalDoc as
              { primaryCategory?: PathInput["category"] } | undefined
          )?.primaryCategory,
    slugs,
  };
  const { paths, problems } = await validatePageSlug(req.payload, input, req);
  if (problems.length > 0) {
    throw new ValidationError(
      {
        collection: collection.slug,
        errors: problems.map((problem) => ({
          path: "slug",
          message: problemMessage(problem, req.locale),
        })),
        req,
      },
      req.t,
    );
  }
  const requestLocale =
    !req.locale || req.locale === "all"
      ? localization.defaultLocale
      : req.locale;
  const bagOfPaths = siblingDocWithLocales as SiblingBag;
  if (bagOfPaths) {
    bagOfPaths.path = { ...asLocaleMap(bagOfPaths.path), ...paths };
  }
  return req.locale === "all" ? paths : paths[requestLocale];
};

export const writeSlugFallback: FieldHook = ({
  req,
  siblingData,
  siblingDocWithLocales,
}) => {
  const slugs = slugsFrom(
    (siblingData as SiblingBag)?.slug,
    (siblingDocWithLocales as SiblingBag)?.slug,
    req.locale,
  );
  return usesSlugFallback(slugs);
};
