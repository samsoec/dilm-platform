import { formatAdminURL } from "payload/shared";

import type { IconName } from "../../icons";
import { labelText } from "../../labelText";
import type { CollectionNav } from "../../navGroups";
import type { NavSection } from "../nav/sections";

export const SEARCH_DEBOUNCE_MS = 250;
export const SEARCH_LIMIT = 5;
export const TENANT_FIELD = "tenant";

export const SEARCH_FIELDS: Readonly<Record<string, readonly string[]>> = {
  "tenant-settings": ["siteName"],
  "cv-submissions": ["applicantName"],
  "ir-documents": ["title"],
  media: ["filename", "alt"],
};

export type PaletteEntry = {
  key: string;
  label: string;
  detail?: string;
  href: string;
  icon: IconName;
};

export type SearchSource = {
  slug: string;
  label: string;
  icon: IconName;
  fields: readonly string[];
};

export type TenantID = number | string;

type CollectionLike = {
  slug: string;
  labels?: { plural?: unknown };
  custom?: Record<string, unknown>;
};

const DEFAULT_SOURCE_ICON: IconName = "article";

export function jumpEntries(
  sections: NavSection[],
  adminRoute: string,
): PaletteEntry[] {
  return [
    {
      key: "dashboard",
      label: "Dashboard",
      href: formatAdminURL({ adminRoute, path: "" }),
      icon: "space_dashboard",
    },
    ...sections.flatMap(({ label, items }) =>
      items.map((item) => ({
        key: item.slug,
        label: item.label,
        detail: label,
        href: item.href,
        icon: item.icon,
      })),
    ),
    {
      key: "account",
      label: "Account",
      href: formatAdminURL({ adminRoute, path: "/account" }),
      icon: "person_check",
    },
  ];
}

export function searchSources(
  collections: readonly CollectionLike[],
  canRead: (slug: string) => boolean,
  language: string,
): SearchSource[] {
  return Object.entries(SEARCH_FIELDS).flatMap(([slug, fields]) => {
    const collection = collections.find((candidate) => candidate.slug === slug);
    if (!collection || !canRead(slug)) return [];
    const nav = collection.custom?.nav as CollectionNav | undefined;
    return [
      {
        slug,
        label: labelText(collection.labels?.plural, language) || slug,
        icon: nav?.icon ?? DEFAULT_SOURCE_ICON,
        fields,
      },
    ];
  });
}

export function matchesQuery(texts: (string | undefined)[], query: string) {
  const haystack = texts.join(" ").toLowerCase();
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((word) => haystack.includes(word));
}

export function filterEntries(
  entries: PaletteEntry[],
  query: string,
): PaletteEntry[] {
  if (!query.trim()) return entries;
  return entries.filter(({ label, detail }) =>
    matchesQuery([label, detail], query),
  );
}

export function searchURL({
  apiURL,
  source,
  query,
  tenant,
  locale,
}: {
  apiURL: string;
  source: SearchSource;
  query: string;
  tenant: TenantID;
  locale?: string;
}): string {
  const params = new URLSearchParams({
    depth: "0",
    limit: String(SEARCH_LIMIT),
    pagination: "false",
  });
  if (locale) params.set("locale", locale);
  for (const field of source.fields) params.set(`select[${field}]`, "true");
  params.set(`where[and][0][${TENANT_FIELD}][equals]`, String(tenant));
  source.fields.forEach((field, index) => {
    params.set(`where[and][1][or][${index}][${field}][like]`, query);
  });
  return `${apiURL.replace(/\/+$/, "")}/${source.slug}?${params}`;
}

export type FoundDoc = { id: number | string } & Record<string, unknown>;

export function documentEntries(
  source: SearchSource,
  docs: FoundDoc[],
  adminRoute: string,
): PaletteEntry[] {
  const [titleField, ...detailFields] = source.fields;
  const text = (doc: FoundDoc, field: string) => {
    const value = doc[field];
    return typeof value === "string" && value.trim() ? value : undefined;
  };
  return docs.map((doc) => ({
    key: `${source.slug}:${doc.id}`,
    label: text(doc, titleField) ?? `#${doc.id}`,
    detail: detailFields.map((field) => text(doc, field)).find(Boolean),
    href: formatAdminURL({
      adminRoute,
      path: `/collections/${source.slug}/${encodeURIComponent(String(doc.id))}`,
    }),
    icon: source.icon,
  }));
}

export function isPaletteShortcut(event: {
  key: string;
  metaKey: boolean;
  ctrlKey: boolean;
  altKey: boolean;
  shiftKey: boolean;
}): boolean {
  return (
    event.key.toLowerCase() === "k" &&
    (event.metaKey || event.ctrlKey) &&
    !event.altKey &&
    !event.shiftKey
  );
}

export function shortcutLabel(platform: string): string {
  return /mac|iphone|ipad|ipod/i.test(platform) ? "⌘K" : "Ctrl K";
}
