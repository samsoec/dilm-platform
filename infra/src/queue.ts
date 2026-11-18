import { databaseMode } from "./database";
import {
  CV_CONSUMER_BATCH_SIZE,
  CV_CONSUMER_MAX_CONCURRENCY,
  CV_CONSUMER_TIMEOUT_SECONDS,
  CV_QUEUE_MAX_RECEIVE_COUNT,
  CV_QUEUE_VISIBILITY_TIMEOUT_SECONDS,
} from "@dilm/shared-types";

export const CV_DLQ_RETENTION_SECONDS = 14 * 24 * 60 * 60;
export const CV_QUEUE_RETENTION_SECONDS = 4 * 24 * 60 * 60;
export const CV_CONSUMER_HANDLER = "src/cv-consumer.handler";

export function cvQueueName(stage: string): string {
  return `dilm-${stage}-cv-intake`;
}

export function cvDeadLetterQueueName(stage: string): string {
  return `${cvQueueName(stage)}-dlq`;
}

export function cvQueueSettings() {
  if (CV_QUEUE_VISIBILITY_TIMEOUT_SECONDS < 6 * CV_CONSUMER_TIMEOUT_SECONDS) {
    throw new Error(
      "The CV queue visibility timeout must be at least 6x the consumer timeout.",
    );
  }
  return {
    visibilityTimeout:
      `${CV_QUEUE_VISIBILITY_TIMEOUT_SECONDS} seconds` as const,
    visibilitySeconds: CV_QUEUE_VISIBILITY_TIMEOUT_SECONDS,
    retentionSeconds: CV_QUEUE_RETENTION_SECONDS,
    sqsManagedSseEnabled: true,
    maxReceiveCount: CV_QUEUE_MAX_RECEIVE_COUNT,
  };
}

export function cvConsumerSettings() {
  return {
    timeout: `${CV_CONSUMER_TIMEOUT_SECONDS} seconds` as const,
    batchSize: CV_CONSUMER_BATCH_SIZE,
    maximumConcurrency: CV_CONSUMER_MAX_CONCURRENCY,
  };
}

export const RDS_CA_BUNDLE_SOURCE = "src/rotation/ap-southeast-3-bundle.pem";
export const RDS_CA_BUNDLE_FILE = "ca-bundle.pem";

export function cvConsumerDatabaseTls(stage: string) {
  if (databaseMode(stage) === "express") return {};
  return {
    copyFiles: [{ from: RDS_CA_BUNDLE_SOURCE, to: RDS_CA_BUNDLE_FILE }],
    environment: { NODE_EXTRA_CA_CERTS: `/var/task/${RDS_CA_BUNDLE_FILE}` },
  };
}
