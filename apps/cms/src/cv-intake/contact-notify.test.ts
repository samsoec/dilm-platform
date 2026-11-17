import type { ContactQueueMessage } from "@dilm/shared-types";
import type { Payload } from "payload";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { SYSTEM_WRITE } from "../fields/systemWrite";
import { processContactMessage } from "./contact-intake";

type Doc = Record<string, unknown> & { id: number };
type Where = Record<string, { equals: unknown }>;

function fakePayload(contactEmail: string | null = "team@dunia.example") {
  const tables: Record<string, Doc[]> = {
    tenants: [{ id: 1, slug: "duniakimia", defaultLocale: "id" }],
    "tenant-settings": contactEmail ? [{ id: 2, tenant: 1, contactEmail }] : [],
    "contact-submissions": [],
    "consent-logs": [],
  };
  let nextId = 100;
  const logger = { info: vi.fn(), warn: vi.fn(), error: vi.fn() };
  return {
    tables,
    logger: { ...logger, child: () => logger },
    find: vi.fn(
      async ({ collection, where }: { collection: string; where: Where }) => ({
        docs: tables[collection]!.filter((doc) =>
          Object.entries(where).every(([k, { equals }]) => doc[k] === equals),
        ),
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
        const doc = tables[collection]!.find((d) => d.id === id)!;
        Object.assign(doc, data);
        return { ...doc };
      },
    ),
    sendEmail: vi.fn(async (...args: [Record<string, unknown>]) => void args),
  };
}

const message: ContactQueueMessage = {
  kind: "contact",
  submissionId: "sub-9",
  tenant: "duniakimia",
  locale: "id",
  fields: {
    fullName: "Budi Santoso",
    company: "PT Maju",
    workEmail: "budi@maju.example",
    phone: "+62 811 000 111",
    message: "Please send a quotation",
  },
  consent: { policyVersion: "2026-01" },
};
const sentAt = new Date("2026-09-27T03:00:00Z");
const stampTime = new Date("2026-09-27T03:00:05Z");

let payload: ReturnType<typeof fakePayload>;

function run() {
  return processContactMessage(
    { payload: payload as unknown as Payload, now: () => stampTime },
    message,
    sentAt,
  );
}

beforeEach(() => {
  payload = fakePayload();
});

describe("contact notification emails", () => {
  it("sends the team email with reply-to and the confirmation in the message locale, stamping both flags", async () => {
    await run();

    expect(payload.sendEmail).toHaveBeenCalledTimes(2);
    const [team, sender] = payload.sendEmail.mock.calls.map((c) => c[0]!);
    expect(team).toMatchObject({
      to: "team@dunia.example",
      replyTo: "budi@maju.example",
      from: { address: expect.stringContaining("@") },
    });
    expect(sender).toMatchObject({
      to: "budi@maju.example",
      subject: "Pesan Anda telah kami terima",
    });
    expect(payload.tables["contact-submissions"]![0]).toMatchObject({
      teamNotifiedAt: stampTime.toISOString(),
      senderNotifiedAt: stampTime.toISOString(),
    });
    expect(payload.update).toHaveBeenCalledWith(
      expect.objectContaining({ context: SYSTEM_WRITE }),
    );
  });

  it("sends the English confirmation for an en message", async () => {
    message.locale = "en";
    try {
      await run();
    } finally {
      message.locale = "id";
    }
    expect(payload.sendEmail.mock.calls[1]![0]).toMatchObject({
      subject: "We received your message",
    });
  });

  it("sends nothing on redelivery once both flags are set", async () => {
    await run();
    payload.sendEmail.mockClear();

    await run();

    expect(payload.sendEmail).not.toHaveBeenCalled();
  });

  it("sends only the email whose flag is empty", async () => {
    await run();
    delete payload.tables["contact-submissions"]![0]!.senderNotifiedAt;
    payload.sendEmail.mockClear();

    await run();

    expect(payload.sendEmail).toHaveBeenCalledTimes(1);
    expect(payload.sendEmail.mock.calls[0]![0]).toMatchObject({
      to: "budi@maju.example",
    });
  });

  it("throws on a failed send without stamping it, and a retry resends only that email", async () => {
    payload.sendEmail.mockImplementationOnce(async () => {
      throw new Error("SES throttled");
    });

    await expect(run()).rejects.toThrow("1 notification step(s) failed");
    const row = payload.tables["contact-submissions"]![0]!;
    expect(row.teamNotifiedAt).toBeUndefined();
    expect(row.senderNotifiedAt).toBe(stampTime.toISOString());

    payload.sendEmail.mockClear();
    await run();

    expect(payload.sendEmail).toHaveBeenCalledTimes(1);
    expect(payload.sendEmail.mock.calls[0]![0]).toMatchObject({
      to: "team@dunia.example",
    });
  });

  it("fails the team step clearly without a contactEmail, keeping the records", async () => {
    payload = fakePayload(null);

    const error = await run().catch((e: unknown) => e);

    expect((error as AggregateError).errors[0]).toEqual(
      new Error('Tenant "duniakimia" has no contactEmail in tenant-settings'),
    );
    expect(payload.tables["contact-submissions"]).toHaveLength(1);
    expect(payload.tables["consent-logs"]).toHaveLength(1);
    expect(payload.sendEmail).toHaveBeenCalledTimes(1);
  });
});
