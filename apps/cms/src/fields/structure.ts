import {
  APIError,
  type CollectionBeforeChangeHook,
  type Field,
  type FieldAccess,
} from "payload";

import { localization } from "../localization";

export function isDefaultLocale(locale: string | undefined | null): boolean {
  return !locale || locale === "all" || locale === localization.defaultLocale;
}

export const defaultLocaleOnly: FieldAccess = ({ req }) =>
  isDefaultLocale(req.locale);

function lockField(field: Field): Field {
  if (field.type === "ui") return field;
  if (field.type === "tabs") {
    return {
      ...field,
      tabs: field.tabs.map((tab) => ({
        ...tab,
        fields: lockStructure(tab.fields),
      })),
    };
  }
  if ("fields" in field) {
    return { ...field, fields: lockStructure(field.fields) } as Field;
  }
  if (!("name" in field) || ("localized" in field && field.localized)) {
    return field;
  }
  if (field.access?.update) {
    throw new Error(
      `${field.name} already has update access; combine it with defaultLocaleOnly by hand.`,
    );
  }
  return {
    ...field,
    access: { ...field.access, update: defaultLocaleOnly },
  } as Field;
}

export function lockStructure(fields: Field[]): Field[] {
  return fields.map(lockField);
}

type RowTree = { id: unknown; children: Record<string, RowTree> }[];

function rowTree(value: unknown): Record<string, RowTree> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.fromEntries(
    Object.entries(value).flatMap(([key, child]) => {
      if (Array.isArray(child)) {
        const rows = child.filter(
          (row): row is Record<string, unknown> =>
            Boolean(row) && typeof row === "object",
        );
        return [
          [key, rows.map((row) => ({ id: row.id, children: rowTree(row) }))],
        ];
      }
      return Object.entries(rowTree(child)).map(([nested, tree]) => [
        `${key}.${nested}`,
        tree,
      ]);
    }),
  );
}

export function changedRowStructure(
  data: Record<string, unknown>,
  original: Record<string, unknown> | undefined,
): string[] {
  const before = rowTree(original);
  return Object.entries(rowTree(data))
    .filter(
      ([path, rows]) =>
        JSON.stringify(rows) !== JSON.stringify(before[path] ?? []),
    )
    .map(([path]) => path);
}

export const keepRowStructure: CollectionBeforeChangeHook = ({
  data,
  operation,
  originalDoc,
  req,
}) => {
  if (operation !== "update" || isDefaultLocale(req.locale)) return data;
  const changed = changedRowStructure(data, originalDoc);
  if (changed.length > 0) {
    throw new APIError(
      `Rows can only be added, removed or reordered in English (${changed.join(", ")}). Switch the content language to EN.`,
      400,
      undefined,
      true,
    );
  }
  return data;
};
