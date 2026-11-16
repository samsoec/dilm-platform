import type { Where } from "payload";

import { joinNames } from "../../../paths";
import type { SearchParams } from "../lists/statusQuery";

export const CATEGORY_PARAM = "category";
export const SEARCH_PARAM = "q";
export const SEARCH_MAX_LENGTH = 100;
export const EXCERPT_LIMIT = 160;

export const CATEGORY_HELP =
  "The post's address follows its category. Changing it moves the post and leaves a redirect from the old address.";

export const EXCERPT_OVERFLOW = "Cards cut it after 160 characters.";

export const PUBLICATION_PROMPT =
  'Choose your Publication page. Until it\'s set, the navbar search icon, the "All Updates" tab and post breadcrumbs have nowhere to go.';
export const PUBLICATION_PROMPT_ACTION = "Open Company settings";

export const HAND_PICK_NOTE =
  "Once published, it can be hand-picked into Sustainability › Our approach or Our impact stories.";

export const WILL_APPEAR_TITLE = "Will appear in";
export const WILL_APPEAR_NONE = "No section picks the latest posts yet.";

export type PostsQuery = {
  category: string;
  search: string;
};

function first(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value) ?? "";
}

export function parsePostsQuery(
  searchParams: SearchParams | undefined,
): PostsQuery {
  const params = searchParams ?? {};
  return {
    category: first(params[CATEGORY_PARAM]).trim().slice(0, SEARCH_MAX_LENGTH),
    search: first(params[SEARCH_PARAM]).trim().slice(0, SEARCH_MAX_LENGTH),
  };
}

export function postsHref(
  pathname: string,
  query: Partial<PostsQuery>,
): string {
  const params = new URLSearchParams();
  if (query.category) params.set(CATEGORY_PARAM, query.category);
  if (query.search) params.set(SEARCH_PARAM, query.search);
  const text = params.toString();
  return text ? `${pathname}?${text}` : pathname;
}

export function postsWhere(
  query: PostsQuery,
  {
    tenant,
    skipCategory = false,
  }: { tenant: number | string; skipCategory?: boolean },
): Where {
  const clauses: Where[] = [{ tenant: { equals: tenant } }];
  if (query.search) clauses.push({ title: { like: query.search } });
  if (query.category && !skipCategory) {
    clauses.push({ primaryCategory: { equals: query.category } });
  }
  return { and: clauses };
}

export function categoryCounts(
  posts: readonly { category: string }[],
): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const { category } of posts) {
    if (category) counts[category] = (counts[category] ?? 0) + 1;
  }
  return counts;
}

export function postsText(count: number): string {
  return `${count} ${count === 1 ? "post" : "posts"}`;
}

const DAY = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "Asia/Jakarta",
});

export function dayText(value: string | null | undefined): string {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : DAY.format(date);
}

export type LatestSection = {
  key: string;
  page: string;
  section: string;
  categories: string[];
  sites: string[];
};

export type Placement = { key: string; text: string; note?: string };

export function placementsFor({
  category,
  categoryName,
  sections,
  publicationSet,
}: {
  category: string | undefined;
  categoryName: string | undefined;
  sections: readonly LatestSection[];
  publicationSet: boolean;
}): Placement[] {
  const note = publicationSet ? undefined : "Set a Publication page first";
  const rows: Placement[] = [
    { key: "all", text: "Publication › All Updates", note },
  ];
  if (category && categoryName) {
    rows.push({
      key: "category",
      text: `Publication › ${categoryName} tab`,
      note,
    });
  }
  for (const section of sections) {
    if (
      section.categories.length > 0 &&
      (!category || !section.categories.includes(category))
    ) {
      continue;
    }
    rows.push({
      key: section.key,
      text: `${section.page} › ${section.section}`,
      note:
        section.sites.length > 0 ? `on ${joinNames(section.sites)}` : undefined,
    });
  }
  return rows;
}
