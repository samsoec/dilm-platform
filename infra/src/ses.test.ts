import { describe, expect, it } from "vitest";

import { sesSendPolicy, sesSenderSetting } from "./ses";

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

describe("sesSendPolicy with a shared sender", () => {
  const shared = sesSendPolicy(
    { partition: "aws", region: "ap-southeast-3", accountId: "123456789012" },
    sesSenderSetting("staging", {
      SES_SHARED_SENDER: "Dev-Mail@example.org",
      SES_SHARED_SENDER_IDENTITY: "example.org",
    }),
  );
  const [sharedStatement] = shared.Statement;

  it("scopes to the one identity, the configuration set and the one address", () => {
    expect(sharedStatement!.Resource).toEqual([
      "arn:aws:ses:ap-southeast-3:123456789012:identity/example.org",
      "arn:aws:ses:ap-southeast-3:123456789012:configuration-set/dilm-transactional",
    ]);
    expect(sharedStatement!.Condition.StringEquals["ses:FromAddress"]).toEqual([
      "dev-mail@example.org",
    ]);
    expect(JSON.stringify(shared)).not.toContain("*");
  });

  it("defaults the identity to the address itself", () => {
    const setting = sesSenderSetting("staging", {
      SES_SHARED_SENDER: "dev@example.org",
    });
    expect(setting).toEqual({
      mode: "shared",
      address: "dev@example.org",
      identity: "dev@example.org",
    });
  });
});

describe("sesSenderSetting", () => {
  it("uses the tenant senders when nothing is set", () => {
    for (const stage of ["dev", "staging", "production"]) {
      expect(sesSenderSetting(stage, {})).toEqual({ mode: "tenant" });
      expect(sesSenderSetting(stage, { SES_SHARED_SENDER: " " })).toEqual({
        mode: "tenant",
      });
    }
  });

  it("refuses a shared sender on production", () => {
    expect(() =>
      sesSenderSetting("production", { SES_SHARED_SENDER: "a@example.org" }),
    ).toThrow(/production/i);
  });

  it("rejects a value that is not an email address", () => {
    expect(() =>
      sesSenderSetting("staging", { SES_SHARED_SENDER: "example.org" }),
    ).toThrow(/email address/);
  });
});
