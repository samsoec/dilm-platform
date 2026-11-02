import { nestedDocsPlugin } from "@payloadcms/plugin-nested-docs";
import { redirectsPlugin } from "@payloadcms/plugin-redirects";
import { seoPlugin } from "@payloadcms/plugin-seo";
import type { CollectionSlug, Field, Plugin } from "payload";

import { redirectsOverrides } from "./redirects";

export const PAGE_COLLECTIONS: CollectionSlug[] = [];

export const SEO_LOCALIZED_FIELDS = ["title", "description", "image"] as const;

export function localizedSeoFields({
  defaultFields,
}: {
  defaultFields: Field[];
}): Field[] {
  return defaultFields.map((field) =>
    "name" in field &&
    (SEO_LOCALIZED_FIELDS as readonly string[]).includes(field.name)
      ? { ...field, localized: true }
      : field,
  );
}

export const pageModelPlugins: Plugin[] = [
  nestedDocsPlugin({ collections: PAGE_COLLECTIONS }),
  seoPlugin({
    collections: PAGE_COLLECTIONS,
    uploadsCollection: "media",
    fields: localizedSeoFields,
  }),
  redirectsPlugin({
    collections: PAGE_COLLECTIONS,
    overrides: {
      ...redirectsOverrides,
      fields: () => redirectsOverrides.fields(),
    },
  }),
];
