import type {
  DatabaseConfig,
  DatabaseEndpoint,
  IamDatabaseConfig,
} from "./config";

export type DatabaseClient = "cms" | "cv-consumer" | "migrations";

export interface DatabasePoolOptions {
  max: number;
  idleTimeoutMillis: number;
  connectionTimeoutMillis: number;
}

export type DatabasePasswordSource = string | (() => Promise<string>);

export interface DatabasePoolConfig
  extends DatabaseEndpoint, DatabasePoolOptions {
  password: DatabasePasswordSource;
  ssl: false | { rejectUnauthorized: true };
}

export interface DatabaseCredentialProviders {
  iamAuthToken(database: IamDatabaseConfig): Promise<string>;
  secretString(secretArn: string, region: string): Promise<string>;
}

const POOL_MAX_BY_CLIENT: Record<DatabaseClient, number> = {
  cms: 2,
  "cv-consumer": 1,
  migrations: 1,
};

const IDLE_TIMEOUT_MILLIS_TO_LET_AURORA_AUTO_PAUSE = 30_000;
const CONNECTION_TIMEOUT_MILLIS_TO_RIDE_OUT_AURORA_RESUME = 20_000;

const VERIFIED_TLS = { rejectUnauthorized: true } as const;

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

export const awsCredentialProviders: DatabaseCredentialProviders = {
  async iamAuthToken({ host, port, user, region }) {
    const { Signer } = await import("@aws-sdk/rds-signer");
    return new Signer({
      hostname: host,
      port,
      username: user,
      region,
    }).getAuthToken();
  },
  async secretString(secretArn, region) {
    const { GetSecretValueCommand, SecretsManagerClient } =
      await import("@aws-sdk/client-secrets-manager");
    const { SecretString } = await new SecretsManagerClient({ region }).send(
      new GetSecretValueCommand({ SecretId: secretArn }),
    );
    if (SecretString === undefined) {
      throw new Error(`Secret ${secretArn} has no SecretString.`);
    }
    return SecretString;
  },
};

interface RdsSecretCredential extends DatabaseEndpoint {
  password: string;
}

export function parseRdsSecret(secretString: string): RdsSecretCredential {
  const secret = JSON.parse(secretString) as Record<string, unknown>;
  const text = (key: string): string => {
    const value = secret[key];
    if (typeof value !== "string" || value === "") {
      throw new Error(`The payload_app secret is missing "${key}".`);
    }
    return value;
  };
  const port = Number(secret.port ?? 5432);
  if (!Number.isInteger(port)) {
    throw new Error(`The payload_app secret has a malformed "port".`);
  }
  return {
    host: text("host"),
    port,
    database: text("dbname"),
    user: text("username"),
    password: text("password"),
  };
}

const secretCache = new Map<string, Promise<RdsSecretCredential>>();

function cachedSecret(
  secretArn: string,
  region: string,
  providers: DatabaseCredentialProviders,
): Promise<RdsSecretCredential> {
  let credential = secretCache.get(secretArn);
  if (credential === undefined) {
    credential = providers
      .secretString(secretArn, region)
      .then(parseRdsSecret)
      .catch((error: unknown) => {
        secretCache.delete(secretArn);
        throw error;
      });
    secretCache.set(secretArn, credential);
  }
  return credential;
}

function endpointOf({
  host,
  port,
  database,
  user,
}: DatabaseEndpoint): DatabaseEndpoint {
  return { host, port, database, user };
}

export function clearDatabaseSecretCache(): void {
  secretCache.clear();
}

export async function databasePoolConfig(
  database: DatabaseConfig,
  client: DatabaseClient,
  providers: DatabaseCredentialProviders = awsCredentialProviders,
): Promise<DatabasePoolConfig> {
  const options = databasePoolOptions(client);
  switch (database.auth) {
    case "password":
      return {
        ...endpointOf(database),
        password: database.password,
        ssl: database.ssl ? VERIFIED_TLS : false,
        ...options,
      };
    case "iam":
      return {
        ...endpointOf(database),
        password: () => providers.iamAuthToken(database),
        ssl: VERIFIED_TLS,
        ...options,
      };
    case "secret": {
      const credential = await cachedSecret(
        database.secretArn,
        database.region,
        providers,
      );
      return { ...credential, ssl: VERIFIED_TLS, ...options };
    }
  }
}
