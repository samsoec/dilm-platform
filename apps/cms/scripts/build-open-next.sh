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

OpenNext leaves sharp out of the server function, but Next's Turbopack output
imports it through a hashed link under .next/node_modules, so the Lambda
failed on every page with "Cannot find package sharp-<hash>". After the build
the script installs sharp with its linux-arm64 binaries (the Lambda
architecture, whatever machine builds) where that link points. Needs npm and
network access to the registry.
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
pnpm exec open-next build

fn=.open-next/server-functions/default
link=$(find "$fn/apps/cms/.next/node_modules" -maxdepth 1 -name 'sharp-*' -type l | head -n 1)
if [[ -z "$link" ]]; then
  echo "No sharp link under $fn/apps/cms/.next/node_modules; nothing to add." >&2
  exit 0
fi
target="$(dirname "$link")/$(readlink "$link")"
sharp_manifest() {
  node -p "const f = require('path').join(require.resolve('sharp'), '../../package.json'); JSON.parse(require('fs').readFileSync(f, 'utf8'))$1"
}
sharp_version=$(sharp_manifest .version)
libvips_version=$(sharp_manifest ".optionalDependencies['@img/sharp-libvips-linux-arm64']")
staging=$(mktemp -d)
trap 'rm -rf "$staging"' EXIT
npm install --prefix "$staging" --no-save --no-package-lock --force --ignore-scripts --silent \
  "sharp@$sharp_version" \
  "@img/sharp-linux-arm64@$sharp_version" \
  "@img/sharp-libvips-linux-arm64@$libvips_version"
rm -rf "$target"
mkdir -p "$(dirname "$target")/@img"
cp -R "$staging/node_modules/sharp" "$target"
for pkg in colour sharp-linux-arm64 sharp-libvips-linux-arm64; do
  rm -rf "$(dirname "$target")/@img/$pkg"
  cp -R "$staging/node_modules/@img/$pkg" "$(dirname "$target")/@img/$pkg"
done
echo "Added sharp $sharp_version (linux-arm64) at ${target#"$fn"/}"
