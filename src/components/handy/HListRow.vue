<template>
  <q-item
    v-ripple="clickable || !!to"
    :clickable="clickable"
    :to="to || undefined"
    class="h-list-row"
    :class="{ 'h-list-row--active': active }"
    @click="onClick"
  >
    <q-item-section
      v-if="icon || $slots.leading"
      avatar
      class="h-list-row__leading"
    >
      <slot name="leading">
        <q-icon :name="icon" size="24px" />
      </slot>
    </q-item-section>

    <q-item-section>
      <q-item-label class="h-list-row__label">
        <span class="text-body-compact">{{ label }}</span>
        <slot name="suffix" />
      </q-item-label>
      <q-item-label v-if="caption" class="h-list-row__caption text-body-sm">{{
        caption
      }}</q-item-label>
    </q-item-section>

    <q-item-section
      v-if="chevron || $slots.trailing"
      side
      class="h-list-row__trailing"
    >
      <slot name="trailing">
        <q-icon name="chevron_right" size="20px" class="h-list-row__chevron" />
      </slot>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
// A single grouped-list row — the canonical "settings / menu row" (Cards →
// Card rules, row-list form). Card surface, hover tint, 52px min target;
// HList draws the inset hairline when grouped. The #leading slot takes a
// radio, the #trailing slot a toggle/value; otherwise a chevron
// promises the forward page transition. The whole row is the tap target.
const props = withDefaults(
  defineProps<{
    label: string;
    caption?: string;
    icon?: string;
    chevron?: boolean;
    clickable?: boolean;
    active?: boolean;
    /** route target — renders the row as a router-link (like HNavCard) */
    to?: string;
  }>(),
  {
    caption: "",
    icon: "",
    chevron: false,
    clickable: true,
    active: false,
    to: ""
  }
);

const emit = defineEmits<{ click: [] }>();

function onClick() {
  if (props.clickable || props.to) emit("click");
}
</script>

<style scoped lang="scss">
.h-list-row {
  position: relative;
  min-height: 52px;
  padding: var(--space-sm) var(--space-md);
  color: var(--color-text-primary);
  // rows with `to` render as anchors — no link underline (same as HNavCard)
  text-decoration: none !important;
}

// keep the leading icon / control tight rather than the 56px avatar gutter
.h-list-row__leading {
  min-width: 0;
  color: var(--color-text-secondary);
}

.h-list-row--active {
  color: var(--color-text-link);
}

// brand row-hover tint instead of Quasar's neutral wash (only when clickable)
.h-list-row.q-item--clickable:hover {
  background: var(--color-row-hover);
}

.h-list-row :deep(.q-focus-helper) {
  display: none;
}

.h-list-row__label {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  flex-wrap: wrap;
}

.h-list-row__caption {
  color: var(--color-text-secondary);
}

.h-list-row__chevron {
  color: var(--color-text-tertiary);
}
</style>
