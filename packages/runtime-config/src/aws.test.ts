import { describe, expect, it, vi } from "vitest";

import {
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
});

describe("readSstResource", () => {
  it("rejects malformed JSON and returns undefined when absent", () => {
    expect(readSstResource({}, "X")).toBeUndefined();
    expect(() => readSstResource({ SST_RESOURCE_X: "{" }, "X")).toThrow(
      /not a JSON object/,
    );
  });
});
