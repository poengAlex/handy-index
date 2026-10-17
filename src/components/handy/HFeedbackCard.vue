<template>
  <div :class="['h-feedback', `h-feedback--${severity}`]" role="status">
    <q-icon :name="iconName" size="24px" class="h-feedback__icon" />
    <div class="h-feedback__content">
      <div v-if="title" class="h-feedback__title text-body-compact">{{
        title
      }}</div>
      <div class="h-feedback__body text-body-sm"><slot /></div>
    </div>
    <!-- after the text in the DOM, so focus reaches the action before the
         close; CSS `order` moves it onto a row of its own below both -->
    <div v-if="actionLabel" class="h-feedback__action">
      <HBtn
        variant="secondary"
        size="sm"
        :label="actionLabel"
        @click="emit('action')"
      />
    </div>
    <q-btn
      v-if="dismissible"
      flat
      round
      dense
      icon="close"
      size="sm"
      class="h-feedback__close"
      :aria-label="kitLabel('dismiss')"
      @click="emit('dismiss')"
    />
  </div>
</template>

<script setup lang="ts">
// The inline alert, banner or callout (design.md 6.6, Inline feedback).
// Shape: card bg, 16px radius, 4px semantic left accent (echoes the toast
// skin), 24px outlined leading icon, title + body, optional secondary action.
// Severity shows in colour and icon, never colour alone (design.md 8).
import { computed } from "vue";
import HBtn from "./HBtn.vue";
import { kitLabel } from "./labels";

const props = withDefaults(
  defineProps<{
    severity?: "info" | "positive" | "warning" | "negative";
    title?: string;
    actionLabel?: string;
    dismissible?: boolean;
    icon?: string;
  }>(),
  { severity: "info", title: "", actionLabel: "", dismissible: false, icon: "" }
);

const emit = defineEmits<{ action: []; dismiss: [] }>();

const icons: Record<string, string> = {
  info: "info",
  positive: "check_circle",
  warning: "warning",
  negative: "error"
};

const iconName = computed(() => props.icon || icons[props.severity] || "info");
</script>

<style scoped lang="scss">
.h-feedback {
  display: flex;
  flex-wrap: wrap;
  column-gap: var(--space-sm);
  align-items: flex-start;
  padding: var(--space-sm) var(--space-md) var(--space-sm) var(--space-md);
  border-radius: var(--radius-md);
  border-left: 4px solid;
  background: var(--color-bg-card);
  box-shadow: inset 0 0 0 1px var(--color-stroke-subtle);
}

.h-feedback__content {
  flex: 1;
  min-width: 0;
}

.h-feedback__title {
  color: var(--color-text-primary);
}

.h-feedback__body {
  color: var(--color-text-secondary);
}

// action sits bottom-right on a row of its own, the card's full width, so it
// lines up with the card's right edge (under the close button) rather than
// with the end of the text; a full --space-sm above it separates it from the
// body so it reads as a distinct action, not a crowded last line
.h-feedback__action {
  order: 2;
  flex-basis: 100%;
  margin-top: var(--space-sm);
  display: flex;
  justify-content: flex-end;
}

.h-feedback__close {
  order: 1;
  color: var(--color-text-tertiary);
}

.h-feedback--info {
  border-color: var(--color-feedback-info);

  .h-feedback__icon {
    color: var(--color-feedback-info);
  }
}

.h-feedback--positive {
  border-color: var(--color-feedback-positive);

  .h-feedback__icon {
    color: var(--color-feedback-positive);
  }
}

.h-feedback--warning {
  border-color: var(--color-feedback-warning);

  // amber is 1.76:1 on a white card; the icon takes the readable warning
  // tier, and the accent bar beside it stays amber
  .h-feedback__icon {
    color: var(--color-text-warning);
  }
}

.h-feedback--negative {
  border-color: var(--color-feedback-negative);

  .h-feedback__icon {
    color: var(--color-feedback-negative);
  }
}
</style>
