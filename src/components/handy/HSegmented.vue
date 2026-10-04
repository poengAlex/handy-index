<template>
  <div
    ref="root"
    class="h-segmented"
    :class="[
      `h-segmented--${tone}`,
      `h-segmented--${size}`,
      { 'h-segmented--spread': spread, 'h-segmented--disabled': disable }
    ]"
    role="radiogroup"
    @keydown="onKeydown"
  >
    <!-- The moving part. One element for the whole control, slid and resized
         onto whichever segment is chosen — which is the only way the fill can
         travel between segments rather than blink from one to the next. -->
    <span
      v-show="thumb.visible"
      class="h-segmented__thumb"
      :class="{ 'h-segmented__thumb--placed': placed }"
      :style="{
        transform: `translateX(${thumb.left}px)`,
        width: `${thumb.width}px`
      }"
      aria-hidden="true"
    />

    <button
      v-for="(option, i) in options"
      :key="String(option.value)"
      :ref="el => setSegment(el, i)"
      type="button"
      role="radio"
      class="h-segmented__seg"
      :class="{ 'h-segmented__seg--active': option.value === modelValue }"
      :aria-checked="option.value === modelValue"
      :aria-label="option.ariaLabel || option.label || undefined"
      :disabled="disable || option.disable"
      :tabindex="option.value === modelValue ? 0 : -1"
      @click="emit('update:modelValue', option.value)"
    >
      <q-icon v-if="option.icon" :name="option.icon" :size="iconSize" />
      <span v-if="option.label">{{ option.label }}</span>
      <slot v-if="option.slot" :name="option.slot" />
    </button>

    <!-- out-of-flow children only — a q-tooltip over the whole control -->
    <slot />
  </div>
</template>

<script setup lang="ts" generic="T extends string | number | boolean">
// A segmented control — one choice out of two to four, all of them visible,
// switching immediately. Use it where a select would hide the alternatives
// behind a click and a radio group would spend a whole column on them: the
// options are few, short, and worth comparing side by side. More than four,
// or labels longer than a word or two, and it becomes a select (§6).
//
// A track on the alt-surface tint, and the chosen segment a solid fill of the
// tone sitting INSIDE it with a hairline of track showing all the way round —
// a thumb in a groove. Fully rounded, like every other action in this system:
// the buttons are pills and so are the chips.
//
// That fill is the entire signal — no second border, no chevron, no check —
// so it must be the only filled thing in its row, which is also why a
// segmented control never carries the primary action.
//
// ── Why this is not a q-btn-toggle ──────────────────────────────────────────
// It was, and every part of it was a fight. The framework's `size` arrives as
// an inline font-size and scales padding in em, overriding the design; there
// is no active class to hook, because the chosen segment is marked by handing
// it a `color`; that color paints through palette classes declared
// `!important`, so the fill cannot be restyled without a specificity war; and
// the button group squares off the inner corners of every segment.
//
// The thumb settled it. A fill that TRAVELS has to be one element that moves,
// not a background that switches owner, so the control has to own its own
// painting. Hand-rolled, it is a row of buttons and one absolutely-positioned
// span — and every one of those workarounds goes away.
//
// No ripple here, deliberately: the thumb sliding under your finger is the tap
// feedback, and ink spreading on top of a moving pill is two answers to one
// question.
//
// `tone` is not decoration. Primary is the default and means "this is the
// setting". Warning is for a segment that changes what a WARNING-coloured
// thing is doing, so the control and the thing it drives are the same colour;
// using it for emphasis breaks that.
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  watch
} from "vue";

export interface SegmentedOption<V> {
  /** Segment text. Omit only when `icon` carries the meaning on its own —
   *  then give the option an `ariaLabel`, and normally a `slot` with a
   *  tooltip too, because an icon has no accessible name of its own. */
  label?: string;
  icon?: string;
  value: V;
  /** Accessible name. Required when the segment is icon-only. */
  ariaLabel?: string;
  /** Name of a slot rendered inside this segment — the tooltip hook. */
  slot?: string;
  disable?: boolean;
}

