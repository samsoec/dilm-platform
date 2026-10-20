import { anyone, trashByEditorsDeleteBySuperAdmins } from "../access";
import { navGroup } from "../admin/navGroups";
import { IMAGE_SIZES } from "../storage";
import { withTenantAccess } from "../tenancy";
import { withTrashedBy, withUploadedBy } from "../fields/authoring";
import { collectionLabels } from "../admin/labels";

export const Media = withTenantAccess(
  withTrashedBy(
    withUploadedBy({
      slug: "media",
      labels: collectionLabels("media"),
      admin: {
        group: navGroup("media"),
        components: {
          beforeListTable: [
            "/admin/components/trash/TrashToggle#TrashToggle",
            "/admin/components/media/UploadImagesButton#UploadImagesButton",
            "/admin/components/trash/TrashTable#TrashTable",
          ],
        },
      },
      custom: { nav: { icon: "photo_library" } },
      access: {
        read: anyone,
        delete: trashByEditorsDeleteBySuperAdmins,
      },
      trash: true,
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
  ),
);
