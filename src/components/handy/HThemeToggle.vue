<template>
  <HBtn
    variant="tertiary"
    round
    :icon="dark ? 'light_mode' : 'dark_mode'"
    class="h-theme-toggle"
    :aria-label="dark ? kitLabel('themeToLight') : kitLabel('themeToDark')"
    @click="toggle"
  >
    <q-tooltip>
      {{ dark ? kitLabel("themeLight") : kitLabel("themeDark") }}
    </q-tooltip>
  </HBtn>
</template>

<script setup lang="ts">
// The nav-bar dark-mode toggle — an icon-only round button riding the
// shared useHandyTheme state, so every instance stays in sync and the
// shells stop copy-pasting the markup. HBtn rather than a bare q-btn so
// every button in the top chrome is the same component (§7) — tertiary's
// label token is --color-text-primary in every theme, so the rest colour
// is unchanged and hover picks up the tertiary Brand Blue.
import HBtn from "./HBtn.vue";
import { useHandyTheme } from "./useHandyTheme";
import { kitLabel } from "./labels";

const { dark, toggle } = useHandyTheme();
</script>

<style scoped lang="scss">
.h-theme-toggle {
  color: var(--color-text-primary);
}
</style>
