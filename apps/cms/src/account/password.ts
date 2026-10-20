import {
  APIError,
  type CollectionBeforeChangeHook,
  type Endpoint,
  type PayloadRequest,
} from "payload";

import { LOCKED_ACCOUNT_MESSAGE } from "../admin/login";

export const MIN_PASSWORD_LENGTH = 8;

export const WRONG_CURRENT_PASSWORD = "Your current password isn't right.";

export const PASSWORD_CHANGE_CONTEXT = "passwordChangeVerified";

export type PasswordChange = {
  currentPassword?: unknown;
  newPassword?: unknown;
  repeatPassword?: unknown;
};

export type PasswordField =
  "currentPassword" | "newPassword" | "repeatPassword";

export type PasswordProblem = { field: PasswordField; message: string };

export function passwordChangeProblem({
  currentPassword,
  newPassword,
  repeatPassword,
}: PasswordChange): PasswordProblem | undefined {
  if (typeof currentPassword !== "string" || currentPassword === "") {
    return {
      field: "currentPassword",
      message: "Enter your current password.",
    };
  }
  if (
    typeof newPassword !== "string" ||
    newPassword.length < MIN_PASSWORD_LENGTH
  ) {
    return {
      field: "newPassword",
      message: `Use at least ${MIN_PASSWORD_LENGTH} characters.`,
    };
  }
  if (newPassword !== repeatPassword) {
    return {
      field: "repeatPassword",
      message: "The new passwords don't match.",
    };
  }
  if (newPassword === currentPassword) {
    return {
      field: "newPassword",
      message: "Pick a password that's different from your current one.",
    };
  }
  return undefined;
}

type ErrorWithName = { name?: string };

function respond(status: number, body: object): Response {
  return Response.json(body, { status });
}

export async function changePassword(req: PayloadRequest): Promise<Response> {
  const user = req.user as { id: number | string; email?: string } | null;
  if (!user?.email) return respond(401, { message: "Sign in first." });

  const body = ((await req.json?.().catch(() => undefined)) ??
    {}) as PasswordChange;
  const problem = passwordChangeProblem(body);
  if (problem) return respond(400, problem);

  try {
    await req.payload.login({
      collection: "users",
      data: { email: user.email, password: body.currentPassword as string },
    });
  } catch (error) {
    if ((error as ErrorWithName).name === "LockedAuth") {
      return respond(423, {
        field: "currentPassword",
        message: LOCKED_ACCOUNT_MESSAGE,
      });
    }
    return respond(400, {
      field: "currentPassword",
      message: WRONG_CURRENT_PASSWORD,
    });
  }

  await req.payload.update({
    collection: "users",
    id: user.id,
    data: { password: body.newPassword as string },
    context: { [PASSWORD_CHANGE_CONTEXT]: true },
    overrideAccess: false,
    user,
  });
  return respond(200, { message: "Password changed." });
}

export const changePasswordEndpoint: Endpoint = {
  path: "/change-password",
  method: "post",
  handler: changePassword,
};

export const requireVerifiedPasswordChange: CollectionBeforeChangeHook = ({
  context,
  data,
  operation,
  originalDoc,
  req,
}) => {
  if (operation !== "update" || !data?.password) return data;
  const own = req.user && String(req.user.id) === String(originalDoc?.id);
  if (own && !context[PASSWORD_CHANGE_CONTEXT]) {
    throw new APIError(
      "Change your password from My account, which asks for your current one.",
      403,
      undefined,
      true,
    );
  }
  return data;
};
