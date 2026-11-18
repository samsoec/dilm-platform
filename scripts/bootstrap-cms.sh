#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'USAGE'
Usage: scripts/bootstrap-cms.sh --stage <staging|production|local> --email <address>
                                [--generate-password] [--demo]
                                [--confirm-production]

Brings an empty CMS database to a usable state, in order:
  1. migrate         (scripts/ci/migrate-deployed.sh on staging/production)
  2. seed:tenants    the three tenants
  3. seed:admin      the first Super Admin
  4. seed:layout and seed:pages, only with --demo
Every step is safe to re-run: a second run applies no migration, creates no
tenant, user or page, and says so. An existing user is never modified, so an
existing Super Admin's password is never reset, and a second Super Admin is
never created.

Stages
  staging, production  connects as payload_app with the dilm-<stage>-payload-app
                       Secrets Manager secret (DATABASE_AUTH=secret), over TLS
                       verified against the bundled ap-southeast-3 RDS CA. Needs
                       AWS credentials for the stage (AWS_PROFILE) and network
                       reach to the Aurora endpoint. Never uses the master login.
  local                uses the DATABASE_* settings already in the environment
                       or the root .env, for a scratch database.

Super Admin password (never printed, logged or stored; only asked for when the
user has to be created)
  BOOTSTRAP_ADMIN_PASSWORD   taken from the environment (use for CI secrets)
  --generate-password        generated and shown once on the terminal; refused
                             when CI is set or stdin is not a terminal
  otherwise                  typed twice at a hidden prompt

Production is refused unless --confirm-production is given, and --demo is
refused on production altogether. In GitHub Actions, run it from a step whose
password comes from a repository secret; the database login and the password
are masked in the log.

Exit codes: 0 done (or nothing to do), 1 a step failed, 2 bad usage or refused.
USAGE
}

STAGE=""
EMAIL=""
GENERATE=0
DEMO=0
CONFIRM_PRODUCTION=0
while [[ $# -gt 0 ]]; do
  case "$1" in
    --stage) STAGE="${2:-}"; shift 2 ;;
    --email) EMAIL="${2:-}"; shift 2 ;;
    --generate-password) GENERATE=1; shift ;;
    --demo) DEMO=1; shift ;;
    --confirm-production) CONFIRM_PRODUCTION=1; shift ;;
    -h|--help) usage; exit 0 ;;
    *) usage >&2; exit 2 ;;
  esac
done

refuse() { echo "$1" >&2; exit 2; }

[[ "$STAGE" == "staging" || "$STAGE" == "production" || "$STAGE" == "local" ]] || { usage >&2; exit 2; }
[[ -n "$EMAIL" ]] || refuse "--email is required."
if [[ "$STAGE" == "production" ]]; then
  [[ $DEMO -eq 0 ]] || refuse "Demo content is never seeded on production."
  [[ $CONFIRM_PRODUCTION -eq 1 ]] || refuse "Refusing to bootstrap production without --confirm-production."
fi

REGION=ap-southeast-3
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

if [[ -n "${BOOTSTRAP_ADMIN_PASSWORD:-}" && "${GITHUB_ACTIONS:-}" == "true" ]]; then
  echo "::add-mask::$BOOTSTRAP_ADMIN_PASSWORD"
fi

if [[ "$STAGE" != "local" ]]; then
  secret_name="dilm-$STAGE-payload-app"
  secret_arn=$(aws secretsmanager describe-secret --region "$REGION" \
    --secret-id "$secret_name" --query ARN --output text 2>/dev/null) \
    || { echo "Could not read secret $secret_name. Check AWS credentials and that the infra deploy created it." >&2; exit 1; }

  echo "== migrate"
  "$ROOT/scripts/ci/migrate-deployed.sh" --stage "$STAGE"

  export RUNTIME_CONFIG_SOURCE=env
  export DATABASE_AUTH=secret
  export DATABASE_SECRET_ARN="$secret_arn"
  export AWS_REGION="$REGION"
  export NODE_EXTRA_CA_CERTS="$ROOT/infra/src/rotation/ap-southeast-3-bundle.pem"
  export PAYLOAD_SECRET=bootstrap-do-not-sign-anything
  export S3_PUBLIC_BUCKET="dilm-$STAGE-public"
  export S3_PRIVATE_BUCKET="dilm-$STAGE-cv-private"
else
  echo "== migrate"
  (cd "$ROOT" && pnpm --filter @dilm/cms migrate)
fi

cd "$ROOT"
echo "== seed:tenants"
pnpm --filter @dilm/cms seed:tenants

echo "== seed:admin"
BOOTSTRAP_ADMIN_EMAIL="$EMAIL" \
  BOOTSTRAP_GENERATE_PASSWORD="$GENERATE" \
  pnpm --filter @dilm/cms seed:admin

if [[ $DEMO -eq 1 ]]; then
  echo "== seed:layout"
  pnpm --filter @dilm/cms seed:layout
  echo "== seed:pages"
  pnpm --filter @dilm/cms seed:pages
fi

echo "Bootstrap finished."