const props = withDefaults(
  defineProps<{
    modelValue: T;
    options: SegmentedOption<T>[];
    /** Fill the width, segments sharing it equally. On for a control that
     *  owns its own row; off when it sits at the end of a row of other
     *  things and should only be as wide as its labels. */
    spread?: boolean;
    /** md is the standalone control. **sm is the compact one** — for a
     *  segmented control riding inside a list row, a toolbar or a dialog's
     *  header strip, where the full size would set the row's height. xs is
     *  denser still, for a strip of icon segments over a chart or a canvas.
     *
     *  Compact is a proportional redraw, not the same box squashed: only the
     *  groove tightens, because the radius is already as round as it goes. */
    size?: "xs" | "sm" | "md";
    tone?: "primary" | "warning";
    disable?: boolean;
  }>(),
  { spread: false, size: "md", tone: "primary", disable: false }
);

const emit = defineEmits<{ "update:modelValue": [value: T] }>();

const iconSize = computed(
  () => ({ md: "18px", sm: "16px", xs: "14px" })[props.size]
);

// ------------------------------------------------------------- the thumb

const root = ref<HTMLElement | null>(null);
const segments: (HTMLElement | null)[] = [];
const thumb = reactive({ left: 0, width: 0, visible: false });

/**
 * `placed` gates the transition, not the position.
 *
 * Without it the thumb animates in from the left edge on first paint — the
 * same trap the progress ring has: a transition that exists on the very first
 * render animates from the initial value rather than sitting at its own. It
 * goes on after the browser has drawn one frame with the thumb already in
 * place (two rAFs — one is not enough, the style change lands in the same
 * frame and the compositor never sees the difference).
 */
const placed = ref(false);

function setSegment(el: unknown, i: number) {
  segments[i] = (el as HTMLElement | null) ?? null;
}

function measure() {
  const index = props.options.findIndex(o => o.value === props.modelValue);
  const el = index >= 0 ? segments[index] : null;
  if (!el || !root.value) {
    thumb.visible = false;
    return;
  }
  // offsetLeft is relative to the padded box, which is exactly the frame the
  // thumb is positioned in — no need to subtract the track's own inset
  thumb.left = el.offsetLeft;
  thumb.width = el.offsetWidth;
  thumb.visible = true;
}

// The width of a segment depends on the text in it, so a font swap or a
// container resize moves the thumb without the value changing.
let observer: ResizeObserver | null = null;

onMounted(() => {
  measure();
  if (typeof ResizeObserver === "function" && root.value) {
    observer = new ResizeObserver(measure);
    observer.observe(root.value);
  }
  if (typeof requestAnimationFrame === "function") {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        placed.value = true;
      });
    });
  } else {
    placed.value = true;
  }
});

onBeforeUnmount(() => observer?.disconnect());

watch(
  () => [props.modelValue, props.options, props.size, props.spread],
  () => void measure(),
  { flush: "post", deep: true }
);

// ---------------------------------------------------------------- keyboard

// A radiogroup moves its selection with the arrows, and only the chosen
// segment is in the tab order (roving tabindex) — so tabbing past the control
// is one stop, not one per option.
async function onKeydown(event: KeyboardEvent) {
  const step =
    event.key === "ArrowRight" || event.key === "ArrowDown"
      ? 1
      : event.key === "ArrowLeft" || event.key === "ArrowUp"
        ? -1
        : 0;
  if (step === 0 || props.disable) return;
  event.preventDefault();
  const usable = props.options.filter(o => !o.disable);
  if (usable.length === 0) return;
  const at = usable.findIndex(o => o.value === props.modelValue);
  const next = usable[(at + step + usable.length) % usable.length];
  if (!next) return;
  emit("update:modelValue", next.value);
  // keep focus with the selection, or the next arrow starts from nowhere —
  // after the DOM settles, because the roving tabindex moves with it
  await nextTick();
  segments[props.options.indexOf(next)]?.focus();
}
</script>

