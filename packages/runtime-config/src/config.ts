export const AWS_REGION = "ap-southeast-3";

export interface EndpointOverride {
  url: string;
  credentials: {
    accessKeyId: string;
    secretAccessKey: string;
  };
}

export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  ssl: boolean;
}

export interface StorageConfig {
  region: string;
  publicBucket: string;
  privateBucket: string;
  endpointOverride?: EndpointOverride;
}

export type EmailConfig =
  | { transport: "ses"; region: string }
  | { transport: "smtp"; host: string; port: number };

export interface QueueConfig {
  region: string;
  cvQueueUrl: string;
  endpointOverride?: EndpointOverride;
}

export interface JobPlatformConfig {
  webhookUrl: string;
  webhookSecret: string;
}

export interface RuntimeConfig {
  database: DatabaseConfig;
  payloadSecret: string;
  storage: StorageConfig;
  email: EmailConfig;
  queue?: QueueConfig;
  jobPlatform?: JobPlatformConfig;
}
