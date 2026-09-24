/// <reference path="./.sst/platform/config.d.ts" />

// SST v3 (the "ion" rewrite) ships on npm as the `sst` 4.x line — Backend Spec §3.7
// calls it "SST v3", the package version reads 4.x. Same thing.
const STAGES = ["dev", "staging", "production"] as const;
type Stage = (typeof STAGES)[number];

// Every AWS resource lives in Jakarta, no exceptions (Backend Spec §3.7).
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
      // One AWS account for all three stages, isolated by stage-prefixing:
      // resources come out as `dilm-<stage>-<name>`, e.g. dilm-production-public.
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
    // Empty on purpose. The VPC, Aurora cluster, S3 buckets, SQS queue and the
    // two Lambda apps are added by the later Track 1 / Track 2 tickets.
    return {
      region: REGION,
      stage: $app.stage,
    };
  },
});
