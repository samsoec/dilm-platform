import type { CvQueueMessage } from "@dilm/shared-types";
import type { Payload } from "payload";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { CvSubmission } from "../payload-types";
import { CvIntakeError, processCvMessage } from "./intake";
import { IDEMPOTENCY_HEADER, SIGNATURE_HEADER } from "./webhook";

type Doc = Record<string, unknown> & { id: number };
type Where = Record<string, { equals: unknown }>;

function fakePayload() {
  const tables: Record<string, Doc[]> = {
    tenants: [
      { id: 1, slug: "duniakimia", defaultLocale: "id" },
      { id: 2, slug: "likutelaga", defaultLocale: "en" },
    ],
    "tenant-settings": [
      { id: 10, tenant: 1, recruiterEmail: "hr@duniakimia.com" },
      { id: 11, tenant: 2, recruiterEmail: null },
    ],
    "cv-submissions": [],
  };
  let nextId = 100;
  const matches = (doc: Doc, where: Where) =>
    Object.entries(where).every(([key, { equals }]) => doc[key] === equals);
  const logger = { info: vi.fn(), warn: vi.fn(), error: vi.fn() };
  const payload = {
    tables,
    sent: [] as Record<string, unknown>[],
    failNextEmail: false,
    logger: { ...logger, child: () => logger },
    find: vi.fn(
      async ({ collection, where }: { collection: string; where: Where }) => ({
        docs: tables[collection]!.filter((doc) => matches(doc, where)),
      }),
    ),
    create: vi.fn(
      async ({ collection, data }: { collection: string; data: object }) => {
        const doc = { id: nextId++, ...data };
        tables[collection]!.push(doc);
        return { ...doc };
      },
    ),
    update: vi.fn(
      async ({
        collection,
        id,
        data,
      }: {
        collection: string;
        id: number;
        data: object;
      }) => {
        const doc = tables[collection]!.find((row) => row.id === id)!;
        Object.assign(doc, data);
        return { ...doc };
      },
    ),
    sendEmail: vi.fn(async (message: Record<string, unknown>) => {
      if (payload.failNextEmail) {
        payload.failNextEmail = false;
        throw new Error("SES throttled");
      }
      payload.sent.push(message);
    }),
  };
  return payload;
}

const message: CvQueueMessage = {
  submissionId: "sub-1",
  tenant: "duniakimia",
  fields: {
    applicantName: "Siti Rahma",
    email: "siti@example.com",
    phone: "+62 812 3456 7890",
    position: "Process Engineer",
  },
  resumeFileKey: "cv/duniakimia/sub-1.pdf",
};
const sentAt = new Date("2026-09-27T03:00:00Z");
const jobPlatform = {
  webhookUrl: "https://jobs.example/webhook",
  webhookSecret: "s3cret",
};

let payload: ReturnType<typeof fakePayload>;
let fetchMock: ReturnType<typeof vi.fn>;

function run(overrides: Partial<Parameters<typeof processCvMessage>[0]> = {}) {
  return processCvMessage(
    {
      payload: payload as unknown as Payload,
      jobPlatform,
      fetch: fetchMock as unknown as typeof fetch,
      now: () => new Date("2026-09-27T03:00:05Z"),
      ...overrides,
    },
    message,
    sentAt,
  );
}

function stored(): CvSubmission[] {
  return payload.tables["cv-submissions"] as unknown as CvSubmission[];
}

beforeEach(() => {
  payload = fakePayload();
  fetchMock = vi.fn(async () => new Response(null, { status: 202 }));
});

