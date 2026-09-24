#!/usr/bin/env bash
set -euo pipefail

STACK_NAME="dilm-github-oidc"
REGION="ap-southeast-3"
TEMPLATE="$(dirname "$0")/../infra/bootstrap/github-oidc.yaml"

usage() {
  cat <<'USAGE'
Creates the GitHub Actions OIDC provider and the SST deploy roles.
Run once per AWS account, with human credentials.

  AWS_PROFILE=<profile> ./scripts/bootstrap-aws.sh [github-org] [github-repo]

Defaults: samsoec dilm-platform
USAGE
}

if [[ "${1:-}" == "-h" || "${1:-}" == "--help" ]]; then
  usage
  exit 0
fi

GITHUB_ORG="${1:-samsoec}"
GITHUB_REPO="${2:-dilm-platform}"

existing_provider() {
  aws iam list-open-id-connect-providers --region "$REGION" \
    --query "OpenIDConnectProviderList[?contains(Arn, 'token.actions.githubusercontent.com')]" \
    --output text | grep -q .
}

if existing_provider; then
  echo "Existing GitHub OIDC provider found, reusing it."
  CREATE_PROVIDER="false"
else
  CREATE_PROVIDER="true"
fi

aws cloudformation deploy \
  --region "$REGION" \
  --stack-name "$STACK_NAME" \
  --template-file "$TEMPLATE" \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameter-overrides \
    "GitHubOrg=$GITHUB_ORG" \
    "GitHubRepo=$GITHUB_REPO" \
    "CreateOidcProvider=$CREATE_PROVIDER"

echo
echo "Role ARNs, to set as GitHub Actions secrets:"
aws cloudformation describe-stacks \
  --region "$REGION" \
  --stack-name "$STACK_NAME" \
  --query "Stacks[0].Outputs[].[OutputKey,OutputValue]" \
  --output text
