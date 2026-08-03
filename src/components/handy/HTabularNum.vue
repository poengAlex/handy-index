<template>
  <span class="h-num"
    ><slot>{{ text }}</slot></span
  >
</template>

<script setup lang="ts">
// Tabular figures (§3 helpers): digits of equal width, so columns of
// numbers line up and live readouts (speed, battery, temp, timers, slider
// values) don't jiggle as they change — Figtree's default numerals are
// proportional. Wrap any numeric readout in this instead of sprinkling
// font-variant-numeric by hand; it inherits the surrounding type style.
import { computed } from "vue";

const props = withDefaults(defineProps<{ value?: string | number }>(), {
  value: ""
});

const text = computed(() => String(props.value));
</script>

<style scoped lang="scss">
.h-num {
  font-variant-numeric: tabular-nums;
}
</style>
