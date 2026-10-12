# Handy kit changelog

What changed in `src/components/handy/`, newest first, for the apps that carry
a copy. `npm run kit -- pull` and `status` print every entry the app's copy
has not seen yet, together with its `Consumer action:` lines.

Format, which the CLI reads (`tools/kit/lib/changelog.mjs`):

- One `## <commit> — <summary>` heading per entry. `<commit>` is the brand-ux
  commit, or `unreleased` until someone stamps it. The summary identifies the
  entry, so keep it unique and don't reword it after release. Stamping the
  commit later doesn't announce the entry a second time. Since 2026-10-12 a
  commit is handy-playground's; the ones named before that are commits of the
  old poengAlex/brand-ux repository.
- Any number of `Consumer action:` lines, each an instruction an app's AI can
  carry out on its own. An entry without one is information only.

## unreleased — brand-ux moved into handy-playground, and the sync follows it

brand-ux is no longer its own repository: it is `projects/brand-ux` in
handy-playground (github.com/poengAlex/handy-playground, branch `main`), with
its history. The kit is unchanged; the tooling moved with it. An app in
handy-playground (scripter4, the classifier) now syncs from the checkout's
own `projects/brand-ux` with no network, and makes a kit change there in the
same commit as the apps that take it. An app elsewhere syncs from
handy-playground `main` through a partial clone in
`~/.cache/handy-kit/handy-playground`, and `upstream start` makes a sparse
worktree with only `projects/brand-ux` in it.

- Consumer action: The bootstrap an app has still asks the old repository, so pull once with the new CLI, from the app's root: `node ../brand-ux/tools/kit/cli.mjs pull` in handy-playground, `node <a handy-playground checkout>/projects/brand-ux/tools/kit/cli.mjs pull` elsewhere. That replaces the bootstrap, the hooks and the skill; commit them with the lock.
- Consumer action: Replace every link or path to the old brand-ux repository in the app's own docs (github.com/poengAlex/brand-ux, `~/code/test_projects/brand-ux`, "brand-ux master") with handy-playground's `projects/brand-ux` and `main`.

## unreleased — A click inside a drag-range band moves the nearer handle even when it wobbles

On `HLabeledSlider` with `drag-range`, a press inside the band only counted as
a click while it stayed within 4px. An ordinary tap moves further than that,
so a tap that lasted past the 120ms hold nudged the whole band one step
instead of moving the nearer handle. A tap that drifted downward was handed
back as a page scroll and did nothing. A press now counts as a click within
6px for a mouse and 12px for a finger, however long it lasts. A touch the
browser cancels no longer counts as a tap. The hold stays at 120ms. Nothing
changes for the host.

## unreleased — Slider cursors say what a press does: pointer on the track, grab on what can be grabbed

