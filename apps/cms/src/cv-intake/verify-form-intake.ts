import { randomUUID } from "node:crypto";
import { Writable } from "node:stream";

import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getRuntimeConfig, runtimeConfigSource } from "@dilm/runtime-config";
import type {
  ContactQueueMessage,
  CvQueueMessage,
  TenantSlug,
} from "@dilm/shared-types";
import type { SQSRecord } from "aws-lambda";
import { getPayload } from "payload";

import { cmsConfig } from "../config";
import { SYSTEM_WRITE } from "../fields/systemWrite";
import { processRecord } from "./handler";

const TENANT: TenantSlug = "duniakimia";
const MAILPIT_URL = process.env.MAILPIT_URL ?? "http://localhost:8025";
const IP_PATTERN =
  /\b(?:\d{1,3}\.){3}\d{1,3}\b|\b(?:[0-9a-f]{1,4}:){3,7}[0-9a-f]{1,4}\b/i;

if (process.argv.includes("--help")) {
  console.error(
    "usage: pnpm --filter @dilm/cms verify:form-intake\n\n" +
      "Runs the form-intake consumer (CV and contact) against the local " +
      "Docker stack with synthetic messages. It checks, for one cv and one " +
      "contact message: one submission, one consent record with the " +
      "message's policy version, the expected emails in Mailpit, consent " +
      "written before every email, no duplicates on redelivery, a forced " +
      "send failure retried without re-sending what already went out, " +
      "invalid messages rejected, no IP address or form content in " +
      "consent-logs or log lines, and consent surviving deletion of its " +
      "submission. Everything it creates is deleted afterwards. Local only: " +
      "needs RUNTIME_CONFIG_SOURCE=env, SMTP_HOST (Mailpit), MinIO and " +
      "seeded tenants.",
  );
  process.exit(2);
}

const runtimeConfig = await getRuntimeConfig();
if (
  runtimeConfigSource(process.env) !== "env" ||
  runtimeConfig.email.transport !== "smtp"
) {
  console.error(
    "verify:form-intake needs the local stack: RUNTIME_CONFIG_SOURCE=env and SMTP_HOST pointing at Mailpit.",
  );
  process.exit(2);
}

const LOCAL_HOSTS = ["localhost", "127.0.0.1", "::1", "[::1]"];
const hostOf = (value: string) => {
  try {
    return new URL(value).hostname;
  } catch {
    return value;
  }
};
const nonLocal = [
  ["DATABASE_HOST", process.env.DATABASE_HOST ?? "(unset)"],
  ["MAILPIT_URL", hostOf(MAILPIT_URL)],
  ...(runtimeConfig.storage.endpointOverride
    ? [["S3 endpoint", hostOf(runtimeConfig.storage.endpointOverride.url)]]
    : [["S3 endpoint", "(none: real AWS)"]]),
].filter(([, host]) => !LOCAL_HOSTS.includes(host as string));
if (nonLocal.length > 0) {
  console.error(
    `verify:form-intake changes tenant settings and deletes consent rows, so it only runs against the local stack. Not local: ${nonLocal.map(([name, host]) => `${name}=${host}`).join(", ")}.`,
  );
  process.exit(2);
}

const logged: string[] = [];
const logSink = new Writable({
  write(chunk, _encoding, done) {
    logged.push(String(chunk));
    process.stdout.write(chunk);
    done();
  },
});

const { storage } = runtimeConfig;
const s3 = new S3Client({
  region: storage.region,
  ...(storage.endpointOverride && {
    endpoint: storage.endpointOverride.url,
    credentials: storage.endpointOverride.credentials,
    forcePathStyle: true,
  }),
});

const payload = await getPayload({
  config: Promise.resolve({
    ...(await cmsConfig("cv-consumer")),
    logger: { destination: logSink, options: {} },
  }) as never,
});
const intake = {
  payload,
  jobPlatform: {
    webhookUrl: "http://127.0.0.1:9/unused",
    webhookSecret: "unused",
  },
  fetch: (async () => new Response(null, { status: 202 })) as typeof fetch,
};
const failures: string[] = [];
const check = (ok: boolean, failure: string) => {
  if (!ok) failures.push(failure);
};

const run = randomUUID();
const cvId = randomUUID();
const contactId = randomUUID();
const RECRUITER = `recruiter-${run}@example.invalid`;
const TEAM = `team-${run}@example.invalid`;
const APPLICANT = `applicant-${run}@example.invalid`;
const SENDER = `sender-${run}@example.invalid`;
const resumeFileKey = `cv/${TENANT}/${cvId}.pdf`;
const POLICY = "2026-01";

