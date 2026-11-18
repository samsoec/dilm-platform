import { describe, expect, it } from "vitest";

import {
  CV_RETENTION_MONTHS_DEFAULT,
  cvRetentionDays,
  cvRetentionMonths,
  privateBucketName,
  PUBLIC_BUCKET_PREFIXES,
  publicBucketName,
  secureTransportOnlyPolicy,
} from "./storage";

describe("bucket names", () => {
  it("follow dilm-<stage>-<purpose>", () => {
    expect(publicBucketName("staging")).toBe("dilm-staging-public");
    expect(privateBucketName("staging")).toBe("dilm-staging-cv-private");
  });
});

describe("PUBLIC_BUCKET_PREFIXES", () => {
  it("lists the prefixes apps/cms/src/storage.ts writes to", () => {
    expect([...PUBLIC_BUCKET_PREFIXES]).toEqual([
      "media/",
      "ir-documents/",
      "documents/",
    ]);
  });
});

describe("cvRetentionMonths", () => {
  it("defaults to 12 months", () => {
    expect(cvRetentionMonths(undefined)).toBe(CV_RETENTION_MONTHS_DEFAULT);
    expect(cvRetentionMonths("")).toBe(12);
  });

  it("takes an override", () => {
    expect(cvRetentionMonths("6")).toBe(6);
  });

  it.each(["0", "-1", "1.5", "abc"])("rejects %s", (value) => {
    expect(() => cvRetentionMonths(value)).toThrow(/CV_RETENTION_MONTHS/);
  });

  it("converts to days", () => {
    expect(cvRetentionDays(12)).toBe(365);
  });
});

describe("secureTransportOnlyPolicy", () => {
  it("denies every non-TLS request on the bucket and its objects", () => {
    const [statement] = secureTransportOnlyPolicy("aws", "b").Statement;
    expect(statement.Effect).toBe("Deny");
    expect(statement.Resource).toEqual(["arn:aws:s3:::b", "arn:aws:s3:::b/*"]);
  });
});
