<template>
  <section class="h-section">
    <div
      v-if="title || expert || help || $slots.action"
      class="h-section__head"
    >
      <span v-if="title" class="h-section__title text-h5">{{ title }}</span>
      <HHelpTip
        v-if="help"
        class="h-section__help"
        :title="helpTitle || title"
        :text="help"
        :detail="helpDetail"
        :note="helpNote"
      />
      <span v-if="expert" class="h-section__expert text-caption">{{
        expertLabel
      }}</span>
      <div v-if="$slots.action" class="h-section__action">
        <slot name="action" />
      </div>
    </div>
    <p v-if="hint" class="h-section__hint text-body-sm">{{ hint }}</p>
    <div class="h-section__body">
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
// The plain titled card every tool page rebuilds by hand: a heading, an
// optional one-line hint under it, and the content.
//
// It exists because that shape kept being re-assembled from a bare div plus a
// span plus a paragraph, and the three things that make such a card legible —
// a "?" that carries the long explanation, an "Expert" marker, and one action on
// the title row — were each done differently every time, or skipped.
//
// The help "?" is deliberately part of the HEADER rather than something the
// page drops into the body: a card whose explanation lives in a tooltip needs
// the affordance in a predictable place, or nobody finds it. Pass `help` and
// the "?" appears; omit it and the header collapses to just the title.
//
// Content is a slot, so this composes with anything — it styles the surface
// and the header, it does not care what is inside.
import HHelpTip from "./HHelpTip.vue";
import { kitLabel } from "./labels";

withDefaults(
  defineProps<{
    title?: string;
    /** One line under the title, always visible. The short version. */
    hint?: string;
    /** Tooltip body. Supplying it is what renders the "?" at all. */
    help?: string;
    /** Tooltip heading; defaults to the card's own title. */
    helpTitle?: string;
    /** Second tooltip paragraph — for a card whose meaning is a trade-off. */
    helpDetail?: string;
    /** Closing tooltip line — normally the symptom that leads someone here. */
    helpNote?: string;
    /** Flags the card as one to leave alone without a reason to touch it. */
    expert?: boolean;
  }>(),
  {
    title: "",
    hint: "",
    help: "",
    helpTitle: "",
    helpDetail: "",
    helpNote: "",
    expert: false
  }
);

const expertLabel = kitLabel("expert");
</script>

<style scoped lang="scss">
.h-section {
  // matches HInfoCard's surface so the two stack without a seam
  --h-slider-gap: var(--color-bg-card);

  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
  padding: var(--space-md);
}

.h-section__head {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
}

.h-section__title {
  color: var(--color-text-primary);
}

.h-section__help {
  // sits with the title, not floated to the edge — it explains THIS heading
  flex: none;
}

// pushes the action to the right edge while the help stays by the title
.h-section__action {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: var(--space-xs);
}

.h-section__expert {
  padding: 2px 8px;
  border-radius: var(--radius-full);
  background: color-mix(in srgb, var(--color-text-tertiary) 18%, transparent);
  color: var(--color-text-secondary);
  letter-spacing: 0.02em;
  text-transform: uppercase;
  white-space: nowrap;
}

.h-section__hint {
  color: var(--color-text-secondary);
  margin: 0;
}

.h-section__body {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  min-width: 0;
}
</style>
