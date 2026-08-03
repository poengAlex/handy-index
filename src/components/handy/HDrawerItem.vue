<template>
  <component
    :is="to ? 'router-link' : 'a'"
    :to="to || undefined"
    :class="[
      'h-drawer-item',
      {
        'h-drawer-item--active': active,
        'h-drawer-item--centered': centered
      }
    ]"
    @click="emit('click')"
  >
    <q-icon v-if="icon" :name="icon" size="20px" />
    <span class="text-body-compact">{{ label }}</span>
  </component>
</template>

<script setup lang="ts">
// A drawer / hamburger-panel nav row (§7): compact weight-500 label on the
// card surface, optional leading icon, active state in the link colour.
// Active is an explicit prop (compute it from the route) — the built-in
// router-link active classes are disabled so prefix-matching can't light
// up a parent link by accident. `centered` is the text-only flavour;
// icons and centering don't mix.
withDefaults(
  defineProps<{
    label: string;
    icon?: string;
    to?: string;
    active?: boolean;
    centered?: boolean;
  }>(),
  { icon: "", to: "", active: false, centered: false }
);

const emit = defineEmits<{ click: [] }>();
</script>

<style scoped lang="scss">
.h-drawer-item {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  padding: 10px var(--space-sm);
  border-radius: var(--radius-sm);
  color: var(--color-text-secondary);
  cursor: pointer;
  text-decoration: none !important;
  transition:
    color 180ms ease,
    background 180ms ease;

  &:hover {
    color: var(--color-text-primary);
  }
}

.h-drawer-item--active {
  // text-link, not action-primary: Brand Blue as *text* on dark fails
  // contrast; the link token resolves to Brand Blue Light there
  color: var(--color-text-link);
  background: var(--color-bg-page-alt);
}

.h-drawer-item--centered {
  justify-content: center;
}
</style>
