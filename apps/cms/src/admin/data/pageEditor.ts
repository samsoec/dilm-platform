import { cache } from "react";
import type { Payload, TypedUser } from "payload";

import { localization } from "../../localization";
import { hasRedirect } from "../../pageRules";
import { findReferrers, type Referrer } from "../../routeIndex";
import {
  countTranslations,
  type TranslationCount,
} from "../components/dashboard/model";
import { linkEntries, type LinkEntry } from "../components/editor/editor";
import { NO_SEO_DEFAULTS, type SeoDefaults } from "../components/editor/seo";
import {
  pathsOf,
  relationId,
  slugsOf,
  type ParentPaths,
} from "../components/editor/urls";
import {
  headerLinks,
  isInHeader,
  pageKey,
  type LinkLike,
  type PageCollection,
} from "../components/pages/pagesModel";
import {
  getPublishStatus,
  type PublishStatus,
} from "../components/kit/publication";
import { peopleNames } from "./pagesTree";

type Context = { payload: Payload; user: TypedUser };

type Crumbs = { doc?: unknown }[] | null | undefined;

type Raw = Record<string, unknown> & {
  id: number | string;
  tenant?: unknown;
  parent?: unknown;
  _status?: string | null;
  updatedAt?: string | null;
  updatedBy?: unknown;
  deletedAt?: string | null;
  breadcrumbs?: Crumbs | Record<string, Crumbs> | null;
  redirectTo?: LinkLike | null;
  layout?: unknown[] | null;
};

export type PageEditorData = {
  collection: PageCollection;
  id: string;
  tenant: string | null;
  company?: { id: number | string; name: string; domain: string };
  status: PublishStatus;
  hasPublished: boolean;
  parentPaths: ParentPaths;
  slugs: Record<string, string>;
  ancestors: { id: string; title: string }[];
  children: number;
  sections: number;
  seoDefaults: SeoDefaults;
  liveSince: string | null;
  savedAt: string | null;
  savedBy: string | null;
  versions: number;
  inMenu: boolean;
  forwards: boolean;
  links: LinkEntry[];
  translation: TranslationCount;
};

const UNTRANSLATED_SKIP = new Set(["slug", "path"]);

const TITLE_COLLECTIONS = [
  "pages",
  "shared-pages",
  "products",
  "solutions",
  "jobs",
  "posts",
  "categories",
] as const;

type TitleCollection = (typeof TITLE_COLLECTIONS)[number];

function idText(value: unknown): string | undefined {
  return relationId(value as Parameters<typeof relationId>[0]);
}

async function titlesFor(
  { payload, user }: Context,
  wanted: readonly { collection: string; id: string }[],
  locale: string,
): Promise<Map<string, string>> {
  const titles = new Map<string, string>();
  const byCollection = new Map<string, string[]>();
  for (const { collection, id } of wanted) {
    if (!(TITLE_COLLECTIONS as readonly string[]).includes(collection)) {
      continue;
    }
    byCollection.set(collection, [...(byCollection.get(collection) ?? []), id]);
  }
  await Promise.all(
    [...byCollection].map(async ([collection, ids]) => {
      const { docs } = await payload.find({
        collection: collection as TitleCollection,
        where: { id: { in: ids } },
        locale: locale as "en",
        fallbackLocale: localization.defaultLocale,
        depth: 0,
        pagination: false,
        draft: collection === "pages" || collection === "shared-pages",
        select: { title: true, name: true, slug: true } as never,
        overrideAccess: false,
        user,
      });
      for (const doc of docs as unknown as {
        id: number | string;
        title?: string;
        name?: string;
        slug?: string;
      }[]) {
        const label = doc.title || doc.name || doc.slug;
        if (label) titles.set(`${collection}:${doc.id}`, label);
      }
    }),
  );
  return titles;
}

async function seoDefaults(
  { payload, user }: Context,
  tenant: string | null,
): Promise<SeoDefaults> {
  if (tenant === null) return NO_SEO_DEFAULTS;
  const {
    docs: [settings],
  } = await payload.find({
    collection: "tenant-settings",
    where: { tenant: { equals: tenant } },
    locale: "all",
    fallbackLocale: false,
    limit: 1,
    depth: 1,
    select: { defaultSeo: true },
    overrideAccess: false,
    user,
  });
  const seo = (settings as { defaultSeo?: Record<string, unknown> } | undefined)
    ?.defaultSeo;
  const image = seo?.ogImage as
    { id?: number | string; filename?: string | null } | null | undefined;
  return {
    title: (seo?.title as SeoDefaults["title"]) ?? {},
    description: (seo?.description as SeoDefaults["description"]) ?? {},
    image:
      image && typeof image === "object" && image.id !== undefined
        ? { id: image.id, filename: image.filename ?? null }
        : null,
  };
}

