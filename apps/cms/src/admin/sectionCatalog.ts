import { MAX_LAYOUT_BLOCKS, PAGE_BLOCK_GROUPS } from "@dilm/shared-types";

import { positionText } from "./sectionRows";

export type CatalogEntry = {
  slug: string;
  group: string;
  name: string;
  purpose: string;
  figma: readonly string[];
  recordTypes: readonly string[];
};

export type ClientBlockLike = {
  slug: string;
  labels?: { singular?: unknown } | null;
  admin?: { group?: string; custom?: Record<string, unknown> } | null;
};

export const CATALOG_LIMIT_TEXT = `${MAX_LAYOUT_BLOCKS} of ${MAX_LAYOUT_BLOCKS} sections. A page holds at most ${MAX_LAYOUT_BLOCKS} to stay fast; remove or combine one to add another. Duplicate is also unavailable.`;

export function atSectionLimit(count: number, max?: number): boolean {
  return count >= (max ?? MAX_LAYOUT_BLOCKS);
}

export function catalogEntries(
  blocks: readonly ClientBlockLike[],
): CatalogEntry[] {
  return blocks.map((block) => {
    const custom = block.admin?.custom ?? {};
    const catalog = (custom.catalog ?? {}) as {
      name?: string;
      purpose?: string;
      figma?: string[];
    };
    const singular = block.labels?.singular;
    return {
      slug: block.slug,
      group: block.admin?.group ?? "Content",
      name:
        catalog.name ?? (typeof singular === "string" ? singular : block.slug),
      purpose: catalog.purpose ?? "",
      figma: catalog.figma ?? [],
      recordTypes: (custom.recordTypes as string[] | undefined) ?? [],
    };
  });
}

export function groupCounts(entries: readonly CatalogEntry[]) {
  return PAGE_BLOCK_GROUPS.map((group) => ({
    group: group as string,
    count: entries.filter((entry) => entry.group === group).length,
  })).filter(({ count }) => count > 0);
}

export function templateOnlyText(entry: CatalogEntry): string | null {
  if (entry.recordTypes.length === 0) return null;
  return `Works on detail templates only · ${entry.recordTypes.join(", ")}`;
}

export function insertHeading(
  index: number,
  names: readonly (string | undefined)[],
): string {
  if (index <= 0) return "Inserting at the top";
  const before = names[index - 1];
  return `Inserting after ${positionText(index - 1)}${before ? ` · ${before}` : ""}`;
}

function norm(value: string): string {
  return value.trim().toLowerCase();
}

export type CatalogMatch = {
  entry: CatalogEntry;
  figmaMatch: string | null;
};

export function searchCatalog(
  entries: readonly CatalogEntry[],
  query: string,
  group: string | null,
): CatalogMatch[] {
  const needle = norm(query);
  const pool = group
    ? entries.filter((entry) => entry.group === group)
    : entries;
  if (!needle) return pool.map((entry) => ({ entry, figmaMatch: null }));
  const result: CatalogMatch[] = [];
  for (const entry of pool) {
    const direct =
      norm(entry.name).includes(needle) || norm(entry.slug).includes(needle);
    const figma = entry.figma.find((name) => norm(name).includes(needle));
    if (direct) result.push({ entry, figmaMatch: null });
    else if (figma) result.push({ entry, figmaMatch: figma });
  }
  return result;
}

export function matchLine(match: CatalogMatch): string | null {
  return match.figmaMatch ? `Matches Figma ${match.figmaMatch}` : null;
}

const SYNONYMS: Record<string, string[]> = {
  slider: ["carousel"],
  slideshow: ["carousel"],
  banner: ["cta", "hero"],
  faq: ["text"],
  gallery: ["carousel", "gallery"],
};

export function suggestAlternatives(
  entries: readonly CatalogEntry[],
  query: string,
): string[] {
  const needle = norm(query);
  const words = [needle, ...(SYNONYMS[needle] ?? [])];
  const found = entries.filter((entry) =>
    words.some((word) => norm(entry.name).includes(word)),
  );
  const pool = found.length > 0 ? found : entries;
  return pool.slice(0, 2).map((entry) => entry.name);
}

export function noResultText(
  entries: readonly CatalogEntry[],
  query: string,
): string {
  const names = suggestAlternatives(entries, query);
  const tail = names.length > 1 ? ` Try ${names[0]} or ${names[1]}.` : "";
  return `No section matches "${query.trim()}".${tail}`;
}

export function stepIndex(key: string, current: number, total: number) {
  if (total === 0) return -1;
  if (key === "ArrowDown" || key === "ArrowRight") {
    return Math.min(current + 1, total - 1);
  }
  if (key === "ArrowUp" || key === "ArrowLeft") return Math.max(current - 1, 0);
  if (key === "Home") return 0;
  if (key === "End") return total - 1;
  return null;
}
