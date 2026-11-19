import { describe, expect, it } from "vitest";

import { adminAllowedIps } from "./gateway";

const four = "203.0.113.1, 203.0.113.2,203.0.113.3/32,198.51.100.4";

describe("adminAllowedIps", () => {
  it("reads the four IPs from the environment as /32 ranges", () => {
    expect(adminAllowedIps("staging", { ADMIN_ALLOWED_IPS: four })).toEqual([
      "203.0.113.1/32",
      "203.0.113.2/32",
      "203.0.113.3/32",
      "198.51.100.4/32",
    ]);
  });

  it("refuses to deploy with no IPs", () => {
    expect(() => adminAllowedIps("staging", {})).toThrow(/empty/);
  });

  it("refuses ranges, wildcards and malformed addresses", () => {
    for (const bad of [
      "0.0.0.0/0",
      "10.0.0.0/8",
      "nope",
      "1.2.3.4/33",
      "1.2.3.*",
      "::1",
    ]) {
      expect(() =>
        adminAllowedIps("staging", { ADMIN_ALLOWED_IPS: bad }),
      ).toThrow(/single IPv4/);
    }
  });

  it("refuses more than four addresses", () => {
    expect(() =>
      adminAllowedIps("staging", {
        ADMIN_ALLOWED_IPS: `${four},192.0.2.9`,
      }),
    ).toThrow(/maintainer plus 3 PICs/);
  });

  it("opens a non-production admin to everyone with *", () => {
    expect(adminAllowedIps("staging", { ADMIN_ALLOWED_IPS: " * " })).toEqual([
      "*",
    ]);
  });

  it("refuses * on production and * mixed with addresses", () => {
    expect(() =>
      adminAllowedIps("production", { ADMIN_ALLOWED_IPS: "*" }),
    ).toThrow(/refused on production/);
    expect(() =>
      adminAllowedIps("staging", { ADMIN_ALLOWED_IPS: "*,203.0.113.1" }),
    ).toThrow(/cannot be combined/);
  });
});
