#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'USAGE'
Usage: scripts/ci/migrate-deployed.sh --stage <staging|production>

Applies pending Payload migrations to the stage's Aurora cluster from a CI
runner, as payload_app, with the credential in the dilm-<stage>-payload-app
Secrets Manager secret. Run it after `sst deploy`, with AWS credentials for
the stage already in the environment.

  1. checks the secret exists and was seeded; if not, exits 1 pointing at
     scripts/db/create-payload-app-role.sh --stage <stage>
  2. masks the secret's username and password in the workflow log
  3. runs `pnpm --filter @dilm/cms migrate` through the runtime-config
     DATABASE_AUTH=secret path, over TLS verified against the bundled
     ap-southeast-3 RDS CA (NODE_EXTRA_CA_CERTS)
  4. retries only connection failures, so a paused cluster has time to resume;
     a failing migration itself is never retried

Tuning (environment): MIGRATE_ATTEMPTS (default 4), MIGRATE_RETRY_SECONDS
(default 20), MIGRATE_COMMAND (default `pnpm --filter @dilm/cms migrate`).
The migration CLI needs no real bucket or Payload secret; placeholders are set.
USAGE
}

STAGE=""
while [[ $# -gt 0 ]]; do
  case "$1" in
    --stage) STAGE="${2:-}"; shift 2 ;;
    -h|--help) usage; exit 0 ;;
    *) usage >&2; exit 2 ;;
  esac
done
[[ "$STAGE" == "staging" || "$STAGE" == "production" ]] || { usage >&2; exit 2; }

REGION=ap-southeast-3
SECRET_NAME="dilm-$STAGE-payload-app"
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
ATTEMPTS="${MIGRATE_ATTEMPTS:-4}"
RETRY_SECONDS="${MIGRATE_RETRY_SECONDS:-20}"
MIGRATE_COMMAND="${MIGRATE_COMMAND:-pnpm --filter @dilm/cms migrate}"

unseeded() {
  echo "The $SECRET_NAME secret has no payload_app login yet. Run scripts/db/create-payload-app-role.sh --stage $STAGE once, then re-run this workflow." >&2
  exit 1
}

secret_arn=$(aws secretsmanager describe-secret --region "$REGION" \
  --secret-id "$SECRET_NAME" --query ARN --output text) \
  || { echo "Secret $SECRET_NAME not found; the infra deploy must create it first." >&2; exit 1; }

secret_json=$(aws secretsmanager get-secret-value --region "$REGION" \
  --secret-id "$secret_arn" --query SecretString --output text 2>/dev/null) \
  || unseeded
for key in username password host dbname; do
  value=$(jq -r --arg k "$key" '.[$k] // empty' <<<"$secret_json" 2>/dev/null) || unseeded
  [[ -n "$value" ]] || unseeded
  if [[ "$key" == "username" || "$key" == "password" ]]; then
    echo "::add-mask::$value"
  fi
done
unset secret_json value

export RUNTIME_CONFIG_SOURCE=env
export DATABASE_AUTH=secret
export DATABASE_SECRET_ARN="$secret_arn"
export AWS_REGION="$REGION"
export NODE_EXTRA_CA_CERTS="$ROOT/infra/src/rotation/ap-southeast-3-bundle.pem"
export PAYLOAD_SECRET=migrations-do-not-sign-anything
export S3_PUBLIC_BUCKET="dilm-$STAGE-public"
export S3_PRIVATE_BUCKET="dilm-$STAGE-cv-private"

log=$(mktemp)
trap 'rm -f "$log"' EXIT
transient='ECONNREFUSED|ETIMEDOUT|ECONNRESET|timeout|terminated unexpectedly|starting up|resuming|EHOSTUNREACH'

attempt=1
while true; do
  set +e
  # shellcheck disable=SC2086
  (cd "$ROOT" && $MIGRATE_COMMAND) 2>&1 | tee "$log"
  status=${PIPESTATUS[0]}
  set -e
  [[ $status -eq 0 ]] && exit 0
  if [[ $attempt -ge $ATTEMPTS ]] || ! grep -qiE "$transient" "$log"; then
    echo "Migration failed (attempt $attempt of $ATTEMPTS). The new application version is already deployed on the old schema; fix forward or redeploy the previous commit." >&2
    exit "$status"
  fi
  echo "Database not reachable yet (attempt $attempt of $ATTEMPTS); waiting ${RETRY_SECONDS}s for Aurora to resume."
  sleep "$RETRY_SECONDS"
  attempt=$((attempt + 1))
done
