import type { ContactQueueMessage } from "@dilm/shared-types";
import type { Payload } from "payload";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { SYSTEM_WRITE } from "../fields/systemWrite";
import {
  type ContactStep,
  ContactIntakeError,
  processContactMessage,
} from "./contact-intake";

type Doc = Record<string, unknown> & { id: number };
type Where = Record<string, { equals: unknown }>;

function fakePayload() {
  const tables: Record<string, Doc[]> = {
    tenants: [{ id: 1, slug: "duniakimia", defaultLocale: "id" }],
    "contact-submissions": [],
    "consent-logs": [],
  };
  let nextId = 100;
  const matches = (doc: Doc, where: Where) =>
    Object.entries(where).every(([key, { equals }]) => doc[key] === equals);
  const logger = { info: vi.fn(), warn: vi.fn(), error: vi.fn() };
  return {
    tables,
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

let payload: ReturnType<typeof fakePayload>;

function run(contactSteps: Record<string, ContactStep> = {}) {
  return processContactMessage(
    { payload: payload as unknown as Payload, contactSteps },
    message,
    sentAt,
  );
}

beforeEach(() => {
  payload = fakePayload();
});

describe("processContactMessage", () => {
  it("stores the inquiry with the system-write context and records consent first", async () => {
    const order: string[] = [];
    payload.create.mockImplementation(
      async ({
        collection,
        data,
        context,
      }: {
        collection: string;
        data: object;
        context?: object;
      }) => {
        order.push(`create:${collection}`);
        const doc = { id: 500 + order.length, ...data, context };
        payload.tables[collection]!.push(doc);
        return { ...doc };
      },
    );
    const step = vi.fn(async () => {
      order.push("step");
    });

    await run({ one: step, two: step });

    expect(order).toEqual([
      "create:contact-submissions",
      "create:consent-logs",
      "step",
      "step",
    ]);
    expect(payload.tables["contact-submissions"]).toEqual([
      expect.objectContaining({
        tenant: 1,
        submissionId: "sub-9",
        fullName: "Budi Santoso",
        workEmail: "budi@maju.example",
        locale: "id",
        submittedAt: sentAt.toISOString(),
        context: SYSTEM_WRITE,
      }),
    ]);
    expect(payload.tables["consent-logs"]).toEqual([
      expect.objectContaining({
        tenant: 1,
        consentType: "contact-form",
        relatedRecordId: "sub-9",
        policyVersion: "2026-01",
        timestamp: sentAt.toISOString(),
      }),
    ]);
  });

  it("creates nothing twice on redelivery", async () => {
    await run();
    await run();

    expect(payload.tables["contact-submissions"]).toHaveLength(1);
    expect(payload.tables["consent-logs"]).toHaveLength(1);
  });

  it("falls back to the existing record when the create loses a race", async () => {
    const winner = { id: 7, submissionId: "sub-9" };
    payload.create.mockImplementationOnce(async () => {
      payload.tables["contact-submissions"]!.push(winner);
      throw new Error("duplicate key");
    });

    const submission = await run();

    expect(submission.id).toBe(7);
    expect(payload.tables["contact-submissions"]).toHaveLength(1);
    expect(payload.tables["consent-logs"]).toHaveLength(1);
  });

  it("runs no notification step and throws when the consent write fails", async () => {
    payload.create.mockImplementation(
      async ({ collection, data }: { collection: string; data: object }) => {
        if (collection === "consent-logs") throw new Error("db down");
        const doc = { id: 600, ...data };
        payload.tables[collection]!.push(doc);
        return { ...doc };
      },
    );
    const step = vi.fn(async () => {});

    await expect(run({ step })).rejects.toThrow("db down");

    expect(step).not.toHaveBeenCalled();
  });

  it("runs every step even when one fails, then throws naming the submission", async () => {
    const failing = vi.fn(async () => {
      throw new Error("SES throttled");
    });
    const after = vi.fn(async () => {});

    const error = await run({ failing, after }).catch((e: unknown) => e);

    expect(after).toHaveBeenCalledOnce();
    expect(error).toBeInstanceOf(ContactIntakeError);
    expect((error as Error).message).toContain("sub-9");
    expect((error as Error).message).not.toContain("Budi");
    expect((error as Error).message).not.toContain("quotation");
  });

  it("throws for a tenant that is not seeded", async () => {
    payload.tables.tenants = [];

    await expect(run()).rejects.toThrow('Tenant "duniakimia" is not seeded');
    expect(payload.tables["contact-submissions"]).toHaveLength(0);
  });

  it("never logs the sender's details", async () => {
    await run({
      failing: async () => {
        throw new Error("boom");
      },
    }).catch(() => {});

    const logged = JSON.stringify(payload.logger.error.mock.calls);
    expect(logged).toContain("sub-9");
    expect(logged).not.toContain("budi@maju.example");
    expect(logged).not.toContain("Budi");
    expect(logged).not.toContain("quotation");
  });
});
