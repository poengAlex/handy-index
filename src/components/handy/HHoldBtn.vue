<template>
  <HBtn
    :class="[
      'hold-btn',
      {
        'hold-btn--pressing': pressing && windUp,
        'hold-btn--fired': justFired,
        'hold-btn--active': isActive,
        'hold-btn--spin': spinWhileActive,
        'hold-btn--busy': busy && spinWhileBusy && !isActive
      }
    ]"
    :style="styleVars"
    :variant="variant"
    :size="size"
    :round="round"
    :label="label"
    :icon="isActive && activeIcon ? activeIcon : icon"
    :disable="disable"
    :aria-label="ariaLabel"
    :aria-pressed="isToggle ? isActive : undefined"
    @pointerdown="onPointerDown"
    @pointerup="releaseHold('pointer')"
    @pointerleave="cancelHold"
    @pointercancel="cancelHold"
    @keydown="onKeyDown"
    @keyup="onKeyUp"
    @blur="onBlur"
    @contextmenu.prevent
    @click="onClick"
  >
    <q-tooltip
      v-if="tooltip && (hintText || $slots.tooltip)"
      anchor="top middle"
      self="bottom middle"
    >
      <slot name="tooltip">{{ hintText }}</slot>
    </q-tooltip>
    <slot />
  </HBtn>
</template>

<script setup lang="ts">
// ─── HHoldBtn — one button, two commitments ─────────────────────────────────
//
// A tap fires the light action; keeping it pressed past `holdMs` fires the
// heavy one. While the finger is down, the icon winds up one full turn over
// exactly the hold window — the rotation IS the hold progress, completing
// the instant the hold action fires. Released early, it springs back. That
// wind-up is the whole affordance: it tells anyone who presses the button
// that pressing longer means something, without a word of UI.
//
// The canonical use is refresh-vs-poll on live-data cards (tap = read once,
// hold = keep reading), but the mechanic is generic: hold-to-confirm on a
// destructive action, hold for "apply to all", hold to arm a mode. The two
// state props stay deliberately dumb so the OWNER stays in charge:
//
//   `busy`   — the tap action is in flight (quick spin while true).
//   `active` — the hold-toggled state is ON (accent color + slow spin).
//              Bind it when the hold means "toggle something ongoing";
//              leave it unbound for one-shot holds (confirm, arm-once).
//
// The component never flips its own state: it emits, you decide. `active`
// supports `v-model:active` for the common toggle case — on a completed
// hold it emits both `hold` and `update:active` (with the negation), so use
// whichever reads better; with `v-model:active` you need no @hold at all.
//
// ── Events ──────────────────────────────────────────────────────────────────
//   @tap            the light action (quick press, or keyboard activation)
//   @hold           the heavy action (press outlasted holdMs)
//   @update:active  !active, on every completed hold (v-model:active)
//
// One gesture, one event. The machinery that guarantees it (each rule exists
// because a real browser broke the naive version):
//   · The click trailing a completed hold is swallowed (`held`).
//   · A gesture belongs to the input that armed it (`armedBy`): a Space
//     press during a pointer hold is ignored rather than stealing the
//     timer, and the synthetic click QBtn fires on that Space keyup is
//     swallowed while a pointer press is in flight.
//   · cancelHold is a NO-OP unless a press is actually armed — on touch,
//     pointerleave fires between pointerup and click on EVERY tap, and
//     QBtn's own focus juggling blurs the button after every press; both
//     would otherwise poison the next click. A blur whose focus stays
//     INSIDE the button (QBtn's .q-focus-helper shuffle) is ignored even
//     mid-press, so it can't kill a pointer hold either.
//   · `disable` flipping true mid-press defuses the armed hold.
//   · The platform context menu (touch long-press) is suppressed.
//
// ── Keyboard ────────────────────────────────────────────────────────────────
// Space mirrors the pointer: keydown starts the hold (browsers fire the
// click on Space KEYUP, so an outlasted hold swallows it exactly like a
// pointer hold). Enter fires its click on keydown and is therefore always a
// tap. Losing focus mid-hold cancels.
//
// ── Hints (tooltip + aria-label) ────────────────────────────────────────────
// Compose from `tapHint` + `holdHint` ("Tap to refresh, hold to poll every
// second"); while `active`, `activeHint` replaces the pair ("Polling — hold
// to stop"). `hint` overrides all composition; the #tooltip slot replaces
// the text with markup; `:tooltip="false"` drops the built-in tooltip when
// the page supplies its own. The winning text becomes the aria-label; on a
// LABELED button it is appended after the visible label ("Label — hint") so
// the label stays inside the accessible name (WCAG 2.5.3). Give sibling
// instances distinct hints — five buttons named "Tap to refresh" read as
// one button to a screen reader.
//
// ── Accessibility limits (be honest about them) ─────────────────────────────
// Assistive-tech activation is an instantaneous click — it can reach the
// TAP but never the HOLD. The tooltip shows on hover only; keyboard and SR
// users get the same text via aria-label. So: never make a hold the ONLY
// path to an essential action — pair it with a visible alternative (a
// menu item, a settings row). `aria-pressed` still reports the toggle
// state truthfully when `active` is bound.
//
// ── Appearance ──────────────────────────────────────────────────────────────
// Defaults to the design system's icon-only card action (tertiary / sm /
// round), but every HBtn knob passes through — `variant="danger"` + `label`
// + `:round="false"` gives a labeled hold-to-confirm pill. `icon` /
// `activeIcon` swap the glyph per state; `activeColor` retints the active
// spin (accent purple by default); `activeSpinMs` / `busySpinMs` retime the
// spins; `spinWhileActive` / `spinWhileBusy` / `windUp` switch each motion
// off. All motion respects prefers-reduced-motion.
//
// CSS notes: the wind-up is a TRANSITION on the icon's transform, the spins
// are ANIMATIONS on the same property. Pressing pauses the spins (an
// animation would freeze the wind-up outright), and a completed hold snaps
// 360°→0° with transitions off — visually identical angles, so the snap is
// invisible where a transition would play a full reverse whirl.
import { computed, onBeforeUnmount, ref } from "vue";
import HBtn from "./HBtn.vue";

