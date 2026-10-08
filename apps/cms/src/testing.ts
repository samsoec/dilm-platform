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

export function fieldNames(fields: Field[]): string[] {
  return fields.flatMap((field) => [
    ...("name" in field ? [field.name] : []),
    ...("fields" in field ? fieldNames(field.fields) : []),
  ]);
}

export function findField(fields: Field[], name: string): Field {
  for (const candidate of fields) {
    if ("name" in candidate && candidate.name === name) return candidate;
    if ("fields" in candidate && !("name" in candidate)) {
      const found = findField(candidate.fields, name);
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
