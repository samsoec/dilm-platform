import type { StorageConfig } from "@dilm/runtime-config";
import type { S3StorageOptions } from "@payloadcms/storage-s3";
import type { ImageSize } from "payload";

export const IMAGE_SIZES: ImageSize[] = [
  { name: "thumbnail", width: 400, height: 300, position: "centre" },
  { name: "card", width: 768 },
  { name: "social-share", width: 1200, height: 630, position: "centre" },
];

export const PUBLIC_BUCKET_PREFIXES = {
  media: "media",
  "ir-documents": "ir-documents",
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