async function menuLinks({ payload, user }: Context, tenant: string | null) {
  if (tenant === null) return undefined;
  const [header, footer] = await Promise.all([
    payload.find({
      collection: "header",
      where: { tenant: { equals: tenant } },
      select: { navItems: true, cta: true },
      limit: 1,
      depth: 0,
      overrideAccess: false,
      user,
    }),
    payload.find({
      collection: "footer",
      where: { tenant: { equals: tenant } },
      select: { linkColumns: true },
      limit: 1,
      depth: 0,
      overrideAccess: false,
      user,
    }),
  ]);
  const links = headerLinks(
    header.docs[0] as Parameters<typeof headerLinks>[0],
    footer.docs[0] as Parameters<typeof headerLinks>[1],
  );
  return { keys: links.keys, paths: links.paths };
}

async function referrersOf(
  { payload, user }: Context,
  collection: PageCollection,
  id: string,
  tenant: string | null,
  locale: string,
): Promise<LinkEntry[]> {
  const referrers: Referrer[] = await findReferrers(payload, collection, id);
  const { docs: forwarding } = await payload.find({
    collection: collection === "pages" ? "pages" : "shared-pages",
    where: {
      "redirectTo.reference": { equals: { relationTo: collection, value: id } },
    },
    depth: 0,
    pagination: false,
    select: { title: true },
    overrideAccess: false,
    user,
  });
  const forwarders = forwarding.map((doc) => ({
    collection,
    id: String(doc.id),
  }));
  const titles = await titlesFor(
    { payload, user },
    [
      ...referrers.map((entry) => ({
        collection: entry.collection,
        id: entry.id,
      })),
      ...forwarders,
    ],
    locale,
  );
  const readable = referrers.filter((entry) =>
    titles.has(`${entry.collection}:${entry.id}`),
  );
  return linkEntries({
    self: { collection, id },
    tenant,
    referrers: readable,
    forwarders: forwarders.filter((entry) =>
      titles.has(`${entry.collection}:${entry.id}`),
    ),
    titles,
  });
}

function crumbsOf(
  value: Raw["breadcrumbs"],
  locale: string,
): { doc?: unknown }[] {
  if (Array.isArray(value)) return value;
  const byLocale = value as Record<string, Crumbs> | null | undefined;
  return byLocale?.[locale] ?? byLocale?.[localization.defaultLocale] ?? [];
}

