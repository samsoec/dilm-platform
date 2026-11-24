import type { AwsScope } from "./ses";

export const RUNTIME_PARAMETER_NAMES = [
  "PAYLOAD_SECRET",
  "PREVIEW_SECRET",
  "JOB_PLATFORM_WEBHOOK_URL",
  "JOB_PLATFORM_WEBHOOK_SECRET",
  "REVALIDATE_SECRET",
] as const;

export const EDGE_PARAMETER_NAMES = [
  "CLOUDFLARE_API_TOKEN",
  "CLOUDFLARE_ZONE_IDS",
] as const;

export const EDGE_PARAMETER_PLACEHOLDER = "unset";

export const JOB_PLATFORM_WEBHOOK_PLACEHOLDER_URL =
  "https://example.invalid/job-platform-webhook-placeholder";

export function parameterPrefix(stage: string): string {
  return `/dilm/${stage}`;
}

export function parameterArns({
  partition,
  region,
  accountId,
  stage,
}: AwsScope & { stage: string }): string[] {
  return RUNTIME_PARAMETER_NAMES.map(
    (name) =>
      `arn:${partition}:ssm:${region}:${accountId}:parameter${parameterPrefix(stage)}/${name}`,
  );
}

export function edgeParameterArns({
  partition,
  region,
  accountId,
  stage,
}: AwsScope & { stage: string }): string[] {
  return EDGE_PARAMETER_NAMES.map(
    (name) =>
      `arn:${partition}:ssm:${region}:${accountId}:parameter${parameterPrefix(stage)}/${name}`,
  );
}
