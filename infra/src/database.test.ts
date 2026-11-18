import { describe, expect, it } from "vitest";

import {
  auroraBackupRetentionDays,
  auroraParameters,
  auroraPayloadAppSecretName,
  auroraScaling,
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

describe("Aurora settings", () => {
  it("scales 0 to 1 ACU and pauses after 300s idle", () => {
    expect(auroraScaling()).toEqual({
      minCapacity: 0,
      maxCapacity: 1,
      secondsUntilAutoPause: 300,
    });
  });

  it("forces TLS and scram-sha-256 passwords", () => {
    expect(auroraParameters()).toEqual([
      { name: "rds.force_ssl", value: "1" },
      { name: "password_encryption", value: "scram-sha-256" },
    ]);
  });

  it("names the payload_app secret per stage", () => {
    expect(auroraPayloadAppSecretName("staging")).toBe(
      "dilm-staging-payload-app",
    );
  });
});

describe("auroraBackupRetentionDays", () => {
  it("keeps 7 days when the override is unset or empty", () => {
    expect(auroraBackupRetentionDays("staging", undefined)).toBe(7);
    expect(auroraBackupRetentionDays("production", "")).toBe(7);
  });

  it("lets staging drop to the 1 day a Free-plan account allows", () => {
    expect(auroraBackupRetentionDays("staging", "1")).toBe(1);
  });

  it("refuses less than 7 days on production", () => {
    expect(() => auroraBackupRetentionDays("production", "1")).toThrow(
      /production requires/,
    );
  });

  it("refuses values RDS would reject", () => {
    expect(() => auroraBackupRetentionDays("staging", "0")).toThrow();
    expect(() => auroraBackupRetentionDays("staging", "36")).toThrow();
    expect(() => auroraBackupRetentionDays("staging", "2.5")).toThrow();
  });
});
