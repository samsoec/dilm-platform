import type {
  CollectionBeforeChangeHook,
  CollectionConfig,
  RelationshipField,
} from "payload";

import { systemManagedField } from "../access";

export const updatedByField: RelationshipField = {
  name: "updatedBy",
  label: "Saved by",
  type: "relationship",
  relationTo: "users",
  access: systemManagedField,
  admin: { position: "sidebar", readOnly: true },
};

export const stampUpdatedBy: CollectionBeforeChangeHook = ({ data, req }) =>
  req.user ? { ...data, updatedBy: req.user.id } : data;

export function withUpdatedBy(collection: CollectionConfig): CollectionConfig {
  return {
    ...collection,
    hooks: {
      ...collection.hooks,
      beforeChange: [...(collection.hooks?.beforeChange ?? []), stampUpdatedBy],
    },
    fields: [...collection.fields, updatedByField],
  };
}
