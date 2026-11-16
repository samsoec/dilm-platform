#!/bin/sh
set -u

usage() {
  cat <<'USAGE'
Usage: scripts/verify.sh [test file or name filter ...]

With no arguments, runs the four checks CI runs, in order: prettier --check,
eslint, tsc and vitest over the whole workspace. With arguments, runs only
vitest on the given files or filters, which is the quick loop to use while
working on one area.

Output is kept short on purpose, so it is cheap to read for a person and for
an agent: one line per check ("ok" or "FAIL" with the time it took), and for
a failing check only the last lines of its output. The full output of every
check is kept in a log file whose path is printed next to the failure.

Every check runs even when an earlier one fails, so one run reports
everything that is wrong. Exits 0 when all pass and 1 otherwise.

Environment: VERIFY_TAIL sets how many lines of a failing check are shown
(default 40). VERIFY_LOG_DIR sets where the logs go (default a dilm-verify
folder under TMPDIR).
USAGE
}

case "${1:-}" in
  -h | --help)
    usage
    exit 0
    ;;
esac

cd "$(dirname "$0")/.."

LOG_DIR="${VERIFY_LOG_DIR:-${TMPDIR:-/tmp}/dilm-verify}"
TAIL_LINES="${VERIFY_TAIL:-40}"
mkdir -p "$LOG_DIR"
FAILED=0

run_check() {
  NAME="$1"
  shift
  LOG="$LOG_DIR/$NAME.log"
  START=$(date +%s)
  if NO_COLOR=1 FORCE_COLOR=0 CI=1 "$@" >"$LOG" 2>&1 </dev/null; then
    echo "ok    $NAME ($(($(date +%s) - START))s)"
  else
    FAILED=1
    echo "FAIL  $NAME ($(($(date +%s) - START))s), full output: $LOG"
    tail -n "$TAIL_LINES" "$LOG" | sed 's/^/      /'
  fi
}

if [ "$#" -gt 0 ]; then
  run_check test pnpm exec vitest run "$@"
else
  run_check format pnpm exec prettier --check .
  run_check lint pnpm lint
  run_check typecheck pnpm typecheck
  run_check test pnpm test
fi

exit "$FAILED"
