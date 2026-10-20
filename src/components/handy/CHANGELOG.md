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

## unreleased — The playhead is grabbed near its handle, looks held while dragged, and takes its sizes from the strip

`HPlayhead` answers a drag with more than a brighter glow, and a drag no
longer jumps the handle to the pointer (owner requests 2026-10-20, design.md
v4.5).

- **Held:** the cap scales 1.5 × 1.4 down from the strip's edge and its glow
  goes from 9px to 16px; the beam scales 1.5× wide and keeps 80% of its
  strength at 60% down and 30% at the floor (45% and 8% at rest). It eases in
  120ms, instantly under reduced motion. Scales rather than sizes, so a host
  that set `--h-playhead-width` or the cap's size keeps its proportions.
- **Grab radius:** new prop `grabRadius` (default 12px; a touch gets at least
  22px). Within it of the handle the cursor is `grab`, and a press takes hold
  of the handle where it is: it doesn't jump to the pointer, it moves by
  however far the hand does. Anywhere else on an interactive strip the cursor
  stays `pointer` and a press seeks to that spot, then drags from there, as
  before. `grabbing` while held either way; pointer capture keeps it when the
  drag leaves the strip.
- **New prop `held`:** draws the held look, and the `auto` label, on a
  playhead that isn't the one scrubbing. It is for an indicator over a strip
  that keeps its own gestures (the classifier's timeline, where a drag can
  also move a scene boundary) and does the dragging itself; that host gives
  the strip its cursors and its own grab radius.
- **Fix, per-surface theming:** `--h-playhead-width`, `-cap-width`,
  `-cap-height` and `-surface` set on the strip around the playhead were
  ignored, because the component declared its own defaults on its root and
  those shadowed the inherited values. Only the two colours worked from the
  strip. All six now work from the strip or on the component. This changes
  how the wash looks wherever a host already set `--h-playhead-surface` on
  the strip: scripter4's density heatmap sets it to `--color-bg-page-alt`, so
  its wash turns from the page colour to the strip's own, as intended.
- Consumer action: If the app sets `--h-playhead-width`, `--h-playhead-cap-width`, `--h-playhead-cap-height` or `--h-playhead-surface` anywhere, check the playhead after the pull: a value that was silently ignored before now applies.
- The showcase's graphs page puts it on a real script strip, scripter4's
  heatmap with its time ruler along the floor, in place of the banded
  stand-in: under the script's timeline with a script and a device to pick
  (Handy 1 at 400 mm/s, Handy 2 Pro OC at 800 mm/s), and the same script on
  both devices side by side. New specimens show each customisation: the
  label modes, no handle, a heavier wash, a bigger handle and another ink set
  on the strip, light and dark surfaces, keyboard steps and the `pan` event.

## unreleased — The fat slider leaves 0% without its corners jumping

`HFatSlider`'s track no longer switches its corners at the minimum (owner
request 2026-10-19). At exactly 0% the corners beside the handle were squared
so 0% read like 100%, and one step later they jumped back to the full 20px
curve, which showed beside the handle until the fill covered it.

- **The start corners follow the fill:** their radius along the track is the
  fill's length, from 2px at 0% to the track's 20px, so the corner rounds
  under the fill, the way the far end's cap comes out from under the handle
  near 100%. Across the track it stays 20px. Horizontal and vertical (the
  bottom corners) alike.
- It eases with Quasar's own fill animation (0.28s) and is instant mid-drag.
- The root carries `--h-fat-ratio` (0–1) for it; the `h-fat__slider--zero`
  class is gone.

## unreleased — The stepper's buttons hold still

`HNumberStepper`'s value keeps the width of the widest it can show, so the −
and + buttons no longer move as it changes (owner ruling 2026-10-19,
design.md v4.4, 6.4).

