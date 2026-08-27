<template>
  <button
    type="button"
    class="h-helptip"
    :class="{ 'h-helptip--pinned': pinned }"
    :aria-label="ariaLabel"
    :aria-expanded="pinned"
    @mouseenter="preview"
    @mouseleave="endPreview"
    @click.stop.prevent="togglePin"
  >
    <q-icon name="help_outline" :size="size" />

    <q-menu
      ref="menuRef"
      v-model="open"
      class="h-helptip__tip"
      :class="pinned ? 'h-helptip__tip--pinned' : 'no-pointer-events'"
      no-parent-event
      :no-focus="!pinned"
      :no-refocus="!pinned"
      anchor="bottom middle"
      self="top middle"
      :offset="[0, 6]"
      max-width="340px"
      transition-show="jump-down"
      transition-hide="jump-up"
      @show="measure"
      @hide="unpin"
    >
      <div ref="bodyRef" class="h-helptip__body">
        <span v-if="title" class="h-helptip__title">{{ title }}</span>
        <p class="h-helptip__text">{{ text }}</p>
        <p v-if="detail" class="h-helptip__detail">{{ detail }}</p>
        <p v-if="note" class="h-helptip__note">{{ note }}</p>
      </div>
      <p v-if="pinned || overflows" class="h-helptip__pin">
        {{ pinned ? kitLabel("tipClose") : kitLabel("tipPin") }}
      </p>
    </q-menu>
  </button>
</template>

<script setup lang="ts">
// A "?" that explains one control, next to that control's own label.
//
// Placement is the whole point: the ? goes after the label of the control it
// explains, never in a left gutter and never at the top of the card. A
// parameter whose meaning lives in a panel-level help sheet is a parameter
// nobody reads about — panel-level help answers "what is this panel for",
// which is a different question from "what does this knob do".
//
// Two rules. Hover previews, click PINS (usePinnableTip explains why a
// tooltip cannot be the popup here) — so the cursor is a pointer, because
// something does happen on click. And every paragraph is mirrored onto the
// accessible name, because a popup that only appears on hover reaches nobody
// navigating by keyboard; pinning is on the same button, so Enter or Space
// opens the readable copy.

import { computed } from "vue";
import { usePinnableTip } from "@/components/handy/usePinnableTip";
import { kitLabel } from "@/components/handy/labels";

const props = withDefaults(
  defineProps<{
    /** The explanation. One or two sentences — this is a tooltip, not a doc. */
    text: string;
    /** Optional bold lead-in, normally the control's own label. */
    title?: string;
    /**
     * A second paragraph, for a control whose meaning is a TRADE rather than
     * a definition. Kept separate rather than glued onto `text` so the first
     * sentence still answers "what is this" on its own, and the reasoning is
     * skippable.
     */
    detail?: string;
    /** A closing line, set apart: normally the symptom that should send
     * someone to this control in the first place. */
    note?: string;
    size?: string;
  }>(),
  { title: "", detail: "", note: "", size: "15px" }
);

const {
  menuRef,
  bodyRef,
  open,
  pinned,
  overflows,
  preview,
  endPreview,
  togglePin,
  unpin,
  measure
} = usePinnableTip();

// A popup that only appears on hover reaches nobody on a keyboard, so every
// paragraph goes onto the accessible name too.
const ariaLabel = computed(() =>
  [props.title ? `${props.title}.` : "", props.text, props.detail, props.note]
    .filter(Boolean)
    .join(" ")
);
</script>

<style scoped lang="scss">
.h-helptip {
  all: unset;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  border-radius: var(--radius-full);
  color: var(--color-text-tertiary);
  cursor: pointer;
  transition:
    color 180ms ease,
    background 180ms ease;

  &:hover {
    color: var(--color-text-primary);
    background: var(--h-chip-bg);
  }

  &:focus-visible {
    outline: 2px solid var(--color-stroke-focus);
    outline-offset: 2px;
  }
}

// Pinned, the ? stays lit for as long as its sheet is up — otherwise a sheet
// that no longer follows the mouse has nothing left pointing back at the
// control it belongs to.
.h-helptip--pinned {
  color: var(--color-text-primary);
  background: var(--h-chip-bg);
}
</style>

<!-- QMenu portals to the body, so its content sits outside this component's
     scope and has to be styled globally. Qualified with .q-menu so the sheet
     keeps its own radius against app.scss's dropdown rule. -->
<style lang="scss">
// inline-flex, not the flex a column would normally ask for: q-menu is
// inline-block so that a two-word tip comes out two words wide, and going
// block-level would blow every sheet up to the full 340px.
.q-menu.h-helptip__tip {
  display: inline-flex;
  flex-direction: column;
  overflow: hidden; // the body scrolls; the footer must not
  background: var(--color-bg-card);
  color: var(--color-text-secondary);
  border-radius: var(--radius-sm);
  box-shadow:
    inset 0 0 0 1px var(--color-stroke-subtle),
    0 8px 24px rgba(0, 0, 0, 0.28);
  padding: 0;
  font-size: 13px;
  line-height: 1.45;
}

.h-helptip__body {
  min-height: 0; // or the flex item refuses to shrink and never scrolls
  overflow-y: auto;
  overflow-x: hidden;
  padding: var(--space-sm);
}

// Pinned it is a surface you can land on, so it says so: a real border and a
// deeper lift separate it from the weightless preview it replaces.
.q-menu.h-helptip__tip--pinned {
  box-shadow:
    inset 0 0 0 1px var(--color-stroke-default),
    var(--shadow-lg);
  user-select: text;
}

.h-helptip__title {
  display: block;
  font-weight: 600;
  color: var(--color-text-primary);
}

.h-helptip__text {
  margin: 0;
}

.h-helptip__title + .h-helptip__text {
  margin-top: 3px;
  color: var(--color-text-tertiary);
}

.h-helptip__detail {
  margin: var(--space-xs) 0 0;
  color: var(--color-text-tertiary);
}

// the line that says when to reach for the control at all — set apart,
// because it is the one someone scanning the tooltip is usually after
.h-helptip__note {
  margin: var(--space-xs) 0 0;
  padding-top: var(--space-xs);
  border-top: 1px solid var(--color-stroke-subtle);
  color: var(--color-text-primary);
}

// Outside the scroller on purpose. It only appears on a sheet whose bottom is
// off-screen, so as ordinary trailing text it would be the one line nobody
// could ever read.
.h-helptip__pin {
  flex: 0 0 auto;
  margin: 0;
  padding: 5px var(--space-sm) 6px;
  border-top: 1px solid var(--color-stroke-subtle);
  background: var(--color-bg-card);
  font-size: 11px;
  color: var(--color-text-tertiary);
}
</style>
