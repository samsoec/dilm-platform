import { NextRequest } from "next/server";
import { describe, expect, it, vi } from "vitest";

import { proxy } from "./proxy";

function call(host: string, path = "/en/about") {
  return proxy(
    new NextRequest(`http://internal.invalid${path}`, { headers: { host } }),
  );
}

describe("proxy", () => {
  it("rewrites /robots.txt to the tenant robots route", () => {
    const response = call("likutelaga.localhost:3001", "/robots.txt");
    expect(response.headers.get("x-middleware-rewrite")).toContain(
      "/likutelaga/robots.txt",
    );
  });

  it("rewrites the same path to a different internal route per tenant", () => {
    const a = call("indoacid.localhost:3001");
    const b = call("duniakimia.localhost:3001");
    const target = (r: Response) => r.headers.get("x-middleware-rewrite");
    expect(target(a)).toContain("/indoacid/en/about");
    expect(target(b)).toContain("/duniakimia/en/about");
    expect(target(a)).not.toBe(target(b));
  });

  it("ignores a client-supplied x-forwarded-host and uses only host", () => {
    const request = new NextRequest("http://internal.invalid/en/about", {
      headers: {
        host: "unknown.example",
        "x-forwarded-host": "indoacid.localhost:3001",
      },
    });
    expect(proxy(request).status).toBe(404);
  });

  it("answers an unknown host with a plain 404", async () => {
    const response = call("unknown.example");
    expect(response.status).toBe(404);
    expect(response.headers.get("content-type")).toContain("text/plain");
    expect(await response.text()).toBe("Not Found");
  });

  it("survives a malformed TENANT_HOST_ALIASES value", async () => {
    vi.stubEnv(
      "TENANT_HOST_ALIASES",
      "typo.test=nobody,junk,=,ok.test=likutelaga",
    );
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    const known = call("indoacid.localhost:3001");
    expect(known.headers.get("x-middleware-rewrite")).toContain(
      "/indoacid/en/about",
    );
    expect(call("ok.test").headers.get("x-middleware-rewrite")).toContain(
      "/likutelaga/en/about",
    );
    expect(call("typo.test").status).toBe(404);
    expect(call("unknown.example").status).toBe(404);
    error.mockRestore();
    vi.unstubAllEnvs();
  });

  it("lets only the exact revalidate path through, on a known host", () => {
    const through = call("indoacid.localhost:3001", "/api/revalidate");
    expect(through.status).toBe(200);
    expect(through.headers.get("x-middleware-next")).toBe("1");
    expect(through.headers.get("x-middleware-rewrite")).toBeNull();
    expect(call("unknown.example", "/api/revalidate").status).toBe(404);
    expect(call("indoacid.localhost:3001", "/api/revalidate/x").status).toBe(
      404,
    );
    expect(call("indoacid.localhost:3001", "/api/other").status).toBe(404);
  });

  it("redirects bare / to the default locale", () => {
    const response = call("indoacid.localhost:3001", "/");
    expect(response.status).toBe(307);
    expect(new URL(response.headers.get("location")!).pathname).toBe("/en");
  });

  it("serves a bare locale root", () => {
    const response = call("indoacid.localhost:3001", "/id");
    expect(response.headers.get("x-middleware-rewrite")).toContain(
      "/indoacid/id",
    );
  });

  it("returns 404 for a path without a supported locale", () => {
    expect(call("indoacid.localhost:3001", "/about").status).toBe(404);
    expect(call("indoacid.localhost:3001", "/english/about").status).toBe(404);
    expect(call("indoacid.localhost:3001", "/zh/about").status).toBe(404);
  });
});

describe("proxy forwarded headers", () => {
  it("forwards tenant and locale as request headers", () => {
    const response = call("indoacid.localhost:3001", "/id/about");
    expect(response.headers.get("x-middleware-request-x-dilm-tenant")).toBe(
      "indoacid",
    );
    expect(response.headers.get("x-middleware-request-x-dilm-locale")).toBe(
      "id",
    );
  });
});

describe("proxy security headers", () => {
  it("sets them on the redirect and the 404", () => {
    for (const res of [
      call("indoacid.localhost:3001", "/"),
      call("unknown.invalid"),
    ]) {
      expect(res.headers.get("x-content-type-options")).toBe("nosniff");
      expect(res.headers.get("content-security-policy")).toContain(
        "frame-ancestors 'none'",
      );
    }
  });
});
