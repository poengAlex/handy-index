<template>
  <q-btn
    flat
    round
    :icon="dark ? 'light_mode' : 'dark_mode'"
    class="h-theme-toggle"
    :aria-label="dark ? lightLabel : darkLabel"
    @click="toggle"
  >
    <q-tooltip>{{ dark ? lightTooltip : darkTooltip }}</q-tooltip>
  </q-btn>
</template>

<script setup lang="ts">
// The nav-bar dark-mode toggle — an icon-only round button riding the
// shared useHandyTheme state, so every instance stays in sync and the
// shells stop copy-pasting the markup.
import { useHandyTheme } from "@/components/handy/useHandyTheme";

// Which label shows is decided by the *current* theme, not by the prop
// name: `lightLabel` is what the button announces while dark mode is on,
// because pressing it goes back to light.
withDefaults(
  defineProps<{
    /** Screen-reader name shown while dark mode is on. */
    lightLabel?: string;
    /** Screen-reader name shown while light mode is on. */
    darkLabel?: string;
    /** Tooltip while dark mode is on — shorter than `lightLabel`. */
    lightTooltip?: string;
    /** Tooltip while light mode is on — shorter than `darkLabel`. */
    darkTooltip?: string;
  }>(),
  {
    lightLabel: "Switch to light mode",
    darkLabel: "Switch to dark mode",
    lightTooltip: "Light mode",
    darkTooltip: "Dark mode"
  }
);

const { dark, toggle } = useHandyTheme();
</script>

<style scoped lang="scss">
.h-theme-toggle {
  color: var(--color-text-primary);
}
</style>
