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
    const edge = await import("./src/edge");
    const parameters = await import("./src/parameters");
    const payload = await import("./src/payload");
    const web = await import("./src/web");
    const rotation = await import("./src/rotation");
    const queue = await import("./src/queue");
    const observability = await import("./src/observability");
    const { WEBHOOK_FAILURE_STAGE_ENV } = await import("@dilm/shared-types");
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

    let databaseLinkable: sst.Linkable<Record<string, unknown>>;
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
      databaseLinkable = new sst.Linkable("Database", {
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
      const dbCluster = new aws.rds.Cluster(
        "DatabaseCluster",
        {
          clusterIdentifier: `dilm-${$app.stage}-db`,
          engine: database.AURORA_ENGINE,
          engineMode: "provisioned",
          engineVersion: database.AURORA_ENGINE_VERSION,
          databaseName: database.PAYLOAD_DATABASE_NAME,
          masterUsername: database.AURORA_MASTER_USERNAME,
          manageMasterUserPassword: true,
          storageEncrypted: true,
          dbSubnetGroupName: dbSubnetGroup.name,
          vpcSecurityGroupIds: [dbSecurityGroup.id],
          dbClusterParameterGroupName: dbParameterGroup.name,
          serverlessv2ScalingConfiguration: database.auroraScaling(),
          backupRetentionPeriod: database.auroraBackupRetentionDays($app.stage),
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
        logging: { retention: observability.LOG_RETENTION },
        copyFiles: [
          {
            from: "src/rotation/ap-southeast-3-bundle.pem",
            to: "ca-bundle.pem",
          },
        ],
        permissions: $resolve([payloadAppSecret.arn, masterSecretArn]).apply(
          ([payloadArn, masterArn]) =>
            rotation
              .rotationLambdaPolicy(payloadArn, masterArn)
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
      databaseLinkable = new sst.Linkable("Database", {
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
    const publicBucketLinkable = new sst.Linkable("PublicBucket", {
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
    const cvPrivateBucketLinkable = new sst.Linkable("CvPrivateBucket", {
      properties: { name: cvBucket.bucket },
      include: bucketAccess(cvBucket, [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject",
        "s3:ListBucket",
      ]),
    });

    const emailSenderLinkable = new sst.Linkable("EmailSender", {
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
    parameters.EDGE_PARAMETER_NAMES.map(
      (name) =>
        new aws.ssm.Parameter(
          `RuntimeParameter${name}`,
          {
            name: `${parameters.parameterPrefix($app.stage)}/${name}`,
            type: "SecureString",
            tier: "Standard",
            description: `Edge config ${name} for the ${$app.stage} stage. Created as the placeholder "${parameters.EDGE_PARAMETER_PLACEHOLDER}", which keeps the Cloudflare purge off; replace it with aws ssm put-parameter --overwrite once the zone exists (DILM-210), Pulumi never reverts it.`,
            value: parameters.EDGE_PARAMETER_PLACEHOLDER,
          },
          { ignoreChanges: ["value"] },
        ),
    );
    const runtimeConfigParametersLinkable = new sst.Linkable(
      "RuntimeConfigParameters",
      {
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
      },
    );
    const adminIps = gateway.adminAllowedIps($app.stage);
    if (adminIps[0] === gateway.ADMIN_OPEN_TO_EVERYONE) {
      console.warn(
        `${gateway.ADMIN_ALLOWED_IPS_ENV}="*": the ${$app.stage} CMS admin is open to every IP; only the login protects it.`,
      );
    }
    const viewerRequestCode = edge.adminViewerRequestCode(adminIps);
    const adminBinaryMediaTypes = ["*/*"];
    const adminApi = new aws.apigateway.RestApi("AdminApi", {
      name: `dilm-${$app.stage}-admin`,
      description:
        "CMS admin origin behind CloudFront; every method requires the API key that only the CloudFront origin sends, and the IP allowlist is enforced at the CloudFront edge (DILM-10, DILM-38).",
      endpointConfiguration: { types: "REGIONAL" },
      binaryMediaTypes: adminBinaryMediaTypes,
    });
    const adminProxy = new aws.apigateway.Resource("AdminApiProxy", {
      restApi: adminApi.id,
      parentId: adminApi.rootResourceId,
      pathPart: "{proxy+}",
    });
    const concurrencyPlan = payload.payloadConcurrencyPlan(
      $app.stage,
      await payload.accountConcurrencyLimit($app.stage, REGION),
    );
    if (concurrencyPlan.warning) console.warn(concurrencyPlan.warning);
    const payloadFunction = new sst.aws.Function("PayloadCms", {
      bundle: $dev
        ? payload.payloadBundleDir($cli.paths.root)
        : payload.assertPayloadBundleBuilt($cli.paths.root),
      handler: payload.PAYLOAD_HANDLER,
      runtime: "nodejs22.x",
      architecture: "arm64",
      memory: payload.PAYLOAD_MEMORY,
      timeout: payload.PAYLOAD_TIMEOUT,
      logging: { retention: observability.LOG_RETENTION },
      link: [
        databaseLinkable,
        publicBucketLinkable,
        cvPrivateBucketLinkable,
        emailSenderLinkable,
        runtimeConfigParametersLinkable,
      ],
      policies: payloadSesSend.arn.apply((arn) => [arn]),
      url: { authorization: "iam" },
      concurrency: concurrencyPlan.reserved
        ? { reserved: concurrencyPlan.reserved }
        : undefined,
      ...payload.payloadFunctionTls($app.stage),
    });
    const adminInvoke = new aws.lambda.Permission("AdminApiInvokePayload", {
      action: "lambda:InvokeFunction",
      function: payloadFunction.name,
      principal: "apigateway.amazonaws.com",
      sourceArn: $interpolate`${adminApi.executionArn}/*/*`,
    });
    const adminIntegrationConfig = {
      httpMethod: "ANY",
      authorization: "NONE",
      apiKeyRequired: true,
      type: "AWS_PROXY",
      integrationHttpMethod: "POST",
    };
    const adminMethods = [
      { name: "Root", resourceId: adminApi.rootResourceId },
      { name: "Proxy", resourceId: adminProxy.id },
    ].map(({ name, resourceId }) => {
      const method = new aws.apigateway.Method(`AdminApi${name}Any`, {
        restApi: adminApi.id,
        resourceId,
        httpMethod: adminIntegrationConfig.httpMethod,
        authorization: adminIntegrationConfig.authorization,
        apiKeyRequired: adminIntegrationConfig.apiKeyRequired,
      });
      const integration = new aws.apigateway.Integration(
        `AdminApi${name}Payload`,
        {
          restApi: adminApi.id,
          resourceId,
          httpMethod: method.httpMethod,
          type: adminIntegrationConfig.type,
          integrationHttpMethod: adminIntegrationConfig.integrationHttpMethod,
          uri: payloadFunction.nodes.function.invokeArn,
          timeoutMilliseconds: 29_000,
        },
        { dependsOn: [adminInvoke] },
      );
      return [method, integration];
    });
    const adminDeployment = new aws.apigateway.Deployment(
      "AdminApiDeployment",
      {
        restApi: adminApi.id,
        triggers: {
          redeployment: $resolve(adminMethods.flat().map((r) => r.id)).apply(
            (ids) =>
              JSON.stringify([
                ...ids,
                adminIntegrationConfig,
                payloadFunction.nodes.function.invokeArn,
              ]),
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
    if (concurrencyPlan.apiThrottle) {
      new aws.apigateway.MethodSettings("AdminApiThrottle", {
        restApi: adminApi.id,
        stageName: adminStage.stageName,
        methodPath: "*/*",
        settings: {
          throttlingRateLimit: concurrencyPlan.apiThrottle.rateLimit,
          throttlingBurstLimit: concurrencyPlan.apiThrottle.burstLimit,
        },
      });
    }
    const adminOriginKey = new aws.apigateway.ApiKey("AdminApiOriginKey", {
      name: `dilm-${$app.stage}-admin-origin`,
      description:
        "Secret the CloudFront origin sends as x-api-key; API Gateway refuses any request without it, so the execute-api URL is no bypass.",
      enabled: true,
    });
    const adminUsagePlan = new aws.apigateway.UsagePlan("AdminApiUsagePlan", {
      name: `dilm-${$app.stage}-admin-origin`,
      apiStages: [{ apiId: adminApi.id, stage: adminStage.stageName }],
    });
    new aws.apigateway.UsagePlanKey("AdminApiUsagePlanKey", {
      keyId: adminOriginKey.id,
      keyType: "API_KEY",
      usagePlanId: adminUsagePlan.id,
    });

    const staticBucketName = edge.staticBucketName($app.stage);
    const staticBucket = new aws.s3.Bucket("CmsStaticBucket", {
      bucket: staticBucketName,
      forceDestroy: !production,
    });
    new aws.s3.BucketPublicAccessBlock("CmsStaticPublicAccess", {
      bucket: staticBucket.id,
      blockPublicAcls: true,
      blockPublicPolicy: true,
      ignorePublicAcls: true,
      restrictPublicBuckets: true,
    });
    new aws.s3.BucketServerSideEncryptionConfiguration("CmsStaticEncryption", {
      bucket: staticBucket.id,
      rules: [
        { applyServerSideEncryptionByDefault: { sseAlgorithm: "AES256" } },
      ],
    });
    const staticAssets = edge.listStaticAssets(
      $dev
        ? edge.assetsDir($cli.paths.root)
        : edge.assertAssetsBuilt($cli.paths.root),
    );
    const staticObjects = staticAssets.map(
      (asset) =>
        new aws.s3.BucketObjectv2(`CmsStatic/${asset.key}`, {
          bucket: staticBucket.id,
          key: asset.key,
          source: $asset(asset.file),
          contentType: asset.contentType,
          cacheControl: asset.cacheControl,
        }),
    );
    const staticAccessControl = new aws.cloudfront.OriginAccessControl(
      "CmsStaticAccessControl",
      {
        name: `dilm-${$app.stage}-cms-static`,
        originAccessControlOriginType: "s3",
        signingBehavior: "always",
        signingProtocol: "sigv4",
      },
    );
    const adminEdgeFunction = new aws.cloudfront.Function("AdminEdgeFunction", {
      name: `dilm-${$app.stage}-admin-edge`,
      runtime: "cloudfront-js-2.0",
      comment:
        "Admits only the allowlisted viewer IPs and forwards the viewer host as x-forwarded-host (DILM-10, DILM-38).",
      publish: true,
      code: viewerRequestCode,
    });
    const edgeFunctionAssociations = [
      {
        eventType: "viewer-request",
        functionArn: adminEdgeFunction.arn,
      },
    ];
    const adminDistribution = new aws.cloudfront.Distribution(
      "AdminDistribution",
      {
        enabled: true,
        comment: `dilm-${$app.stage} CMS admin`,
        isIpv6Enabled: false,
        httpVersion: "http2",
        priceClass: "PriceClass_100",
        origins: [
          {
            originId: "api",
            domainName: $interpolate`${adminApi.id}.execute-api.${REGION}.amazonaws.com`,
            originPath: $interpolate`/${adminStage.stageName}`,
            customOriginConfig: {
              httpPort: 80,
              httpsPort: 443,
              originProtocolPolicy: "https-only",
              originSslProtocols: ["TLSv1.2"],
              originReadTimeout: edge.ORIGIN_READ_TIMEOUT_SECONDS,
            },
            customHeaders: [
              { name: edge.ORIGIN_KEY_HEADER, value: adminOriginKey.value },
            ],
          },
          {
            originId: "static",
            domainName: staticBucket.bucketRegionalDomainName,
            originAccessControlId: staticAccessControl.id,
          },
        ],
        defaultCacheBehavior: {
          targetOriginId: "api",
          viewerProtocolPolicy: "redirect-to-https",
          allowedMethods: [
            "GET",
            "HEAD",
            "OPTIONS",
            "PUT",
            "POST",
            "PATCH",
            "DELETE",
          ],
          cachedMethods: ["GET", "HEAD"],
          cachePolicyId: edge.CACHING_DISABLED_POLICY_ID,
          originRequestPolicyId: edge.ALL_VIEWER_EXCEPT_HOST_POLICY_ID,
          compress: false,
          functionAssociations: edgeFunctionAssociations,
        },
        orderedCacheBehaviors: edge
          .staticPathPatterns(staticAssets.map((asset) => asset.key))
          .map((pathPattern) => ({
            pathPattern,
            targetOriginId: "static",
            viewerProtocolPolicy: "redirect-to-https",
            allowedMethods: ["GET", "HEAD"],
            cachedMethods: ["GET", "HEAD"],
            cachePolicyId: edge.CACHING_OPTIMIZED_POLICY_ID,
            compress: true,
            functionAssociations: edgeFunctionAssociations,
          })),
        restrictions: { geoRestriction: { restrictionType: "none" } },
        viewerCertificate: { cloudfrontDefaultCertificate: true },
      },
      { dependsOn: staticObjects },
    );
    new aws.s3.BucketPolicy("CmsStaticPolicy", {
      bucket: staticBucket.id,
      policy: $resolve([partition.partition, adminDistribution.arn]).apply(
        ([partitionName, distributionArn]) =>
          JSON.stringify(
            edge.staticBucketPolicy(
              partitionName,
              staticBucketName,
              distributionArn,
            ),
          ),
      ),
    });
    const adminUrl = $interpolate`https://${adminDistribution.domainName}`;
    // TODO(DILM Track 1/2): define the web Lambda here.
    const cvDeadLetterQueue = new sst.aws.Queue("CvDeadLetterQueue", {
      transform: {
        queue: (args) => {
          args.name = queue.cvDeadLetterQueueName($app.stage);
          args.messageRetentionSeconds = queue.CV_DLQ_RETENTION_SECONDS;
          args.sqsManagedSseEnabled = true;
        },
      },
    });
    const cvQueueSettings = queue.cvQueueSettings();
    const cvQueue = new sst.aws.Queue("CvQueue", {
      visibilityTimeout: cvQueueSettings.visibilityTimeout,
      dlq: {
        queue: cvDeadLetterQueue.arn,
        retry: cvQueueSettings.maxReceiveCount,
      },
      transform: {
        queue: (args) => {
          args.name = queue.cvQueueName($app.stage);
          args.messageRetentionSeconds = cvQueueSettings.retentionSeconds;
          args.sqsManagedSseEnabled = true;
        },
      },
    });
    const cvConsumerSettings = queue.cvConsumerSettings();
    const cvConsumerTls = queue.cvConsumerDatabaseTls($app.stage);
    const cvSubscriber = cvQueue.subscribe(
      {
        handler: queue.CV_CONSUMER_HANDLER,
        runtime: "nodejs22.x",
        architecture: "arm64",
        timeout: cvConsumerSettings.timeout,
        link: [
          databaseLinkable,
          cvPrivateBucketLinkable,
          emailSenderLinkable,
          runtimeConfigParametersLinkable,
        ],
        policies: payloadSesSend.arn.apply((arn) => [arn]),
        nodejs: { install: ["sharp"] },
        logging: { retention: observability.LOG_RETENTION },
        ...cvConsumerTls,
        environment: {
          ...("environment" in cvConsumerTls ? cvConsumerTls.environment : {}),
          [WEBHOOK_FAILURE_STAGE_ENV]: $app.stage,
        },
      },
      {
        batch: { size: cvConsumerSettings.batchSize },
        transform: {
          eventSourceMapping: (args) => {
            args.scalingConfig = {
              maximumConcurrency: cvConsumerSettings.maximumConcurrency,
            };
          },
        },
      },
    );
    new aws.s3.BucketLifecycleConfiguration("PublicWebCacheLifecycle", {
      bucket: publicBucket.id,
      rules: [web.webCacheLifecycleRule()],
    });
    const webTagCacheSpec = web.webTagCacheTable($app.stage);
    const webTagCache = new aws.dynamodb.Table("WebTagCache", {
      name: webTagCacheSpec.name,
      billingMode: webTagCacheSpec.billingMode,
      hashKey: webTagCacheSpec.hashKey,
      rangeKey: webTagCacheSpec.rangeKey,
      attributes: webTagCacheSpec.attributes,
      globalSecondaryIndexes: webTagCacheSpec.globalSecondaryIndexes,
    });
    const webStaticAssets = edge.listStaticAssets(
      $dev
        ? web.webAssetsDir($cli.paths.root)
        : web.assertWebAssetsBuilt($cli.paths.root),
    );
    webStaticAssets.map(
      (asset) =>
        new aws.s3.BucketObjectv2(`WebStatic/${asset.key}`, {
          bucket: publicBucket.id,
          key: web.webStaticKey(asset.key),
          source: $asset(asset.file),
          contentType: asset.contentType,
          cacheControl: asset.cacheControl,
        }),
    );
    const webFunction = new sst.aws.Function("WebApp", {
      bundle: $dev
        ? web.webBundleDir($cli.paths.root)
        : web.assertWebBundleBuilt($cli.paths.root),
      handler: web.WEB_HANDLER,
      runtime: "nodejs22.x",
      architecture: "arm64",
      memory: web.WEB_MEMORY,
      timeout: web.WEB_TIMEOUT,
      logging: { retention: observability.LOG_RETENTION },
      url: { authorization: "none" },
      environment: {
        CMS_URL: payloadFunction.url,
        CMS_AUTH: "iam",
        TENANT_HOST_ALIASES: web.webHostAliases(),
        SITE_STAGE: $app.stage,
        RUNTIME_CONFIG_SSM_PREFIX: parameters.parameterPrefix($app.stage),
        CACHE_BUCKET_NAME: publicBucket.bucket,
        CACHE_BUCKET_REGION: REGION,
        CACHE_BUCKET_KEY_PREFIX: web.WEB_CACHE_PREFIX.replace(/\/$/, ""),
        CACHE_DYNAMO_TABLE: webTagCache.name,
      },
      permissions: [
        ...web
          .webCachePermissions({
            bucketArn: publicBucket.arn,
            tableArn: webTagCache.arn,
            join: (arn, suffix) => $interpolate`${arn}${suffix}`,
          })
          .map((grant) => sst.aws.permission(grant)),
        sst.aws.permission({
          actions: web.WEB_PAYLOAD_INVOKE_ACTIONS,
          resources: [payloadFunction.nodes.function.arn],
        }),
        sst.aws.permission({
          actions: ["ssm:GetParameter", "ssm:GetParameters"],
          resources: $resolve([partition.partition, caller.accountId]).apply(
            ([partitionName, accountId]) =>
              web.webParameterArns([
                ...parameters.parameterArns({
                  partition: partitionName,
                  region: REGION,
                  accountId,
                  stage: $app.stage,
                }),
                ...parameters.edgeParameterArns({
                  partition: partitionName,
                  region: REGION,
                  accountId,
                  stage: $app.stage,
                }),
              ]),
          ),
        }),
      ],
    });
    const webWarmRule = new aws.cloudwatch.EventRule("WebWarmRule", {
      scheduleExpression: web.WEB_WARM_RATE,
      description: "Keeps one web Lambda instance warm (DILM-24).",
    });
    new aws.cloudwatch.EventTarget("WebWarmTarget", {
      rule: webWarmRule.name,
      arn: webFunction.nodes.function.arn,
      input: JSON.stringify(web.WEB_WARM_EVENT),
    });
    new aws.lambda.Permission("WebWarmInvoke", {
      action: "lambda:InvokeFunction",
      function: webFunction.name,
      principal: "events.amazonaws.com",
      sourceArn: webWarmRule.arn,
    });
    const alarmPlan = observability.alarmEmailPlan(
      $app.stage,
      process.env.ALARM_EMAIL,
    );
    if (alarmPlan.log) console.warn(alarmPlan.log);
    const alarmTopic = new aws.sns.Topic("AlarmTopic", {
      name: observability.alarmTopicName($app.stage),
    });
    if (alarmPlan.email) {
      new aws.sns.TopicSubscription("AlarmEmail", {
        topic: alarmTopic.arn,
        protocol: "email",
        endpoint: alarmPlan.email,
      });
    }
    for (const spec of observability.alarmSpecs({
      stage: $app.stage,
      payloadFunctionName: payloadFunction.name as unknown as string,
      cvConsumerFunctionName: cvSubscriber.nodes.function
        .name as unknown as string,
      auroraClusterIdentifier: `dilm-${$app.stage}-db`,
    })) {
      new aws.cloudwatch.MetricAlarm(`Alarm${spec.key}`, {
        name: spec.name,
        alarmDescription: spec.description,
        namespace: spec.namespace,
        metricName: spec.metricName,
        dimensions: spec.dimensions,
        statistic: spec.statistic,
        period: spec.periodSeconds,
        evaluationPeriods: spec.evaluationPeriods,
        datapointsToAlarm: spec.datapointsToAlarm,
        threshold: spec.threshold,
        comparisonOperator: spec.comparisonOperator,
        treatMissingData: spec.treatMissingData,
        alarmActions: [alarmTopic.arn],
      });
    }
    return {
      alarmTopicArn: alarmTopic.arn,
      region: REGION,
      stage: $app.stage,
      adminUrl,
      webUrl: webFunction.url,
      payloadFunctionUrl: payloadFunction.url,
      payloadSesSendPolicy: payloadSesSend.arn,
      publicBucket: publicBucket.bucket,
      cvPrivateBucket: cvBucket.bucket,
      cvRetentionMonths,
      cvQueueUrl: cvQueue.url,
      cvDeadLetterQueueUrl: cvDeadLetterQueue.url,
      databaseHost,
      databaseMasterSecretArn,
      databaseSecurityGroupId: databaseNetwork?.securityGroupId,
    };
  },
});
