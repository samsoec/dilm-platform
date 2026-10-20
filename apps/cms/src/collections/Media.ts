import { anyone, trashByEditorsDeleteBySuperAdmins } from "../access";
import { navGroup } from "../admin/navGroups";
import { IMAGE_SIZES } from "../storage";
import { withTenantAccess } from "../tenancy";
import { withTrashedBy, withUploadedBy } from "../fields/authoring";
import { collectionLabels } from "../admin/labels";
import { GRID_PATH } from "../admin/components/media/media";

export const Media = withTenantAccess(
  withTrashedBy(
    withUploadedBy({
      slug: "media",
      labels: collectionLabels("media"),
      admin: {
        group: navGroup("media"),
        defaultColumns: [
          "filename",
          "alt",
          "filesize",
          "uploadedBy",
          "createdAt",
        ],
        listSearchableFields: ["filename", "alt"],
        components: {
          Description: "/admin/components/lists/ListIntro#ListIntro",
          beforeListTable: [
            "/admin/components/trash/TrashToggle#TrashToggle",
            "/admin/components/media/MediaToolbar#MediaToolbar",
            "/admin/components/trash/TrashTable#TrashTable",
          ],
          views: {
            grid: {
              path: GRID_PATH,
              Component: "/admin/components/media/MediaGridView#MediaGridView",
            },
          },
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
          label: "Alt text",
          type: "text",
          required: true,
          admin: {
            components: { Cell: "/admin/components/media/MediaCells#AltCell" },
          },
        },
        {
          name: "filesize",
          type: "number",
          admin: {
            components: {
              Cell: "/admin/components/media/MediaCells#FileSizeCell",
            },
          },
        },
      ],
      upload: {
        mimeTypes: ["image/*"],
        imageSizes: IMAGE_SIZES,
      },
    }),
  ),
);
