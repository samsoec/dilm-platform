#!/usr/bin/env bash
set -euo pipefail
set +x

usage() {
  cat <<'USAGE'
Usage: scripts/db/create-payload-app-role.sh --stage staging|production

Creates the least-privilege payload_app role on the Aurora cluster of a stage
and stores its password in the Secrets Manager secret dilm-<stage>-payload-app
(JSON: username, password, host, port, dbname).

payload_app owns the public schema of the dilm database and has no superuser,
createdb or createrole rights. The RDS-managed master secret is read only here,
to connect once; app code never receives it. Re-running rotates the password.
The cluster must accept your IP (security group dilm-<stage>-db is open on
5432) and may take ~15s to resume from auto-pause.

Needs: aws (with credentials for the stage account), psql, jq, openssl.
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
CLUSTER="dilm-$STAGE-db"
DB=dilm
APP_USER=payload_app
SECRET_NAME="dilm-$STAGE-payload-app"

for tool in aws psql jq openssl; do
  command -v "$tool" >/dev/null || { echo "missing $tool" >&2; exit 1; }
done

cluster_json=$(aws rds describe-db-clusters --region "$REGION" \
  --db-cluster-identifier "$CLUSTER" --query 'DBClusters[0]' --output json)
host=$(jq -r '.Endpoint' <<<"$cluster_json")
port=$(jq -r '.Port' <<<"$cluster_json")
master_arn=$(jq -r '.MasterUserSecret.SecretArn' <<<"$cluster_json")
master_user=$(jq -r '.MasterUsername' <<<"$cluster_json")

master_password=$(aws secretsmanager get-secret-value --region "$REGION" \
  --secret-id "$master_arn" --query SecretString --output text | jq -r '.password')
app_password=$(openssl rand -base64 36 | tr -dc 'A-Za-z0-9' | head -c 40)

{
  printf "\\set app_password '%s'\n" "$app_password"
  cat <<'SQL'
SELECT format('CREATE ROLE %I LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE PASSWORD %L', :'app_user', :'app_password')
WHERE NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = :'app_user')
\gexec
SELECT format('ALTER ROLE %I PASSWORD %L', :'app_user', :'app_password')
\gexec
SELECT format('GRANT %I TO CURRENT_USER', :'app_user')
\gexec
SELECT format('ALTER SCHEMA public OWNER TO %I', :'app_user')
\gexec
SELECT format('GRANT CONNECT ON DATABASE %I TO %I', :'dbname', :'app_user')
\gexec
SQL
} | PGPASSWORD="$master_password" PGSSLMODE=require psql \
  "host=$host port=$port dbname=$DB user=$master_user connect_timeout=60" \
  -v ON_ERROR_STOP=1 -v app_user="$APP_USER" -v dbname="$DB"

secret_json=$(APP_PASSWORD="$app_password" jq -n --arg u "$APP_USER" --arg h "$host" \
  --argjson port "$port" --arg d "$DB" \
  '{username:$u,password:env.APP_PASSWORD,host:$h,port:$port,dbname:$d}')

if aws secretsmanager describe-secret --region "$REGION" --secret-id "$SECRET_NAME" >/dev/null 2>&1; then
  aws secretsmanager put-secret-value --region "$REGION" \
    --secret-id "$SECRET_NAME" --secret-string file:///dev/stdin <<<"$secret_json" >/dev/null
else
  aws secretsmanager create-secret --region "$REGION" \
    --name "$SECRET_NAME" --secret-string file:///dev/stdin <<<"$secret_json" >/dev/null
fi
echo "payload_app ready; secret $SECRET_NAME updated"
