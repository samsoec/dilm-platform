#!/usr/bin/env bash
usage() {
  cat <<'TEXT'
Usage: apps/web/scripts/test-e2e.sh [playwright args]

Builds the web app with the fixture content transport and runs the Playwright
smoke suite (Chromium only) against `next start`: three tenant hosts times two
locales, unknown host 404, security headers, revalidation endpoint guards and
axe. It needs no AWS credentials and no CMS. First run: install the browser
with `pnpm --filter @dilm/web exec playwright install chromium`.

The fixture transport must be set at build time as well as at start, because
pages render through the content client while building.
TEXT
}
if [[ "${1:-}" == "-h" || "${1:-}" == "--help" ]]; then usage; exit 0; fi
set -euo pipefail
cd "$(dirname "$0")/.."
export RUNTIME_CONFIG_SOURCE=env
export CMS_URL=http://fixture.invalid
export CONTENT_TRANSPORT=fixture
pnpm exec next build
pnpm exec playwright test "$@"
