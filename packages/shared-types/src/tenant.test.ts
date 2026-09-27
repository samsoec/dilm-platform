import { describe, expect, it } from "vitest";

import { TENANT_SLUGS, tenantSenderAddress } from "./tenant";

describe("TENANT_SLUGS", () => {
  it("covers the three DIL Group tenants", () => {
    expect([...TENANT_SLUGS]).toEqual(["indoacid", "duniakimia", "likutelaga"]);
  });

  it("holds no duplicates", () => {
    expect(new Set(TENANT_SLUGS).size).toBe(TENANT_SLUGS.length);
  });
});

describe("tenantSenderAddress", () => {
  it("sends from noreply at each tenant's own root domain", () => {
    expect(TENANT_SLUGS.map(tenantSenderAddress)).toEqual([
      "noreply@indonesianacids.com",
      "noreply@duniakimia.com",
      "noreply@likutelaga.com",
    ]);
  });
});
