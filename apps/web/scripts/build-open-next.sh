#!/usr/bin/env bash
usage() {
  cat <<'TEXT'
Usage: apps/web/scripts/build-open-next.sh

Builds the public web Lambda bundle at apps/web/.open-next with OpenNext, for
infra/sst.config.ts to zip. Run it before `sst diff` and `sst deploy`.

The build makes no call to the CMS and needs no secrets: the script supplies
inert placeholder values (source env, no real CMS URL). Nothing is baked into
the bundle; the deployed function reads its settings at runtime. The one
exception is NEXT_PUBLIC_MEDIA_BASE_URL (the public media origin), which the
browser image loader needs at build time; it passes through, empty by default.
TEXT
}
if [[ "${1:-}" == "-h" || "${1:-}" == "--help" ]]; then usage; exit 0; fi
set -euo pipefail
cd "$(dirname "$0")/.."
export RUNTIME_CONFIG_SOURCE=env
export CMS_URL=http://build-only.invalid
export NEXT_PUBLIC_MEDIA_BASE_URL="${NEXT_PUBLIC_MEDIA_BASE_URL:-}"
pnpm exec open-next build
