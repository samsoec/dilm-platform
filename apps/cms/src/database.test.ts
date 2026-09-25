import { describe, expect, it } from "vitest";

import { cmsDatabasePool } from "./database";

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
