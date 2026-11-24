import { describe, expect, it, vi } from "vitest";

import { internalPath } from "./rewrite";
import { parseAliases, resolveTenant } from "./resolveTenant";

describe("resolveTenant", () => {
  it("maps each canonical domain, with or without www", () => {
    expect(resolveTenant("indonesianacidsindustry.com")).toBe("indoacid");
    expect(resolveTenant("www.duniakimiautama.com")).toBe("duniakimia");
    expect(resolveTenant("LikuTelaga.com:443")).toBe("likutelaga");
  });

  it("maps <slug>.localhost with a port", () => {
    expect(resolveTenant("likutelaga.localhost:3001")).toBe("likutelaga");
    expect(resolveTenant("nope.localhost:3001")).toBeNull();
  });

  it("maps per-stage aliases", () => {
    const aliases = parseAliases(
      "staging.example.net=duniakimia, x.test=indoacid",
    );
    expect(resolveTenant("staging.example.net", aliases)).toBe("duniakimia");
    expect(resolveTenant("x.test", aliases)).toBe("indoacid");
  });

  it("ignores an alias for an unknown tenant and reports it", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    const aliases = parseAliases("a.test=nobody,b.test=indoacid");
    expect(aliases.has("a.test")).toBe(false);
    expect(aliases.get("b.test")).toBe("indoacid");
    expect(error).toHaveBeenCalledOnce();
    error.mockRestore();
  });

  it("returns null for unknown or missing hosts", () => {
    expect(resolveTenant("evil.example")).toBeNull();
    expect(resolveTenant(null)).toBeNull();
    expect(resolveTenant("")).toBeNull();
  });
});

describe("internalPath", () => {
  it("prefixes the tenant", () => {
    expect(internalPath("indoacid", "/en/about")).toBe("/indoacid/en/about");
    expect(internalPath("indoacid", "/en/")).toBe("/indoacid/en");
    expect(internalPath("indoacid", "/")).toBe("/indoacid");
  });

  it("gives the same public path on two tenants two cache entries", () => {
    const first = internalPath("indoacid", "/en/about");
    const second = internalPath("duniakimia", "/en/about");
    expect(new Set([first, second]).size).toBe(2);
  });
});
