#!/bin/sh
set -eu

usage() {
  cat <<'USAGE'
Usage: scripts/check-migrations.sh

Proves the committed migrations in one command, on the scratch Postgres
database dilm_migration_check (dropped and recreated first, dropped again at
the end). The shared dev database is never touched.

  1. apply      every migration runs on an empty database
  2. roll back  every migration's down runs
  3. re-apply   every migration runs again after the roll back
  4. in sync    `migrate:create --skip-empty` writes nothing, so the
                collection config and the migrations agree

Run it after `pnpm --filter cms migrate:create <name>` and before committing.
It prints one line per step. A failing step prints the end of its output and
the path of its full log, and the script exits 1. Files written by step 4 are
removed again, since they only show that a migration is missing.

Uses psql when installed, otherwise `docker compose exec postgres psql`. The
admin connection comes from PGHOST, PGPORT, PGUSER and PGPASSWORD (defaults:
localhost, 5432, postgres, postgres, matching `docker compose up`). The role
that owns the scratch database is DATABASE_USER (default payload_app) with
DATABASE_PASSWORD. The database name is forced to the scratch value, so a
.env pointing at the shared dev database cannot be reached.
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

SCRATCH=dilm_migration_check
export PGHOST="${PGHOST:-localhost}"
export PGPORT="${PGPORT:-5432}"
export PGUSER="${PGUSER:-postgres}"
export PGPASSWORD="${PGPASSWORD:-${POSTGRES_MASTER_PASSWORD:-postgres}}"
OWNER="${DATABASE_USER:-payload_app}"

export DATABASE_AUTH=password
export DATABASE_HOST="$PGHOST"
export DATABASE_PORT="$PGPORT"
export DATABASE_NAME="$SCRATCH"
export DATABASE_USER="$OWNER"
export DATABASE_PASSWORD="${DATABASE_PASSWORD:-payload_app}"
export NO_COLOR=1
export FORCE_COLOR=0

LOG_DIR="${TMPDIR:-/tmp}/dilm-check-migrations"
mkdir -p "$LOG_DIR"

admin_sql() {
  if command -v psql >/dev/null 2>&1; then
    psql -q -v ON_ERROR_STOP=1 -d postgres "$@"
  else
    (cd ../.. && docker compose exec -T -e PGPASSWORD="$PGPASSWORD" postgres \
      psql -q -v ON_ERROR_STOP=1 -U "$PGUSER" -d postgres "$@")
  fi
}

drop_scratch() {
  admin_sql -c "DROP DATABASE IF EXISTS $SCRATCH" >/dev/null 2>&1 || true
}

fail() {
  echo "FAIL  $1, full output: $2"
  tail -n 30 "$2" | sed 's/^/      /'
  drop_scratch
  exit 1
}

step() {
  NAME="$1"
  shift
  LOG="$LOG_DIR/$NAME.log"
  if ! "$@" >"$LOG" 2>&1 </dev/null; then
    fail "$NAME" "$LOG"
  fi
  if grep -q "ERROR" "$LOG"; then
    fail "$NAME" "$LOG"
  fi
  echo "ok    $NAME"
}

if ! admin_sql -c "DROP DATABASE IF EXISTS $SCRATCH" -c "CREATE DATABASE $SCRATCH OWNER $OWNER" >"$LOG_DIR/create.log" 2>&1; then
  echo "FAIL  could not create $SCRATCH. Is Postgres up (docker compose up -d)?"
  tail -n 10 "$LOG_DIR/create.log" | sed 's/^/      /'
  exit 1
fi

step apply pnpm payload migrate
step roll-back pnpm payload migrate:down
step re-apply pnpm payload migrate

BEFORE="$LOG_DIR/before.txt"
AFTER="$LOG_DIR/after.txt"
INDEX_COPY="$LOG_DIR/index.ts.copy"
ls src/migrations >"$BEFORE"
cp src/migrations/index.ts "$INDEX_COPY"
step in-sync-run pnpm payload migrate:create uncommitted --skip-empty
ls src/migrations >"$AFTER"
NEW_FILES=$(comm -13 "$BEFORE" "$AFTER")
if [ -n "$NEW_FILES" ]; then
  for FILE in $NEW_FILES; do
    rm -f "src/migrations/$FILE"
  done
  cp "$INDEX_COPY" src/migrations/index.ts
  drop_scratch
  echo "FAIL  in sync: the collection config has changes with no migration."
  echo "      Run 'pnpm --filter cms migrate:create <name>' and commit what it writes."
  exit 1
fi
echo "ok    in sync"

drop_scratch
echo "Migrations apply, roll back, re-apply and match the config."
