import { describe, expect, it } from "vitest";

import {
  CONTACT_FIELD_LIMITS,
  CV_CONSUMER_TIMEOUT_SECONDS,
  CV_QUEUE_MAX_RECEIVE_COUNT,
  CV_QUEUE_VISIBILITY_TIMEOUT_SECONDS,
  InvalidCvQueueMessageError,
  parseQueueMessage,
} from "./cv-queue";

const valid = {
  kind: "cv",
  submissionId: "0b7c5c7e-2f3a-4c1e-9a55-3f1d3c2b1a00",
  tenant: "duniakimia",
  fields: {
    applicantName: "Siti Rahma",
    email: "siti@example.com",
    phone: "+62 812 3456 7890",
    position: "Process Engineer",
  },
  resumeFileKey: "cv/duniakimia/0b7c5c7e.pdf",
  consent: { policyVersion: "2026-01" },
};

const contact = {
  kind: "contact",
  submissionId: "5d1f2a64-7a0e-4a71-8b3c-1e2f3a4b5c6d",
  tenant: "indoacid",
  locale: "id",
  fields: {
    fullName: "Budi Santoso",
    company: "PT Maju Jaya",
    workEmail: "budi@majujaya.co.id",
    phone: "+62 812 1111 2222",
    message: "Please send a quotation.",
  },
  consent: { policyVersion: "2026-01" },
};

function problemsOf(body: unknown): string[] {
  try {
    parseQueueMessage(JSON.stringify(body));
  } catch (error) {
    return (error as InvalidCvQueueMessageError).problems;
  }
  throw new Error("expected the message to be rejected");
}

describe("queue limits", () => {
  it("keeps a message invisible for six consumer timeouts", () => {
    expect(CV_CONSUMER_TIMEOUT_SECONDS).toBe(60);
    expect(CV_QUEUE_VISIBILITY_TIMEOUT_SECONDS).toBe(360);
  });

  it("moves a message to the DLQ after five failed receives", () => {
    expect(CV_QUEUE_MAX_RECEIVE_COUNT).toBe(5);
  });
});

describe("parseQueueMessage", () => {
  it("accepts the contract and trims the form fields", () => {
    const message = parseQueueMessage(
      JSON.stringify({
        ...valid,
        fields: { ...valid.fields, applicantName: "  Siti Rahma " },
      }),
    );
    expect(message).toEqual(valid);
  });

  it("drops keys outside the contract", () => {
    const message = parseQueueMessage(
      JSON.stringify({
        ...valid,
        ip: "203.0.113.7",
        fields: { ...valid.fields, extra: "x" },
      }),
    );
    expect(message).toEqual(valid);
  });

  it("rejects a body that is not JSON", () => {
    expect(() => parseQueueMessage("not json")).toThrow(
      InvalidCvQueueMessageError,
    );
  });

  it("lists every problem at once", () => {
    try {
      parseQueueMessage(
        JSON.stringify({ kind: "cv", tenant: "acme", fields: { email: "" } }),
      );
      expect.unreachable();
    } catch (error) {
      expect((error as InvalidCvQueueMessageError).problems).toEqual([
        "submissionId missing",
        "tenant must be one of indoacid, duniakimia, likutelaga",
        "resumeFileKey missing",
        "consent.policyVersion missing",
        "fields.applicantName missing",
        "fields.email missing",
        "fields.phone missing",
        "fields.position missing",
      ]);
    }
  });
});

describe("parseQueueMessage kinds", () => {
  it("rejects a missing or unknown kind", () => {
    expect(problemsOf({ ...valid, kind: undefined })).toEqual([
      "kind must be one of cv, contact",
    ]);
    expect(problemsOf({ ...valid, kind: "resume" })).toEqual([
      "kind must be one of cv, contact",
    ]);
  });

  it("rejects a cv message without a policy version", () => {
    expect(problemsOf({ ...valid, consent: {} })).toEqual([
      "consent.policyVersion missing",
    ]);
    expect(problemsOf({ ...valid, consent: undefined })).toEqual([
      "consent.policyVersion missing",
    ]);
  });
});

describe("parseQueueMessage contact", () => {
  it("accepts the contract and trims every string", () => {
    const message = parseQueueMessage(
      JSON.stringify({
        ...contact,
        extra: 1,
        consent: { policyVersion: " 2026-01 ", ip: "x" },
        fields: { ...contact.fields, fullName: "  Budi Santoso ", other: "x" },
      }),
    );
    expect(message).toEqual(contact);
  });

  it("lists every problem at once", () => {
    expect(
      problemsOf({ kind: "contact", tenant: "acme", locale: "fr" }),
    ).toEqual([
      "submissionId missing",
      "tenant must be one of indoacid, duniakimia, likutelaga",
      "locale must be one of en, id",
      "consent.policyVersion missing",
      "fields.fullName missing",
      "fields.company missing",
      "fields.workEmail missing",
      "fields.phone missing",
      "fields.message missing",
    ]);
  });

  it("rejects empty and whitespace-only required fields", () => {
    expect(
      problemsOf({ ...contact, fields: { ...contact.fields, company: "  " } }),
    ).toEqual(["fields.company missing"]);
  });

  it("rejects a work email that does not look like an address", () => {
    for (const workEmail of ["budi", "budi@", "@x.com", "a b@x.com", "a@b"]) {
      expect(
        problemsOf({ ...contact, fields: { ...contact.fields, workEmail } }),
      ).toEqual(["fields.workEmail is not an email address"]);
    }
  });

  it("exports the length limits", () => {
    expect(CONTACT_FIELD_LIMITS).toEqual({
      fullName: 120,
      company: 160,
      workEmail: 254,
      phone: 32,
      message: 4000,
    });
  });

  it("accepts a value exactly at its limit and rejects one over", () => {
    const email = (length: number) =>
      `${"a".repeat(length - "@x.co".length)}@x.co`;
    const values: Record<string, (length: number) => string> = {
      fullName: (n) => "a".repeat(n),
      company: (n) => "a".repeat(n),
      workEmail: email,
      phone: (n) => "1".repeat(n),
      message: (n) => "a".repeat(n),
    };
    for (const [name, limit] of Object.entries(CONTACT_FIELD_LIMITS)) {
      const at = { ...contact.fields, [name]: values[name](limit) };
      expect(() =>
        parseQueueMessage(JSON.stringify({ ...contact, fields: at })),
      ).not.toThrow();
      const over = { ...contact.fields, [name]: values[name](limit + 1) };
      expect(problemsOf({ ...contact, fields: over })).toEqual([
        `fields.${name} is longer than ${limit} characters`,
      ]);
    }
  });

  it("does not count surrounding whitespace against the limit", () => {
    const padded = ` ${"a".repeat(120)} `;
    expect(() =>
      parseQueueMessage(
        JSON.stringify({
          ...contact,
          fields: { ...contact.fields, fullName: padded },
        }),
      ),
    ).not.toThrow();
  });
});
