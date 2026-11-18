export const PUBLIC_BUCKET_PREFIXES = [
  "media/",
  "ir-documents/",
  "documents/",
] as const;

export const CV_RETENTION_MONTHS_DEFAULT = 12;

export function publicBucketName(stage: string): string {
  return `dilm-${stage}-public`;
}

export function privateBucketName(stage: string): string {
  return `dilm-${stage}-cv-private`;
}

export function cvRetentionMonths(
  value: string | undefined = process.env.CV_RETENTION_MONTHS,
): number {
  if (value === undefined || value === "") return CV_RETENTION_MONTHS_DEFAULT;
  const months = Number(value);
  if (!Number.isInteger(months) || months < 1) {
    throw new Error(
      `CV_RETENTION_MONTHS must be a positive whole number of months, got "${value}".`,
    );
  }
  return months;
}

export function cvRetentionDays(months: number): number {
  return Math.round((months * 365) / 12);
}

export function bucketObjectsArn(partition: string, bucket: string): string {
  return `arn:${partition}:s3:::${bucket}/*`;
}

export function secureTransportOnlyPolicy(partition: string, bucket: string) {
  return {
    Version: "2012-10-17",
    Statement: [
      {
        Sid: "DenyInsecureTransport",
        Effect: "Deny",
        Principal: "*",
        Action: "s3:*",
        Resource: [
          `arn:${partition}:s3:::${bucket}`,
          `arn:${partition}:s3:::${bucket}/*`,
        ],
        Condition: { Bool: { "aws:SecureTransport": "false" } },
      },
    ],
  };
}
