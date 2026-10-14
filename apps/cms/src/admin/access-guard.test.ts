import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const adminDir = path.dirname(fileURLToPath(import.meta.url));

const LOCAL_API_READ =
  /\bpayload\.(find|findByID|findGlobal|count|countVersions|findVersions|findDistinct)\(/g;

function sources(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return sources(full);
    return /\.tsx?$/.test(entry.name) && !entry.name.includes(".test.")
      ? [full]
      : [];
  });
}

function calls(source: string): string[] {
  return [...source.matchAll(LOCAL_API_READ)].map(({ index }) => {
    let depth = 0;
    for (let i = source.indexOf("(", index); i < source.length; i++) {
      if (source[i] === "(") depth++;
      if (source[i] === ")" && --depth === 0) return source.slice(index, i + 1);
    }
    return source.slice(index);
  });
}

describe("admin Local API reads (NFR-UI-01)", () => {
  const reads = sources(adminDir).flatMap((file) =>
    calls(readFileSync(file, "utf8")).map((call) => ({
      file: path.relative(adminDir, file),
      call,
    })),
  );

  it("finds the reads it guards", () => {
    expect(reads.length).toBeGreaterThan(0);
  });

  it.each(reads)("$file passes overrideAccess: false", ({ call }) => {
    expect(call).toMatch(/overrideAccess:\s*false/);
  });
});
