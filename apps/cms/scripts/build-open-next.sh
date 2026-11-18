#!/usr/bin/env bash
usage() {
  cat <<'TEXT'
Usage: apps/cms/scripts/build-open-next.sh

Builds the Payload Lambda bundle at apps/cms/.open-next with OpenNext, for
infra/sst.config.ts to zip. Run it before `sst diff` and `sst deploy`.

next build loads the Payload config, which reads the runtime config, so the
script supplies inert placeholder values (source env, no real database, no
real secrets). Nothing is baked into the bundle: the deployed function leaves
RUNTIME_CONFIG_SOURCE unset and reads Secrets Manager and SSM.
TEXT
}
if [[ "${1:-}" == "-h" || "${1:-}" == "--help" ]]; then usage; exit 0; fi
set -euo pipefail
cd "$(dirname "$0")/.."
export RUNTIME_CONFIG_SOURCE=env
export DATABASE_AUTH=password DATABASE_HOST=localhost DATABASE_PORT=5432
export DATABASE_NAME=dilm DATABASE_USER=payload_app DATABASE_PASSWORD=build-only DATABASE_SSL=false
export PAYLOAD_SECRET=build-only-not-a-secret
export S3_PUBLIC_BUCKET=build-only-public S3_PRIVATE_BUCKET=build-only-private
exec pnpm exec open-next build
