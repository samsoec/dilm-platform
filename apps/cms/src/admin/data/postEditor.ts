import type { Payload, TypedUser } from "payload";

import { localization } from "../../localization";
import { blockLabel } from "../../publish/usedInSections";
import { relationId, type ParentPaths } from "../components/editor/urls";
import {
  getPublishStatus,
  type PublishStatus,
} from "../components/kit/publication";
import type { LatestSection } from "../components/posts/posts";
import { peopleNames } from "./pagesTree";
import { loadCompany } from "./jobsList";
import { loadPublication } from "./postsList";

export type PostEditorData = {
  status: PublishStatus;
  domain: string;
  slugs: Record<string, string>;
  categoryPaths: Record<string, ParentPaths>;
  categoryNames: Record<string, string>;
  categoryDescriptions: Record<string, string>;
  sections: LatestSection[];
  publicationSet: boolean;
  liveSince: string | null;
  savedAt: string | null;
  savedBy: string | null;
  versions: number;
};

export const blankPostEditor: PostEditorData = {
  status: "draft",
  domain: "",
  slugs: {},
  categoryPaths: {},
  categoryNames: {},
  categoryDescriptions: {},
  sections: [],
  publicationSet: true,
  liveSince: null,
  savedAt: null,
  savedBy: null,
  versions: 1,
};

type LayoutRow = {
  id?: string;
  blockType?: string;
  source?: string | null;
  categories?: (number | string | { id: number | string })[] | null;
  heading?: { title?: unknown } | null;
};

type PageDoc = {
  id: number | string;
  title?: string | null;
  tenant?: number | string | { id: number | string } | null;
  layout?: LayoutRow[] | null;
};

export async function loadLatestSections(
  payload: Payload,
  user: TypedUser,
  tenant: number | string,
  tenants: { id: number | string; name?: string | null }[],
  locale: string,
): Promise<LatestSection[]> {
  const read = async (collection: "pages" | "shared-pages", where: object) =>
    (
      await payload.find({
        collection,
        where: {
          and: [
            { _status: { equals: "published" } },
            { "layout.blockType": { equals: "postShowcase" } },
            where,
          ],
        } as never,
        draft: false,
        pagination: false,
        depth: 0,
        locale: locale as "en",
        fallbackLocale: localization.defaultLocale as "en",
        select: { title: true, tenant: true, layout: true },
        overrideAccess: false,
        user,
      })
    ).docs as unknown as PageDoc[];
  const [own, shared] = await Promise.all([
    read("pages", { tenant: { equals: tenant } }),
    read("shared-pages", {}),
  ]);
  const allSites = tenants.map(({ name }) => name ?? "").filter(Boolean);
  const company =
    tenants.find(({ id }) => String(id) === String(tenant))?.name ?? "";
  const merged = new Map<string, LatestSection>();
  const add = (page: PageDoc, sites: string[]) => {
    for (const row of page.layout ?? []) {
      if (row.blockType !== "postShowcase" || row.source !== "latest") {
        continue;
      }
      const title = row.heading?.title;
      const section =
        typeof title === "string" && title.trim()
          ? title.trim()
          : blockLabel(undefined, "Post showcase");
      const pageTitle = page.title?.trim() || "Untitled page";
      const key = `${pageTitle}›${section}`;
      const categories = (row.categories ?? [])
        .map((entry) => String(relationId(entry as never) ?? ""))
        .filter(Boolean);
      const known = merged.get(key);
      merged.set(key, {
        key,
        page: pageTitle,
        section,
        categories: known
          ? known.categories.length === 0 || categories.length === 0
            ? []
            : [...new Set([...known.categories, ...categories])]
          : categories,
        sites: [...new Set([...(known?.sites ?? []), ...sites])],
      });
    }
  };
  for (const page of own) add(page, company ? [company] : []);
  for (const page of shared) add(page, allSites);
  return [...merged.values()];
}

