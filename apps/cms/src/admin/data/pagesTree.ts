import type { Payload, TypedUser, Where } from "payload";

import { localization } from "../../localization";
import { REMOVED_USER } from "../authors";
import type {
  LinkLike,
  LocaleMap,
  PageCollection,
  PageRecord,
} from "../components/pages/pagesModel";
import { headerLinks, pageKey } from "../components/pages/pagesModel";
import { getPublishStatus } from "../components/kit/publication";
import type { TenantID } from "./badges";

type Ref = number | string | { id: number | string } | null | undefined;

type RawPage = {
  id: number | string;
  tenant?: Ref;
  title?: LocaleMap | string | null;
  path?: LocaleMap | string | null;
  parent?: Ref;
  _status?: string | null;
  updatedAt?: string | null;
  updatedBy?: Ref;
  deletedAt?: string | null;
  trashedBy?: Ref;
  redirectTo?: LinkLike | null;
};

const SELECT = {
  title: true,
  path: true,
  parent: true,
  tenant: true,
  _status: true,
  updatedAt: true,
  updatedBy: true,
  deletedAt: true,
  trashedBy: true,
  redirectTo: true,
} as const;

const OTHER_TARGETS = [
  "products",
  "solutions",
  "jobs",
  "posts",
  "categories",
] as const;

function idOf(value: Ref): number | string | null {
  if (value === null || value === undefined || value === "") return null;
  return typeof value === "object" ? value.id : value;
}

function asMap(value: LocaleMap | string | null | undefined): LocaleMap {
  if (typeof value === "string") return { [localization.defaultLocale]: value };
  return value ?? {};
}

export type PagesTreeData = {
  records: PageRecord[];
  trashed: PageRecord[];
  company?: { id: TenantID; name: string; domain: string };
  careerKey?: string;
  publicationKey?: string;
  header: { keys: string[]; paths: string[] };
  otherTargets: Record<string, string>;
};

type Context = { payload: Payload; user: TypedUser };

async function listPages(
  { payload, user }: Context,
  collection: PageCollection,
  tenant: TenantID | undefined,
  mode: "live" | "trashed",
): Promise<RawPage[]> {
  if (collection === "pages" && tenant === undefined) return [];
  const scope: Where[] = [];
  if (collection === "pages") scope.push({ tenant: { equals: tenant } });
  if (mode === "trashed") scope.push({ deletedAt: { exists: true } });
  const result = await payload.find({
    collection,
    where: scope.length > 0 ? { and: scope } : {},
    draft: mode === "live",
    trash: mode === "trashed",
    locale: "all",
    fallbackLocale: false,
    depth: 0,
    pagination: false,
    select: SELECT,
    overrideAccess: false,
    user,
  });
  return result.docs as unknown as RawPage[];
}

async function livePublished(
  { payload, user }: Context,
  collection: PageCollection,
  tenant: TenantID | undefined,
): Promise<Set<string>> {
  if (collection === "pages" && tenant === undefined) return new Set();
  const result = await payload.find({
    collection,
    where: collection === "pages" ? { tenant: { equals: tenant } } : {},
    draft: false,
    depth: 0,
    pagination: false,
    select: { _status: true },
    overrideAccess: false,
    user,
  });
  return new Set(
    (result.docs as unknown as RawPage[])
      .filter((doc) => doc._status === "published")
      .map(({ id }) => String(id)),
  );
}

export async function peopleNames(
  { payload, user }: Context,
  ids: (number | string)[],
): Promise<Map<string, string>> {
  if (ids.length === 0) return new Map();
  const { docs } = await payload.find({
    collection: "users",
    where: { id: { in: ids } },
    select: { name: true },
    pagination: false,
    depth: 0,
    overrideAccess: false,
    user,
  });
  return new Map(
    docs.map((doc) => [String(doc.id), (doc.name ?? "").trim() || "Unnamed"]),
  );
}

export function toRecord(
  raw: RawPage,
  collection: PageCollection,
  options: {
    published: ReadonlySet<string>;
    names: ReadonlyMap<string, string>;
  },
): PageRecord {
  const parent = idOf(raw.parent);
  const author = (person: Ref) => {
    const id = idOf(person);
    if (id === null) return null;
    return options.names.get(String(id)) ?? REMOVED_USER;
  };
  return {
    key: pageKey(collection, raw.id),
    id: raw.id,
    collection,
    title: asMap(raw.title),
    path: asMap(raw.path),
    parentKey: parent === null ? null : pageKey(collection, parent),
    tenant: collection === "pages" ? idOf(raw.tenant) : null,
    status: getPublishStatus(
      { _status: raw._status, deletedAt: raw.deletedAt },
      { hasPublishedVersion: options.published.has(String(raw.id)) },
    ),
    updatedAt: raw.updatedAt ?? null,
    savedBy: author(raw.updatedBy),
    deletedAt: raw.deletedAt ?? null,
    trashedBy: author(raw.trashedBy),
    redirectTo: raw.redirectTo ?? null,
  };
}

