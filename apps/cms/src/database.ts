import { databasePoolOptions, type DatabaseConfig } from "@dilm/runtime-config";
import type { PostgresAdapterArgs } from "@payloadcms/db-postgres";

export function cmsDatabasePool(
  database: DatabaseConfig,
): PostgresAdapterArgs["pool"] {
  return {
    host: database.host,
    port: database.port,
    database: database.database,
    user: database.user,
    password: database.password,
    // TODO(DILM-38): pin the RDS CA bundle once Payload connects to Aurora.
    ssl: database.ssl ? { rejectUnauthorized: true } : false,
    ...databasePoolOptions("cms"),
  };
}
