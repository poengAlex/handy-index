<template>
  <q-btn
    flat
    round
    dense
    :icon="ORIENTATION_ICONS[settings.orientation]"
    :aria-label="`Orientation: ${ORIENTATION_LABELS[settings.orientation]}`"
    class="orientation-menu__btn"
  >
    <q-tooltip>
      Orientation: {{ ORIENTATION_LABELS[settings.orientation] }}
    </q-tooltip>
    <q-menu anchor="bottom right" self="top right">
      <q-list dense class="orientation-menu">
        <q-item-label header class="orientation-menu__header">
          Show me
        </q-item-label>
        <q-item
          v-for="option in ORIENTATIONS"
          :key="option"
          v-close-popup
          clickable
          :active="settings.orientation === option"
          active-class="orientation-menu__item--active"
          @click="settings.orientation = option"
        >
          <q-item-section side>
            <q-icon :name="ORIENTATION_ICONS[option]" size="20px" />
          </q-item-section>
          <q-item-section>{{ ORIENTATION_LABELS[option] }}</q-item-section>
          <q-item-section v-if="settings.orientation === option" side>
            <q-icon name="check" size="18px" />
          </q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>
</template>

<script setup lang="ts">
// Header orientation switcher: the current choice IS the icon, so the active
// filter is readable without opening anything. Writes the same settings field
// the settings dialog and the browse filter modal bind to.
import {
  ORIENTATIONS,
  ORIENTATION_ICONS,
  ORIENTATION_LABELS
} from "@/services/script-index/queries";
import { useSettingsStore } from "@/stores/settings";

const settings = useSettingsStore();
</script>

<style scoped lang="scss">
.orientation-menu__btn {
  color: var(--color-text-primary);
}
</style>

<style lang="scss">
// unscoped — the menu teleports to the body, outside this component's scope
.orientation-menu {
  min-width: 200px;
  font-family: var(--font-brand);
}

.orientation-menu__header {
  color: var(--color-text-tertiary);
  padding: var(--space-xs) var(--space-md) 2px;
  line-height: 1.2;
}

.orientation-menu__item--active {
  color: var(--color-text-link);
}
</style>
