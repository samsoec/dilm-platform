import type {
  CollectionBeforeChangeHook,
  CollectionConfig,
  DateField,
  RelationshipField,
} from "payload";

import { systemManagedField } from "../access";
import { stampsBy } from "./systemWrite";

export const uploadedByField: RelationshipField = {
  name: "uploadedBy",
  label: "Uploaded by",
  type: "relationship",
  relationTo: "users",
  access: systemManagedField,
  admin: {
    position: "sidebar",
    readOnly: true,
    components: { Cell: "/admin/components/media/MediaCells#UploadedByCell" },
  },
};

export const stampUploadedBy: CollectionBeforeChangeHook = ({
  data,
  operation,
  req,
}) => {
  if (operation !== "create") return data;
  const author = stampsBy(req);
  return author === undefined ? data : { ...data, uploadedBy: author };
};

export function withUploadedBy(collection: CollectionConfig): CollectionConfig {
  return {
    ...collection,
    hooks: {
      ...collection.hooks,
      beforeChange: [
        ...(collection.hooks?.beforeChange ?? []),
        stampUploadedBy,
      ],
    },
    fields: [...collection.fields, uploadedByField],
  };
}

export const statusChangedByField: RelationshipField = {
  name: "statusChangedBy",
  label: "Status set by",
  type: "relationship",
  relationTo: "users",
  access: systemManagedField,
  admin: { position: "sidebar", readOnly: true },
};

export const statusChangedAtField: DateField = {
  name: "statusChangedAt",
  label: "Status set at",
  type: "date",
  access: systemManagedField,
  admin: {
    position: "sidebar",
    readOnly: true,
    date: { pickerAppearance: "dayAndTime" },
  },
};

export const stampStatusChange: CollectionBeforeChangeHook = ({
  data,
  operation,
  originalDoc,
  req,
}) => {
  if (operation !== "update" || data.status === undefined) return data;
  if (data.status === originalDoc?.status) return data;
  const author = stampsBy(req);
  if (author === undefined) return data;
  return {
    ...data,
    statusChangedBy: author,
    statusChangedAt: new Date().toISOString(),
  };
};

export const trashedByField: RelationshipField = {
  name: "trashedBy",
  label: "Trashed by",
  type: "relationship",
  relationTo: "users",
  access: systemManagedField,
  admin: { position: "sidebar", readOnly: true, disableListColumn: true },
};

export const stampTrashedBy: CollectionBeforeChangeHook = ({
  data,
  originalDoc,
  req,
}) => {
  if (!data || !("deletedAt" in data)) return data;
  if (data.deletedAt && !originalDoc?.deletedAt) {
    return { ...data, trashedBy: stampsBy(req) ?? null };
  }
  if (!data.deletedAt && originalDoc?.deletedAt) {
    return { ...data, trashedBy: null };
  }
  return data;
};

export function withTrashedBy(collection: CollectionConfig): CollectionConfig {
  return {
    ...collection,
    hooks: {
      ...collection.hooks,
      beforeChange: [...(collection.hooks?.beforeChange ?? []), stampTrashedBy],
    },
    fields: [...collection.fields, trashedByField],
  };
}
