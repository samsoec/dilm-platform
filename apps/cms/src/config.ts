import path from "node:path";
import { fileURLToPath } from "node:url";

import { getRuntimeConfig, runtimeConfigSource } from "@dilm/runtime-config";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { s3Storage } from "@payloadcms/storage-s3";
import { buildConfig } from "payload";
import sharp from "sharp";

import { ConsentLogs } from "./collections/ConsentLogs";
import { CvSubmissions } from "./collections/CvSubmissions";
import { Footer } from "./collections/Footer";
import { Header } from "./collections/Header";
import { IrDocuments } from "./collections/IrDocuments";
import { Media } from "./collections/Media";
import { TenantSettings } from "./collections/TenantSettings";
import { Tenants } from "./collections/Tenants";
import { Users } from "./collections/Users";
import { cmsDatabaseAdapter, type PayloadClient } from "./database";
import { cmsEmailAdapter } from "./email";
import { localization } from "./localization";
import { publicBucketStorage } from "./storage";
import { multiTenant } from "./tenancy";

const dirname = path.dirname(fileURLToPath(import.meta.url));

const collections = [
  Users,
  Tenants,
  TenantSettings,
  Media,
  ConsentLogs,
  IrDocuments,
  CvSubmissions,
  Header,
  Footer,
];

export async function cmsConfig(client: PayloadClient) {
  const runtimeConfig = await getRuntimeConfig();
  return buildConfig({
    admin: {
      user: Users.slug,
      importMap: {
        baseDir: dirname,
      },
    },
    collections,
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
