import type { Payload } from "payload";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { seedTenants } from "../seed/tenants";
import { recordConsent } from "./recordConsent";

const database = process.env.SEED_TEST_DATABASE;

describe.skipIf(!database)(
  "recordConsent against a scratch database",
  { timeout: 600_000 },
  () => {
    let payload: Payload;
    let tenant: number;

    const base = (relatedRecordId: string) => ({
      tenant,
      consentType: "contact-form" as const,
      relatedRecordId,
      policyVersion: "2026-11",
      timestamp: new Date("2026-11-17T01:02:03.000Z"),
    });

    const rows = async (relatedRecordId: string) =>
      (
        await payload.find({
          collection: "consent-logs",
          where: { relatedRecordId: { equals: relatedRecordId } },
          pagination: false,
          depth: 0,
        })
      ).docs;

    beforeAll(async () => {
      if (database === "dilm") {
        throw new Error("Refusing to use the shared dev database.");
      }
      process.env.DATABASE_NAME = database;
      const { getPayload } = await import("payload");
      const { default: config } = await import("../payload.config");
      payload = await getPayload({ config });
      await seedTenants(payload);
      const { docs } = await payload.find({
        collection: "tenants",
        limit: 1,
        depth: 0,
      });
      tenant = docs[0]!.id as number;
    });

    afterAll(async () => {
      await payload?.destroy();
    });

    it("writes once and leaves the row untouched on a repeat", async () => {
      const first = await recordConsent({ payload, ...base("first") });
      const again = await recordConsent({
        payload,
        ...base("first"),
        policyVersion: "2099-01",
        timestamp: new Date("2030-01-01T00:00:00.000Z"),
      });

      expect(first.created).toBe(true);
      expect(again).toEqual({ id: first.id, created: false });
      const stored = await rows("first");
      expect(stored).toHaveLength(1);
      expect(stored[0]).toMatchObject({
        policyVersion: "2026-11",
        timestamp: "2026-11-17T01:02:03.000Z",
      });
    });

    it("keeps one row when calls race", async () => {
      const results = await Promise.all(
        Array.from({ length: 8 }, () =>
          recordConsent({ payload, ...base("race") }),
        ),
      );

      expect(new Set(results.map(({ id }) => id)).size).toBe(1);
      expect(results.filter(({ created }) => created)).toHaveLength(1);
      expect(await rows("race")).toHaveLength(1);
    });

    it("rejects a write without a policy version", async () => {
      await expect(
        recordConsent({ payload, ...base("bad"), policyVersion: "" }),
      ).rejects.toThrow();
      expect(await rows("bad")).toHaveLength(0);
    });
  },
);