async function otherTargets(
  { payload, user }: Context,
  records: PageRecord[],
  locale: string,
): Promise<Record<string, string>> {
  const wanted = new Map<string, Set<string>>();
  for (const { redirectTo } of records) {
    const reference = redirectTo?.reference;
    if (redirectTo?.type !== "reference" || !reference?.relationTo) continue;
    const id = idOf(reference.value);
    if (
      id === null ||
      !(OTHER_TARGETS as readonly string[]).includes(reference.relationTo)
    ) {
      continue;
    }
    wanted.set(
      reference.relationTo,
      (wanted.get(reference.relationTo) ?? new Set()).add(String(id)),
    );
  }
  const found: Record<string, string> = {};
  for (const [collection, ids] of wanted) {
    const { docs } = await payload.find({
      collection: collection as (typeof OTHER_TARGETS)[number],
      where: { id: { in: [...ids] } },
      locale: locale as "en",
      depth: 0,
      pagination: false,
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
      if (label) found[`${collection}:${doc.id}`] = label;
    }
  }
  return found;
}

export async function loadPagesTree(
  context: Context,
  tenant: TenantID | undefined,
  locale: string,
): Promise<PagesTreeData> {
  const { payload, user } = context;
  const company =
    tenant === undefined
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
          .then(({ docs: [found] }) =>
            found
              ? { id: found.id, name: found.name, domain: found.domain }
              : undefined,
          );
  const header =
    tenant === undefined
      ? undefined
      : payload
          .find({
            collection: "header",
            where: { tenant: { equals: tenant } },
            select: { navItems: true, cta: true },
            limit: 1,
            depth: 0,
            overrideAccess: false,
            user,
          })
          .then(({ docs: [found] }) => found);
  const footer =
    tenant === undefined
      ? undefined
      : payload
          .find({
            collection: "footer",
            where: { tenant: { equals: tenant } },
            select: { linkColumns: true },
            limit: 1,
            depth: 0,
            overrideAccess: false,
            user,
          })
          .then(({ docs: [found] }) => found);
  const settings =
    tenant === undefined
      ? undefined
      : payload
          .find({
            collection: "tenant-settings",
            where: { tenant: { equals: tenant } },
            select: { routing: true },
            limit: 1,
            depth: 0,
            overrideAccess: false,
            user,
          })
          .then(({ docs: [found] }) => found);

  const [
    ownLive,
    sharedLive,
    ownTrashed,
    sharedTrashed,
    ownPublished,
    sharedPublished,
    companyRow,
    headerRow,
    footerRow,
    settingsRow,
  ] = await Promise.all([
    listPages(context, "pages", tenant, "live"),
    listPages(context, "shared-pages", tenant, "live"),
    listPages(context, "pages", tenant, "trashed"),
    listPages(context, "shared-pages", tenant, "trashed"),
    livePublished(context, "pages", tenant),
    livePublished(context, "shared-pages", tenant),
    company,
    header,
    footer,
    settings,
  ]);

  const people = [
    ...ownLive,
    ...sharedLive,
    ...ownTrashed,
    ...sharedTrashed,
  ].flatMap((raw) => [idOf(raw.updatedBy), idOf(raw.trashedBy)]);
  const names = await peopleNames(context, [
    ...new Set(people.filter((id): id is number | string => id !== null)),
  ]);

  const build = (
    docs: RawPage[],
    collection: PageCollection,
    published: ReadonlySet<string>,
  ) => docs.map((raw) => toRecord(raw, collection, { published, names }));

  const records = [
    ...build(sharedLive, "shared-pages", sharedPublished),
    ...build(ownLive, "pages", ownPublished),
  ];
  const routing = (
    settingsRow as { routing?: { careerPage?: Ref; publicationPage?: Ref } }
  )?.routing;
  const career = idOf(routing?.careerPage);
  const publication = idOf(routing?.publicationPage);
  const links = headerLinks(
    headerRow as Parameters<typeof headerLinks>[0],
    footerRow as Parameters<typeof headerLinks>[1],
  );

  return {
    records,
    trashed: [
      ...build(sharedTrashed, "shared-pages", new Set()),
      ...build(ownTrashed, "pages", new Set()),
    ],
    company: companyRow,
    careerKey: career === null ? undefined : pageKey("pages", career),
    publicationKey:
      publication === null ? undefined : pageKey("pages", publication),
    header: { keys: [...links.keys], paths: [...links.paths] },
    otherTargets: await otherTargets(context, records, locale),
  };
}
