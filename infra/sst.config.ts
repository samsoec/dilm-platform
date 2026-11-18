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
    const {
      SES_CONFIGURATION_SET: sesConfigurationSet,
      sesSendPolicy,
      sesSenderSetting,
    } = await import("./src/ses");
    const database = await import("./src/database");
    const storage = await import("./src/storage");
    const gateway = await import("./src/gateway");
    const parameters = await import("./src/parameters");
    const rotation = await import("./src/rotation");
    const { randomBytes } = await import("node:crypto");
    const production = $app.stage === "production";
    const senderSetting = sesSenderSetting($app.stage);

    const caller = aws.getCallerIdentityOutput({});
    const partition = aws.getPartitionOutput({});
    const payloadSesSend = new aws.iam.Policy("PayloadSesSend", {
      name: `dilm-${$app.stage}-payload-ses-send`,
      description:
        "Payload (admin/API function and CV consumer) may send only as the stage's sender identities: noreply@ of the three tenant domains, or the one shared sender when SES_SHARED_SENDER is set (FR-CMS-22).",
      policy: $resolve([partition.partition, caller.accountId]).apply(
        ([partitionName, accountId]) =>
          JSON.stringify(
            sesSendPolicy(
              {
                partition: partitionName,
                region: REGION,
                accountId,
              },
              senderSetting,
            ),
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
      const masterSecretArn = dbCluster.masterUserSecrets.apply(
        (secrets) => secrets[0].secretArn,
      );
      const payloadAppSecretName = database.auroraPayloadAppSecretName(
        $app.stage,
      );
      const payloadAppSecret = new aws.secretsmanager.Secret(
        "PayloadAppSecret",
        {
          name: payloadAppSecretName,
          description: `payload_app login for ${$app.stage}: username, password, host, port, dbname and masterarn. The first value is written by scripts/db/create-payload-app-role.sh; alternating-users rotation every ${rotation.PAYLOAD_APP_ROTATION_DAYS} days after that (DILM-12).`,
          recoveryWindowInDays: production ? 30 : 0,
        },
      );
      const rotationFunction = new sst.aws.Function("PayloadAppRotation", {
        handler: "src/rotation/handler.handler",
        runtime: "nodejs22.x",
        architecture: "arm64",
        timeout: "2 minutes",
        copyFiles: [
          {
            from: "src/rotation/ap-southeast-3-bundle.pem",
            to: "ca-bundle.pem",
          },
        ],
        permissions: $resolve([
          partition.partition,
          caller.accountId,
          masterSecretArn,
        ]).apply(([partitionName, accountId, masterArn]) =>
          rotation
            .rotationLambdaPolicy(
              { partition: partitionName, region: REGION, accountId },
              payloadAppSecretName,
              masterArn,
            )
            .Statement.map((statement) => ({
              actions: statement.Action,
              resources: statement.Resource,
            })),
        ),
      });
      const rotationInvoke = new aws.lambda.Permission(
        "PayloadAppRotationInvoke",
        {
          action: "lambda:InvokeFunction",
          function: rotationFunction.name,
          principal: "secretsmanager.amazonaws.com",
          sourceArn: payloadAppSecret.arn,
        },
      );
      new aws.secretsmanager.SecretRotation(
        "PayloadAppRotationSchedule",
        {
          secretId: payloadAppSecret.id,
          rotationLambdaArn: rotationFunction.arn,
          rotateImmediately: false,
          rotationRules: {
            automaticallyAfterDays: rotation.PAYLOAD_APP_ROTATION_DAYS,
          },
        },
        { dependsOn: [rotationInvoke] },
      );
      new sst.Linkable("Database", {
        properties: {
          auth: "secret",
          host: dbCluster.endpoint,
          port: dbCluster.port,
          database: database.PAYLOAD_DATABASE_NAME,
          username: database.PAYLOAD_DATABASE_USER,
          secretArn: payloadAppSecret.arn,
        },
        include: [
          sst.aws.permission({
            actions: ["secretsmanager:GetSecretValue"],
            resources: [payloadAppSecret.arn],
          }),
        ],
      });
      databaseHost = dbCluster.endpoint;
      databaseMasterSecretArn = masterSecretArn;
      // TODO(DILM-38): link the Payload function and the CV consumer to the
      // Database linkable; the runtime-config loader reads secretArn (a
      // partial ARN, valid as SecretId) from SST_RESOURCE_Database.
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

    new sst.Linkable("EmailSender", {
      properties: {
        mode: senderSetting.mode,
        address: senderSetting.mode === "shared" ? senderSetting.address : "",
        identity: senderSetting.mode === "shared" ? senderSetting.identity : "",
        configurationSet: sesConfigurationSet,
      },
    });
    parameters.RUNTIME_PARAMETER_NAMES.map((name) => {
      const placeholder = name === "JOB_PLATFORM_WEBHOOK_URL";
      return new aws.ssm.Parameter(
        `RuntimeParameter${name}`,
        {
          name: `${parameters.parameterPrefix($app.stage)}/${name}`,
          type: "SecureString",
          tier: "Standard",
          description: `Runtime config ${name} for the ${$app.stage} stage. Created with a generated value (a placeholder for the job-platform webhook until its contract is confirmed); replace it with aws ssm put-parameter --overwrite, Pulumi never reverts it.`,
          value: placeholder
            ? parameters.JOB_PLATFORM_WEBHOOK_PLACEHOLDER_URL
            : randomBytes(32).toString("hex"),
        },
        { ignoreChanges: ["value"] },
      );
    });
    new sst.Linkable("RuntimeConfigParameters", {
      properties: { prefix: parameters.parameterPrefix($app.stage) },
      include: [
        sst.aws.permission({
          actions: ["ssm:GetParameter", "ssm:GetParameters"],
          resources: $resolve([partition.partition, caller.accountId]).apply(
            ([partitionName, accountId]) =>
              parameters.parameterArns({
                partition: partitionName,
                region: REGION,
                accountId,
                stage: $app.stage,
              }),
          ),
        }),
      ],
    });
    const adminIps = gateway.adminAllowedIps($app.stage);
    const adminPolicy = JSON.stringify(gateway.adminResourcePolicy(adminIps));
    const adminApi = new aws.apigateway.RestApi("AdminApi", {
      name: `dilm-${$app.stage}-admin`,
      description:
        "CMS admin entry on the default execute-api URL; the resource policy admits only the allowlisted IPs before any integration runs (DILM-10).",
      endpointConfiguration: { types: "REGIONAL" },
      policy: adminPolicy,
    });
    const adminProxy = new aws.apigateway.Resource("AdminApiProxy", {
      restApi: adminApi.id,
      parentId: adminApi.rootResourceId,
      pathPart: "{proxy+}",
    });
    const adminMockConfig = {
      httpMethod: "ANY",
      authorization: "NONE",
      type: "MOCK",
      statusCode: "503",
      requestTemplates: { "application/json": '{"statusCode": 503}' },
      responseTemplates: {
        "application/json": '{"message": "CMS not deployed yet"}',
      },
    };
    const adminMethods = [
      { name: "Root", resourceId: adminApi.rootResourceId },
      { name: "Proxy", resourceId: adminProxy.id },
    ].map(({ name, resourceId }) => {
      const method = new aws.apigateway.Method(`AdminApi${name}Any`, {
        restApi: adminApi.id,
        resourceId,
        httpMethod: adminMockConfig.httpMethod,
        authorization: adminMockConfig.authorization,
      });
      const integration = new aws.apigateway.Integration(
        `AdminApi${name}Placeholder`,
        {
          restApi: adminApi.id,
          resourceId,
          httpMethod: method.httpMethod,
          type: adminMockConfig.type,
          requestTemplates: adminMockConfig.requestTemplates,
        },
      );
      const methodResponse = new aws.apigateway.MethodResponse(
        `AdminApi${name}PlaceholderStatus`,
        {
          restApi: adminApi.id,
          resourceId,
          httpMethod: method.httpMethod,
          statusCode: "503",
        },
      );
      const integrationResponse = new aws.apigateway.IntegrationResponse(
        `AdminApi${name}PlaceholderResponse`,
        {
          restApi: adminApi.id,
          resourceId,
          httpMethod: method.httpMethod,
          statusCode: methodResponse.statusCode,
          responseTemplates: adminMockConfig.responseTemplates,
        },
        { dependsOn: [integration] },
      );
      return [method, integration, methodResponse, integrationResponse];
    });
    const adminDeployment = new aws.apigateway.Deployment(
      "AdminApiDeployment",
      {
        restApi: adminApi.id,
        triggers: {
          redeployment: $resolve(adminMethods.flat().map((r) => r.id)).apply(
            (ids) => JSON.stringify([...ids, adminPolicy, adminMockConfig]),
          ),
        },
      },
      { dependsOn: adminMethods.flat() },
    );
    const adminStage = new aws.apigateway.Stage("AdminApiStage", {
      restApi: adminApi.id,
      deployment: adminDeployment.id,
      stageName: $app.stage,
    });
    const adminUrl = $interpolate`https://${adminApi.id}.execute-api.${REGION}.amazonaws.com/${adminStage.stageName}`;
    // TODO(DILM-38): replace the MOCK integrations above with a
    // Lambda proxy integration to the Payload function (AWS_PROXY, ANY on the
    // root and on {proxy+}), add the lambda:InvokeFunction permission for
    // this API, and set Payload's serverURL/NEXT_PUBLIC_SERVER_URL to
    // adminUrl: the stage path prefix /<stage> must be honoured by cookies
    // and admin routes (or add a base-path mapping). Verify login, logout,
    // file downloads and the first request after an Aurora pause (29s).
    // TODO(DILM-38): link EmailSender, RuntimeConfigParameters and both
    // bucket linkables to the Payload function and the CV consumer; the
    // runtime-config loader reads them from SST_RESOURCE_*.
    // TODO(DILM-38): give the Payload function
    // `concurrency: { reserved: database.payloadReservedConcurrency($app.stage) }`
    // and link it (and the CV consumer) to the Database linkable on dev.
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
      adminUrl,
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
