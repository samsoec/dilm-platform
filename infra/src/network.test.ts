import { describe, expect, it } from "vitest";

import { DB_AZ_COUNT, dbIngressRules, dbSubnetCidrs } from "./network";

describe("dbSubnetCidrs", () => {
  it("gives one distinct /24 per AZ, two AZs by default", () => {
    const cidrs = dbSubnetCidrs();
    expect(cidrs).toHaveLength(DB_AZ_COUNT);
    expect(new Set(cidrs).size).toBe(DB_AZ_COUNT);
    expect(cidrs.every((c) => c.endsWith("/24"))).toBe(true);
  });
});

describe("dbIngressRules", () => {
  it("opens only 5432/tcp to the internet", () => {
    const rules = dbIngressRules();
    expect(rules).toHaveLength(1);
    expect(rules[0]).toMatchObject({
      protocol: "tcp",
      fromPort: 5432,
      toPort: 5432,
      cidrBlocks: ["0.0.0.0/0"],
    });
  });
});