const props = withDefaults(
  defineProps<{
    /** resting icon (bare Material name — the iconMapFn prefixes it) */
    icon?: string;
    /** icon while `active`; falls back to `icon` */
    activeIcon?: string;
    /** HBtn label — labeled hold buttons (e.g. hold-to-confirm pills) */
    label?: string;
    variant?: "primary" | "secondary" | "tertiary" | "danger";
    size?: "sm" | "md" | "lg";
    round?: boolean;
    /** press duration that fires the hold action; also the wind-up time */
    holdMs?: number;
    /**
     * The hold-toggled state, owned by the caller (or via v-model:active).
     * Leave unbound for one-shot holds — binding it marks the button as a
     * toggle for assistive tech (aria-pressed).
     */
    active?: boolean;
    /** the tap action is in flight — quick spin while true */
    busy?: boolean;
    disable?: boolean;
    /** what a tap does, e.g. "Tap to refresh" */
    tapHint?: string;
    /** what a hold does, e.g. "hold to poll every second" */
    holdHint?: string;
    /** replaces both hints while active, e.g. "Polling — hold to stop" */
    activeHint?: string;
    /** full override of the composed tooltip/aria text */
    hint?: string;
    /** set false to suppress the built-in tooltip */
    tooltip?: boolean;
    /** taps do nothing — the hold is the only action (hold-to-confirm) */
    holdOnly?: boolean;
    /** the press wind-up rotation */
    windUp?: boolean;
    spinWhileActive?: boolean;
    spinWhileBusy?: boolean;
    /** one revolution of the slow active spin */
    activeSpinMs?: number;
    /** one revolution of the quick busy spin */
    busySpinMs?: number;
    /** CSS color for the active state; defaults to var(--color-accent) */
    activeColor?: string;
  }>(),
  {
    icon: "refresh",
    activeIcon: "",
    label: "",
    variant: "tertiary",
    size: "sm",
    round: true,
    holdMs: 500,
    // `active` deliberately has NO default: absent stays undefined, which is
    // the "not a toggle" signal (see isToggle)
    busy: false,
    disable: false,
    tapHint: "",
    holdHint: "",
    activeHint: "",
    hint: "",
    tooltip: true,
    holdOnly: false,
    windUp: true,
    spinWhileActive: true,
    spinWhileBusy: true,
    activeSpinMs: 2400,
    busySpinMs: 700,
    activeColor: ""
  }
);

