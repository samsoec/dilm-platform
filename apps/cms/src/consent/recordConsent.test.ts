import type { Payload } from "payload";
import { describe, expect, it, vi } from "vitest";

import { ConsentLogs } from "../collections/ConsentLogs";
import { isSystemWrite } from "../fields/systemWrite";
import { recordConsent } from "./recordConsent";

const input = {
  tenant: 1,
  consentType: "contact-form" as const,
  relatedRecordId: "42",
  policyVersion: "2026-11",
  timestamp: new Date("2026-11-17T01:02:03.000Z"),
};

function fakePayload(rows: { id: number }[], create = vi.fn()) {
  const find = vi.fn(async () => ({ docs: rows.slice(0, 1) }));
  return { payload: { find, create } as unknown as Payload, find, create };
}

describe("recordConsent", () => {
  it("creates the row with the system-write context on first write", async () => {
    const create = vi.fn(async () => ({ id: 7 }));
    const { payload } = fakePayload([], create);

    const result = await recordConsent({ ...input, payload });

    expect(result).toEqual({ id: 7, created: true });
    const call = create.mock.calls[0] as unknown as [
      { collection: string; data: unknown; context: Record<string, unknown> },
    ];
    expect(call[0].collection).toBe("consent-logs");
    expect(call[0].data).toEqual({
      tenant: 1,
      consentType: "contact-form",
      relatedRecordId: "42",
      policyVersion: "2026-11",
      timestamp: "2026-11-17T01:02:03.000Z",
    });
    expect(isSystemWrite({ context: call[0].context })).toBe(true);
  });

  it("creates nothing on a repeat write", async () => {
    const { payload, create } = fakePayload([{ id: 3 }]);

    expect(await recordConsent({ ...input, payload })).toEqual({
      id: 3,
      created: false,
    });
    expect(create).not.toHaveBeenCalled();
  });

  it("returns the winner when a racing insert hits the unique index", async () => {
    const find = vi
      .fn()
      .mockResolvedValueOnce({ docs: [] })
      .mockResolvedValueOnce({ docs: [{ id: 9 }] });
    const create = vi.fn().mockRejectedValue(new Error("duplicate key"));
    const payload = { find, create } as unknown as Payload;

    expect(await recordConsent({ ...input, payload })).toEqual({
      id: 9,
      created: false,
    });
  });

  it("surfaces a rejected write when no row exists", async () => {
    const create = vi.fn().mockRejectedValue(new Error("policyVersion"));
    const { payload } = fakePayload([], create);

    await expect(
      recordConsent({ ...input, payload, policyVersion: "" }),
    ).rejects.toThrow("policyVersion");
  });
});

describe("consent-logs schema", () => {
  it("holds exactly the allowed fields and nothing identifying", () => {
    const names = ConsentLogs.fields
      .map((field) => ("name" in field ? field.name : undefined))
      .filter(Boolean)
      .sort();

    expect(names).toEqual(
      ["consentType", "policyVersion", "relatedRecordId", "timestamp"].sort(),
    );
    for (const banned of ["ip", "ipAddress", "userAgent", "content", "form"]) {
      expect(names).not.toContain(banned);
    }
  });

  it("indexes consentType and relatedRecordId uniquely", () => {
    expect(ConsentLogs.indexes).toEqual([
      { fields: ["consentType", "relatedRecordId"], unique: true },
    ]);
  });
});
