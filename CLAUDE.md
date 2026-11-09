# Contribution workflow

Read README.md and its CLI examples before editing. These instructions apply
to the GitHub UI checkout, not the separate Sites checkout.

## On an edit request

1. Check branch, remotes, working tree and authentication. Identify canonical
   `dablank192/hrm-ess-ui`: normally origin for direct clones, upstream for forks.
   Verify remote URLs; never silently replace them.
2. Fetch canonical main before editing. If fetch fails, report the blocker and
   do not begin dependent edits or claim the baseline is current.
3. On clean main, update with fast-forward only, then create a descriptive feat/
   or fix/ branch before editing. Preserve divergent local main and ask how to
   reconcile; never reset it or publish unrelated commits automatically.
4. On an existing contribution branch, continue its work and PR. Fetch the push
   remote too. Merge changes from the tracked branch if it advanced, then merge
   canonical main when needed. Do not rebase published commits or force push.
   For an already merged/closed PR, start a new branch from canonical main when
   clean instead of reusing the old PR branch.
5. Never pull/merge over uncommitted work. Fetch safely and check whether the
   current branch contains the fetched main and tracked remote branch. If
   integration is needed, preserve the work and ask how to proceed before
   editing. Do not auto-stash, reset, discard or commit just to synchronize.
   If already current and edits belong to this request, continue safely; ask
   before touching unrelated work. If editing has already started on main,
   create a contribution branch preserving the working tree before continuing,
   provided no synchronization is pending.
6. Implement only the request, regenerate iframe markup when required, and
   validate per README.md. Report changes, checks and limitations. An edit
   request alone does not authorize commit, push or PR creation.

## On a push or contribution-flow request

The request authorizes commit, push and PR creation/update for those changes.
Complete the flow without asking for approval at each routine step.

1. Recheck branch, status and remotes. If changes are on main, create a contribution
   branch preserving them. Never commit/push directly to main in this member
   workflow, even with admin bypass. Review both commits relative to canonical
   main and file diffs; do not publish unrelated changes or commits.
2. Fetch again. If integration is needed with a dirty working tree, commit only
   the authorized changes on the contribution branch first, then integrate once
   clean. Stop if unrelated uncommitted work prevents safe integration. Merge
   the tracked remote branch and canonical main as needed. Resolve routine
   conflicts; ask about ambiguous business decisions.
3. Regenerate markup when needed, inspect the final diff and validate. For UI
   changes run the eight test groups and check affected UI; report unavailable
   browser verification. Documentation-only changes may skip runtime tests with
   an explanation. Fix failures in scope; do not weaken tests to hide them.
4. Stage explicit files, commit remaining authorized changes, and push the
   contribution branch to its writable remote. No blanket staging, force push
   or CI bypass. If checks cannot be fixed within scope, report the blocker.
5. Find an open PR for the same head repository/branch targeting canonical main.
   Update it rather than creating duplicates. Otherwise use gh pr create with
   explicit repo, base, head, title and body file. Use OWNER:BRANCH for forks.
   Describe actual changes, test results and limitations. Request dablank192's
   review. Keep maintainer edits enabled on forks when supported.
6. Follow source-checks and browser-smoke for the current PR revision. Fix
   in-scope failures on the same branch and push additional commits. Report
   missing permissions, tooling, CI approval or business decisions accurately.
7. Return the verified PR URL, branch/commit, tests, CI status and remaining
   review items. Never invent a PR URL or report pending CI as passed. If unable
   to open a PR, provide the pushed branch and manual PR steps. Do not approve
   your own PR, merge, deploy or sync to Sites/OneDrive.

## Boundaries

Keep changes small, plain HTML/CSS/JavaScript, feature folders, sample data and
direct index.html viewing. Never commit credentials, real personal data, Sites
configuration or agent session state. This root CLAUDE.md is the explicitly
authorized shared instruction exception; no other agent files are implied.

Tests, .github/, package.json, package-lock.json and CLAUDE.md belong to the
GitHub workflow and must not accompany UI-only transfers to Sites or OneDrive.
