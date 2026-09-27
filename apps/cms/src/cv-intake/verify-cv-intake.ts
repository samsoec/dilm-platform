import { randomUUID } from "node:crypto";
import { createServer, type IncomingHttpHeaders } from "node:http";
import type { AddressInfo } from "node:net";

import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getRuntimeConfig, runtimeConfigSource } from "@dilm/runtime-config";
import type { CvQueueMessage, TenantSlug } from "@dilm/shared-types";
import type { SQSRecord } from "aws-lambda";
import { getPayload } from "payload";

import { cmsConfig } from "../config";
import { processRecord } from "./handler";
import {
  IDEMPOTENCY_HEADER,
  SIGNATURE_HEADER,
  signWebhookBody,
} from "./webhook";

const TENANT: TenantSlug = "duniakimia";
const RECRUITER = "recruiter-check@example.invalid";
const MAILPIT_URL = process.env.MAILPIT_URL ?? "http://localhost:8025";

if (process.argv.includes("--help")) {
  console.error(
    "usage: pnpm --filter @dilm/cms verify:cv-intake\n\n" +
      "Runs the CV-intake consumer against the local Docker stack. It puts a " +
      "résumé in the private MinIO bucket, starts a request-capture server " +
      "as the job-platform webhook (failing its first call), then hands the " +
      "consumer the same synthetic SQS message three times. It checks there " +
      "is one cv-submissions record, one applicant and one recruiter email " +
      "in Mailpit, and exactly one accepted, correctly signed webhook call. " +
      "The record and résumé are deleted afterwards. Local only: needs " +
      "RUNTIME_CONFIG_SOURCE=env, SMTP_HOST (Mailpit) and seeded tenants.",
  );
  process.exit(2);
}

const runtimeConfig = await getRuntimeConfig();
if (
  runtimeConfigSource(process.env) !== "env" ||
  runtimeConfig.email.transport !== "smtp"
) {
  console.error(
    "verify:cv-intake needs the local stack: RUNTIME_CONFIG_SOURCE=env and SMTP_HOST pointing at Mailpit.",
  );
  process.exit(2);
}

interface Captured {
  headers: IncomingHttpHeaders;
  body: string;
  answered: number;
}

const captured: Captured[] = [];
const capture = createServer((request, response) => {
  const chunks: Buffer[] = [];
  request.on("data", (chunk: Buffer) => chunks.push(chunk));
  request.on("end", () => {
    const answered = captured.length === 0 ? 503 : 202;
    captured.push({
      headers: request.headers,
      body: Buffer.concat(chunks).toString("utf8"),
      answered,
    });
    response.writeHead(answered).end();
  });
});
await new Promise<void>((resolve) => capture.listen(0, "127.0.0.1", resolve));
const webhookUrl = `http://127.0.0.1:${(capture.address() as AddressInfo).port}/webhook`;
const webhookSecret = randomUUID();

const { storage } = runtimeConfig;
const s3 = new S3Client({
  region: storage.region,
  ...(storage.endpointOverride && {
    endpoint: storage.endpointOverride.url,
    credentials: storage.endpointOverride.credentials,
    forcePathStyle: true,
  }),
});

const payload = await getPayload({ config: cmsConfig("cv-consumer") });
const intake = { payload, jobPlatform: { webhookUrl, webhookSecret } };
const failures: string[] = [];
const check = (ok: boolean, failure: string) => {
  if (!ok) failures.push(failure);
};

const submissionId = randomUUID();
const resumeFileKey = `cv/${TENANT}/${submissionId}.pdf`;
const message: CvQueueMessage = {
  submissionId,
  tenant: TENANT,
  fields: {
    applicantName: "Intake Check",
    email: `applicant-${submissionId}@example.invalid`,
    phone: "+62 812 0000 0000",
    position: "Verification Engineer",
  },
  resumeFileKey,
};

function delivery(receiveCount: number): SQSRecord {
  return {
    messageId: randomUUID(),
    receiptHandle: "local",
    body: JSON.stringify(message),
    attributes: {
      ApproximateReceiveCount: String(receiveCount),
      SentTimestamp: String(Date.now()),
      SenderId: "local",
      ApproximateFirstReceiveTimestamp: String(Date.now()),
    },
    messageAttributes: {},
    md5OfBody: "",
    eventSource: "aws:sqs",
    eventSourceARN: "arn:aws:sqs:ap-southeast-3:000000000000:dilm-local-cv",
    awsRegion: "ap-southeast-3",
  };
}

async function mailpitCount(to: string): Promise<number> {
  const response = await fetch(
    `${MAILPIT_URL}/api/v1/search?query=${encodeURIComponent(`to:"${to}" ${submissionId}`)}`,
  );
  if (!response.ok) throw new Error(`Mailpit answered ${response.status}`);
  return ((await response.json()) as { messages_count: number }).messages_count;
}