async function load(
  context: Context,
  collection: PageCollection,
  id: string,
  locale: string,
): Promise<PageEditorData> {
  const { payload, user } = context;
  const doc = (await payload.findByID({
    collection,
    id,
    locale: "all",
    fallbackLocale: false,
    draft: true,
    depth: 0,
    trash: true,
    overrideAccess: false,
    user,
  })) as unknown as Raw;
  const tenant = idText(doc.tenant) ?? null;
  const parent = idText(doc.parent);
  const ancestorIds = crumbsOf(doc.breadcrumbs, locale)
    .map((crumb) => idText(crumb.doc))
    .filter((crumbId): crumbId is string => Boolean(crumbId) && crumbId !== id);

  const [
    company,
    liveVersion,
    versionCount,
    parentDoc,
    childDocs,
    defaults,
    menu,
    links,
    ancestorTitles,
  ] = await Promise.all([
    tenant === null
      ? undefined
      : payload
          .find({
            collection: "tenants",
            where: { id: { equals: tenant } },
            select: { name: true, domain: true },
            limit: 1,
            depth: 0,
            overrideAccess: false,
            user,
          })
          .then(({ docs: [found] }) => found),
    payload.findVersions({
      collection,
      where: {
        and: [
          { parent: { equals: id } },
          { "version._status": { equals: "published" } },
        ],
      },
      sort: "-updatedAt",
      limit: 1,
      depth: 0,
      overrideAccess: false,
      user,
    }),
    payload.countVersions({
      collection,
      where: { parent: { equals: id } },
      overrideAccess: false,
      user,
    }),
    parent
      ? payload.findByID({
          collection,
          id: parent,
          locale: "all",
          fallbackLocale: false,
          depth: 0,
          trash: true,
          select: { path: true },
          overrideAccess: false,
          user,
        })
      : undefined,
    payload.find({
      collection,
      where: { parent: { equals: id } },
      draft: true,
      depth: 0,
      pagination: false,
      select: { parent: true },
      overrideAccess: false,
      user,
    }),
    seoDefaults(context, tenant),
    menuLinks(context, tenant),
    referrersOf(context, collection, id, tenant, locale),
    titlesFor(
      context,
      ancestorIds.map((ancestor) => ({ collection, id: ancestor })),
      locale,
    ),
  ]);

  const savedBy = idText(doc.updatedBy);
  const names = savedBy ? await peopleNames(context, [savedBy]) : new Map();
  const hasPublished = liveVersion.totalDocs > 0;
  const path = pathsOf(doc);
  const slugs = Object.fromEntries(
    Object.entries(slugsOf(doc)).map(([code, slug]) => [code, slug ?? ""]),
  );
  const fields = payload.collections[collection].config.fields.filter(
    (field) => !("name" in field && UNTRANSLATED_SKIP.has(field.name)),
  );

  return {
    collection,
    id,
    tenant,
    company: company
      ? { id: company.id, name: company.name, domain: company.domain }
      : undefined,
    status: getPublishStatus(
      { _status: doc._status, deletedAt: doc.deletedAt },
      { hasPublishedVersion: hasPublished },
    ),
    hasPublished,
    parentPaths: parentDoc ? pathsOf(parentDoc) : {},
    slugs,
    ancestors: ancestorIds.map((ancestor) => ({
      id: ancestor,
      title: ancestorTitles.get(`${collection}:${ancestor}`) ?? "Untitled",
    })),
    children: childDocs.docs.length,
    sections: Array.isArray(doc.layout) ? doc.layout.length : 0,
    seoDefaults: defaults,
    liveSince: liveVersion.docs[0]?.updatedAt ?? null,
    savedAt: doc.updatedAt ?? null,
    savedBy: savedBy ? (names.get(savedBy) ?? null) : null,
    versions: Math.max(versionCount.totalDocs, 1),
    inMenu: menu
      ? isInHeader(
          { key: pageKey(collection, id), path },
          { keys: menu.keys, paths: menu.paths },
        )
      : false,
    forwards: hasRedirect(doc as Parameters<typeof hasRedirect>[0]),
    links,
    translation: countTranslations(fields, doc),
  };
}

export const loadPageEditor = cache(
  (
    payload: Payload,
    user: TypedUser,
    collection: PageCollection,
    id: string,
    locale: string,
  ) => load({ payload, user }, collection, id, locale),
);

export function blankEditorData(
  collection: PageCollection,
  overrides: Partial<PageEditorData> = {},
): PageEditorData {
  return {
    collection,
    id: "",
    tenant: null,
    status: "draft",
    hasPublished: false,
    parentPaths: {},
    slugs: {},
    ancestors: [],
    children: 0,
    sections: 0,
    seoDefaults: NO_SEO_DEFAULTS,
    liveSince: null,
    savedAt: null,
    savedBy: null,
    versions: 0,
    inMenu: false,
    forwards: false,
    links: [],
    translation: { translated: 0, total: 0 },
    ...overrides,
  };
}

async function loadNew(
  context: Context,
  collection: PageCollection,
  tenant: string | null,
  parent: string | undefined,
): Promise<PageEditorData> {
  const { payload, user } = context;
  const [company, parentDoc, defaults] = await Promise.all([
    tenant === null
      ? undefined
      : payload
          .find({
            collection: "tenants",
            where: { id: { equals: tenant } },
            select: { name: true, domain: true },
            limit: 1,
            depth: 0,
            overrideAccess: false,
            user,
          })
          .then(({ docs: [found] }) => found),
    parent
      ? payload.findByID({
          collection,
          id: parent,
          locale: "all",
          fallbackLocale: false,
          depth: 0,
          trash: true,
          select: { path: true },
          overrideAccess: false,
          user,
        })
      : undefined,
    seoDefaults(context, tenant),
  ]);
  return blankEditorData(collection, {
    tenant,
    company: company
      ? { id: company.id, name: company.name, domain: company.domain }
      : undefined,
    parentPaths: parentDoc ? pathsOf(parentDoc) : {},
    seoDefaults: defaults,
  });
}

export const loadNewPageEditor = cache(
  (
    payload: Payload,
    user: TypedUser,
    collection: PageCollection,
    tenant: string | null,
    parent: string | undefined,
  ) => loadNew({ payload, user }, collection, tenant, parent),
);