- **The widest value** comes from the bounds, the step, `decimals`,
  `maxDecimals` and the unit. It is laid invisibly under the number (a
  zero-height `::after` from `data-widest` on the readout), so the width is
  the font's own in tabular figures. A value with more places than that (a
  third reads 0.333) widens the readout, which keeps that width until the
  bounds, step or unit change.
- **Click-to-type keeps the box too:** the field takes the readout's width.
  It took the browser's default width, about twenty characters, and pushed
  the − button some 70px aside.
- An app that reserved the readout's width itself (a `min-width` on
  `.h-stepperctl__value`, as the classifier's settings do to line two
  steppers up) can keep it: a minimum still applies on top.

## unreleased — Segmented tracks show on Soft Gray and on dark cards

`HSegmented`'s track, `--h-segmented-track`, takes per-surface fills the way
the chip fill does, in `styles/_tokens.scss` (owner ruling 2026-10-17,
design.md v4.3, 5.2.2 and 6.4).

- **Every scope declares the track** and the two fills a surface picks from,
  `--h-segmented-track-page` (on the page and on cards) and
  `--h-segmented-track-page-alt` (on a Soft Gray surface), beside the chip's.
  The OS-dark block before `data-theme` is stamped declares both. Light is as
  before: Soft Gray on the page and on cards, card white on Soft Gray.
- **Dark is 10% white on every surface**, as the chip. It was the dark
  page-alt tint: 1.07:1 on a dark card, so every track in a dark card, panel
  or dialog nearly vanished, and 1.21:1 on the page. Now about 1.37:1 on the
  page, on cards and on Soft Gray. Only on pure black (`--color-bg-hero-dark`)
  is it lower than before, 1.21:1 against 1.52:1.
- **`.h-section--alt` sets the track** to the Soft Gray fill. A track on the
  band was the page-alt tint on page-alt, so only its hairline ring showed,
  in both themes. A card on the band (the same list as for the chip) takes
  the page's fill back. The list also names the vanilla kit's `.h-card` and
  `.h-feedback-card` now, which no Vue app uses; on the band, their chips,
  "?"s and tracks were white on white in light.
- `HSegmented` is unchanged apart from comments. Its `var()` fallback, the
  page-alt tint, now applies only on a page without the kit's tokens.

- Consumer action: If the app has a Soft Gray (`--color-bg-page-alt`) surface of its own with an `HSegmented` on it, set `--h-segmented-track: var(--h-segmented-track-page-alt)` on that surface, replacing any colour it sets there (`var(--color-bg-card)` is right on light only), and `--h-segmented-track: var(--h-segmented-track-page)` on any card that sits on it. Until then the track there is Soft Gray on Soft Gray in light.
- Consumer action: If the app lifts segmented tracks off dark cards, panels or dialogs with its own rule (a background on `.h-segmented`, or `--h-segmented-track` set on those surfaces), delete it: the kit's dark track is 10% white on every surface.

## unreleased — Chips show on the Soft Gray band and on an unstamped dark page, graphs follow the OS theme, and the playhead and carousel arrows translate

Three bugs the vanilla kit's port found and worked around, fixed at the source.

- **The chip fill (`--h-chip-bg`, which `HChip` and the `HHelpTip` "?"
  paint)**, in `styles/_tokens.scss`:
  - Before `data-theme` is stamped on a dark OS it was the dark page-alt
    instead of 10% white, so a chip on a dark card was card on card. In an
    app that stamps the theme at mount that was the first frame; on a page
    that never stamps one, it was every frame.
  - A card on a Soft Gray `.h-section--alt` band inherited the band's card
    white, so every chip and "?" on it was white on white. A card on the band
    (`q-card`, `HSectionCard`, `HInfoCard`, `HList`, `HProductCard`,
    `HTextCard`, `HFeedbackCard`) now takes the page's fill back.
  - On dark the band handed out the card colour too, darker than the band
    itself and close to invisible on it. It is 10% white now, as design.md
    5.2.2 has it for every dark surface.
  - New: every scope also declares the two fills a surface picks from,
    `--h-chip-bg-page` (on the page and on cards) and `--h-chip-bg-page-alt`
    (on a Soft Gray surface). A surface that names one of them instead of a
    colour is right in both themes and inside either island.
