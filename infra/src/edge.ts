import { existsSync, readdirSync } from "node:fs";
import path from "node:path";

import { secureTransportOnlyPolicy } from "./storage";

export const CACHING_DISABLED_POLICY_ID =
  "4135ea2d-6df8-44a3-9df3-4b5a84be39ad";
export const CACHING_OPTIMIZED_POLICY_ID =
  "658327ea-f89d-4fab-a63d-7e88639e58f6";
export const ALL_VIEWER_EXCEPT_HOST_POLICY_ID =
  "b689b0a8-53d0-40ab-baf2-68738e2966ac";
export const ORIGIN_KEY_HEADER = "x-api-key";
export const ORIGIN_READ_TIMEOUT_SECONDS = 30;
export const ASSETS_RELATIVE_DIR = "apps/cms/.open-next/assets";
export const IMMUTABLE_PREFIX = "_next/static/";
export const IMMUTABLE_CACHE_CONTROL = "public,max-age=31536000,immutable";
export const PUBLIC_FILE_CACHE_CONTROL = "public,max-age=3600";
export const EXCLUDED_ASSET_FILES = ["BUILD_ID"];

const CONTENT_TYPES: Record<string, string> = {
  ".css": "text/css",
  ".js": "text/javascript",
  ".mjs": "text/javascript",
  ".json": "application/json",
  ".map": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".txt": "text/plain",
  ".html": "text/html",
};

export interface StaticAsset {
  key: string;
  file: string;
  contentType: string;
  cacheControl: string;
}

export function staticBucketName(stage: string): string {
  return `dilm-${stage}-cms-static`;
}

export function adminViewerRequestCode(allowedIps: string[]): string {
  const openToEveryone = allowedIps.length === 1 && allowedIps[0] === "*";
  const addresses = (openToEveryone ? [] : allowedIps).map((entry) => {
    const [address, prefix, ...rest] = entry.split("/");
    const octets = (address ?? "").split(".");
    const valid =
      rest.length === 0 &&
      (prefix === undefined || prefix === "32") &&
      octets.length === 4 &&
      octets.every((o) => /^(0|[1-9]\d{0,2})$/.test(o) && Number(o) <= 255);
    if (!valid) {
      throw new Error(
        `"${entry}" is not a single IPv4 address; the edge allowlist compares exact viewer IPs.`,
      );
    }
    return address as string;
  });
  if (addresses.length === 0 && !openToEveryone) {
    throw new Error("The edge allowlist is empty; it would admit nobody.");
  }
  const ipCheck = openToEveryone
    ? []
    : [
        `  var allowed = ${JSON.stringify(addresses)};`,
        "  if (allowed.indexOf(event.viewer.ip) === -1) {",
        "    return {",
        "      statusCode: 403,",
        "      statusDescription: 'Forbidden',",
        "      headers: { 'content-type': { value: 'text/plain' } },",
        "      body: 'Forbidden'",
        "    };",
        "  }",
      ];
  return [
    "function handler(event) {",
    "  var request = event.request;",
    ...ipCheck,
    "  var host = request.headers.host;",
    "  delete request.headers['x-forwarded-host'];",
    "  if (host) {",
    "    request.headers['x-forwarded-host'] = { value: host.value };",
    "  }",
    "  return request;",
    "}",
  ].join("\n");
}

export function staticBucketPolicy(
  partition: string,
  bucket: string,
  distributionArn: string,
) {
  const tls = secureTransportOnlyPolicy(partition, bucket);
  return {
    ...tls,
    Statement: [
      ...tls.Statement,
      {
        Sid: "AllowCloudFrontRead",
        Effect: "Allow",
        Principal: { Service: "cloudfront.amazonaws.com" },
        Action: "s3:GetObject",
        Resource: `arn:${partition}:s3:::${bucket}/*`,
        Condition: { StringEquals: { "AWS:SourceArn": distributionArn } },
      },
    ],
  };
}

export function assetsDir(infraRoot: string): string {
  return path.resolve(infraRoot, "..", ASSETS_RELATIVE_DIR);
}

export function assertAssetsBuilt(
  infraRoot: string,
  exists: (file: string) => boolean = existsSync,
): string {
  const dir = assetsDir(infraRoot);
  if (!exists(path.join(dir, "_next", "static"))) {
    throw new Error(
      `The Next static assets are missing at ${dir}. Run "pnpm --filter @dilm/cms build:open-next" before sst diff or sst deploy.`,
    );
  }
  return dir;
}

export function cacheControlFor(key: string): string {
  return key.startsWith(IMMUTABLE_PREFIX)
    ? IMMUTABLE_CACHE_CONTROL
    : PUBLIC_FILE_CACHE_CONTROL;
}

export function contentTypeFor(key: string): string {
  return (
    CONTENT_TYPES[path.extname(key).toLowerCase()] ?? "application/octet-stream"
  );
}

export function listStaticAssets(dir: string): StaticAsset[] {
  const entries = readdirSync(dir, { recursive: true, withFileTypes: true });
  return entries
    .filter((e) => e.isFile())
    .map((e) => {
      const file = path.join(e.parentPath, e.name);
      const key = path.relative(dir, file).split(path.sep).join("/");
      return { key, file };
    })
    .filter(({ key }) => !EXCLUDED_ASSET_FILES.includes(key))
    .sort((a, b) => a.key.localeCompare(b.key))
    .map(({ key, file }) => ({
      key,
      file,
      contentType: contentTypeFor(key),
      cacheControl: cacheControlFor(key),
    }));
}

export function staticPathPatterns(keys: string[]): string[] {
  const patterns = new Set<string>();
  for (const key of keys) {
    if (key.startsWith(IMMUTABLE_PREFIX)) {
      patterns.add(`${IMMUTABLE_PREFIX}*`);
      continue;
    }
    const [first, ...rest] = key.split("/");
    patterns.add(rest.length === 0 ? key : `${first}/*`);
  }
  return [...patterns].sort();
}
