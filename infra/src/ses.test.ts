import { describe, expect, it } from "vitest";

import { sesSendPolicy } from "./ses";

const policy = sesSendPolicy({
  partition: "aws",
  region: "ap-southeast-3",
  accountId: "123456789012",
});
const [statement] = policy.Statement;

describe("sesSendPolicy", () => {
  it("grants only the two send actions", () => {
    expect(policy.Statement).toHaveLength(1);
    expect(statement!.Effect).toBe("Allow");
    expect(statement!.Action).toEqual(["ses:SendEmail", "ses:SendRawEmail"]);
  });

  it("names the three verified identities and the configuration set, with no wildcard", () => {
    expect(statement!.Resource).toEqual([
      "arn:aws:ses:ap-southeast-3:123456789012:identity/indonesianacids.com",
      "arn:aws:ses:ap-southeast-3:123456789012:identity/duniakimia.com",
      "arn:aws:ses:ap-southeast-3:123456789012:identity/likutelaga.com",
      "arn:aws:ses:ap-southeast-3:123456789012:configuration-set/dilm-transactional",
    ]);
    expect(JSON.stringify(policy)).not.toContain("*");
  });

  it("only lets mail leave from noreply at a tenant root domain", () => {
    expect(statement!.Condition.StringEquals["ses:FromAddress"]).toEqual([
      "noreply@indonesianacids.com",
      "noreply@duniakimia.com",
      "noreply@likutelaga.com",
    ]);
  });
});
