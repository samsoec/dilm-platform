import path from "node:path";
import { fileURLToPath } from "node:url";

import { getRuntimeConfig } from "@dilm/runtime-config";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { buildConfig } from "payload";
import sharp from "sharp";

import { ConsentLogs } from "./collections/ConsentLogs";
import { CvSubmissions } from "./collections/CvSubmissions";
import { IrDocuments } from "./collections/IrDocuments";
import { Media } from "./collections/Media";
import { TenantSettings } from "./collections/TenantSettings";
import { Tenants } from "./collections/Tenants";
import { Users } from "./collections/Users";
import { cmsDatabasePool } from "./database";
import { localization } from "./localization";
import { multiTenant } from "./tenancy";

const dirname = path.dirname(fileURLToPath(import.meta.url));

const runtimeConfig = await getRuntimeConfig();

const collections = [
  Users,
  Tenants,
  TenantSettings,
  Media,
  ConsentLogs,
  IrDocuments,
  CvSubmissions,
];

export default buildConfig({
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
  db: postgresAdapter({
    pool: cmsDatabasePool(runtimeConfig.database),
  }),
  sharp,
  plugins: [multiTenant(collections)],
});
