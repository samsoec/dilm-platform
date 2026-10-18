import type {
  CollectionBeforeChangeHook,
  CollectionConfig,
  RelationshipField,
} from "payload";

import { systemManagedField } from "../access";
import { stampsBy } from "./systemWrite";

export const updatedByField: RelationshipField = {
  name: "updatedBy",
  label: "Saved by",
  type: "relationship",
  relationTo: "users",
  access: systemManagedField,
  admin: { position: "sidebar", readOnly: true },
};

export const stampUpdatedBy: CollectionBeforeChangeHook = ({ data, req }) => {
  const author = stampsBy(req);
  return author === undefined ? data : { ...data, updatedBy: author };
};

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
