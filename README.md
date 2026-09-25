# dilm-platform

Infrastructure and application monorepo for **DIL-WEB-2026** — the corporate web
platform for the three DIL Group tenants: `indonesianacids.com` (PT Indonesian Acids
Industry), `duniakimia.com` (PT Dunia Kimia Utama) and `likutelaga.com`
(PT Liku Telaga).

The source-of-truth specs (Backend Base Setup Spec, CMS Development Phase TRD,
Task Breakdown, Architecture Challenge Log) are client-confidential and are
**not** kept in this repository — ask James for access. This README and the
commit messages cite them by section, e.g. "Backend Spec §3.7". The spec's §3
"Locked Decisions" are decided and shouldn't be reopened without James.

## Prerequisites

| Tool    | Version                 | Notes                                              |
| ------- | ----------------------- | -------------------------------------------------- |
| Node.js | 20.20+                  | `.nvmrc` pins 20 — `nvm use`                       |
| pnpm    | 10.14+                  | `corepack enable` picks up the pinned version      |
| AWS CLI | v2                      | Credentials for the DIL AWS account                |
| SST     | 4.x (installed by pnpm) | This is the "SST v3 / ion" line the spec refers to |

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

## Local development stack

Payload and the web app run against local stand-ins for the AWS services, so
work can start on a laptop before any AWS infrastructure exists. You only need
Docker (Docker Desktop, OrbStack or Colima).

| Service   | Stands in for               | Address                                             |
| --------- | --------------------------- | --------------------------------------------------- |
| Postgres  | Aurora PostgreSQL 16        | `localhost:5432`, database `dilm`                   |
| MinIO     | S3 (both buckets)           | API `localhost:9000`, console http://localhost:9001 |
| Mailpit   | SES                         | SMTP `localhost:1025`, inbox http://localhost:8025  |
| ElasticMQ | SQS CV queue + DLQ (opt-in) | API `localhost:9324`, UI http://localhost:9325      |

**Start** (from the repo root):

```bash
cp .env.example .env          # first time only
docker compose up -d
```

Add `--profile queue` to also start ElasticMQ when you're working on the CV
queue. Stop with `docker compose down`; your data is kept.

**Reset** — wipe the database and every uploaded file, then start fresh:

```bash
docker compose --profile queue down -v
docker compose up -d
```

**Run the CMS** once Postgres is up:

```bash
pnpm --filter cms dev
```

Open http://localhost:3000/admin and create the first user. In development
Payload syncs the database schema from the collection config on start, so
there is nothing to migrate locally yet (migrations come with DILM-21).
Uploads are written to `apps/cms/media/` (gitignored) until the S3 adapter
lands in DILM-18.

Both `next` and the `payload` CLI read the repo-root `.env`: `next.config.ts`
loads it with `process.loadEnvFile`, and `pnpm --filter cms payload …` runs
the CLI under `node --env-file-if-exists`. After changing a collection,
regenerate the committed types and admin import map:

```bash
pnpm --filter cms generate:types
pnpm --filter cms generate:importmap
```

**Languages.** The CMS is configured for English and Indonesian, English by
default (Backend Spec §7.7), in `apps/cms/src/localization.ts`. A field only
gets a value per language once it is marked `localized: true`. The Postgres
adapter keeps the language list in a `_locales` enum type, so adding a third
language is a one-line config change plus the migration Payload generates
for it: a single `ALTER TYPE "_locales" ADD VALUE '<code>'` that leaves every
table and existing translation untouched. No content exists yet for any
language beyond the two.

**Seed tenants** once Postgres is up:

```bash
pnpm --filter cms seed:tenants
```

The three tenants (Backend Spec §7.1) are always created by this script,
never typed into the admin panel. Their slugs and domains come from
`TENANT_DOMAINS` in `packages/shared-types`, the same map the web app uses
to route a `Host` header to a tenant, so the two can't drift apart. The
script is safe to re-run: it creates missing tenants, resets any whose name,
domain or default language was edited by hand, and reports each one as
`created`, `updated` or `unchanged`. If it finds a tenant it didn't seed it
leaves it in place and exits non-zero, because deleting a tenant also
deletes every document that belongs to it.

**Tenant-scoped collections.** One Payload instance serves all three
tenants through `@payloadcms/plugin-multi-tenant`. A collection whose
documents belong to one tenant is wrapped when it is defined:

```ts
export const Posts = withTenantAccess({ slug: "posts", fields: [...] });
```