async function records() {
  return (
    await payload.find({
      collection: "cv-submissions",
      where: { submissionId: { equals: submissionId } },
      depth: 0,
    })
  ).docs;
}

const {
  docs: [tenant],
} = await payload.find({
  collection: "tenants",
  where: { slug: { equals: TENANT } },
  depth: 0,
});
if (!tenant) {
  payload.logger.error(
    `tenant ${TENANT} missing; run pnpm --filter cms seed:tenants`,
  );
  process.exit(1);
}
const {
  docs: [existingSettings],
} = await payload.find({
  collection: "tenant-settings",
  where: { tenant: { equals: tenant.id } },
  depth: 0,
});
const settings = existingSettings
  ? await payload.update({
      collection: "tenant-settings",
      id: existingSettings.id,
      data: { recruiterEmail: RECRUITER },
    })
  : await payload.create({
      collection: "tenant-settings",
      data: {
        tenant: tenant.id,
        siteName: "Intake check",
        recruiterEmail: RECRUITER,
      },
    });

try {
  await s3.send(
    new PutObjectCommand({
      Bucket: storage.privateBucket,
      Key: resumeFileKey,
      Body: "%PDF-1.4\n% intake check\n",
      ContentType: "application/pdf",
    }),
  );

  const first = await processRecord(intake, delivery(1)).then(
    () => "succeeded",
    (error: Error) => error.message,
  );
  payload.logger.info(`delivery 1 (webhook answers 503): ${first}`);
  check(
    first.includes("HTTP 503"),
    `delivery 1 should fail on the webhook, got: ${first}`,
  );
  let [record] = await records();
  check(
    record?.externalSyncStatus === "failed" &&
      record.externalSyncAttempts === 1,
    `after delivery 1 sync is ${record?.externalSyncStatus}/${record?.externalSyncAttempts}, expected failed/1`,
  );

  for (const receiveCount of [2, 3]) {
    await processRecord(intake, delivery(receiveCount));
    payload.logger.info(`delivery ${receiveCount}: succeeded`);
  }

  const stored = await records();
  record = stored[0];
  check(
    stored.length === 1,
    `${stored.length} cv-submissions records, expected 1`,
  );
  check(
    record?.externalSyncStatus === "synced" &&
      record.externalSyncAttempts === 2,
    `sync ended ${record?.externalSyncStatus}/${record?.externalSyncAttempts}, expected synced/2`,
  );
  check(
    Boolean(record?.applicantNotifiedAt && record.recruiterNotifiedAt),
    "notification timestamps not both set",
  );

  const applicantEmails = await mailpitCount(message.fields.email);
  const recruiterEmails = await mailpitCount(RECRUITER);
  payload.logger.info(
    `Mailpit: ${applicantEmails} applicant, ${recruiterEmails} recruiter email(s)`,
  );
  check(
    applicantEmails === 1,
    `${applicantEmails} applicant emails, expected 1`,
  );
  check(
    recruiterEmails === 1,
    `${recruiterEmails} recruiter emails, expected 1`,
  );

  const accepted = captured.filter((call) => call.answered < 300);
  payload.logger.info(
    `webhook: ${captured.length} call(s), ${accepted.length} accepted`,
  );
  check(captured.length === 2, `${captured.length} webhook calls, expected 2`);
  check(
    accepted.length === 1,
    `${accepted.length} accepted webhook calls, expected 1`,
  );
  for (const call of captured) {
    check(
      call.headers[IDEMPOTENCY_HEADER.toLowerCase()] === submissionId,
      "webhook Idempotency-Key is not the submissionId",
    );
    check(
      call.headers[SIGNATURE_HEADER.toLowerCase()] ===
        signWebhookBody(call.body, webhookSecret),
      "webhook signature does not match its body",
    );
  }
} finally {
  await payload.delete({
    collection: "cv-submissions",
    where: { submissionId: { equals: submissionId } },
  });
  await s3.send(
    new DeleteObjectCommand({
      Bucket: storage.privateBucket,
      Key: resumeFileKey,
    }),
  );
  if (existingSettings) {
    await payload.update({
      collection: "tenant-settings",
      id: settings.id,
      data: { recruiterEmail: existingSettings.recruiterEmail ?? null },
    });
  } else {
    await payload.delete({ collection: "tenant-settings", id: settings.id });
  }
  capture.close();
}

for (const failure of failures) payload.logger.error(failure);
payload.logger.info(
  failures.length ? "CV intake NOT working" : "CV intake working",
);

await payload.destroy();
process.exit(failures.length ? 1 : 0);
