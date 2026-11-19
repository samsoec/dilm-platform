import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";

import { describe, expect, it } from "vitest";

import {
  adminViewerRequestCode,
  assertAssetsBuilt,
  cacheControlFor,
  contentTypeFor,
  listStaticAssets,
  staticBucketName,
  staticBucketPolicy,
  staticPathPatterns,
} from "./edge";

type Headers = Record<string, { value: string }>;

function run(code: string, ip: string, headers: Headers = {}) {
  const handler = new Function(`${code}; return handler;`)() as (
    event: unknown,
  ) => { statusCode?: number; headers: Headers };
  return handler({ viewer: { ip }, request: { headers } });
}

describe("adminViewerRequestCode", () => {
  const code = adminViewerRequestCode(["203.0.113.1/32", "198.51.100.4"]);

  it("lets an allowlisted viewer through and forwards the viewer host", () => {
    const out = run(code, "203.0.113.1", {
      host: { value: "d111.cloudfront.net" },
      "x-forwarded-host": { value: "evil.example" },
    });
    expect(out.statusCode).toBeUndefined();
    expect(out.headers["x-forwarded-host"]).toEqual({
      value: "d111.cloudfront.net",
    });
  });

  it("answers 403 to everyone else, including IPv6 and near misses", () => {
    for (const ip of ["203.0.113.10", "2001:db8::1", "", "203.0.113.1 "]) {
      expect(run(code, ip).statusCode).toBe(403);
    }
  });

  it("refuses ranges, junk and an empty list", () => {
    expect(() => adminViewerRequestCode(["10.0.0.0/8"])).toThrow(/single IPv4/);
    expect(() => adminViewerRequestCode(["1.2.3.256"])).toThrow(/single IPv4/);
    expect(() => adminViewerRequestCode(["::1"])).toThrow(/single IPv4/);
    expect(() => adminViewerRequestCode([])).toThrow(/empty/);
  });

  it("stays within the 10 KB CloudFront Function limit", () => {
    expect(code.length).toBeLessThan(10_000);
  });

  it("admits every viewer with *, still forwarding the viewer host", () => {
    const open = adminViewerRequestCode(["*"]);
    for (const ip of ["203.0.113.10", "2001:db8::1"]) {
      const out = run(open, ip, { host: { value: "d111.cloudfront.net" } });
      expect(out.statusCode).toBeUndefined();
      expect(out.headers["x-forwarded-host"]).toEqual({
        value: "d111.cloudfront.net",
      });
    }
  });
});

describe("staticBucketPolicy", () => {
  const policy = staticBucketPolicy(
    "aws",
    staticBucketName("staging"),
    "arn:aws:cloudfront::1:distribution/E1",
  );

  it("keeps the TLS-only deny and admits only this distribution", () => {
    const [tls, allow] = policy.Statement;
    expect(tls!.Effect).toBe("Deny");
    expect(allow!.Principal).toEqual({ Service: "cloudfront.amazonaws.com" });
    expect(allow!.Action).toBe("s3:GetObject");
    expect(allow!.Condition).toEqual({
      StringEquals: {
        "AWS:SourceArn": "arn:aws:cloudfront::1:distribution/E1",
      },
    });
    expect(allow!.Resource).toBe("arn:aws:s3:::dilm-staging-cms-static/*");
  });
});

describe("static assets", () => {
  const dir = mkdtempSync(path.join(os.tmpdir(), "assets-"));
  mkdirSync(path.join(dir, "_next", "static", "css"), { recursive: true });
  mkdirSync(path.join(dir, "brand"));
  writeFileSync(path.join(dir, "BUILD_ID"), "x");
  writeFileSync(path.join(dir, "favicon.svg"), "<svg/>");
  writeFileSync(path.join(dir, "brand", "a.png"), "x");
  writeFileSync(path.join(dir, "_next", "static", "css", "a.css"), "x");
  const assets = listStaticAssets(dir);

  it("lists files with keys, types and cache headers, without BUILD_ID", () => {
    expect(assets.map((a) => a.key)).toEqual([
      "_next/static/css/a.css",
      "brand/a.png",
      "favicon.svg",
    ]);
    expect(assets[0]).toMatchObject({
      contentType: "text/css",
      cacheControl: "public,max-age=31536000,immutable",
    });
    expect(assets[1]!.cacheControl).toBe("public,max-age=3600");
  });

  it("derives one behaviour per top-level entry, static narrowed", () => {
    expect(staticPathPatterns(assets.map((a) => a.key))).toEqual([
      "_next/static/*",
      "brand/*",
      "favicon.svg",
    ]);
  });

  it("falls back for unknown types and fails when the build is missing", () => {
    expect(contentTypeFor("x.bin")).toBe("application/octet-stream");
    expect(cacheControlFor("_next/data/x.json")).toBe("public,max-age=3600");
    expect(() => assertAssetsBuilt("/repo/infra", () => false)).toThrow(
      /build:open-next/,
    );
  });
});
