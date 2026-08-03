<template>
  <q-btn
    unelevated
    no-caps
    :class="['h-btn', `h-btn--${variant}`, `h-btn--${size}`]"
    :flat="variant === 'tertiary'"
    :outline="variant === 'secondary'"
    :round="round"
  >
    <slot />
    <span v-if="label" class="h-btn__label"
      >{{ label }}<span v-if="arrow">&nbsp;→</span></span
    >
    <!-- DESIGN.md §9: subtle/inline loading tier inside buttons -->
    <template #loading>
      <q-spinner-dots />
    </template>
  </q-btn>
</template>

<script setup lang="ts">
// DESIGN.md §7 Buttons — three variants, pill shape, sentence case.
// Cheek lives in the surrounding copy, never in the button.
withDefaults(
  defineProps<{
    variant?: "primary" | "secondary" | "tertiary" | "danger";
    size?: "sm" | "md" | "lg";
    label?: string;
    /** Trailing arrow — hero/product primary CTAs only */
    arrow?: boolean;
    round?: boolean;
  }>(),
  { variant: "primary", size: "md", label: "", arrow: false, round: false }
);
</script>

<style scoped lang="scss">
.h-btn {
  border-radius: var(--radius-full);
  font-size: 14px;
  line-height: 143%;
  transition:
    background 180ms ease,
    color 180ms ease;

  // labels never wrap — truncate; a truncating label means the copy
  // is too long (§2: short over long). column-gap supplies the §5
  // icon-to-label spacing — Quasar's .on-left class isn't applied when
  // the label renders via slot.
  :deep(.q-btn__content) {
    flex-wrap: nowrap;
    min-width: 0;
    column-gap: var(--space-xs);
  }
}

.h-btn__label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.h-btn--sm :deep(.q-btn__content) {
  padding: 0;
}

.h-btn--sm {
  padding: 8px 16px;
}

.h-btn--md {
  padding: 12px 24px;
}

.h-btn--lg {
  padding: 14px 28px;
}

.h-btn--primary {
  background: var(--color-action-primary) !important;
  color: var(--color-action-primary-label) !important;

  &:hover {
    background: var(--color-action-primary-hover) !important;
  }
}

.h-btn--secondary {
  color: var(--color-action-secondary-label) !important;

  &:before {
    border: 1px solid var(--color-action-secondary-stroke);
  }

  &:hover:before {
    border-color: var(--color-action-primary);
  }
}

// Destructive — pairs with a tertiary Cancel; label is the actual verb (§2)
.h-btn--danger {
  background: var(--color-feedback-negative) !important;
  color: var(--color-text-on-fill) !important;

  &:hover {
    filter: brightness(0.88);
  }
}

.h-btn--tertiary {
  color: var(--color-action-tertiary-label) !important;

  &:hover {
    color: var(--color-action-tertiary-hover) !important;
  }
}

// Icon-only round buttons: equal width/height, circular bounding box
.h-btn.q-btn--round {
  padding: 0;
}
</style>
