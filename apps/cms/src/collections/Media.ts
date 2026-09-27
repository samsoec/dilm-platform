import type { CollectionConfig } from "payload";

import { anyone, tenantContentAccess } from "../access";
import { IMAGE_SIZES } from "../storage";

// TODO(DILM-17): wrap in withTenantAccess so every file belongs to a tenant.
export const Media: CollectionConfig = {
  slug: "media",
  access: {
    ...tenantContentAccess,
    read: anyone,
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
    },
  ],
  upload: {
    mimeTypes: ["image/*"],
    imageSizes: IMAGE_SIZES,
  },
};
