import { describe, expect, it } from "vitest";

import { parameterArns } from "./parameters";
import {
  WEB_PAYLOAD_INVOKE_ACTIONS,
  assertWebAssetsBuilt,
  assertWebBundleBuilt,
  webCacheLifecycleRule,
  webCachePermissions,
  webHostAliases,
  webParameterArns,
  webStaticKey,
  webTagCacheTable,
} from "./web";

describe("webHostAliases", () => {
  it("passes valid entries through and tolerates empty input", () => {
    expect(webHostAliases(undefined)).toBe("");
    expect(webHostAliases(" a.test=indoacid , b.test=likutelaga ,")).toBe(
      "a.test=indoacid,b.test=likutelaga",
    );
  });

  it("fails the deploy on an unknown tenant or a malformed entry", () => {
    expect(() => webHostAliases("a.test=nobody")).toThrow(/host=/);
    expect(() => webHostAliases("a.test")).toThrow(/host=/);
    expect(() => webHostAliases("a.test=indoacid=x")).toThrow(/host=/);
  });
});

describe("web cache", () => {
  it("expires only the web-cache/ prefix", () => {
    const rule = webCacheLifecycleRule();
    expect(rule.filter.prefix).toBe("web-cache/");
    expect(rule.expiration.days).toBeGreaterThan(0);
  });

  it("uses an on-demand tag table with the OpenNext keys and index", () => {
    const table = webTagCacheTable("staging");
    expect(table.name).toBe("dilm-staging-web-tag-cache");
    expect(table.billingMode).toBe("PAY_PER_REQUEST");
    expect([table.hashKey, table.rangeKey]).toEqual(["tag", "path"]);
    expect(table.globalSecondaryIndexes[0]).toMatchObject({
      name: "revalidate",
      hashKey: "path",
      rangeKey: "revalidatedAt",
    });
  });

  it("keys build assets under web-static/", () => {
    expect(webStaticKey("_next/static/a.js")).toBe(
      "web-static/_next/static/a.js",
    );
  });
});

describe("web role grants", () => {
  const permissions = webCachePermissions({
    bucketArn: "arn:aws:s3:::dilm-staging-public",
    tableArn: "arn:aws:dynamodb:ap-southeast-3:1:table/t",
    join: (arn, suffix) => `${arn}${suffix}`,
  });
  const actions = permissions.flatMap((p) => p.actions);

  it("limits object access to web-cache/ and grants no database action", () => {
    expect(permissions[0]?.resources).toEqual([
      "arn:aws:s3:::dilm-staging-public/web-cache/*",
    ]);
    expect(actions.some((a) => /^(rds|rds-db|secretsmanager):/.test(a))).toBe(
      false,
    );
    expect(actions).not.toContain("s3:*");
  });

  it("scopes ListBucket to the web-cache/ prefix", () => {
    const list = permissions.find((p) => p.actions.includes("s3:ListBucket"));
    expect(list?.conditions).toEqual([
      { test: "StringLike", variable: "s3:prefix", values: ["web-cache/*"] },
    ]);
  });

  it("invokes the Payload function URL with both required actions", () => {
    expect(WEB_PAYLOAD_INVOKE_ACTIONS).toEqual([
      "lambda:InvokeFunctionUrl",
      "lambda:InvokeFunction",
    ]);
  });

  it("reads only the web's SSM parameters", () => {
    const all = parameterArns({
      partition: "aws",
      region: "ap-southeast-3",
      accountId: "1",
      stage: "staging",
    });
    expect(webParameterArns(all)).toEqual([
      "arn:aws:ssm:ap-southeast-3:1:parameter/dilm/staging/PREVIEW_SECRET",
    ]);
  });
});

describe("bundle checks", () => {
  it("names the build command when the bundle or assets are missing", () => {
    expect(() => assertWebBundleBuilt("/r/infra", () => false)).toThrow(
      /@dilm\/web build:open-next/,
    );
    expect(() => assertWebAssetsBuilt("/r/infra", () => false)).toThrow(
      /@dilm\/web build:open-next/,
    );
    expect(assertWebBundleBuilt("/r/infra", () => true)).toBe(
      "/r/apps/web/.open-next/server-functions/default",
    );
  });
});
