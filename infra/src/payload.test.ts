import { describe, expect, it } from "vitest";

import {
  payloadConcurrencyPlan,
  payloadFunctionTls,
  readAccountConcurrencyLimit,
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

describe("readAccountConcurrencyLimit", () => {
  it("returns undefined rather than failing when AWS cannot be reached", async () => {
    const original = process.env.AWS_ENDPOINT_URL;
    process.env.AWS_ENDPOINT_URL = "http://127.0.0.1:9";
    try {
      await expect(
        readAccountConcurrencyLimit("ap-southeast-3"),
      ).resolves.toBeUndefined();
    } finally {
      if (original === undefined) delete process.env.AWS_ENDPOINT_URL;
      else process.env.AWS_ENDPOINT_URL = original;
    }
  }, 30_000);
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