const emit = defineEmits<{
  /** the light action — quick press or keyboard activation */
  tap: [];
  /** the heavy action — the press outlasted holdMs */
  hold: [];
  /** !active on every completed hold (v-model:active) */
  "update:active": [value: boolean];
}>();

// `active` doubles as a signal: bound at all (even to false) = this button
// toggles something, so expose aria-pressed; unbound = one-shot hold.
const isToggle = computed(() => props.active !== undefined);
const isActive = computed(() => props.active === true);

const hintText = computed(() => {
  if (props.hint) return props.hint;
  if (props.active && props.activeHint) return props.activeHint;
  const parts = props.holdOnly
    ? [props.holdHint]
    : [props.tapHint, props.holdHint];
  return parts.filter(Boolean).join(", ");
});

// The hint doubles as the accessible name. A LABELED button keeps its
// visible label at the front of that name (WCAG 2.5.3 Label in Name);
// label with no hint needs no aria-label at all — the content names it.
const ariaLabel = computed(() => {
  const hint = hintText.value;
  if (props.label) return hint ? `${props.label} — ${hint}` : undefined;
  return hint || undefined;
});

const styleVars = computed(() => ({
  "--hold-ms": `${props.holdMs}ms`,
  "--hold-spin-active-ms": `${props.activeSpinMs}ms`,
  "--hold-spin-busy-ms": `${props.busySpinMs}ms`,
  ...(props.activeColor ? { "--hold-active-color": props.activeColor } : {})
}));

// ── the gesture ─────────────────────────────────────────────────────────────
// One timer arms on press, owned by the input that started it. Firing the
// timer means "held": the click the browser delivers afterwards is
// swallowed, so a single gesture never runs both actions.
type PressSource = "pointer" | "key";

let timer: ReturnType<typeof setTimeout> | null = null;
let snapTimer: ReturnType<typeof setTimeout> | null = null;
/** which input armed the in-flight press; null = no press */
let armedBy: PressSource | null = null;
/** the current gesture already consumed its outcome — swallow the click */
const held = ref(false);
/** press in progress — drives the wind-up */
const pressing = ref(false);
/** brief post-hold window with transitions off (invisible 360°→0° snap) */
const justFired = ref(false);

function clearTimer() {
  if (timer !== null) {
    clearTimeout(timer);
    timer = null;
  }
}

function startHold(source: PressSource) {
  if (props.disable) return;
  // a press is already in flight on the OTHER input — it owns the gesture
  if (armedBy !== null && armedBy !== source) return;
  armedBy = source;
  held.value = false;
  pressing.value = true;
  clearTimer();
  timer = setTimeout(() => {
    timer = null;
    pressing.value = false;
    // disable flipped mid-press: the armed hold fizzles, nothing fires
    if (props.disable) {
      armedBy = null;
      return;
    }
    held.value = true;
    snapBack();
    emit("hold");
    if (isToggle.value) emit("update:active", !props.active);
  }, props.holdMs);
}

// the completed hold ends at rotate(360°) — snap to 0° with transitions
// off (same visual angle) instead of whirling a full turn backwards
function snapBack() {
  justFired.value = true;
  if (snapTimer !== null) clearTimeout(snapTimer);
  snapTimer = setTimeout(() => (justFired.value = false), 250);
}

function onPointerDown(event: PointerEvent) {
  // secondary buttons never start the gesture
  if (event.button > 0) return;
  startHold("pointer");
}

// released in time — the trailing click will fire the tap. Only the input
// that armed the press may release it.
function releaseHold(source: PressSource) {
  if (armedBy !== source) return;
  armedBy = null;
  clearTimer();
  pressing.value = false;
}

