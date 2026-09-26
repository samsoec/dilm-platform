import { describe, expect, it } from "vitest";

import { cmsDatabaseAdapter, cmsDatabasePool } from "./database";

const local = {
  host: "localhost",
  port: 5432,
  database: "dilm",
  user: "payload_app",
  password: "payload_app",
  ssl: false,
};

describe("cmsDatabasePool", () => {
  it("connects with the production pool budget", () => {
    expect(cmsDatabasePool(local)).toEqual({
      ...local,
      max: 2,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 20_000,
    });
  });

  it("verifies the server certificate whenever TLS is on", () => {
    expect(cmsDatabasePool({ ...local, ssl: true }).ssl).toEqual({
      rejectUnauthorized: true,
    });
  });
});

describe("cmsDatabaseAdapter", () => {
  const migrationDir = "/app/src/migrations";

  it("lets a local .env database follow the collection config on start", () => {
    expect(cmsDatabaseAdapter(local, "env", migrationDir).push).toBe(true);
  });

  it("never changes a deployed database's schema as a side effect of startup", () => {
    const adapter = cmsDatabaseAdapter(local, "aws", migrationDir);
    expect(adapter.push).toBe(false);
    expect(adapter.prodMigrations).toBeUndefined();
  });

  it("reads migrations from the committed directory", () => {
    expect(cmsDatabaseAdapter(local, "aws", migrationDir).migrationDir).toBe(
      migrationDir,
    );
  });
});
