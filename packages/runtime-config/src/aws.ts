import {
  AWS_REGION,
  DEFAULT_CV_RETENTION_MONTHS,
  type DatabaseConfig,
  type EmailConfig,
  type JobPlatformConfig,
  type QueueConfig,
  type RuntimeConfig,
} from "./config";
import {
  EDGE_PARAMETER_NAMES,
  edgeConfigFrom,
  type EdgeConfig,
} from "./revalidate";

type Env = Record<string, string | undefined>;

export const SSM_PARAMETER_NAMES = [
  "PAYLOAD_SECRET",
  "PREVIEW_SECRET",
  "JOB_PLATFORM_WEBHOOK_URL",
  "JOB_PLATFORM_WEBHOOK_SECRET",
  "REVALIDATE_SECRET",
] as const;
const REQUIRED_SSM_PARAMETER_NAMES: readonly SsmParameterName[] = [
  "PAYLOAD_SECRET",
];
export type SsmParameterName = (typeof SSM_PARAMETER_NAMES)[number];

export interface AwsConfigProviders {
  ssmParameters(
    prefix: string,
    names: readonly string[],
    region: string,
  ): Promise<Partial<Record<string, string>>>;
}

export const awsConfigProviders: AwsConfigProviders = {
  async ssmParameters(prefix, names, region) {
    const { GetParametersCommand, SSMClient } =
      await import("@aws-sdk/client-ssm");
    const { Parameters = [], InvalidParameters = [] } = await new SSMClient({
      region,
    }).send(
      new GetParametersCommand({
        Names: names.map((name) => `${prefix}/${name}`),
        WithDecryption: true,
      }),
    );
    const unknown = REQUIRED_SSM_PARAMETER_NAMES.filter(
      (name) =>
        names.includes(name) && InvalidParameters.includes(`${prefix}/${name}`),
    );
    if (unknown.length > 0) {
      throw new Error(
        `SSM does not know the required parameter(s): ${unknown.join(", ")} under ${prefix}.`,
      );
    }
    const found: Partial<Record<string, string>> = {};
    for (const { Name, Value } of Parameters) {
      if (Name === undefined || Value === undefined) continue;
      found[Name.slice(prefix.length + 1)] = Value;
    }
    return found;
  },
};

const encryptedResources = new Map<string, Record<string, unknown>>();

function encryptedSstResources(env: Env): Record<string, unknown> | undefined {
  const key = env.SST_KEY;
  const file = env.SST_KEY_FILE;
  if (!key || !file) return undefined;
  const { createDecipheriv } = process.getBuiltinModule("node:crypto");
  const { readFileSync } = process.getBuiltinModule("node:fs");
  const { isAbsolute, join } = process.getBuiltinModule("node:path");
  const path = isAbsolute(file)
    ? file
    : join(env.LAMBDA_TASK_ROOT ?? process.cwd(), file);
  const cached = encryptedResources.get(path);
  if (cached) return cached;
  const data = readFileSync(path);
  const decipher = createDecipheriv(
    "aes-256-gcm",
    Buffer.from(key, "base64"),
    Buffer.alloc(12, 0),
  );
  decipher.setAuthTag(data.subarray(-16));
  const plain = Buffer.concat([
    decipher.update(data.subarray(0, -16)),
    decipher.final(),
  ]).toString("utf8");
  const resources = JSON.parse(plain) as Record<string, unknown>;
  encryptedResources.set(path, resources);
  return resources;
}

function asObject(
  value: unknown,
  name: string,
): Record<string, unknown> | undefined {
  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  throw new Error(`SST_RESOURCE_${name} is not a JSON object.`);
}

export function readSstResource(
  env: Env,
  name: string,
): Record<string, unknown> | undefined {
  const raw = env[`SST_RESOURCE_${name}`];
  if (raw !== undefined && raw !== "") {
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      throw new Error(`SST_RESOURCE_${name} is not a JSON object.`);
    }
    return asObject(parsed, name);
  }
  const linked = encryptedSstResources(env)?.[name];
  return linked === undefined ? undefined : asObject(linked, name);
}

function requiredResource(env: Env, name: string): Record<string, unknown> {
  const resource = readSstResource(env, name);
  if (resource === undefined) {
    throw new Error(
      `SST_RESOURCE_${name} is not set: link the ${name} resource to this function.`,
    );
  }
  return resource;
}

function text(
  resource: Record<string, unknown>,
  resourceName: string,
  key: string,
): string {
  const value = resource[key];
  if (typeof value !== "string" || value === "") {
    throw new Error(`The ${resourceName} resource is missing "${key}".`);
  }
  return value;
}

function portOf(resource: Record<string, unknown>): number {
  const port = Number(resource.port ?? 5432);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error(`The Database resource has a malformed "port".`);
  }
  return port;
}

