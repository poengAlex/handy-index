<template>
  <q-btn
    flat
    round
    :icon="dark ? 'light_mode' : 'dark_mode'"
    class="h-theme-toggle"
    :aria-label="dark ? kitLabel('themeToLight') : kitLabel('themeToDark')"
    @click="toggle"
  >
    <q-tooltip>
      {{ dark ? kitLabel("themeLight") : kitLabel("themeDark") }}
    </q-tooltip>
  </q-btn>
</template>

<script setup lang="ts">
// The nav-bar dark-mode toggle — an icon-only round button riding the
// shared useHandyTheme state, so every instance stays in sync and the
// shells stop copy-pasting the markup.
import { useHandyTheme } from "@/components/handy/useHandyTheme";
import { kitLabel } from "@/components/handy/labels";

const { dark, toggle } = useHandyTheme();
</script>

<style scoped lang="scss">
.h-theme-toggle {
  color: var(--color-text-primary);
}
</style>
