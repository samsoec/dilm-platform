# apps/cms

Notes for working in the Payload CMS. They exist so that nobody has to
rediscover them by reading old code: read this file once, then go straight to
the folder it names.

## Checking your work

```bash
scripts/verify.sh apps/cms/src/paths.test.ts   # one test file, while working
pnpm verify                                    # format, lint, typecheck, test: once, before committing
pnpm --filter cms check:migrations             # only after a schema change
pnpm --filter cms qa:shots --path /admin/collections/pages --name pages
```

- `pnpm verify` prints one line per check and only the end of a failing one.
  Do not run `pnpm lint`, `pnpm typecheck` and `pnpm test` separately on top
  of it, and do not re-run the whole suite after every edit: run the test file
  you are changing, and the whole thing once at the end. CI runs it again.
- `check:migrations` does apply, roll back, re-apply and the
  "nothing left to generate" check on its own scratch database. Never do that
  by hand, and never against the shared dev database `dilm`.
- Deploys run `sst deploy` before the migration, so new code is live on the
  old schema if a migration fails. Migrations must be expand-then-contract,
  compatible with the previous code version; drop or rename in a later release.
- `qa:shots` signs in as the three QA roles and saves screenshots per width
  and theme under the gitignored `docs/qa-shots/`. Open only the screenshots
  you need to judge a state; every image you open is paid for again on each
  later step.
- Run `prettier` from the repo root, never from `apps/cms`: the root
  `.prettierignore` protects migrations, `payload-types.ts` and `importMap.js`.

## Local environment

- Docker Desktop may be stopped: `open -a Docker`, `docker compose up -d`.
- Start the dev server as `pnpm --filter cms dev </dev/null`. Without that,
  Payload's schema push can stop on a hidden "data loss" question and every
  admin page hangs.
- Payload config changes (collections, views, translations) need a dev-server
  restart; hot reload keeps the old config.
- `pnpm --filter cms migrate:create <name> </dev/null` after any collection,
  global or field change; commit what it writes. With no changes it asks a
  question, hence `</dev/null`.
- `pnpm --filter cms migrate` against a database the dev server has pushed to
  stops on a question. On such a database set `PAYLOAD_MIGRATING=true` for
  scripts, or use a scratch database.
- `importMap.js` is rewritten by the dev server. Commit only the entries your
  change needs: compare with `git diff origin/main -- 'apps/cms/src/app/(payload)/admin/importMap.js'`
  before pushing and restore anything unrelated.
  `pnpm payload generate:importmap` can exit without writing; if so, call
  `generateImportMap(await config, { log: true, force: true })` from a
  temporary `payload run` script and delete the script.
- QA accounts `qa-super-claude`, `qa-editor-claude`, `qa-viewer-claude`
  (`@example.test`, editor and viewer belong to company 2) have their
  passwords in the gitignored root `.env`. Never print that file; `qa:shots`
  and `node --env-file=../../.env` read it for you.
- Sent email shows up in Mailpit at `localhost:8025`.

## Where the patterns live

| Need                                                    | Look at                                                     |
| ------------------------------------------------------- | ----------------------------------------------------------- |
| Badges, banner, confirm dialog, toast, popover          | `src/admin/components/kit`                                  |
| Publish status and reach of a document                  | `kit/publication.ts`, `kit/reach.ts`                        |
| A custom list screen (toolbar, cells, status tabs)      | `src/admin/components/ir`, `src/admin/components/lists`     |
| A custom collection view rendered through the list view | `src/admin/components/media` (grid), `components/pages`     |
| Empty states                                            | `lists/EmptyState.tsx`, `lists/emptyCopy.ts`                |
| Trash, restore, delete for good                         | `src/admin/components/trash`                                |
| Editor shell (header, tabs, sidebar, URL guard)         | `src/admin/components/editor`                               |
| Save and publish buttons, versions drawer               | `src/admin/components/document`, `ir/IrPublishControls.tsx` |
| Sidebar groups and nav                                  | `src/admin/navGroups.ts`, `src/admin/components/nav`        |
| Paths, slugs, routes, redirects                         | `src/paths.ts`, `pathCompute.ts`, `routeIndex.ts`           |
| Access rules and tenant scoping                         | `src/access.ts`, `src/tenancy.ts`                           |
| Seed data for a realistic site                          | `src/seed` (`seed:tenants`, `seed:layout`, `seed:pages`)    |
| Styles                                                  | `src/admin/styles`, one sheet per area, tokens only         |

## Rules the tests enforce

- Server code under `src/admin` that reads data passes
  `overrideAccess: false` and the signed-in user (`access-guard.test.ts`).
- Admin stylesheets never use `!important` (`theme.test.ts`). To beat an
  unlayered Payload rule, write an unlayered rule of your own instead.
- Tests run real code (the helper, validator or component), not a restated
  constant.

## Payload behaviours that cost time before

- Overriding a built-in field deep-merges and appends arrays: pass
  `options: []` first or the enum values double.
- Payload's client-side form validation skips publish-only rules on drafts,
  so gate publishing on the server-side rule.
- A form submit consumes the response body; fetch the document again for
  fresh values.
- The list route always turns on row selection; a custom list component only
  replaces the inner view, so hide the selection cells with scoped CSS.
- The document drawer sets its width inline; cap it with `max-width`.
- Payload rewrites the shared localization config in place: turn locale
  objects into strings before handing them to a client component.
- `DELETE /api/payload-preferences/:key` fails; reset a preference by posting
  a new value.
- Seeded names repeat across companies, so an isolation check must use a name
  that exists in one company only.
- In headless Chrome at 1440 wide the sidebar starts collapsed.
