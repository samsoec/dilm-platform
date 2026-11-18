import { describe, expect, it } from "vitest";

import {
  accountConcurrencyLimit,
  assertPayloadBundleBuilt,
  payloadBundleDir,
  payloadConcurrencyPlan,
  payloadFunctionTls,
} from "./payload";

describe("payloadConcurrencyPlan", () => {
  it("reserves 10 once the quota leaves 10 unreserved", () => {
    const plan = payloadConcurrencyPlan("staging", 1000);
    expect(plan.reserved).toBe(10);
    expect(plan.apiThrottle).toBeUndefined();
    expect(plan.warning).toBeUndefined();
    expect(payloadConcurrencyPlan("staging", 20).reserved).toBe(10);
  });

  it("skips the reservation on a 10-concurrency account and throttles the API", () => {
    const plan = payloadConcurrencyPlan("staging", 10);
    expect(plan.reserved).toBeUndefined();
    expect(plan.apiThrottle).toEqual({ rateLimit: 4, burstLimit: 8 });
    expect(plan.warning).toContain("skipping reserved concurrency");
  });

  it("lowers the reservation when only part of it fits", () => {
    const plan = payloadConcurrencyPlan("production", 15);
    expect(plan.reserved).toBe(5);
    expect(plan.warning).toContain("reserving 5 instead of 10");
  });

  it("treats an unreadable limit as no room", () => {
    const plan = payloadConcurrencyPlan("staging", undefined);
    expect(plan.reserved).toBeUndefined();
    expect(plan.warning).toContain("could not read");
  });

  it("leaves dev alone", () => {
    expect(payloadConcurrencyPlan("dev", 10)).toEqual({
      reserved: undefined,
      apiThrottle: undefined,
      warning: undefined,
    });
  });
});

describe("payloadFunctionTls", () => {
  it("ships the RDS CA and trusts it for Aurora stages only", () => {
    expect(payloadFunctionTls("staging")).toEqual({
      copyFiles: [
        { from: "src/rotation/ap-southeast-3-bundle.pem", to: "ca-bundle.pem" },
      ],
      environment: { NODE_EXTRA_CA_CERTS: "/var/task/ca-bundle.pem" },
    });
    expect(payloadFunctionTls("dev")).toEqual({});
  });
});

describe("payload bundle", () => {
  it("resolves from the infra root up to apps/cms/.open-next", () => {
    expect(payloadBundleDir("/repo/infra")).toBe(
      "/repo/apps/cms/.open-next/server-functions/default",
    );
  });

  it("fails loudly with the build command when the bundle is missing", () => {
    expect(() => assertPayloadBundleBuilt("/repo/infra", () => false)).toThrow(
      /pnpm --filter @dilm\/cms build:open-next/,
    );
    const seen: string[] = [];
    assertPayloadBundleBuilt("/repo/infra", (file) => {
      seen.push(file);
      return true;
    });
    expect(seen).toEqual([
      "/repo/apps/cms/.open-next/server-functions/default/index.mjs",
    ]);
  });
});

describe("accountConcurrencyLimit", () => {
  const failing = () => Promise.reject(new Error("AccessDenied"));

  it("lets staging carry on unreserved when the quota is unreadable", async () => {
    await expect(
      accountConcurrencyLimit("staging", "ap-southeast-3", failing),
    ).resolves.toBeUndefined();
  });

  it("stops a production deploy that cannot read the quota", async () => {
    await expect(
      accountConcurrencyLimit("production", "ap-southeast-3", failing),
    ).rejects.toThrow(/refusing to deploy/);
  });

  it("returns the quota when readable and does not ask for dev", async () => {
    await expect(
      accountConcurrencyLimit("staging", "r", () => Promise.resolve(10)),
    ).resolves.toBe(10);
    await expect(
      accountConcurrencyLimit("dev", "r", failing),
    ).resolves.toBeUndefined();
  });
});
