import type { Block, Field } from "payload";
import type { DetailRecordType, PageBlockGroup } from "@dilm/shared-types";

import { tableNamed } from "./factories";

export function withSectionCounters(fields: Field[]): Field[] {
  return fields.map((field) => {
    let next = field;
    if ("fields" in next && Array.isArray(next.fields)) {
      next = { ...next, fields: withSectionCounters(next.fields) } as Field;
    }
    if ("tabs" in next && Array.isArray(next.tabs)) {
      next = {
        ...next,
        tabs: next.tabs.map((tab) => ({
          ...tab,
          fields: withSectionCounters(tab.fields),
        })),
      } as Field;
    }
    if (next.type !== "array" || !next.maxRows) return next;
    if (next.admin?.components?.Label) return next;
    return {
      ...next,
      admin: {
        ...next.admin,
        components: {
          ...next.admin?.components,
          Label: {
            path: "/admin/components/fields/ArrayCountLabel#ArrayCountLabel",
            clientProps: { inSection: true },
          },
        },
      },
    } as Field;
  });
}

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
  recordTypes?: readonly DetailRecordType[];
  fields: Field[];
};

export function sectionBlock({
  group,
  label,
  catalog,
  tableName,
  recordTypes,
  ...block
}: SectionBlockConfig): Block {
  const singular = catalog?.name ?? label;
  return {
    ...block,
    fields: withSectionCounters(block.fields),
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
      components: {
        Label: {
          path: "/admin/components/fields/SectionRowLabel#SectionRowLabel",
          clientProps: {
            name: singular ?? block.slug,
            slug: block.slug,
            record: Boolean(recordTypes),
          },
        },
      },
      ...(catalog || recordTypes
        ? {
            custom: {
              ...(catalog ? { catalog: { ...catalog } } : {}),
              ...(recordTypes ? { recordTypes: [...recordTypes] } : {}),
            },
          }
        : {}),
    },
  };
}
