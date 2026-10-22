import type { StorageConfig } from "@dilm/runtime-config";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import type { Payload } from "payload";

import type { ResumeStorage, ResumeStorageFor } from "./resume";

export const PRIVATE_STORAGE_KEY = "privateStorage";

function isMissing(error: unknown): boolean {
  const { name, $metadata } = (error ?? {}) as {
    name?: string;
    $metadata?: { httpStatusCode?: number };
  };
  return name === "NotFound" || $metadata?.httpStatusCode === 404;
}

export function s3ResumeStorage(storage: StorageConfig): ResumeStorage {
  const override = storage.endpointOverride;
  const client = new S3Client({
    region: storage.region,
    ...(override && {
      endpoint: override.url,
      credentials: override.credentials,
      forcePathStyle: true,
    }),
  });
  const Bucket = storage.privateBucket;
  return {
    async head(Key) {
      try {
        const { ContentType } = await client.send(
          new HeadObjectCommand({ Bucket, Key }),
        );
        return { contentType: ContentType };
      } catch (error) {
        if (isMissing(error)) return undefined;
        throw error;
      }
    },
    presign({ key, contentType, fileName, expiresInSeconds }) {
      return getSignedUrl(
        client,
        new GetObjectCommand({
          Bucket,
          Key: key,
          ResponseContentDisposition: `attachment; filename="${fileName}"`,
          ...(contentType && { ResponseContentType: contentType }),
        }),
        { expiresIn: expiresInSeconds },
      );
    },
    async remove(Key) {
      await client.send(new DeleteObjectCommand({ Bucket, Key }));
    },
  };
}

const cache = new WeakMap<object, ResumeStorage>();

export const configuredResumeStorage: ResumeStorageFor = (payload: Payload) => {
  const config = payload.config;
  let storage = cache.get(config);
  if (!storage) {
    storage = s3ResumeStorage(
      config.custom?.[PRIVATE_STORAGE_KEY] as StorageConfig,
    );
    cache.set(config, storage);
  }
  return storage;
};