const cvMessage: CvQueueMessage = {
  kind: "cv",
  submissionId: cvId,
  tenant: TENANT,
  fields: {
    applicantName: "Intake Check Applicant",
    email: APPLICANT,
    phone: "+62 812 0000 0001",
    position: "Verification Engineer",
  },
  resumeFileKey,
  consent: { policyVersion: POLICY },
};
const contactMessage: ContactQueueMessage = {
  kind: "contact",
  submissionId: contactId,
  tenant: TENANT,
  locale: "en",
  fields: {
    fullName: "Intake Check Sender",
    company: "Verification Works",
    workEmail: SENDER,
    phone: "+62 812 0000 0002",
    message: "Synthetic inquiry text for the verification pass.",
  },
  consent: { policyVersion: POLICY },
};

function delivery(body: unknown, receiveCount: number): SQSRecord {
  return {
    messageId: randomUUID(),
    receiptHandle: "local",
    body: typeof body === "string" ? body : JSON.stringify(body),
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

const attempt = (body: unknown, receiveCount: number) =>
  processRecord(intake, delivery(body, receiveCount)).then(
    () => "succeeded",
    (error: Error) => `${error.name}: ${error.message}`,
  );

interface MailpitMessage {
  Created: string;
  To: { Address: string }[];
}

async function emailsTo(address: string): Promise<MailpitMessage[]> {
  const response = await fetch(
    `${MAILPIT_URL}/api/v1/search?query=${encodeURIComponent(`to:"${address}"`)}`,
  );
  if (!response.ok) throw new Error(`Mailpit answered ${response.status}`);
  return ((await response.json()) as { messages: MailpitMessage[] }).messages;
}

const consentRows = async (relatedRecordId: string) =>
  (
    await payload.find({
      collection: "consent-logs",
      where: { relatedRecordId: { equals: relatedRecordId } },
      depth: 0,
      overrideAccess: true,
      context: SYSTEM_WRITE,
    })
  ).docs;

const cvRows = async () =>
  (
    await payload.find({
      collection: "cv-submissions",
      where: { submissionId: { equals: cvId } },
      depth: 0,
    })
  ).docs;

const contactRows = async () =>
  (
    await payload.find({
      collection: "contact-submissions",
      where: { submissionId: { equals: contactId } },
      depth: 0,
    })
  ).docs;

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
      data: { recruiterEmail: RECRUITER, contactEmail: TEAM },
    })
  : await payload.create({
      collection: "tenant-settings",
      data: {
        tenant: tenant.id,
        siteName: "Intake check",
        privacyPolicyVersion: "2026-11",
        recruiterEmail: RECRUITER,
        contactEmail: TEAM,
      },
    });

const realSendEmail = payload.sendEmail.bind(payload);
let failTeamOnce = true;
payload.sendEmail = (async (message: { to?: unknown }) => {
  if (failTeamOnce && message.to === TEAM) {
    failTeamOnce = false;
    throw new Error("forced send failure");
  }
  return realSendEmail(message as never);
}) as typeof payload.sendEmail;

