# Handy kit changelog

What changed in `src/components/handy/`, newest first, for the apps that carry
a copy. `npm run kit -- pull` and `status` print every entry the app's copy
has not seen yet, together with its `Consumer action:` lines.

Format, which the CLI reads (`tools/kit/lib/changelog.mjs`):

- One `## <commit> — <summary>` heading per entry. `<commit>` is the brand-ux
  commit, or `unreleased` until someone stamps it. The summary identifies the
  entry, so keep it unique and don't reword it after release. Stamping the
  commit later doesn't announce the entry a second time.
- Any number of `Consumer action:` lines, each an instruction an app's AI can
  carry out on its own. An entry without one is information only.

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

- Consumer action: onboardingv4 only: `WifiConnectStages.vue` carries the original inline copy of this mark. Reduce it to `HSuccessMark`, so there is one implementation and not two that drift.

## b02c1bf — Connected indicator: a third state, connecting (HConnectedDot)

`HConnectedDot` takes `state="connected" | "connecting" | "offline"` and can be
pressable (`clickable`). The `live` boolean still works.

- Consumer action: An app that translates kit labels adds `connected` ("Connected"), `connecting` ("Connecting") and `offline` ("Offline").
- Consumer action: Where the app shows its own spinner beside the dot while pairing, drop the spinner and use `state="connecting"`. A hand-rolled "tap the dot to reconnect" affordance can become `clickable`.

## 8b909ff — HSectionCard marks expert controls

- Consumer action: An app that translates kit labels adds `expert` ("Expert").
