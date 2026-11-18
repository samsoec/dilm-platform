import { databaseMode } from "./database";
import { RDS_CA_BUNDLE_FILE, RDS_CA_BUNDLE_SOURCE } from "./queue";
import { CV_CONSUMER_MAX_CONCURRENCY } from "@dilm/shared-types";

export const PAYLOAD_BUNDLE_DIR =
  "apps/cms/.open-next/server-functions/default";
export const PAYLOAD_HANDLER = "index.handler";
export const PAYLOAD_MEMORY = "2048 MB" as const;
export const PAYLOAD_TIMEOUT = "28 seconds" as const;

export const LAMBDA_MIN_UNRESERVED_CONCURRENCY = 10;
export const PAYLOAD_RESERVED_CONCURRENCY_TARGET = 10;
export const PAYLOAD_THROTTLE_RATE_WITHOUT_RESERVATION = 4;
export const PAYLOAD_THROTTLE_BURST_WITHOUT_RESERVATION = 8;

export interface PayloadConcurrencyPlan {
  reserved: number | undefined;
  apiThrottle: { rateLimit: number; burstLimit: number } | undefined;
  warning: string | undefined;
}

export function payloadConcurrencyPlan(
  stage: string,
  accountLimit: number | undefined,
): PayloadConcurrencyPlan {
  if (databaseMode(stage) === "express") {
    return { reserved: undefined, apiThrottle: undefined, warning: undefined };
  }
  const reservable =
    accountLimit === undefined
      ? 0
      : Math.max(0, accountLimit - LAMBDA_MIN_UNRESERVED_CONCURRENCY);
  const reserved = Math.min(PAYLOAD_RESERVED_CONCURRENCY_TARGET, reservable);
  if (reserved === PAYLOAD_RESERVED_CONCURRENCY_TARGET) {
    return { reserved, apiThrottle: undefined, warning: undefined };
  }
  const known =
    accountLimit === undefined
      ? "could not read the account's Lambda concurrency limit"
      : `the account allows ${accountLimit} concurrent executions and AWS keeps ${LAMBDA_MIN_UNRESERVED_CONCURRENCY} unreserved`;
  const scope =
    reserved > 0
      ? `reserving ${reserved} instead of ${PAYLOAD_RESERVED_CONCURRENCY_TARGET}`
      : "skipping reserved concurrency";
  return {
    reserved: reserved > 0 ? reserved : undefined,
    apiThrottle: {
      rateLimit: PAYLOAD_THROTTLE_RATE_WITHOUT_RESERVATION,
      burstLimit: PAYLOAD_THROTTLE_BURST_WITHOUT_RESERVATION,
    },
    warning: `Payload function: ${known}; ${scope}. The admin API stage is throttled instead so the CV consumer (max concurrency ${CV_CONSUMER_MAX_CONCURRENCY}) keeps capacity. Request a Lambda concurrency quota increase to get the full reservation.`,
  };
}

export async function readAccountConcurrencyLimit(
  region: string,
): Promise<number | undefined> {
  try {
    const { LambdaClient, GetAccountSettingsCommand } =
      await import("@aws-sdk/client-lambda");
    const settings = await new LambdaClient({ region }).send(
      new GetAccountSettingsCommand({}),
    );
    return settings.AccountLimit?.ConcurrentExecutions;
  } catch {
    return undefined;
  }
}

export function payloadFunctionTls(stage: string) {
  if (databaseMode(stage) === "express") return {};
  return {
    copyFiles: [{ from: RDS_CA_BUNDLE_SOURCE, to: RDS_CA_BUNDLE_FILE }],
    environment: { NODE_EXTRA_CA_CERTS: `/var/task/${RDS_CA_BUNDLE_FILE}` },
  };
}
