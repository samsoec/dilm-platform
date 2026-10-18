import { formatAdminURL } from "payload/shared";

import type { IconName } from "../../icons";
import { labelText } from "../../labelText";
import type { CollectionNav } from "../../navGroups";
import type { NavSection } from "../nav/sections";

export const SEARCH_DEBOUNCE_MS = 250;
export const SEARCH_LIMIT = 5;
export const TENANT_FIELD = "tenant";

export type SourceFields = {
  match: readonly string[];
  extra?: readonly string[];
};

export const SEARCH_FIELDS: Readonly<Record<string, SourceFields>> = {
  "cv-submissions": { match: ["applicantName"] },
  "ir-documents": { match: ["title"], extra: ["locale"] },
  media: { match: ["filename", "alt"] },
  "tenant-settings": { match: ["siteName"] },
};

export type PaletteEntry = {
  key: string;
  label: string;
  href: string;
  icon: IconName;
  detail?: string;
  locale?: string;
  published?: boolean;
  thumbnail?: boolean;
  superAdmin?: boolean;
};

export type SearchSource = {
  slug: string;
  label: string;
  icon: IconName;
  fields: SourceFields;
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
    ...sections.flatMap(({ items, superAdminOnly }) =>
      items.map((item) => ({
        key: item.slug,
        label: item.label,
        href: item.href,
        icon: item.icon,
        superAdmin: superAdminOnly || undefined,
      })),
    ),
    {
      key: "account",
      label: "My account",
      href: formatAdminURL({ adminRoute, path: "/account" }),
      icon: "person",
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

function words(query: string): string[] {
  return query.toLowerCase().split(/\s+/).filter(Boolean);
}

export function matchesQuery(texts: (string | undefined)[], query: string) {
  const haystack = texts.join(" ").toLowerCase();
  return words(query).every((word) => haystack.includes(word));
}

export function filterEntries(
  entries: PaletteEntry[],
  query: string,
): PaletteEntry[] {
  if (!query.trim()) return entries;
  return entries.filter(({ label }) => matchesQuery([label], query));
}

export type Segment = { text: string; match: boolean };

export function highlight(text: string, query: string): Segment[] {
  const needles = words(query);
  if (needles.length === 0) return [{ text, match: false }];
  const lower = text.toLowerCase();
  const marked = new Array<boolean>(text.length).fill(false);
  for (const needle of needles) {
    let from = lower.indexOf(needle);
    while (from !== -1) {
      marked.fill(true, from, from + needle.length);
      from = lower.indexOf(needle, from + needle.length);
    }
  }
  const segments: Segment[] = [];
  for (let index = 0; index < text.length; index += 1) {
    const last = segments[segments.length - 1];
    if (last && last.match === marked[index]) last.text += text[index];
    else segments.push({ text: text[index], match: marked[index] });
  }
  return segments;
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
  for (const field of [...source.fields.match, ...(source.fields.extra ?? [])])
    params.set(`select[${field}]`, "true");
  params.set(`where[and][0][${TENANT_FIELD}][equals]`, String(tenant));
  source.fields.match.forEach((field, index) => {
    params.set(`where[and][1][or][${index}][${field}][like]`, query);
  });
  return `${apiURL.replace(/\/+$/, "")}/${source.slug}?${params}`;
}

export type FoundDoc = { id: number | string } & Record<string, unknown>;

function text(doc: FoundDoc, field: string): string | undefined {
  const value = doc[field];
  return typeof value === "string" && value.trim() ? value : undefined;
}

export function documentEntries(
  source: SearchSource,
  docs: FoundDoc[],
  adminRoute: string,
): PaletteEntry[] {
  const [titleField] = source.fields.match;
  return docs.map((doc) => {
    const entry: PaletteEntry = {
      key: `${source.slug}:${doc.id}`,
      label: text(doc, titleField) ?? `#${doc.id}`,
      href: formatAdminURL({
        adminRoute,
        path: `/collections/${source.slug}/${encodeURIComponent(String(doc.id))}`,
      }),
      icon: source.icon,
    };
    if (source.slug === "ir-documents") {
      entry.icon = "picture_as_pdf";
      entry.locale = text(doc, "locale");
      entry.published = true;
    }
    if (source.slug === "media") {
      entry.thumbnail = true;
      const alt = text(doc, "alt");
      if (alt) entry.detail = `alt: "${alt}"`;
    }
    return entry;
  });
}

export function companyCode(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 4)
    .toUpperCase();
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
