import type { SQSRecord } from "aws-lambda";
import { describe, expect, it, vi } from "vitest";

const { processCvMessage, processContactMessage } = vi.hoisted(() => ({
  processCvMessage: vi.fn(async () => ({})),
  processContactMessage: vi.fn(async () => ({})),
}));
vi.mock("./intake", () => ({ processCvMessage }));
vi.mock("./contact-intake", () => ({ processContactMessage }));
vi.mock("../config", () => ({ cmsConfig: vi.fn() }));
vi.mock("@dilm/runtime-config", () => ({ getRuntimeConfig: vi.fn() }));

import { processRecord } from "./handler";

const logger = { error: vi.fn() };
const intake = {
  payload: { logger: { child: () => logger } },
} as never;

function record(body: object | string): SQSRecord {
  return {
    messageId: "m1",
    body: typeof body === "string" ? body : JSON.stringify(body),
    attributes: {
      SentTimestamp: "1790000000000",
      ApproximateReceiveCount: "1",
    },
  } as unknown as SQSRecord;
}

const consent = { policyVersion: "2026-01" };
const cv = {
  kind: "cv",
  submissionId: "a",
  tenant: "duniakimia",
  fields: {
    applicantName: "A",
    email: "a@x.test",
    phone: "1",
    position: "P",
  },
  resumeFileKey: "k",
  consent,
};
const contact = {
  kind: "contact",
  submissionId: "b",
  tenant: "duniakimia",
  locale: "en",
  fields: {
    fullName: "B",
    company: "C",
    workEmail: "b@x.test",
    phone: "1",
    message: "hi",
  },
  consent,
};

describe("processRecord", () => {
  it("sends cv messages to the CV path only", async () => {
    await processRecord(intake, record(cv));
    expect(processCvMessage).toHaveBeenCalledOnce();
    expect(processContactMessage).not.toHaveBeenCalled();
  });

  it("sends contact messages to the contact path only", async () => {
    processCvMessage.mockClear();
    await processRecord(intake, record(contact));
    expect(processContactMessage).toHaveBeenCalledOnce();
    expect(processCvMessage).not.toHaveBeenCalled();
  });

  it("throws on an unknown tenant or invalid body so SQS retries", async () => {
    processCvMessage.mockClear();
    processContactMessage.mockClear();
    await expect(
      processRecord(intake, record({ ...contact, tenant: "nope" })),
    ).rejects.toThrow();
    await expect(processRecord(intake, record("{not json"))).rejects.toThrow();
    expect(processContactMessage).not.toHaveBeenCalled();
    expect(processCvMessage).not.toHaveBeenCalled();
  });
});
