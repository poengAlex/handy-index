<template>
  <div class="h-stepperctl">
    <span v-if="label" class="text-body-compact h-stepperctl__label">{{
      label
    }}</span>
    <div class="h-stepperctl__controls">
      <q-btn
        round
        unelevated
        icon="remove"
        class="h-stepperctl__btn"
        :disable="modelValue <= min"
        :aria-label="`Decrease ${label || 'value'}`"
        @click="step(-1)"
      />
      <HTabularNum class="text-h4 h-stepperctl__value" :value="modelValue" />
      <q-btn
        round
        unelevated
        icon="add"
        class="h-stepperctl__btn"
        :disable="modelValue >= max"
        :aria-label="`Increase ${label || 'value'}`"
        @click="step(1)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
// Proposed spec for a number stepper: label left, minus/value/plus right.
// 40px icon-only round buttons on the alt surface, tabular value
// (HTabularNum), buttons disable at the bounds instead of clamping silently.
import HTabularNum from "@/components/handy/HTabularNum.vue";

const props = withDefaults(
  defineProps<{
    modelValue: number;
    label?: string;
    min?: number;
    max?: number;
    stepSize?: number;
  }>(),
  { label: "", min: 0, max: 100, stepSize: 1 }
);

const emit = defineEmits<{ "update:modelValue": [value: number] }>();

function step(dir: 1 | -1) {
  const next = Math.min(
    props.max,
    Math.max(props.min, props.modelValue + dir * props.stepSize)
  );
  emit("update:modelValue", next);
}
</script>

<style scoped lang="scss">
.h-stepperctl {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-sm);
  width: 100%;
}

.h-stepperctl__label {
  color: var(--color-text-primary);
}

.h-stepperctl__controls {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  margin-left: auto;
}

.h-stepperctl__btn {
  background: var(--color-bg-page-alt);
  color: var(--color-text-primary);
}

.h-stepperctl__value {
  font-weight: 700;
  min-width: 48px;
  text-align: center;
}
</style>
