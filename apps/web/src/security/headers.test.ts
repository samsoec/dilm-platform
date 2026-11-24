import { describe, expect, it } from "vitest";

import {
  buildCsp,
  cspMode,
  securityHeaders,
  withSecurityHeaders,
} from "./headers";

function find(list: { key: string; value: string }[], key: string) {
  return list.filter((h) => h.key === key).map((h) => h.value);
}

describe("buildCsp", () => {
  const csp = buildCsp();

  it("is static: no nonce or hash sources", () => {
    expect(csp).not.toMatch(/nonce-|sha256-/);
  });

  it("allows inline scripts and GA4 hosts only for scripts", () => {
    expect(csp).toContain(
      "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com",
    );
    expect(csp).not.toContain("unsafe-eval");
  });

  it("locks objects, base and forms", () => {
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain("base-uri 'self'");
    expect(csp).toContain("form-action 'self'");
  });

  it("allows eval only in dev", () => {
    expect(buildCsp({ dev: true })).toContain("'unsafe-eval'");
  });
});

describe("securityHeaders", () => {
  it("ships the CSP report-only by default and always enforces frame-ancestors", () => {
    const list = securityHeaders();
    expect(find(list, "Content-Security-Policy")).toEqual([
      "frame-ancestors 'none'",
    ]);
    expect(find(list, "Content-Security-Policy-Report-Only")).toHaveLength(1);
  });

  it("enforces the full CSP in enforce mode", () => {
    const list = securityHeaders({ mode: "enforce" });
    expect(find(list, "Content-Security-Policy")).toHaveLength(2);
    expect(find(list, "Content-Security-Policy-Report-Only")).toHaveLength(0);
  });

  it("includes the hardening headers", () => {
    const keys = securityHeaders().map((h) => h.key);
    expect(keys).toEqual(
      expect.arrayContaining([
        "Strict-Transport-Security",
        "X-Content-Type-Options",
        "Referrer-Policy",
        "Permissions-Policy",
      ]),
    );
  });

  it("sets no cache headers", () => {
    const keys = securityHeaders().map((h) => h.key.toLowerCase());
    expect(keys).not.toContain("cache-control");
    expect(keys).not.toContain("vary");
  });
});

describe("cspMode", () => {
  it("defaults to report-only", () => {
    expect(cspMode(undefined)).toBe("report-only");
    expect(cspMode("enforce")).toBe("enforce");
  });
});

describe("withSecurityHeaders", () => {
  it("adds the headers to a response", () => {
    const res = withSecurityHeaders(new Response("x", { status: 404 }));
    expect(res.headers.get("x-content-type-options")).toBe("nosniff");
  });
});
