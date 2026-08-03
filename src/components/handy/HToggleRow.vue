<template>
  <HListRow
    :label="label"
    :caption="caption"
    :icon="icon"
    @click="emit('update:modelValue', !modelValue)"
  >
    <template #trailing>
      <q-toggle
        :model-value="modelValue"
        color="primary"
        :aria-label="label"
        @update:model-value="emit('update:modelValue', $event)"
        @click.stop
      />
    </template>
  </HListRow>
</template>

<script setup lang="ts">
// A toggle settings row — HListRow with the switch wiring baked in: the
// whole row flips the value, and a direct tap on the switch is stopped so
// it can't double-flip. Toggle = an independent on/off setting (§6); it
// sits trailing, one row per card or grouped in an HList.
import HListRow from "@/components/handy/HListRow.vue";

withDefaults(
  defineProps<{
    modelValue: boolean;
    label: string;
    caption?: string;
    icon?: string;
  }>(),
  { caption: "", icon: "" }
);

const emit = defineEmits<{ "update:modelValue": [value: boolean] }>();
</script>
