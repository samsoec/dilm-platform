import type { IconName } from "../../icons";
import type { PublishStatus } from "../kit/publication";
import { getReach, type Reach, type ReachTenant } from "../kit/reach";

export type PageCollection = "pages" | "shared-pages";

export type LocaleMap = Record<string, string | null | undefined>;

export type LinkLike = {
  type?: string | null;
  internalPath?: string | null;
  externalUrl?: string | null;
  reference?: {
    relationTo?: string | null;
    value?: number | string | { id: number | string } | null;
  } | null;
};

export type PageRecord = {
  key: string;
  id: number | string;
  collection: PageCollection;
  title: LocaleMap;
  path: LocaleMap;
  parentKey: string | null;
  tenant: number | string | null;
  status: PublishStatus;
  updatedAt: string | null;
  savedBy: string | null;
  deletedAt: string | null;
  trashedBy: string | null;
  redirectTo: LinkLike | null;
};

export type HeaderLinks = {
  keys: ReadonlySet<string>;
  paths: ReadonlySet<string>;
};

export type TagKind = "shared" | "forwards" | "jobs" | "posts" | "header";

export type RowTag = { kind: TagKind; label: string };

export type PageRow = {
  key: string;
  id: number | string;
  collection: PageCollection;
  shared: boolean;
  depth: number;
  parentKey: string | null;
  hasChildren: boolean;
  title: string;
  url: string;
  icon: IconName;
  status: PublishStatus;
  reach: Reach;
  tags: RowTag[];
  savedLabel: string;
  savedBy: string | null;
};

export type TrashRow = {
  key: string;
  id: number | string;
  collection: PageCollection;
  shared: boolean;
  title: string;
  url: string;
  trashedLabel: string;
  trashedBy: string;
  restore: RestoreData;
};

export type RestoreData = { deletedAt: null; _status: "draft"; parent?: null };

export type RowContext = {
  locale: string;
  defaultLocale: string;
  careerKey?: string;
  publicationKey?: string;
  header: HeaderLinks;
  otherTargets?: Readonly<Record<string, string>>;
  tenants?: readonly ReachTenant[];
  sites?: number;
  now?: Date;
};

export type TreeNode = {
  record: PageRecord;
  depth: number;
  children: TreeNode[];
};

export const FILTERS = [
  "all",
  "draft",
  "published",
  "changed",
  "trash",
] as const;

export type Filter = (typeof FILTERS)[number];

export const FILTER_LABELS: Record<Filter, string> = {
  all: "All",
  draft: "Draft",
  published: "Published",
  changed: "Changed since publish",
  trash: "Trash",
};

export function pageKey(collection: PageCollection, id: number | string) {
  return `${collection}:${id}`;
}

export function localized(
  map: LocaleMap | null | undefined,
  locale: string,
  defaultLocale: string,
): string {
  return (
    map?.[locale]?.trim() ||
    map?.[defaultLocale]?.trim() ||
    Object.values(map ?? {})
      .find((value) => value?.trim())
      ?.trim() ||
    ""
  );
}

