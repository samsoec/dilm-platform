import { spawnSync } from "node:child_process";
import {
  chmodSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  rmSync,
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
      `#!/bin/sh\necho "${name} $* PW=[\${BOOTSTRAP_ADMIN_PASSWORD:-}]" >> ${calls}\ncase "$*" in *get-caller-identity*) echo 111122223333;; *describe-secret*) echo arn:x;; esac\n`,
    );
    chmodSync(path.join(bin, name), 0o755);
  }
  const result = spawnSync("bash", [script, ...args], {
    encoding: "utf8",
    stdin: "ignore",
    env: { PATH: `${bin}:${process.env.PATH}`, ...env },
  } as never);
  const recorded = existsSync(calls) ? readFileSync(calls, "utf8") : "";
  rmSync(dir, { recursive: true, force: true });
  return { status: result.status, stderr: result.stderr, calls: recorded };
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

  it("hands the password only to seed:admin", () => {
    const result = run(["--stage", "local", "--email", "a@b.co", "--demo"], {
      DATABASE_HOST: "localhost",
      BOOTSTRAP_ADMIN_PASSWORD: "super-secret-pw-1",
    });
    expect(result.status).toBe(0);
    const pnpm = result.calls.split("\n").filter((l) => l.startsWith("pnpm"));
    expect(pnpm.map((l) => l.split(" ").slice(0, 4).join(" "))).toHaveLength(5);
    const leaking = pnpm.filter((l) => l.includes("super-secret-pw-1"));
    expect(leaking).toHaveLength(1);
    expect(leaking[0]).toContain("seed:admin");
    for (const line of pnpm.filter((l) => !l.includes("seed:admin"))) {
      expect(line).toContain("PW=[]");
    }
  });
});

describe("bootstrap-cms.sh local host guard reads the .env", () => {
  function withEnvFile(content: string | null) {
    const dir = mkdtempSync(path.join(tmpdir(), "bootstrap-envfile-"));
    const file = path.join(dir, ".env");
    if (content !== null) writeFileSync(file, content);
    return { BOOTSTRAP_ENV_FILE: file };
  }
  const local = ["--stage", "local", "--email", "a@b.co"];

  it.each([
    ["export form", "export DATABASE_HOST=x.rds.amazonaws.com\n"],
    ["spaced form", "  DATABASE_HOST = x.rds.amazonaws.com\n"],
    ["quoted form", 'DATABASE_HOST="x.rds.amazonaws.com"\n'],
    [
      "last line wins",
      "DATABASE_HOST=localhost\nDATABASE_HOST=x.rds.amazonaws.com\n",
    ],
    ["no host", "DATABASE_NAME=dilm\n"],
    ["inline comment", "DATABASE_HOST=localhost # old\n"],
    ["carriage return", "DATABASE_HOST=localhost\r\n"],
    [
      "non-password auth",
      "DATABASE_HOST=localhost\nexport DATABASE_AUTH = iam\n",
    ],
  ])("refuses %s", (_n, content) => {
    const result = run(local, withEnvFile(content));
    expect(result.status).toBe(2);
    expect(result.calls).toBe("");
  });

  it("refuses a missing .env with no host in the environment", () => {
    const result = run(local, { BOOTSTRAP_ENV_FILE: "/nonexistent/.env" });
    expect(result.status).toBe(2);
    expect(result.calls).toBe("");
  });

  it("lets the environment win over the file", () => {
    const result = run(local, {
      ...withEnvFile("DATABASE_HOST=x.rds.amazonaws.com\n"),
      DATABASE_HOST: "localhost",
    });
    expect(result.status).toBe(0);
  });

  it("passes a localhost host", () => {
    const result = run(local, withEnvFile("DATABASE_HOST = 'localhost'\n"));
    expect(result.status).toBe(0);
    expect(result.calls).toContain("pnpm");
  });
});
