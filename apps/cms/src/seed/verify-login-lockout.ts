import { randomUUID } from "node:crypto";

import { AuthenticationError, getPayload, LockedAuth } from "payload";

import { LOGIN_LOCKOUT } from "../collections/Users";
import config from "../payload.config";

if (process.argv.includes("--help")) {
  console.error(
    "usage: pnpm --filter @dilm/cms verify:login-lockout\n\n" +
      "Creates a throwaway tenant-viewer user, fails its login " +
      `${LOGIN_LOCKOUT.maxLoginAttempts} times, then checks that the correct ` +
      "password is refused and the lock lasts the configured lockTime. The " +
      "user is deleted afterwards. Runs against whichever database the " +
      "runtime config points at, so it also verifies staging.",
  );
  process.exit(2);
}

const payload = await getPayload({ config });
const email = `lockout-check-${randomUUID()}@example.invalid`;
const password = randomUUID();
const failures: string[] = [];

async function attempt(withPassword: string) {
  try {
    await payload.login({
      collection: "users",
      data: { email, password: withPassword },
    });
    return "accepted";
  } catch (error) {
    if (error instanceof LockedAuth) return "locked";
    if (error instanceof AuthenticationError) return "rejected";
    throw error;
  }
}

const user = await payload.create({
  collection: "users",
  data: { email, password, roles: ["tenant-viewer"] },
});

try {
  for (let n = 1; n <= LOGIN_LOCKOUT.maxLoginAttempts; n++) {
    const outcome = await attempt(`wrong-${n}`);
    payload.logger.info(`wrong password, attempt ${n}: ${outcome}`);
    if (outcome !== "rejected") failures.push(`attempt ${n} was ${outcome}`);
  }

  const startedAt = Date.now();
  const outcome = await attempt(password);
  payload.logger.info(`correct password after lockout: ${outcome}`);
  if (outcome !== "locked")
    failures.push(`correct password was ${outcome}, expected locked`);

  const { lockUntil } = await payload.findByID({
    collection: "users",
    id: user.id,
    showHiddenFields: true,
  });
  const lockedForMs = lockUntil ? new Date(lockUntil).getTime() - startedAt : 0;
  payload.logger.info(`locked for another ${Math.round(lockedForMs / 1000)}s`);
  if (
    lockedForMs <= LOGIN_LOCKOUT.lockTime - 60_000 ||
    lockedForMs > LOGIN_LOCKOUT.lockTime
  ) {
    failures.push(
      `lock lasts ${lockedForMs}ms, expected about ${LOGIN_LOCKOUT.lockTime}ms`,
    );
  }
} finally {
  await payload.delete({ collection: "users", id: user.id });
}

for (const failure of failures) payload.logger.error(failure);
payload.logger.info(
  failures.length ? "login lockout NOT working" : "login lockout working",
);

await payload.destroy();
process.exit(failures.length ? 1 : 0);