export function normalizePath(path: string | null | undefined): string {
  const trimmed = (path ?? "").trim().split(/[?#]/)[0] ?? "";
  if (!trimmed) return "";
  const withSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return withSlash.length > 1 ? withSlash.replace(/\/+$/, "") : withSlash;
}

function idText(value: unknown): string | undefined {
  if (value === null || value === undefined || value === "") return undefined;
  return String(
    typeof value === "object" ? (value as { id: number | string }).id : value,
  );
}

function compareIds(a: number | string, b: number | string): number {
  const x = Number(a);
  const y = Number(b);
  return Number.isNaN(x) || Number.isNaN(y)
    ? String(a).localeCompare(String(b))
    : x - y;
}

export function buildTree(records: readonly PageRecord[]): TreeNode[] {
  const byKey = new Map(records.map((record) => [record.key, record]));
  const childrenOf = new Map<string, PageRecord[]>();
  const roots: PageRecord[] = [];
  for (const record of records) {
    const parent = record.parentKey ? byKey.get(record.parentKey) : undefined;
    if (parent && parent.key !== record.key) {
      childrenOf.set(parent.key, [
        ...(childrenOf.get(parent.key) ?? []),
        record,
      ]);
    } else {
      roots.push(record);
    }
  }
  const order = (a: PageRecord, b: PageRecord) =>
    Number(b.collection === "shared-pages") -
      Number(a.collection === "shared-pages") || compareIds(a.id, b.id);
  const seen = new Set<string>();
  const build = (record: PageRecord, depth: number): TreeNode => {
    seen.add(record.key);
    return {
      record,
      depth,
      children: (childrenOf.get(record.key) ?? [])
        .filter(({ key }) => !seen.has(key))
        .sort(order)
        .map((child) => build(child, depth + 1)),
    };
  };
  const tree = roots.sort(order).map((record) => build(record, 0));
  for (const record of [...records].sort(order)) {
    if (!seen.has(record.key)) tree.push(build(record, 0));
  }
  return tree;
}

export function headerLinks(
  header:
    | {
        navItems?:
          | readonly {
              type?: string | null;
              link?: LinkLike | null;
              children?: readonly { link?: LinkLike | null }[] | null;
            }[]
          | null;
        cta?: { enabled?: boolean | null; link?: LinkLike | null } | null;
      }
    | null
    | undefined,
): HeaderLinks {
  const keys = new Set<string>();
  const paths = new Set<string>();
  const add = (link: LinkLike | null | undefined) => {
    if (!link) return;
    if (link.type === "reference") {
      const id = idText(link.reference?.value);
      const collection = link.reference?.relationTo;
      if (id && (collection === "pages" || collection === "shared-pages")) {
        keys.add(pageKey(collection, id));
      }
      return;
    }
    if (link.type === "external") return;
    const path = normalizePath(link.internalPath);
    if (path) paths.add(path);
  };
  for (const item of header?.navItems ?? []) {
    add(item.link);
    for (const child of item.children ?? []) add(child.link);
  }
  if (header?.cta?.enabled) add(header.cta.link);
  return { keys, paths };
}

export function isInHeader(
  record: Pick<PageRecord, "key" | "path">,
  header: HeaderLinks,
): boolean {
  if (header.keys.has(record.key)) return true;
  return Object.values(record.path).some((path) =>
    header.paths.has(normalizePath(path)),
  );
}

function hostOf(url: string): string {
  try {
    return new URL(url).host || url;
  } catch {
    return url;
  }
}

export function forwardsTarget(
  redirectTo: LinkLike | null | undefined,
  titles: ReadonlyMap<string, string>,
  others: Readonly<Record<string, string>> = {},
): string | undefined {
  if (!redirectTo) return undefined;
  if (redirectTo.type === "reference") {
    const id = idText(redirectTo.reference?.value);
    const collection = redirectTo.reference?.relationTo;
    if (!id || !collection) return undefined;
    const key = `${collection}:${id}`;
    return titles.get(key) || others[key] || undefined;
  }
  if (redirectTo.type === "external") {
    return redirectTo.externalUrl ? hostOf(redirectTo.externalUrl) : undefined;
  }
  return normalizePath(redirectTo.internalPath) || undefined;
}

export function isRoot(record: Pick<PageRecord, "collection" | "path">) {
  return Object.values(record.path).some((path) => path === "/");
}

function rowTags(
  record: PageRecord,
  forwards: string | undefined,
  context: RowContext,
): RowTag[] {
  const tags: RowTag[] = [];
  if (record.collection === "shared-pages") {
    tags.push({ kind: "shared", label: "Shared" });
  }
  if (forwards) {
    tags.push({ kind: "forwards", label: `Forwards → ${forwards}` });
  }
  if (record.key === context.careerKey) {
    tags.push({ kind: "jobs", label: "Jobs live here" });
  }
  if (record.key === context.publicationKey) {
    tags.push({ kind: "posts", label: "Posts & search" });
  }
  if (!forwards && !isRoot(record) && !isInHeader(record, context.header)) {
    tags.push({ kind: "header", label: "Not in header" });
  }
  return tags;
}

function rowIcon(
  record: PageRecord,
  hasChildren: boolean,
  forwards: boolean,
  context: RowContext,
): IconName {
  if (isRoot(record)) return "home";
  if (forwards || hasChildren) return "folder";
  if (record.key === context.publicationKey) return "newspaper";
  return "description";
}

export function toRows(
  tree: readonly TreeNode[],
  context: RowContext,
): PageRow[] {
  const titles = new Map<string, string>();
  const collect = (nodes: readonly TreeNode[]) => {
    for (const { record, children } of nodes) {
      titles.set(
        record.key,
        localized(record.title, context.locale, context.defaultLocale),
      );
      collect(children);
    }
  };
  collect(tree);

  const rows: PageRow[] = [];
  const visit = (nodes: readonly TreeNode[]) => {
    for (const { record, depth, children } of nodes) {
      const forwards = forwardsTarget(
        record.redirectTo,
        titles,
        context.otherTargets,
      );
      rows.push({
        key: record.key,
        id: record.id,
        collection: record.collection,
        shared: record.collection === "shared-pages",
        depth,
        parentKey: record.parentKey,
        hasChildren: children.length > 0,
        title: titles.get(record.key) || "Untitled",
        url:
          localized(record.path, context.locale, context.defaultLocale) || "/",
        icon: rowIcon(record, children.length > 0, Boolean(forwards), context),
        status: record.status,
        reach: getReach(
          { tenant: record.tenant },
          {
            collection: record.collection,
            tenants: context.tenants,
            sites: context.sites,
          },
        ),
        tags: rowTags(record, forwards, context),
        savedLabel: savedText(record.updatedAt, context.now),
        savedBy: record.savedBy,
      });
      visit(children);
    }
  };
  visit(tree);
  return rows;
}

export function firstName(name: string | null | undefined): string {
  return name?.trim().split(/\s+/)[0] || "—";
}

export function restoreData(
  record: Pick<PageRecord, "parentKey">,
  liveKeys: ReadonlySet<string>,
): RestoreData {
  return record.parentKey && !liveKeys.has(record.parentKey)
    ? { deletedAt: null, _status: "draft", parent: null }
    : { deletedAt: null, _status: "draft" };
}

export function toTrashRows(
  records: readonly PageRecord[],
  context: Pick<RowContext, "locale" | "defaultLocale" | "now">,
  liveKeys: ReadonlySet<string>,
): TrashRow[] {
  return records
    .filter(({ deletedAt }) => deletedAt)
    .sort(
      (a, b) =>
        new Date(b.deletedAt ?? 0).getTime() -
        new Date(a.deletedAt ?? 0).getTime(),
    )
    .map((record) => ({
      key: record.key,
      id: record.id,
      collection: record.collection,
      shared: record.collection === "shared-pages",
      title:
        localized(record.title, context.locale, context.defaultLocale) ||
        "Untitled",
      url: localized(record.path, context.locale, context.defaultLocale) || "/",
      trashedLabel: savedText(record.deletedAt, context.now, true),
      trashedBy: firstName(record.trashedBy),
      restore: restoreData(record, liveKeys),
    }));
}

export function matchesFilter(row: Pick<PageRow, "status">, filter: Filter) {
  return filter === "all" || filter === "trash" || row.status === filter;
}

export function matchesQuery(
  row: Pick<PageRow, "title" | "url">,
  query: string,
): boolean {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  return (
    row.title.toLowerCase().includes(needle) ||
    row.url.toLowerCase().includes(needle)
  );
}

export type VisibleRows = {
  rows: PageRow[];
  context: ReadonlySet<string>;
};

export function visibleRows(
  rows: readonly PageRow[],
  options: {
    expanded: ReadonlySet<string>;
    filter: Filter;
    query: string;
  },
): VisibleRows {
  const byKey = new Map(rows.map((row) => [row.key, row]));
  const narrowed = options.filter !== "all" || options.query.trim() !== "";
  if (!narrowed) {
    const shown = rows.filter((row) => {
      for (
        let parent = row.parentKey ? byKey.get(row.parentKey) : undefined;
        parent;
        parent = parent.parentKey ? byKey.get(parent.parentKey) : undefined
      ) {
        if (!options.expanded.has(parent.key)) return false;
      }
      return true;
    });
    return { rows: shown, context: new Set() };
  }
  const matched = new Set(
    rows
      .filter(
        (row) =>
          matchesFilter(row, options.filter) &&
          matchesQuery(row, options.query),
      )
      .map(({ key }) => key),
  );
  const keep = new Set(matched);
  for (const key of matched) {
    for (
      let parent = byKey.get(key)?.parentKey;
      parent;
      parent = byKey.get(parent)?.parentKey
    ) {
      keep.add(parent);
    }
  }
  return {
    rows: rows.filter(({ key }) => keep.has(key)),
    context: new Set([...keep].filter((key) => !matched.has(key))),
  };
}

export type FilterCounts = Record<Filter, number>;

export function filterCounts(
  rows: readonly Pick<PageRow, "status">[],
  trashed: number,
): FilterCounts {
  const counts: FilterCounts = {
    all: rows.length,
    draft: 0,
    published: 0,
    changed: 0,
    trash: trashed,
  };
  for (const { status } of rows) {
    if (status === "draft" || status === "published" || status === "changed") {
      counts[status] += 1;
    }
  }
  return counts;
}

export function footerText(
  rows: readonly Pick<PageRow, "shared">[],
  company: string | undefined,
): string {
  const shared = rows.filter((row) => row.shared).length;
  const own = rows.length - shared;
  const noun = rows.length === 1 ? "page" : "pages";
  return `${rows.length} ${noun} · ${own} ${company ?? "this company"}, ${shared} shared`;
}

export function parentKeys(
  rows: readonly Pick<PageRow, "key" | "hasChildren">[],
) {
  return rows.filter(({ hasChildren }) => hasChildren).map(({ key }) => key);
}

export type Viewer = { superAdmin: boolean; canEdit: boolean };

export type RowActions = {
  menu: boolean;
  locked: boolean;
  addChild: boolean;
  preview: boolean;
  unpublish: boolean;
  trash: boolean;
};

export function rowActions(
  row: Pick<PageRow, "shared" | "status">,
  viewer: Viewer,
): RowActions {
  const allowed = viewer.canEdit && (!row.shared || viewer.superAdmin);
  return {
    menu: allowed,
    locked: row.shared && !viewer.superAdmin,
    addChild: allowed,
    preview: false,
    unpublish:
      allowed && (row.status === "published" || row.status === "changed"),
    trash: allowed,
  };
}

export function trashActions(
  row: Pick<TrashRow, "shared">,
  viewer: Viewer,
): { restore: boolean; remove: boolean } {
  return {
    restore: viewer.canEdit && (!row.shared || viewer.superAdmin),
    remove: viewer.superAdmin,
  };
}

export function canCreatePage(viewer: Viewer): boolean {
  return viewer.canEdit;
}

export function addChildPath(
  row: Pick<PageRow, "collection" | "id">,
): `/${string}` {
  return `/collections/${row.collection}/create?parent=${encodeURIComponent(String(row.id))}`;
}

export const VIEWER_BANNER = (initials: string) =>
  `You can view this page. Editors of ${initials} can change it.`;

export const EMPTY_TITLE = (company: string) => `No pages for ${company} yet`;

export const EMPTY_TEXT =
  "Home and Products & Solutions are shared and already live here.";

const SAVED_DAY = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "Asia/Jakarta",
});

const SAVED_TIME = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
  timeZone: "Asia/Jakarta",
});

const DAY_KEY = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jakarta" });

export function savedText(
  value: string | null | undefined,
  now: Date = new Date(),
  dateOnly = false,
): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  if (dateOnly) return SAVED_DAY.format(date).replace("Sept", "Sep");
  const day = DAY_KEY.format(date);
  if (day === DAY_KEY.format(now)) return `Today, ${SAVED_TIME.format(date)}`;
  if (day === DAY_KEY.format(new Date(now.getTime() - 86_400_000))) {
    return `Yesterday, ${SAVED_TIME.format(date)}`;
  }
  return SAVED_DAY.format(date).replace("Sept", "Sep");
}
