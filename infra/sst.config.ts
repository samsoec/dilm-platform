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
    const storage = await import("./src/storage");
    const production = $app.stage === "production";

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
    let databaseMasterSecretArn: $util.Output<string> | undefined;
    let databaseNetwork:
      | {
          subnetGroupName: $util.Output<string>;
          securityGroupId: $util.Output<string>;
        }
      | undefined;
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
      const { DB_VPC_CIDR, DB_AZ_COUNT, dbSubnetCidrs, dbIngressRules } =
        await import("./src/network");
      const zones = aws.getAvailabilityZonesOutput({ state: "available" });
      const dbVpc = new aws.ec2.Vpc("DatabaseVpc", {
        cidrBlock: DB_VPC_CIDR,
        enableDnsSupport: true,
        enableDnsHostnames: true,
        tags: { Name: `dilm-${$app.stage}-db` },
      });
      const dbGateway = new aws.ec2.InternetGateway("DatabaseGateway", {
        vpcId: dbVpc.id,
        tags: { Name: `dilm-${$app.stage}-db` },
      });
      const dbRoutes = new aws.ec2.RouteTable("DatabaseRoutes", {
        vpcId: dbVpc.id,
        routes: [{ cidrBlock: "0.0.0.0/0", gatewayId: dbGateway.id }],
        tags: { Name: `dilm-${$app.stage}-db` },
      });
      const dbSubnets = dbSubnetCidrs().map((cidrBlock, i) => {
        const subnet = new aws.ec2.Subnet(`DatabaseSubnet${i}`, {
          vpcId: dbVpc.id,
          cidrBlock,
          availabilityZone: zones.names.apply((names) => names[i]),
          mapPublicIpOnLaunch: false,
          tags: { Name: `dilm-${$app.stage}-db-${i}` },
        });
        new aws.ec2.RouteTableAssociation(`DatabaseSubnetRoutes${i}`, {
          subnetId: subnet.id,
          routeTableId: dbRoutes.id,
        });
        return subnet;
      });
      const dbSubnetGroup = new aws.rds.SubnetGroup("DatabaseSubnetGroup", {
        name: `dilm-${$app.stage}-db`,
        description: `Public DB subnets in ${DB_AZ_COUNT} AZs for the Aurora cluster`,
        subnetIds: dbSubnets.map((s) => s.id),
      });
      const dbSecurityGroup = new aws.ec2.SecurityGroup(
        "DatabaseSecurityGroup",
        {
          name: `dilm-${$app.stage}-db`,
          description: "Aurora Postgres, reachable from Lambda without a VPC",
          vpcId: dbVpc.id,
          ingress: dbIngressRules(),
          tags: { Name: `dilm-${$app.stage}-db` },
        },
      );
      databaseNetwork = {
        subnetGroupName: dbSubnetGroup.name,
        securityGroupId: dbSecurityGroup.id,
      };
      const dbParameterGroup = new aws.rds.ClusterParameterGroup(
        "DatabaseParameterGroup",
        {
          name: `dilm-${$app.stage}-db`,
          family: database.AURORA_PARAMETER_FAMILY,
          description: "Force TLS and scram-sha-256 for the Aurora cluster",
          parameters: database.auroraParameters(),
        },
      );
      // TODO(DILM-172): pin the Aurora minor (e.g. 16.x) once it can be read
      // from describe-orderable-db-instance-options; major 16 until then.
      const dbCluster = new aws.rds.Cluster(
        "DatabaseCluster",
        {
          clusterIdentifier: `dilm-${$app.stage}-db`,
          engine: database.AURORA_ENGINE,
          engineMode: "provisioned",
          engineVersion: database.AURORA_MAJOR_VERSION,
          databaseName: database.PAYLOAD_DATABASE_NAME,
          masterUsername: database.AURORA_MASTER_USERNAME,
          manageMasterUserPassword: true,
          storageEncrypted: true,
          dbSubnetGroupName: dbSubnetGroup.name,
          vpcSecurityGroupIds: [dbSecurityGroup.id],
          dbClusterParameterGroupName: dbParameterGroup.name,
          serverlessv2ScalingConfiguration: database.auroraScaling(),
          backupRetentionPeriod: database.AURORA_BACKUP_RETENTION_DAYS,
          deletionProtection: production,
          skipFinalSnapshot: !production,
          finalSnapshotIdentifier: production
            ? `dilm-${$app.stage}-db-final`
            : undefined,
        },
        { ignoreChanges: ["engineVersion"] },
      );
      new aws.rds.ClusterInstance("DatabaseWriter", {
        identifier: `dilm-${$app.stage}-db-writer`,
        clusterIdentifier: dbCluster.id,
        instanceClass: "db.serverless",
        engine: database.AURORA_ENGINE,
        engineVersion: dbCluster.engineVersion,
        dbSubnetGroupName: dbSubnetGroup.name,
        publiclyAccessible: true,
      });
      new sst.Linkable("Database", {
        properties: {
          auth: "secret",
          host: dbCluster.endpoint,
          port: dbCluster.port,
          database: database.PAYLOAD_DATABASE_NAME,
          username: database.PAYLOAD_DATABASE_USER,
          secretArn: $interpolate`arn:${partition.partition}:secretsmanager:${REGION}:${caller.accountId}:secret:${database.auroraPayloadAppSecretName($app.stage)}`,
        },
        include: [
          sst.aws.permission({
            actions: ["secretsmanager:GetSecretValue"],
            resources: [
              $interpolate`arn:${partition.partition}:secretsmanager:${REGION}:${caller.accountId}:secret:${database.auroraPayloadAppSecretName($app.stage)}-*`,
            ],
          }),
        ],
      });
      databaseHost = dbCluster.endpoint;
      databaseMasterSecretArn = dbCluster.masterUserSecrets.apply(
        (secrets) => secrets[0].secretArn,
      );
      // TODO(DILM-12): set DATABASE_SECRET_ARN on the Payload function from
      // the Database linkable's secretArn (a partial ARN, valid as SecretId).
    }

    const bucketSecurity = (
      logicalName: string,
      bucket: aws.s3.Bucket,
      name: string,
    ) => {
      new aws.s3.BucketPublicAccessBlock(`${logicalName}PublicAccess`, {
        bucket: bucket.id,
        blockPublicAcls: true,
        blockPublicPolicy: true,
        ignorePublicAcls: true,
        restrictPublicBuckets: true,
      });
      new aws.s3.BucketServerSideEncryptionConfiguration(
        `${logicalName}Encryption`,
        {
          bucket: bucket.id,
          rules: [
            { applyServerSideEncryptionByDefault: { sseAlgorithm: "AES256" } },
          ],
        },
      );
      new aws.s3.BucketPolicy(`${logicalName}TlsOnly`, {
        bucket: bucket.id,
        policy: partition.partition.apply((partitionName) =>
          JSON.stringify(
            storage.secureTransportOnlyPolicy(partitionName, name),
          ),
        ),
      });
    };
    const bucketAccess = (bucket: aws.s3.Bucket, actions: string[]) => [
      sst.aws.permission({
        actions,
        resources: [bucket.arn, $interpolate`${bucket.arn}/*`],
      }),
    ];

    const publicBucketName = storage.publicBucketName($app.stage);
    const publicBucket = new aws.s3.Bucket("PublicBucket", {
      bucket: publicBucketName,
      forceDestroy: !production,
    });
    bucketSecurity("PublicBucket", publicBucket, publicBucketName);
    new sst.Linkable("PublicBucket", {
      properties: {
        name: publicBucket.bucket,
        prefixes: [...storage.PUBLIC_BUCKET_PREFIXES],
      },
      include: bucketAccess(publicBucket, [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject",
        "s3:ListBucket",
        "s3:AbortMultipartUpload",
      ]),
    });

    const cvRetentionMonths = storage.cvRetentionMonths();
    const cvBucketName = storage.privateBucketName($app.stage);
    const cvBucket = new aws.s3.Bucket("CvPrivateBucket", {
      bucket: cvBucketName,
      forceDestroy: !production,
    });
    bucketSecurity("CvPrivateBucket", cvBucket, cvBucketName);
    new aws.s3.BucketLifecycleConfiguration("CvPrivateLifecycle", {
      bucket: cvBucket.id,
      rules: [
        {
          id: `expire-cv-after-${cvRetentionMonths}-months`,
          status: "Enabled",
          filter: {},
          expiration: { days: storage.cvRetentionDays(cvRetentionMonths) },
          abortIncompleteMultipartUpload: { daysAfterInitiation: 7 },
        },
      ],
    });
    new sst.Linkable("CvPrivateBucket", {
      properties: { name: cvBucket.bucket },
      include: bucketAccess(cvBucket, [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject",
        "s3:ListBucket",
      ]),
    });

    // TODO(DILM-38): give the Payload function
    // `concurrency: { reserved: database.payloadReservedConcurrency($app.stage) }`
    // and link it (and the CV consumer) to the Database linkable on dev.
    // TODO(DILM-12): set S3_PUBLIC_BUCKET and S3_PRIVATE_BUCKET on the Payload
    // function and the CV consumer from the PublicBucket and CvPrivateBucket
    // linkables, and link both to them; no S3 keys, the function role signs.
    // TODO(DILM Track 1/2): define the CV queue and the web/cms
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
      publicBucket: publicBucket.bucket,
      cvPrivateBucket: cvBucket.bucket,
      cvRetentionMonths,
      databaseHost,
      databaseMasterSecretArn,
      databaseSecurityGroupId: databaseNetwork?.securityGroupId,
    };
  },
});
