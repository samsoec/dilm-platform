import type { Block } from "payload";

import { pageBlocks } from "../blocks";
import { extractRefs } from "../routeIndex";

export function blockLabel(block: Block | undefined, slug: string): string {
  const singular = block?.labels?.singular;
  return typeof singular === "string" ? singular : slug;
}

export function sectionsReferencing(
  layout: unknown,
  key: string,
  blocks: readonly Block[] = pageBlocks,
): string[] {
  if (!Array.isArray(layout)) return [];
  const found: string[] = [];
  for (const row of layout) {
    if (!row || typeof row !== "object") continue;
    if (!extractRefs([row], blocks).includes(key)) continue;
    const slug = String((row as { blockType?: unknown }).blockType ?? "");
    const label = blockLabel(
      blocks.find((block) => block.slug === slug),
      slug,
    );
    if (!found.includes(label)) found.push(label);
  }
  return found;
}
