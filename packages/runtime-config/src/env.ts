import {
  AWS_REGION,
  type EmailConfig,
  type EndpointOverride,
  type JobPlatformConfig,
  type QueueConfig,
  type RuntimeConfig,
} from "./config";

type Env = Record<string, string | undefined>;

export class MissingEnvError extends Error {
  constructor(readonly missing: string[]) {
    super(
      `Missing environment variables: ${missing.join(", ")}. Copy .env.example to .env and fill them in.`,
    );
    this.name = "MissingEnvError";
  }
}

class EnvReader {
  readonly missing: string[] = [];

  constructor(private readonly env: Env) {}

  optional(name: string): string | undefined {
    const value = this.env[name]?.trim();
    return value === undefined || value === "" ? undefined : value;
  }

  required(name: string): string {
    const value = this.optional(name);
    if (value === undefined) {
      this.missing.push(name);
      return "";
    }
    return value;
  }

  port(name: string, fallback: number): number {
    const raw = this.optional(name);
    if (raw === undefined) return fallback;
    const port = Number(raw);
    if (!Number.isInteger(port) || port < 1 || port > 65_535) {
      throw new Error(`${name} must be a TCP port number, got "${raw}".`);
    }
    return port;
  }

  boolean(name: string, fallback: boolean): boolean {
    const raw = this.optional(name);
    if (raw === undefined) return fallback;
    if (raw === "true") return true;
    if (raw === "false") return false;
    throw new Error(`${name} must be "true" or "false", got "${raw}".`);
  }

  endpointOverride(prefix: string): EndpointOverride | undefined {
    const url = this.optional(`${prefix}_ENDPOINT`);
    if (url === undefined) return undefined;
    return {
      url,
      credentials: {
        accessKeyId: this.required(`${prefix}_ACCESS_KEY_ID`),
        secretAccessKey: this.required(`${prefix}_SECRET_ACCESS_KEY`),
      },
    };
  }
}

export function readRuntimeConfigFromEnv(env: Env): RuntimeConfig {
  const read = new EnvReader(env);
  const region = read.optional("AWS_REGION") ?? AWS_REGION;

  const smtpHost = read.optional("SMTP_HOST");
  const email: EmailConfig =
    smtpHost === undefined
      ? { transport: "ses", region }
      : {
          transport: "smtp",
          host: smtpHost,
          port: read.port("SMTP_PORT", 1025),
        };

  const cvQueueUrl = read.optional("CV_QUEUE_URL");
  const queue: QueueConfig | undefined =
    cvQueueUrl === undefined
      ? undefined
      : { region, cvQueueUrl, endpointOverride: read.endpointOverride("SQS") };

  const webhookUrl = read.optional("JOB_PLATFORM_WEBHOOK_URL");
  const jobPlatform: JobPlatformConfig | undefined =
    webhookUrl === undefined
      ? undefined
      : {
          webhookUrl,
          webhookSecret: read.required("JOB_PLATFORM_WEBHOOK_SECRET"),
        };

  const config: RuntimeConfig = {
    database: {
      host: read.required("DATABASE_HOST"),
      port: read.port("DATABASE_PORT", 5432),
      database: read.required("DATABASE_NAME"),
      user: read.required("DATABASE_USER"),
      password: read.required("DATABASE_PASSWORD"),
      ssl: read.boolean("DATABASE_SSL", true),
    },
    payloadSecret: read.required("PAYLOAD_SECRET"),
    storage: {
      region,
      publicBucket: read.required("S3_PUBLIC_BUCKET"),
      privateBucket: read.required("S3_PRIVATE_BUCKET"),
      endpointOverride: read.endpointOverride("S3"),
    },
    email,
    queue,
    jobPlatform,
  };

  if (read.missing.length > 0) throw new MissingEnvError(read.missing);
  return config;
}
