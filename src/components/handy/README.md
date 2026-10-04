# The Handy component kit

`src/components/handy/` is the Handy design system as Vue 3 + Quasar 2
components: 40 single-file components, a canvas graph kit, a self-contained
gradient-background sub-kit, and the composables and helpers they share. It is
the implementation of `design.md` chapter 5, and it is the folder that other
Handy apps carry a copy of (scripter4, onboardingv4 and handy-index), kept in
sync with `npm run kit` (§1).

This README is the reference for the whole folder: what each component is for,
its full API, how it behaves, and what the host app has to supply for it to
work. The live reference is the app itself. `/components` shows every
component once, `/showcase/*` shows each family in depth, and `/design` shows
`design.md` with specimens between its sections.

> **Where something is marked _Known issue_**, it was verified against the
> code during the 2026-09-28 review. It describes today's behaviour, so check
> it before relying on it. Fix proposals are in `/downstream-suggestions.md`.

## Contents

1. [Using the kit in another project](#1-using-the-kit-in-another-project)
2. [Conventions every component follows](#2-conventions-every-component-follows)
3. [Component index](#3-component-index)
4. [Actions](#4-actions): HBtn · HBtnGroup · HHoldBtn
5. [Inputs & controls](#5-inputs--controls): HSegmented · HNumberStepper · HFatSlider · HLabeledSlider · HSliderMenu · HHelpTip
6. [Containers & surfaces](#6-containers--surfaces): HInfoCard · HSectionCard · HTextCard · HNavCard · HProductCard · HModal
7. [Lists & rows](#7-lists--rows): HList · HListRow · HRadioRow · HToggleRow
8. [Data display & visualization](#8-data-display--visualization): HTabularNum · HCircleProgress · HGraph · HPlayhead
9. [Feedback & status](#9-feedback--status): HFeedbackCard · HStatusBadge · HEmptyState · HSuccessMark · HSuccessMoment · HInlineDots · HandyLoader · toasts
10. [Navigation & chrome](#10-navigation--chrome): HDrawerItem · HThemeToggle
11. [Brand](#11-brand): HLogo · HConnectedDot · HConnectionKey · HChip · HIconTile · HFeaturePoint
12. [Content](#12-content): HPeekCarousel
13. [Background](#13-background-handybackground): HandyBackground and its parts
14. [Composables & utilities](#14-composables--utilities)
15. [Translating the kit (`labels.ts`)](#15-translating-the-kit-labelsts)
16. [Tests](#16-tests)
17. [Adding or changing a component](#17-adding-or-changing-a-component)

---

## 1. Using the kit in another project

The folder is self-contained. Everything a host needs from brand-ux lives
inside it: the components, the global CSS (`styles/`), the Quasar setup
(`install.ts`), the build fixes (`vite.ts`) and the list of peer dependencies
(`kit.json`). brand-ux `master` is the only source. An app takes the whole
folder, never a subset, never edits it, and syncs it with `npm run kit`
(below).

### Setting up a host

| Where                                                | What                                                                                                                        |
| ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `src/css/app.scss`, as its first rule                | `@use "../components/handy/styles/kit";` The app's own rules go below it.                                                   |
| a boot file, listed in `boot:`                       | `installHandyKit({ labels })` from `src/components/handy/install`. `labels` is optional (§15).                              |
| `quasar.config.ts`, `build.extendViteConf(viteConf)` | `handyViteConfig(viteConf, { dev: ctx.dev })` from `./src/components/handy/vite`                                            |
| `quasar.config.ts`, `framework` and `extras`         | `plugins` include `Notify` and `Dark`. `extras` include `material-symbols-outlined`, unless the app ships that font itself. |
| `src/css/quasar.variables.scss`                      | the brand values of Quasar's own variables: `$primary` = Brand Blue, the font family, `$generic-border-radius`              |
| `package.json`                                       | every peer in `kit.json` (`npm run kit -- pull` lists what is missing or out of range)                                      |

```ts
// src/boot/handy-kit.ts
import { defineBoot } from "#q-app";
import { installHandyKit } from "src/components/handy/install";

export default defineBoot(() => installHandyKit({ labels: myKitLabels }));
```

```ts
// quasar.config.ts
import { handyViteConfig } from "./src/components/handy/vite";

export default defineConfig(ctx => ({
  boot: ["i18n", "handy-kit"],
  css: ["app.scss"],
  build: {
    extendViteConf(viteConf) {
      handyViteConfig(viteConf, { dev: ctx.dev });
    }
  },
  framework: { plugins: ["Notify", "Dark"] }
}));
```

Internal imports are relative, so the folder builds wherever it sits and needs
no `@` alias. The sync tooling expects it at `src/components/handy/`.

### What the kit's setup contains

This is the checklist hosts used to copy by hand, and where each item lives
now:

| What                                                                                                       | In the kit                                                    | Without it                                                                                                |
| ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| **Semantic tokens**: `:root`, CJK font stacks, `[data-theme="dark"]`, `.section-dark`, `.section-light`    | `styles/_tokens.scss`                                         | colours, spacing, radii and shadows resolve to nothing                                                    |
| **Per-scope helper variables** `--h-chip-bg` and `--h-slider-gap`, declared in every scope                 | `styles/_tokens.scss`                                         | chips and the `?` hover lose their fill; slider handles and `HPlayhead` wear a wrong-coloured halo        |
| **Base**: page surface and type, links (`a:hover:not(.q-btn)`), `:focus-visible`, no sideways pan          | `styles/_base.scss`                                           | no focus ring, buttons that navigate grow an underline                                                    |
| **Type classes**: `.text-display` … `.text-caption`, `.prose`, `.text-*-token`, `.text-tabular`            | `styles/_typography.scss`                                     | titles, labels and captions fall back to Quasar's type scale                                              |
| **Toast classes** `.h-toast`, `.h-toast--*`, `.h-toast--dismissable`, `.h-toast__dismiss`                  | `styles/_toast.scss`                                          | `hToast()` shows Quasar's default coloured notification                                                   |
| **Layout**: `.h-container`, `.h-section`, glass, scrollbars, `.slider-thumb-room`                          | `styles/_layout.scss`                                         | pages lose their column and bands                                                                         |
| **Quasar re-skins**: buttons, fields, cards, tabs, chips, menus, dialogs, notifications, and the M3 slider | `styles/_quasar.scss`                                         | `HLabeledSlider`, `HFatSlider` and `HSliderMenu` look like stock Quasar and lose touch dragging on mobile |
| **Route transitions** and their reduced-motion block                                                       | `styles/_motion.scss`                                         | `route-forward`/`route-back`/`route-fade` do nothing                                                      |
| **Figtree**, self-hosted as `@fontsource-variable/figtree` (the family name is `'Figtree Variable'`)       | `styles/kit.scss`                                             | everything falls back to the system font                                                                  |
| **Slider prop defaults** (16px track, 40px thumb, bar-shaped `thumb-path`)                                 | `install.ts`                                                  | standard sliders render Quasar's round thumb (`HFatSlider` passes its own sizes and is unaffected)        |
| **Icon map** that rewrites plain names to `sym_o_…`                                                        | `install.ts` (`mapIconName`)                                  | every `icon="refresh"` in the kit renders as raw text or as the wrong icon set                            |
| **Toast position**: top-right on desktop, bottom on phones                                                 | `install.ts`                                                  | toasts appear wherever Quasar's default puts them                                                         |
| **Kit-label resolver**                                                                                     | `install.ts`, passing `labels` to `setKitLabelResolver` (§15) | the kit's own strings stay English                                                                        |
| **`HGraph` build fixes**                                                                                   | `vite.ts` (see [Build flags](#build-flags-hgraph))            | an empty chart with no error, `uPlot is not a constructor`, or a blank page                               |

Not in the kit: `quasar.variables.scss`, which Quasar injects into every style
block itself, so the kit's CSS never reads it; and brand-ux's showcase-only
rules (`.page-head`, `.page-lead`, the site backdrop), which stay in brand-ux's
`app.scss`.

### Peer dependencies and the barrel

`index.ts` re-exports everything, so importing from `@/components/handy`
pulls every peer dependency into the module graph. A missing `uplot` breaks
that import even in an app that never draws a graph. So a host **installs
every peer in `kit.json`** and keeps the barrel untouched. Importing single
files directly (`import HBtn from "@/components/handy/HBtn.vue"`) still works,
but it doesn't make a peer optional.

Never edit `index.ts` in a copy to drop exports. The next sync would replace
it anyway, and `pull` refuses to run over a copy that differs from its lock.

### Keeping a copy in sync (`npm run kit`)

Each app carries a small bootstrap and two Claude Code hooks in
`scripts/handy-kit/`, a `handy-kit` skill, a `kit` npm script, and
`handy-kit.lock.json`. The lock records the brand-ux commit and a sha256 of
every kit file, so a hash mismatch is a local edit. The CLI itself lives in
brand-ux (`tools/kit/`). The bootstrap keeps a clone of brand-ux in
`~/.cache/handy-kit/brand-ux` and runs the CLI from the brand-ux ref being
synced, so tooling changes reach apps the same way kit changes do.

| Command                                 | What it does                                                                                                                                                                                                                                                                           |
| --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run kit -- status`                 | In sync, behind, or locally edited? Also lists missing peers and changelog entries the copy hasn't seen. Exit 0 in sync, 10 behind, 11 local edits, 12 both. When offline it says so and exits 0. A `SessionStart` hook runs it at the start of every session.                         |
| `npm run kit -- pull`                   | Replaces the whole folder from brand-ux `master` (`--ref <ref>`, or `--from <checkout>`, uncommitted files included). Then writes the lock, refreshes the hooks and skill, checks peers, and prints the changelog entries with their `Consumer action:` lines. Refuses on local edits. |
| `npm run kit -- upstream start <slug>`  | Creates a brand-ux worktree on the branch `kit/<app>-<slug>` from `origin/master`, for making a kit change.                                                                                                                                                                            |
| `npm run kit -- upstream finish <slug>` | Requires a new `CHANGELOG.md` entry, runs brand-ux's gates in the worktree, commits, and prints the push command and the compare URL. It never pushes.                                                                                                                                 |

First-time setup in an app:

1. `node ~/code/test_projects/brand-ux/tools/kit/cli.mjs init` (bootstrap,
   hooks, skill and npm script; existing `.claude/settings.json` is merged).
2. Add `"src/components/handy/"` to the formatter's ignore list. A formatter
   whose settings differ (trailing commas, print width) rewrites the copy, and
   from then on every file looks edited.
3. `npm run kit -- pull`, then do what its `Consumer action:` lines say.

The rules, and what enforces them:

- **Never edit the copy.** A `PreToolUse` hook blocks Claude's edit tools in
  the folder. A change the app needs goes upstream: `upstream start`, edit in
  the worktree, test with `pull --from <worktree>`, `upstream finish`, then a
  pull request.
- **Every kit change gets a `CHANGELOG.md` entry** in this folder. Anything a
  host has to do goes on a `Consumer action:` line, which `pull` and `status`
  print for every copy that hasn't seen it.

### Build flags (`HGraph`)

`handyViteConfig` (`vite.ts`) applies all three. For reference:

- **The Options API.** `uplot-vue` is an Options-API component. Quasar's
  app-vite builds Vue with `__VUE_OPTIONS_API__ = false` unless
  `build.vueOptionsAPI` is set, which silently strips the wrapper's
  data, methods and mounted hook: you get an empty chart and no error.
  `handyViteConfig` sets the define itself (after Quasar has written its
  value, before `@vitejs/plugin-vue` reads it), so hosts no longer need
  `vueOptionsAPI: true`. Verified 2026-10-04 by rendering `/showcase/graphs`
  in a production build without it.
- **The `uplot` alias.** `uplot-vue` is a UMD bundle whose `require("uplot")`
  interop receives the ESM namespace instead of the uPlot class (`uPlot is not
a constructor`). The exact-match alias `/^uplot$/` →
  `uplot/dist/uPlot.cjs.js` fixes it, and leaves `uplot/dist/uPlot.min.css`
  alone.
- **The `vue-i18n` chunk split** (found in onboardingv4). With `uplot` in the
  dependency graph, a host that also uses `vue-i18n` can hit
  `init_runtime_dom_esm_bundler is not defined`: a blank page in production,
  or a boot `ReferenceError` in dev. Dev excludes `vue-i18n` from
  `optimizeDeps`. The production build keeps `vue`, `@vue/*`, `vue-i18n` and
  `@intlify/*` in one `vue-runtime` chunk. It is harmless in a host without
  `vue-i18n`.

In a plain Vite app (no Quasar) only the alias is needed. The Options API is
on by default there.

Symptom → cause: an empty chart with no console error means the Options API
is off. `uPlot is not a constructor` means the alias is missing.

---

## 2. Conventions every component follows

**API shape** (design.md 5.6, "API conventions"):

- Primary text is `label`, a secondary line is `caption`, a card heading is `title`.
- Semantic colour is `severity: "info" | "positive" | "warning" | "negative"`.
  Structural styles are `variant`, and `danger` is a button _variant_, not a severity.
- Anything navigational takes `to` (renders a router link) **and** emits `click`.
- Controls are `v-model` components (`modelValue` in, `update:modelValue` out).
  Row-wrapped controls own the whole-row tap and the double-fire guard.
- **Components emit, pages decide.** No component fires a toast, writes a
  store, or applies a zoom or an edit by itself. It reports, and the page acts.
- Sizes are `sm | md | lg` where there are discrete designs, and a number of px
  where the dimension is free.
- Colours come from tokens only. Labels on saturated fills use
  `--color-text-on-fill` / `--color-text-on-warning`.

**Theming.** Every component paints from CSS custom properties, so dark mode,
`.section-dark` islands on a light page and `.section-light` islands on a dark
page need no component code. Quasar's own `q-` internals are the exception.
They paint from `$q.dark`, so a `q-input` inside `.section-dark` still needs an
explicit `dark` prop. `useHandyTheme` keeps `data-theme` and `$q.dark` in step
for the page as a whole.

> **Known issue: the island scopes are incomplete.** `.section-dark` and
> `.section-light` do not re-bind `--color-text-error`, `--color-text-warning`,
> `--color-text-success`, `--color-stroke-error`, `--color-text-inverse`,
> `--color-bg-overlay` or `--color-bg-hero-dark`. Inside an island those tokens
> keep the page's values. A success badge in a `.section-dark` island on a
> light page measures 1.85:1 instead of 7.39:1, and a warning badge 2.06:1
> instead of 5.62:1. This affects `HStatusBadge`, the `HInfoCard` highlight, and
> field error text. The fix belongs in `styles/_tokens.scss`, not in the components.

**A link-rendering component never wears a link underline.** A component that
renders as an `<a>` (anything given `to` or `href`: `HBtn`, `HNavCard`,
`HDrawerItem`, `HListRow`, `HProductCard`) never shows an underline, at rest or
on hover. A host's global `a:hover { text-decoration: underline }` is (0,1,1)
and would otherwise beat both Quasar's `.q-btn` reset and any plain class
here, so each of those components carries its own
`text-decoration: none !important`. Keep it when you edit them: a button is
not a text link, and the underline reads as a different control. Only real
inline text links get one. (The kit's `styles/_base.scss` also guards the rule
at the source with `a:hover:not(.q-btn)`. The per-component guard is still what
protects a host whose stylesheet does not.)

**Motion.** Every component that animates carries its own
`prefers-reduced-motion` block, following design.md 5.8. Decorative motion
stops, and essential indicators (a spinner, a progress ring, a playhead during
playback) keep working. There is no global duration clamp, because one would
also stop the indicators.

**Class names.** Component classes use an `h-` prefix with BEM-style parts
(`h-lslider__value`). Two components break the pattern: `HHoldBtn` uses
`hold-btn`, and `HandyLoader` uses `handy-loader`. Several components also ship
unscoped (`<style lang="scss">`) blocks for dark-mode hover rules and for
popups that portal to `<body>`.

> **Known issue: `HSectionCard` shares its root class `h-section` with the
> global page-band class of the same name.** brand-ux's `app.scss` works around
> it with child combinators (see its "Site backdrop" block). Any host rule
> written for `.h-section` page bands also lands on every `HSectionCard`.
> onboardingv4's `handyverse.vue` already outlines both.

**Accessibility baseline.** There is a visible 2px focus ring on every
interactive element (a global `:focus-visible` in `styles/_base.scss`, or the
component's own). Icon-only buttons need an accessible name. Every string a
component renders by itself goes through a kit label (§15). Decorative
graphics are `aria-hidden`.

---

## 3. Component index

| Component                                         | Family     | What it is                                                              | Built on                    | Live reference               |
| ------------------------------------------------- | ---------- | ----------------------------------------------------------------------- | --------------------------- | ---------------------------- |
| [HBtn](#hbtn)                                     | Actions    | The button: primary / secondary / tertiary / danger, pill, sm–lg, round | `q-btn`                     | `/showcase/buttons`          |
| [HBtnGroup](#hbtngroup)                           | Actions    | Lays buttons out inline, equal 50/50, or stacked                        | —                           | `/showcase/buttons`          |
| [HHoldBtn](#hholdbtn)                             | Actions    | Tap for the light action, hold for the heavy one                        | `HBtn`                      | `/showcase/buttons`          |
| [HSegmented](#hsegmented)                         | Inputs     | 2–4 options with a sliding thumb                                        | native buttons              | `/showcase/forms`            |
| [HNumberStepper](#hnumberstepper)                 | Inputs     | −/value/+ with hold-to-repeat, optional typing                          | `q-btn`                     | `/showcase/forms`            |
| [HFatSlider](#hfatslider)                         | Inputs     | The 56px device slider (speed, depth, volume)                           | `q-slider`                  | `/showcase/forms`            |
| [HLabeledSlider](#hlabeledslider)                 | Inputs     | Slider or range with a label/value header, click-to-type                | `q-slider` / `q-range`      | `/showcase/forms`            |
| [HSliderMenu](#hslidermenu)                       | Inputs     | A labeled slider folded behind an icon + value chip                     | `q-menu` + `HLabeledSlider` | `/showcase/forms`            |
| [HHelpTip](#hhelptip)                             | Inputs     | The `?` beside a control's label: hover previews, click locks           | `q-menu`                    | `/showcase/help`             |
| [HInfoCard](#hinfocard)                           | Surfaces   | Key/value card with pills, badges, highlights, notes                    | —                           | `/showcase/data`             |
| [HSectionCard](#hsectioncard)                     | Surfaces   | Titled card with hint, `?`, "Expert" marker and one action              | `HHelpTip`                  | _none in brand-ux_           |
| [HTextCard](#htextcard)                           | Surfaces   | Long-form copy, optionally height-capped with an expand-to-modal        | `q-scroll-area`, `HModal`   | `/components`                |
| [HNavCard](#hnavcard)                             | Surfaces   | "Tap to go deeper" tile: icon chip, label, caption, chevron             | —                           | `/showcase/navigation`       |
| [HProductCard](#hproductcard)                     | Surfaces   | Product render, name, price, sale pill, rating                          | —                           | `/showcase/cards`            |
| [HModal](#hmodal)                                 | Surfaces   | The dialog card (goes inside `q-dialog`)                                | `q-btn`                     | `/showcase/overlays`         |
| [HList](#hlist)                                   | Lists      | The grouped-list card (one card, or one card per row)                   | `q-list`                    | `/showcase/page-anatomy`     |
| [HListRow](#hlistrow)                             | Lists      | The settings/menu row: leading, label, caption, trailing, chevron       | `q-item`                    | `/showcase/page-anatomy`     |
| [HRadioRow](#hradiorow)                           | Lists      | A whole-row radio option                                                | `HListRow` + `q-radio`      | `/showcase/forms`            |
| [HToggleRow](#htogglerow)                         | Lists      | A whole-row toggle setting                                              | `HListRow` + `q-toggle`     | `/showcase/forms`            |
| [HTabularNum](#htabularnum)                       | Data       | Tabular figures for live numbers                                        | —                           | `/showcase/data`             |
| [HCircleProgress](#hcircleprogress)               | Data       | Determinate ring / stat dial                                            | `q-circular-progress`       | `/showcase/data`             |
| [HGraph](#hgraph)                                 | Data       | Canvas chart: funscript timeline, 2D curves, editor                     | uPlot                       | `/showcase/graphs`           |
| [HPlayhead](#hplayhead)                           | Data       | Slider-handle playhead for strips that stand for time                   | —                           | `/showcase/graphs`           |
| [HFeedbackCard](#hfeedbackcard)                   | Feedback   | Inline alert / banner                                                   | `HBtn`                      | `/showcase/feedback`         |
| [HStatusBadge](#hstatusbadge)                     | Feedback   | Tinted semantic pill                                                    | —                           | `/showcase/data`             |
| [HEmptyState](#hemptystate)                       | Feedback   | "Nothing here yet" block with an action                                 | `HBtn`                      | `/showcase/feedback`         |
| [HSuccessMark](#hsuccessmark)                     | Feedback   | The one completion animation                                            | SVG                         | `/showcase/feedback`         |
| [HSuccessMoment](#hsuccessmoment)                 | Feedback   | Success screen: mark + title + sub-line                                 | `HSuccessMark`              | `/showcase/feedback`         |
| [HInlineDots](#hinlinedots)                       | Feedback   | Tier-1 loader: the pulsing "…" after a word                             | —                           | `/showcase/feedback`         |
| [HandyLoader](#handyloader)                       | Feedback   | Tier-3 branded "h" loader                                               | SVG (SMIL)                  | `/showcase/feedback`         |
| [HDrawerItem](#hdraweritem)                       | Navigation | Drawer / hamburger-panel row                                            | router-link / `a`           | `/showcase/navigation`       |
| [HThemeToggle](#hthemetoggle)                     | Navigation | The dark-mode icon button                                               | `HBtn`                      | every shell's nav            |
| [HLogo](#hlogo)                                   | Brand      | Every Handy and Handyverse lockup, in `currentColor`                    | inline SVG                  | `/showcase/identity`         |
| [HConnectedDot](#hconnecteddot)                   | Brand      | Connected / connecting / offline indicator, optionally a button         | `HBtn` (button mode)        | `/showcase/data`             |
| [HConnectionKey](#hconnectionkey)                 | Brand      | Colour-coded connection key with copy                                   | `q-btn`                     | `/showcase/data`             |
| [HChip](#hchip)                                   | Brand      | Annotation chip that never blends into its surface                      | —                           | `/showcase/cards`            |
| [HIconTile](#hicontile)                           | Brand      | Square launcher tile                                                    | `<button>`                  | `/showcase/cards`            |
| [HFeaturePoint](#hfeaturepoint)                   | Brand      | Icon above a short label (presentational)                               | —                           | `/showcase/cards`            |
| [HPeekCarousel](#hpeekcarousel)                   | Content    | Full-bleed, content-aligned card carousel with skeletons                | `vue3-carousel`             | `/showcase/carousel`         |
| [HandyBackground](#13-background-handybackground) | Background | Grainy, defocused gradient field behind a page (unratified)             | vue only                    | `/components`, `/playground` |

---

## 4. Actions

### HBtn

The button. Four variants, three sizes, pill shape, sentence case. Brand
voice lives in the surrounding copy, never in the button label.

```vue
<HBtn label="Continue" arrow />
<HBtn variant="secondary" label="Cancel" @click="close" />
<HBtn variant="tertiary" round icon="more_horiz" aria-label="More" />
<HBtn
  variant="danger"
  label="Delete account"
  :loading="deleting"
  @click="del"
/>
<HBtn label="Settings" to="/settings" />
```

| Prop      | Type                                                 | Default     | Notes                                                                                             |
| --------- | ---------------------------------------------------- | ----------- | ------------------------------------------------------------------------------------------------- |
| `variant` | `"primary" \| "secondary" \| "tertiary" \| "danger"` | `"primary"` | Primary = Brand Blue fill, secondary = 1px outline, tertiary = text only, danger = negative fill  |
| `size`    | `"sm" \| "md" \| "lg"`                               | `"md"`      | Padding `8/16`, `12/24`, `14/28` px. Type is 14px/143% at every size                              |
| `label`   | `string`                                             | `""`        | Rendered on one line, ellipsised, never wrapped (a label that truncates is copy that is too long) |
| `arrow`   | `boolean`                                            | `false`     | Trailing `→`, for hero and product-page primary CTAs only                                         |
| `round`   | `boolean`                                            | `false`     | Icon-only, equal-sided, fully round                                                               |

Everything else falls through to `q-btn`: `icon`, `icon-right`, `to`, `href`,
`target`, `type`, `loading`, `disable`, `aria-label` and `@click`. The default
slot renders before the label, and `#loading` is pre-filled with
`q-spinner-dots` (design.md's "inline three-dot spinner replaces the label").

Hover: primary darkens to `--color-action-primary-hover` (it lightens on
dark). The secondary border turns Brand Blue, danger dims with
`brightness(0.88)`, and tertiary text turns to the tertiary hover token. The
icon-to-label gap is `--space-xs` (8px), where Quasar ships 6px.

- **One primary per view.** Pair a primary with a secondary, never two primaries.
- An icon-only (`round`) button **must** have an `aria-label`.

> **Known issue: `size` does nothing on a `round` button.** `size` is `HBtn`'s
> own prop and is never forwarded to `q-btn`. Round buttons zero the padding it
> controls, so every round `HBtn` renders at Quasar's default ~42px. This also
> makes `HHoldBtn`'s `size` and `HConnectedDot`'s `buttonSize` inert, and
> `<HBtn round size="lg">` on `/showcase/buttons` looks the same as `sm`.
>
> **Known issue:** the `arrow` glyph is part of the label text, so screen
> readers announce "right arrow".

### HBtnGroup

Lays out a set of buttons in one of the three sanctioned arrangements.
The one-primary rule applies inside every layout.

```vue
<HBtnGroup layout="inline">
  <HBtn variant="tertiary" label="Cancel" />
  <HBtn label="Save" />
</HBtnGroup>
```

| Prop     | Type                             | Default    | Notes                                                                                                                                                                                                       |
| -------- | -------------------------------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `layout` | `"inline" \| "equal" \| "stack"` | `"inline"` | `inline`: right-aligned, wrapping row with the primary last (dialogs, card actions). `equal`: full-width 50/50 (confirmations). `stack`: full-width column with the strongest action on top (mobile sheets) |

Slot: default (the buttons). The gap is `--space-sm`.

### HHoldBtn

One button, two commitments: a tap fires the light action, and a press held
past `holdMs` (default 500 ms) fires the heavy one. While pressed, the icon
winds up one full turn timed to exactly the hold window. The rotation _is_ the
hold progress, and it's the whole affordance: anyone who presses the button
sees that pressing longer means something. Released early, it springs back.

The canonical use is refresh-vs-poll on a live-data card. The mechanic also
covers hold-to-confirm (`hold-only`), holding to arm a mode, and holding for
"apply-to-all". The component never owns state. It emits, and the caller
decides:

```vue
<!-- toggle case: v-model:active is all you need -->
<HHoldBtn
  v-model:active="polling"
  :busy="reading"
  icon="refresh"
  active-icon="autorenew"
  tap-hint="Tap to refresh"
  hold-hint="hold to poll every second"
  active-hint="Polling — hold to stop"
  @tap="readOnce"
/>

<!-- one-shot hold-to-confirm: no `active`, taps do nothing -->
<HHoldBtn
  hold-only
  variant="danger"
  :round="false"
  label="Hold to delete"
  icon="delete_forever"
  :hold-ms="1000"
  hold-hint="Hold for one second to delete"
  @hold="deleteThing"
/>
```

| Prop              | Type                                                 | Default      | Notes                                                                                       |
| ----------------- | ---------------------------------------------------- | ------------ | ------------------------------------------------------------------------------------------- |
| `icon`            | `string`                                             | `"refresh"`  | Resting icon (plain name, the icon map adds the prefix)                                     |
| `activeIcon`      | `string`                                             | `""`         | Icon while `active`, falling back to `icon`                                                 |
| `label`           | `string`                                             | `""`         | For labeled hold buttons (hold-to-confirm pills)                                            |
| `variant`         | `"primary" \| "secondary" \| "tertiary" \| "danger"` | `"tertiary"` | Passed to `HBtn`                                                                            |
| `size`            | `"sm" \| "md" \| "lg"`                               | `"sm"`       | Passed to `HBtn`. Inert while `round` (see HBtn)                                            |
| `round`           | `boolean`                                            | `true`       | Icon-only card action by default                                                            |
| `holdMs`          | `number`                                             | `500`        | Press duration that fires the hold, and the wind-up time                                    |
| `active`          | `boolean`                                            | _unbound_    | The hold-toggled state. **Binding it at all** marks the button as a toggle (`aria-pressed`) |
| `busy`            | `boolean`                                            | `false`      | The tap action is in flight (quick spin)                                                    |
| `disable`         | `boolean`                                            | `false`      | Turning it on mid-press defuses the armed hold                                              |
| `tapHint`         | `string`                                             | `""`         | "Tap to refresh"                                                                            |
| `holdHint`        | `string`                                             | `""`         | "hold to poll every second"                                                                 |
| `activeHint`      | `string`                                             | `""`         | Replaces both hints while active                                                            |
| `hint`            | `string`                                             | `""`         | Full override of the composed hint                                                          |
| `tooltip`         | `boolean`                                            | `true`       | `false` drops the built-in tooltip                                                          |
| `holdOnly`        | `boolean`                                            | `false`      | Taps do nothing, and the hold is the only action                                            |
| `windUp`          | `boolean`                                            | `true`       | The press rotation                                                                          |
| `spinWhileActive` | `boolean`                                            | `true`       | Slow spin while `active`                                                                    |
| `spinWhileBusy`   | `boolean`                                            | `true`       | Quick spin while `busy`                                                                     |
| `activeSpinMs`    | `number`                                             | `2400`       | One revolution of the active spin                                                           |
| `busySpinMs`      | `number`                                             | `700`        | One revolution of the busy spin                                                             |
| `activeColor`     | `string`                                             | `""`         | CSS colour for the active state (defaults to `--color-accent`)                              |

- **Events.** `@tap` (light), `@hold` (heavy), and `update:active` (`!active`
  on every completed hold). One gesture, one event: the trailing click after a
  completed hold is swallowed, a pointer that wanders off cancels the gesture,
  and the touch long-press context menu is suppressed.
- **Hints.** `tapHint` + `holdHint` compose the tooltip and aria-label, and
  `activeHint` replaces them while active. `hint` overrides everything, the
  `#tooltip` slot takes markup, and `:tooltip="false"` lets you bring your own.
  On a labeled button the hint is appended AFTER the visible label in the
  accessible name (WCAG 2.5.3). Give sibling instances distinct hints: five
  buttons named "Tap to refresh" read as one button to a screen reader.
- **Keyboard.** Space mirrors the pointer (its click fires on keyup, so holds
  work). Enter is always a tap. Blur cancels a hold in flight. The tooltip
  shows on hover only; keyboard and screen-reader users get the same text
  through the aria-label.
- Everything respects `prefers-reduced-motion`.

**Not for** actions that need a rapid tap-tap-tap (the wind-up reads as lag
there, so use a plain `HBtn`). Also not as the ONLY path to an essential
action: assistive-tech activation is an instantaneous click that can reach the
tap but never the hold (`aria-pressed` still reports the toggle state
truthfully). Pair the hold with a visible alternative, such as a menu item or
a settings row, when the heavy action matters.

---

## 5. Inputs & controls

### HSegmented

A segmented control: one choice out of two to four, all visible, switching
immediately. The chosen segment is a solid thumb _inside_ a pill-shaped
groove, and choosing another segment **slides** the thumb across. Use it where
a select would hide the options and a radio group would spend a column on
them. Past four options, or labels longer than a word or two, use a select.
When each option needs a caption, use radio rows.

```vue
<HSegmented
  v-model="unit"
  :options="[
    { label: 'm:ss', value: 'time' },
    { label: 'ms', value: 'ms' }
  ]"
  aria-label="Timeline unit"
/>

<!-- icon-only segments: give each an ariaLabel AND a tooltip slot -->
<HSegmented
  v-model="tool"
  size="xs"
  :options="[
    { icon: 'pan_tool', value: 'pan', ariaLabel: 'Pan', slot: 'pan' },
    { icon: 'edit', value: 'draw', ariaLabel: 'Draw', slot: 'draw' }
  ]"
>
  <template #pan><q-tooltip>Pan</q-tooltip></template>
  <template #draw><q-tooltip>Draw</q-tooltip></template>
</HSegmented>
```

| Prop         | Type                                    | Default     | Notes                                                                                              |
| ------------ | --------------------------------------- | ----------- | -------------------------------------------------------------------------------------------------- |
| `modelValue` | `T extends string \| number \| boolean` | required    | The chosen value                                                                                   |
| `options`    | `SegmentedOption<T>[]`                  | required    | See below                                                                                          |
| `spread`     | `boolean`                               | `false`     | Fill the row, segments sharing it equally                                                          |
| `size`       | `"xs" \| "sm" \| "md"`                  | `"md"`      | `md` standalone (34px), `sm` inside a row or toolbar (28px), `xs` icon strips over a canvas (22px) |
| `tone`       | `"primary" \| "warning"`                | `"primary"` | Warning **only** when the segments drive something already drawn in warning                        |
| `disable`    | `boolean`                               | `false`     | Dims to 0.7 and keeps the fill readable                                                            |

`SegmentedOption<V>`: `{ label?, icon?, value: V, ariaLabel?, slot?, disable? }`.
An icon-only option needs `ariaLabel`. `slot` names a slot rendered inside
that segment, which is the tooltip hook. The default slot is for out-of-flow
children, such as a `q-tooltip` over the whole control.

- **Keyboard.** It is a `radiogroup` with a roving tabindex, so the whole
  control is one tab stop. The arrow keys move the selection (wrapping and
  skipping disabled options) and focus follows. Pass `aria-label`; it lands on
  the group.
- **Styling hooks.** `--h-segmented-track` re-points the groove colour on a
  surface that already uses page-alt, and `--h-segmented-inset` sets the thumb
  inset.
- The thumb is one element moved with `transform` + `width`, re-measured by a
  `ResizeObserver`, and its transition is gated until after the first painted
  frame, so it never animates in from the left edge. Under reduced motion it
  still moves, just instantly.
- It is deliberately not a `q-btn-toggle`: design.md 5.12 records the four
  fights that caused the rewrite.

> **Known issue:** if `modelValue` matches no option, no segment has
> `tabindex="0"`, and the control cannot be reached by keyboard.

### HNumberStepper

Label on the left, `−` / value / `+` on the right. The buttons **disable at
the bounds** instead of clamping silently. Press and hold to repeat,
accelerating with the length of the hold, which is what lets `stepSize` be as
fine as the value deserves.

```vue
<HNumberStepper v-model="count" label="Repeats" :min="1" :max="99" />
<HNumberStepper
  v-model="offset"
  label="Offset"
  :min="-2000"
  :max="2000"
  :step-size="10"
  unit="ms"
  editable
/>
```

| Prop         | Type      | Default  | Notes                                                           |
| ------------ | --------- | -------- | --------------------------------------------------------------- |
| `modelValue` | `number`  | required |                                                                 |
| `label`      | `string`  | `""`     | Also used in the buttons' accessible names ("Increase Repeats") |
| `min`        | `number`  | `0`      |                                                                 |
| `max`        | `number`  | `100`    |                                                                 |
| `stepSize`   | `number`  | `1`      |                                                                 |
| `unit`       | `string`  | `""`     | Suffix on the readout ("%", "ms", " fps")                       |
| `editable`   | `boolean` | `false`  | Click the number to type it. **Off by default** (see below)     |
| `decimals`   | `number`  | `0`      | Decimal places a typed value accepts                            |

- **Hold behaviour.** The repeat starts after 400 ms. The interval eases from
  150 ms to 45 ms over the first second. After one second the increment
  doubles every 300 ms, capped at 1% of the range and always on the `stepSize`
  lattice, so a stepper fenced into a narrow range never accelerates.
  Enter/Space step once, and only the pointer holds.
- **Typing** is opt-in because the two buttons are the stepper's whole
  promise, and a text field summons a keyboard on touch. When on, the input is
  _masked_, not validated: digits, a leading minus, and one decimal separator
  when `decimals > 0`. Enter/blur commits and Esc cancels. The typed value
  snaps to the same lattice the buttons walk and is clamped to min/max.
- The readout is `HTabularNum` at h4/700 with a 48px minimum width, so digits
  don't jiggle.

> **Known issue: fractional steps show float noise.** `bump()` adds `stepSize`
> without rounding, so `:step-size="0.1"` reaches `0.30000000000000004` on the
> third tap, and the readout prints it verbatim. The model drifts too.
> `slider-format.ts` solves exactly this for the sliders but isn't used here.

### HFatSlider

The M3 "volume" slider the device lives on (speed, depth, volume): a 56px
track dragged by its whole body, horizontal or vertical (vertical fills from
the bottom). A 20px symbol sits inside the track at the fill's origin.

```vue
<HFatSlider v-model="speed" label="Speed" icon="speed" />
<HFatSlider
  v-model="volume"
  label="Volume"
  icon="volume_up"
  icon-off="volume_off"
  vertical
  height="240px"
/>
```

| Prop         | Type      | Default   | Notes                                                    |
| ------------ | --------- | --------- | -------------------------------------------------------- |
| `modelValue` | `number`  | required  |                                                          |
| `label`      | `string`  | required  | The accessible name. The control has no visible label    |
| `min`        | `number`  | `0`       |                                                          |
| `max`        | `number`  | `100`     |                                                          |
| `icon`       | `string`  | `""`      | The inset symbol                                         |
| `iconOff`    | `string`  | `""`      | Swapped in at exactly `min` (`volume_up` → `volume_off`) |
| `vertical`   | `boolean` | `false`   | Vertical, filling from the bottom                        |
| `height`     | `string`  | `"220px"` | Track length when vertical                               |

- **Icon colour follows what is behind it.** It stays white while the fill
  still covers the glyph's midpoint (34px from the origin, measured with a
  `ResizeObserver`), then drops to the secondary ink on the bare track. This
  is newer than design.md's "dims at zero" wording.
- At exactly 0% the handle-side corners are squared, so 0% reads like 100%.
- Press and keyboard focus slim the bar (vertically for the vertical variant).
- **Room for the handle is the parent's job.** The handle is 72px, fatter than
  the standard 40px, so a scrolling ancestor needs more than the usual 20px of
  room (see HLabeledSlider). Measure it rather than copying the number.

### HLabeledSlider

The settings slider: when the value matters more than the gesture, it lives
in a header above the track. The compact label sits on the left and the live
tabular number on the right. It takes a number for a single slider or
`{ min, max }` for a dual-handle range.

```vue
<HLabeledSlider v-model="depth" label="Stroke depth" unit="%" :reset="50" />
<HLabeledSlider
  v-model="zone"
  label="Stroke zone"
  :min="0"
  :max="110"
  unit="mm"
  drag-range
/>
<HLabeledSlider
  v-model="spanMs"
  label="View window"
  :min="250"
  :max="3600000"
  scale="log"
  :format-value="v => formatDuration(v)"
/>
<HLabeledSlider
  v-model="ramp"
  label="Ramp time"
  unit="ms"
  help="How long the device takes to reach the speed you asked for."
  help-detail="A longer ramp is gentler but slower to respond."
/>
```

| Prop                               | Type                                     | Default     | Notes                                                                                               |
| ---------------------------------- | ---------------------------------------- | ----------- | --------------------------------------------------------------------------------------------------- |
| `modelValue`                       | `number \| { min: number; max: number }` | required    | The shape picks single or range mode                                                                |
| `label`                            | `string`                                 | required    |                                                                                                     |
| `min` / `max`                      | `number`                                 | `0` / `100` |                                                                                                     |
| `step`                             | `number`                                 | `1`         | Ignored on a log track                                                                              |
| `unit`                             | `string`                                 | `""`        | Appended to the value ("%", "mm")                                                                   |
| `editable`                         | `boolean`                                | `true`      | Click-to-type. In range mode **each end** is its own affordance                                     |
| `unclamped`                        | `boolean`                                | `false`     | Typed values may pass min/max (the track pins, the readout keeps the real number)                   |
| `decimals`                         | `number`                                 | `0`         | Decimal places a typed value accepts, and the display precision                                     |
| `reset`                            | `number \| {min,max} \| undefined`       | —           | When set, the label becomes a same-looking button that snaps back to it                             |
| `dragRange`                        | `boolean`                                | `false`     | Range only: **hold** the band (120 ms) and it drags with both ends together                         |
| `scale`                            | `"linear" \| "log"`                      | `"linear"`  | Log spaces the handle by ratio. Single value with `min > 0` only, otherwise it falls back to linear |
| `formatValue`                      | `(value: number) => string`              | —           | Display override for a single value ("2m 30s"). Model and typing stay in the real unit              |
| `help` / `helpDetail` / `helpNote` | `string`                                 | `""`        | Renders an `HHelpTip` beside the label                                                              |
| `disable`                          | `boolean`                                | `false`     |                                                                                                     |

| Event               | Payload               | When                                                               |
| ------------------- | --------------------- | ------------------------------------------------------------------ |
| `update:modelValue` | `number \| {min,max}` | Every change: drag, keyboard, typed commit, label reset, band drag |
| `change`            | same                  | The track's commit: on release and per keyboard step               |
| `pan`               | `"start" \| "end"`    | A drag gesture began or ended                                      |

Slots: `#value` (replaces the whole value readout), `#value-prefix` (an
out-of-flow spot before the value for a spinner or badge, which never shifts
the header), and default (out-of-flow children such as a `q-tooltip`).

- **Typing** is masked, not validated. Only digits, a leading minus and (with
  `decimals`) one separator land. Enter/blur commits, rounded to `decimals` or
  snapped to `step`, then clamped unless `unclamped`. Esc cancels. In range
  mode the edited end stops at the other, so the handles never cross.
- **The band drags, on a hold.** Quasar's own `drag-range` claims the band on
  contact, which killed the ordinary "click to move the nearer handle" in the
  middle of the track. The kit's version takes the band only after a 120 ms
  hold. A click, or a drag that starts at once, still moves the nearer end. A
  touch that heads down the page is handed back to page scroll.
- **Log track**: 1,000 detents across the track. The ends are exact (the top
  reads `max`, not `max − ε`).
- **Display precision.** The header runs values through `formatSliderValue`,
  so float noise from unit conversions (`3.5000000000000004`) never shows. The
  model is untouched.
- **Room for the handle.** Quasar's handle is a 40px box centred on its
  position, so at either end it hangs 20px outside the control. Inside a
  scrolling ancestor that is 20px of horizontal scroll. The fix goes on the
  **scrolling element**: `padding-inline: 20px; margin-inline: -20px`
  (`styles/_layout.scss` ships it as `.slider-thumb-room`). `HModal` and `HSliderMenu`
  build it in. Never clip it, because `overflow-x: clip` slices the handle in
  half at 0 and 100.

> **Known issue: the track has no accessible name.** Quasar puts
> `role="slider"` on the `q-slider`/`q-range` root, and `HLabeledSlider` passes
> it no `aria-label`. The visible label is a sibling span, so screen readers
> announce an unnamed slider. `HFatSlider` does pass one. The fix is
> `:aria-label="label"` on both tracks.
>
> **Known issue: typed values and label resets don't emit `change`.** They
> emit `update:modelValue` only. A wrapper that commits to a device on `change`
> (the "smart slider" pattern the component is designed for) misses them.
>
> The in-code comment on `editable` says "single-value mode only". That is out
> of date, because range ends are editable too.

### HSliderMenu

A slider that costs one line of chrome instead of three: an icon, the live
value, a caret — and the whole labeled slider only once you ask for it.

For the knob a workspace needs _reachable_ but not _present_. A zoom level, a
row height, a gain: the value matters when you go looking for it and is noise
the rest of the time, so a permanently-open track spends a full row of a panel
on something touched twice a session.

```vue
<HSliderMenu
  v-model="viewSpanSeconds"
  label="View window"
  icon="zoom_in"
  :min="1"
  :max="120"
  unit="s"
  :reset="10"
  :presets="[2, 5, 10, 30, 60]"
/>
```

| Prop                                                                   | Type                                       | Default  | Notes                                                            |
| ---------------------------------------------------------------------- | ------------------------------------------ | -------- | ---------------------------------------------------------------- |
| `modelValue`                                                           | `number`                                   | required | Single value only                                                |
| `label`                                                                | `string`                                   | required | Names the slider in the menu and the button ("View window: 10s") |
| `icon`                                                                 | `string`                                   | `"tune"` |                                                                  |
| `min` / `max` / `step` / `unit` / `decimals` / `scale` / `formatValue` | as HLabeledSlider                          |          | Forwarded to the slider inside                                   |
| `reset`                                                                | `number \| undefined`                      | —        | Click the label in the menu to snap back                         |
| `presets`                                                              | `readonly (number \| { value; label? })[]` | `[]`     | One click each: picking one **commits and closes**               |
| `disable`                                                              | `boolean`                                  | `false`  | Disables the button                                              |

Events: `update:modelValue` and `change`. A preset click emits both, because
it is a finished choice.

It is `HLabeledSlider` inside a `q-menu`, not a second slider: the number is
still click-to-type, the label still resets, `change` still fires on release.
The presets are the addition: the two or three spans anyone actually wants,
one click each.

`format-value` overrides the button's text for a value whose useful form isn't
`${value}${unit}`. It is forwarded into the slider inside the menu too, so
the closed button and the open panel can never disagree about the value. Both
readouts otherwise go through the same filter (`slider-format.ts`), which
rounds the DISPLAY to the precision the control can hold: a value that has
round-tripped through another unit prints `3.5`, not `3.5000000000000004`.
`scale="log"` is passed straight through to the slider. The default slot drops
extra content into the menu under the presets (a hint line, a second control),
and a `#tooltip` slot takes a `q-tooltip` for the resting button.

The open state is visible on the button, because the menu can land anywhere
on screen. The panel sets `--h-slider-gap` to the card colour (the menu
portals to `<body>`) and pads for the handle's overhang, since the menu is the
scroll container.

**Not for** a slider someone drags repeatedly while watching the result — a
live mix, the fat sliders on the device page. A gesture behind a menu can't be
repeated quickly, and the menu covers the thing being watched. Those stay open
on the surface.

> **Known issue:** the button says `aria-haspopup="dialog"`, but Quasar renders
> the popup as `role="menu"` with no menu items in it. Passing `role="dialog"`
> to the `q-menu` overrides it (Quasar spreads attributes after its own role).

### HHelpTip

A "?" for one control, placed after that control's own label. Hover previews,
**click locks** — and locked it is a real element: scrollable, selectable,
dismissed by Esc, a click outside, or the ? again.

The lock is not a flourish. Quasar renders `q-tooltip` content with
`no-pointer-events`, and its position engine caps the tooltip's height at the
gap between the anchor and the window edge — so a tip longer than that gap
grows a scrollbar the mouse cannot touch, and would die on `mouseleave` even
if it could. The popup therefore has to be a `q-menu`, dressed to behave like
a tooltip until it is locked. `usePinnableTip` holds that logic and is
exported on its own for anything else needing the same two states.

**On a touch screen a tap goes straight to locked.** A phone has no hover, and
the one it emulates is a trap: `mouseenter` fires on tap while `mouseleave`
never fires at all, so a hover preview would open with nothing left to close
it. Hover is gated on `pointerType === "mouse"`; a finger skips the preview and
gets the scrollable sheet on first contact. The sheet is `min(340px, 100vw -
24px)` so it narrows rather than being shoved sideways near a screen edge, and
the 18px mark grows an invisible 32px hit area under `pointer: coarse`.

**Nothing announces the click.** The tip prints one line of its own and only
while it is locked — a hint about a state the reader is not in yet is a line
spent on the surface with the fewest to spare, whereas locked, the sheet
outlives the cursor and the way out is the part that stopped being guessable.
The line names the exits that exist: `tipLocked` mentions Esc for a cursor,
`tipLockedTouch` says "tap outside" for a fingertip.

```vue
<HHelpTip
  title="Ramp time"
  text="How long the device takes to reach the speed you asked for."
  detail="A longer ramp is gentler but slower to respond."
  note="Turn it down if changes feel like they land late."
/>
```

| Prop     | Type     | Default  | Notes                                                                            |
| -------- | -------- | -------- | -------------------------------------------------------------------------------- |
| `text`   | `string` | required | What the control is. One or two sentences                                        |
| `title`  | `string` | `""`     | Bold lead-in, normally the control's own label                                   |
| `detail` | `string` | `""`     | The trade the control makes (a second paragraph, skippable)                      |
| `note`   | `string` | `""`     | Set apart below a hairline: the symptom that should send someone to this control |
| `size`   | `string` | `"15px"` | Icon size inside the 18px mark                                                   |

`HLabeledSlider`, `HToggleRow` and `HSectionCard` take the same three parts as
`help` / `help-detail` / `help-note` props and render the ? in the right
place themselves — prefer those over placing an `HHelpTip` by hand.

**If the ? sits inside something clickable**, the click must not reach it:
the component already uses `@click.stop`, but a custom placement must do the
same, or pinning a tip also flips the setting it explains.

Every paragraph is mirrored onto the button's accessible name, because a
popup that only appears on hover reaches nobody navigating by keyboard.

Don't use it for a whole panel (panel help belongs at the panel heading), and
don't put a ? on a control whose consequence is obvious from its label.

> **Known issue:** the sheet is a `q-menu`, which Quasar renders as
> `role="menu"`, but it contains paragraphs rather than menu items.
> `role="dialog"` on the `q-menu` would describe it truthfully.

---

## 6. Containers & surfaces

All cards share design.md's card rules: the card token surface, 20px corners,
24px inner padding, 16px between stacked elements, flat by default, an h5
title with 16px beneath it, and inset hairlines only between grouped rows.

### HInfoCard

A titled list of key/value rows. It is the one way to present grouped
label/value data (device info, diagnostics).

```vue
<HInfoCard
  title="Device"
  :items="[
    { label: 'Firmware', value: '4.2.2', highlight: true },
    {
      label: 'Connected',
      bool: true,
      trueLabel: 'Connected',
      falseLabel: 'Offline'
    },
    { label: 'Charger fault', bool: false, error: true },
    { label: 'UID', value: 'a8f3…', tooltip: 'a8f3c2e1b7d94f06' },
    { label: 'Plan', badge: 'Pro', badgeColor: 'positive' }
  ]"
>
  <template #action>
    <HHoldBtn v-model:active="polling" tap-hint="Tap to refresh" hold-hint="hold to poll" @tap="read" />
  </template>
  <!-- default slot: renders ABOVE the list — gauges, stat dials -->
</HInfoCard>
```

Props: `title?: string` (default `""`) and `items: InfoItem[]` (required).

| `InfoItem` field           | Type                                                            | Renders                                                                                          |
| -------------------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `label`                    | `string`                                                        | The key (secondary, small). **Also the row's `:key`**, so keep labels unique                     |
| `value`                    | `string`                                                        | The value (body-compact, right-aligned)                                                          |
| `note`                     | `string`                                                        | A tertiary caption under the label ("Reading may be inaccurate")                                 |
| `tooltip`                  | `string`                                                        | The untruncated form of a long value, in monospace and wrapping                                  |
| `highlight`                | `boolean`                                                       | The value in the success text colour                                                             |
| `badge`                    | `string`                                                        | A filled pill                                                                                    |
| `badgeColor`               | `"primary" \| "positive" \| "negative" \| "warning" \| "muted"` | Pill colour (default `primary`)                                                                  |
| `bool`                     | `boolean`                                                       | A state pill: true is positive, true with `error` is negative, false is muted. Wins over `badge` |
| `trueLabel` / `falseLabel` | `string`                                                        | Pill text (defaults to the kit labels "Yes" / "No")                                              |
| `error`                    | `boolean`                                                       | The true state is a problem ("Charger fault")                                                    |

Slots: default (above the list) and `#action` (one control on the title row's
right edge, zero-height so it never grows the row). Booleans never render as
raw `true`/`false`.

> **Known issue: empty values don't become an em-dash.** design.md 5.6 says an
> empty value renders `—`, but the component renders whatever it is given.
> Callers currently pass `"—"` by hand (`/showcase/graphs` does).

### HSectionCard

The plain titled card a tool page repeats a dozen times: heading, optional
one-line hint, content. It exists because that shape was being rebuilt from a
bare `div` + `span` + `p` every time, and the parts that make such a card
legible were done differently on each one — or skipped.

```vue
<HSectionCard
  title="Reversal feel"
  hint="Direction changes drive against the motion rather than coasting."
  help="Every knob here changes what a turn sounds and feels like."
  help-detail="Lowering reverse power is the biggest lever for a quieter turn — at the cost of overtravel."
  help-note="Loud, knocking direction changes start here."
  expert
>
  <template #action><HBtn size="sm" variant="tertiary" label="Reset" /></template>
  …content…
</HSectionCard>
```

| Prop         | Type      | Default | Notes                                  |
| ------------ | --------- | ------- | -------------------------------------- |
| `title`      | `string`  | `""`    | h5                                     |
| `hint`       | `string`  | `""`    | Always-visible line under the title    |
| `help`       | `string`  | `""`    | Supplying it is what renders the `?`   |
| `helpTitle`  | `string`  | `""`    | Tooltip heading, defaulting to `title` |
| `helpDetail` | `string`  | `""`    | The trade-off paragraph                |
| `helpNote`   | `string`  | `""`    | The symptom that sends someone here    |
| `expert`     | `boolean` | `false` | An "Expert" pill: a label, not a gate  |

- **`help` is what renders the `?`.** Omit it and the header is just a title.
  The affordance lives in the header on purpose: a card whose explanation is
  in a tooltip needs it somewhere predictable, or nobody finds it.
- **`hint` vs `help`** — `hint` is the short line that is always visible;
  `help`/`helpDetail`/`helpNote` are the longer version behind the `?`, and map
  onto [HHelpTip](#hhelptip)'s three slots (what it is / the trade / the
  symptom that sends you here).
- **`expert`** marks a card to leave alone without a reason to touch it. It is
  a label, not a gate — hiding is the page's job.
- **`#action`** takes one control on the title row's right edge; the `?` stays
  next to the title.

Content is a slot, so it composes with anything: the card styles the surface
and the header and does not care what is inside. The card sets
`--h-slider-gap` to its own surface colour, so sliders inside it get the
right gap.

> **Known issues.** (1) Its root class `h-section` collides with the global
> page-band class (see §2). (2) The "Expert" label is resolved once at setup,
> so it does not follow a runtime language change. (3) Nothing in brand-ux
> renders it. It has no specimen on `/components` or `/showcase`, and it is
> only exercised downstream (onboardingv4 uses it).

### HTextCard

Long-form copy on a card: terms, care guides, release notes, lesson text.
Give it a `height` and the text scrolls inside the card, with the slim themed
scrollbar living inside the 20px radius. A pinned top-right button opens the
full text in an `HModal`. Omit `height` and the card grows naturally.

```vue
<HTextCard title="Terms" height="220px">
  <p>…</p>
  <p>…</p>
</HTextCard>
```

| Prop         | Type      | Default | Notes                                                |
| ------------ | --------- | ------- | ---------------------------------------------------- |
| `title`      | `string`  | `""`    | h5, scrolls away with the copy                       |
| `height`     | `string`  | `""`    | Any CSS length. Empty = natural height, no scrolling |
| `expandable` | `boolean` | `true`  | Allow the expand-to-modal button                     |

- The affordances are **automatic**. A `ResizeObserver` watches the content
  and the viewport, and the expand button renders only when the text actually
  overflows. It fades to 35% while the reader is scrolled in, and comes back on
  hover, focus, or at the top.
- `<p>` margins inside are normalised (16px between, none after the last).
- The scroll area uses the shared skin from `scroll.ts`.

> **Note:** the default slot is rendered twice, once in the card and once in
> the modal when it opens. Stateful content (a component with its own state)
> gets two independent instances.

### HNavCard

The standard "tap to go deeper" card: a 40px icon chip on the alt surface,
label and caption, and a trailing chevron. The whole surface is the target. It
lifts on hover with `--shadow-md` on light, and on dark with an inset hairline
(shadows don't read on dark).

```vue
<HNavCard
  icon="wifi"
  label="Wi-Fi"
  caption="Connected to Home"
  to="/settings/wifi"
/>
<HNavCard icon="bluetooth" label="Bluetooth" @click="openBle" />
```

| Prop      | Type     | Default  | Notes                                           |
| --------- | -------- | -------- | ----------------------------------------------- |
| `icon`    | `string` | required |                                                 |
| `label`   | `string` | required |                                                 |
| `caption` | `string` | `""`     |                                                 |
| `to`      | `string` | `""`     | Renders a `router-link`; otherwise a `<button>` |

Event: `click`.

> **Known issue:** in button mode the `<button>` has no `type="button"`, so
> inside a `<form>` it submits the form. It also carries a stray `to=""`
> attribute.

### HProductCard

The product card: an edge-to-edge 4:3 render on a Soft Gray well, name
(h5/500), price (h4/700) with a struck-through original price when on sale, a
Brand Blue sale pill top-left, and a star rating. It is **interactive only when
it goes somewhere**. With `to` (a router link) or a bound `@click` it gets the
pointer, the hover lift and Enter/Space activation. Otherwise it is a plain
display card with no tab stop. It fills its cell's height, so a row of cards
lines up.

```vue
<HProductCard
  name="The Handy 2 Pro"
  price="€249"
  old-price="€299"
  badge="Sale"
  :rating="4.6"
  :rating-count="15000"
  to="/products/handy-2-pro"
>
  <template #media><img src="/renders/pro.webp" alt="" /></template>
</HProductCard>
```

| Prop                               | Type     | Default  | Notes                                                                                   |
| ---------------------------------- | -------- | -------- | --------------------------------------------------------------------------------------- |
| `name`                             | `string` | required |                                                                                         |
| `price`                            | `string` | required | Pre-formatted                                                                           |
| `oldPrice`                         | `string` | `""`     | Struck through, tertiary                                                                |
| `badge`                            | `string` | `""`     | Sale pill                                                                               |
| `rating`                           | `number` | `0`      | 0 hides the rating row. Stars are rounded to whole                                      |
| `ratingCount`                      | `number` | `0`      |                                                                                         |
| `ratingLabel` / `ratingCountLabel` | `string` | `""`     | Pre-formatted text. Without them the count uses the **browser's** locale, not the app's |
| `to`                               | `string` | `""`     |                                                                                         |

Slots: `#media` (replaces the placeholder device render) and default (extra
body content under the rating).

> **Known issue:** the placeholder render uses a hard-coded SVG gradient id
> (`id="sheen"`). With several cards on one page the id is duplicated, and
> every card's sheen resolves to the first card's gradient. It disappears if
> that card is removed or hidden. Vue 3.5's `useId()` fixes it.

### HModal

The dialog **card**, to be used inside `q-dialog` (which owns the backdrop,
the focus trap and Esc): 20px radius, 560px max, generous padding, an optional
round close button top-right, and actions right-aligned. Separation is by
spacing, never by lines.

```vue
<q-dialog v-model="open" aria-label="Delete your account?">
  <HModal title="Delete your account?" closable>
    This wipes everything. There's no undo.
    <template #actions>
      <HBtn variant="tertiary" label="Cancel" @click="open = false" />
      <HBtn variant="danger" label="Delete account" @click="del" />
    </template>
  </HModal>
</q-dialog>
```

| Prop       | Type      | Default | Notes                                                  |
| ---------- | --------- | ------- | ------------------------------------------------------ |
| `title`    | `string`  | `""`    | Rendered as an `h3` in the h4 type style               |
| `closable` | `boolean` | `false` | Round × top-right (`v-close-popup`, and emits `close`) |

Slots: default (the body) and `#actions`. Event: `close`.

- **Tall content scrolls inside the body, not the card.** The card is capped
  at `100dvh − 64px`, so the title and the actions stay pinned and the
  confirming action can never scroll out of sight.
- The body reserves room for a slider handle's overhang, and the card sets
  `--h-slider-gap` to the card colour, so a slider inside a modal never grows a
  horizontal scrollbar or a page-coloured halo.

> **Known issue:** the title is not wired up as the dialog's accessible name.
> Quasar puts `role="dialog"` on its inner element and forwards `q-dialog`'s
> attributes there, so give the `q-dialog` an `aria-label` (as above).

---

## 7. Lists & rows

There is exactly one row pattern in the system. `HListRow` is it, and
`HRadioRow` and `HToggleRow` are `HListRow` with a control wired in. Group the
rows in an `HList`.

### HList

The grouped-list card. By default it is one card with inset hairlines between
adjacent rows. `separated` gives each row its own 56px card with an 8px gap and
no dividers.

```vue
<HList title="Connection">
  <HListRow label="Wi-Fi" caption="Home" chevron to="/wifi" />
  <HToggleRow v-model="ble" label="Bluetooth" />
</HList>
```

| Prop        | Type      | Default | Notes                    |
| ----------- | --------- | ------- | ------------------------ |
| `title`     | `string`  | `""`    | h5, with 24px side inset |
| `separated` | `boolean` | `false` | One card per row         |

Slot: default (rows). The hairline is drawn on each lower row's top edge,
inset to the 24px content margin, so it never runs through the rounded
corners.

### HListRow

The canonical settings/menu row: 52px minimum height, a hover tint
(`--color-row-hover`, a faint Brand Blue, so the row never vanishes into a
Soft Gray surface), and the whole row as the tap target, with a ripple.

```vue
<HListRow
  label="Language"
  caption="English"
  icon="language"
  chevron
  @click="openLang"
/>
<HListRow label="Firmware" :clickable="false">
  <template #trailing><HStatusBadge severity="positive" label="Up to date" /></template>
</HListRow>
```

| Prop        | Type      | Default  | Notes                                                     |
| ----------- | --------- | -------- | --------------------------------------------------------- |
| `label`     | `string`  | required |                                                           |
| `caption`   | `string`  | `""`     | Secondary line (body-sm)                                  |
| `icon`      | `string`  | `""`     | Leading 24px icon (ignored when `#leading` is used)       |
| `chevron`   | `boolean` | `false`  | Trailing chevron: promises the forward page transition    |
| `clickable` | `boolean` | `true`   | `false` makes a read-only row with no hover and no ripple |
| `active`    | `boolean` | `false`  | Label in the link colour                                  |
| `to`        | `string`  | `""`     | Renders the row as a router link                          |

Event: `click` (only when clickable or linked).

| Slot        | Takes                                                                                         |
| ----------- | --------------------------------------------------------------------------------------------- |
| `#leading`  | A radio or other leading control (replaces `icon`)                                            |
| `#suffix`   | Something beside the label: a pill or a `?`                                                   |
| `#below`    | Supplementary content under the caption (a spec line, chips). The row grows, so keep it quiet |
| `#trailing` | A toggle, value or badge (replaces the chevron)                                               |
| default     | Out-of-flow children only, such as a `q-tooltip` over the whole row                           |

> **Accessibility note:** a clickable `q-item` is a focusable element with
> `role="listitem"`, not a button, so screen readers don't announce it as
> actionable. In `HRadioRow` and `HToggleRow` the inner control is a second tab
> stop nested inside the first.

### HRadioRow

One option of a single choice, as a whole-row radio: the control leads, the
whole row selects, and an optional outlined "Recommended" pill rides the
label. The pill is informational, so it is never Brand Blue. Put all the
options of one choice in one `HList`.

```vue
<HList>
  <HRadioRow v-model="boot" val="normal" label="Normal" caption="Starts the app" recommended />
  <HRadioRow v-model="boot" val="safe" label="Safe mode" caption="Skips the scripts" />
</HList>
```

| Prop          | Type                         | Default  | Notes                       |
| ------------- | ---------------------------- | -------- | --------------------------- |
| `modelValue`  | `T extends string \| number` | required | The group's current value   |
| `val`         | `T`                          | required | This option's value         |
| `label`       | `string`                     | required |                             |
| `caption`     | `string`                     | `""`     |                             |
| `icon`        | `string`                     | `""`     |                             |
| `recommended` | `boolean`                    | `false`  | The kit label "Recommended" |

Event: `update:modelValue`.

### HToggleRow

An independent on/off setting as a whole row: the switch trails, and a tap
anywhere on the row flips it. A direct tap on the switch is stopped so it
can't double-flip. Prefer a toggle over a checkbox everywhere (the system has
no checkboxes).

```vue
<HToggleRow
  v-model="autoUpdate"
  label="Automatic updates"
  caption="Installs overnight"
  help="Updates install while the device is charging."
/>
<HToggleRow
  v-model="beta"
  label="Beta firmware"
  disable
  tooltip="Only available on Handy 2 Pro"
/>
```

| Prop                               | Type      | Default  | Notes                                                                                              |
| ---------------------------------- | --------- | -------- | -------------------------------------------------------------------------------------------------- |
| `modelValue`                       | `boolean` | required |                                                                                                    |
| `label`                            | `string`  | required |                                                                                                    |
| `caption` / `icon`                 | `string`  | `""`     |                                                                                                    |
| `disable`                          | `boolean` | `false`  | The switch greys out and the row stops taking the click. **Say why** in the caption or the tooltip |
| `tooltip`                          | `string`  | `""`     | A one-line explanation on hover, for a single-line row                                             |
| `help` / `helpDetail` / `helpNote` | `string`  | `""`     | Renders an `HHelpTip` beside the label                                                             |

Event: `update:modelValue`.

---

## 8. Data display & visualization

### HTabularNum

Tabular figures for any number that updates live (speed, battery,
temperature, timers). Figtree's default numerals are proportional, so a live
value jiggles as its digits change width. Wrap the readout in this. It
inherits the surrounding type style.

```vue
<HTabularNum :value="speed" />
mm/s
<HTabularNum>{{ formatClock(t) }}</HTabularNum>
```

Prop: `value?: string | number` (default `""`). The default slot overrides it.

Tabular figures equalise digit widths but not digit **counts** (440 → 88
still narrows). A live readout also wants a fixed-width, right-aligned
container. The global `.text-tabular` class does the same job without a
component.

### HCircleProgress

The one circular meter: a determinate ring with rounded caps, the value
centred, a Brand Blue arc on a hairline track. With a caption and a colour it
doubles as the stat dial, so there is no separate gauge component.

```vue
<HCircleProgress :value="72" />
<HCircleProgress
  :value="battery"
  :size="56"
  caption="Battery"
  color="var(--color-feedback-positive)"
/>
<HCircleProgress :value="t" display="3.9V" :size="80" />
```

| Prop      | Type     | Default  | Notes                                                                  |
| --------- | -------- | -------- | ---------------------------------------------------------------------- |
| `value`   | `number` | required | 0–100                                                                  |
| `size`    | `number` | `96`     | Diameter in px                                                         |
| `stroke`  | `number` | `0`      | Arc width in px. `0` means proportional: `max(3, round(size × 0.085))` |
| `caption` | `string` | `""`     | Label below the ring                                                   |
| `display` | `string` | `""`     | Centre text override (default `"{value}%"`)                            |
| `color`   | `string` | `""`     | Arc colour (`--ring-fill`), for example a feedback token               |

The default slot replaces the centre text. The centre type is
`max(11, round(size × 0.2))` px, weight 600, tabular. The ring **animates
forward only**. A decrease and the first paint land instantly through
`useForwardProgress`, so the ring never unwinds backwards.

### HGraph

`HGraph` renders one or more point series on a canvas, in either of two modes:

- **Playback** (funscripts) — pass `current-time` and `view-span`; the window
  centers on the playhead, drag scrubs, the **wheel** zooms the span (emits
  `zoom`).
- **Static** (any 2D curve) — pass neither; the graph shows the full data
  extent (or `x-domain`), and the **wheel** zooms **x** around the cursor
  (emits `zoom-range` — hand it back as `x-domain`). One chord per intent:
  **Shift+wheel** zooms **both** axes, **Alt+wheel** y alone, and the
  **wheel over the y gutter** y alone (the y ones emit `zoom-y-range` — hand
  it back as `y-domain`). Zooming out converges on home: the data extent
  on x; on y, `y-zoom-extent` when you pass one, else the data's y extent.
  The y-axis gutter is y's control strip: **grab the labels** to pan a
  zoomed window up and down (clamped inside that same home, so at full view
  the grab is inert), **wheel over them** to zoom y alone, and **click
  them** to emit `zoom-y-fit` — fit y to what's in view, however the page
  defines a fit.

Marquees mark a range to zoom to: **middle-drag or Shift-drag** marks an
x range (emits `zoom-range`); **Alt-drag** marks a y range (emits
`zoom-y-range` — hand it back as `y-domain`). Ctrl-drag is an alias for the
y marquee, but only where the browser lets it through — macOS turns
Ctrl+click into the context menu, and Safari there reports it as the right
button outright, so Alt is the chord to document. **Double-click** emits
`zoom-reset`: the page restores whatever "home" means to it (typically the
full extent and the resting y-domain).

**A zoom gesture is only claimed when it has somewhere to land.** HGraph
only reports a zoom, it never applies one — so each gesture arms exactly
when the page listens for the event it produces (`@zoom` for the wheel in
playback mode, `@zoom-range`, `@zoom-y-range`, `@zoom-reset`) and `zoomable`
isn't off. Over any other graph a wheel stays what it is everywhere else on
the page: scroll. A macOS trackpad pinch arrives as ctrlKey wheel events, so
it zooms through the same path. A funscript page simply doesn't listen for
`zoom-y-range` — its y axis is a fixed 0–100 position — and the Alt chord
stays inert there.

`x-domain` is the caller claiming the window and it wins outright: scrubbing
and playhead-centering stand down while it is set, and the wheel only zooms
it by reporting `zoom-range` back to the caller. A `current-time` **on its
own** still draws the playhead — that is how you get a clock running through
a pinned window.

```vue
<HGraph
  :series="[{ id: 'main', label: 'Stroke', points }]"
  :revision="revision"
  :current-time="currentTime"
  :view-span="15000"
  :selected="selected"
  @seek="t => (currentTime = t)"
  @zoom="s => (viewSpan = s)"
  @select-point="s => (selected = s)"
/>
```

```vue
<HGraph
  :series="[{ id: 'temp', label: 'Temperature', points: samples }]"
  :y-domain="[15, 35]"
  :format-y="v => `${v}°`"
  x-mode="value"
  :height="180"
/>
```

#### Props

| Prop                                                 | Type                        | Default             | Notes                                                                                             |
| ---------------------------------------------------- | --------------------------- | ------------------- | ------------------------------------------------------------------------------------------------- |
| `series`                                             | `GraphSeries[]`             | required            | `{ id, label?, color?, visible?, points, dots? }`. Points are sorted ascending on x with unique x |
| `revision`                                           | `number`                    | `0`                 | Bump after mutating points in place (the redraw signal)                                           |
| `currentTime`                                        | `number`                    | —                   | Playhead position. With `viewSpan` it selects playback mode                                       |
| `viewSpan`                                           | `number`                    | —                   | Visible window width in playback mode                                                             |
| `minSpan` / `maxSpan`                                | `number`                    | `250` / `1_800_000` | Playback zoom limits (ms)                                                                         |
| `xDomain`                                            | `[number, number]`          | —                   | Pins the window. It beats everything else                                                         |
| `yDomain`                                            | `[number, number]`          | `[0, 100]`          | Either way round                                                                                  |
| `ySplits`                                            | `number[]`                  | —                   | Gridlines (default: four even divisions)                                                          |
| `yZoomExtent`                                        | `[number, number]`          | —                   | Where y zoom-out converges (default: the data's y extent)                                         |
| `xMode`                                              | `"time" \| "ms" \| "value"` | `"time"`            | `m:ss` clock, raw space-grouped milliseconds, or plain numbers                                    |
| `formatX` / `formatY`                                | `(v: number) => string`     | —                   | Override the tick and readout format                                                              |
| `yAxisSize`                                          | `number`                    | `36`                | The y gutter in px                                                                                |
| `showAxes`                                           | `boolean`                   | `true`              | `false` for strips too short to label honestly (under ~100px)                                     |
| `regions`                                            | `GraphRegion[]`             | `[]`                | Shaded x ranges at 14% (30% plus edge rules when `selected`)                                      |
| `markers`                                            | `GraphMarker[]`             | `[]`                | Vertical lines, optionally dashed                                                                 |
| `selected`                                           | `SelectedPointRef \| null`  | `null`              | Draws the selection ring (focus colour)                                                           |
| `showPlayhead`                                       | `boolean`                   | `true`              | Draws the playhead rule at `currentTime`                                                          |
| `seekable` / `zoomable` / `selectable` / `hoverable` | `boolean`                   | `true`              | Each interaction gated independently                                                              |
| `editable`                                           | `boolean`                   | `false`             | Shape-editor mode (see below)                                                                     |
| `editSeriesId`                                       | `string`                    | `""`                | The series edits act on (default: the first visible)                                              |
| `editSnapX` / `editSnapY`                            | `number`                    | by axis             | Snap grids. `0` means none                                                                        |
| `editMinX` / `editMaxX`                              | `number`                    | ±∞                  | Bounds for a dragged or added x                                                                   |
| `height`                                             | `number`                    | `280`               | px                                                                                                |
| `theme`                                              | `Partial<GraphTheme>`       | —                   | Override any resolved canvas colour                                                               |

#### Events

| Event                                                          | Payload                                           | When                                                     |
| -------------------------------------------------------------- | ------------------------------------------------- | -------------------------------------------------------- |
| `seek`                                                         | `timeMs`                                          | Drag or click scrub in playback mode                     |
| `zoom`                                                         | `spanMs`                                          | Wheel in playback mode                                   |
| `zoom-range`                                                   | `from, to`                                        | x marquee, static-mode wheel, or panning a pinned window |
| `zoom-y-range`                                                 | `from, to` (always ascending)                     | y marquee, y wheel, y-gutter drag                        |
| `zoom-y-fit`                                                   | —                                                 | A clean click on the y gutter                            |
| `zoom-reset`                                                   | —                                                 | Double-click (not while editing)                         |
| `select-point`                                                 | `SelectedPointRef \| null`                        | Click near a point, or on empty space                    |
| `hover`                                                        | `SelectedPointRef \| null`                        | Crosshair target changed                                 |
| `point-drag` / `point-drag-end` / `point-add` / `point-delete` | see [Editing](#editing--drawing-a-script-by-hand) | Editing mode                                             |

Exposed: `snapshot()` (see below). The hover readout chip (dot, series label,
x and y) is built in and flips sides so it never covers its own point.

Three props worth knowing early: `show-axes="false"` drops both axes and their
gridlines for strips too short to label honestly (under ~100px); `x-mode`
picks the timeline format (`"time"` = m:ss, `"ms"` = raw milliseconds,
`"value"` = plain numbers, and `format-x` overrides all three); and
`seekable` / `zoomable` / `selectable` / `hoverable` gate each interaction
independently.

#### Exporting an image

A template ref on the component gives `snapshot()`: the live chart canvas with
everything drawn — series, axes, regions, overlay dots. It is uPlot's working
surface and repaints continuously, so treat it as read-only and `drawImage` it
onto your own canvas before compositing legends or downloading. It is sized in
device pixels (canvas.width = CSS width × dpr).

#### Dots-only series

`dots: true` on a series draws its markers with no connecting line — for
sparse event series (command points, annotations) where a line would invent a
trend between events. The circles are painted by the overlay (uPlot's own
point rendering filters by density and cannot be trusted with a handful of
isolated values in a joined grid), while the series stays in the data — so the
points contract is unchanged (sorted ascending, unique x) and hover reads the
dots like any other samples. Overlay-drawn also means dots are clipped to the
plot box and never decimated.

#### Marquee zoom

Middle-drag across the plot — or shift-drag, for trackpads without a middle
button — marks a range and emits `zoom-range(from, to)` on release. The
component only reports the range; what it means is the page's call:

```ts
// playback: re-centre and re-span
function onZoomRange(from: number, to: number) {
  currentTime.value = (from + to) / 2;
  viewSpan.value = to - from;
}

// static: pin the window
function onZoomRange(from: number, to: number) {
  domain.value = [from, to];
}
```

**The gesture only arms when you listen for `zoom-range`.** The component
reports the range and nothing else, so on a graph whose page ignores the event
a marquee would paint a selection band and then drop it — which reads as a
broken zoom rather than an absent feature. `zoomable` can't decide this alone:
it also gates the wheel, and a graph can legitimately want wheel-zoom (handled
through `zoom`) with no marquee. Bind the handler and the gesture appears.

Marquees under 8px are treated as a stray click and ignored. In playback mode
the emitted span is clamped to `min-span` / `max-span` around the marquee's
centre; in static mode the range is handed over untouched, because those
millisecond defaults mean nothing to a chart measured in degrees.

#### Panning a pinned window

On a chart with a pinned `xDomain`, a plain left-drag slides the window
sideways and reports it through the same `zoom-range(from, to)` event as the
marquee — so a page that already handles zoom gets panning with no extra code:

```ts
function onZoomRange(from: number, to: number) {
  domain.value = clampToData(from, to); // pan and zoom arrive the same way
}
```

Panning is deliberately tied to the same three conditions as the marquee:
the window must be pinned (in playback mode a drag scrubs the playhead
instead), `zoomable` must be on, and the page must listen for `zoom-range`.
A drag that pans does not also emit a click, so a pan never clears a
selection. Clamp the range you receive — the component reports the gesture,
not a legal window.

#### Editing — drawing a script by hand

`editable` turns the same chart into a shape editor. Click empty canvas to add a
point, drag one to move it, Alt+click to remove one. Nothing is applied: HGraph
reports the gesture and the page writes the array, which is what keeps undo, the
minimum point count and "is this a legal time" in the page's hands.

```vue
<HGraph
  :series="[{ id: 'shape', label: 'Pattern', points }]"
  :revision="revision"
  :x-domain="[0, 1000]"
  :selected="selected"
  x-mode="ms"
  editable
  :edit-snap-x="10"
  :edit-min-x="0"
  @select-point="s => (selected = s)"
  @point-add="onAdd"
  @point-drag="onDrag"
  @point-drag-end="onDragEnd"
  @point-delete="onDelete"
/>
```

| Event            | Payload                   | When                                    |
| ---------------- | ------------------------- | --------------------------------------- |
| `point-add`      | `{seriesId, x, y}`        | click on empty canvas                   |
| `point-drag`     | `{seriesId, index, x, y}` | every frame of a drag                   |
| `point-drag-end` | `{seriesId, index}`       | release — record **one** undo step here |
| `point-delete`   | `{seriesId, index}`       | Alt+click on a point                    |

`edit-series-id` picks the series the gestures act on (default: the first
visible one); its points draw as fatter handles and the canvas takes a
crosshair cursor. `edit-snap-x` / `edit-snap-y` set the grids and
`edit-min-x` / `edit-max-x` the bounds. The grids default by axis — whole units
on a time axis and on a y-domain at least 10 wide, no grid at all below that,
because rounding an axis measured in hours or in a 0–1 ratio to 1 would collapse
every edit onto a handful of values. The bounds default unbounded, so a
funscript editor wants `:edit-min-x="0"`. In development, naming an
`edit-series-id` that matches no visible series logs a warning, because every
gesture would otherwise be ignored in silence.

Four things the component guarantees so the host doesn't have to:

- A dragged x is **pinned strictly between its neighbours** — one snap step
  clear of each — before it is emitted, so the sorted-unique-x invariant holds
  on every frame and the point under the cursor can never swap for its
  neighbour. Wedged between two adjacent steps, the drag goes vertical-only.
- x is snapped and clamped, y is snapped and clamped into `y-domain`, before
  either reaches you. Write the numbers as given.
- A press that travelled, or a release outside the plot, is **not** an add. A
  slipped tap must not drop a point.
- The drag is committed even when the browser steals the pointer
  (`lostpointercapture`), so your undo stack never holds an uncommitted edit.

Two things the host owns:

- **Pin the window.** An editable graph with no `x-domain` sizes itself to its
  data, so adding a point near the right edge widens the window, which moves
  every pixel under the cursor — the point runs away from the pointer. If the
  window must follow the shape, latch it: refit on discrete changes (add,
  remove, release) and hold it still during a drag.
- **A taken x is your call.** `point-add` fires with the snapped x whether or
  not a point already sits there; `insertionAt()` in `graph-edit.ts` tells you
  which it is. Selecting the occupant reads better than replacing it — a click
  on empty canvas that moved an existing point is nobody's mental model.

The chart itself is not a tab stop. Wrap it in a focusable region — `tabindex="0"`,
`role="application"` on the chart wrapper only, an `aria-label` naming the point
count and the gestures — and give it a `keydown` handler: Delete removes, the
arrows nudge the selection through `clampDragX`, Escape clears it. Alt+click has
no keyboard equivalent and no touch equivalent either, so add and remove also
need buttons outside the canvas. `/showcase/graphs` does all of that, and is the
reference implementation.

Two gesture rules worth knowing. While `editable` is on the primary button
belongs to the points, so shift-drag no longer starts a marquee (middle-drag
still does), and a click on empty canvas is an add rather than a deselect — a
host that needs `select-point(null)` should clear the selection itself. And
`touch-action: none` means a finger on an editable plot edits instead of
scrolling the page: give an editable stage a bounded height and keep scrollable
page around it.

The pure point maths — `snapTo`, `clampDragX`, `clampToDomain`, `insertionAt`,
`indexAtOrBefore`, `indexOfX` — lives in `graph-edit.ts` and is unit-tested
without a DOM (`test/graph-edit.spec.ts`). Reuse it in the host's own handlers.

#### Performance contract

Point arrays are treated as immutable snapshots and are never deep-watched.
For large scripts:

1. `markRaw` the array so Vue doesn't proxy 20k objects.
2. Mutate in place, then bump the `revision` prop — that's the redraw signal.
3. Keep points **sorted ascending on x with unique x**. Window slicing and hit
   testing are binary searches; unsorted input silently drops data.
   `funscriptToPoints()` in `graph-funscript.ts` enforces this on load.

Every update funnels into one rAF-batched pass that slices the visible window
and decimates to ~2 points per pixel column, so cost is independent of script
length. The edit series is never decimated (every point is a handle), and a
selected or hovered point is threaded back into a decimated slice so its
marker sits on the drawn line. Options are rebuilt only when the series
structure, height, y-axis size or `showAxes` changes. Colours, domains and
formatters are read through closures, because uplot-vue rebuilds the whole
chart on any new options object.

#### Colours

Series colours are optional. Omitted, a series takes its slot in the
design.md §7.3 chart ramp — hero Brand Blue, then Dark Charcoal → Slate Gray →
Divider Gray (a white-opacity ladder on dark). Slots are assigned by position
in the `series` array and stay put when a series is hidden.

That ramp is an **emphasis ladder, not a set of equal hues**: one series is the
point and the rest are context. Two consequences:

- Any chart with more than one series needs a legend or direct labels next to
  it. `HGraph` ships neither — components emit, pages decide.
- Past four series the ramp repeats. Fold the tail into an "other" series, or
  facet into small multiples.

Canvas can't read CSS custom properties, so `graph-theme.ts` resolves the
tokens off the graph's own host element at mount and re-reads them when
`data-theme` flips — which is also why a graph inside a `.section-dark` island
on a light page gets the dark ramp. Override any of them per instance with the
`theme` prop. The playhead uses `--color-feedback-negative`, the hover
crosshair the axis colour (`--color-text-secondary`), the selection ring and
marquee `--color-stroke-focus`, and optional
`--color-chart-hero` / `--color-chart-2..4` tokens override the ramp (none
exist yet).

> **Known issue: the axis labels don't use Figtree.** The canvas font is
> `"12px Figtree, sans-serif"`, but the app self-hosts the variable font under
> the family name `'Figtree Variable'`. On any machine without a locally
> installed static Figtree, the axis labels render in the generic sans-serif.
> It is fixed by leading with `"Figtree Variable"`.
>
> Build flags: see [§1](#build-flags-hgraph).

### HPlayhead

The current-position marker for a strip that stands for time — a heatmap, a
waveform, a filmstrip. It is the M3 slider handle borrowed out of the slider:
a skinny rounded bar in a gap cut through whatever is behind it, slimming
while dragged (the same `0.55` press ratio `styles/_quasar.scss` gives
`.q-slider`), with
the value on a label beside it.

It replaces the hairline rule most canvas strips draw. A rule competes with
the picture at every pixel, carries no state — you can't tell it is
draggable — and says nothing about how far in you are. The three parts answer
those in turn: the surface-coloured **gap** detaches the handle from the field
so it survives any colour behind it, the **press-slim** confirms the grab, and
the **ahead-wash** splits the strip into played and not-played.

```vue
<div class="strip">
  <canvas ref="canvas" />
  <HPlayhead
    :value="currentTime"
    :max="duration"
    :label="clock"
    aria-label="Playhead"
    interactive
    @seek="t => seek(t)"
  />
</div>
```

```scss
.strip {
  position: relative; // HPlayhead fills its parent
  overflow: hidden; // so the handle clips to the strip's own radius
}
```

| Prop            | Type                            | Default      | Notes                                                                   |
| --------------- | ------------------------------- | ------------ | ----------------------------------------------------------------------- |
| `value`         | `number`                        | required     | In the caller's own units                                               |
| `min` / `max`   | `number`                        | `0` / `100`  | A zero-width range pins at the left                                     |
| `interactive`   | `boolean`                       | `false`      | Scrubber + keyboard slider. Off = pure indicator with no pointer events |
| `showHandle`    | `boolean`                       | `true`       | `false` keeps a strip seekable while the position is unknown            |
| `label`         | `string`                        | `""`         | Text beside the handle (normally a clock). It flips sides at 50%        |
| `showLabel`     | `"auto" \| "always" \| "never"` | `"auto"`     | `auto` = while hovering or scrubbing                                    |
| `dimAhead`      | `number`                        | `0.22`       | Opacity of the not-yet-played wash. `0` disables it                     |
| `step`          | `number`                        | `0`          | Arrow-key increment (`0` = 1% of the range)                             |
| `pageStep`      | `number`                        | `0`          | PageUp/Down increment (`0` = 10%)                                       |
| `ariaLabel`     | `string`                        | `"Playhead"` | What is being scrubbed ("Video position")                               |
| `ariaValueText` | `string`                        | `""`         | Spoken value, falling back to `label`, then the number                  |

`interactive` makes it a real scrubber: the **whole strip** takes the gesture,
not just the handle, and it becomes a proper keyboard slider — `role="slider"`
with live `aria-valuenow`, arrows step, PageUp/Down jump, Home/End go to the
ends. A canvas has no keyboard story of its own, which is half the reason this
is a component rather than four lines of CSS in each host. Left off, it is a
pure indicator and stops taking pointer events entirely, so it can't steal the
host's own gestures. Only the primary button scrubs, so a middle-drag stays
the host's (marquee zoom, pan).

Nothing moves on its own: `seek` reports where the scrub asked to go and the
host writes `value` back. `pan("start" | "end")` brackets a drag, same shape
`HLabeledSlider` uses.

| Custom property          | Default                     | What it paints             |
| ------------------------ | --------------------------- | -------------------------- |
| `--h-playhead-color`     | `--color-feedback-negative` | the handle and its label   |
| `--h-playhead-surface`   | `--h-slider-gap`            | the gap and the ahead-wash |
| `--h-playhead-width`     | `4px`                       | handle thickness           |
| `--h-playhead-gap-width` | `3px`                       | the cut either side of it  |
| `--h-playhead-inset`     | `2px`                       | top/bottom inset           |

The colour default is deliberate: it is the same token `graph-theme.ts` gives
`HGraph`'s playhead, so a chart and the strip under it read as one instrument
rather than two. The surface default follows the slider's own gap token, which
`styles/_tokens.scss` re-declares per scope — set `--h-playhead-surface` on the strip when
its background isn't the page's (a heatmap on `--color-bg-page-alt` sets it to
that).

`dim-ahead` (default `0.22`, `0` disables) is the wash. It is the part that
answers "how far in am I" at a glance; turn it down on a strip whose data
matters uniformly across its whole width.

It is fully portable: no Quasar, and every token read has a hard-coded
fallback.

> **Known issue:** the default `ariaLabel` "Playhead" is inline English. It is
> the one kit string that bypasses `labels.ts`.

---

## 9. Feedback & status

### HFeedbackCard

The inline alert / banner: a card with a 4px semantic left accent (echoing
the toast skin), a matching 24px outlined icon, a title and body, and
optionally an action and a dismiss button. Severity is signalled by colour
**and** icon, never colour alone.

```vue
<HFeedbackCard
  severity="warning"
  title="Battery low"
  action-label="Find a charger"
  dismissible
  @action="openHelp"
  @dismiss="hide = true"
>
  Charge the device before the next session.
</HFeedbackCard>
```

| Prop          | Type                                              | Default  | Notes                                                     |
| ------------- | ------------------------------------------------- | -------- | --------------------------------------------------------- |
| `severity`    | `"info" \| "positive" \| "warning" \| "negative"` | `"info"` | Default icons: `info`, `check_circle`, `warning`, `error` |
| `title`       | `string`                                          | `""`     |                                                           |
| `actionLabel` | `string`                                          | `""`     | A small secondary `HBtn`, bottom-right                    |
| `dismissible` | `boolean`                                         | `false`  | A round × (kit label "Dismiss")                           |
| `icon`        | `string`                                          | `""`     | Overrides the severity icon                               |

Slot: default (the body). Events: `action` and `dismiss` (the page removes the
card). The root has `role="status"`.

> **Known issue (open spec bug 2.2 in the tracker):** the warning icon and
> accent use `--color-feedback-warning` (`#F7B928`). On a white card that is
> 1.76:1, under the 3:1 WCAG asks of non-text UI.

### HStatusBadge

A small semantic pill on a 12–18% tint of its own feedback colour, with the
label and icon in the readable **text-tier** token for that severity (full
warning yellow on a yellow tint would fail). The tints are derived with
`color-mix`, so a palette change carries through.

```vue
<HStatusBadge severity="positive" label="Up to date" icon="check" />
<HStatusBadge severity="warning">Beta</HStatusBadge>
```

| Prop       | Type                                              | Default  |
| ---------- | ------------------------------------------------- | -------- |
| `severity` | `"positive" \| "negative" \| "warning" \| "info"` | `"info"` |
| `label`    | `string`                                          | `""`     |
| `icon`     | `string`                                          | `""`     |

The default slot overrides `label`. The icon is 14px and the text is 12px/500.
See the island-scope known issue in §2: badges inside `.section-dark` /
`.section-light` currently lose most of their contrast.

### HEmptyState

"Nothing here yet": a 40px tertiary icon, a bold lead, one secondary body
line, and an action. Per the voice rules, the lead says what happened, the
body carries a little cheek, and the action is always there.

```vue
<HEmptyState
  icon="folder_open"
  title="No scripts yet."
  body="Import one and it shows up here."
  action-label="Import a script"
  @action="importScript"
/>
```

| Prop          | Type     | Default   |
| ------------- | -------- | --------- |
| `icon`        | `string` | `"inbox"` |
| `title`       | `string` | required  |
| `body`        | `string` | required  |
| `actionLabel` | `string` | `""`      |

Event: `action`. The title and body share one `<p>` (the title is displayed as
a block).

### HSuccessMark

The kit's single completion animation. One shape means "that landed", in
every flow that has an end: a stage list finishing, a task closing, a form
saving, a device pairing.

```vue
<HSuccessMark :size="44" :duration="900" />
```

| Prop       | Type     | Default | Notes                                 |
| ---------- | -------- | ------- | ------------------------------------- |
| `size`     | `number` | `52`    | Rendered px (the viewBox is 52 units) |
| `duration` | `number` | `900`   | The **whole** beat in ms              |

Three things worth knowing before you use it somewhere new:

- **`duration` is the whole beat, not one phase.** The ring, the tick and the
  halo are all `calc()` fractions of it, so a host that must close its dialog
  in 600ms passes `:duration="600"` and gets a faster complete animation
  instead of one cut off half-drawn. Match it to the beat the host holds on —
  never time the two independently.
- **It plays on mount and has no imperative API.** To replay it (a retried
  step, a showcase demo) change the component's `:key`.
- **It is decoration**, `aria-hidden`, and under `prefers-reduced-motion` it
  arrives already drawn. The words beside it are what carry the state, so give
  it some, or put it inside `HSuccessMoment`, which supplies them.

Colour follows `--color-feedback-positive`; override per instance with
`--h-mark-color`. The halo is bounded so it stays inside the 52-unit viewBox
at full size — an SVG that paints outside its box grows a scrolling parent's
scroll height and flashes its scrollbar for the length of the animation.

It is a **moment**, not a status: a row that is merely "done" wears a badge,
and a list of ten finished items does not draw ten marks.

### HSuccessMoment

The standard success screen: the check, a short bold Spec-voice title
("Connected.", "Order confirmed."), and one quiet sub-line.

```vue
<HSuccessMoment title="Connected." body="Your Handy is ready." />
<HSuccessMoment :key="attempt" title="Saved." :duration="600" />
<HSuccessMoment title="Order confirmed." icon="local_shipping" />
```

| Prop       | Type      | Default  | Notes                                                                  |
| ---------- | --------- | -------- | ---------------------------------------------------------------------- |
| `title`    | `string`  | required | h3                                                                     |
| `body`     | `string`  | `""`     | The default slot overrides it                                          |
| `icon`     | `string`  | `""`     | A non-check success symbol. It renders **static** in place of the mark |
| `animated` | `boolean` | `true`   | `false` keeps the check but drops the draw                             |
| `duration` | `number`  | `900`    | Shared by the mark and the rising words                                |

`HSuccessMoment` draws `HSuccessMark` by default and rises its title and
sub-line in on the tick, sharing the same `duration`. Under reduced motion
everything arrives in place.

> **Known issue:** it is not a live region. When it replaces content in place
> (a dialog step, a stage list), screen readers are not told. Put it inside an
> element with `role="status"` until the component does that itself.

### HInlineDots

Tier-1 loading: the trailing "…" of the preceding word, pulsing. Write the
word and put this right after it. It rides the text baseline.

```vue
<span>Connecting<HInlineDots /></span>
```

No props. It is decorative (`aria-hidden`) and static under reduced motion,
so the word must carry the meaning.

### HandyLoader

Tier-3 loading: the branded morphing-pill "h" (the real asset, as an SVG SMIL
animation). It is for hero moments only, such as full-page route loads and
splash screens. Overuse cheapens it.

```vue
<HandyLoader :size="64" />
```

Prop: `size?: number` (default `48`). Colour follows `--color-text-primary`.
It has `role="status"` with the kit label "Loading". SMIL animation ignores
`prefers-reduced-motion`, which is acceptable for an essential indicator, but
it is worth knowing.

### Toasts: `hToast` and `hNotify`

Toasts are fired through one helper, so components never toast themselves
(`toast.ts`).

```ts
import { hToast, hNotify } from "@/components/handy";

hToast("positive", "Copied.");
hToast("negative", "Couldn't connect.", "Check that the device is on Wi-Fi.");
hToast("info", "Update available.", undefined, { onClick: openUpdate });
hNotify("Saved."); // the quiet one: no icon, no ×, gone in 1.5s
```

- `hToast(severity, message, caption?, { onClick? })` puts a card-surface toast
  with a 4px semantic left accent and a severity icon on screen. Errors hold
  for 8s and everything else for 5s. It is positioned **bottom below `md`,
  top-right from `md` up**, resolved per call.
- A click anywhere on the toast dismisses it (running `onClick` first when
  given). The × button (kit label "Dismiss") is the keyboard and assistive-tech
  way out, and it never triggers `onClick`.
- `hNotify(message, timeout = 1500)` is an unstyled short confirmation.
- It requires Quasar's `Notify` plugin and the `.h-toast*` classes from
  `styles/_toast.scss` (the toast portals out of any scoped style).

> **Known issue:** design.md 5.6 caps the stack at three toasts. Nothing
> enforces that.

---

## 10. Navigation & chrome

### HDrawerItem

A row in the hamburger drawer: a compact weight-500 label, an optional 20px
leading icon, and the active row in the link colour on the alt surface.
`centered` is the text-only flavour, because icons and centering don't mix.

```vue
<HDrawerItem
  label="Buttons"
  icon="smart_button"
  to="/showcase/buttons"
  :active="route.path === '/showcase/buttons'"
/>
```

| Prop       | Type      | Default  | Notes                                            |
| ---------- | --------- | -------- | ------------------------------------------------ |
| `label`    | `string`  | required |                                                  |
| `icon`     | `string`  | `""`     |                                                  |
| `to`       | `string`  | `""`     | Renders a `router-link`                          |
| `active`   | `boolean` | `false`  | **Explicit**: compute it from the route yourself |
| `centered` | `boolean` | `false`  | Centred, text only                               |

Event: `click`.

Active state is explicit so that prefix matching can't light up a parent.
(The code comment says the router-link active classes are disabled. They
aren't; they are just left unstyled.)

> **Known issue:** without `to` it renders an `<a>` with no `href`, which is
> not focusable and cannot be activated from the keyboard. Always pass `to`,
> or add a `tabindex`, a `role="button"` and key handling.

### HThemeToggle

The nav-bar dark-mode button: a tertiary round `HBtn` showing `light_mode` or
`dark_mode`, bound to the shared `useHandyTheme` state so every instance stays
in sync.

```vue
<HThemeToggle />
```

No props. The accessible name is the state it moves **to** ("Switch to light
mode" while dark is on), and the tooltip names the current mode. The shell
still has to call `useHandyTheme().init()` once when it mounts.

---

## 11. Brand

### HLogo

Every official lockup of The Handy, plus the Handyverse concepts, as inline
SVG in `currentColor`. The logo is **strictly black or white**: black on light
surfaces and `.section-light`, white on dark and `.section-dark`. Glass
surfaces decide by their own ink (black on `.glass-light` even in dark mode).
It is never tinted by theme greys.

```vue
<HLogo />
<!-- horizontal lockup, 24px -->
<HLogo mark :height="20" />
<!-- the "h" pictogram only -->
<HLogo variant="stacked" :height="48" />
<HLogo variant="handyverse-v1-horizontal" :height="32" />
```

| Prop      | Type           | Default        | Notes                                     |
| --------- | -------------- | -------------- | ----------------------------------------- |
| `height`  | `number`       | `24`           | px. Nav: 24 desktop, 20 mobile            |
| `variant` | `HLogoVariant` | `"horizontal"` | See below                                 |
| `mark`    | `boolean`      | `false`        | Back-compat shortcut for `variant="mark"` |

Variants: `horizontal`, `stacked`, `horizontal-2line`, `wordmark`,
`wordmark-2line`, `mark`, `handyverse-v1-horizontal`, `handyverse-v1-stacked`,
`handyverse-v2-horizontal`, `handyverse-v3-horizontal`,
`handyverse-v4-horizontal`, `handyverse-v4-stacked`. It is `role="img"` named
"The Handy" or "Handyverse" (product names are never translated, per
design.md 5.14).

- Never redraw the mark. `mark` is the lockup's own first two paths.
- The lockup's viewBox reserves descender space, so text flex-centred next to
  it rides about 2px high at nav sizes. Nudge the neighbour down onto the
  wordmark's baseline.

> **Note:** all twelve lockups live in one lookup table (`handy-logo-art.ts` +
> `handyverse-logo-art.ts`, ~46 KB of source, a 44 KB chunk in the build).
> Rendering only the mark still ships them all.

### HConnectedDot

The connection-state indicator, in three states, mirroring the device's LED:

- **connected** — `--color-accent` (Connected Purple), with two hairline rings
  pulsing outward half a cycle apart (2.8s), so the dot reads as continuously
  live.
- **connecting** — `--color-feedback-warning`, with a hairline arc sweeping
  round it (1.1s): the handshake is in progress.
- **offline** — muted, fading slowly (4.4s) with no movement: asleep, not dead.

The dot itself is a flat disc in all three states: no gloss, no glow.

```vue
<HConnectedDot state="connected" />
Connected
<HConnectedDot state="connecting" label="Connecting to device" :size="12" />
<HConnectedDot clickable :state="s" label="Reconnect" @click="reconnect" />
```

| Prop         | Type                                                 | Default      | Notes                                                                                          |
| ------------ | ---------------------------------------------------- | ------------ | ---------------------------------------------------------------------------------------------- |
| `state`      | `"connected" \| "connecting" \| "offline"`           | —            | The modern prop                                                                                |
| `live`       | `boolean`                                            | `true`       | Legacy: `false` = offline. Ignored when `state` is set                                         |
| `size`       | `number`                                             | `8`          | The **slot** in px. The disc is ~0.7 of it, leaving room for the rings and the arc             |
| `label`      | `string`                                             | —            | Accessible name. As an indicator it makes the dot `role="img"`; unlabelled it is `aria-hidden` |
| `clickable`  | `boolean`                                            | `false`      | Renders inside a round `HBtn`                                                                  |
| `variant`    | `"primary" \| "secondary" \| "tertiary" \| "danger"` | `"tertiary"` | Button mode only                                                                               |
| `buttonSize` | `"sm" \| "md" \| "lg"`                               | `"md"`       | Button mode only (inert, see HBtn)                                                             |

- **Pair it with its word** wherever the state matters. Under reduced motion
  all animation stops and connected keeps one still ring. Connecting and
  offline are then told apart by colour alone.
- As a button it names itself with the state it shows ("Connected"), unless
  `label` says what pressing it does. Other attributes (`disable`, `loading`,
  `to`, `@click`) fall through to `HBtn`.
- The arc and ring sizes scale with `size` but are clamped, because past ~20px
  a proportional ring turns chunky.

### HConnectionKey

The device-to-ecosystem key shown as a pill on the alt surface, with one
action: an icon-only copy button. The key is monospace, 600 weight with 2px
tracking, **always one line**, and it ellipsises when out of width. Each
character class is told apart by colour tone only: digits in
`--color-text-connected` (purple), uppercase in primary ink, lowercase a step
muted.

```vue
<HConnectionKey
  :value="key"
  @copy="hToast('positive', 'Copied.')"
  @copy-error="hToast('negative', 'Couldn’t copy — select it instead.')"
/>
```

Prop: `value: string` (required). Events: `copy(value)` and
`copy-error(error)`. The component has no toast dependency: **the parent
confirms**. There is no regenerate action (rotating a key is not a UI
affordance). In fixed-width layouts the value takes the spare width, so the
copy button keeps the right edge. `user-select: all` makes a click select the
whole key.

Keys are `[A-Za-z0-9]`, max 32 characters. An input that _receives_ one filters
at input time rather than validating afterwards. See `sanitizeKey` in
[`keys.ts`](#keysts).

### HChip

The annotation chip: a quiet pill tag for product hero shots and spec rows
("Open-ended", "Low sensation").

```vue
<HChip label="Tight grip" icon="compress" />
```

Props: `label?: string` and `icon?: string` (16px). The default slot overrides
the label. The background is `--h-chip-bg`, which each surface scope
re-declares so a chip never blends into what it sits on: Soft Gray on white,
translucent white on dark, card-white on a Soft Gray `.h-section--alt`. A host
that uses chips on its own surfaces must re-declare it too.

### HIconTile

A clickable square tile: a 32px icon and a two-line-max label, for app
launchers, quick actions and category pickers. Lay the tiles out in the page's
2/3/4-column grid; the tile fills its cell (1:1, minimum 120px tall). It lifts
on hover (a hairline on dark), scales to 0.98 on press, and dims to 50% when
disabled.

```vue
<HIconTile icon="tune" label="Calibrate" @click="calibrate" />
```

Props: `icon` (required), `label` (required) and `disabled?: boolean`. Event:
`click`.

> **Known issue:** it is a `<button>` without `type="button"`, so it submits an
> enclosing form.

### HFeaturePoint

The icon tile's presentational sibling for marketing feature rows: an icon
stacked above a short label, centred, max 220px wide, not interactive.

```vue
<HFeaturePoint icon="bolt" label="Up to 7 hours" />
<HFeaturePoint icon="bolt" label="Up to 7 hours" lg />
```

Props: `icon` (required), `label` (required) and `lg?: boolean` (40px icon
with a 16px label instead of 32px/14px).

---

## 12. Content

### HPeekCarousel

A horizontally scrolling row of cards that peeks the next item. It is
generic over the item type, and the card comes from a scoped slot. By default
it is **full-bleed** (it spans the viewport so cards scroll off both real
screen edges), while the first card starts at the page's content edge and the
last card scrolls back to that same position. This layout is signed off, so
don't change the scroll mechanism.

```vue
<HPeekCarousel :items="products" :skeleton="loading">
  <template #default="{ item }">
    <HProductCard :name="item.name" :price="item.price" :to="item.url" />
  </template>
</HPeekCarousel>
```

| Prop             | Type      | Default                       | Notes                                                                |
| ---------------- | --------- | ----------------------------- | -------------------------------------------------------------------- |
| `items`          | `T[]`     | `[]`                          |                                                                      |
| `loop`           | `boolean` | `false`                       | Wrap-around. **Only with `autoplay`**, for unattended hero rows      |
| `autoplay`       | `number`  | `0`                           | ms per slide. It pauses on hover                                     |
| `itemWidth`      | `string`  | `"clamp(260px, 80vw, 300px)"` | A fixed card width: the visible count changes, the card size doesn't |
| `skeleton`       | `boolean` | `false`                       | Shimmering placeholders, with arrows hidden                          |
| `skeletonCount`  | `number`  | `8`                           |                                                                      |
| `skeletonHeight` | `string`  | `""`                          | A plain block of this height instead of the media + two-line shape   |
| `contained`      | `boolean` | `false`                       | Stay within the parent instead of breaking out full-bleed            |

Slot: default, `{ item, index }`.

- **Only horizontal moves it.** `touch-action: pan-y` keeps vertical page
  scrolling. The library's own wheel handling is not used, because it would
  turn a vertical wheel into slides. A horizontal-dominant wheel or trackpad
  gesture is captured (so the page never pans sideways) and advances a slide
  past a 10px threshold with a 220ms throttle.
- **Arrows are hidden until needed.** They appear on hover, focus, touch or
  wheel and retire 2.5s after the interaction. At an end the arrow fades out
  rather than disabling. The carousel must work without them, because touch
  users may never see them.
- `--h-gutter` (24 / 32 / centred-1440 + 40px) aligns the first card and
  mirrors `.h-container`. A page with a different content column re-declares
  it on `.h-peek`.
- Give every slide's media one fixed aspect ratio, or the row jumps as it
  scrolls.
- It imports `vue3-carousel/carousel.css` itself.

---

## 13. Background (`HandyBackground`)

A soft, grainy, defocused gradient field for the back of a page or a hero,
ported from the Canva deck gradients as live CSS. `background/` is a
**self-contained sub-kit** with no Quasar, no tokens and no router, only
`vue`. It has its own `index.ts` and a detailed
[`background/README.md`](background/README.md) covering the performance
measurements, the lens stack and how to tune a new look.

> **Status: not ratified.** The tracker (`design_system_needs_to_change.md`
> §0) records that the field conflicts with the spec on three counts:
> decorative gradients, animated page backgrounds, and Brand Blue used
> decoratively. It is shipped as a decision for the owner, and in the showcase
> it is off by default behind the nav's backdrop switch.

```vue
<template>
  <div class="page">
    <!-- position: relative -->
    <HandyBackground scene="aurora" />
    <main class="page__content">…</main>
    <!-- position: relative; z-index: 1 -->
  </div>
</template>
```

That is the whole contract: a positioned parent, and content above the field.

| Prop                               | Type                                                          | Default       | Notes                                                                           |
| ---------------------------------- | ------------------------------------------------------------- | ------------- | ------------------------------------------------------------------------------- |
| `scene`                            | `SceneId`                                                     | `"handy"`     | A named look with its motion chosen (table below)                               |
| `config`                           | `PlaygroundConfig \| string \| null`                          | `null`        | A config exported from `/playground`, read through a hardened parser            |
| `attach`                           | `"pinned" \| "parallax" \| "travels" \| "banded" \| "inline"` | scene's       | How the field relates to scroll. `inline` fills the nearest positioned ancestor |
| `palette` / `colors`               | `PaletteId` / `string[]` (`#rrggbb`)                          | —             | Named palette, or your own colours (repeat one to weight it)                    |
| `alpha` / `strength`               | `number` (0–1)                                                | —             | Per-blob strength / whole-field opacity                                         |
| `motion` / `speed` / `amount`      | `MotionId` / `number` / `number`                              | —             | Ambient motion, cycle multiplier (0.1–24), amplitude                            |
| `mount` / `mountMs` / `mountDelay` | `MountId` / `number` / `number`                               | —             | Entrance animation                                                              |
| `lensScope`                        | `"frame" \| "blobs"`                                          | —             | `blobs` confines the grain to the colour                                        |
| `theme`                            | `"auto" \| "light" \| "dark"`                                 | `"auto"`      | `auto` detects the host (data-theme, Quasar, classes, colour, OS)               |
| `band`                             | `number`                                                      | `160`         | `banded` only: reach in vh                                                      |
| `burstSpeed` / `burstMs`           | `number`                                                      | `24` / `2000` | The page-transition surge                                                       |
| `mountNonce`                       | `number`                                                      | `0`           | Bump to replay the entrance (prefer `play()`)                                   |

Precedence, loosest to tightest: defaults, then `scene`, then `config`, then
individual props. Exposed through a template ref: `play()` replays the
entrance, `burst({ speed?, ms? })` gives a temporary speed surge, `stopBurst()`
cuts one short, and `settings` holds the settings in effect.

| Scene    | Look (preset)             | Motion     | Entrance | Attach   |
| -------- | ------------------------- | ---------- | -------- | -------- |
| `handy`  | the house look (verbatim) | `morph` 3× | `bloom`  | parallax |
| `alex1`  | same object as `handy`    | `morph` 3× | `bloom`  | parallax |
| `calm`   | `slide`                   | `drift`    | `bloom`  | parallax |
| `deck`   | `orb`                     | `wander`   | `bloom`  | parallax |
| `aurora` | `aurora`                  | `orbit`    | `sweep`  | parallax |
| `fog`    | `fog`                     | `breathe`  | `fade`   | pinned   |
| `lens`   | `lens` ("Bad lens")       | `tilt`     | `fade`   | pinned   |
| `crisp`  | `crisp`                   | `still`    | `fade`   | pinned   |
| `erin`   | `erinSettings` (verbatim) | `drift` 3× | `bloom`  | parallax |
| `still`  | `slide`                   | `still`    | `none`   | pinned   |

Preset-built scenes run their motion at speed 1. The verbatim scenes carry
their own speed.

- **Cost.** `morph` changes the contents of a blurred layer, and on a
  software rasteriser it cost ~380× more than `drift` in the measurements.
  It is rate-limited to 6 Hz (`MORPH_HZ` in `LensField.vue`, a measured cliff,
  so don't raise it). For a tool surface rather than a front door, use `still`.
- **Legibility.** Only primary-weight ink clears 4.5:1 on bare field.
  Secondary ink measures 2.7–4.8:1, so put smaller text on a surface, or check
  it with `worstContrast()`.
- **Host traps**, warned about in dev: an ancestor with `transform`, `filter`
  or `contain` breaks `position: fixed` (stock `q-layout container` does
  this), and a page that scrolls inside an element rather than the document
  stops `parallax`/`travels` from moving.
- Everything stops under `prefers-reduced-motion`, including the
  scroll-driven parallax. The field is `aria-hidden`.

The pieces are exported for custom arrangements: `BackgroundField`
(`LensField`), `BackgroundGrain` (`GrainOverlay`), `BackgroundAttach`
(`MeshBackdrop`), plus the settings model (`defaults`, `presets`,
`applyPreset`, `buildBlobs`), the motion and mount presets, the palettes and
field layouts, the config I/O (`buildConfig`, `parseConfig`,
`serializeConfig`, versioned, with migration), and the contrast maths
(`worstContrast`, `sampleField`, `contrastRatio`, `luminance`). The kit's main
`index.ts` re-exports only `HandyBackground` and the scene helpers.

---

## 14. Composables & utilities

### `useHandyTheme()`

The theme contract in one place. It returns `{ dark, apply, toggle, init }`.
The state is module-scoped, so every caller shares one `dark` ref.

- `init()`, called once from each shell's `onMounted`, restores the stored
  choice (`localStorage["handy-theme"]` = `"light" | "dark"`). Otherwise it
  **follows the OS**, live, until the user makes a choice.
- `apply(value)` paints and records an explicit choice. `toggle()` flips it.
- Painting sets **both** `data-theme` on `<html>` (the tokens) and
  `$q.dark` (Quasar's internals). It requires Quasar's `Dark` plugin.

### `useGlassOnScroll(threshold = 24)`

It returns `{ scrolled }`, which is true once `window.scrollY` passes the
threshold. Bind it to `.glass-light` / `.glass-dark` on the sticky nav. The
listener is passive and is removed on unmount.

### `usePinnableTip()`

The two-state popup logic behind `HHelpTip`, for anything else that needs
"hover previews, click locks" on a `q-menu`. It returns `menuRef`, `bodyRef`,
`open`, `pinned`, `coarse` (the last pointer could not hover), and the
handlers `notePointer`, `preview`, `endPreview`, `togglePin` and `unpin`. The
header comment in the file explains the mechanics. Remember `.stop` on the
click when the trigger sits inside something clickable.

### Determinate progress (`useForwardProgress`)

Quasar animates its progress meters in **both** directions — the ring's
`stroke-dashoffset`, the bar's `transform` — so a meter reset to zero unwinds
backwards for the length of the transition before it starts again. It reads
as "something just finished and is being undone", which is the opposite of
"starting"; the same transition on the very first paint sweeps the meter in
from empty before the page has settled.

Both `q-circular-progress` and `q-linear-progress` take an `instant-feedback`
prop that drops the transition while it is true. `useForwardProgress` owns
the timing of that flag:

```vue
<template>
  <q-linear-progress :value="progress / 100" :instant-feedback="instant" />
</template>

<script setup lang="ts">
const progress = ref(0);
const { instant, flush } = useForwardProgress(() => progress.value);
</script>
```

- **true through the first paint**, and true again for one painted frame
  whenever the value **drops** — forward motion still animates.
- **`flush()`** forces the meter to the current value without animating, for
  a jump that is not a decrease: a re-measure after a reconnect, a step
  restored from storage, a bar handed a state rather than a change.
- **The restore has to wait for a painted frame.** `nextTick` runs _before_
  paint, so the transition would come off and go back on inside one frame —
  the compositor never sees it leave and eases the drop anyway. Two nested
  `requestAnimationFrame`s is the shortest wait that guarantees a composited
  frame in between, and the watcher must stay pre-flush (Vue's default) so
  the flag lands before the render that carries the new value.

`HCircleProgress` uses it internally, so its callers never think about
this. A bare `q-linear-progress` on a page does not — wire it up there.

### `keys.ts`

Connection-key logic, kept with `HConnectionKey` so pages don't re-implement it.

- `generateKey(length = 10)` mints a key from an alphabet without ambiguous
  glyphs (no `0/O`, `1/l/I`) and guarantees at least two digits. It uses
  `Math.random`, which is fine for display and demos. Use
  `crypto.getRandomValues` if it ever mints real keys.
- `sanitizeKey(value)` filters typed or pasted text to `[A-Za-z0-9]` and
  `KEY_MAX_LENGTH` (32). It accepts the ambiguous glyphs, because keys we
  _receive_ came from somewhere that made no such promise. A controlled
  `q-input` won't re-render when sanitising changes nothing, so force the
  update cycle around the assignment.

### `slider-format.ts`

`formatSliderValue(value, decimals, step)` rounds a value **for display** to
the precision the control can hold (the finer of `decimals` and the step's own
decimals), then drops trailing zeros. `3.5000000000000004` prints as `3.5`, and
a 15-digit integer is not rounded off. `sliderDecimals(decimals, step)` is the
precision on its own. The model is never touched.

### `scroll.ts`

`H_SCROLL_THUMB_STYLE`, `H_SCROLL_BAR_STYLE` and their `_HORIZONTAL` twins:
the slim token-coloured thumb on an invisible track, for `q-scroll-area`'s
`thumb-style` / `bar-style` props. Every scrolling region inside a card uses
them, so no native bar punches through a radius.

### Graph modules

| Module               | Exports                                                                                                  | What for                                                                                             |
| -------------------- | -------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `graph-types.ts`     | `GraphPoint`, `GraphSeries`, `GraphRegion`, `GraphMarker`, `SelectedPointRef`, `PointEdit`, `GraphTheme` | The contract between `HGraph` and its host. No imports                                               |
| `graph-edit.ts`      | `indexAtOrBefore`, `indexOfX`, `snapTo`, `clampToDomain`, `clampDragX`, `insertionAt`                    | Pure point maths (tested). Use it in your own keyboard and edit handlers                             |
| `graph-decimate.ts`  | `decimateMinMax(points, from, to, widthPx)`                                                              | Min/max per pixel column, which preserves stroke peaks (tested)                                      |
| `graph-theme.ts`     | `resolveGraphTheme(host, override)`, `watchGraphTheme(cb)`                                               | Reads the tokens off the host element for the canvas, and follows theme flips                        |
| `graph-funscript.ts` | `parseFunscript`, `funscriptToPoints`, `pointsToFunscript`, `serializeFunscript`                         | The funscript wire format. `funscriptToPoints` sorts and de-duplicates x (last wins). **Not tested** |

---

## 15. Translating the kit (`labels.ts`)

A handful of strings are ones the kit has to say for itself, because a caller
never passes them — the × on a modal, the copy button on a connection key,
the "Loading" a spinner announces, a stepper's increase/decrease. They ship in
English in `labels.ts`.

The kit must stay copy-pasteable, so nothing in this folder may import a host
app's i18n instance — the copy would then only build in the project it came
from. Instead the kit offers a hook. A host with a translator installs one
once, at boot, before anything renders:

```ts
import { setKitLabelResolver } from "@/components/handy";

setKitLabelResolver((key, fallback) => t(`kit.${key}`, fallback));
```

A host without one installs nothing and gets the English defaults. The
resolver is deliberately not reactive on its own: it is expected to read the
host's locale on every call, so a language change re-renders through the same
path as everything else on screen. (That only works for labels read during
render. `HSectionCard` reads its "Expert" label once at setup, so that one
does not follow a language change.)

If you add a component that needs a word of its own, put it in `KIT_LABELS`
and read it through `kitLabel()` — never inline the English. Labels that wrap
the control's name use `kitLabelFor(key, label)` with a `{label}` slot, and
labels with several slots use `kitLabelWith(key, vars)`. Whole sentences are
keys, never fragments to concatenate, because other languages order words
differently.

| Key                                    | English                                | Used by                          |
| -------------------------------------- | -------------------------------------- | -------------------------------- |
| `close`                                | Close                                  | HModal                           |
| `copy`                                 | Copy                                   | HConnectionKey (tooltip)         |
| `copyKey`                              | Copy key                               | HConnectionKey (accessible name) |
| `dismiss`                              | Dismiss                                | HFeedbackCard, `hToast`          |
| `readFullText`                         | Read the full text                     | HTextCard                        |
| `loading`                              | Loading                                | HandyLoader                      |
| `recommended`                          | Recommended                            | HRadioRow                        |
| `expert`                               | Expert                                 | HSectionCard                     |
| `tipLocked`                            | Locked — Esc or click outside to close | HHelpTip                         |
| `tipLockedTouch`                       | Locked — tap outside to close          | HHelpTip                         |
| `increase`                             | Increase {label}                       | HNumberStepper                   |
| `decrease`                             | Decrease {label}                       | HNumberStepper                   |
| `value`                                | value                                  | fallback for an empty `{label}`  |
| `sliderReset`                          | Reset {label}                          | HLabeledSlider                   |
| `sliderValue`                          | {label} value                          | HLabeledSlider, HNumberStepper   |
| `sliderEditValue`                      | Edit {label} value                     | HLabeledSlider, HNumberStepper   |
| `sliderMin`                            | {label} minimum value                  | HLabeledSlider (range)           |
| `sliderEditMin`                        | Edit {label} minimum                   | HLabeledSlider (range)           |
| `sliderMax`                            | {label} maximum value                  | HLabeledSlider (range)           |
| `sliderEditMax`                        | Edit {label} maximum                   | HLabeledSlider (range)           |
| `sliderMenuValue`                      | {label}: {value}                       | HSliderMenu                      |
| `yes` / `no`                           | Yes / No                               | HInfoCard boolean pills          |
| `themeToLight`                         | Switch to light mode                   | HThemeToggle (while dark)        |
| `themeToDark`                          | Switch to dark mode                    | HThemeToggle (while light)       |
| `themeLight`                           | Light mode                             | HThemeToggle tooltip             |
| `themeDark`                            | Dark mode                              | HThemeToggle tooltip             |
| `connected` / `connecting` / `offline` | Connected / Connecting / Offline       | HConnectedDot (button mode)      |

When a key is renamed, every host that translates it has to rename it too.
`tipPin`/`tipClose` became `tipLocked`/`tipLockedTouch` on 2026-09-09. Nothing
checks a host's translation file against `KitLabel`, so a stale key simply
falls back to English.

---

## 16. Tests

`npm test` runs Vitest over `test/**/*.spec.ts` in a Node environment (235
tests on 2026-10-04), then the sync tooling's own tests
(`node --test tools/kit/test/*.test.mjs`: hashing, the lock, edit detection,
changelog slicing, peer ranges, the hook guard, and an end-to-end
`init`/`pull`/`status`/`upstream` run against a throwaway repo).

| Covered                                                                                           | Specs                                                                                                    |
| ------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `graph-edit.ts`, `graph-decimate.ts`                                                              | `graph-edit.spec.ts` (31), `graph-decimate.spec.ts` (3)                                                  |
| `slider-format.ts`                                                                                | `slider-format.spec.ts` (9)                                                                              |
| Background: API surface, host detection, config I/O, legibility, fills, lens scope, burst, scenes | `background-*.spec.ts`, `config-io`, `gradient-legibility`, `lens-*`, `motion-burst`, `scene-erin` (148) |

**Not covered:** every `.vue` component (there is no DOM environment and no
`@vue/test-utils`), `labels.ts`, `keys.ts`, `toast.ts`, `useForwardProgress`,
`usePinnableTip`, `useHandyTheme`, `graph-funscript.ts` and `graph-theme.ts`.
The issues marked _Known issue_ above were all found by reading the code.

Other gates: `npm run typecheck` (vue-tsc), `npm run lint:check` (oxfmt +
oxlint). Keep the folder formatted: an app compares its copy byte for byte,
so an unformatted upstream file looks like drift downstream. There is no CI;
`npm run kit -- upstream finish` runs all four gates (lint, typecheck, test,
build) before it commits a change proposed from an app.

---

## 17. Adding or changing a component

1. **Spec first, or at least alongside.** New behaviour is logged in
   `design_system_needs_to_change.md` §0 and lands in `design.md` chapter 5.
2. **Import siblings relatively** (`./HBtn.vue`, `./labels`). `@/components/handy/…`
   would tie the kit to one host's alias and folder.
3. **Tokens only**, never raw hex. Labels on fills use `--color-text-on-fill`
   / `--color-text-on-warning`. If a surface needs a helper variable, declare it
   in **every** scope (`:root`, `[data-theme="dark"]`, `.section-dark`,
   `.section-light`) in `styles/_tokens.scss`, because a `var()` inside a
   custom property resolves where it is declared.
4. **Every string the component says by itself** goes through `KIT_LABELS`,
   read during render, not in setup.
5. **Link-rendering components** carry `text-decoration: none !important`.
   Native buttons get `type="button"`.
6. **Motion** gets its own `prefers-reduced-motion` block, following the
   decorative-off, essential-static rule.
7. **Emit, don't apply.** No toasts, no store writes, no self-applied state.
8. **Export it** from `index.ts`, put a specimen on `/components` (and in the
   relevant `/showcase` page), and document it here, including its props.
9. **Test it**: at least the pure logic, and ideally a mounted test for the
   accessible name and keyboard path.
10. **Note the consumer impact** in this folder's `CHANGELOG.md`: a new entry
    at the top, and a `Consumer action:` line for anything a host must change
    (a renamed label key, a new peer dependency in `kit.json`, a new global
    rule). `npm run kit -- pull` prints it to every app that takes the copy.
