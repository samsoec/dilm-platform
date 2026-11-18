import { describe, expect, it } from "vitest";

import {
  emailProblem,
  ensureFirstSuperAdmin,
  generatePassword,
  passwordProblem,
  planAdmin,
} from "./bootstrapAdmin";

describe("planAdmin", () => {
  it("creates when there are no users", () => {
    expect(planAdmin([], "a@b.co")).toBe("create");
  });
  it("matches the email case-insensitively", () => {
    expect(
      planAdmin([{ email: "A@B.co", roles: ["super-admin"] }], "a@b.co"),
    ).toBe("already-super-admin");
  });
  it("leaves an existing non-admin user alone", () => {
    expect(planAdmin([{ email: "a@b.co", roles: [] }], "a@b.co")).toBe(
      "exists-without-role",
    );
  });
  it("does not add a second Super Admin", () => {
    expect(
      planAdmin([{ email: "x@b.co", roles: ["super-admin"] }], "a@b.co"),
    ).toBe("other-super-admin-exists");
  });
});

describe("validation", () => {
  it("rejects bad emails and short passwords", () => {
    expect(emailProblem("nope")).not.toBeNull();
    expect(emailProblem("a@b.co")).toBeNull();
    expect(passwordProblem("short")).not.toBeNull();
    expect(passwordProblem("long-enough-pw!")).toBeNull();
  });
  it("generates passwords that pass validation", () => {
    const password = generatePassword();
    expect(passwordProblem(password)).toBeNull();
    expect(generatePassword()).not.toBe(password);
  });
});

describe("ensureFirstSuperAdmin", () => {
  function fake(users: { email: string; roles: string[] }[]) {
    const created: unknown[] = [];
    return {
      created,
      payload: {
        find: async () => ({ docs: users }),
        create: async ({ data }: { data: unknown }) => {
          created.push(data);
        },
      } as never,
    };
  }

  it("creates once and only asks for the password when creating", async () => {
    const asked: string[] = [];
    const getPassword = async () => (asked.push("x"), "pw-long-enough-1");
    const first = fake([]);
    expect(
      await ensureFirstSuperAdmin(first.payload, "a@b.co", getPassword),
    ).toBe("created");
    expect(first.created).toEqual([
      { email: "a@b.co", password: "pw-long-enough-1", roles: ["super-admin"] },
    ]);

    const second = fake([{ email: "a@b.co", roles: ["super-admin"] }]);
    expect(
      await ensureFirstSuperAdmin(second.payload, "a@b.co", getPassword),
    ).toBe("already-super-admin");
    expect(second.created).toEqual([]);
    expect(asked).toHaveLength(1);
  });
});
