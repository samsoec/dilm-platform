import { spawnSync } from "node:child_process";
import {
  chmodSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";

const script = path.resolve(__dirname, "../../scripts/bootstrap-cms.sh");

function run(args: string[], env: Record<string, string> = {}) {
  const dir = mkdtempSync(path.join(tmpdir(), "bootstrap-cms-"));
  const bin = path.join(dir, "bin");
  mkdirSync(bin);
  const calls = path.join(dir, "calls");
  for (const name of ["aws", "pnpm"]) {
    writeFileSync(
      path.join(bin, name),
      `#!/bin/sh\necho "${name} $*" >> ${calls}\ncase "$*" in *get-caller-identity*) echo 111122223333;; *describe-secret*) echo arn:x;; esac\n`,
    );
    chmodSync(path.join(bin, name), 0o755);
  }
  const result = spawnSync("bash", [script, ...args], {
    encoding: "utf8",
    stdin: "ignore",
    env: { PATH: `${bin}:${process.env.PATH}`, ...env },
  } as never);
  return {
    status: result.status,
    stderr: result.stderr,
    calls: existsSync(calls) ? readFileSync(calls, "utf8") : "",
  };
}

describe("bootstrap-cms.sh guard rails", () => {
  const refused: [string, string[], Record<string, string>?][] = [
    [
      "production without --confirm-production",
      ["--stage", "production", "--email", "a@b.co"],
    ],
    [
      "production with --demo",
      [
        "--stage",
        "production",
        "--email",
        "a@b.co",
        "--demo",
        "--confirm-production",
      ],
    ],
    ["an unknown flag", ["--stage", "staging", "--email", "a@b.co", "--nope"]],
    ["a missing --email", ["--stage", "staging"]],
    ["a bad stage", ["--stage", "dev", "--email", "a@b.co"]],
    ["a missing --stage value", ["--email", "a@b.co", "--stage"]],
    ["a missing --email value", ["--stage", "staging", "--email"]],
    [
      "local with a non-local host",
      ["--stage", "local", "--email", "a@b.co"],
      { DATABASE_HOST: "x.cluster.ap-southeast-3.rds.amazonaws.com" },
    ],
    [
      "local with non-password auth",
      ["--stage", "local", "--email", "a@b.co"],
      { DATABASE_AUTH: "secret" },
    ],
    [
      "production without the typed account id",
      ["--stage", "production", "--email", "a@b.co", "--confirm-production"],
    ],
    [
      "production with the wrong account id",
      ["--stage", "production", "--email", "a@b.co", "--confirm-production"],
      { BOOTSTRAP_CONFIRM_ACCOUNT: "999" },
    ],
  ];

  it.each(refused)(
    "exits 2 for %s without running anything",
    (_n, args, env) => {
      const result = run(args, env);
      expect(result.status).toBe(2);
      expect(result.calls).not.toContain("pnpm");
      expect(result.calls).not.toContain("describe-secret");
      expect(result.calls).not.toContain("get-secret-value");
    },
  );

  it("does not leak the password to child processes", () => {
    const result = run(["--stage", "local", "--email", "a@b.co"], {
      DATABASE_HOST: "localhost",
      BOOTSTRAP_ADMIN_PASSWORD: "super-secret-pw-1",
    });
    expect(result.calls).not.toContain("super-secret-pw-1");
  });
});
