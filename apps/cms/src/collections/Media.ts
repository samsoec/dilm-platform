import { anyone } from "../access";
import { navGroup } from "../admin/navGroups";
import { IMAGE_SIZES } from "../storage";
import { withTenantAccess } from "../tenancy";
import { withUploadedBy } from "../fields/authoring";
import { collectionLabels } from "../admin/labels";

export const Media = withTenantAccess(
  withUploadedBy({
    slug: "media",
    labels: collectionLabels("media"),
    admin: { group: navGroup("media") },
    custom: { nav: { icon: "photo_library" } },
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
  }),
);
