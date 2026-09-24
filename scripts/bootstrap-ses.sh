#!/usr/bin/env bash
set -euo pipefail

STACK_NAME="dilm-ses-identities"
REGION="ap-southeast-3"
TEMPLATE="$(dirname "$0")/../infra/bootstrap/ses-identities.yaml"
MAIL_FROM_SUBDOMAIN="mail"

usage() {
  cat <<'USAGE'
Creates the SES sending identities for the three tenant domains, then prints
the DNS records each domain needs and where verification stands.
Run once per AWS account, with human credentials. Safe to re-run.

  AWS_PROFILE=<profile> ./scripts/bootstrap-ses.sh            deploy, then print records + status
  AWS_PROFILE=<profile> ./scripts/bootstrap-ses.sh --status   print records + status only

Domains default to indonesianacids.com, duniakimia.com and likutelaga.com.
Override with INDOACID_DOMAIN, DUNIAKIMIA_DOMAIN or LIKUTELAGA_DOMAIN.

Add every printed record at the domain's DNS host. Records on Cloudflare must
be "DNS only" (grey cloud): a proxied DKIM CNAME never verifies. The DMARC
line is only printed for a domain that has no _dmarc record yet.
USAGE
}

MODE="deploy"
case "${1:-}" in
  -h | --help)
    usage
    exit 0
    ;;
  --status) MODE="status" ;;
  "") ;;
  *)
    usage >&2
    exit 1
    ;;
esac

INDOACID_DOMAIN="${INDOACID_DOMAIN:-indonesianacids.com}"
DUNIAKIMIA_DOMAIN="${DUNIAKIMIA_DOMAIN:-duniakimia.com}"
LIKUTELAGA_DOMAIN="${LIKUTELAGA_DOMAIN:-likutelaga.com}"

if [[ "$MODE" == "deploy" ]]; then
  aws cloudformation deploy \
    --region "$REGION" \
    --stack-name "$STACK_NAME" \
    --template-file "$TEMPLATE" \
    --no-fail-on-empty-changeset \
    --parameter-overrides \
      "IndoacidDomain=$INDOACID_DOMAIN" \
      "DuniakimiaDomain=$DUNIAKIMIA_DOMAIN" \
      "LikutelagaDomain=$LIKUTELAGA_DOMAIN" \
      "MailFromSubdomain=$MAIL_FROM_SUBDOMAIN"
fi

stack_output() {
  aws cloudformation describe-stacks \
    --region "$REGION" \
    --stack-name "$STACK_NAME" \
    --query "Stacks[0].Outputs[?OutputKey=='$1'].OutputValue" \
    --output text
}

has_dmarc() {
  command -v dig >/dev/null && dig +short TXT "_dmarc.$1" | grep -qi "v=DMARC1"
}

print_records() {
  local prefix="$1" domain="$2"
  echo
  echo "## $domain"
  for n in 1 2 3; do
    stack_output "${prefix}Dkim$n"
  done
  echo "$MAIL_FROM_SUBDOMAIN.$domain MX 10 feedback-smtp.$REGION.amazonses.com"
  echo "$MAIL_FROM_SUBDOMAIN.$domain TXT \"v=spf1 include:amazonses.com ~all\""
  if has_dmarc "$domain"; then
    echo "# _dmarc.$domain already exists, keep it."
  else
    echo "_dmarc.$domain TXT \"v=DMARC1; p=none; adkim=r; aspf=r\""
  fi
}

print_status() {
  local domain="$1"
  aws sesv2 get-email-identity \
    --region "$REGION" \
    --email-identity "$domain" \
    --query "[VerifiedForSendingStatus, DkimAttributes.Status, MailFromAttributes.MailFromDomainStatus]" \
    --output text |
    awk -v d="$domain" '{ printf "%-24s verified=%-6s dkim=%-18s mail-from=%s\n", d, $1, $2, $3 }'
}

echo
echo "DNS records to add (name, type, value):"
print_records Indoacid "$INDOACID_DOMAIN"
print_records Duniakimia "$DUNIAKIMIA_DOMAIN"
print_records Likutelaga "$LIKUTELAGA_DOMAIN"

echo
echo "Verification status:"
print_status "$INDOACID_DOMAIN"
print_status "$DUNIAKIMIA_DOMAIN"
print_status "$LIKUTELAGA_DOMAIN"

echo
echo "Account:"
aws sesv2 get-account \
  --region "$REGION" \
  --query "{ProductionAccess: ProductionAccessEnabled, SendingEnabled: SendingEnabled, Max24HourSend: SendQuota.Max24HourSend}" \
  --output table
