<template>
  <HListRow
    :label="label"
    :caption="caption"
    :icon="icon"
    @click="emit('update:modelValue', val)"
  >
    <template #leading>
      <q-radio
        :model-value="modelValue"
        :val="val"
        color="primary"
        :aria-label="label"
        @update:model-value="emit('update:modelValue', $event)"
        @click.stop
      />
    </template>
    <template v-if="recommended" #suffix>
      <span class="h-radio-row__pill">{{ kitLabel("recommended") }}</span>
    </template>
  </HListRow>
</template>

<script setup lang="ts" generic="T extends string | number">
// A radio settings row — one option of a single choice, as an HListRow with
// the radio wiring baked in: the whole row selects, the control leads, and
// `recommended` rides a quiet pill next to the label. Group the options in
// one HList — picking a boot mode is one choice, so it's one card (§6).
import HListRow from "@/components/handy/HListRow.vue";
import { kitLabel } from "@/components/handy/labels";

withDefaults(
  defineProps<{
    modelValue: T;
    val: T;
    label: string;
    caption?: string;
    icon?: string;
    recommended?: boolean;
  }>(),
  { caption: "", icon: "", recommended: false }
);

const emit = defineEmits<{ "update:modelValue": [value: T] }>();
</script>

<style scoped lang="scss">
.h-radio-row__pill {
  font-size: 12px;
  font-weight: 600;
  line-height: 133%;
  padding: 1px 10px;
  border-radius: var(--radius-full);
  box-shadow: inset 0 0 0 1px var(--color-stroke-subtle);
  color: var(--color-text-secondary);
}
</style>
