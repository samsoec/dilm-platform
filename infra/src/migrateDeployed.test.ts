import { spawnSync } from "node:child_process";
import {
  chmodSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";

const script = path.resolve(__dirname, "../../scripts/ci/migrate-deployed.sh");

function run(options: {
  secret?: string | null;
  describeError?: string;
  valueError?: string;
  migrate: string;
  stage?: string;
}) {
  const dir = mkdtempSync(path.join(tmpdir(), "migrate-deployed-"));
  const bin = path.join(dir, "bin");
  mkdirSync(bin);
  const secret = options.secret ?? "";
  writeFileSync(
    path.join(bin, "aws"),
    `#!/bin/sh
case "$*" in
  *describe-secret*) ${options.describeError ? `echo "An error occurred (${options.describeError}) when calling" >&2; exit 254` : "echo arn:aws:secretsmanager:ap-southeast-3:1:secret:x"} ;;
  *get-secret-value*) ${options.secret === null ? `echo "An error occurred (${options.valueError ?? "ResourceNotFoundException"}) when calling" >&2; exit 254` : `printf '%s' '${secret}'`} ;;
esac
`,
  );
  chmodSync(path.join(bin, "aws"), 0o755);
  const counter = path.join(dir, "count");
  writeFileSync(counter, "0");
  writeFileSync(
    path.join(dir, "migrate.sh"),
    `#!/bin/sh
n=$(($(cat ${counter}) + 1)); echo $n > ${counter}
${options.migrate}
`,
  );
  chmodSync(path.join(dir, "migrate.sh"), 0o755);
  const result = spawnSync(
    "bash",
    [script, "--stage", options.stage ?? "staging"],
    {
      encoding: "utf8",
      env: {
        PATH: `${bin}:${process.env.PATH}`,
        MIGRATE_COMMAND: path.join(dir, "migrate.sh"),
        MIGRATE_RETRY_SECONDS: "0",
        MIGRATE_ATTEMPTS: "3",
      },
    },
  );
  return {
    ...result,
    attempts: Number(readFileSync(counter, "utf8")),
  };
}

const seeded = JSON.stringify({
  username: "payload_app",
  password: "s3cret-pw",
  host: "h",
  dbname: "dilm",
});

describe("migrate-deployed.sh", () => {
  it("rejects a stage outside staging and production", () => {
    expect(
      run({ migrate: "exit 0", stage: "dev", secret: seeded }).status,
    ).toBe(2);
  });

  it("points at the seeding script when the secret has no value", () => {
    const result = run({ migrate: "exit 0", secret: null });
    expect(result.status).toBe(1);
    expect(result.stderr).toContain(
      "scripts/db/create-payload-app-role.sh --stage staging",
    );
    expect(result.attempts).toBe(0);
  });

  it("points at the seeding script when the secret lacks a password", () => {
    const result = run({ migrate: "exit 0", secret: "{}" });
    expect(result.status).toBe(1);
    expect(result.stderr).toContain("create-payload-app-role.sh");
  });

  it("reports an access error instead of calling the secret unseeded", () => {
    const describe = run({
      migrate: "exit 0",
      secret: seeded,
      describeError: "AccessDeniedException",
    });
    expect(describe.status).toBe(1);
    expect(describe.stderr).toContain("AccessDeniedException");
    expect(describe.stderr).not.toContain("create-payload-app-role");
    const value = run({
      migrate: "exit 0",
      secret: null,
      valueError: "AccessDeniedException",
    });
    expect(value.status).toBe(1);
    expect(value.stderr).toContain("AccessDeniedException");
    expect(value.stderr).not.toContain("create-payload-app-role");
  });

  it("never prints the password and masks before migrate output", () => {
    const result = run({ migrate: "echo migrate-output", secret: seeded });
    expect(result.stdout + result.stderr).not.toMatch(
      /(?<!::add-mask::)s3cret-pw/,
    );
    expect(
      result.stdout.indexOf("::add-mask::s3cret-pw"),
    ).toBeGreaterThanOrEqual(0);
    expect(result.stdout.indexOf("::add-mask::s3cret-pw")).toBeLessThan(
      result.stdout.indexOf("migrate-output"),
    );
  });

  it("masks the credential before running", () => {
    const result = run({ migrate: "exit 0", secret: seeded });
    expect(result.status).toBe(0);
    expect(result.stdout).toContain("::add-mask::s3cret-pw");
  });

  it("retries a connection failure until it succeeds", () => {
    const result = run({
      migrate: '[ "$n" -ge 2 ] || { echo "connect ETIMEDOUT" >&2; exit 1; }',
      secret: seeded,
    });
    expect(result.status).toBe(0);
    expect(result.attempts).toBe(2);
  });

  it("gives up after the bounded attempts", () => {
    const result = run({
      migrate: 'echo "connect ECONNREFUSED" >&2; exit 1',
      secret: seeded,
    });
    expect(result.status).toBe(1);
    expect(result.attempts).toBe(3);
  });

  it("does not retry a statement timeout", () => {
    const result = run({
      migrate:
        'echo "Migrating: 20250101_add" ; echo "canceling statement due to statement timeout" >&2; exit 1',
      secret: seeded,
    });
    expect(result.status).toBe(1);
    expect(result.attempts).toBe(1);
  });

  it("does not retry when a migration name contains timeout", () => {
    const result = run({
      migrate:
        'echo "Migrating: 20250101_add_timeout"; echo "connect ECONNRESET" >&2; exit 1',
      secret: seeded,
    });
    expect(result.attempts).toBe(1);
  });

  it("does not retry a lock timeout error with no connection error", () => {
    const result = run({
      migrate: 'echo "canceling statement due to lock timeout" >&2; exit 1',
      secret: seeded,
    });
    expect(result.attempts).toBe(1);
  });

  it("never retries a failing migration", () => {
    const result = run({
      migrate: 'echo "syntax error at or near" >&2; exit 3',
      secret: seeded,
    });
    expect(result.status).toBe(3);
    expect(result.attempts).toBe(1);
    expect(result.stderr).toContain("old schema");
  });
});
