import type { CollectionConfig, Config, Field } from "payload";

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
