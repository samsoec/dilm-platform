#!/bin/sh
set -eu

mc alias set local http://minio:9000 "$S3_ACCESS_KEY_ID" "$S3_SECRET_ACCESS_KEY"
mc mb --ignore-existing "local/$S3_PUBLIC_BUCKET" "local/$S3_PRIVATE_BUCKET"
mc anonymous set download "local/$S3_PUBLIC_BUCKET"
mc anonymous set none "local/$S3_PRIVATE_BUCKET"
