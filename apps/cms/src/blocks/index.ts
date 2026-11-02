import type { Block, Field } from "payload";
import type { PageBlockGroup } from "@dilm/shared-types";

export type SectionBlockConfig = {
  slug: string;
  interfaceName: string;
  group: PageBlockGroup;
  label?: string;
  fields: Field[];
};

export function sectionBlock({
  group,
  label,
  ...block
}: SectionBlockConfig): Block {
  return {
    ...block,
    ...(label ? { labels: { singular: label, plural: `${label}s` } } : {}),
    admin: { group },
  };
}

export const pageBlocks: Block[] = [];
