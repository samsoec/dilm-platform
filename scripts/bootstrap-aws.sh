#!/usr/bin/env bash
# DILM-27 — one-time AWS bootstrap: GitHub OIDC provider + SST deploy roles.
# Run once per AWS account, with human credentials. Everything afterwards
# authenticates through OIDC.
#
#   AWS_PROFILE=<profile> ./scripts/bootstrap-aws.sh [github-org] [github-repo]
set -euo pipefail

STACK_NAME="dilm-github-oidc"
REGION="ap-southeast-3"
GITHUB_ORG="${1:-samsoec}"
GITHUB_REPO="${2:-dilm-platform}"
TEMPLATE="$(dirname "$0")/../infra/bootstrap/github-oidc.yaml"

# Only one token.actions.githubusercontent.com provider may exist per account.
if aws iam list-open-id-connect-providers --region "$REGION" \
  --query "OpenIDConnectProviderList[?contains(Arn, 'token.actions.githubusercontent.com')]" \
  --output text | grep -q .; then
  echo "Existing GitHub OIDC provider found — reusing it."
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
echo "Role ARNs — set these as GitHub Actions secrets:"
aws cloudformation describe-stacks \
  --region "$REGION" \
  --stack-name "$STACK_NAME" \
  --query "Stacks[0].Outputs[].[OutputKey,OutputValue]" \
  --output text
