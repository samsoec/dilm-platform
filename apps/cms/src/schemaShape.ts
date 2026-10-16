import type { Field } from "payload";

const SHAPE_KEYS = [
  "localized",
  "required",
  "unique",
  "index",
  "hasMany",
  "relationTo",
  "minRows",
  "maxRows",
  "min",
  "max",
] as const;

function optionValues(field: Field): string | undefined {
  if (!("options" in field) || !Array.isArray(field.options)) return undefined;
  return field.options
    .map((option) => (typeof option === "string" ? option : option.value))
    .join("|");
}

function describe(field: Field & { name: string }, path: string): string {
  const flags = SHAPE_KEYS.flatMap((key) => {
    const value = (field as Record<string, unknown>)[key];
    return value === undefined || value === false ? [] : [`${key}=${value}`];
  });
  const options = optionValues(field);
  return [
    `${path}: ${field.type}`,
    ...flags,
    ...(options ? [`options=${options}`] : []),
  ].join(" ");
}

export function schemaShape(fields: Field[], prefix = ""): string[] {
  return fields.flatMap((field): string[] => {
    if (field.type === "ui") return [];
    if (field.type === "tabs") {
      return field.tabs.flatMap((tab) =>
        "name" in tab && tab.name
          ? [
              `${prefix}${tab.name}: tab`,
              ...schemaShape(tab.fields, `${prefix}${tab.name}.`),
            ]
          : schemaShape(tab.fields, prefix),
      );
    }
    if (!("name" in field)) {
      return "fields" in field ? schemaShape(field.fields, prefix) : [];
    }
    const path = `${prefix}${field.name}`;
    const nested =
      "fields" in field ? schemaShape(field.fields, `${path}.`) : [];
    return [describe(field, path), ...nested];
  });
}
