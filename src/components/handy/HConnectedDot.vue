<template>
  <!-- as a button: the normal round HBtn, with the dot where the icon goes -->
  <HBtn
    v-if="clickable"
    round
    :variant="variant"
    :size="buttonSize"
    :aria-label="label || kitLabel(resolved)"
    class="h-cdot-btn"
  >
    <span :class="['h-cdot', `h-cdot--${resolved}`]" aria-hidden="true">
      <span class="h-cdot__core" />
    </span>
  </HBtn>

  <!-- as a plain indicator -->
  <span
    v-else
    :class="['h-cdot', `h-cdot--${resolved}`]"
    :role="label ? 'img' : undefined"
    :aria-label="label || undefined"
    :aria-hidden="label ? undefined : 'true'"
  >
    <span class="h-cdot__core" />
  </span>
</template>

<script setup lang="ts">
import { computed } from "vue";
import HBtn from "./HBtn.vue";
import { kitLabel } from "./labels";

// Connection-state LED (design.md §13). Three states:
//   connected  — purple, with faint rings pulsing steadily outward. Purple is
//                the *connected colour*, the same Oculus Purple as the
//                device's hardware LED when it's linked to our online
//                services, so the UI mirrors the device.
//   connecting — amber, with a hairline arc sweeping around it: the handshake
//                is in progress, nothing has settled yet.
//   offline    — the same dot, muted, fading slowly in and out: asleep
//                rather than dead. No movement, half the tempo of the pulse.
// One flat disc in all three — no gloss, no glow, no hollow ring. The motion
// carries the state; the dot itself stays a dot.
//
// `size` is the slot the dot occupies, not the disc: the disc sits a little
// under it, which leaves the rings and the arc room to travel inside the
// dot's own footprint rather than sprawling across whatever sits beside it.
//
// Motion honours prefers-reduced-motion, which leaves colour alone to tell the
// three states apart — so pair the dot with its word wherever the state
// actually matters.
//
// `clickable` turns it into an icon button — the system's own round HBtn with
// the dot where the icon goes, so it takes the normal button settings
// (`variant`, `buttonSize`, and anything else that falls through to HBtn:
// `disable`, `loading`, `to`). Tertiary by default: a status that can be
// pressed is still a status, and a filled button around a 6px disc would
// shout about a device's connection the way a primary action shouts about
// the one thing on the screen. It names itself with the state it is showing
// unless the caller passes a `label` for what pressing it actually does.
type ConnectedState = "connected" | "connecting" | "offline";

const props = withDefaults(
  defineProps<{
    /** the connection state — the modern prop */
    state?: ConnectedState;
    /**
     * Legacy boolean form: false === offline. Ignored when `state` is set.
     * It defaults to true — Vue casts an absent Boolean prop to false, so the
     * default has to be spelled out or every dot would start life offline.
     */
    live?: boolean;
    /** the space the dot takes, in px — the disc itself is a shade smaller */
    size?: number;
    /**
     * Accessible name. Set it when the dot stands alone; leave it off when a
     * text label sits beside it (the dot is then decorative). As a button it
     * is what pressing it does ("Reconnect"), and the state word stands in
     * when it is absent.
     */
    label?: string;
    /** render as a round icon button rather than a bare indicator */
    clickable?: boolean;
    /** button variant — button mode only */
    variant?: "primary" | "secondary" | "tertiary" | "danger";
    /**
     * Button size — button mode only. Named apart from `size`, which is the
     * dot's own geometry in px and means something different.
     */
    buttonSize?: "sm" | "md" | "lg";
  }>(),
  {
    size: 8,
    live: true,
    clickable: false,
    variant: "tertiary",
    buttonSize: "md"
  }
);

const resolved = computed<ConnectedState>(
  () => props.state ?? (props.live ? "connected" : "offline")
);

/* px strings for v-bind — the sweeping arc scales with the dot, but only up
   to a point: past ~20px a proportional orbit and stroke turn chunky. */
const clamp = (n: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, n));
const box = computed(() => `${props.size}px`);
const core = computed(() => `${Math.max(4, Math.round(props.size * 0.7))}px`);
const ring = computed(() => `${clamp(Math.round(props.size * 0.5), 3, 6)}px`);
const edge = computed(() => `${clamp(Math.round(props.size * 0.15), 1, 2)}px`);
</script>

