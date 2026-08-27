<template>
  <HListRow
    :label="label"
    :caption="caption"
    :icon="icon"
    :clickable="!disable"
    @click="emit('update:modelValue', !modelValue)"
  >
    <template #trailing>
      <q-toggle
        :model-value="modelValue"
        color="primary"
        :aria-label="label"
        :disable="disable"
        @update:model-value="emit('update:modelValue', $event)"
        @click.stop
      />
    </template>
    <template v-if="help" #suffix>
      <HHelpTip
        :title="label"
        :text="help"
        :detail="helpDetail"
        :note="helpNote"
      />
    </template>
    <q-tooltip v-if="tooltip" max-width="300px">{{ tooltip }}</q-tooltip>
  </HListRow>
</template>

<script setup lang="ts">
// A toggle settings row — HListRow with the switch wiring baked in: the
// whole row flips the value, and a direct tap on the switch is stopped so
// it can't double-flip. Toggle = an independent on/off setting (§6); it
// sits trailing, one row per card or grouped in an HList.
import HListRow from "@/components/handy/HListRow.vue";
import HHelpTip from "@/components/handy/HHelpTip.vue";

withDefaults(
  defineProps<{
    modelValue: boolean;
    label: string;
    caption?: string;
    icon?: string;
    /** Nothing to answer yet — the switch greys out and the row stops taking
     * the click, rather than the setting disappearing. Say WHY in the caption
     * or the tooltip: a control that cannot explain itself is the one thing a
     * disabled control always is. */
    disable?: boolean;
    /** One-line explanation on hover, for a row kept to a single line —
     * where a caption would say it in the layout, this says it over it. */
    tooltip?: string;
    /** Explanation behind a ? beside the label — same three parts as
     * HLabeledSlider's, and the same reason: a switch whose consequence is
     * not obvious needs the consequence written down next to it. */
    help?: string;
    helpDetail?: string;
    helpNote?: string;
  }>(),
  {
    caption: "",
    icon: "",
    disable: false,
    tooltip: "",
    help: "",
    helpDetail: "",
    helpNote: ""
  }
);

const emit = defineEmits<{ "update:modelValue": [value: boolean] }>();
</script>
