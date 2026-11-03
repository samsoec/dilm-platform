import type { Block, Field } from "payload";
import type { PageBlockGroup } from "@dilm/shared-types";

import { tableNamed } from "./factories";

export type BlockCatalog = {
  name: string;
  purpose: string;
  figma: readonly string[];
  summary: string;
};

export type SectionBlockConfig = {
  slug: string;
  interfaceName: string;
  group: PageBlockGroup;
  label?: string;
  tableName?: string;
  catalog?: BlockCatalog;
  fields: Field[];
};

export function sectionBlock({
  group,
  label,
  catalog,
  tableName,
  ...block
}: SectionBlockConfig): Block {
  const singular = catalog?.name ?? label;
  return {
    ...block,
    ...(tableName ? { dbName: tableNamed(tableName) } : {}),
    ...(singular
      ? {
          labels: {
            singular,
            plural: catalog ? singular : `${singular}s`,
          },
        }
      : {}),
    admin: {
      group,
      ...(catalog ? { custom: { catalog: { ...catalog } } } : {}),
    },
  };
}
