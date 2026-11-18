#!/usr/bin/env bash
set -euo pipefail

STACK_NAME="dilm-budgets"
REGION="ap-southeast-3"
TEMPLATE="$(dirname "$0")/../infra/bootstrap/budgets.yaml"

usage() {
  cat <<'USAGE'
Creates the two AWS Budgets cost guardrails (Backend Spec §15): a forecast
alert at the monthly OPEX baseline and an actual-spend alert at the
pay-as-you-go ceiling, both excluding VAT.
Run once per AWS account, with human credentials. Safe to re-run.

  AWS_PROFILE=<profile> BUDGET_BASELINE_USD=<n> BUDGET_CEILING_USD=<n> \
    BUDGET_EMAIL=<address> ./scripts/bootstrap-budgets.sh

All three variables are required; the figures come from Backend Spec §15 and
are deliberately not stored in the repo. AWS Budgets is a global service: the
stack is created in ap-southeast-3 and no us-east-1 resource of ours exists.
USAGE
}

case "${1:-}" in
  -h | --help)
    usage
    exit 0
    ;;
  "") ;;
  *)
    usage >&2
    exit 1
    ;;
esac

for name in BUDGET_BASELINE_USD BUDGET_CEILING_USD BUDGET_EMAIL; do
  if [[ -z "${!name:-}" ]]; then
    echo "$name is required." >&2
    usage >&2
    exit 1
  fi
done

aws cloudformation deploy \
  --region "$REGION" \
  --stack-name "$STACK_NAME" \
  --template-file "$TEMPLATE" \
  --no-fail-on-empty-changeset \
  --parameter-overrides \
    "BaselineUsd=$BUDGET_BASELINE_USD" \
    "CeilingUsd=$BUDGET_CEILING_USD" \
    "AlertEmail=$BUDGET_EMAIL"
