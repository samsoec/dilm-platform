import {
  TENANT_DOMAINS,
  TENANT_SLUGS,
  tenantSenderAddress,
} from "@dilm/shared-types";

export const SES_CONFIGURATION_SET = "dilm-transactional";

export type AwsScope = { partition: string; region: string; accountId: string };

export function sesSendPolicy({ partition, region, accountId }: AwsScope) {
  const arn = (resource: string) =>
    `arn:${partition}:ses:${region}:${accountId}:${resource}`;
  return {
    Version: "2012-10-17",
    Statement: [
      {
        Sid: "SendAsTenantNoreplyOnly",
        Effect: "Allow",
        Action: ["ses:SendEmail", "ses:SendRawEmail"],
        Resource: [
          ...TENANT_SLUGS.map((slug) =>
            arn(`identity/${TENANT_DOMAINS[slug]}`),
          ),
          arn(`configuration-set/${SES_CONFIGURATION_SET}`),
        ],
        Condition: {
          StringEquals: {
            "ses:FromAddress": TENANT_SLUGS.map(tenantSenderAddress),
          },
        },
      },
    ],
  };
}