`withTenantAccess` (in `apps/cms/src/tenancy.ts`) marks the collection, and
`payload.config.ts` hands every marked collection to the plugin, which adds a
required `tenant` field, filters the admin list by the tenant picked in the
sidebar, and limits reads and writes to the user's own tenants. Options the
plugin accepts per collection, such as `{ isGlobal: true }` for one document
per tenant, go in the second argument. Until roles arrive with DILM-15 every
signed-in user can see every tenant.

How it lines up with AWS:

- **One `.env`, read by both sides.** Docker Compose reads `.env` for ports,
  credentials and bucket names, and `@dilm/runtime-config` reads the same
  file when `RUNTIME_CONFIG_SOURCE=env`. Application code calls
  `getRuntimeConfig()` and gets the same typed object locally and on AWS —
  only where the values come from changes. Every variable is explained in
  [`.env.example`](.env.example).
- **Same database shape.** Postgres runs major version 16 like Aurora, and the
  app connects as a non-superuser `payload_app` that owns the database, just as
  it will on AWS. The master `postgres` user is for admin work only.
- **Same connection pool.** `databasePoolOptions("cms" | "cv-consumer" |
"migrations")` returns the Backend Spec §8.2 pool sizes and timeouts, used
  unchanged in both environments. Payload 3.90.2's Postgres adapter keeps
  the client it checks out while connecting, which pins one connection
  forever and would stop Aurora from auto-pausing.
  `patches/@payloadcms__db-postgres@3.90.2.patch` backports the upstream fix
  (payloadcms/payload#17831, so far only released on the v4 line). Drop it
  when Payload is upgraded past a 3.x release that includes the fix.
- **Same bucket split.** `dilm-local-public` is anonymously readable (standing
  in for the Cloudflare path); `dilm-local-cv-private` has no public access.
- **Same CPU architecture.** Every container runs as `linux/arm64`, matching
  the Lambda runtime, so a `sharp` build for the wrong architecture fails on
  your laptop rather than in AWS. On an Intel/AMD machine without arm64
  emulation, set `DOCKER_PLATFORM=linux/amd64` in `.env`.

What the local stack **can't** reproduce, and is still verified on AWS
(staging): Aurora's ~15s resume from auto-pause and the auto-pause itself, TLS
against the RDS CA bundle, Lambda bundle size and cold start, and the SES
permission scoped to the three verified sender identities.

MinIO's official Docker images were discontinued in late 2025, so the stack
uses [`pgsty/minio`](https://hub.docker.com/r/pgsty/minio), a
community-maintained build of the same server, pinned to a fixed release.

## Code quality

One command per check, run from the repo root over every package:

```bash
pnpm lint          # eslint across the whole workspace
pnpm typecheck     # tsc --noEmit, strict
pnpm test          # vitest, one project per package
pnpm format        # prettier --write . (pnpm format:check in dry-run)
```

`pnpm install` installs a Husky `pre-commit` hook that runs `lint-staged`, so
staged files are linted with `--fix` and formatted before a commit is created.
CI runs the same `lint`, `typecheck` and `test` scripts on every PR.

## Stages

One AWS account holds all three stages, isolated by SST stage-prefixing
(`dilm-<stage>-<resource>`, e.g. `dilm-production-public`) rather than AWS
Organizations — Backend Spec §3.7.

| Stage        | Purpose                             | Deploy trigger                                                               |
| ------------ | ----------------------------------- | ---------------------------------------------------------------------------- |
| `dev`        | Personal/shared sandbox             | Feature branch, or manual `sst dev`                                          |
| `staging`    | Client review, pre-prod smoke tests | Merge to `main` (automatic)                                                  |
| `production` | Live traffic on the three domains   | Manual `workflow_dispatch` + approval on the `production` GitHub Environment |

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

## SES sending identities

Each tenant sends email from its own domain through SES (Backend Spec §3.5):

| Tenant       | Sender                        |
| ------------ | ----------------------------- |
| `indoacid`   | `noreply@indonesianacids.com` |
| `duniakimia` | `noreply@duniakimia.com`      |
| `likutelaga` | `noreply@likutelaga.com`      |

An SES domain identity exists once per AWS account and region, and all three
stages share one account, so the identities are created once by a bootstrap
stack rather than by `sst.config.ts`. Run it with human credentials:

```bash
AWS_PROFILE=<your-profile> ./scripts/bootstrap-ses.sh           # create, then print DNS records + status
AWS_PROFILE=<your-profile> ./scripts/bootstrap-ses.sh --status  # re-check after DNS changes
```

The template is [`infra/bootstrap/ses-identities.yaml`](infra/bootstrap/ses-identities.yaml).
It creates:

- **Three domain identities**, each signing with Easy DKIM (2048-bit).
- **A custom MAIL FROM domain, `mail.<domain>`**, so SPF passes and aligns
  for DMARC without editing the root domain's SPF record — which may already
  belong to the company's mailbox provider (`likutelaga.com` uses Microsoft
  365, for example).
- **The `dilm-transactional` configuration set**, the default for all three
  identities. It turns on reputation metrics, suppresses addresses that
  bounced or complained, and publishes send / delivery / bounce / complaint /
  reject counts to CloudWatch per sender domain. The sender-reputation alarm
  reads these metrics.

The identities are kept (`Retain`) if the stack is ever deleted, because
recreating them issues new DKIM keys and breaks the DNS records.

### After running the script

1. **Add the DNS records it prints** at each domain's DNS host — three DKIM
   `CNAME`s, one `MX` and one SPF `TXT` on `mail.<domain>`, and a DMARC `TXT`
   only where the domain has none yet (it starts at `p=none`; tighten it once
   reports look clean). On Cloudflare, set every one of them to **DNS only**
   (grey cloud). Verification usually takes minutes, and at most 72 hours;
   re-run with `--status` until every domain shows `verified=True`,
   `dkim=SUCCESS` and `mail-from=SUCCESS`.
2. **Request production access.** A new account is in the SES sandbox: it can
   only send to verified addresses, at most 200 a day. Request production
   access once the domains verify, from the SES console (Account dashboard →
   Request production access), or:

   ```bash
   aws sesv2 put-account-details --region ap-southeast-3 \
     --production-access-enabled --mail-type TRANSACTIONAL \
     --website-url https://indonesianacids.com \
     --use-case-description "Password resets and job-application notifications for three corporate sites. Bounces and complaints are suppressed automatically." \
     --contact-language EN
   ```

   AWS answers within about a day. `--status` shows `ProductionAccess: True`
   once it is granted.

3. **Confirm the pricing plan is à-la-carte** ($0.10 per 1,000 emails), not
   Essentials ($0.16 per 1,000). There is no CLI for this: check the SES
   console's Account dashboard.

## Layout

```
apps/web/               Public Next.js site (SSR/ISR, multi-tenant routing, i18n shell)
apps/cms/               Payload CMS — admin UI, REST/GraphQL, Local API, CV consumer
packages/shared-types/  Shared TS types, including the CV queue message contract
packages/runtime-config/ Cached Secrets Manager / SSM loader shared by all Lambdas, env vars locally
packages/config/        Shared tsconfig / eslint / tailwind base configs
infra/                  SST app — every AWS resource is defined here
scripts/                Ops scripts (tenant seeding, migrations, Cloudflare IP refresh)
compose.yaml, docker/   Local development stack (Postgres, MinIO, Mailpit, ElasticMQ)
```

Every workspace package is private and unpublished. `packages/shared-types` and
`packages/runtime-config` are consumed straight from TypeScript source
(`exports` points at `src/index.ts`), so there is no build step between them and
the apps. Their relative imports are extensionless (`./config`, not
`./config.js`) because Turbopack, which compiles them inside `apps/cms`, does
not map a `.js` specifier to its `.ts` source.

`packages/config` is the single home for the shared base configs:

| Config     | Imported as                                             | Consumed by                  |
| ---------- | ------------------------------------------------------- | ---------------------------- |
| TypeScript | `@dilm/config/tsconfig/base.json` (via `extends`)       | root, `apps/web`, `apps/cms` |
| ESLint     | `@dilm/config/eslint/base` (flat config)                | root, `apps/web`, `apps/cms` |
| Prettier   | `@dilm/config/prettier/base` (flat config)              | root                         |
| Tailwind   | `@dilm/config/tailwind/base.css` (Tailwind v4 `@theme`) | `apps/web`, `apps/cms`       |

`apps/web` and `apps/cms` are placeholders holding the wiring only — the real
Next.js and Payload applications land in their own tickets, as does
`infra/sst.config.ts`, currently an empty app with the stages and region wired
up.

## CI/CD

| Workflow                | Trigger         | Does                                                             |
| ----------------------- | --------------- | ---------------------------------------------------------------- |
| `ci.yml`                | PR → `main`     | Lint, typecheck, test, `sst diff --stage staging`                |
| `deploy-staging.yml`    | Push to `main`  | `sst deploy --stage staging`                                     |
| `deploy-production.yml` | Manual dispatch | `sst deploy --stage production`, behind the environment approval |

The Payload migration step is added with the app that needs it (Backend Spec
§13).
