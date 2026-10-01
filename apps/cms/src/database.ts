import {
  type DatabaseClient,
  type DatabaseConfig,
  type DatabaseCredentialProviders,
  databasePoolConfig,
  type RuntimeConfigSource,
} from "@dilm/runtime-config";
import type { PostgresAdapterArgs } from "@payloadcms/db-postgres";

export type PayloadClient = Exclude<DatabaseClient, "migrations">;

export async function cmsDatabaseAdapter(
  database: DatabaseConfig,
  source: RuntimeConfigSource,
  migrationDir: string,
  client: PayloadClient = "cms",
  providers?: DatabaseCredentialProviders,
): Promise<PostgresAdapterArgs> {
  // TODO(DILM-38): add the RDS CA bundle to `ssl` for the staging/production
  // Aurora cluster; the dev express gateway presents an AWS public-root cert.
  return {
    pool: await databasePoolConfig(database, client, providers),
    migrationDir,
    push: source === "env" && database.auth === "password",
  };
}
