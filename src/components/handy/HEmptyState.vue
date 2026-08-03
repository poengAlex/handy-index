<template>
  <div class="h-empty">
    <q-icon :name="icon" size="40px" class="h-empty__icon" />
    <p class="text-body prose">
      <strong>{{ title }}</strong>
      {{ body }}
    </p>
    <HBtn
      v-if="actionLabel"
      variant="secondary"
      size="sm"
      :label="actionLabel"
      @click="emit('action')"
    />
  </div>
</template>

<script setup lang="ts">
// Empty states per §2: bold what-happened lead, one line of medium
// cheek, always include the action.
import HBtn from "./HBtn.vue";

withDefaults(
  defineProps<{
    icon?: string;
    title: string;
    body: string;
    actionLabel?: string;
  }>(),
  { icon: "inbox", actionLabel: "" }
);

const emit = defineEmits<{ action: [] }>();
</script>

<style scoped lang="scss">
.h-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: var(--space-sm);
  padding: var(--space-xl) var(--space-md);
}

.h-empty__icon {
  color: var(--color-text-tertiary);
}

.h-empty p {
  margin: 0;
  color: var(--color-text-secondary);

  strong {
    color: var(--color-text-primary);
    display: block;
  }
}
</style>
