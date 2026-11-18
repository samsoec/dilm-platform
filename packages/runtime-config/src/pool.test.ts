import { afterEach, describe, expect, it, vi } from "vitest";

const fakePg = vi.hoisted(() => ({ failure: undefined as Error | undefined }));
vi.mock("pg", () => ({
  default: {
    Client: class {
      constructor(public config: Record<string, unknown>) {}
      connect(callback: (error?: Error) => void) {
        callback(fakePg.failure);
      }
    },
  },
}));

import type { DatabaseConfig } from "./config";
import {
  clearDatabaseSecretCache,
  type DatabaseCredentialProviders,
  databasePoolConfig,
  databasePoolOptions,
  parseRdsSecret,
} from "./pool";

const SECRET_ARN =
  "arn:aws:secretsmanager:ap-southeast-3:123456789012:secret:payload_app";

const rdsSecret = JSON.stringify({
  engine: "postgres",
  host: "dilm-staging-db.cluster-abc.ap-southeast-3.rds.amazonaws.com",
  port: 5432,
  dbname: "dilm",
  username: "payload_app_clone",
  password: "rotated",
});

const configs: Record<DatabaseConfig["auth"], DatabaseConfig> = {
  password: {
    auth: "password",
    host: "localhost",
    port: 5432,
    database: "dilm",
    user: "payload_app",
    password: "payload_app",
    ssl: true,
  },
  iam: {
    auth: "iam",
    host: "dilm-dev-db.cluster-abc.ap-southeast-3.rds.amazonaws.com",
    port: 5432,
    database: "dilm",
    user: "payload_app",
    region: "ap-southeast-3",
  },
  secret: { auth: "secret", secretArn: SECRET_ARN, region: "ap-southeast-3" },
};

function fakeProviders(): DatabaseCredentialProviders {
  let issued = 0;
  return {
    iamAuthToken: vi.fn(() => Promise.resolve(`token-${++issued}`)),
    secretString: vi.fn(() => Promise.resolve(rdsSecret)),
  };
}

afterEach(clearDatabaseSecretCache);

describe("databasePoolOptions", () => {
  it("matches the Backend Spec §8.2 connection budget", () => {
    expect(databasePoolOptions("cms")).toEqual({
      max: 2,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 20_000,
    });
    expect(databasePoolOptions("cv-consumer").max).toBe(1);
    expect(databasePoolOptions("migrations").max).toBe(1);
  });
});

describe("databasePoolConfig", () => {
  it.each(Object.values(configs))(
    "applies the same pool budget and verified TLS in $auth mode",
    async (database) => {
      const pool = await databasePoolConfig(database, "cms", fakeProviders());
      expect(pool).toMatchObject({
        ...databasePoolOptions("cms"),
        ssl: { rejectUnauthorized: true },
      });
    },
  );

  it("keeps a local password database on plain TCP when TLS is off", async () => {
    const pool = await databasePoolConfig(
      { ...configs.password, ssl: false } as DatabaseConfig,
      "cms",
      fakeProviders(),
    );
    expect(pool.ssl).toBe(false);
    expect(pool.password).toBe("payload_app");
  });

  it("signs a fresh IAM token for every new connection, so a pool outlives the 15-minute token", async () => {
    const providers = fakeProviders();
    const pool = await databasePoolConfig(configs.iam, "cms", providers);
    if (typeof pool.password !== "function") throw new Error("not lazy");

    await expect(pool.password()).resolves.toBe("token-1");
    await expect(pool.password()).resolves.toBe("token-2");
    expect(providers.iamAuthToken).toHaveBeenCalledWith(configs.iam);
    expect(pool).toMatchObject({
      host: "dilm-dev-db.cluster-abc.ap-southeast-3.rds.amazonaws.com",
      user: "payload_app",
      database: "dilm",
    });
  });

  it("reads payload_app from Secrets Manager once and reuses it", async () => {
    const providers = fakeProviders();
    const first = await databasePoolConfig(configs.secret, "cms", providers);
    const second = await databasePoolConfig(
      configs.secret,
      "cv-consumer",
      providers,
    );

    expect(providers.secretString).toHaveBeenCalledTimes(1);
    expect(providers.secretString).toHaveBeenCalledWith(
      SECRET_ARN,
      "ap-southeast-3",
    );
    expect(first).toMatchObject({
      host: "dilm-staging-db.cluster-abc.ap-southeast-3.rds.amazonaws.com",
      database: "dilm",
      user: "payload_app_clone",
      password: "rotated",
    });
    expect(second.max).toBe(1);
  });

  it("retries Secrets Manager on the next cold-start attempt after a failure", async () => {
    const providers = fakeProviders();
    vi.mocked(providers.secretString).mockRejectedValueOnce(
      new Error("throttled"),
    );

    await expect(
      databasePoolConfig(configs.secret, "cms", providers),
    ).rejects.toThrow("throttled");
    await expect(
      databasePoolConfig(configs.secret, "cms", providers),
    ).resolves.toMatchObject({ password: "rotated" });
  });
});

describe("rotation-aware client", () => {
  const authFailure = Object.assign(
    new Error("password authentication failed"),
    {
      code: "28P01",
    },
  );

  async function clientClass(providers: DatabaseCredentialProviders) {
    const { Client } = await databasePoolConfig(
      configs.secret,
      "cms",
      providers,
    );
    return Client as unknown as new (config: object) => {
      config: { user: string; password: string };
      connect(callback: (error?: Error) => void): void;
    };
  }

  afterEach(() => {
    fakePg.failure = undefined;
  });

  it("re-reads the secret after an auth failure so the next connection uses the rotated login", async () => {
    const providers = fakeProviders();
    const Client = await clientClass(providers);
    expect(new Client({}).config).toMatchObject({
      user: "payload_app_clone",
      password: "rotated",
    });

    vi.mocked(providers.secretString).mockResolvedValue(
      JSON.stringify({
        ...JSON.parse(rdsSecret),
        username: "payload_app",
        password: "rotated-again",
      }),
    );
    fakePg.failure = authFailure;
    const reported = await new Promise<Error | undefined>((resolve) =>
      new Client({}).connect(resolve),
    );

    expect(reported).toBe(authFailure);
    expect(providers.secretString).toHaveBeenCalledTimes(2);
    expect(new Client({}).config).toMatchObject({
      user: "payload_app",
      password: "rotated-again",
    });
  });

  it("does not touch Secrets Manager for other connection errors", async () => {
    const providers = fakeProviders();
    const Client = await clientClass(providers);
    fakePg.failure = Object.assign(new Error("timeout"), { code: "ETIMEDOUT" });
    await new Promise((resolve) => new Client({}).connect(resolve));
    expect(providers.secretString).toHaveBeenCalledTimes(1);
  });

  it("refreshes at most once in a burst of failures", async () => {
    const providers = fakeProviders();
    const Client = await clientClass(providers);
    fakePg.failure = authFailure;
    for (let i = 0; i < 3; i++) {
      await new Promise((resolve) => new Client({}).connect(resolve));
    }
    expect(providers.secretString).toHaveBeenCalledTimes(2);
  });
});

describe("parseRdsSecret", () => {
  it("names the missing field instead of connecting with undefined", () => {
    expect(() =>
      parseRdsSecret(JSON.stringify({ host: "h", username: "u" })),
    ).toThrow(/"dbname"/);
  });

  it("accepts a string port", () => {
    expect(
      parseRdsSecret(JSON.stringify({ ...JSON.parse(rdsSecret), port: "6543" }))
        .port,
    ).toBe(6543);
  });
});
