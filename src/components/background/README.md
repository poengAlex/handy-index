# Gradient background

A soft, grainy, slightly-out-of-focus gradient field for the back of a page.
Ported from the Canva presentation gradients — the deck's look, rebuilt as
live CSS so it scales, re-binds with the theme, and needs no images.

## Copying it into another app

Copy this folder. That is the whole install.

- **Peer dependency: `vue` (3.5+).** Nothing else. No Quasar, no design
  tokens, no router, no store, no build flags.
- Uses `<script setup>` + scoped SCSS, so the host needs `sass` (any Quasar or
  Vite-Vue app already has it).
- Vue 3.5 is required only for `useId()`; drop to 3.3 by replacing that one
  call with a module-level counter.

```vue
<template>
  <div class="page">
    <HandyBackground scene="aurora" />
    <main class="page__content">…</main>
  </div>
</template>

<script setup lang="ts">
import { HandyBackground } from "@/components/background";
</script>

<style scoped>
.page {
  position: relative;
}
/* the only rule you must write yourself */
.page__content {
  position: relative;
  z-index: 1;
}
</style>
```

That is the entire contract: a positioned parent, and content above it.

## Scenes

One word for the whole decision — colour, shape, lens, how it moves, how it
arrives.

| scene    | what it is                                                                      |
| -------- | ------------------------------------------------------------------------------- |
| `calm`   | the default: blue-led, drifting about one blur radius over half a minute        |
| `deck`   | the presentation look: a defined core, wandering a path that never retraces     |
| `aurora` | the loud one, for a hero: Brand Blue into purple on a constant-speed circle     |
| `fog`    | soft and diffuse, breathing rather than moving                                  |
| `lens`   | vignette, heavy grain, a slow tilt whose corners travel further than the middle |
| `crisp`  | big shapes, almost no blur, no grain                                            |
| `still`  | the default look with nothing moving                                            |

## Props

Everything is optional. Precedence runs loosest to tightest: defaults →
`scene` → `config` → individual props.

| prop         | default        | notes                                                       |
| ------------ | -------------- | ----------------------------------------------------------- |
| `scene`      | `"calm"`       | see above                                                   |
| `config`     | —              | an object or JSON string exported from the lab playground   |
| `attach`     | from the scene | `pinned` \| `parallax` \| `travels` \| `banded` \| `inline` |
| `motion`     | from the scene | overrides just the ambient motion                           |
| `mount`      | from the scene | overrides just the entrance                                 |
| `strength`   | from the scene | `0`–`1`; the one knob most apps want                        |
| `speed`      | `1`            | cycle-length multiplier, `0.1`–`24`                         |
| `theme`      | `"auto"`       | `auto` inherits the host's; `light`/`dark` pin it           |
| `band`       | `160`          | `banded` only: how far down the page it reaches, in vh      |
| `mountNonce` | `0`            | change it to replay the entrance                            |

`attach="inline"` fills the nearest positioned ancestor instead of the
viewport — that is the one to use inside a card or a hero band.

## Theming

The dark treatment is not the light one inverted: on light the blobs
**multiply** (ink on paper), on dark they **screen** (light on light), and the
dark fill is painted harder because those two are not symmetric about alpha.

It picks up dark mode from any of `theme="dark"`, a host `[data-theme="dark"]`,
Quasar's `body--dark`, or a `.section-dark` scope. If your app signals dark some
other way, pass `theme` explicitly.

## The one token it reads

`--color-bg-page`, for the haze layer, and only when `haze > 0`. It falls back
to `#fff`, so an app with no token layer still works. Override per instance:

```css
.my-page {
  --bg-surface: #0b0d10;
}
```

## Tuning a new look

Open `/lab/playground` in this repo, drag until you like it, hit **Copy**, and
paste the JSON into your app:

```vue
<HandyBackground :config="myLook" />
```

Configs carry a version and are read through a hardened parser: older ones
migrate, out-of-range values clamp, unknown fields are ignored, and a config
from a _newer_ build is refused rather than guessed at. A malformed config
falls back to the scene instead of throwing at render.

## Accessibility and cost

- Everything stops under `prefers-reduced-motion` — including the scroll-driven
  parallax, which the usual global `animation-duration` override does not catch.
- The field is `aria-hidden`. It is decoration.
- Only `--color-text-primary`-weight ink should sit on bare field. Measured
  across the shipped scenes, secondary ink lands between 2.7:1 and 4.8:1 —
  mostly under AA. Put smaller text on a surface, or check yours:

```ts
import { worstContrast } from "@/components/background";
worstContrast("#1C2B33", { colors, blobs, alpha, blurPct: defocus });
```

- Motion on a wrapper outside the blur is a compositor transform and costs
  nothing. The `blobs`, `wave` and `morph` motions animate _inside_ the blur and
  re-run it every frame — fine for a hero, not for a long list.