describe("processCvMessage", () => {
  it("stores the submission, emails both parties and syncs the job platform", async () => {
    const submission = await run();

    expect(stored()).toHaveLength(1);
    expect(submission).toMatchObject({
      tenant: 1,
      submissionId: "sub-1",
      applicantName: "Siti Rahma",
      resumeFileKey: "cv/duniakimia/sub-1.pdf",
      submittedAt: "2026-09-27T03:00:00.000Z",
      status: "received",
      applicantNotifiedAt: "2026-09-27T03:00:05.000Z",
      recruiterNotifiedAt: "2026-09-27T03:00:05.000Z",
      externalSyncStatus: "synced",
      externalSyncAttempts: 1,
    });
    expect(payload.sent.map((email) => email.to)).toEqual([
      "siti@example.com",
      "hr@duniakimia.com",
    ]);
    expect(payload.sent[0]).toMatchObject({
      from: { address: "noreply@duniakimia.com" },
      subject: expect.stringContaining("Lamaran Anda"),
    });
    expect(payload.sent[1]).toMatchObject({ replyTo: "siti@example.com" });
  });

  it("sends the webhook with the idempotency key and an HMAC signature", async () => {
    await run();

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    const headers = init.headers as Record<string, string>;
    expect(url).toBe(jobPlatform.webhookUrl);
    expect(headers[IDEMPOTENCY_HEADER]).toBe("sub-1");
    expect(headers[SIGNATURE_HEADER]).toMatch(/^sha256=[0-9a-f]{64}$/);
    expect(init.signal).toBeInstanceOf(AbortSignal);
  });

  it("does nothing twice when the same message is redelivered", async () => {
    await run();
    await run();

    expect(stored()).toHaveLength(1);
    expect(payload.create).toHaveBeenCalledTimes(1);
    expect(payload.sendEmail).toHaveBeenCalledTimes(2);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("reuses the record a concurrent delivery created first", async () => {
    payload.create.mockImplementationOnce(async ({ data }) => {
      payload.tables["cv-submissions"]!.push({ id: 7, ...data });
      throw new Error("duplicate key value violates unique constraint");
    });

    const submission = await run();

    expect(submission.id).toBe(7);
    expect(stored()).toHaveLength(1);
  });

  it("records a failed webhook, still sends the emails and throws for SQS to retry", async () => {
    fetchMock.mockResolvedValueOnce(new Response(null, { status: 503 }));

    const error = await run().catch((caught: unknown) => caught);

    expect(error).toBeInstanceOf(CvIntakeError);
    expect((error as CvIntakeError).message).toContain("HTTP 503");
    expect(stored()[0]).toMatchObject({
      externalSyncStatus: "failed",
      externalSyncAttempts: 1,
    });
    expect(payload.sent).toHaveLength(2);

    await run();

    expect(stored()[0]).toMatchObject({
      externalSyncStatus: "synced",
      externalSyncAttempts: 2,
    });
    expect(payload.sendEmail).toHaveBeenCalledTimes(2);
  });

  it("retries only the email that failed", async () => {
    payload.failNextEmail = true;

    await expect(run()).rejects.toThrow(/SES throttled/);
    expect(stored()[0]!.applicantNotifiedAt).toBeFalsy();
    expect(stored()[0]!.recruiterNotifiedAt).toBeTruthy();

    await run();

    expect(payload.sent.map((email) => email.to)).toEqual([
      "hr@duniakimia.com",
      "siti@example.com",
    ]);
  });

  it("throws when the tenant has no recruiter address, without blocking the rest", async () => {
    await expect(
      processCvMessage(
        {
          payload: payload as unknown as Payload,
          jobPlatform,
          fetch: fetchMock as unknown as typeof fetch,
        },
        { ...message, tenant: "likutelaga" },
        sentAt,
      ),
    ).rejects.toThrow(/no recruiterEmail/);
    expect(stored()[0]!.recruiterNotifiedAt).toBeFalsy();
    expect(stored()[0]!.externalSyncStatus).toBe("synced");
    expect(payload.sent[0]).toMatchObject({
      subject: expect.stringContaining("We received"),
    });
  });

  it("leaves the sync pending when no webhook is configured", async () => {
    await run({ jobPlatform: undefined });

    expect(fetchMock).not.toHaveBeenCalled();
    expect(stored()[0]).toMatchObject({
      externalSyncStatus: "pending",
      externalSyncAttempts: 0,
    });
  });

  it("refuses a tenant that is not seeded before writing anything", async () => {
    payload.tables.tenants = [];

    await expect(run()).rejects.toThrow(/not seeded/);
    expect(stored()).toHaveLength(0);
  });
});