<style scoped lang="scss">
.h-segmented {
  // How deep the thumb sits. The groove's COLOUR is deliberately not declared
  // here: a custom property set on the element itself beats one inherited
  // from an ancestor, so declaring the default locally would make the
  // override impossible. It lives in the var() fallback instead, which keeps
  // the default inside the component (it must not depend on a host's styles)
  // while still letting a surface on the same tint re-point it.
  --h-segmented-inset: 3px;

  position: relative;
  display: inline-flex;
  padding: var(--h-segmented-inset);
  background: var(--h-segmented-track, var(--color-bg-page-alt));
  // Fully rounded, like every other action in this system: the buttons are
  // pills ($button-border-radius: 9999px) and so are the chips. A pill inset
  // inside a pill is still a pill, so the thumb takes the same radius rather
  // than subtracting the inset from it.
  border-radius: var(--radius-full);
  // definition without a border: an inset ring costs no layout, so the
  // control's height is its segments' height and nothing else
  box-shadow: inset 0 0 0 1px var(--color-stroke-subtle);
}

.h-segmented--spread {
  display: flex;
  width: 100%;
}

.h-segmented--disabled {
  // Keep the fill, lose the contrast fight: dimming the whole control leaves
  // the chosen segment barely readable on the tint.
  opacity: 0.7;
}

.h-segmented__thumb {
  position: absolute;
  top: var(--h-segmented-inset);
  bottom: var(--h-segmented-inset);
  left: 0;
  border-radius: var(--radius-full);
  background: var(--color-action-primary);
  // transform and width, not `left` — the compositor can carry a transform
  // without laying the row out again on every frame
  will-change: transform, width;
}

.h-segmented__thumb--placed {
  // slightly overshoot-free easing: the thumb should arrive settled, not
  // bounce, because it is reporting a state rather than performing
  transition:
    transform 260ms cubic-bezier(0.22, 0.61, 0.36, 1),
    width 260ms cubic-bezier(0.22, 0.61, 0.36, 1),
    background 180ms ease;
}

.h-segmented--warning .h-segmented__thumb {
  background: var(--color-feedback-warning);
}

.h-segmented__seg {
  position: relative; // above the thumb
  appearance: none;
  border: 0;
  margin: 0;
  background: none;
  font: inherit;
  font-weight: 500;
  letter-spacing: -0.14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-xs);
  white-space: nowrap;
  cursor: pointer;
  border-radius: var(--radius-full);
  color: var(--color-text-secondary);
  min-height: 34px;
  // roomier than a rectangle would need: the curve eats into the corners, so
  // the first and last labels sit closer to the edge than the number says
  padding: 0 var(--space-md);
  font-size: 14px;
  // only the ink moves — the thumb underneath carries the fill
  transition: color 180ms ease;

  &:hover:not(:disabled) {
    color: var(--color-text-primary);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
}

.h-segmented--spread .h-segmented__seg {
  flex: 1 1 0;
}

.h-segmented--primary .h-segmented__seg--active,
.h-segmented--primary .h-segmented__seg--active:hover {
  color: var(--color-text-on-fill);
}

.h-segmented--warning .h-segmented__seg--active,
.h-segmented--warning .h-segmented__seg--active:hover {
  color: var(--color-text-on-warning);
}

// Compact — the one that rides inside a row. Only the groove tightens: the
// radius is already as round as it goes, and a shallower inset is what keeps
// the track reading as a groove rather than as a halo at two thirds the size.
.h-segmented--sm,
.h-segmented--xs {
  --h-segmented-inset: 2px;
}

.h-segmented--sm .h-segmented__seg {
  min-height: 28px;
  padding: 0 var(--space-sm);
  font-size: 13px;
}

// Denser still — a strip of icon segments over a chart or a canvas, where the
// control is a tool and not a setting.
.h-segmented--xs .h-segmented__seg {
  min-height: 22px;
  padding: 0 var(--space-xs);
  font-size: 12px;
}

// The slide is decorative: under reduced motion the thumb still moves, it
// just arrives immediately (§8 — decorative motion off, essential static).
@media (prefers-reduced-motion: reduce) {
  .h-segmented__thumb--placed {
    transition: none;
  }
}
</style>
