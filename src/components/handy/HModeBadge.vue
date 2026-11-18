<template>
  <span
    :class="[
      'h-mode-badge',
      `h-mode-badge--${mode}`,
      { 'h-mode-badge--compact': compact }
    ]"
    role="img"
    :aria-label="tip"
  >
    <q-icon :name="icon" :size="compact ? '18px' : '14px'" />
    <span v-if="!compact" class="h-mode-badge__word" aria-hidden="true">{{
      word
    }}</span>
    <q-tooltip max-width="260px">{{ tip }}</q-tooltip>
  </span>
</template>

<script setup lang="ts">
// Mode badge (design.md 6.6, 7.5): marks something that is only there because
// a mode is on, so a person can tell what would go away if the switch went
// off. Two modes, two sizes:
//
//   mode "pro"   — Pro mode: real users who want more. Purple, the
//                  workspace_premium icon.
//        "debug" — developer mode: the team's tools. Warning text tier, the
//                  bug_report icon.
//   full         — icon and word in a pill, where there is room: a section
//                  heading on a wide screen, the settings section that holds
//                  the switch.
//   compact      — the coloured icon alone: on a phone nearly always, and in
//                  a row, a readout or a menu item at any width.
//
// The words Pro and Debug are mode names and are never translated (design.md
// 10.2). The tooltip is a sentence and is a kit label; `tooltip` overrides it
// for an app whose switch is somewhere other than Settings.
import { computed } from "vue";
import { kitLabel } from "./labels";

const props = withDefaults(
  defineProps<{
    mode?: "pro" | "debug";
    /** the icon alone, for a phone, a row, a readout or a menu item */
    compact?: boolean;
    /** replaces the kit's tooltip sentence (and the accessible name) */
    tooltip?: string;
  }>(),
  { mode: "pro", compact: false, tooltip: "" }
);

const icon = computed(() =>
  props.mode === "debug" ? "bug_report" : "workspace_premium"
);
const word = computed(() => (props.mode === "debug" ? "Debug" : "Pro"));
const tip = computed(
  () =>
    props.tooltip ||
    kitLabel(props.mode === "debug" ? "debugModeTip" : "proModeTip")
);
</script>

<style scoped lang="scss">
.h-mode-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2xs);
  flex: 0 0 auto;
  height: 20px;
  // 8px on both sides, the owner's pick of 2026-11-18 (/test/mode-badge-centre,
  // option B): even padding on the box, with no allowance for the icon's
  // blank margin (design.md 5.7)
  padding: 0 var(--space-xs);
  border-radius: var(--radius-full);
  // the mode's colour as a tint, not a fill: the badge annotates someone
  // else's heading or row, so it must never out-shout that row's own content
  background: color-mix(in srgb, var(--h-mode-color) 14%, transparent);
  color: var(--h-mode-color);
  font-size: var(--text-caption-size);
  font-weight: 700;
  line-height: 1;
  letter-spacing: 0.4px;
  text-transform: uppercase;
  white-space: nowrap;
  vertical-align: middle;
}

// letter-spacing adds its 0.4px after the last letter too; take it back so
// the word's ink, not its box, sits the same distance from the edge
.h-mode-badge__word {
  margin-right: -0.4px;
}

.h-mode-badge--pro {
  --h-mode-color: var(--color-text-connected);
}

// the text tier, not the raw feedback yellow: on a light tint the raw
// colour fails contrast (design.md 5.2.4)
.h-mode-badge--debug {
  --h-mode-color: var(--color-text-warning);
}

// the icon alone: no pill, so it sits in a dense row without reading as a
// second control
.h-mode-badge--compact {
  height: auto;
  padding: 0;
  background: none;
}
</style>
