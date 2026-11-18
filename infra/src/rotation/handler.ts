import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  DescribeSecretCommand,
  GetRandomPasswordCommand,
  GetSecretValueCommand,
  PutSecretValueCommand,
  SecretsManagerClient,
  UpdateSecretVersionStageCommand,
} from "@aws-sdk/client-secrets-manager";
import pg from "pg";

import {
  alternateUsername,
  pendingUserStatements,
  ROTATION_PASSWORD_LENGTH,
} from "../rotation";

interface RotationEvent {
  SecretId: string;
  ClientRequestToken: string;
  Step: "createSecret" | "setSecret" | "testSecret" | "finishSecret";
}

interface PayloadAppSecret {
  username: string;
  password: string;
  host: string;
  port: number;
  dbname: string;
  masterarn: string;
}

const client = new SecretsManagerClient({});

function caBundle(): string {
  return readFileSync(
    join(process.env.LAMBDA_TASK_ROOT ?? ".", "ca-bundle.pem"),
    "utf8",
  );
}

async function readSecret(
  secretId: string,
  stage: "AWSCURRENT" | "AWSPENDING",
  token?: string,
): Promise<Record<string, unknown> | undefined> {
  try {
    const { SecretString } = await client.send(
      new GetSecretValueCommand({
        SecretId: secretId,
        VersionStage: stage,
        VersionId: token,
      }),
    );
    return SecretString === undefined ? undefined : JSON.parse(SecretString);
  } catch (error) {
    if ((error as { name?: string }).name === "ResourceNotFoundException") {
      return undefined;
    }
    throw error;
  }
}

async function connect(
  credential: { username: string; password: string },
  target: PayloadAppSecret,
): Promise<pg.Client> {
  const database = new pg.Client({
    host: target.host,
    port: target.port,
    database: target.dbname,
    user: credential.username,
    password: credential.password,
    ssl: { ca: caBundle(), rejectUnauthorized: true },
    connectionTimeoutMillis: 60_000,
  });
  await database.connect();
  return database;
}

async function createSecret(event: RotationEvent) {
  if (
    await readSecret(event.SecretId, "AWSPENDING", event.ClientRequestToken)
  ) {
    return;
  }
  const current = (await readSecret(
    event.SecretId,
    "AWSCURRENT",
  )) as unknown as PayloadAppSecret;
  const { RandomPassword } = await client.send(
    new GetRandomPasswordCommand({
      PasswordLength: ROTATION_PASSWORD_LENGTH,
      ExcludePunctuation: true,
    }),
  );
  await client.send(
    new PutSecretValueCommand({
      SecretId: event.SecretId,
      ClientRequestToken: event.ClientRequestToken,
      SecretString: JSON.stringify({
        ...current,
        username: alternateUsername(current.username),
        password: RandomPassword,
      }),
      VersionStages: ["AWSPENDING"],
    }),
  );
}

async function setSecret(event: RotationEvent) {
  const pending = (await readSecret(
    event.SecretId,
    "AWSPENDING",
    event.ClientRequestToken,
  )) as unknown as PayloadAppSecret;
  const master = (await readSecret(pending.masterarn, "AWSCURRENT")) as
    { username: string; password: string } | undefined;
  if (master === undefined) {
    throw new Error("The master secret has no current version.");
  }
  const database = await connect(master, pending);
  try {
    for (const statement of pendingUserStatements({
      pendingUser: pending.username,
      password: pending.password,
    })) {
      await database.query(statement);
    }
  } finally {
    await database.end();
  }
}

async function testSecret(event: RotationEvent) {
  const pending = (await readSecret(
    event.SecretId,
    "AWSPENDING",
    event.ClientRequestToken,
  )) as unknown as PayloadAppSecret;
  const database = await connect(pending, pending);
  try {
    await database.query("SELECT 1");
  } finally {
    await database.end();
  }
}

async function finishSecret(event: RotationEvent) {
  const { VersionIdsToStages = {} } = await client.send(
    new DescribeSecretCommand({ SecretId: event.SecretId }),
  );
  const current = Object.entries(VersionIdsToStages).find(([, stages]) =>
    stages.includes("AWSCURRENT"),
  )?.[0];
  if (current === event.ClientRequestToken) {
    return;
  }
  await client.send(
    new UpdateSecretVersionStageCommand({
      SecretId: event.SecretId,
      VersionStage: "AWSCURRENT",
      MoveToVersionId: event.ClientRequestToken,
      RemoveFromVersionId: current,
    }),
  );
}

const STEPS = { createSecret, setSecret, testSecret, finishSecret };

export async function handler(event: RotationEvent): Promise<void> {
  const { RotationEnabled, VersionIdsToStages = {} } = await client.send(
    new DescribeSecretCommand({ SecretId: event.SecretId }),
  );
  const stages = VersionIdsToStages[event.ClientRequestToken];
  if (!RotationEnabled || stages === undefined) {
    throw new Error(
      "Secret rotation is not enabled or the version is unknown.",
    );
  }
  if (stages.includes("AWSCURRENT")) {
    return;
  }
  if (!stages.includes("AWSPENDING")) {
    throw new Error("The version is not staged for rotation.");
  }
  await STEPS[event.Step](event);
}
