#!/usr/bin/env bash
set -euo pipefail

REGION="ap-southeast-3"
CLUSTER_ID="${DEV_DB_CLUSTER_ID:-dilm-dev-db}"
DB_NAME="dilm"
APP_USER="payload_app"
ADMIN_USER="postgres"
MIN_ACU=0
MAX_ACU=1
SECONDS_UNTIL_AUTO_PAUSE=300
REPO_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"

usage() {
  cat <<'USAGE'
Creates the dev-stage database on the AWS Free plan: an Aurora PostgreSQL
cluster in express configuration (no VPC, IAM authentication only, reached
through the internet access gateway), scaled 0-1 ACU with auto-pause after
5 idle minutes. Then creates the "dilm" database and the payload_app login
that Payload, the CV consumer and CI migrations use, and grants it rds_iam so
it signs in with short-lived IAM tokens instead of a password.

Run once per AWS account, with human credentials, before
`sst deploy --stage dev`. Safe to re-run: every step skips what exists.

  AWS_PROFILE=<profile> ./scripts/db/create-express-cluster.sh

Needs the AWS CLI and Docker (psql runs in the postgres image matching the
cluster's major version). Override the cluster name with DEV_DB_CLUSTER_ID;
infra/src/database.ts must name the same cluster.

Express configuration picks the engine version itself. The script exits
non-zero at the end if that major differs from the postgres image pinned in
compose.yaml and .github/workflows/ci.yml, so local and CI can be re-pinned.

Staging and production never use this: they get the locked-architecture
Aurora cluster from sst.config.ts (Backend Spec §3.2, §8).
USAGE
}

case "${1:-}" in
  -h | --help)
    usage
    exit 0
    ;;
  "") ;;
  *)
    usage >&2
    exit 1
    ;;
esac

rds() {
  aws rds --region "$REGION" "$@"
}

cluster_field() {
  rds describe-db-clusters \
    --db-cluster-identifier "$CLUSTER_ID" \
    --query "DBClusters[0].$1" \
    --output text
}

if rds describe-db-clusters --db-cluster-identifier "$CLUSTER_ID" >/dev/null 2>&1; then
  echo "Cluster $CLUSTER_ID already exists."
else
  echo "Creating express cluster $CLUSTER_ID in $REGION..."
  rds create-db-cluster \
    --db-cluster-identifier "$CLUSTER_ID" \
    --engine aurora-postgresql \
    --with-express-configuration \
    --tags Key=project,Value=dilm Key=stage,Value=dev >/dev/null
fi

rds wait db-cluster-available --db-cluster-identifier "$CLUSTER_ID"

echo "Setting capacity to $MIN_ACU-$MAX_ACU ACU, auto-pause after ${SECONDS_UNTIL_AUTO_PAUSE}s..."
rds modify-db-cluster \
  --db-cluster-identifier "$CLUSTER_ID" \
  --serverless-v2-scaling-configuration \
    "MinCapacity=$MIN_ACU,MaxCapacity=$MAX_ACU,SecondsUntilAutoPause=$SECONDS_UNTIL_AUTO_PAUSE" \
  --apply-immediately >/dev/null
rds wait db-cluster-available --db-cluster-identifier "$CLUSTER_ID"

HOST="$(cluster_field Endpoint)"
PORT="$(cluster_field Port)"
ENGINE_VERSION="$(cluster_field EngineVersion)"
CLUSTER_MAJOR="${ENGINE_VERSION%%.*}"

admin_psql() {
  local database="$1"
  shift
  local token
  token="$(aws rds generate-db-auth-token \
    --region "$REGION" \
    --hostname "$HOST" \
    --port "$PORT" \
    --username "$ADMIN_USER")"
  docker run --rm -i \
    -e PGPASSWORD="$token" \
    "postgres:${CLUSTER_MAJOR}-alpine" \
    psql "host=$HOST port=$PORT dbname=$database user=$ADMIN_USER sslmode=verify-full sslrootcert=system" \
    -v ON_ERROR_STOP=1 -q "$@"
}

echo "Creating $APP_USER and the $DB_NAME database (waits for the cluster to resume if paused)..."
admin_psql postgres -v app_user="$APP_USER" -v app_db="$DB_NAME" <<'SQL'
SELECT format('CREATE ROLE %I LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE', :'app_user')
WHERE NOT EXISTS (SELECT FROM pg_roles WHERE rolname = :'app_user')
\gexec
GRANT rds_iam TO :"app_user";
GRANT :"app_user" TO CURRENT_USER;
SELECT format('CREATE DATABASE %I OWNER %I', :'app_db', :'app_user')
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = :'app_db')
\gexec
SQL

PINNED_MAJORS="$(grep -ho 'postgres:[0-9][0-9]*' "$REPO_ROOT/compose.yaml" "$REPO_ROOT/.github/workflows/ci.yml" | sort -u | cut -d: -f2)"

cat <<EOF

Cluster ready: $CLUSTER_ID (Aurora PostgreSQL $ENGINE_VERSION)

To point a local Payload at it, set in .env:
  DATABASE_AUTH=iam
  DATABASE_HOST=$HOST
  DATABASE_PORT=$PORT
  DATABASE_NAME=$DB_NAME
  DATABASE_USER=$APP_USER
  DATABASE_SSL=true
and run with an AWS_PROFILE allowed rds-db:connect on $APP_USER.
EOF

if [[ "$PINNED_MAJORS" != "$CLUSTER_MAJOR" ]]; then
  cat >&2 <<EOF

The cluster runs PostgreSQL $CLUSTER_MAJOR but the repo pins postgres:$(echo "$PINNED_MAJORS" | paste -sd, -).
Change the postgres image tag in compose.yaml and .github/workflows/ci.yml
to postgres:${CLUSTER_MAJOR}-alpine so local and CI match dev.
EOF
  exit 1
fi