try {
  await s3.send(
    new PutObjectCommand({
      Bucket: storage.privateBucket,
      Key: resumeFileKey,
      Body: "%PDF-1.4\n% intake check\n",
      ContentType: "application/pdf",
    }),
  );

  const cvFirst = await attempt(cvMessage, 1);
  check(cvFirst === "succeeded", `cv delivery 1: ${cvFirst}`);
  const contactFirst = await attempt(contactMessage, 1);
  check(
    contactFirst.includes("ContactIntakeError"),
    `contact delivery 1 should fail on the forced team-email failure, got: ${contactFirst}`,
  );
  const afterFirst = {
    sender: (await emailsTo(SENDER)).length,
    team: (await emailsTo(TEAM)).length,
  };
  check(
    afterFirst.sender === 1 && afterFirst.team === 0,
    `after the forced failure: ${afterFirst.sender} sender and ${afterFirst.team} team emails, expected 1 and 0`,
  );

  for (const receiveCount of [2, 3]) {
    check(
      (await attempt(cvMessage, receiveCount)) === "succeeded",
      `cv redelivery ${receiveCount} failed`,
    );
    check(
      (await attempt(contactMessage, receiveCount)) === "succeeded",
      `contact redelivery ${receiveCount} failed`,
    );
  }

  check(
    (await cvRows()).length === 1,
    "cv-submissions does not hold exactly 1 record",
  );
  check(
    (await contactRows()).length === 1,
    "contact-submissions does not hold exactly 1 record",
  );
  const cvConsent = await consentRows(cvId);
  const contactConsent = await consentRows(contactId);
  check(
    cvConsent.length === 1 &&
      cvConsent[0]?.consentType === "career-application" &&
      cvConsent[0].policyVersion === POLICY,
    `cv consent: ${cvConsent.length} record(s), expected 1 career-application at ${POLICY}`,
  );
  check(
    contactConsent.length === 1 &&
      contactConsent[0]?.consentType === "contact-form" &&
      contactConsent[0].policyVersion === POLICY,
    `contact consent: ${contactConsent.length} record(s), expected 1 contact-form at ${POLICY}`,
  );

  const expected: [string, string, string][] = [
    ["cv applicant", APPLICANT, cvId],
    ["cv recruiter", RECRUITER, cvId],
    ["contact sender", SENDER, contactId],
    ["contact team", TEAM, contactId],
  ];
  for (const [label, address, id] of expected) {
    const mails = await emailsTo(address);
    check(mails.length === 1, `${mails.length} ${label} emails, expected 1`);
    const consent = (await consentRows(id))[0];
    const consentAt = new Date(consent?.createdAt ?? "").getTime();
    for (const mail of mails) {
      check(
        consentAt <= new Date(mail.Created).getTime(),
        `${label} email (${mail.Created}) precedes its consent record (${consent?.createdAt})`,
      );
    }
    payload.logger.info(`Mailpit: ${mails.length} ${label} email(s)`);
  }

  const invalid: [string, unknown][] = [
    ["unknown kind", { ...contactMessage, kind: "resume" }],
    [
      "missing consent.policyVersion",
      { ...contactMessage, submissionId: randomUUID(), consent: {} },
    ],
    ["not JSON", "{"],
  ];
  for (const [label, body] of invalid) {
    const outcome = await attempt(body, 1);
    check(
      outcome.startsWith("InvalidCvQueueMessageError"),
      `invalid message (${label}) was not rejected: ${outcome}`,
    );
  }

  const rowsText = JSON.stringify([...cvConsent, ...contactConsent]);
  check(!IP_PATTERN.test(rowsText), "a consent-logs row holds an IP address");
  const formValues = [
    ...Object.values(cvMessage.fields),
    ...Object.values(contactMessage.fields),
  ];
  check(
    !formValues.some((value) => rowsText.includes(value)),
    "a consent-logs row holds form content",
  );
  const logText = logged.join("");
  payload.logger.info(`captured ${logged.length} log chunk(s)`);
  check(logged.length > 0, "no log lines captured; log check is vacuous");
  check(!IP_PATTERN.test(logText), "a log line holds an IP address");
  check(
    !formValues.some((value) => logText.includes(value)),
    "a log line holds form content",
  );

  await payload.delete({
    collection: "cv-submissions",
    where: { submissionId: { equals: cvId } },
  });
  await payload.delete({
    collection: "contact-submissions",
    where: { submissionId: { equals: contactId } },
  });
  check(
    (await consentRows(cvId)).length === 1 &&
      (await consentRows(contactId)).length === 1,
    "deleting a submission removed its consent record",
  );
  check(
    (await cvRows()).length === 0 && (await contactRows()).length === 0,
    "a deleted submission can still be looked up by its reference, so the admin would still link it",
  );
} finally {
  const cleanup = async (name: string, step: () => Promise<unknown>) => {
    try {
      await step();
    } catch (error) {
      failures.push(`cleanup "${name}" failed: ${(error as Error).message}`);
    }
  };
  await cleanup("restore tenant-settings", async () => {
    if (existingSettings) {
      await payload.update({
        collection: "tenant-settings",
        id: settings.id,
        data: {
          recruiterEmail: existingSettings.recruiterEmail ?? null,
          contactEmail: existingSettings.contactEmail ?? null,
        },
      });
    } else {
      await payload.delete({ collection: "tenant-settings", id: settings.id });
    }
  });
  for (const id of [cvId, contactId]) {
    await cleanup(`consent-logs ${id}`, () =>
      payload.delete({
        collection: "consent-logs",
        where: { relatedRecordId: { equals: id } },
        context: SYSTEM_WRITE,
      }),
    );
  }
  await cleanup("cv-submissions", () =>
    payload.delete({
      collection: "cv-submissions",
      where: { submissionId: { equals: cvId } },
    }),
  );
  await cleanup("contact-submissions", () =>
    payload.delete({
      collection: "contact-submissions",
      where: { submissionId: { equals: contactId } },
    }),
  );
  await cleanup("resume object", () =>
    s3.send(
      new DeleteObjectCommand({
        Bucket: storage.privateBucket,
        Key: resumeFileKey,
      }),
    ),
  );
  for (const address of [APPLICANT, RECRUITER, SENDER, TEAM]) {
    await cleanup(`Mailpit messages to ${address}`, async () => {
      const response = await fetch(
        `${MAILPIT_URL}/api/v1/search?query=${encodeURIComponent(`to:"${address}"`)}`,
        { method: "DELETE" },
      );
      if (!response.ok) throw new Error(`Mailpit answered ${response.status}`);
    });
  }
}

for (const failure of failures) payload.logger.error(failure);
payload.logger.info(
  failures.length ? "Form intake NOT working" : "Form intake working",
);

await payload.destroy();
process.exit(failures.length ? 1 : 0);
