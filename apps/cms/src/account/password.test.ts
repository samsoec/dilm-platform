import type { PayloadRequest } from "payload";
import { describe, expect, it, vi } from "vitest";

import { LOCKED_ACCOUNT_MESSAGE } from "../admin/login";
import {
  changePassword,
  PASSWORD_CHANGE_CONTEXT,
  passwordChangeProblem,
  requireVerifiedPasswordChange,
  WRONG_CURRENT_PASSWORD,
} from "./password";

const valid = {
  currentPassword: "old-secret",
  newPassword: "new-secret-1",
  repeatPassword: "new-secret-1",
};

describe("passwordChangeProblem", () => {
  it("accepts a complete, matching change", () => {
    expect(passwordChangeProblem(valid)).toBeUndefined();
  });

  it("points at the field that needs fixing", () => {
    expect(
      passwordChangeProblem({ ...valid, currentPassword: "" })?.field,
    ).toBe("currentPassword");
    expect(
      passwordChangeProblem({
        ...valid,
        newPassword: "short",
        repeatPassword: "short",
      }),
    ).toMatchObject({ field: "newPassword" });
    expect(
      passwordChangeProblem({ ...valid, repeatPassword: "other" }),
    ).toEqual({
      field: "repeatPassword",
      message: "The new passwords don't match.",
    });
    expect(
      passwordChangeProblem({
        ...valid,
        newPassword: "old-secret",
        repeatPassword: "old-secret",
      })?.field,
    ).toBe("newPassword");
  });
});

function request(login: () => Promise<unknown>, body: object = valid) {
  const update = vi.fn(async () => ({}));
  const req = {
    user: { id: 7, email: "dimas@example.test" },
    json: async () => body,
    payload: { login: vi.fn(login), update },
  } as unknown as PayloadRequest;
  return { req, update };
}

describe("changePassword (FR-UI-99)", () => {
  it("verifies the current password against the user's own email, then updates", async () => {
    const { req, update } = request(async () => ({}));

    const response = await changePassword(req);

    expect(response.status).toBe(200);
    expect(req.payload.login).toHaveBeenCalledWith({
      collection: "users",
      data: { email: "dimas@example.test", password: "old-secret" },
    });
    expect(update).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 7,
        data: { password: "new-secret-1" },
        context: { [PASSWORD_CHANGE_CONTEXT]: true },
        overrideAccess: false,
      }),
    );
  });

  it("answers a wrong password with one fixed message and no attempt count", async () => {
    const { req, update } = request(async () => {
      throw Object.assign(
        new Error("The email or password provided is incorrect."),
        {
          name: "AuthenticationError",
        },
      );
    });

    const response = await changePassword(req);

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      field: "currentPassword",
      message: WRONG_CURRENT_PASSWORD,
    });
    expect(update).not.toHaveBeenCalled();
  });

  it("reports a lockout with the sign-in screen's message", async () => {
    const { req } = request(async () => {
      throw Object.assign(new Error("locked"), { name: "LockedAuth" });
    });

    const response = await changePassword(req);

    expect(response.status).toBe(423);
    expect((await response.json()).message).toBe(LOCKED_ACCOUNT_MESSAGE);
  });

  it("checks the form before spending a sign-in attempt", async () => {
    const { req } = request(async () => ({}), {
      ...valid,
      repeatPassword: "x",
    });

    expect((await changePassword(req)).status).toBe(400);
    expect(req.payload.login).not.toHaveBeenCalled();
  });

  it("refuses anonymous requests", async () => {
    const { req } = request(async () => ({}));
    (req as { user: unknown }).user = null;

    expect((await changePassword(req)).status).toBe(401);
  });
});

describe("requireVerifiedPasswordChange", () => {
  type Args = Parameters<typeof requireVerifiedPasswordChange>[0];
  const run = (overrides: Partial<Args>) =>
    requireVerifiedPasswordChange({
      context: {},
      data: { password: "x" },
      operation: "update",
      originalDoc: { id: 7 },
      req: { user: { id: 7 } },
      ...overrides,
    } as Args);

  it("blocks changing your own password without the current one", () => {
    expect(() => run({})).toThrow(/My account/);
  });

  it("allows the verified change and a Super Admin resetting someone else", () => {
    expect(run({ context: { [PASSWORD_CHANGE_CONTEXT]: true } })).toEqual({
      password: "x",
    });
    expect(run({ req: { user: { id: 1 } } } as Partial<Args>)).toEqual({
      password: "x",
    });
  });

  it("ignores updates without a password", () => {
    expect(run({ data: { name: "Dimas" } })).toEqual({ name: "Dimas" });
  });
});
