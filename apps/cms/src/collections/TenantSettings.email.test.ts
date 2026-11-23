import { describe, expect, it } from "vitest";

import { EMAIL_ERROR, isValidEmail, trimEmail } from "./TenantSettings";

const args = {
  req: { payload: { config: { localization: false } }, t: (k: string) => k },
  required: false,
} as unknown as Parameters<typeof isValidEmail>[1];

describe("company email fields", () => {
  it("accepts any domain and surrounding spaces", async () => {
    expect(await isValidEmail(" a@other.org ", args)).toBe(true);
    expect(await isValidEmail("", args)).toBe(true);
  });
  it("rejects malformed addresses without naming a domain", async () => {
    expect(await isValidEmail("nope", args)).toBe(EMAIL_ERROR);
    expect(EMAIL_ERROR).toBe(
      "Enter a valid email address, like name@company.com",
    );
  });
  it("trims before saving", () => {
    expect(trimEmail({ value: "  a@b.co " } as never)).toBe("a@b.co");
  });
});