<style scoped lang="scss">
// The dot sits where a 20-24px icon would, so the button keeps the geometry
// every other icon-only button has rather than shrink-wrapping the disc.
.h-cdot-btn :deep(.q-btn__content) {
  min-width: 20px;
  min-height: 20px;
}

.h-cdot {
  position: relative;
  display: inline-block;
  width: v-bind(box);
  height: v-bind(box);
  flex-shrink: 0;
  /* the rings and the sweeping arc overflow the box — keep them out of
     layout, and off the baseline */
  vertical-align: middle;
}

/* the disc, centred in the slot */
.h-cdot__core {
  position: absolute;
  inset: 0;
  margin: auto;
  width: v-bind(core);
  height: v-bind(core);
  border-radius: 50%;
}

/* ---- connected: a flat purple dot with a slow outward pulse ---- */
.h-cdot--connected .h-cdot__core {
  background: var(--color-accent);
}

/* Two hairline rings on the same 2.8s cycle, the second half a cycle behind,
   so one is always on its way out — a single ring reads as an occasional
   blink, a pair reads as continuously live. Kept faint on purpose: a status
   dot should be noticed, not watched. */
.h-cdot--connected::before,
.h-cdot--connected::after {
  content: "";
  position: absolute;
  inset: 0;
  margin: auto;
  width: v-bind(core);
  height: v-bind(core);
  border-radius: 50%;
  border: 1px solid var(--color-accent);
  animation: h-cdot-pulse 2.8s cubic-bezier(0.22, 0.61, 0.36, 1) infinite;
}

.h-cdot--connected::after {
  animation-delay: 1.4s;
}

/* ---- connecting: amber, with a hairline arc sweeping around it ---- */
.h-cdot--connecting .h-cdot__core {
  background: var(--color-feedback-warning);
}

.h-cdot--connecting::before {
  content: "";
  position: absolute;
  inset: calc(-1 * v-bind(ring));
  border-radius: 50%;
  background: conic-gradient(
    from 0deg,
    transparent 0deg 250deg,
    color-mix(in srgb, var(--color-feedback-warning) 55%, transparent) 330deg,
    color-mix(in srgb, var(--color-feedback-warning) 85%, transparent) 360deg
  );
  /* punch the middle out so the gradient reads as a thin arc, not a pie */
  -webkit-mask: radial-gradient(
    closest-side,
    transparent calc(100% - v-bind(edge) - 0.5px),
    #000 calc(100% - v-bind(edge))
  );
  mask: radial-gradient(
    closest-side,
    transparent calc(100% - v-bind(edge) - 0.5px),
    #000 calc(100% - v-bind(edge))
  );
  animation: h-cdot-sweep 1.1s linear infinite;
}

/* ---- offline: the same dot, breathing slowly — asleep, not dead ---- */
.h-cdot--offline .h-cdot__core {
  background: var(--color-text-tertiary);
  /* half the tempo of the pulse and no movement at all: it should register
     as "still there, just not talking", never as something to attend to */
  animation: h-cdot-idle 4.4s ease-in-out infinite;
}

@keyframes h-cdot-pulse {
  0% {
    opacity: 0.38;
    transform: scale(1);
  }

  75% {
    opacity: 0;
    transform: scale(2.9);
  }

  100% {
    opacity: 0;
    transform: scale(2.9);
  }
}

@keyframes h-cdot-idle {
  0%,
  100% {
    opacity: 0.55;
  }

  50% {
    opacity: 0.9;
  }
}

@keyframes h-cdot-sweep {
  to {
    transform: rotate(1turn);
  }
}

/* Motion off: the colours still separate the three states, and connected
   keeps one still ring — it is the one worth telling apart at a glance. */
@media (prefers-reduced-motion: reduce) {
  .h-cdot--connected::before,
  .h-cdot--connected::after,
  .h-cdot--connecting::before,
  .h-cdot--offline .h-cdot__core {
    animation: none;
  }

  .h-cdot--offline .h-cdot__core {
    opacity: 0.75;
  }

  /* One still ring, parked where the pulse is partway out — at the pulse's
     *start* size it sits exactly on the disc's edge and vanishes into it. */
  .h-cdot--connected::before {
    opacity: 0.4;
    transform: scale(1.9);
  }

  .h-cdot--connected::after {
    display: none;
  }
}
</style>
