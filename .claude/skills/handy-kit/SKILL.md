---
name: handy-kit
description: The Handy component kit in src/components/handy/ is a read-only copy synced from brand-ux. Use this skill for anything that touches src/components/handy/, when a hook blocks an edit there or mentions the kit, when the session-start status says the copy is behind or locally edited, and whenever the app needs a kit change (a new prop, a fix, a style).
---

# The Handy kit (`src/components/handy/`)

This folder is a byte-exact copy of the kit in brand-ux
(github.com/poengAlex/brand-ux, branch `master`). `handy-kit.lock.json`, next
to `package.json`, records the brand-ux commit and a sha256 of every file.
brand-ux is the only source of the kit:

- **Never edit the copy.** That covers components, styles, `index.ts`,
  everything. A `PreToolUse` hook blocks Claude's edit tools in the folder;
  don't work around it with shell commands.
- **Never trim `index.ts`** or drop exports to avoid a dependency. Install the
  peer instead (`pull` lists them).
- **A local need goes upstream** as a prop, slot or option that every app
  gets. It never goes in as a patch to the copy.

The app's own code is free to change: its `app.scss` (below the kit's
`@use`), boot files, pages and components.

All commands run from the app's project root as `npm run kit -- <command>`.
Use them in this order of preference.

## 1. `status`: always first

```sh
npm run kit -- status
```

Reports whether the copy is in sync, behind brand-ux (kit files or the
tooling), or locally edited, plus any missing peer dependencies and the
changelog entries the copy hasn't seen. It compares with what the copy
follows: `master`, or the branch or local checkout it was last pulled from
(it says so). Exit codes: 0 in sync, 10 behind, 11 local edits, 12 both.
Offline isn't an error: it says it couldn't check, and only local edits
change the exit code. The same summary arrives at the start of every session
from the `SessionStart` hook, and its "Next:" line names the exact pull
command to run.

## 2. `pull`: take the latest kit

```sh
npm run kit -- pull
```

It replaces the whole folder with brand-ux `master` and rewrites the lock. It
also refreshes `scripts/handy-kit/`, this skill and the hooks, checks the peer
dependencies, and prints every changelog entry since the previous copy along
with its `Consumer action:` lines. It refuses (exit 11) if the copy has local
edits. Move those edits upstream (§3), or restore the files with git if they
were a mistake.

After a pull:

1. Carry out **every** `Consumer action:` line it printed, in the app's own
   code: `app.scss`, boot files, `quasar.config.ts`, i18n files, pages. If an
   action doesn't apply to this app, say why in the commit message.
2. Install any peer dependency it lists (`npm install <name>@"<range>"`).
3. Run the app's own checks (lint, typecheck, tests, build, and its UI checks
   if it has them).
4. Commit as `chore(kit): sync brand-ux <short sha>`, the sha from the pull
   output. Include `handy-kit.lock.json`, `scripts/handy-kit/`,
   `.claude/skills/handy-kit/` and any settings change in the commit.

`--ref <ref>` pulls another brand-ux branch or commit. `--from <path>` pulls
from a local brand-ux checkout, uncommitted files included (that's how §3
tests a change). A copy pulled that way keeps following that source, and a
plain `pull` then asks which you mean: the same `--ref`/`--from` again, or
`--ref master` to return to master.

## 3. `upstream`: when the app needs a kit change

```sh
npm run kit -- upstream start <slug>       # e.g. hbtn-tone
```

This creates a brand-ux worktree at `~/.cache/handy-kit/worktrees/<app>-<slug>`
on the branch `kit/<app>-<slug>` (from `origin/master`) and prints its path.

1. Claude Code can't edit outside this project until the path is added. Run
   `/add-dir <path>`, or add it to `permissions.additionalDirectories` in
   `.claude/settings.local.json`.
2. Make the change in `<path>/src/components/handy/`, written for every app
   that uses the kit, not just this one. Prefer a new prop or option with a
   default that keeps today's behaviour.
3. Add an entry at the top of `<path>/src/components/handy/CHANGELOG.md`:
   `## unreleased — <one-line summary>`, a short description, and a
   `Consumer action:` line for anything an app has to do when it takes the
   change.
4. Test it in this app: `npm run kit -- pull --from <path>`, then use it and
   run the app's checks. Don't commit the app against an unmerged kit. The
   app's commit waits for the merge and a normal `pull`.
5. Propose it: `npm run kit -- upstream finish <slug>`. It requires the new
   changelog entry (exit 21), runs brand-ux's gates in the worktree (exit 20;
   `npm run lint` there fixes formatting), and commits. **It doesn't push.**
   It prints the push command and a GitHub compare URL. Give both to the user,
   who pushes and opens the pull request.

Once the pull request is merged, run `npm run kit -- pull --ref master` to put
the app back on `master`.

## Files

| Path                          | What                                                                     |
| ----------------------------- | ------------------------------------------------------------------------ |
| `src/components/handy/`       | the kit copy (read-only); `CHANGELOG.md`, `kit.json`, `README.md` inside |
| `handy-kit.lock.json`         | source commit + file hashes; commit it                                   |
| `scripts/handy-kit/`          | bootstrap and hooks, refreshed by `pull`; don't edit                     |
| `.claude/skills/handy-kit/`   | this skill, refreshed by `pull`; don't edit                              |
| `~/.cache/handy-kit/brand-ux` | the cached brand-ux clone the bootstrap fetches                          |

The kit's own reference, including what a host has to provide, is
`src/components/handy/README.md`.
