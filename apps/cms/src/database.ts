import {
  type DatabaseClient,
  databasePoolOptions,
  type DatabaseConfig,
  type RuntimeConfigSource,
} from "@dilm/runtime-config";
import type { PostgresAdapterArgs } from "@payloadcms/db-postgres";

export type PayloadClient = Exclude<DatabaseClient, "migrations">;

export function cmsDatabasePool(
  database: DatabaseConfig,
  client: PayloadClient = "cms",
): PostgresAdapterArgs["pool"] {
  return {
    host: database.host,
    port: database.port,
    database: database.database,
    user: database.user,
    password: database.password,
    // TODO(DILM-38): pin the RDS CA bundle once Payload connects to Aurora.
    ssl: database.ssl ? { rejectUnauthorized: true } : false,
    ...databasePoolOptions(client),
  };
}

export function cmsDatabaseAdapter(
  database: DatabaseConfig,
  source: RuntimeConfigSource,
  migrationDir: string,
  client: PayloadClient = "cms",
): PostgresAdapterArgs {
  return {
    pool: cmsDatabasePool(database, client),
    migrationDir,
    push: source === "env",
  };
}
