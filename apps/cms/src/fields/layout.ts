import type { Block, BlocksField } from "payload";
import { MAX_LAYOUT_BLOCKS, PAGE_BLOCK_GROUPS } from "@dilm/shared-types";

import { pageBlocks } from "../blocks";

export function assertRegistry(blocks: readonly Block[]) {
  const slugs = new Set<string>();
  const interfaces = new Set<string>();
  for (const block of blocks) {
    const group = block.admin?.group;
    if (
      typeof group !== "string" ||
      !(PAGE_BLOCK_GROUPS as readonly string[]).includes(group)
    ) {
      throw new Error(`Block "${block.slug}" needs one of the catalog groups.`);
    }
    if (!block.interfaceName) {
      throw new Error(`Block "${block.slug}" needs an interfaceName.`);
    }
    if (slugs.has(block.slug) || interfaces.has(block.interfaceName)) {
      throw new Error(`Block "${block.slug}" is registered twice.`);
    }
    slugs.add(block.slug);
    interfaces.add(block.interfaceName);
  }
}

export const LAYOUT_EXCLUSIONS = {
  "shared-detail-templates": ["hotspotIllustration"],
} as const satisfies Record<string, readonly string[]>;

export function layoutBlocks(
  blocks: readonly Block[],
  exclude: readonly string[] = [],
): Block[] {
  const known = new Set(blocks.map(({ slug }) => slug));
  for (const slug of exclude) {
    if (!known.has(slug)) {
      throw new Error(`Cannot exclude unknown block "${slug}".`);
    }
  }
  return blocks.filter(({ slug }) => !exclude.includes(slug));
}

export function layoutField(
  blocks: readonly Block[] = pageBlocks,
  exclude: readonly string[] = [],
): BlocksField {
  assertRegistry(blocks);
  return {
    name: "layout",
    type: "blocks",
    minRows: 0,
    maxRows: MAX_LAYOUT_BLOCKS,
    blocks: layoutBlocks(blocks, exclude),
    admin: {
      description: `A page holds at most ${MAX_LAYOUT_BLOCKS} sections.`,
    },
  };
}
