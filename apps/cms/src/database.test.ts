import type { DatabaseConfig } from "@dilm/runtime-config";
import { describe, expect, it } from "vitest";

import { cmsDatabaseAdapter } from "./database";

const local: DatabaseConfig = {
  auth: "password",
  host: "localhost",
  port: 5432,
  database: "dilm",
  user: "payload_app",
  password: "payload_app",
  ssl: false,
};

const devExpress: DatabaseConfig = {
  auth: "iam",
  host: "dilm-dev-db.cluster-abc.ap-southeast-3.rds.amazonaws.com",
  port: 5432,
  database: "dilm",
  user: "payload_app",
  region: "ap-southeast-3",
};

const providers = {
  iamAuthToken: () => Promise.resolve("token"),
  secretString: () => Promise.reject(new Error("not used")),
};

const migrationDir = "/app/src/migrations";

describe("cmsDatabaseAdapter", () => {
  it("connects with the production pool budget", async () => {
    const { pool } = await cmsDatabaseAdapter(local, "env", migrationDir);
    expect(pool).toMatchObject({
      host: "localhost",
      user: "payload_app",
      password: "payload_app",
      ssl: false,
      max: 2,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 20_000,
    });
  });

  it("gives the CV consumer a single connection", async () => {
    const adapter = await cmsDatabaseAdapter(
      local,
      "aws",
      migrationDir,
      "cv-consumer",
    );
    expect(adapter.pool?.max).toBe(1);
  });

  it("lets a local .env database follow the collection config on start", async () => {
    const adapter = await cmsDatabaseAdapter(local, "env", migrationDir);
    expect(adapter.push).toBe(true);
  });

  it("never pushes schema to a shared cloud database, even from a local .env", async () => {
    const adapter = await cmsDatabaseAdapter(
      devExpress,
      "env",
      migrationDir,
      "cms",
      providers,
    );
    expect(adapter.push).toBe(false);
  });

  it("never changes a deployed database's schema as a side effect of startup", async () => {
    const adapter = await cmsDatabaseAdapter(local, "aws", migrationDir);
    expect(adapter.push).toBe(false);
    expect(adapter.prodMigrations).toBeUndefined();
  });

  it("signs a fresh IAM token for the dev express cluster", async () => {
    const { pool } = await cmsDatabaseAdapter(
      devExpress,
      "aws",
      migrationDir,
      "cms",
      providers,
    );
    expect(typeof pool?.password).toBe("function");
    expect(pool?.ssl).toEqual({ rejectUnauthorized: true });
  });

  it("reads migrations from the committed directory", async () => {
    const adapter = await cmsDatabaseAdapter(local, "aws", migrationDir);
    expect(adapter.migrationDir).toBe(migrationDir);
  });
});
