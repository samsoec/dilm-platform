export const AWS_REGION = "ap-southeast-3";

export interface EndpointOverride {
  url: string;
  credentials: {
    accessKeyId: string;
    secretAccessKey: string;
  };
}

export const DATABASE_AUTH_MODES = ["password", "iam", "secret"] as const;
export type DatabaseAuthMode = (typeof DATABASE_AUTH_MODES)[number];

export interface DatabaseEndpoint {
  host: string;
  port: number;
  database: string;
  user: string;
}

export interface PasswordDatabaseConfig extends DatabaseEndpoint {
  auth: "password";
  password: string;
  ssl: boolean;
}

export interface IamDatabaseConfig extends DatabaseEndpoint {
  auth: "iam";
  region: string;
}

export interface SecretDatabaseConfig {
  auth: "secret";
  secretArn: string;
  region: string;
}

export type DatabaseConfig =
  PasswordDatabaseConfig | IamDatabaseConfig | SecretDatabaseConfig;

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
