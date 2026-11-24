import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";

import { proxy } from "./proxy";

function call(host: string, path = "/en/about") {
  return proxy(
    new NextRequest(`http://internal.invalid${path}`, { headers: { host } }),
  );
}

describe("proxy", () => {
  it("rewrites the same path to a different internal route per tenant", () => {
    const a = call("indoacid.localhost:3001");
    const b = call("duniakimia.localhost:3001");
    const target = (r: Response) => r.headers.get("x-middleware-rewrite");
    expect(target(a)).toContain("/indoacid/en/about");
    expect(target(b)).toContain("/duniakimia/en/about");
    expect(target(a)).not.toBe(target(b));
  });

  it("answers an unknown host with a plain 404", async () => {
    const response = call("unknown.example");
    expect(response.status).toBe(404);
    expect(response.headers.get("content-type")).toContain("text/plain");
    expect(await response.text()).toBe("Not Found");
  });
});
