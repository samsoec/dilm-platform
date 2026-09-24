# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

`dilm-platform` (DIL-WEB-2026): a pnpm monorepo for the corporate web platform
serving three DIL Group tenants from one deployment — `indoacid.com`,
`duniakimia.com`, `likutelaga.com`.

The repo is early: `infra/` is a real SST app with only stages and region wired
up. The workspace skeleton exists — `packages/config` (shared tsconfig/eslint/
tailwind bases), `packages/shared-types` (CV queue message contract),
`packages/runtime-config` and placeholder `apps/web` / `apps/cms` — but the
Next.js and Payload applications themselves are not scaffolded yet. `TODO(DILM…)`
markers in [infra/sst.config.ts](infra/sst.config.ts), the placeholder packages
and the workflows mark where that work lands.

## Commands

```bash
nvm use && corepack enable && pnpm install   # first run

pnpm typecheck                               # tsc --noEmit at the root
pnpm --filter @dilm/web lint                 # eslint, per app (no root lint yet)
pnpm --filter infra exec sst install --stage staging   # regenerate .sst/ types first — see below
pnpm diff --stage staging                    # preview infra changes
pnpm deploy:dev                              # sst deploy --stage dev
pnpm --filter infra dev                      # sst dev
```

ESLint is shared from `packages/config` and each app runs it; the root-level
`lint`/`test` commands, Prettier and Vitest arrive with DILM-28.

`.sst/` and `sst-env.d.ts` are gitignored, so `pnpm typecheck` fails on a fresh
checkout until `sst install` has generated `platform/config.d.ts` — that is why
CI runs the install step before typechecking.

## Hard constraints

- **Region is `ap-southeast-3` (Jakarta), always.** UU PDP data residency
  (Backend Spec §3.7). It is hardcoded in `sst.config.ts`, the bootstrap script
  and every workflow.
- **Always pass an explicit `--stage`.** `sst.config.ts` rejects any stage
  outside `dev | staging | production` on purpose: SST otherwise defaults to
  your local username and would strew resources through the shared account.
- **One AWS account holds all three stages**, isolated only by SST's
  `dilm-<stage>-<resource>` prefixing — not by AWS Organizations. `production`
  is `protect: true` and `removal: "retain"`; the other stages are disposable.
- **No long-lived AWS keys.** CI assumes `dilm-github-deploy` (or
  `dilm-github-deploy-production`, which trusts only the `production` GitHub
  Environment) through OIDC. Locally, use `AWS_PROFILE=dilm-spike` — the
  `credential_process` shim that lets SST read `aws login` console credentials.

## Where things live

- [infra/sst.config.ts](infra/sst.config.ts) — every AWS resource is defined
  here; app-level scripts only proxy `pnpm --filter infra`.
- [infra/bootstrap/github-oidc.yaml](infra/bootstrap/github-oidc.yaml) +
  [scripts/bootstrap-aws.sh](scripts/bootstrap-aws.sh) — CloudFormation for the
  OIDC provider and deploy roles. Run once per account, with human credentials.
  The script reads numeric GitHub org/repo ids because GitHub's `sub` claim is
  `repo:OWNER@ORG_ID/REPO@REPO_ID:…`, and it must never hand
  `CreateOidcProvider=false` to a stack that already owns the provider.
- [.github/workflows/](.github/workflows/) — `ci.yml` (PR: typecheck + diff),
  `deploy-staging.yml` (push to `main`), `deploy-production.yml` (manual
  dispatch behind the `production` environment approval).

## Task workflow

Every task follows these four steps, not just the code change itself.

1. **No comments in the code** beyond `TODO(…)` and genuinely
   can't-be-inferred notes. Rationale goes in commit messages, the README,
   CloudFormation `Description:` fields, shell `usage()` text and names.
2. **Validate the result against the task's criteria** before calling it done —
   run `pnpm typecheck`, `pnpm diff --stage staging`, the script itself, or
   whatever actually exercises the change. Report what was run and what it
   said; if something could not be verified, say so plainly.
3. **Open a pull request; never push to `main`.** Branch, commit, push the
   branch and open a PR with `gh pr create` so the change can be reviewed and
   merged by a human. `main` auto-deploys to staging, so a direct push skips
   review entirely.
4. **Explain the change in the chat reply, in plain language.** Walk through
   what was changed and why, in terms a beginner can follow — no unexplained
   jargon — then close with the "What you need to do" section.

## Conventions

- **The client specs are not in this repo.** `docs/` is gitignored and
  `dilm-platform` is public. Cite specs by section in prose and commit messages
  ("Backend Spec §3.7"); never paste their contents into tracked files. Spec §3
  "Locked Decisions" are settled — don't reopen them without James.
- **No explanatory code comments** beyond `TODO(…)` markers. Reasoning belongs
  in commit messages, the README, `usage()` text and names.
- Commit subjects are imperative sentence case, no type prefix; some carry a
  `DILM-<n>:` ticket prefix. Bodies explain the failure and the fix, wrapped at
  ~72 columns.
