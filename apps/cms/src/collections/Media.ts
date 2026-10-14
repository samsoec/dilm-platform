import { anyone } from "../access";
import { navGroup } from "../admin/navGroups";
import { IMAGE_SIZES } from "../storage";
import { withTenantAccess } from "../tenancy";

export const Media = withTenantAccess({
  slug: "media",
  admin: { group: navGroup("media") },
  access: {
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
});
