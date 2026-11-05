#!/bin/sh
set -eu

usage() {
  cat <<'USAGE'
Usage: scripts/test-seed-pages.sh

Runs the seed:pages integration test (src/seed/pages.db.test.ts) against the
scratch Postgres database dilm_seed_test, then the publish revalidation
integration test (src/revalidation.db.test.ts) against a second one,
dilm_revalidation_test, then the new page dialog endpoint integration test
(src/pageDialog.db.test.ts) against a third, dilm_page_dialog_test. Each
database is dropped and recreated first, because Payload's dev schema push
times out on a used one. The shared dev database is never touched.

Uses psql when installed, otherwise `docker compose exec postgres psql`.
The admin connection comes from PGHOST, PGPORT, PGUSER and PGPASSWORD
(defaults: localhost, 5432, postgres, postgres, matching `docker compose up`).
The app role that owns the scratch database is DATABASE_USER (default
payload_app) and its password DATABASE_PASSWORD. The database host, port, name
and user the app connects with are forced to the scratch values, so a .env
pointing at the shared dev database cannot be reached. The test starts its own in-process S3 stand-in for the
placeholder photos, so it needs no MinIO.
USAGE
}

case "${1:-}" in
  -h | --help)
    usage
    exit 0
    ;;
esac

cd "$(dirname "$0")/.."

if [ -f ../../.env ]; then
  set -a
  . ../../.env
  set +a
fi

export PGHOST="${PGHOST:-localhost}"
export PGPORT="${PGPORT:-5432}"
export PGUSER="${PGUSER:-postgres}"
export PGPASSWORD="${PGPASSWORD:-${POSTGRES_MASTER_PASSWORD:-postgres}}"
OWNER="${DATABASE_USER:-payload_app}"
APP_PASSWORD="${DATABASE_PASSWORD:-payload_app}"

admin_sql() {
  if command -v psql >/dev/null 2>&1; then
    psql -v ON_ERROR_STOP=1 -d postgres \
      -c "DROP DATABASE IF EXISTS $SCRATCH" \
      -c "CREATE DATABASE $SCRATCH OWNER $OWNER"
  else
    (cd ../.. && docker compose exec -T -e PGPASSWORD="$PGPASSWORD" postgres \
      psql -v ON_ERROR_STOP=1 -U "$PGUSER" -d postgres \
      -c "DROP DATABASE IF EXISTS $SCRATCH" \
      -c "CREATE DATABASE $SCRATCH OWNER $OWNER")
  fi
}

run_against() {
  SCRATCH="$1"
  case "$SCRATCH" in
    dilm_seed_test | dilm_revalidation_test | dilm_page_dialog_test) ;;
    *)
      echo "Refusing to use $SCRATCH." >&2
      exit 1
      ;;
  esac
  admin_sql
  (
    export SEED_TEST_DATABASE="$SCRATCH"
    export DATABASE_HOST="$PGHOST"
    export DATABASE_PORT="$PGPORT"
    export DATABASE_NAME="$SCRATCH"
    export DATABASE_USER="$OWNER"
    export DATABASE_PASSWORD="$APP_PASSWORD"
    cd ../..
    pnpm exec vitest run "$2"
  )
}

run_against dilm_seed_test apps/cms/src/seed/pages.db.test.ts
run_against dilm_revalidation_test apps/cms/src/revalidation.db.test.ts
run_against dilm_page_dialog_test apps/cms/src/pageDialog.db.test.ts
