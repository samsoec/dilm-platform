import { readFileSync } from "node:fs";

import type { Field } from "payload";
import { describe, expect, it } from "vitest";

import { Tenants } from "./collections/Tenants";
import { LOGIN_LOCKOUT, Users } from "./collections/Users";
import { applyMultiTenant } from "./testing";

const MFA_PATTERN = /mfa|totp|otp|2fa|two.?factor/i;

function fieldNames(fields: Field[]): string[] {
  return fields.flatMap((field) => [
    ...("name" in field ? [field.name] : []),
    ...("fields" in field ? fieldNames(field.fields) : []),
  ]);
}

describe("login lockout", () => {
  it("locks an account for 10 minutes after 5 failed logins", () => {
    expect(LOGIN_LOCKOUT).toEqual({ maxLoginAttempts: 5, lockTime: 600_000 });
    expect(Users.auth).toMatchObject(LOGIN_LOCKOUT);
  });

  it("keeps Payload's own email/password strategy", () => {
    expect(Users.auth).not.toHaveProperty("disableLocalStrategy");
    expect(Users.auth).not.toHaveProperty("strategies");
  });

  it("survives the multi-tenant plugin", async () => {
    const users = (await applyMultiTenant([Users, Tenants]))("users");
    expect(users.auth).toMatchObject(LOGIN_LOCKOUT);
  });
});

describe("no MFA (Backend Spec §3.3)", () => {
  it("has no MFA or TOTP fields on users", async () => {
    const users = (await applyMultiTenant([Users, Tenants]))("users");
    expect(
      fieldNames(users.fields).filter((name) => MFA_PATTERN.test(name)),
    ).toEqual([]);
  });

  it("depends on no MFA or TOTP package", () => {
    const manifest = JSON.parse(
      readFileSync(new URL("../package.json", import.meta.url), "utf8"),
    ) as Record<string, Record<string, string> | undefined>;
    const packages = Object.keys({
      ...manifest.dependencies,
      ...manifest.devDependencies,
    });
    expect(packages.filter((name) => MFA_PATTERN.test(name))).toEqual([]);
  });
});
