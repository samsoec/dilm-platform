import { createInterface } from "node:readline";
import { getPayload } from "payload";

import config from "../payload.config";
import {
  emailProblem,
  ensureFirstSuperAdmin,
  generatePassword,
  passwordProblem,
} from "./bootstrapAdmin";

const email = process.env.BOOTSTRAP_ADMIN_EMAIL;
const generate = process.env.BOOTSTRAP_GENERATE_PASSWORD === "1";

function fail(message: string): never {
  console.error(message);
  process.exit(2);
}

function promptHidden(question: string): Promise<string> {
  return new Promise((resolve) => {
    const rl = createInterface({ input: process.stdin, terminal: true });
    const out = rl as unknown as { _writeToOutput: (text: string) => void };
    out._writeToOutput = () => {};
    process.stderr.write(question);
    rl.question("", (answer) => {
      rl.close();
      process.stderr.write("\n");
      resolve(answer);
    });
  });
}

let generated: string | undefined;

async function readPassword(): Promise<string> {
  if (process.env.BOOTSTRAP_ADMIN_PASSWORD) {
    return process.env.BOOTSTRAP_ADMIN_PASSWORD;
  }
  if (generate) {
    if (!process.stdin.isTTY || process.env.CI) {
      fail(
        "Refusing to generate a password where the output may be logged. " +
          "Run it from a terminal, or supply BOOTSTRAP_ADMIN_PASSWORD.",
      );
    }
    const password = generatePassword();
    generated = password;
    return password;
  }
  if (!process.stdin.isTTY) {
    fail(
      "No password source. Set BOOTSTRAP_ADMIN_PASSWORD, pass --generate-password, or run from a terminal.",
    );
  }
  const first = await promptHidden("Super Admin password: ");
  const second = await promptHidden("Repeat password: ");
  if (first !== second) fail("The passwords do not match.");
  return first;
}

const problem = emailProblem(email);
if (problem) fail(problem);

const payload = await getPayload({ config });
const outcome = await ensureFirstSuperAdmin(payload, email!, async () => {
  const password = await readPassword();
  const bad = passwordProblem(password);
  if (bad) fail(bad);
  return password;
});

const messages = {
  created: `created Super Admin ${email}`,
  "already-super-admin": `${email} is already a Super Admin: nothing changed`,
  "exists-without-role": `${email} exists without the Super Admin role: nothing changed (use grant:super-admin)`,
  "other-super-admin-exists": `a Super Admin already exists: nothing created for ${email}`,
} as const;
console.log(messages[outcome]);
if (outcome === "created" && generated) {
  process.stderr.write(
    `\nGenerated Super Admin password (shown once, store it now):\n${generated}\n\n`,
  );
}

await payload.destroy();
process.exit(0);