// The pointer wandered off, or focus was lost, MID-PRESS: cancel the whole
// gesture; `held` stays true to swallow a click if the browser still
// produces one. With no press in flight this must be a no-op: on touch,
// pointerleave fires between pointerup and click on every tap, and QBtn's
// focus juggling blurs the button after every press — reacting to those
// would poison the next click.
function cancelHold() {
  if (!pressing.value && timer === null) return;
  armedBy = null;
  clearTimer();
  pressing.value = false;
  held.value = true;
}

// QBtn shuffles focus onto its internal .q-focus-helper after every press —
// focus moving WITHIN the button is stage machinery, not a real focus loss,
// and must not cancel a pointer hold in flight (a Space graze mid-hold
// triggers exactly that shuffle). Only a blur that actually leaves the
// button cancels.
function onBlur(event: FocusEvent) {
  const root = event.currentTarget;
  if (
    root instanceof HTMLElement &&
    event.relatedTarget instanceof Node &&
    root.contains(event.relatedTarget)
  ) {
    return;
  }
  cancelHold();
}

// Space is the pointer's keyboard twin: its click arrives on KEYUP, so the
// same timer/swallow machinery works unchanged. Enter clicks on keydown
// and stays a plain tap — it announces a fresh gesture, clearing any stale
// swallow left by a cancelled press that never produced its click.
function onKeyDown(event: KeyboardEvent) {
  if (event.key === " ") {
    if (!event.repeat) startHold("key");
  } else if (event.key === "Enter") {
    held.value = false;
  }
}

function onKeyUp(event: KeyboardEvent) {
  if (event.key === " ") releaseHold("key");
}

function onClick() {
  if (held.value) {
    held.value = false;
    return;
  }
  // a synthetic keyboard click landing while a POINTER press is in flight
  // (QBtn fires one on Space keyup) is not that gesture's outcome
  if (pressing.value && armedBy === "pointer") return;
  if (props.disable || props.holdOnly) return;
  emit("tap");
}

onBeforeUnmount(() => {
  clearTimer();
  if (snapTimer !== null) clearTimeout(snapTimer);
});
</script>

<style scoped lang="scss">
.hold-btn {
  // a long press must not select text or raise the platform's own menu
  user-select: none;
  -webkit-touch-callout: none;
  touch-action: manipulation;

  // released early: spring back to rest, quick but not snappy
  :deep(.q-icon) {
    transition: transform 200ms ease;
  }
}

// a completed hold ends at 360° — snap to 0° invisibly (same angle) instead
// of transitioning a full turn backwards. Sits BEFORE --pressing so an
// immediate re-press wins the tie and winds up normally.
.hold-btn--fired :deep(.q-icon) {
  transition: none;
}

// finger down: wind up one full turn over the hold window (--hold-ms is the
// holdMs prop), ease-in so it starts gently and accelerates — by the time
// it whips around, the hold fires.
.hold-btn--pressing :deep(.q-icon) {
  transform: rotate(360deg);
  transition: transform var(--hold-ms) cubic-bezier(0.5, 0, 0.85, 0.4);
}

// the active tint always applies; the slow spin only with spinWhileActive
// (--spin), so a stilled active state keeps its color
.hold-btn--active :deep(.q-icon) {
  color: var(--hold-active-color, var(--color-accent));
}

.hold-btn--active.hold-btn--spin :deep(.q-icon) {
  animation: hold-btn-spin var(--hold-spin-active-ms) linear infinite;
}

.hold-btn--busy :deep(.q-icon) {
  animation: hold-btn-spin var(--hold-spin-busy-ms) linear infinite;
}

// pressing pauses any spin: a running transform animation overrides the
// wind-up transition and would freeze the icon for the whole press. Placed
// after the spin rules (and compounded for specificity) so it wins.
.hold-btn.hold-btn--pressing :deep(.q-icon) {
  animation: none;
}

@keyframes hold-btn-spin {
  to {
    transform: rotate(360deg);
  }
}

// !important: the compound spin selectors out-rank a bare reset, and a
// media query adds no specificity of its own
@media (prefers-reduced-motion: reduce) {
  .hold-btn :deep(.q-icon) {
    animation: none !important;
    transition: none !important;
    transform: none !important;
  }
}
</style>
