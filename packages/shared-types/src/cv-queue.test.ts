import { describe, expect, it } from "vitest";

import {
  CV_CONSUMER_TIMEOUT_SECONDS,
  CV_QUEUE_MAX_RECEIVE_COUNT,
  CV_QUEUE_VISIBILITY_TIMEOUT_SECONDS,
  InvalidCvQueueMessageError,
  parseCvQueueMessage,
} from "./cv-queue";

const valid = {
  submissionId: "0b7c5c7e-2f3a-4c1e-9a55-3f1d3c2b1a00",
  tenant: "duniakimia",
  fields: {
    applicantName: "Siti Rahma",
    email: "siti@example.com",
    phone: "+62 812 3456 7890",
    position: "Process Engineer",
  },
  resumeFileKey: "cv/duniakimia/0b7c5c7e.pdf",
};

describe("queue limits", () => {
  it("keeps a message invisible for six consumer timeouts", () => {
    expect(CV_CONSUMER_TIMEOUT_SECONDS).toBe(60);
    expect(CV_QUEUE_VISIBILITY_TIMEOUT_SECONDS).toBe(360);
  });

  it("moves a message to the DLQ after five failed receives", () => {
    expect(CV_QUEUE_MAX_RECEIVE_COUNT).toBe(5);
  });
});

describe("parseCvQueueMessage", () => {
  it("accepts the contract and trims the form fields", () => {
    const message = parseCvQueueMessage(
      JSON.stringify({
        ...valid,
        fields: { ...valid.fields, applicantName: "  Siti Rahma " },
      }),
    );
    expect(message).toEqual(valid);
  });

  it("drops keys outside the contract", () => {
    const message = parseCvQueueMessage(
      JSON.stringify({
        ...valid,
        ip: "203.0.113.7",
        fields: { ...valid.fields, extra: "x" },
      }),
    );
    expect(message).toEqual(valid);
  });

  it("rejects a body that is not JSON", () => {
    expect(() => parseCvQueueMessage("not json")).toThrow(
      InvalidCvQueueMessageError,
    );
  });

  it("lists every problem at once", () => {
    try {
      parseCvQueueMessage(
        JSON.stringify({ tenant: "acme", fields: { email: "" } }),
      );
      expect.unreachable();
    } catch (error) {
      expect((error as InvalidCvQueueMessageError).problems).toEqual([
        "submissionId missing",
        "tenant must be one of indoacid, duniakimia, likutelaga",
        "resumeFileKey missing",
        "fields.applicantName missing",
        "fields.email missing",
        "fields.phone missing",
        "fields.position missing",
      ]);
    }
  });
});
