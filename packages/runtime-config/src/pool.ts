export type DatabaseClient = "cms" | "cv-consumer" | "migrations";

export interface DatabasePoolOptions {
  max: number;
  idleTimeoutMillis: number;
  connectionTimeoutMillis: number;
}

const POOL_MAX_BY_CLIENT: Record<DatabaseClient, number> = {
  cms: 2,
  "cv-consumer": 1,
  migrations: 1,
};

const IDLE_TIMEOUT_MILLIS_TO_LET_AURORA_AUTO_PAUSE = 30_000;
const CONNECTION_TIMEOUT_MILLIS_TO_RIDE_OUT_AURORA_RESUME = 20_000;

export function databasePoolOptions(
  client: DatabaseClient,
): DatabasePoolOptions {
  return {
    max: POOL_MAX_BY_CLIENT[client],
    idleTimeoutMillis: IDLE_TIMEOUT_MILLIS_TO_LET_AURORA_AUTO_PAUSE,
    connectionTimeoutMillis:
      CONNECTION_TIMEOUT_MILLIS_TO_RIDE_OUT_AURORA_RESUME,
  };
}
