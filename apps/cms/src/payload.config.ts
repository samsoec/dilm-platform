import path from "node:path";
import { fileURLToPath } from "node:url";

import { getRuntimeConfig } from "@dilm/runtime-config";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { buildConfig } from "payload";
import sharp from "sharp";

import { Media } from "./collections/Media";
import { Users } from "./collections/Users";
import { cmsDatabasePool } from "./database";

const dirname = path.dirname(fileURLToPath(import.meta.url));

const runtimeConfig = await getRuntimeConfig();

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: dirname,
    },
  },
  collections: [Users, Media],
  secret: runtimeConfig.payloadSecret,
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: postgresAdapter({
    pool: cmsDatabasePool(runtimeConfig.database),
  }),
  sharp,
});
