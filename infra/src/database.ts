import type { AwsScope } from "./ses";

export const DEV_EXPRESS_CLUSTER_ID = "dilm-dev-db";
export const PAYLOAD_DATABASE_NAME = "dilm";
export const PAYLOAD_DATABASE_USER = "payload_app";
export const CI_DEPLOY_ROLE_NAME = "dilm-github-deploy";

export const AURORA_ENGINE = "aurora-postgresql";
export const AURORA_MAJOR_VERSION = "16";
export const AURORA_ENGINE_VERSION = `${AURORA_MAJOR_VERSION}.15`;
export const AURORA_PARAMETER_FAMILY = `aurora-postgresql${AURORA_MAJOR_VERSION}`;
export const AURORA_MASTER_USERNAME = "dilm_admin";
export const AURORA_BACKUP_RETENTION_DAYS = 7;
export const AURORA_BACKUP_RETENTION_DAYS_ENV = "AURORA_BACKUP_RETENTION_DAYS";

const PAYLOAD_RESERVED_CONCURRENCY = 10;

export type DatabaseMode = "express" | "aurora";

export function databaseMode(stage: string): DatabaseMode {
  return stage === "dev" ? "express" : "aurora";
}

export function auroraBackupRetentionDays(
  stage: string,
  value: string | undefined = process.env[AURORA_BACKUP_RETENTION_DAYS_ENV],
): number {
  if (value === undefined || value.trim() === "") {
    return AURORA_BACKUP_RETENTION_DAYS;
  }
  const days = Number(value);
  if (!Number.isInteger(days) || days < 1 || days > 35) {
    throw new Error(
      `${AURORA_BACKUP_RETENTION_DAYS_ENV} must be a whole number of days from 1 to 35, got "${value}".`,
    );
  }
  if (stage === "production" && days < AURORA_BACKUP_RETENTION_DAYS) {
    throw new Error(
      `${AURORA_BACKUP_RETENTION_DAYS_ENV}=${days} is below the ${AURORA_BACKUP_RETENTION_DAYS}-day backup retention production requires.`,
    );
  }
  return days;
}

export function payloadReservedConcurrency(stage: string): number | undefined {
  return databaseMode(stage) === "express"
    ? undefined
    : PAYLOAD_RESERVED_CONCURRENCY;
}

export function rdsDbUserArn({
  partition,
  region,
  accountId,
  clusterResourceId,
}: AwsScope & { clusterResourceId: string }): string {
  return `arn:${partition}:rds-db:${region}:${accountId}:dbuser:${clusterResourceId}/${PAYLOAD_DATABASE_USER}`;
}

export function rdsDbConnectPolicy(
  scope: AwsScope & { clusterResourceId: string },
) {
  return {
    Version: "2012-10-17",
    Statement: [
      {
        Sid: "ConnectAsPayloadAppOnly",
        Effect: "Allow",
        Action: ["rds-db:connect"],
        Resource: [rdsDbUserArn(scope)],
      },
    ],
  };
}

export function auroraScaling() {
  return { minCapacity: 0, maxCapacity: 1, secondsUntilAutoPause: 300 };
}

export function auroraParameters() {
  return [
    { name: "rds.force_ssl", value: "1" },
    { name: "password_encryption", value: "scram-sha-256" },
  ];
}

export function auroraPayloadAppSecretName(stage: string): string {
  return `dilm-${stage}-payload-app`;
}
