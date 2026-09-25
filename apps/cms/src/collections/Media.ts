import { anyone } from "../access";
import { withTenantAccess } from "../tenancy";

// TODO(DILM-18): store on S3 via @payloadcms/storage-s3 and replace these
// sizes with the adjustable thumbnail/card/social-share preset array.
export const Media = withTenantAccess({
  slug: "media",
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
    imageSizes: [
      { name: "thumbnail", width: 400, height: 300, position: "centre" },
      { name: "card", width: 768 },
    ],
  },
});
