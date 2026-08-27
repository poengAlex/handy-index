<template>
  <span
    class="h-logo"
    :style="{ height: `${height}px` }"
    role="img"
    :aria-label="label"
    v-html="art"
  />
</template>

<script setup lang="ts">
// The Handy logo. One component, every official lockup — pick with `variant`
// (mark · wordmark · wordmark-2line · horizontal · stacked · horizontal-2line),
// plus the four Handyverse logo concepts (six lockups; variant keys start
// with "handyverse-").
// Rendered in currentColor so it flips black/white per theme (see styles); the
// inverted "2" series isn't needed. `mark` is a back-compat shortcut for
// variant="mark". Nav heights per §7: 24px desktop, 20px mobile.
import { computed } from "vue";
import { handyLogoArt, type HLogoVariant } from "./handy-logo-art";

const props = withDefaults(
  defineProps<{
    height?: number;
    /** which lockup to render */
    variant?: HLogoVariant;
    /** shortcut for variant="mark" (back-compat) */
    mark?: boolean;
  }>(),
  { height: 24, variant: "horizontal", mark: false }
);

const variant = computed(() => (props.mark ? "mark" : props.variant));
const art = computed(() => handyLogoArt[variant.value]);
const label = computed(() =>
  variant.value.startsWith("handyverse-") ? "Handyverse" : "The Handy"
);
</script>

<style scoped lang="scss">
// The logo is strictly black or white — never tinted by theme grays.
.h-logo {
  display: inline-block;
  width: auto;
  color: #000;

  :deep(svg) {
    display: block;
    height: 100%;
    width: auto;
    // force high-precision (anti-aliased) rendering so the fine wordmark
    // detail and the ™ don't soften at small heights
    shape-rendering: geometricPrecision;
  }
}
</style>

<style lang="scss">
[data-theme="dark"] .h-logo,
.section-dark .h-logo {
  color: #fff;
}

// a pinned-light section stays black-ink even inside dark mode
.section-light .h-logo {
  color: #000;
}

// Glass surfaces dictate the ink regardless of theme: light glass is a
// light surface even in dark mode, so the logo stays black on it.
.glass-light .h-logo {
  color: #000;
}

.glass-dark .h-logo {
  color: #fff;
}
</style>
