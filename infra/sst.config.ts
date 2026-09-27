/// <reference path="./.sst/platform/config.d.ts" />

const STAGES = ["dev", "staging", "production"] as const;
type Stage = (typeof STAGES)[number];

const REGION = "ap-southeast-3";

export default $config({
  app(input) {
    const stage = input.stage as Stage;
    if (!STAGES.includes(stage)) {
      throw new Error(
        `Unknown stage "${input.stage}". Use one of: ${STAGES.join(", ")}.`,
      );
    }

    return {
      name: "dilm",
      home: "aws",
      removal: stage === "production" ? "retain" : "remove",
      protect: stage === "production",
      providers: {
        aws: { region: REGION },
      },
    };
  },

  async run() {
    const { sesSendPolicy } = await import("./src/ses");

    const caller = aws.getCallerIdentityOutput({});
    const partition = aws.getPartitionOutput({});
    const payloadSesSend = new aws.iam.Policy("PayloadSesSend", {
      name: `dilm-${$app.stage}-payload-ses-send`,
      description:
        "Payload (admin/API function and CV consumer) may send only as noreply@ of the three tenant SES identities (FR-CMS-22).",
      policy: $resolve([partition.partition, caller.accountId]).apply(
        ([partitionName, accountId]) =>
          JSON.stringify(
            sesSendPolicy({
              partition: partitionName,
              region: REGION,
              accountId,
            }),
          ),
      ),
    });

    // TODO(DILM Track 1/2): define the VPC, Aurora cluster, S3 buckets, CV
    // queue and the web/cms Lambdas here; attach payloadSesSend to the cms
    // and CV-consumer function roles via `policies: [payloadSesSend.arn]`.
    return {
      region: REGION,
      stage: $app.stage,
      payloadSesSendPolicy: payloadSesSend.arn,
    };
  },
});