Quasar shows `grab` along the whole track of every editable slider and
range, but a press on the track (or on a plain range's band) moves the
nearer handle to that point, so nothing there is grabbed. The track now
shows `pointer` and the handles `grab`. `HLabeledSlider`'s `drag-range` band
shows `grab`, because a hold picks it up. Its own gestures (the band, and a
handle moved from inside the band) now put `grabbing` on the whole page
while they run, the same way Quasar's handle drag does. Disabled
(`not-allowed`) and readonly (default arrow) are unchanged. Nothing changes
for the host.

## unreleased — HPeekCarousel's wheel listener is passive, so Safari scrolls the page over it

Safari 27 won't scroll the page for a trackpad swipe that starts over an
element with a non-passive wheel listener, even one that never cancels
anything, so every carousel row blocked vertical scrolling under the pointer.
The listener is now passive and no longer cancels sideways swipes; the root's
`overflow-x: clip` already stops the page panning sideways. Nothing changes
for the host.

## unreleased — A dark-scheme browser paints dark before the app mounts, from scripter4

The dark tokens also apply under `@media (prefers-color-scheme: dark)` while
`<html>` has no `data-theme` yet, so the frame before `useHandyTheme` stamps
the attribute is no longer white for a dark-scheme visitor. Once the
attribute is stamped, `[data-theme="dark"]` alone decides, as before.

- Consumer action: If the app's `app.scss` has its own `prefers-color-scheme: dark` copy of the dark tokens, delete it; keep only app-specific variables in such a block.

## unreleased — useHandyTheme gains followSystem(), from scripter4

`followSystem()` forgets the stored theme choice and goes back to following
the OS, as on a first visit. scripter4's settings "reset to defaults" uses
it. Nothing to do for an app that doesn't need it.

## unreleased — Firmer light glass and a blurred drawer backdrop, from onboardingv4

`.glass-light` is `rgba(241, 244, 247, 0.94)` instead of 0.8, so a light bar
over a capped content column no longer shows the column's edge as a step.
`.q-drawer__backdrop` gets the dialogs' 4px blur. Both were onboardingv4's
own rules.

- Consumer action: If the app's `app.scss` re-declares `.glass-light` with the 0.94 background or blurs `.q-drawer__backdrop`, delete those rules; the kit has them now.

## unreleased — Kit-label resolvers must hand back the {label} and {value} slots, from scripter4

The kit fills `{label}` and `{value}` in after the resolver returns. A
vue-i18n `t("kit.increase")` called without them blanks the slot, so
"Increase {label}" was announced as "Increase ". The README's example
resolver did exactly that; it now passes the slots through.

- Consumer action: If the app's kit-label resolver calls vue-i18n's `t()` without the slots as named values (a bare `t(path)`, or `t(path, fallback)` as the old README example did), pass `{ label: "{label}", value: "{value}" }` so they survive (see README §15).

## unreleased — The kit is self-contained: global CSS, Quasar setup and build fixes moved into the folder

Everything an app used to copy out of brand-ux by hand now lives inside the
kit. That includes the global stylesheet (`styles/kit.scss`), the boot-time
Quasar setup (`install.ts`), the build fixes (`vite.ts`) and the peer list
(`kit.json`). Internal imports are relative, so the `@` alias is no longer
needed for the kit to build.

- Consumer action: In `src/css/app.scss`, replace the sections that now live in `styles/kit.scss` (tokens, CJK fallback, dark mode, `.section-dark`/`.section-light`, base, typography, annotation chip, toast skin, layout, glass, scrollbars, slider room, Quasar re-skins, motion) with `@use "../components/handy/styles/kit";` as the file's first rule. Before deleting a section, diff it against `styles/`. Anything the app changed or added is either app-specific (keep it below the `@use`) or an upstream candidate (report it and don't drop it silently).
- Consumer action: Replace the icon map, the `QSlider`/`QRange` prop defaults and the `Notify.setDefaults` position watcher in the app's boot files with one boot file that calls `installHandyKit({ labels })` from `src/components/handy/install`. `labels` is the app's kit-label resolver, if it has one. Keep everything else in those boot files.
- Consumer action: In `quasar.config.ts`, call `handyViteConfig(viteConf, { dev: ctx.dev })` (from `./src/components/handy/vite`) inside `build.extendViteConf`. Then remove what it replaces: the `/^uplot$/` alias, the `vue-i18n` `optimizeDeps.exclude` and `manualChunks` fix, and `vueOptionsAPI: true` (it now sets `__VUE_OPTIONS_API__` itself).
- Consumer action: Install every peer dependency that `npm run kit -- pull` reports as missing or out of range (the list is in `kit.json`).
- Consumer action: Add `"src/components/handy/"` to `ignorePatterns` in the app's formatter config (`oxfmt.config.ts`), with the comment "byte-exact mirror of brand-ux — reformatting means drift".

## unreleased — HPeekCarousel no longer leaks its page through document listeners

vue3-carousel (0.17 to 0.19) put `animationstart`/`animationend` listeners on
`document` and never removed them, so every unmounted carousel stayed
reachable. The carousel now sets `ignoreAnimations: true`. Nothing changes
for the host.

## b02c1bf — Help tip: a tap locks it, and the tip only speaks when locked

The foot of a help tip now appears only while the tip is locked, and touch
skips the hover preview.

- Consumer action: The kit-label keys `tipPin` and `tipClose` are gone. Remove them from any kit-label translations the app has. None of scripter4, onboardingv4 or handy-index translates them, so no rename is needed there.
- Consumer action: An app that translates kit labels adds `tipLocked` ("Locked — Esc or click outside to close") and `tipLockedTouch` ("Locked — tap outside to close").
- Consumer action: An app that calls `usePinnableTip` directly drops `overflows`/`measure`, which no longer exist. The composable gains `coarse` and `notePointer`.

## b02c1bf — One completion animation for the whole system (HSuccessMark)

`HSuccessMark` is the system's single "done" animation, and `HSuccessMoment`
draws it by default.

An app with its own drawn "done" mark should switch to `HSuccessMark`. (onboardingv4's `WifiConnectStages.vue`, where the mark came from, already uses it.)

## b02c1bf — Connected indicator: a third state, connecting (HConnectedDot)

`HConnectedDot` takes `state="connected" | "connecting" | "offline"` and can be
pressable (`clickable`). The `live` boolean still works.

- Consumer action: An app that translates kit labels adds `connected` ("Connected"), `connecting` ("Connecting") and `offline` ("Offline").
- Consumer action: Where the app shows its own spinner beside the dot while pairing, drop the spinner and use `state="connecting"`. A hand-rolled "tap the dot to reconnect" affordance can become `clickable`.

## 8b909ff — HSectionCard marks expert controls

- Consumer action: An app that translates kit labels adds `expert` ("Expert").
