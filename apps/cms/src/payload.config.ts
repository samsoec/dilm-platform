import path from "node:path";
import { fileURLToPath } from "node:url";

import { getRuntimeConfig, runtimeConfigSource } from "@dilm/runtime-config";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { buildConfig } from "payload";
import sharp from "sharp";

import { Media } from "./collections/Media";
import { Tenants } from "./collections/Tenants";
import { Users } from "./collections/Users";
import { cmsDatabaseAdapter } from "./database";
import { localization } from "./localization";
import { multiTenant } from "./tenancy";

const dirname = path.dirname(fileURLToPath(import.meta.url));

const runtimeConfig = await getRuntimeConfig();

const collections = [Users, Tenants, Media];

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
  db: postgresAdapter(
    cmsDatabaseAdapter(
      runtimeConfig.database,
      runtimeConfigSource(process.env),
      path.resolve(dirname, "migrations"),
    ),
  ),
  sharp,
  plugins: [multiTenant(collections)],
});
