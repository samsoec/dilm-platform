import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { CV_CONSUMER_HANDLER } from "./queue";

const infraRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const EXTENSIONS = [".ts", ".mts", ".js", ".mjs", ".cjs"];

function handlerFile(handler: string): string | undefined {
  const base = path.join(infraRoot, handler.replace(/\.[^./]+$/, ""));
  return EXTENSIONS.map((ext) => base + ext).find((file) => existsSync(file));
}

function literalHandlers(): string[] {
  const config = readFileSync(path.join(infraRoot, "sst.config.ts"), "utf8");
  return [...config.matchAll(/handler:\s*"([^"]+)"/g)].map((m) => m[1]!);
}

describe("Function handlers resolve from the SST root (infra/)", () => {
  it("finds a file for the CV consumer and every literal handler", () => {
    for (const handler of [CV_CONSUMER_HANDLER, ...literalHandlers()]) {
      expect(handlerFile(handler), handler).toBeDefined();
    }
  });

  it("points the CV consumer entry at a file that exists", () => {
    const entry = handlerFile(CV_CONSUMER_HANDLER)!;
    const target = /from "([^"]+)"/.exec(readFileSync(entry, "utf8"))![1]!;
    expect(existsSync(path.resolve(path.dirname(entry), target))).toBe(true);
  });
});
