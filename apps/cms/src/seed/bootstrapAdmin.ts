import { randomInt } from "node:crypto";
import type { Payload } from "payload";

export const MIN_PASSWORD_LENGTH = 12;

export type AdminOutcome =
  | "created"
  | "already-super-admin"
  | "exists-without-role"
  | "other-super-admin-exists";

type UserRow = { email?: string | null; roles?: string[] | null };

export function planAdmin(
  users: UserRow[],
  email: string,
): Exclude<AdminOutcome, "created"> | "create" {
  const wanted = email.toLowerCase();
  const match = users.find((user) => user.email?.toLowerCase() === wanted);
  if (match) {
    return match.roles?.includes("super-admin")
      ? "already-super-admin"
      : "exists-without-role";
  }
  return users.some((user) => user.roles?.includes("super-admin"))
    ? "other-super-admin-exists"
    : "create";
}

export function emailProblem(email: string | undefined): string | null {
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "a valid --email is required";
  }
  return null;
}

export function passwordProblem(password: string | undefined): string | null {
  if (!password || password.length < MIN_PASSWORD_LENGTH) {
    return `the password must be at least ${MIN_PASSWORD_LENGTH} characters`;
  }
  return null;
}

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789-_";

export function generatePassword(
  length = 24,
  pick: (max: number) => number = (max) => randomInt(max),
): string {
  return Array.from({ length }, () => ALPHABET[pick(ALPHABET.length)]).join("");
}

export async function ensureFirstSuperAdmin(
  payload: Payload,
  email: string,
  getPassword: () => Promise<string>,
): Promise<AdminOutcome> {
  const { docs } = await payload.find({
    collection: "users",
    limit: 1000,
    depth: 0,
    pagination: false,
    select: { email: true, roles: true },
  });
  const plan = planAdmin(docs, email);
  if (plan !== "create") return plan;
  await payload.create({
    collection: "users",
    data: { email, password: await getPassword(), roles: ["super-admin"] },
  });
  return "created";
}
