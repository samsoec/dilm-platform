import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

function sources(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return sources(path);
    return /\.tsx?$/.test(name) && !/\.test\./.test(name) ? [path] : [];
  });
}

describe("step nav", () => {
  it("never appends to the previous route's crumbs", () => {
    const offenders = sources(join(__dirname, ".."))
      .filter((path) =>
        /setStepNav\(\[\s*\.\.\.stepNav/.test(readFileSync(path, "utf8")),
      )
      .map((path) => path.split("/components/")[1]);
    expect(offenders).toEqual([]);
  });
});
