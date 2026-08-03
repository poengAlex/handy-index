<template>
  <div class="h-success">
    <q-icon :name="icon" size="40px" class="h-success__icon" />
    <div class="text-h3">{{ title }}</div>
    <p v-if="body || $slots.default" class="text-body-sm h-success__sub">
      <slot>{{ body }}</slot>
    </p>
  </div>
</template>

<script setup lang="ts">
// The trademark success register (§2): two words where four would do —
// "You're welcome." after purchase, "Connected." after pairing. A green
// check, a short bold title, one quiet sub-line.
withDefaults(defineProps<{ title: string; body?: string; icon?: string }>(), {
  body: "",
  icon: "check_circle"
});
</script>

<style scoped lang="scss">
.h-success {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: var(--space-xs);
  padding: var(--space-lg);
  width: 100%;
}

.h-success__icon {
  color: var(--color-feedback-positive);
}

.h-success__sub {
  color: var(--color-text-secondary);
  margin: 0;
}
</style>