function databaseFromResource(env: Env, region: string): DatabaseConfig {
  const resource = requiredResource(env, "Database");
  const auth = text(resource, "Database", "auth");
  if (auth === "secret") {
    return {
      auth,
      secretArn: text(resource, "Database", "secretArn"),
      region,
    };
  }
  if (auth === "iam") {
    return {
      auth,
      host: text(resource, "Database", "host"),
      port: portOf(resource),
      database: text(resource, "Database", "database"),
      user: text(resource, "Database", "username"),
      region,
    };
  }
  throw new Error(
    `The Database resource has auth "${auth}"; the AWS source supports "secret" and "iam".`,
  );
}

function emailFromResource(env: Env, region: string): EmailConfig {
  const resource = requiredResource(env, "EmailSender");
  if (text(resource, "EmailSender", "mode") !== "shared") {
    return { transport: "ses", region };
  }
  return {
    transport: "ses",
    region,
    sharedSender: {
      address: text(resource, "EmailSender", "address").toLowerCase(),
      identity: text(resource, "EmailSender", "identity").toLowerCase(),
    },
  };
}

function queueFromResource(env: Env, region: string): QueueConfig | undefined {
  const resource = readSstResource(env, "CvQueue");
  if (resource === undefined) return undefined;
  return { region, cvQueueUrl: text(resource, "CvQueue", "url") };
}

function retentionMonths(env: Env): number {
  const raw = env.CV_RETENTION_MONTHS?.trim();
  if (raw === undefined || raw === "") return DEFAULT_CV_RETENTION_MONTHS;
  const months = Number(raw);
  if (!Number.isInteger(months) || months < 1) {
    throw new Error(
      `CV_RETENTION_MONTHS must be a whole number above 0, got "${raw}".`,
    );
  }
  return months;
}

export async function loadEdgeConfig(
  env: Env,
  providers: AwsConfigProviders = awsConfigProviders,
): Promise<EdgeConfig> {
  if (env.RUNTIME_CONFIG_SOURCE === "env") {
    return edgeConfigFrom({
      REVALIDATE_SECRET: env.REVALIDATE_SECRET,
      CLOUDFLARE_API_TOKEN: env.CLOUDFLARE_API_TOKEN,
      CLOUDFLARE_ZONE_IDS: env.CLOUDFLARE_ZONE_IDS,
    });
  }
  const prefix = env.RUNTIME_CONFIG_SSM_PREFIX?.trim().replace(/\/+$/, "");
  if (!prefix) {
    throw new Error("RUNTIME_CONFIG_SSM_PREFIX is not set.");
  }
  const found = await providers.ssmParameters(
    prefix,
    EDGE_PARAMETER_NAMES,
    env.AWS_REGION?.trim() || AWS_REGION,
  );
  return edgeConfigFrom(found);
}

export async function readRuntimeConfigFromAws(
  env: Env,
  providers: AwsConfigProviders = awsConfigProviders,
): Promise<RuntimeConfig> {
  const region = env.AWS_REGION?.trim() || AWS_REGION;
  const prefix = (
    env.RUNTIME_CONFIG_SSM_PREFIX?.trim() ||
    (readSstResource(env, "RuntimeConfigParameters")?.prefix as
      string | undefined)
  )?.replace(/\/+$/, "");
  if (!prefix) {
    throw new Error(
      "RUNTIME_CONFIG_SSM_PREFIX is not set and the RuntimeConfigParameters resource is not linked.",
    );
  }

  const parameters = await providers.ssmParameters(
    prefix,
    SSM_PARAMETER_NAMES,
    region,
  );
  const payloadSecret = parameters.PAYLOAD_SECRET;
  if (payloadSecret === undefined || payloadSecret === "") {
    throw new Error(`SSM parameter ${prefix}/PAYLOAD_SECRET is missing.`);
  }
  const webhookUrl = parameters.JOB_PLATFORM_WEBHOOK_URL;
  const webhookSecret = parameters.JOB_PLATFORM_WEBHOOK_SECRET;
  if (webhookUrl && !webhookSecret) {
    throw new Error(
      `SSM parameter ${prefix}/JOB_PLATFORM_WEBHOOK_SECRET is missing.`,
    );
  }
  const jobPlatform: JobPlatformConfig | undefined = webhookUrl
    ? { webhookUrl, webhookSecret: webhookSecret ?? "" }
    : undefined;

  return {
    database: databaseFromResource(env, region),
    cvRetentionMonths: retentionMonths(env),
    payloadSecret,
    previewSecret: parameters.PREVIEW_SECRET || undefined,
    revalidateSecret: parameters.REVALIDATE_SECRET || undefined,
    storage: {
      region,
      publicBucket: text(
        requiredResource(env, "PublicBucket"),
        "PublicBucket",
        "name",
      ),
      privateBucket: text(
        requiredResource(env, "CvPrivateBucket"),
        "CvPrivateBucket",
        "name",
      ),
    },
    email: emailFromResource(env, region),
    queue: queueFromResource(env, region),
    jobPlatform,
  };
}
