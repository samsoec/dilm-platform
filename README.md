# dilm-platform

Infrastructure and application monorepo for **DIL-WEB-2026** — the corporate web
platform for the three DIL Group tenants: `indoacid.com` (PT Indonesian Acids
Industry), `duniakimia.com` (PT Dunia Kimia Utama) and `likutelaga.com`
(PT Liku Telaga).

The source-of-truth specs live in [`docs/`](docs/). Start with
[`DIL-WEB-2026-Backend-Base-Setup-Spec.md`](docs/DIL-WEB-2026-Backend-Base-Setup-Spec.md);
its §3 "Locked Decisions" are decided and shouldn't be reopened without James.

## Prerequisites

| Tool | Version | Notes |
|---|---|---|
| Node.js | 20.11+ | `.nvmrc` pins 20 — `nvm use` |
| pnpm | 10.14+ | `corepack enable` picks up the pinned version |
| AWS CLI | v2 | Credentials for the DIL AWS account |
| SST | 4.x (installed by pnpm) | This is the "SST v3 / ion" line the spec refers to |

All AWS resources live in **`ap-southeast-3` (Jakarta)**, no exceptions — UU PDP
data residency (Backend Spec §3.7).

## First run

```bash
nvm use
corepack enable
pnpm install
```

Deploying needs AWS credentials in your shell. Confirm you're on the right
account and region first:

```bash
aws sts get-caller-identity
aws configure get region   # must be ap-southeast-3
```

> **Local credentials gotcha.** If you sign in with `aws login` (AWS Management
> Console credentials), SST can't read those credentials directly. Use the
> `dilm-spike` profile in `~/.aws/config`, which shims them through
> `credential_process`, and export it before deploying:
>
> ```bash
> aws login                    # browser sign-in, refreshes the session
> export AWS_PROFILE=dilm-spike
> ```
>
> The profile must pin `--profile default` inside its `credential_process`, or
> it recurses on `AWS_PROFILE`. CI is unaffected — it gets credentials from
> OIDC as environment variables.

Then:

```bash
pnpm deploy:dev            # sst deploy --stage dev
pnpm diff --stage staging  # preview changes without applying them
```

`sst` defaults the stage to your local username, which this app rejects on
purpose — a typo'd stage would otherwise create a stray set of resources in the
shared account. **Always pass an explicit stage.**

## Stages

One AWS account holds all three stages, isolated by SST stage-prefixing
(`dilm-<stage>-<resource>`, e.g. `dilm-production-public`) rather than AWS
Organizations — Backend Spec §3.7.

| Stage | Purpose | Deploy trigger |
|---|---|---|
| `dev` | Personal/shared sandbox | Feature branch, or manual `sst dev` |
| `staging` | Client review, pre-prod smoke tests | Merge to `main` (automatic) |
| `production` | Live traffic on the three domains | Manual `workflow_dispatch` + approval on the `production` GitHub Environment |

`production` is deploy-protected and set to `retain` on removal; the other
stages are disposable.

## One-time AWS bootstrap

Creates the GitHub Actions OIDC identity provider and the two SST deploy roles.
Run once per AWS account, with human credentials — after this, **no long-lived
AWS access keys exist anywhere**.

```bash
AWS_PROFILE=<your-profile> ./scripts/bootstrap-aws.sh samsoec dilm-platform
```

It prints two role ARNs. Wire them up in GitHub:

- `AWS_DEPLOY_ROLE_ARN` (repository secret) → `dilm-github-deploy`, used by CI
  and the staging deploy.
- `AWS_DEPLOY_ROLE_ARN` (secret **inside** the `production` Environment) →
  `dilm-github-deploy-production`. That role only trusts the `production`
  environment, so the approval gate can't be bypassed by pushing a branch.

The template is [`infra/bootstrap/github-oidc.yaml`](infra/bootstrap/github-oidc.yaml).

## Layout

```
apps/web/     Public Next.js site (SSR/ISR, multi-tenant routing, i18n shell)
apps/cms/     Payload CMS — admin UI, REST/GraphQL, Local API, CV consumer
packages/     shared-types, runtime-config, config
infra/        SST app — every AWS resource is defined here
scripts/      Ops scripts (tenant seeding, migrations, Cloudflare IP refresh)
docs/         Source-of-truth project docs
```

`apps/`, `packages/` and the shared configs are scaffolded by the next Track 1
ticket; `infra/sst.config.ts` is currently an empty app with the stages and
region wired up.

## CI/CD

| Workflow | Trigger | Does |
|---|---|---|
| `ci.yml` | PR → `main` | Typecheck, `sst diff --stage staging` |
| `deploy-staging.yml` | Push to `main` | `sst deploy --stage staging` |
| `deploy-production.yml` | Manual dispatch | `sst deploy --stage production`, behind the environment approval |

Lint, tests and the Payload migration step are added with the apps that need
them (Backend Spec §13).
