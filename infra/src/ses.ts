import {
  senderAddresses,
  senderIdentities,
  senderSetting,
  type SenderSetting,
} from "@dilm/shared-types";

export const SES_CONFIGURATION_SET = "dilm-transactional";

export type AwsScope = { partition: string; region: string; accountId: string };

type Env = Record<string, string | undefined>;

export function sesSenderSetting(
  stage: string,
  env: Env = process.env,
): SenderSetting {
  const setting = senderSetting(
    env.SES_SHARED_SENDER,
    env.SES_SHARED_SENDER_IDENTITY,
  );
  if (stage === "production" && setting.mode === "shared") {
    throw new Error(
      "SES_SHARED_SENDER is for staging on an account that cannot verify the tenant domains. Production sends as the three tenant noreply@ addresses.",
    );
  }
  return setting;
}

export function sesSendPolicy(
  { partition, region, accountId }: AwsScope,
  setting: SenderSetting = { mode: "tenant" },
) {
  const arn = (resource: string) =>
    `arn:${partition}:ses:${region}:${accountId}:${resource}`;
  return {
    Version: "2012-10-17",
    Statement: [
      {
        Sid:
          setting.mode === "shared"
            ? "SendAsSharedSenderOnly"
            : "SendAsTenantNoreplyOnly",
        Effect: "Allow",
        Action: ["ses:SendEmail", "ses:SendRawEmail"],
        Resource: [
          ...senderIdentities(setting).map((identity) =>
            arn(`identity/${identity}`),
          ),
          arn(`configuration-set/${SES_CONFIGURATION_SET}`),
        ],
        Condition: {
          StringEquals: {
            "ses:FromAddress": senderAddresses(setting),
          },
        },
      },
    ],
  };
}
