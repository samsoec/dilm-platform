import type { AwsScope } from "./ses";

export const DEV_EXPRESS_CLUSTER_ID = "dilm-dev-db";
export const PAYLOAD_DATABASE_NAME = "dilm";
export const PAYLOAD_DATABASE_USER = "payload_app";
export const CI_DEPLOY_ROLE_NAME = "dilm-github-deploy";

const PAYLOAD_RESERVED_CONCURRENCY = 10;

export type DatabaseMode = "express" | "aurora";

export function databaseMode(stage: string): DatabaseMode {
  return stage === "dev" ? "express" : "aurora";
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
