import { getRuntimeConfig } from "@dilm/runtime-config";
import { parseQueueMessage } from "@dilm/shared-types";
import type { SQSEvent, SQSRecord } from "aws-lambda";
import { getPayload, type Payload } from "payload";

import { cmsConfig } from "../config";
import { processContactMessage } from "./contact-intake";
import { type CvIntakeContext, processCvMessage } from "./intake";

let context: Promise<CvIntakeContext> | undefined;

async function createContext(): Promise<CvIntakeContext> {
  const [payload, { jobPlatform }] = await Promise.all([
    getPayload({ config: cmsConfig("cv-consumer") }),
    getRuntimeConfig(),
  ]);
  return { payload, jobPlatform };
}

export function cvIntakeContext(): Promise<CvIntakeContext> {
  context ??= createContext().catch((error: unknown) => {
    context = undefined;
    throw error;
  });
  return context;
}

export function sentAt(record: SQSRecord): Date {
  return new Date(Number(record.attributes.SentTimestamp));
}

export async function processRecord(
  intake: CvIntakeContext,
  record: SQSRecord,
): Promise<void> {
  const log: Payload["logger"] = intake.payload.logger.child({
    messageId: record.messageId,
    receiveCount: Number(record.attributes.ApproximateReceiveCount),
  });
  try {
    const message = parseQueueMessage(record.body);
    if (message.kind === "contact") {
      await processContactMessage(intake, message, sentAt(record));
    } else {
      await processCvMessage(intake, message, sentAt(record));
    }
  } catch (error) {
    log.error({ err: error }, "Intake failed; SQS will redeliver");
    throw error;
  }
}

export async function handler(event: SQSEvent): Promise<void> {
  const intake = await cvIntakeContext();
  for (const record of event.Records) {
    await processRecord(intake, record);
  }
}
