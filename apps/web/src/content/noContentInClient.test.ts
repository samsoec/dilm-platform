import path from "node:path";

import { Linter } from "eslint";
import { describe, expect, it } from "vitest";

async function lint(code: string) {
  const rulePath = path.resolve(
    import.meta.dirname,
    "../../eslint-rules/no-content-in-client.mjs",
  );
  const rule = (await import(rulePath)).default;
  const linter = new Linter();
  return linter.verify(code, [
    {
      plugins: { dilm: { rules: { "no-content-in-client": rule } } },
      rules: { "dilm/no-content-in-client": "error" },
      languageOptions: { sourceType: "module" },
    },
  ]);
}

describe("no-content-in-client", () => {
  it("blocks content imports in a use client file", async () => {
    const messages = await lint(
      '"use client";\nimport { readTenant } from "@/content/client";\n',
    );
    expect(messages).toHaveLength(1);
    expect(messages[0]?.message).toMatch(/server-only/);
  });

  it("allows content imports in server files", async () => {
    expect(
      await lint('import { readTenant } from "@/content/client";\n'),
    ).toEqual([]);
  });

  it("allows other imports in client files", async () => {
    expect(await lint('"use client";\nimport { x } from "./other";\n')).toEqual(
      [],
    );
  });
});
