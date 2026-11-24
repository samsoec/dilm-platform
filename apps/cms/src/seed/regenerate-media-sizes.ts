import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { getPayload } from "payload";

import { getRuntimeConfig } from "@dilm/runtime-config";

import config from "../payload.config";
import { PUBLIC_BUCKET_PREFIXES } from "../storage";

const { storage } = await getRuntimeConfig();
const override = storage.endpointOverride;
const s3 = new S3Client({
  region: storage.region,
  ...(override && {
    endpoint: override.url,
    credentials: override.credentials,
    forcePathStyle: true,
  }),
});

const payload = await getPayload({ config });
const scratch = await mkdtemp(path.join(os.tmpdir(), "media-sizes-"));
let regenerated = 0;
let failed = 0;
let page = 1;

for (;;) {
  const batch = await payload.find({
    collection: "media",
    page,
    limit: 25,
    depth: 0,
    overrideAccess: true,
    pagination: true,
  });
  for (const doc of batch.docs) {
    if (!doc.filename) continue;
    try {
      const object = await s3.send(
        new GetObjectCommand({
          Bucket: storage.publicBucket,
          Key: `${PUBLIC_BUCKET_PREFIXES.media}/${doc.filename}`,
        }),
      );
      const filePath = path.join(scratch, doc.filename);
      await writeFile(filePath, await object.Body!.transformToByteArray());
      await payload.update({
        collection: "media",
        id: doc.id,
        data: {},
        filePath,
        overwriteExistingFiles: true,
        overrideAccess: true,
      });
      await rm(filePath);
      regenerated += 1;
    } catch (error) {
      failed += 1;
      payload.logger.error(`media ${doc.id} ${doc.filename}: ${String(error)}`);
    }
  }
  if (!batch.hasNextPage) break;
  page += 1;
}

await rm(scratch, { recursive: true, force: true });
payload.logger.info(
  `regenerated sizes for ${regenerated} media, ${failed} failed`,
);
await payload.destroy();
process.exit(failed > 0 ? 1 : 0);
