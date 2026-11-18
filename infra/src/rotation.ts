import { PAYLOAD_DATABASE_USER } from "./database";
import type { AwsScope } from "./ses";

export const PAYLOAD_APP_ROTATION_DAYS = 30;
export const ROTATION_CLONE_SUFFIX = "_clone";
export const ROTATION_PASSWORD_LENGTH = 40;

const ROLE_NAME = /^[a-z_][a-z0-9_]{0,62}$/;
const SAFE_PASSWORD = /^[A-Za-z0-9]{32,128}$/;

export function payloadAppSecretArnPattern(
  { partition, region, accountId }: AwsScope,
  secretName: string,
): string {
  return `arn:${partition}:secretsmanager:${region}:${accountId}:secret:${secretName}-*`;
}

export function alternateUsername(
  current: string,
  base: string = PAYLOAD_DATABASE_USER,
): string {
  const next =
    current === base
      ? `${base}${ROTATION_CLONE_SUFFIX}`
      : current === `${base}${ROTATION_CLONE_SUFFIX}`
        ? base
        : undefined;
  if (next === undefined || !ROLE_NAME.test(next)) {
    throw new Error(
      `Cannot alternate the database user: it is neither ${base} nor its clone.`,
    );
  }
  return next;
}

export function assertSafePassword(password: string): string {
  if (!SAFE_PASSWORD.test(password)) {
    throw new Error("The generated password is not alphanumeric.");
  }
  return password;
}

function quoteRole(role: string): string {
  if (!ROLE_NAME.test(role)) {
    throw new Error(`Unsafe role name: ${role}`);
  }
  return `"${role}"`;
}

export function pendingUserStatements({
  pendingUser,
  password,
  base = PAYLOAD_DATABASE_USER,
}: {
  pendingUser: string;
  password: string;
  base?: string;
}): string[] {
  const role = quoteRole(pendingUser);
  const literal = `'${assertSafePassword(password)}'`;
  const statements = [
    `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = '${pendingUser}') THEN CREATE ROLE ${role} LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE; END IF; END $$`,
    `ALTER ROLE ${role} WITH LOGIN PASSWORD ${literal}`,
  ];
  if (pendingUser !== base) {
    statements.push(`GRANT ${quoteRole(base)} TO ${role}`);
  }
  return statements;
}

export function rotationLambdaPolicy(
  scope: AwsScope,
  secretName: string,
  masterSecretArn: string,
) {
  return {
    Version: "2012-10-17",
    Statement: [
      {
        Sid: "RotatePayloadAppSecretOnly",
        Effect: "Allow",
        Action: [
          "secretsmanager:DescribeSecret",
          "secretsmanager:GetSecretValue",
          "secretsmanager:PutSecretValue",
          "secretsmanager:UpdateSecretVersionStage",
        ],
        Resource: [payloadAppSecretArnPattern(scope, secretName)],
      },
      {
        Sid: "ReadMasterSecretOnly",
        Effect: "Allow",
        Action: ["secretsmanager:GetSecretValue"],
        Resource: [masterSecretArn],
      },
      {
        Sid: "GenerateRandomPassword",
        Effect: "Allow",
        Action: ["secretsmanager:GetRandomPassword"],
        Resource: ["*"],
      },
    ],
  };
}
