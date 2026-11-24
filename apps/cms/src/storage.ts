import type { StorageConfig } from "@dilm/runtime-config";
import type { S3StorageOptions } from "@payloadcms/storage-s3";
import type { ImageSize } from "payload";

export const WIDTH_LADDER = [640, 960, 1280, 1920, 2560] as const;

export const WIDTH_LADDER_PREFIX = "w";

export const IMAGE_SIZES: ImageSize[] = [
  { name: "thumbnail", width: 400, height: 300, position: "centre" },
  { name: "card", width: 768 },
  { name: "social-share", width: 1200, height: 630, position: "centre" },
  ...WIDTH_LADDER.map((width): ImageSize => ({
    name: `${WIDTH_LADDER_PREFIX}${width}`,
    width,
    formatOptions: { format: "webp", options: { quality: 80 } },
  })),
];

export const PRESET_IMAGE_SIZES = IMAGE_SIZES.filter(
  ({ name }) => !name.startsWith(WIDTH_LADDER_PREFIX),
);

export const PUBLIC_BUCKET_PREFIXES = {
  media: "media",
  "ir-documents": "ir-documents",
  documents: "documents",
} as const;

export function publicBucketStorage(storage: StorageConfig): S3StorageOptions {
  const override = storage.endpointOverride;
  return {
    bucket: storage.publicBucket,
    collections: Object.fromEntries(
      Object.entries(PUBLIC_BUCKET_PREFIXES).map(([slug, prefix]) => [
        slug,
        { prefix },
      ]),
    ),
    config: {
      region: storage.region,
      ...(override && {
        endpoint: override.url,
        credentials: override.credentials,
        forcePathStyle: true,
      }),
    },
  };
}