- **`.h-section--alt` sets `--h-slider-gap`** to its own colour. A slider on
  the band wore a page-coloured halo, white on light and the darker page on
  dark. A card on the band sets its own colour back.
- **`graph-theme.ts` follows the OS theme while `<html>` has no
  `data-theme`**, as the tokens do. A page that followed a dark OS without
  stamping one drew the light series ramp (Brand Blue and Dark Charcoal) on
  dark tokens. `watchGraphTheme` also re-runs when the OS theme changes. The
  new `test/graph-theme.spec.ts` covers both.
- **Three new kit labels.** `playhead` ("Playhead") names an interactive
  `HPlayhead` that is given no `ariaLabel` (the prop's default is now `""`;
  the inline English was the one kit string that bypassed `labels.ts`).
  `carouselPrevious` and `carouselNext` ("Navigate to previous slide",
  "Navigate to next slide", vue3-carousel's own words) name `HPeekCarousel`'s
  arrows: the button, its tooltip and its icon's title. Untranslated, nothing
  reads differently.

- Consumer action: If the app translates the kit's labels (it passes `labels` to `installHandyKit`), add `playhead`, `carouselPrevious` and `carouselNext` to every locale's kit block, with the English "Playhead", "Navigate to previous slide" and "Navigate to next slide". Until then those three stay English.
- Consumer action: If the app sets `--h-chip-bg: var(--color-bg-card)` (or another colour) on a Soft Gray surface of its own, set it to `var(--h-chip-bg-page-alt)` instead, which is right on dark too, and put `--h-chip-bg: var(--h-chip-bg-page)` on any card that sits on that surface.
- Consumer action: If the app works around any of these bugs (its own `--h-chip-bg` rule for `prefers-color-scheme: dark`, chip-fill or slider-gap rules for cards or sliders on `.h-section--alt`, a `matchMedia` check around `resolveGraphTheme`), delete the workaround.

## unreleased — The playhead is a light beam in the surface's ink, on the strip and the chart

- `HPlayhead` is a **light beam** (owner ruling 2026-10-16, picked from
  eight handles on scripter4's previews page): a small glowing cap at the top
  casting a 2px beam down the strip that fades as it falls. The cap glows
  brighter while the strip is dragged; the label still shows only while it
  is pointed at or dragged (`showLabel: "auto"`), and the ahead-wash is as
  before.
- It is drawn in the surface's **ink**, `--color-text-primary` — white on
  dark, near-black on light — instead of `--color-feedback-negative` red.
  `HGraph`'s playhead line (`graph-theme.ts` `cursor`) moves to the same
  token, so a chart and the strip under it still read as one instrument.
- The label's text is `--h-playhead-on-color` (default `--color-text-inverse`),
  so it reads on the ink. New: `--h-playhead-cap-width` (8px) and
  `--h-playhead-cap-height` (10px); `--h-playhead-width` is now the beam's
  thickness (2px). Gone, with the gap: `--h-playhead-gap-width` and
  `--h-playhead-inset`.

- Consumer action: If the app sets `--h-playhead-gap-width` or `--h-playhead-inset`, delete those lines; they no longer do anything. If it sets `--h-playhead-width` to thicken the old handle, delete that too unless a beam that thick is wanted.
- Consumer action: If the app sets `--h-playhead-color` to a saturated colour, also set `--h-playhead-on-color: var(--color-text-on-fill)` beside it, or the label's text is the inverse ink on that colour.
- Consumer action: If the app's own words or code say the playhead or the chart's cursor is red (help text, a legend, a comment, a test), update them: both are the surface's ink now.

## unreleased — Glass blurs in Chrome again, rings draw their track, and rows and tiles fit a phone

- **Every blur was missing in Chrome**, live too: the glass header, dialog
  and drawer backdrops, the carousel arrows. Rules that wrote the `-webkit-`
  form beside the standard `backdrop-filter` came out of the build with the
  prefixed one only, which Chrome ignores. The kit now writes the standard
  property alone and autoprefixer adds the prefix Safari needs.
- `HCircleProgress` draws its track: Quasar draws it only when a track colour
  is given, and the kit never gave one, so a ring at 0 was bare text.
- `HListRow`: a trailing control too wide to sit beside the text (a
  segmented control on a phone) wraps under it, right-aligned, instead of
  running over the caption.
- `HIconTile` grows taller than square when its label needs a second line;
  on a narrow tile the label was sliced in half.
- `HSegmented`: spread segments drop the natural width's extra padding, so
  three labels fit a phone's width.
- `HGraph`: a region's `label` is drawn, top left inside its shading, and a
  series of one point shows as a dot (uPlot draws nothing for a single point).

- Consumer action: If the app writes `-webkit-backdrop-filter` beside `backdrop-filter`, delete the prefixed line (and its entry in a `transition` list); otherwise its blur is missing in Chrome.

## unreleased — Menus on the card surface, quiet field helpers, an instant theme switch, and fixes from the kit review

- Every `q-menu` and `q-select` popup is on the card surface with
  `--shadow-lg`, as design.md 5.5 says. Quasar painted them white with its own
  shadow, and on dark in the page colour, so `HSliderMenu`'s handle wore a
  card-coloured halo there.
- A field's helper text is caption size in the tertiary ink; Quasar's dense
  fields set it at 11px. Errors keep Quasar's error colour.
- The theme switches in one frame: `useHandyTheme` turns transitions off until
  the new theme has painted, so labels no longer cross-fade between the two
  themes' colours (design.md 9.2).
- `HCircleProgress` never sets its number under 12px; `HIconTile` lifts on
  `--shadow-md`; `HGraph`'s axis labels name the variable Figtree first;
  `HHelpTip`'s scrollbar stops short of the sheet's corners; `HPlayhead`'s
  label size has a fallback.
- `HNumberStepper`: float dust in a computed `step` no longer lifts the
  decimal cap, and opening the field and leaving it untouched no longer
  rounds the value. `HInfoCard`: a `null` or blank value reads as a dash too.

- Consumer action: If the app restyles `q-menu` to put it on the card colour or give it a shadow, delete that rule unless it means to differ.

## unreleased — Handyverse has two lockups, and an empty info-card row reads as a dash

- `HLogo`: the Handyverse logo is two lockups now, `handyverse` (the mark and
  the wordmark) and `handyverse-wordmark`. The "the handyverse" concepts (V1,
  V4) are retired. The old names keep rendering: `handyverse-v2-horizontal` is
  `handyverse`, `handyverse-v3-horizontal` is `handyverse-wordmark`, and the
  retired ones fall back to the nearer of the two. The art table drops from
  about 46 KB to 27 KB of source.
- `HInfoCard`: a row with no value, yes/no or badge shows an em dash in the
  tertiary text colour instead of an empty cell, as design.md 6.5 says.
- Comments only: `HLabeledSlider`'s `editable` note (each end of a range can be
  typed), `HConnectedDot`'s colour name (Connected Purple).

- Consumer action: Replace `variant="handyverse-v2-horizontal"` with `variant="handyverse"` and `variant="handyverse-v3-horizontal"` with `variant="handyverse-wordmark"`.
- Consumer action: If the app uses `handyverse-v1-*` (with the mark), switch to `handyverse`; if it uses `handyverse-v4-*` (without), switch to `handyverse-wordmark`. A stacked one becomes a single line, about 1.7 times as wide at the same height, so check the space it sits in.
- Consumer action: Optional: where the app passes `"—"` as an info-card value by hand, it can drop it.

## unreleased — Modal and text-card scrollbars run down the card's edge, a closing sheet holds still, and the stepper rounds its readout

- `HModal`: the body's scrollbar sits on the card's right edge instead of 12px
  inside it. The body reaches across the card's side padding and takes it back
  as its own, so the content doesn't move.
- `HTextCard`: the same for its scroll area, with the thumb held 4px in from
  the edge. The text now keeps 24px on both sides; it used to keep 40px on the
  right to clear the thumb.
- Dialogs no longer slide sideways while they close, which was clearest on a
  bottom sheet. On Quasar up to 2.23 the page's scrollbar vanished under an
  open dialog (the kit's clip on `<html>` kept Quasar's forced bar off the
  window) and came back mid-animation as it left. The kit now lifts that clip
  for the length of the lock (`styles/_quasar.scss`), so the bar stays put.
  Quasar 2.34 reserves the bar's space itself and is untouched. Only classic
  scrollbars showed it.
- `HFeedbackCard`: the action moves to a row of its own, so it lines up with
  the close button at the card's right edge instead of stopping short of it.
- `HNumberStepper`: the readout shows at most three decimals (new prop
  `maxDecimals`, default 3; a `step` or `decimals` that needs more wins) and
  drops trailing zeros. A value the app hands in as `0.30000000000000004` reads
  0.3. A step now rounds the value to what the readout shows (it kept up to
  six places before), and a step with float dust in it, like
  `(1.1 - 0.4) / 100`, counts as the 0.007 it means.

- Consumer action: If the app styles `.h-feedback__action` as a child of `.h-feedback__content`, select it as a child of `.h-feedback`; it moved.
- Consumer action: If the app needs a stepper readout finer than three decimals without a step that fine, pass `:max-decimals`.
- Consumer action: If the app wraps an `HModal`'s content in its own `q-scroll-area`, drop the wrapper and let the body scroll, so the bar sits on the card's edge; if it must stay, give it `margin-right: calc(-1 * var(--h-modal-pad-x))` and `:horizontal-offset="[0, 4]"`.

## unreleased — The completion mark draws its ring and tick, and nothing else

`HSuccessMark` no longer flashes a filled halo in as the tick starts. It read
as a button being pressed. The ring draws, then the tick; the timing and
`duration` are unchanged.

- Consumer action: If the app styles `.h-mark__halo`, delete that rule; the element is gone.

## unreleased — Tooltips take 8px corners, 13px becomes the named compact size, and nothing is set below 12px

Rulings from the design.md version 4 review. A tooltip's corners are 8px
(`--radius-xs`): at the menus' 16px a one-line tooltip turned into a pill and
read as a chip. The 13px used by `HSegmented`'s compact size and the
`HHelpTip` sheet is now a token, `--text-compact-size`, for dense tool UI only.
The help tip's foot and `HPlayhead`'s label move from 11px to 12px, the type
scale's floor. The help-tip sheet takes the menus' 16px corners.

- Consumer action: Optional: where the app sets 13px on a dense control of its own, use `var(--text-compact-size)`; where it sets 11px, move it to 12px.

## unreleased — Light glass is back to 0.8

`.glass-light` is `rgba(241, 244, 247, 0.8)` again, the spec's value. 0.94 came
from onboardingv4, whose grey sections stopped at the 1440px column so the
edge showed through the bar on a wide window; the fix for that is full-bleed
sections, which the spec asks for anyway. At 0.94 the bar was nearly opaque
over imagery, which is the one place glass is for.

- Consumer action: If the app's own section backgrounds stop at the content column, make them full-bleed (the background edge to edge, the content in the container); otherwise the column's edge shows through the light glass.
- Consumer action: If the app re-declares `.glass-light` at 0.94, delete it.

## unreleased — Warning icons use the readable warning colour

Palette amber is 1.76:1 on a white card. `HFeedbackCard`'s warning icon and the
warning toast's icon now use `--color-text-warning`; the amber accent bar beside
them stays.

## unreleased — Rulings on onboardingv4's overrides

The design.md version 4 review ruled on three of onboardingv4's app overrides.
Two are rejected:

- The swapped light surfaces (Soft Gray cards on a white page): cards stay white
  on Soft Gray sections, and a card on a surface of its own colour takes
  `.h-lifted`.
- The blanket reduced-motion clamp (`* { animation-duration: 0.01ms !important; … }`):
  it stops spinners and progress too. The kit's per-class handling covers it.

The third, its stepper with step numbers, is still open.

- Consumer action: If the app swaps the light surfaces, delete the swap (`--color-bg-card: #f1f4f7` and `--color-bg-page-alt: #ffffff` in light mode) and put `.h-lifted` on any card that now sits on a surface of its own colour.
- Consumer action: If the app has a blanket `prefers-reduced-motion` clamp, delete it. First check what it was also stopping: if the app relied on it for Quasar's own dialog, menu or drawer transitions, give those a reduced-motion rule of their own.

## unreleased — design.md version 4: the Quasar mechanics live in this README

design.md became a spec only, restructured into foundations, components,
patterns, accessibility, surfaces and content. The Quasar mechanics it used to
carry in section 5.12 are now §18 here, and the README's references follow
the new section numbers. Nothing changes for the host.

## unreleased — Dark and light islands carry the whole token set, so nothing in them keeps the page's colours

`.section-dark` and `.section-light` used to re-declare a shorter list of their
own. Error, warning and success text, the error stroke, inverse text, the
overlay and the hero surface kept the page's values inside them, so a success
badge in a dark island on a light page rendered `#1f6b3a` on `#1c1e21` (2.6:1)
and a light island on a dark page fell to 1.6–2.3:1. Both now include the
same token mixins as the themes (`light-tokens`, `dark-tokens` in
`styles/_tokens.scss`), so they can't drift again. `.section-light` also gets
its own `--h-chip-bg`: a light island on a dark page used to inherit the dark
chip fill, 10% white on white, and every HChip and help-tip `?` in it
disappeared.

- Consumer action: If the app's `app.scss` patches tokens inside `.section-dark` or `.section-light` (error, warning or success text, the chip fill), delete those lines; the kit sets them now. Keep anything app-specific.

## unreleased — Every disabled control is 50%

Quasar dims disabled things with its own !important rules: 60% generally,
70% on `q-btn`, 75% on `q-toggle` and `q-radio`. They beat the kit's 50%, so
a disabled control looked different from one kind to the next, from 30% (a
text field, dimmed three times over) to 75%. The kit now sets 50% for all of
them, and a disabled control inside a disabled control (a stepper's buttons)
doesn't dim a second time. `HSegmented` keeps its documented 70% for a whole
disabled control, so the chosen segment stays readable.

- Consumer action: If the app sets its own opacity for disabled controls (`.disabled`, `[disabled]`, `.q-btn.disabled`, `.q-field--disabled`), delete it unless it is a deliberate exception.

## unreleased — Tooltips, flat cards and HModal's bottom sheet ship in the kit

Three things the spec defines lived only as page CSS in the brand-ux
showcase:

- **Tooltip.** Every `q-tooltip` now wears the kit's skin: a small dark label
  (`--color-bg-hero-dark` with `--color-text-on-fill`), the menus' 16px
  radius, caption type (Quasar's 14px stays on a phone), and a hairline on a
  dark page. Quasar's default was grey from outside the palette at 10px.
- **Cards.** `q-card` is flat by default; Quasar gave every card without
  `flat` a shadow. A lifted card takes `.h-lifted` (`--shadow-sm` on light, a
  hairline on dark); an outlined one takes `bordered`, now on
  `--color-stroke-subtle`, or `.h-outlined` on a card that isn't a `q-card`.
- **Sheet.** `HModal sheet`, inside `<q-dialog position="bottom">`, rounds only
  its top corners and carries a centred drag handle.

- Consumer action: If the app styles `.q-tooltip` or adds a class to its tooltips to restyle them, delete what the kit now covers.
- Consumer action: Replace any app-local "lifted card" shadow with `.h-lifted`, and any hand-built bottom sheet with `HModal sheet`. `flat` on a `q-card` is harmless and can stay.

## unreleased — Tokens for the type scale, monospace, a 4px step and the secondary button's hover

New in `styles/_tokens.scss`, all with the values components already used:
`--text-display-size` … `--text-caption-size` (one per type role; the
`.text-*` classes read them), `--font-mono`, `--space-2xs` (4px, for the
inside of a component only) and `--color-action-secondary-hover-stroke`.
The last one fixes a spec bug: a secondary `HBtn`'s border turned Brand Blue
on hover, which on dark is dimmer than its white resting border, so the
button faded when you pointed at it. On dark it now turns Brand Blue Light.
The kit's components use the new tokens instead of literals; only four
off-scale sizes are left as they were (13px in `HSegmented` sm and the
`HHelpTip` sheet, 11px in its foot and in `HPlayhead`'s label).

- Consumer action: Optional: where the app's own CSS repeats a type-role size, the monospace stack or a 4px gap inside a component, use the token.

## unreleased — Prop names line up: disable, step, severity, size

The kit's API conventions (README §2) are now true everywhere:

- `HIconTile` takes `disable` (was `disabled`).
- `HNumberStepper` takes `step` (was `stepSize`), and a new `disable` takes the
  whole control out. Stepping rounds to the step's places, so 0.1 + 0.2 reads
  0.3.
- `HCircleProgress` takes `severity: info | positive | warning | negative`
  for the arc (was a free CSS `color`).
- `HSegmented` takes `severity="warning"` (was `tone="warning"`).
- `HFeaturePoint` takes `size: md | lg` (was the boolean `lg`).
- `HHelpTip`'s `size` takes a px number; a CSS length still works.
- `HFatSlider` and `HRadioRow` gain `disable`, as `HToggleRow` already had.

Every old name still works, marked deprecated.

- Consumer action: Rename at the call sites: `:step-size` → `:step` on HNumberStepper, `tone=` → `severity=` on HSegmented, `color="var(--color-feedback-x)"` → `severity="x"` on HCircleProgress, `disabled` → `disable` on HIconTile, `lg` → `size="lg"` on HFeaturePoint.

## unreleased — Class names all take the h- prefix, and small fixes from the design-system audit

`HSectionCard`'s root class is `.h-section-card`, no longer the page band's
`.h-section`, so a rule written for page bands stops landing on every
section card. `HHoldBtn` is `.h-hold-btn` (was `.hold-btn`) and `HandyLoader`
is `.h-loader` (was `.handy-loader`). Also:

- `HSectionCard`'s Expert pill is sentence case (it was uppercase, against the
  no-all-caps rule), and its label is read at render, so a language switch
  reaches it.
- `HandyLoader` holds the "h" still under reduced motion. Its morph is SMIL,
  which no CSS media query can pause, so it kept animating.
- `HIconTile` is `type="button"`, so it no longer submits an enclosing form.
- Shadows come from the scale: `HGraph`'s readout chip is `--shadow-sm`, the
  `HHelpTip` sheet `--shadow-lg` (locked: `--shadow-xl`). Card hover lifts and
  the toast's × fade take the system's 180ms.

- Consumer action: If the app's CSS targets `.h-section` or one of its element classes (`.h-section__action`, `__head`, `__title`, `__hint`, `__body`) to reach an HSectionCard, use `.h-section-card` and `.h-section-card__*`; rename `.hold-btn` / `.handy-loader` selectors to `.h-hold-btn` / `.h-loader` the same way. A page-band rule on `.h-section` no longer touches HSectionCard, which is the point.

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
