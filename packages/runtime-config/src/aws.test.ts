import { describe, expect, it, vi } from "vitest";

const ssmSend = vi.hoisted(() => vi.fn());
vi.mock("@aws-sdk/client-ssm", () => ({
  SSMClient: class {
    send = ssmSend;
  },
  GetParametersCommand: class {
    constructor(public input: unknown) {}
  },
}));

import {
  awsConfigProviders,
  readRuntimeConfigFromAws,
  readSstResource,
  type AwsConfigProviders,
} from "./aws";

const resources = {
  SST_RESOURCE_Database: JSON.stringify({
    auth: "secret",
    host: "db.example",
    port: 5432,
    database: "dilm",
    username: "payload_app",
    secretArn:
      "arn:aws:secretsmanager:ap-southeast-3:1:secret:dilm-staging-payload-app",
  }),
  SST_RESOURCE_PublicBucket: JSON.stringify({ name: "pub", prefixes: [] }),
  SST_RESOURCE_CvPrivateBucket: JSON.stringify({ name: "cv" }),
  SST_RESOURCE_EmailSender: JSON.stringify({
    mode: "shared",
    address: "No-Reply@Example.com",
    identity: "example.com",
    configurationSet: "x",
  }),
};
const env = { ...resources, RUNTIME_CONFIG_SSM_PREFIX: "/dilm/staging/" };

function providers(values: Record<string, string>): AwsConfigProviders & {
  ssmParameters: ReturnType<typeof vi.fn>;
} {
  return { ssmParameters: vi.fn().mockResolvedValue(values) };
}

describe("readRuntimeConfigFromAws", () => {
  it("builds the typed config from SST resources and SSM, in one SSM call", async () => {
    const p = providers({
      PAYLOAD_SECRET: "ps",
      PREVIEW_SECRET: "pv",
      JOB_PLATFORM_WEBHOOK_URL: "https://hook.example",
      JOB_PLATFORM_WEBHOOK_SECRET: "ws",
    });
    const config = await readRuntimeConfigFromAws(env, p);

    expect(p.ssmParameters).toHaveBeenCalledTimes(1);
    expect(p.ssmParameters.mock.calls[0][0]).toBe("/dilm/staging");
    expect(config).toEqual({
      database: {
        auth: "secret",
        secretArn: expect.stringContaining("dilm-staging-payload-app"),
        region: "ap-southeast-3",
      },
      cvRetentionMonths: 12,
      payloadSecret: "ps",
      previewSecret: "pv",
      storage: {
        region: "ap-southeast-3",
        publicBucket: "pub",
        privateBucket: "cv",
      },
      email: {
        transport: "ses",
        region: "ap-southeast-3",
        sharedSender: {
          address: "no-reply@example.com",
          identity: "example.com",
        },
      },
      queue: undefined,
      jobPlatform: { webhookUrl: "https://hook.example", webhookSecret: "ws" },
    });
  });

  it("uses IAM auth on dev and per-tenant senders when not shared", async () => {
    const config = await readRuntimeConfigFromAws(
      {
        ...env,
        SST_RESOURCE_Database: JSON.stringify({
          auth: "iam",
          host: "h",
          port: 5432,
          database: "dilm",
          username: "payload_app",
        }),
        SST_RESOURCE_EmailSender: JSON.stringify({ mode: "tenant" }),
        SST_RESOURCE_CvQueue: JSON.stringify({ url: "https://sqs/q" }),
      },
      providers({ PAYLOAD_SECRET: "ps" }),
    );
    expect(config.database).toMatchObject({ auth: "iam", host: "h" });
    expect(config.email).toEqual({
      transport: "ses",
      region: "ap-southeast-3",
    });
    expect(config.queue?.cvQueueUrl).toBe("https://sqs/q");
    expect(config.jobPlatform).toBeUndefined();
  });

  it("fails clearly when something is not wired", async () => {
    await expect(readRuntimeConfigFromAws(env, providers({}))).rejects.toThrow(
      /PAYLOAD_SECRET is missing/,
    );
    await expect(
      readRuntimeConfigFromAws(
        { ...env, SST_RESOURCE_PublicBucket: undefined },
        providers({ PAYLOAD_SECRET: "ps" }),
      ),
    ).rejects.toThrow(/link the PublicBucket/);
    await expect(
      readRuntimeConfigFromAws(
        env,
        providers({ PAYLOAD_SECRET: "ps", JOB_PLATFORM_WEBHOOK_URL: "u" }),
      ),
    ).rejects.toThrow(/WEBHOOK_SECRET is missing/);
  });

  it("rejects a malformed database port", async () => {
    for (const port of ["abc", 0, 70000, 54.5]) {
      await expect(
        readRuntimeConfigFromAws(
          {
            ...env,
            SST_RESOURCE_Database: JSON.stringify({
              auth: "iam",
              host: "h",
              port,
              database: "dilm",
              username: "payload_app",
            }),
          },
          providers({ PAYLOAD_SECRET: "ps" }),
        ),
      ).rejects.toThrow(/malformed "port"/);
    }
  });
});

