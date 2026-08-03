<template>
  <component
    :is="to ? 'router-link' : 'button'"
    :to="to"
    class="h-navcard"
    @click="emit('click')"
  >
    <span class="h-navcard__icon">
      <q-icon :name="icon" size="24px" />
    </span>
    <span class="h-navcard__text">
      <span class="text-body-compact">{{ label }}</span>
      <span v-if="caption" class="text-body-sm h-navcard__caption">{{
        caption
      }}</span>
    </span>
    <q-icon name="chevron_right" size="24px" class="h-navcard__chevron" />
  </component>
</template>

<script setup lang="ts">
// Proposed spec for the NavCard pattern (settings tiles):
// card + leading icon chip + label/caption + trailing chevron.
// Full-surface tap target, hover lift, focus ring per §11.
withDefaults(
  defineProps<{ icon: string; label: string; caption?: string; to?: string }>(),
  { caption: "", to: "" }
);

const emit = defineEmits<{ click: [] }>();
</script>

<style scoped lang="scss">
.h-navcard {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  width: 100%;
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-lg);
  background: var(--color-bg-card);
  border: none;
  text-align: left;
  cursor: pointer;
  text-decoration: none !important;
  color: var(--color-text-primary);
  transition: box-shadow 200ms ease;
  font-family: var(--font-brand);

  &:hover {
    box-shadow: var(--shadow-md);
  }
}

.h-navcard__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-full);
  background: var(--color-bg-page-alt);
  color: var(--color-text-primary);
  flex-shrink: 0;
}

.h-navcard__text {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
}

.h-navcard__caption {
  color: var(--color-text-secondary);
}

.h-navcard__chevron {
  color: var(--color-text-tertiary);
}
</style>

<style lang="scss">
// Shadows don't read on dark, so the light-mode hover lift is invisible
// there. On dark, hover lifts via a hairline outline instead (the dark-mode
// "separation is surface/stroke, not shadow" rule).
[data-theme="dark"] .h-navcard:hover,
.section-dark .h-navcard:hover {
  box-shadow: inset 0 0 0 1px var(--color-stroke-default);
}
</style>
