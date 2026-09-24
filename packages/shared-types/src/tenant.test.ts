import { describe, expect, it } from "vitest";

import { TENANT_SLUGS } from "./tenant.js";

describe("TENANT_SLUGS", () => {
  it("covers the three DIL Group tenants", () => {
    expect([...TENANT_SLUGS]).toEqual(["indoacid", "duniakimia", "likutelaga"]);
  });

  it("holds no duplicates", () => {
    expect(new Set(TENANT_SLUGS).size).toBe(TENANT_SLUGS.length);
  });
});