describe("awsConfigProviders.ssmParameters", () => {
  it("fails loudly, without values, when a required name is unknown", async () => {
    ssmSend.mockResolvedValueOnce({
      Parameters: [{ Name: "/dilm/staging/PREVIEW_SECRET", Value: "leak" }],
      InvalidParameters: ["/dilm/staging/PAYLOAD_SECRET"],
    });
    const failure = awsConfigProviders.ssmParameters(
      "/dilm/staging",
      ["PAYLOAD_SECRET", "PREVIEW_SECRET"],
      "ap-southeast-3",
    );
    await expect(failure).rejects.toThrow(/PAYLOAD_SECRET/);
    await expect(
      failure.catch((error: Error) => error.message),
    ).resolves.not.toContain("leak");
  });

  it("tolerates unknown optional names", async () => {
    ssmSend.mockResolvedValueOnce({
      Parameters: [{ Name: "/dilm/staging/PAYLOAD_SECRET", Value: "ps" }],
      InvalidParameters: ["/dilm/staging/PREVIEW_SECRET"],
    });
    await expect(
      awsConfigProviders.ssmParameters(
        "/dilm/staging",
        ["PAYLOAD_SECRET", "PREVIEW_SECRET"],
        "ap-southeast-3",
      ),
    ).resolves.toEqual({ PAYLOAD_SECRET: "ps" });
  });
});

describe("readSstResource", () => {
  it("rejects malformed JSON and returns undefined when absent", () => {
    expect(readSstResource({}, "X")).toBeUndefined();
    expect(() => readSstResource({ SST_RESOURCE_X: "{" }, "X")).toThrow(
      /not a JSON object/,
    );
    expect(() => readSstResource({ SST_RESOURCE_X: "[1]" }, "X")).toThrow(
      /not a JSON object/,
    );
  });
});

describe("readSstResource from the encrypted resource file", () => {
  it("reads links SST v4 writes to SST_KEY_FILE instead of SST_RESOURCE_*", async () => {
    const { createCipheriv, randomBytes } = await import("node:crypto");
    const { mkdtempSync, writeFileSync } = await import("node:fs");
    const { tmpdir } = await import("node:os");
    const { join } = await import("node:path");
    const key = randomBytes(32);
    const cipher = createCipheriv("aes-256-gcm", key, Buffer.alloc(12, 0));
    const body = Buffer.concat([
      cipher.update(
        JSON.stringify({
          RuntimeConfigParameters: { prefix: "/dilm/staging" },
        }),
      ),
      cipher.final(),
      cipher.getAuthTag(),
    ]);
    const dir = mkdtempSync(join(tmpdir(), "sst-resource-"));
    writeFileSync(join(dir, "resource.enc"), body);
    const env = {
      SST_KEY: key.toString("base64"),
      SST_KEY_FILE: "resource.enc",
      LAMBDA_TASK_ROOT: dir,
    };
    expect(readSstResource(env, "RuntimeConfigParameters")).toEqual({
      prefix: "/dilm/staging",
    });
    expect(readSstResource(env, "Missing")).toBeUndefined();
  });
});
