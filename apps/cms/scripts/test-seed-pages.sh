#!/bin/sh
set -eu

usage() {
  cat <<'USAGE'
Usage: scripts/test-seed-pages.sh

Runs the seed:pages integration test (src/seed/pages.db.test.ts) against a
scratch Postgres database, dilm_seed_test, which is dropped and recreated
first. The shared dev database is never touched.

Uses psql when installed, otherwise `docker compose exec postgres psql`.
The admin connection comes from PGHOST, PGPORT, PGUSER and PGPASSWORD
(defaults: localhost, 5432, postgres, postgres, matching `docker compose up`).
The app role that owns the scratch database is DATABASE_USER (default
payload_app). The test starts its own in-process S3 stand-in for the
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

SCRATCH=dilm_seed_test
export PGHOST="${PGHOST:-localhost}"
export PGPORT="${PGPORT:-5432}"
export PGUSER="${PGUSER:-postgres}"
export PGPASSWORD="${PGPASSWORD:-${POSTGRES_MASTER_PASSWORD:-postgres}}"
OWNER="${DATABASE_USER:-payload_app}"

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

admin_sql

export SEED_TEST_DATABASE="$SCRATCH"
cd ../..
exec pnpm exec vitest run apps/cms/src/seed/pages.db.test.ts
