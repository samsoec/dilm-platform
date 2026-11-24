import { existsSync } from "node:fs";
import path from "node:path";

import { TENANT_SLUGS } from "@dilm/shared-types";

export const WEB_BUNDLE_RELATIVE_DIR =
  "apps/web/.open-next/server-functions/default";
export const WEB_ASSETS_RELATIVE_DIR = "apps/web/.open-next/assets";
export const WEB_HANDLER = "index.handler";
export const WEB_MEMORY = "1024 MB" as const;
export const WEB_TIMEOUT = "30 seconds" as const;
export const WEB_WARM_RATE = "rate(5 minutes)";
export const WEB_WARM_EVENT = { type: "warmer", delay: 0 } as const;

export const WEB_CACHE_PREFIX = "web-cache/";
export const WEB_STATIC_PREFIX = "web-static/";
export const WEB_CACHE_RETENTION_DAYS = 30;
export const WEB_TAG_CACHE_GSI = "revalidate";
export const WEB_RUNTIME_PARAMETERS = ["PREVIEW_SECRET"] as const;

export function webTagCacheTableName(stage: string): string {
  return `dilm-${stage}-web-tag-cache`;
}

export function webBundleDir(infraRoot: string): string {
  return path.resolve(infraRoot, "..", WEB_BUNDLE_RELATIVE_DIR);
}

export function webAssetsDir(infraRoot: string): string {
  return path.resolve(infraRoot, "..", WEB_ASSETS_RELATIVE_DIR);
}

export function assertWebBundleBuilt(
  infraRoot: string,
  exists: (file: string) => boolean = existsSync,
): string {
  const dir = webBundleDir(infraRoot);
  if (!exists(path.join(dir, "index.mjs"))) {
    throw new Error(
      `The web bundle is missing at ${dir}. Run "pnpm --filter @dilm/web build:open-next" before sst diff or sst deploy.`,
    );
  }
  return dir;
}

export function assertWebAssetsBuilt(
  infraRoot: string,
  exists: (file: string) => boolean = existsSync,
): string {
  const dir = webAssetsDir(infraRoot);
  if (!exists(path.join(dir, "_next", "static"))) {
    throw new Error(
      `The web static assets are missing at ${dir}. Run "pnpm --filter @dilm/web build:open-next" before sst diff or sst deploy.`,
    );
  }
  return dir;
}

export function webHostAliases(
  value: string | undefined = process.env.TENANT_HOST_ALIASES,
): string {
  const entries = (value ?? "")
    .split(",")
    .map((entry) => entry.trim())
    .filter((entry) => entry !== "");
  for (const entry of entries) {
    const [host, slug, ...rest] = entry.split("=").map((part) => part.trim());
    const known = TENANT_SLUGS.some((candidate) => candidate === slug);
    if (!host || rest.length > 0 || !known) {
      throw new Error(
        `TENANT_HOST_ALIASES entries must look like host=<${TENANT_SLUGS.join("|")}>, got "${entry}".`,
      );
    }
  }
  return entries.join(",");
}

export function webCacheLifecycleRule() {
  return {
    id: "expire-web-cache-of-old-builds",
    status: "Enabled" as const,
    filter: { prefix: WEB_CACHE_PREFIX },
    expiration: { days: WEB_CACHE_RETENTION_DAYS },
    abortIncompleteMultipartUpload: { daysAfterInitiation: 1 },
  };
}

export function webTagCacheTable(stage: string) {
  return {
    name: webTagCacheTableName(stage),
    billingMode: "PAY_PER_REQUEST" as const,
    hashKey: "tag",
    rangeKey: "path",
    attributes: [
      { name: "tag", type: "S" },
      { name: "path", type: "S" },
      { name: "revalidatedAt", type: "N" },
    ],
    globalSecondaryIndexes: [
      {
        name: WEB_TAG_CACHE_GSI,
        hashKey: "path",
        rangeKey: "revalidatedAt",
        projectionType: "ALL" as const,
      },
    ],
  };
}

export function webStaticKey(assetKey: string): string {
  return `${WEB_STATIC_PREFIX}${assetKey}`;
}

export interface WebCondition {
  test: string;
  variable: string;
  values: string[];
}

export interface WebPermission<T> {
  actions: string[];
  resources: T[];
  conditions?: WebCondition[];
}

export const WEB_PAYLOAD_INVOKE_ACTIONS = [
  "lambda:InvokeFunctionUrl",
  "lambda:InvokeFunction",
];

export function webCachePermissions<T>(args: {
  bucketArn: T;
  tableArn: T;
  join: (arn: T, suffix: string) => T;
}): WebPermission<T>[] {
  const { bucketArn, tableArn, join } = args;
  return [
    {
      actions: ["s3:GetObject", "s3:PutObject", "s3:DeleteObject"],
      resources: [join(bucketArn, `/${WEB_CACHE_PREFIX}*`)],
    },
    {
      actions: ["s3:ListBucket"],
      resources: [bucketArn],
      conditions: [
        {
          test: "StringLike",
          variable: "s3:prefix",
          values: [`${WEB_CACHE_PREFIX}*`],
        },
      ],
    },
    {
      actions: [
        "dynamodb:GetItem",
        "dynamodb:BatchGetItem",
        "dynamodb:Query",
        "dynamodb:PutItem",
        "dynamodb:BatchWriteItem",
        "dynamodb:DeleteItem",
      ],
      resources: [tableArn, join(tableArn, "/index/*")],
    },
  ];
}

export function webParameterArns(
  parameterArns: string[],
  names: readonly string[] = WEB_RUNTIME_PARAMETERS,
): string[] {
  return parameterArns.filter((arn) =>
    names.some((name) => arn.endsWith(`/${name}`)),
  );
}
