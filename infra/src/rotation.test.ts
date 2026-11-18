import { describe, expect, it } from "vitest";

import {
  alternateUsername,
  assertSafePassword,
  payloadAppSecretArnPattern,
  pendingUserStatements,
  rotationLambdaPolicy,
} from "./rotation";

const scope = {
  partition: "aws",
  region: "ap-southeast-3",
  accountId: "111111111111",
};
const password = "A".repeat(40);

describe("alternateUsername", () => {
  it("flips between payload_app and its clone", () => {
    expect(alternateUsername("payload_app")).toBe("payload_app_clone");
    expect(alternateUsername("payload_app_clone")).toBe("payload_app");
  });

  it("refuses any other user, so the master is never rotated", () => {
    expect(() => alternateUsername("dilm_admin")).toThrow(/neither/);
  });
});

describe("pendingUserStatements", () => {
  it("creates the clone, sets its password and grants the base role", () => {
    const sql = pendingUserStatements({
      pendingUser: "payload_app_clone",
      password,
    });
    expect(sql).toHaveLength(3);
    expect(sql[0]).toContain("CREATE ROLE");
    expect(sql[1]).toContain(`PASSWORD '${password}'`);
    expect(sql[2]).toBe('GRANT "payload_app" TO "payload_app_clone"');
  });

  it("only changes the password when rotating back to the base role", () => {
    const sql = pendingUserStatements({
      pendingUser: "payload_app",
      password,
    });
    expect(sql.some((statement) => statement.startsWith("GRANT"))).toBe(false);
  });

  it("refuses passwords and role names that need escaping", () => {
    expect(() => assertSafePassword(`${password}'; DROP`)).toThrow();
    expect(() =>
      pendingUserStatements({ pendingUser: 'x"; --', password }),
    ).toThrow(/Unsafe/);
  });
});

describe("rotationLambdaPolicy", () => {
  it("scopes writes to the payload_app secret and reads to the master", () => {
    const policy = rotationLambdaPolicy(
      scope,
      "dilm-staging-payload-app",
      "arn:aws:secretsmanager:ap-southeast-3:111111111111:secret:rds!cluster-x",
    );
    expect(policy.Statement[0].Resource).toEqual([
      payloadAppSecretArnPattern(scope, "dilm-staging-payload-app"),
    ]);
    expect(policy.Statement[1].Resource[0]).toContain("rds!cluster-x");
    expect(JSON.stringify(policy)).not.toContain("rds-db:connect");
  });
});