export async function loadPostEditor(
  payload: Payload,
  user: TypedUser,
  id: string | undefined,
  selected: number | string | undefined,
  locale: string,
): Promise<PostEditorData> {
  let tenant: number | string | undefined = selected;
  let status: PublishStatus = "draft";
  let slugs: Record<string, string> = {};
  let liveSince: string | null = null;
  let savedAt: string | null = null;
  let savedBy: string | null = null;
  let versions = 1;
  if (id !== undefined) {
    const [doc, stored] = await Promise.all([
      payload.findByID({
        collection: "posts",
        id,
        draft: true,
        depth: 0,
        trash: true,
        overrideAccess: false,
        user,
      }),
      payload.findByID({
        collection: "posts",
        id,
        draft: true,
        depth: 0,
        locale: "all",
        fallbackLocale: false,
        select: { slug: true },
        trash: true,
        overrideAccess: false,
        user,
      }),
    ]);
    tenant = relationId(doc.tenant as never) ?? tenant;
    const raw = (stored as { slug?: unknown }).slug;
    slugs =
      typeof raw === "string"
        ? { [localization.defaultLocale]: raw }
        : Object.fromEntries(
            Object.entries((raw ?? {}) as Record<string, unknown>).filter(
              (entry): entry is [string, string] =>
                typeof entry[1] === "string",
            ),
          );
    const [live, count] = await Promise.all([
      payload.findVersions({
        collection: "posts",
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
        collection: "posts",
        where: { parent: { equals: id } },
        overrideAccess: false,
        user,
      }),
    ]);
    status = getPublishStatus(
      { _status: doc._status, deletedAt: doc.deletedAt },
      { hasPublishedVersion: live.totalDocs > 0 },
    );
    liveSince = live.docs[0]?.updatedAt ?? null;
    savedAt = doc.updatedAt ?? null;
    const saver = relationId(doc.updatedBy as never);
    savedBy = saver
      ? ((await peopleNames({ payload, user }, [saver])).get(saver) ?? null)
      : null;
    versions = Math.max(count.totalDocs, 1);
  }
  const { docs: categories } = await payload.find({
    collection: "categories",
    locale: "all",
    fallbackLocale: false,
    select: { name: true, path: true, description: true },
    sort: "id",
    pagination: false,
    depth: 0,
    overrideAccess: false,
    user,
  });
  const defaultLocale = localization.defaultLocale;
  const pick = (value: unknown): Record<string, string> =>
    typeof value === "string"
      ? { [defaultLocale]: value }
      : Object.fromEntries(
          Object.entries((value ?? {}) as Record<string, unknown>).filter(
            (entry): entry is [string, string] => typeof entry[1] === "string",
          ),
        );
  const categoryPaths: Record<string, ParentPaths> = {};
  const categoryNames: Record<string, string> = {};
  const categoryDescriptions: Record<string, string> = {};
  for (const category of categories as unknown as {
    id: number | string;
    name?: unknown;
    path?: unknown;
    description?: unknown;
  }[]) {
    categoryPaths[String(category.id)] = pick(category.path);
    const names = pick(category.name);
    categoryNames[String(category.id)] =
      names[locale] || names[defaultLocale] || "";
    const descriptions = pick(category.description);
    categoryDescriptions[String(category.id)] =
      descriptions[locale] || descriptions[defaultLocale] || "";
  }
  if (tenant === undefined) {
    return {
      ...blankPostEditor,
      status,
      slugs,
      categoryPaths,
      categoryNames,
      categoryDescriptions,
      liveSince,
      savedAt,
      savedBy,
      versions,
    };
  }
  const { docs: tenants } = await payload.find({
    collection: "tenants",
    select: { name: true, domain: true },
    sort: "id",
    pagination: false,
    depth: 0,
    overrideAccess: false,
    user,
  });
  const [company, publication, sections] = await Promise.all([
    loadCompany(payload, user, tenant),
    loadPublication(payload, user, tenant),
    loadLatestSections(payload, user, tenant, tenants, locale),
  ]);
  return {
    status,
    domain: company.domain,
    slugs,
    categoryPaths,
    categoryNames,
    categoryDescriptions,
    sections,
    publicationSet: publication.state === "set",
    liveSince,
    savedAt,
    savedBy,
    versions,
  };
}
