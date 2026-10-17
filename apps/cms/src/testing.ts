import type { AccessArgs, CollectionConfig, Config, Field } from "payload";

import type { Role } from "./access";
import { multiTenant } from "./tenancy";

export async function applyMultiTenant(collections: CollectionConfig[]) {
  const copies = collections.map((collection) => ({
    ...collection,
    access: { ...collection.access },
    admin: { ...collection.admin },
    fields: [...collection.fields],
  }));
  const config = await multiTenant(copies)({
    admin: { user: "users" },
    collections: copies,
  } as Config);
  return (slug: string) =>
    config.collections!.find((collection) => collection.slug === slug)!;
}

export function childFields(field: Field): Field[] {
  if ("fields" in field) return field.fields;
  if (field.type === "tabs") return field.tabs.flatMap((tab) => tab.fields);
  return [];
}

export function fieldNames(fields: Field[]): string[] {
  return fields.flatMap((field) => [
    ...("name" in field ? [field.name] : []),
    ...fieldNames(childFields(field)),
  ]);
}

export function findField(fields: Field[], name: string): Field {
  for (const candidate of fields) {
    if ("name" in candidate && candidate.name === name) return candidate;
    if (!("name" in candidate)) {
      const found = findField(childFields(candidate), name);
      if (found) return found;
    }
  }
  return undefined as unknown as Field;
}

export function subfields(field: Field): Field[] {
  return (field as { fields: Field[] }).fields;
}

export function testUser(roles: Role[], tenantIds: number[] = []) {
  return {
    id: 99,
    collection: "users",
    roles,
    tenants: tenantIds.map((tenant) => ({ tenant })),
  };
}

export function accessAs(
  collection: CollectionConfig,
  key: "read" | "create" | "update" | "delete",
  user: object | null,
) {
  return collection.access![key]!({ req: { user } } as AccessArgs);
}
