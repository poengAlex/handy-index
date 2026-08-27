<template>
  <div class="h-key">
    <span class="h-key__value" :aria-label="value">
      <span
        v-for="(c, i) in chars"
        :key="i"
        :class="`h-key__char h-key__char--${c.type}`"
        >{{ c.ch }}</span
      >
    </span>
    <q-btn
      flat
      round
      dense
      icon="content_copy"
      class="h-key__btn"
      :aria-label="kitLabel('copyKey')"
      @click="copy"
    >
      <q-tooltip>{{ kitLabel("copy") }}</q-tooltip>
    </q-btn>
  </div>
</template>

<script setup lang="ts">
// Proposed spec for the connection-key gap: pill container on the alt
// surface, key in weight-600 spaced monospace, an icon-only round copy
// action. Keys are alphanumeric ([A-Za-z0-9], no symbols).
// Legibility comes from a single visual variable — colour tone — that
// disambiguates the character classes: digits in Connected Purple (this
// key IS the connected-state artifact), uppercase in primary ink,
// lowercase a step muted. Same weight, same posture, no italics —
// uniform shapes, calm surface.
// (The separator branch stays as a harmless fallback if a key ever isn't.)
//
// The component has NO toast/Notify dependency — it only emits. The parent
// decides how to confirm (§7 says a "Copied." toast); typical wiring:
//
//   <HConnectionKey
//     :value="key"
//     @copy="hToast('positive', 'Copied.')"
//     @copy-error="hToast('negative', 'Couldn’t copy — select it instead.')"
//   />
import { computed } from "vue";
import { kitLabel } from "@/components/handy/labels";

const props = defineProps<{ value: string }>();

const emit = defineEmits<{
  /** fired after the key text lands on the clipboard */
  copy: [value: string];
  /** clipboard unavailable or write refused */
  "copy-error": [error: unknown];
}>();

const chars = computed(() =>
  [...props.value].map(ch => ({
    ch,
    type: /[0-9]/.test(ch)
      ? "digit"
      : /[a-z]/.test(ch)
        ? "lower"
        : /[A-Z]/.test(ch)
          ? "upper"
          : "sep"
  }))
);

async function copy() {
  try {
    await navigator.clipboard.writeText(props.value);
    emit("copy", props.value);
  } catch (error) {
    emit("copy-error", error);
  }
}
</script>

<style scoped lang="scss">
.h-key {
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  max-width: 100%;
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-full);
  background: var(--color-bg-page-alt);
}

.h-key__value {
  font-family:
    ui-monospace, "SF Mono", "Cascadia Mono", "Roboto Mono", Menlo, monospace;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 2px;
  padding-inline: var(--space-xs);
  user-select: all;
  // always one line: the pill hugs a short key, and a key that would
  // outgrow the available width ellipsises instead of wrapping or
  // overflowing (min-width: 0 lets flex shrink the value below content
  // size so the ellipsis can actually kick in)
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  // the value owns any spare width, so when the pill is wider than its
  // content (fixed-width layouts) the action icons keep the right edge
  flex: 1;
}

// One visual variable — colour tone — tells the character classes apart;
// weight and posture stay uniform so the shapes read as one key, not a
// ransom note. Digits ride the connected purple as text (lighter tint on
// dark for contrast — the key IS the connected-state artifact, and 0 vs O
// resolves instantly); uppercase is primary ink; lowercase steps back.
.h-key__char--digit {
  color: var(--color-text-connected);
}

.h-key__char--upper {
  color: var(--color-text-primary);
}

.h-key__char--lower {
  color: var(--color-text-secondary);
}

.h-key__char--sep {
  color: var(--color-text-tertiary);
}

.h-key__btn {
  color: var(--color-text-secondary);
  // the actions never shrink or wrap away — the value gives way first
  flex-shrink: 0;
}
</style>
