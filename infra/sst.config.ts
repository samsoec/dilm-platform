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
    const database = await import("./src/database");

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

    let databaseHost: $util.Output<string> | undefined;
    if (database.databaseMode($app.stage) === "express") {
      const cluster = aws.rds.getClusterOutput({
        clusterIdentifier: database.DEV_EXPRESS_CLUSTER_ID,
      });
      const scope = $resolve([
        partition.partition,
        caller.accountId,
        cluster.clusterResourceId,
      ]).apply(([partitionName, accountId, clusterResourceId]) => ({
        partition: partitionName,
        region: REGION,
        accountId,
        clusterResourceId,
      }));
      const payloadDbConnect = new aws.iam.Policy("PayloadDbConnect", {
        name: `dilm-${$app.stage}-payload-db-connect`,
        description: `IAM-token login as ${database.PAYLOAD_DATABASE_USER} on the Free-plan express cluster ${database.DEV_EXPRESS_CLUSTER_ID} (DILM-39), for Payload, the CV consumer and CI migrations.`,
        policy: scope.apply((s) =>
          JSON.stringify(database.rdsDbConnectPolicy(s)),
        ),
      });
      new aws.iam.RolePolicyAttachment("CiMigrationsDbConnect", {
        role: database.CI_DEPLOY_ROLE_NAME,
        policyArn: payloadDbConnect.arn,
      });
      new sst.Linkable("Database", {
        properties: {
          auth: "iam",
          host: cluster.endpoint,
          port: cluster.port,
          database: database.PAYLOAD_DATABASE_NAME,
          username: database.PAYLOAD_DATABASE_USER,
        },
        include: [
          sst.aws.permission({
            actions: ["rds-db:connect"],
            resources: [scope.apply(database.rdsDbUserArn)],
          }),
        ],
      });
      databaseHost = cluster.endpoint;
    } else {
      // TODO(DILM-5): provision the locked-architecture Aurora cluster (VPC,
      // public subnets, force_ssl parameter group) for staging/production.
      // TODO(DILM-12): grant secretsmanager:GetSecretValue on the payload_app
      // secret and expose its ARN as DATABASE_SECRET_ARN (auth "secret").
    }

    // TODO(DILM-38): give the Payload function
    // `concurrency: { reserved: database.payloadReservedConcurrency($app.stage) }`
    // and link it (and the CV consumer) to the Database linkable on dev.
    // TODO(DILM Track 1/2): define the S3 buckets, CV queue and the web/cms
    // Lambdas here; attach payloadSesSend to the cms and CV-consumer function
    // roles via `policies: [payloadSesSend.arn]`.
    // TODO(DILM-8): subscribe apps/cms/src/cv-intake/handler.handler to the
    // CV queue outside the VPC, using the CV_CONSUMER_* and CV_QUEUE_*
    // constants from @dilm/shared-types: batch.size, function timeout, and
    // transform.eventSourceMapping scalingConfig.maximumConcurrency.
    return {
      region: REGION,
      stage: $app.stage,
      payloadSesSendPolicy: payloadSesSend.arn,
      databaseHost,
    };
  },
});
