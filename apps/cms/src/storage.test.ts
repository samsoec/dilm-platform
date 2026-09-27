import type { StorageConfig } from "@dilm/runtime-config";
import { describe, expect, it } from "vitest";

import { Media } from "./collections/Media";
import { IMAGE_SIZES, publicBucketStorage } from "./storage";

const aws: StorageConfig = {
  region: "ap-southeast-3",
  publicBucket: "dilm-staging-public",
  privateBucket: "dilm-staging-cv-private",
};

const minio: StorageConfig = {
  ...aws,
  publicBucket: "dilm-local-public",
  privateBucket: "dilm-local-cv-private",
  endpointOverride: {
    url: "http://localhost:9000",
    credentials: { accessKeyId: "minioadmin", secretAccessKey: "minioadmin" },
  },
};

describe("IMAGE_SIZES", () => {
  it("defines the thumbnail, card and social-share presets", () => {
    expect(IMAGE_SIZES.map((size) => size.name)).toEqual([
      "thumbnail",
      "card",
      "social-share",
    ]);
  });

  it("is the array media uploads are resized with", () => {
    expect(typeof Media.upload === "object" && Media.upload.imageSizes).toBe(
      IMAGE_SIZES,
    );
  });
});

describe("publicBucketStorage", () => {
  it("stores media and IR documents in the public bucket under their own prefixes", () => {
    const options = publicBucketStorage(aws);
    expect(options.bucket).toBe("dilm-staging-public");
    expect(options.collections).toEqual({
      media: { prefix: "media" },
      "ir-documents": { prefix: "ir-documents" },
    });
  });

  it("never reaches the private résumé bucket", () => {
    for (const storage of [aws, minio]) {
      expect(JSON.stringify(publicBucketStorage(storage))).not.toContain(
        storage.privateBucket,
      );
    }
    expect(Object.keys(publicBucketStorage(aws).collections)).not.toContain(
      "cv-submissions",
    );
  });

  it("uses the Jakarta region and the function's own role on AWS", () => {
    expect(publicBucketStorage(aws).config).toEqual({
      region: "ap-southeast-3",
    });
  });

  it("talks to MinIO with path-style URLs and its local keys", () => {
    expect(publicBucketStorage(minio).config).toEqual({
      region: "ap-southeast-3",
      endpoint: "http://localhost:9000",
      credentials: { accessKeyId: "minioadmin", secretAccessKey: "minioadmin" },
      forcePathStyle: true,
    });
  });
});
