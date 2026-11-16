---
name: epic-run
description: Run a list of DILM Jira tickets one after another with subagents - one dilm-executor per ticket, a fresh dilm-reviewer per pull request, merge when green and approved. Use when asked to execute an epic, an epic step or several tickets in sequence.
---

# Epic run

You are the coordinator. You do not write the code and you do not review it;
you hand out one ticket at a time, wait, and merge. The rules below exist
because an earlier run spent a week's usage in two days, and measuring it
showed where: one reviewer kept alive across 28 pull requests cost over a
third of the run, and agents waiting for CI or re-running checks cost most
of the rest.

## Once, before the first ticket

1. Fetch every ticket of the step from Jira and save each as
   `docs/epic-run/tickets/DILM-<n>.md` (gitignored). Agents read the file;
   they never call Jira. If Jira is unreachable, ask the user to paste the
   text.
2. Work out the order and the blockers. A blocker inside the CMS is done
   first as its own ticket; a blocker from another part of the project stops
   that ticket: report it and move on.
3. Tell the user the order and anything blocked, then start.

## Per ticket

1. **Implement.** Start a `dilm-executor` agent with: the ticket file path,
   which earlier pull requests it builds on, and "browser check: no" unless
   the user asked for one on this ticket. Keep the prompt short: the agent
   file and `apps/cms/CLAUDE.md` already hold the method and the patterns, so
   do not repeat them and do not paste the ticket.
2. **Wait for CI yourself.** Run `scripts/wait-pr-checks.sh <pr>` in the
   background, once. Do not poll, and never ask an agent to wait.
3. **Review.** Start a new `dilm-reviewer` agent with the PR number and the
   ticket file. A reviewer is used once: never send it a second pull request
   or a re-review, because it would carry every earlier review along.
   Start it while CI is still running.
4. **One fix round.** If the reviewer lists must-fix items or CI failed, send
   them to the executor of this ticket with SendMessage (its context is still
   warm), wait for CI again, then start a new `dilm-reviewer` with the earlier
   findings for a re-review. If must-fix items remain after that round, stop
   and ask the user; do not loop.
5. **Merge** with `gh pr merge <pr> --merge` once CI is green
   and the verdict is APPROVE. Never use `--admin`.
6. **Record** in `docs/epic-run/log.md`: ticket, PR, verdict, follow-ups from
   the reviewer, and the reviewer's "for a person to check" list.

If an executor hands back unfinished work, start a new `dilm-executor` on the
same branch with its notes; do not send the old one more work.

Split a ticket in two pull requests when it is plainly large (a whole new
screen with several states and roles): build the data and logic first, the
screen second.

## Do not

- Change a Jira status. Add a Jira comment only when the user asked for it.
- Run browser or design checks per ticket unless asked. They are batched: at
  the end of the step, give the user the collected "for a person to check"
  list, or run `pnpm --filter cms qa:shots` once over the screens of the step.
- Read diffs, screenshots or long logs yourself. Your context is re-read on
  every step of the whole run; keep to the agents' short reports.

## At the end of the step

Report per ticket: PR, merged or not, follow-ups, what the user should check
by hand. Suggest a new session for the next step, so this one's history is
not carried into it.
