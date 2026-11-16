#!/bin/sh
set -eu

usage() {
  cat <<'USAGE'
Usage: scripts/wait-pr-checks.sh <pr-number>

Waits until every CI check on the pull request has finished, then prints one
line per check and exits 0 when all of them succeeded (or were skipped) and 1
when any failed. It replaces `gh pr checks --watch`, which hangs here, and
asking for the status again and again by hand.

Start it once and let it run: an agent should launch it in the background and
read the result when it exits, not poll it. It prints nothing while waiting.

Environment: WAIT_INTERVAL is the pause between looks in seconds (default
20), WAIT_TIMEOUT the longest it waits in seconds (default 1800, after which
it exits 2). Needs the GitHub CLI, signed in.
USAGE
}

case "${1:-}" in
  "" | -h | --help)
    usage
    [ -n "${1:-}" ] && exit 0
    exit 2
    ;;
esac

PR="$1"
INTERVAL="${WAIT_INTERVAL:-20}"
TIMEOUT="${WAIT_TIMEOUT:-1800}"
QUERY='.statusCheckRollup[] | [(.name // .context), (.status // "COMPLETED"), (.conclusion // .state // "")] | @tsv'
WAITED=0

while :; do
  ROWS=$(gh pr view "$PR" --json statusCheckRollup --jq "$QUERY")
  if [ -n "$ROWS" ] && ! printf '%s\n' "$ROWS" | awk -F '\t' '$2 != "COMPLETED" { found = 1 } END { exit !found }'; then
    break
  fi
  if [ "$WAITED" -ge "$TIMEOUT" ]; then
    echo "Checks on PR #$PR had not finished after ${TIMEOUT}s." >&2
    printf '%s\n' "$ROWS" >&2
    exit 2
  fi
  sleep "$INTERVAL"
  WAITED=$((WAITED + INTERVAL))
done

printf '%s\n' "$ROWS" | awk -F '\t' '{ printf "%-10s %s\n", $3, $1 }'
if printf '%s\n' "$ROWS" | awk -F '\t' '$3 != "SUCCESS" && $3 != "SKIPPED" && $3 != "NEUTRAL" { bad = 1 } END { exit !bad }'; then
  echo "PR #$PR: checks failed."
  exit 1
fi
echo "PR #$PR: all checks passed."
