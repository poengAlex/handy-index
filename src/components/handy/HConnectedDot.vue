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

// Connection-state LED (design.md 6.9). Four states:
//   connected  — purple, breathing: the disc swells a little and settles,
//                and as it settles a faint hairline ring lifts off its edge
//                and drifts out to where the connecting arc runs, every
//                2.2s. Purple is the *connected colour*, the same Connected
//                Purple as the device's hardware LED when it's linked to our
//                online services, so the UI mirrors the device.
//   bluetooth  — connected over Bluetooth: the same breath in the status
//                blue, --color-feedback-info.
//   connecting — amber, with a hairline arc sweeping around it: the handshake
//                is in progress, nothing has settled yet.
//   offline    — the same dot, muted, fading slowly in and out: asleep
//                rather than dead. No movement, half the tempo of the breath.
// One flat disc in all four — no gloss, no glow, no hollow ring. The motion
// carries the state; the dot itself stays a dot.
//
// `size` is the slot the dot occupies, not the disc: the disc sits a little
// under it. The connecting arc orbits just outside the slot, and the
// connected ring ends exactly on the arc's outer edge, so every state reaches
// as far as the others, and all of it out of layout.
//
// Motion honours prefers-reduced-motion, which leaves colour alone to tell the
// four states apart — so pair the dot with its word wherever the state
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
type ConnectedState = "connected" | "bluetooth" | "connecting" | "offline";

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
const coreSize = computed(() => Math.max(4, Math.round(props.size * 0.7)));
const orbit = computed(() => clamp(Math.round(props.size * 0.5), 3, 6));
const box = computed(() => `${props.size}px`);
const core = computed(() => `${coreSize.value}px`);
const ring = computed(() => `${orbit.value}px`);
const edge = computed(() => `${clamp(Math.round(props.size * 0.15), 1, 2)}px`);
/* how far the connected ring grows, as a scale of the disc: to the
   connecting arc's outer edge, the slot plus the arc's orbit each side */
const reach = computed(() =>
  String((props.size + 2 * orbit.value) / coreSize.value)
);
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

/* ---- connected and bluetooth: a breath, and one ring on the out-breath ---- */
.h-cdot--connected {
  --h-cdot-tint: var(--color-accent);
}

/* connected over Bluetooth rather than to our online services: the same
   breath in the status blue */
.h-cdot--bluetooth {
  --h-cdot-tint: var(--color-feedback-info);
}

/* The disc swells to 1.18x over the first 40% of the cycle, settles back by
   80% and rests. Slight on purpose: a status dot should be noticed, not
   watched. Picked by the owner from eighteen options (/test/connected-dot):
   two rings always on their way out read as searching, not connected. */
.h-cdot--connected .h-cdot__core,
.h-cdot--bluetooth .h-cdot__core {
  background: var(--h-cdot-tint);
  animation: h-cdot-breath 2.2s ease-in-out infinite;
}

/* One hairline ring. It waits on the swollen disc's edge and lets go at the
   top of the breath, so it drifts off as the disc settles, at an even pace,
   fading in and away. It ends on the connecting arc's outer edge (reach), so
   connected reaches exactly as far as connecting. */
.h-cdot--connected::before,
.h-cdot--bluetooth::before {
  content: "";
  position: absolute;
  inset: 0;
  margin: auto;
  width: v-bind(core);
  height: v-bind(core);
  border-radius: 50%;
  border: 1px solid var(--h-cdot-tint);
  opacity: 0;
  animation: h-cdot-pulse 2.2s linear infinite;
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

@keyframes h-cdot-breath {
  0%,
  80%,
  100% {
    transform: scale(1);
  }

  40% {
    transform: scale(1.18);
  }
}

@keyframes h-cdot-pulse {
  0%,
  40% {
    opacity: 0;
    transform: scale(1.18);
  }

  55% {
    opacity: 0.3;
  }

  100% {
    opacity: 0;
    transform: scale(v-bind(reach));
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

/* Motion off: the colours still separate the four states, and connected
   (and Bluetooth) keeps one still ring — it is the one worth telling apart
   at a glance. */
@media (prefers-reduced-motion: reduce) {
  .h-cdot--connected::before,
  .h-cdot--bluetooth::before,
  .h-cdot--connected .h-cdot__core,
  .h-cdot--bluetooth .h-cdot__core,
  .h-cdot--connecting::before,
  .h-cdot--offline .h-cdot__core {
    animation: none;
  }

  .h-cdot--offline .h-cdot__core {
    opacity: 0.75;
  }

  /* One still ring, parked partway out — at the ring's start size it sits
     on the swollen disc's edge and would vanish into it. */
  .h-cdot--connected::before,
  .h-cdot--bluetooth::before {
    opacity: 0.4;
    transform: scale(1.9);
  }
}
</style>
