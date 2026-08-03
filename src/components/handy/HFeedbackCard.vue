<template>
  <div :class="['h-feedback', `h-feedback--${severity}`]" role="status">
    <q-icon :name="iconName" size="24px" class="h-feedback__icon" />
    <div class="h-feedback__content">
      <div v-if="title" class="h-feedback__title text-body-compact">{{
        title
      }}</div>
      <div class="h-feedback__body text-body-sm"><slot /></div>
      <div v-if="actionLabel" class="h-feedback__action">
        <HBtn
          variant="secondary"
          size="sm"
          :label="actionLabel"
          @click="emit('action')"
        />
      </div>
    </div>
    <q-btn
      v-if="dismissible"
      flat
      round
      dense
      icon="close"
      size="sm"
      class="h-feedback__close"
      aria-label="Dismiss"
      @click="emit('dismiss')"
    />
  </div>
</template>

<script setup lang="ts">
// Proposed spec for the #1 gap in the legacy gap list
// (design_system_needs_to_change.md → Legacy §1):
// the inline alert / banner / callout surface (FeedbackCard).
// Shape: card bg, 16px radius, 4px semantic left accent (echoes the
// q-notify skin in §7), 24px outlined leading icon, title + body,
// optional secondary action. Severity color + icon, never color alone (§11).
import { computed } from "vue";
import HBtn from "./HBtn.vue";

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
  gap: var(--space-sm);
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

// action sits bottom-right — breaks the text block's left edge; a full
// --space-sm above it separates it from the body so it reads as a distinct
// action, not a crowded last line
.h-feedback__action {
  margin-top: var(--space-sm);
  display: flex;
  justify-content: flex-end;
}

.h-feedback__close {
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

  .h-feedback__icon {
    color: var(--color-feedback-warning);
  }
}

.h-feedback--negative {
  border-color: var(--color-feedback-negative);

  .h-feedback__icon {
    color: var(--color-feedback-negative);
  }
}
</style>
