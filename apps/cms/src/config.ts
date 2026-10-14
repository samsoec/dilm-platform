import path from "node:path";
import { fileURLToPath } from "node:url";

import { getRuntimeConfig, runtimeConfigSource } from "@dilm/runtime-config";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { s3Storage } from "@payloadcms/storage-s3";
import { buildConfig } from "payload";
import sharp from "sharp";

import { PRODUCT_NAME } from "./admin/brand";
import { collections, globals } from "./collections";
import { Users } from "./collections/Users";
import { cmsDatabaseAdapter, type PayloadClient } from "./database";
import { cmsEmailAdapter } from "./email";
import { localization } from "./localization";
import { publicBucketStorage } from "./storage";
import { multiTenant } from "./tenancy";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export async function cmsConfig(client: PayloadClient) {
  const runtimeConfig = await getRuntimeConfig();
  return buildConfig({
    admin: {
      user: Users.slug,
      importMap: {
        baseDir: dirname,
      },
      theme: "all",
      avatar: { Component: "/admin/graphics/Avatar#Avatar" },
      components: {
        graphics: {
          Icon: "/admin/graphics/Icon#Icon",
          Logo: "/admin/graphics/Logo#Logo",
        },
      },
      meta: {
        titleSuffix: `— ${PRODUCT_NAME}`,
        icons: [{ rel: "icon", type: "image/svg+xml", url: "/favicon.svg" }],
      },
    },
    collections,
    globals,
    localization,
    secret: runtimeConfig.payloadSecret,
    typescript: {
      outputFile: path.resolve(dirname, "payload-types.ts"),
    },
    db: postgresAdapter(
      await cmsDatabaseAdapter(
        runtimeConfig.database,
        runtimeConfigSource(process.env),
        path.resolve(dirname, "migrations"),
        client,
      ),
    ),
    email: cmsEmailAdapter(runtimeConfig.email),
    sharp,
    plugins: [
      multiTenant(collections),
      s3Storage(publicBucketStorage(runtimeConfig.storage)),
    ],
  });
}
