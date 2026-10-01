import { describe, expect, it } from "vitest";

import {
  databaseMode,
  payloadReservedConcurrency,
  rdsDbConnectPolicy,
} from "./database";

const scope = {
  partition: "aws",
  region: "ap-southeast-3",
  accountId: "123456789012",
  clusterResourceId: "cluster-ABCDEFGHIJKL",
};

describe("databaseMode", () => {
  it("puts only dev on the Free-plan express cluster", () => {
    expect(databaseMode("dev")).toBe("express");
    expect(databaseMode("staging")).toBe("aurora");
    expect(databaseMode("production")).toBe("aurora");
  });
});

describe("payloadReservedConcurrency", () => {
  it("leaves dev unreserved, since the Free plan caps account concurrency at 10", () => {
    expect(payloadReservedConcurrency("dev")).toBeUndefined();
  });

  it("caps staging and production at 10 per Backend Spec §8.2", () => {
    expect(payloadReservedConcurrency("staging")).toBe(10);
    expect(payloadReservedConcurrency("production")).toBe(10);
  });
});

describe("rdsDbConnectPolicy", () => {
  it("lets the holder connect only as payload_app on that one cluster", () => {
    const [statement] = rdsDbConnectPolicy(scope).Statement;
    expect(statement).toEqual({
      Sid: "ConnectAsPayloadAppOnly",
      Effect: "Allow",
      Action: ["rds-db:connect"],
      Resource: [
        "arn:aws:rds-db:ap-southeast-3:123456789012:dbuser:cluster-ABCDEFGHIJKL/payload_app",
      ],
    });
  });

  it("never grants the IAM-only postgres admin user", () => {
    expect(JSON.stringify(rdsDbConnectPolicy(scope))).not.toMatch(
      /\/postgres|\*/,
    );
  });
});
