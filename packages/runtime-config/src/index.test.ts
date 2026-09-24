import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  databasePoolOptions,
  loadRuntimeConfig,
  MissingEnvError,
  readRuntimeConfigFromEnv,
  runtimeConfigSource,
} from "./index.js";

function parseDotenv(path: string): Record<string, string> {
  const entries = readFileSync(path, "utf8")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line !== "" && !line.startsWith("#"))
    .map((line) => {
      const separator = line.indexOf("=");
      return [line.slice(0, separator), line.slice(separator + 1)] as const;
    });
  return Object.fromEntries(entries);
}

const envExample = parseDotenv(
  fileURLToPath(new URL("../../../.env.example", import.meta.url)),
);

describe("readRuntimeConfigFromEnv", () => {
  it("builds a complete local config from .env.example", () => {
    const config = readRuntimeConfigFromEnv(envExample);

    expect(config.database).toEqual({
      host: "localhost",
      port: 5432,
      database: "dilm",
      user: "payload_app",
      password: "payload_app",
      ssl: false,
    });
    expect(config.storage).toEqual({
      region: "ap-southeast-3",
      publicBucket: "dilm-local-public",
      privateBucket: "dilm-local-cv-private",
      endpointOverride: {
        url: "http://localhost:9000",
        credentials: {
          accessKeyId: "minioadmin",
          secretAccessKey: "minioadmin",
        },
      },
    });
    expect(config.email).toEqual({
      transport: "smtp",
      host: "localhost",
      port: 1025,
    });
    expect(config.queue?.cvQueueUrl).toBe(
      "http://localhost:9324/000000000000/dilm-local-cv",
    );
    expect(config.jobPlatform).toBeUndefined();
  });

  it("reports every missing variable at once", () => {
    expect(() => readRuntimeConfigFromEnv({})).toThrow(MissingEnvError);
    try {
      readRuntimeConfigFromEnv({});
    } catch (error) {
      expect((error as MissingEnvError).missing).toEqual([
        "DATABASE_HOST",
        "DATABASE_NAME",
        "DATABASE_USER",
        "DATABASE_PASSWORD",
        "PAYLOAD_SECRET",
        "S3_PUBLIC_BUCKET",
        "S3_PRIVATE_BUCKET",
      ]);
    }
  });

  it("defaults to TLS, SES and real AWS endpoints when no local overrides are set", () => {
    const config = readRuntimeConfigFromEnv({
      DATABASE_HOST: "db.example",
      DATABASE_NAME: "dilm",
      DATABASE_USER: "payload_app",
      DATABASE_PASSWORD: "secret",
      PAYLOAD_SECRET: "secret",
      S3_PUBLIC_BUCKET: "dilm-staging-public",
      S3_PRIVATE_BUCKET: "dilm-staging-cv-private",
    });

    expect(config.database.ssl).toBe(true);
    expect(config.email).toEqual({
      transport: "ses",
      region: "ap-southeast-3",
    });
    expect(config.storage.endpointOverride).toBeUndefined();
    expect(config.queue).toBeUndefined();
  });

  it("requires credentials alongside an endpoint override", () => {
    expect(() =>
      readRuntimeConfigFromEnv({ ...envExample, S3_SECRET_ACCESS_KEY: "" }),
    ).toThrow(/S3_SECRET_ACCESS_KEY/);
  });

  it("rejects a malformed port", () => {
    expect(() =>
      readRuntimeConfigFromEnv({ ...envExample, DATABASE_PORT: "54x2" }),
    ).toThrow(/DATABASE_PORT/);
  });
});

describe("runtimeConfigSource", () => {
  it("defaults to aws so a deployed function never reads stray env vars", () => {
    expect(runtimeConfigSource({})).toBe("aws");
  });

  it("rejects unknown sources", () => {
    expect(() =>
      runtimeConfigSource({ RUNTIME_CONFIG_SOURCE: "local" }),
    ).toThrow();
  });
});

describe("loadRuntimeConfig", () => {
  it("reads env vars when RUNTIME_CONFIG_SOURCE=env", async () => {
    await expect(loadRuntimeConfig(envExample)).resolves.toMatchObject({
      payloadSecret: envExample.PAYLOAD_SECRET,
    });
  });

  it("refuses the AWS source until DILM-12 lands", async () => {
    await expect(loadRuntimeConfig({})).rejects.toThrow(/DILM-12/);
  });
});

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
