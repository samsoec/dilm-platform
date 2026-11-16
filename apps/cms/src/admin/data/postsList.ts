import type { Payload, TypedUser } from "payload";

import { localization } from "../../localization";
import {
  getPublishStatus,
  type PublishStatus,
} from "../components/kit/publication";
import {
  categoryCounts,
  postsWhere,
  type PostsQuery,
} from "../components/posts/posts";
import { loadCompany } from "./jobsList";
import { CATALOG_LIMIT } from "./productsCatalog";

export type PostRow = {
  id: string;
  title: string;
  category: string;
  cover: { url: string; alt: string } | undefined;
  publishedAt: string | null;
  status: PublishStatus;
};

export type PostChip = { id: string; name: string; count: number };

export type PublicationState = {
  state: "unset" | "set";
  settingsID: string | undefined;
};

export type PostsData = {
  rows: PostRow[];
  chips: PostChip[];
  total: number;
  all: number;
  truncated: boolean;
  company: { name: string; domain: string };
  publication: PublicationState;
};

export async function loadPublication(
  payload: Payload,
  user: TypedUser,
  tenant: number | string,
): Promise<PublicationState> {
  const { docs } = await payload.find({
    collection: "tenant-settings",
    where: { tenant: { equals: tenant } },
    select: { routing: true },
    limit: 1,
    depth: 0,
    overrideAccess: false,
    user,
  });
  const set = Boolean(docs[0]?.routing?.publicationPage);
  return {
    state: set ? "set" : "unset",
    settingsID: docs[0] ? String(docs[0].id) : undefined,
  };
}

type CoverDoc = {
  url?: string | null;
  alt?: string | null;
  sizes?: { thumbnail?: { url?: string | null } | null } | null;
};

function coverOf(value: unknown): PostRow["cover"] {
  if (!value || typeof value !== "object") return undefined;
  const media = value as CoverDoc;
  const url = media.sizes?.thumbnail?.url || media.url;
  return url ? { url, alt: media.alt ?? "" } : undefined;
}

export async function loadPosts(
  payload: Payload,
  user: TypedUser,
  tenant: number | string,
  query: PostsQuery,
  locale: "en" | "id" = localization.defaultLocale,
): Promise<PostsData> {
  const common = {
    collection: "posts" as const,
    draft: true,
    depth: 0,
    locale,
    fallbackLocale: localization.defaultLocale,
  };
  const [live, company, publication, categories, found, forCounts] =
    await Promise.all([
      payload.find({
        collection: "posts",
        where: {
          and: [
            { tenant: { equals: tenant } },
            { _status: { equals: "published" } },
          ],
        },
        draft: false,
        pagination: false,
        depth: 0,
        select: { _status: true },
        overrideAccess: false,
        user,
      }),
      loadCompany(payload, user, tenant),
      loadPublication(payload, user, tenant),
      payload.find({
        collection: "categories",
        locale,
        fallbackLocale: localization.defaultLocale,
        select: { name: true },
        sort: "id",
        pagination: false,
        depth: 0,
        overrideAccess: false,
        user,
      }),
      payload.find({
        ...common,
        overrideAccess: false,
        user,
        where: postsWhere(query, { tenant }),
        sort: "-publishedAt",
        limit: CATALOG_LIMIT,
        select: {
          title: true,
          primaryCategory: true,
          coverImage: true,
          publishedAt: true,
          _status: true,
        },
      }),
      payload.find({
        ...common,
        overrideAccess: false,
        user,
        where: postsWhere(query, { tenant, skipCategory: true }),
        pagination: false,
        select: { primaryCategory: true },
      }),
    ]);
  const publishedSet = new Set(live.docs.map(({ id }) => String(id)));
  const names = new Map(
    categories.docs.map((category) => [
      String(category.id),
      category.name ?? "",
    ]),
  );
  const idOf = (value: unknown): string => {
    if (value === null || value === undefined) return "";
    return String(
      typeof value === "object" ? (value as { id: number | string }).id : value,
    );
  };
  const counts = categoryCounts(
    forCounts.docs.map((post) => ({ category: idOf(post.primaryCategory) })),
  );
  const coverDepth =
    found.docs.length > 0
      ? await payload.find({
          collection: "media",
          where: {
            id: {
              in: found.docs
                .map((post) => idOf(post.coverImage))
                .filter(Boolean),
            },
          },
          pagination: false,
          depth: 0,
          select: { url: true, alt: true, sizes: true },
          overrideAccess: false,
          user,
        })
      : { docs: [] };
  const covers = new Map(
    coverDepth.docs.map((media) => [String(media.id), coverOf(media)]),
  );
  return {
    rows: found.docs.map((post): PostRow => {
      const category = idOf(post.primaryCategory);
      return {
        id: String(post.id),
        title: post.title ?? "",
        category: names.get(category) ?? "",
        cover: covers.get(idOf(post.coverImage)),
        publishedAt: post.publishedAt ?? null,
        status: getPublishStatus(
          { _status: post._status },
          { hasPublishedVersion: publishedSet.has(String(post.id)) },
        ),
      };
    }),
    chips: categories.docs.map((category) => ({
      id: String(category.id),
      name: category.name ?? "",
      count: counts[String(category.id)] ?? 0,
    })),
    total: found.totalDocs,
    all: forCounts.docs.length,
    truncated: found.totalDocs > CATALOG_LIMIT,
    company,
    publication,
  };
}
