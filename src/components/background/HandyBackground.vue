<template>
  <div ref="rootEl" class="hbg" :class="`hbg--${attachment}`">
    <BackdropAttach
      v-if="attachment !== 'inline'"
      :attach="attachment as Attach"
      :band="bandVh"
    >
      <LensField
        ref="fieldRef"
        :s="settings"
        :canvas-ratio="canvasRatio"
        :resolved="resolvedTheme"
        :surface="resolvedSurface"
        :mount-nonce="nonce"
      >
        <template v-if="grainScoped" #grain>
          <GrainOverlay v-bind="grainProps" />
        </template>
      </LensField>
      <!-- Frame grain is fixed: the sensor does not travel with the scene.
           Scoped grain has to, so it moves inside the field instead. -->
      <template v-if="!grainScoped" #overlay>
        <GrainOverlay v-bind="grainProps" fixed />
      </template>
    </BackdropAttach>

    <!-- inline: fills this component's own box instead of the viewport -->
    <template v-else>
      <LensField
        ref="fieldRef"
        :s="settings"
        :resolved="resolvedTheme"
        :surface="resolvedSurface"
        :mount-nonce="nonce"
      >
        <template v-if="grainScoped" #grain>
          <GrainOverlay v-bind="grainProps" />
        </template>
      </LensField>
      <GrainOverlay v-if="!grainScoped" v-bind="grainProps" />
    </template>
  </div>
</template>

<script setup lang="ts">
// The whole background in one tag.
//
//   <HandyBackground />                      the default scene
//   <HandyBackground scene="aurora" />       a named look, motion included
//   <HandyBackground :config="exported" />   a config from the lab playground
//   <HandyBackground scene="deck" motion="still" :strength="0.6" />
//
// Put it first inside a `position: relative` container and give the content
// after it `position: relative; z-index: 1`. That is the entire contract.
//
// Precedence, loosest to tightest: defaults, then `scene`, then `config`,
// then any individual prop. So a config exported from the playground can be
// dropped in whole and still have one thing tweaked at the call site.
import { computed, onMounted, ref, toRef } from "vue";
import GrainOverlay from "./GrainOverlay.vue";
import LensField from "./LensField.vue";
import BackdropAttach from "./MeshBackdrop.vue";
import { parseConfig, type PlaygroundConfig } from "./config-io";
import { defaults, type LensSettings } from "./lens";
import type { PaletteId } from "./gradient-recipes";
import type { MotionId, MountId } from "./motion";
import type { Attach, LensScope } from "./lens";
import { scene as sceneById, sceneSettings, type SceneId } from "./scenes";
import { findFixedBreaker, rootScrolls, useHost } from "./host";

const props = withDefaults(
  defineProps<{
    /** A named look with its motion already chosen. */
    scene?: SceneId;
    /** A config object or JSON string exported from the lab playground. */
    config?: PlaygroundConfig | string | null;
    /** How it relates to the scroll. "inline" fills its parent instead. */
    attach?: "pinned" | "parallax" | "travels" | "banded" | "inline" | null;
    // ---- colour ----
    /** One of the four named palettes. */
    palette?: PaletteId | null;
    /**
     * Your own colours, as #rrggbb. Repeat one to weight it: the shipped
     * looks pass blue twice, because four colours at equal weight is what
     * turns a field to mud. Invalid entries are dropped, and if nothing
     * survives the palette is used instead.
     */
    colors?: string[] | null;
    /** Per-blob strength, 0-1. How much colour, as opposed to how much field. */
    alpha?: number | null;

    // ---- ambient motion (slow) ----
    motion?: MotionId | null;
    /** Cycle-length multiplier, 0.1-24. Higher is faster. */
    speed?: number | null;
    /** Amplitude multiplier. 0 stops it without changing the preset. */
    amount?: number | null;

    // ---- entrance (quick) ----
    mount?: MountId | null;
    /** Entrance duration in ms. */
    mountMs?: number | null;
    /** A beat before the field arrives usually reads better. */
    mountDelay?: number | null;

    /** 0-1. The single knob most consumers will want. */
    strength?: number | null;
    /** "blobs" confines the grain to the colour; "frame" is the default. */
    lensScope?: LensScope | null;
    /** "auto" inherits the host's theme; the others pin it. */
    theme?: "auto" | "light" | "dark";
    /** `banded` only: how far down the page the band reaches, in vh. */
    band?: number | null;
    /** Speed a burst() reaches, as a multiple of the preset's own rate. */
    burstSpeed?: number;
    /** How long a burst lasts, including both ramps. */
    burstMs?: number;
    /**
     * Bumping this replays the entrance. Usually you want the exposed
     * `play()` method on a template ref instead.
     */
    mountNonce?: number;
  }>(),
  {
    scene: "handy",
    config: null,
    attach: null,
    palette: null,
    colors: null,
    alpha: null,
    motion: null,
    speed: null,
    amount: null,
    mount: null,
    mountMs: null,
    mountDelay: null,
    strength: null,
    lensScope: null,
    theme: "auto",
    band: null,
    burstSpeed: 24,
    burstMs: 2000,
    mountNonce: 0
  }
);

// A config prop is parsed through the same hardened reader the playground's
// import uses, so a file from an older version migrates and a malformed one
// falls back to the scene rather than throwing at render.
const fromConfig = computed(() => {
  const raw = toRef(props, "config").value;
  if (!raw) return null;
  const text = typeof raw === "string" ? raw : JSON.stringify(raw);
  const parsed = parseConfig(text);
  return parsed.ok ? parsed.config : null;
});

const settings = computed<LensSettings>(() => {
  const base: LensSettings =
    fromConfig.value?.settings ?? sceneSettings(props.scene);
  const out: LensSettings = { ...defaults, ...base };

  // colour
  if (props.palette) {
    out.palette = props.palette;
    // a named palette and hand-picked colours are different intents; naming
    // a palette clears any custom set inherited from the scene or config
    out.custom = null;
  }
  if (ownColors.value) out.custom = ownColors.value;
  if (props.alpha !== null) out.alpha = props.alpha;
  if (props.strength !== null) out.strength = props.strength;
  if (props.lensScope) out.lensScope = props.lensScope;

  // ambient motion
  if (props.motion || props.speed !== null || props.amount !== null) {
    out.motion = {
      ...out.motion,
      ...(props.motion ? { id: props.motion } : {}),
      ...(props.speed !== null ? { speed: props.speed } : {}),
      ...(props.amount !== null ? { amount: props.amount } : {})
    };
  }

  // entrance
  if (props.mount || props.mountMs !== null || props.mountDelay !== null) {
    out.mount = {
      ...out.mount,
      ...(props.mount ? { id: props.mount } : {}),
      ...(props.mountMs !== null ? { ms: props.mountMs } : {}),
      ...(props.mountDelay !== null ? { delay: props.mountDelay } : {})
    };
  }
  return out;
});

const HEX = /^#[0-9a-f]{6}$/i;

// A colours prop comes from application code, so it is checked rather than
// trusted: a typo costs that one colour, not the whole field.
const ownColors = computed(() => {
  const raw = props.colors;
  if (!raw?.length) return null;
  const clean = raw.filter(c => typeof c === "string" && HEX.test(c));
  if (import.meta.env.DEV && clean.length !== raw.length) {
    console.warn(
      `[HandyBackground] ${raw.length - clean.length} colour(s) were not #rrggbb and were ignored.`
    );
  }
  return clean.length ? clean.map(c => c.toUpperCase()) : null;
});

type Attachment = "pinned" | "parallax" | "travels" | "banded" | "inline";
const ATTACHMENTS: Attachment[] = [
  "pinned",
  "parallax",
  "travels",
  "banded",
  "inline"
];

// A config carries an attachment as a plain string, so validate it rather
// than trusting it into a lookup.
const attachment = computed<Attachment>(() => {
  const wanted =
    props.attach ?? fromConfig.value?.attach ?? sceneById(props.scene).attach;
  return ATTACHMENTS.includes(wanted as Attachment)
    ? (wanted as Attachment)
    : "parallax";
});

// must track MeshBackdrop's own rates
const RATE: Record<Attachment, number> = {
  pinned: 0,
  parallax: 0.5,
  travels: 1.4,
  banded: 0,
  inline: 0
};
// Same precedence as everything else: prop, then config, then scene. It used
// to be a plain prop defaulting to 160, which meant a config carrying its own
// band was silently ignored.
const bandVh = computed(
  () =>
    props.band ?? fromConfig.value?.band ?? sceneById(props.scene).band ?? 160
);

const canvasRatio = computed(() => 1 + (RATE[attachment.value] ?? 0));

const rootEl = ref<HTMLElement | null>(null);
const { theme: resolvedTheme, surface: resolvedSurface } = useHost(
  rootEl,
  toRef(props, "theme")
);

// Two host conditions this component cannot fix and must not hide. Stock
// Quasar hits both: `<q-layout container>` puts transform on its scroller
// (so position: fixed stops being fixed) and scrolls inside itself rather
// than at the document root (so scroll-driven parallax never runs).
onMounted(() => {
  if (!import.meta.env.DEV) return;
  if (attachment.value !== "inline") {
    const breaker = findFixedBreaker(rootEl.value);
    if (breaker) {
      console.warn(
        `[HandyBackground] attach="${attachment.value}" needs position: fixed, but an ancestor breaks it — ${breaker}. Use attach="inline", or move this outside that element.`
      );
    }
  }
  if (
    (attachment.value === "parallax" || attachment.value === "travels") &&
    !rootScrolls()
  ) {
    console.warn(
      `[HandyBackground] attach="${attachment.value}" follows the document scroll, but the document root is not what scrolls here (a q-layout container or a scroll area is). It will behave like "pinned".`
    );
  }
  const box = rootEl.value?.getBoundingClientRect();
  if (attachment.value === "inline" && box && (!box.width || !box.height)) {
    console.warn(
      '[HandyBackground] attach="inline" fills its parent, and that parent is 0px. Give it a size, or use a different attachment.'
    );
  }
});

// Replaying an entrance is an action, not a state, so it is a method:
//   const bg = useTemplateRef("bg");
//   bg.value.play();
const replay = ref(0);
const nonce = computed(() => props.mountNonce + replay.value);

interface FieldApi {
  burst: (o?: {
    to?: number;
    attack?: number;
    hold?: number;
    release?: number;
  }) => void;
  stopBurst: () => void;
}

// The shipped envelope: a quick surge and a long settle. Total 2000ms.
const ATTACK = 180;
const HOLD = 420;
const RELEASE = 1400;
const TOTAL = ATTACK + HOLD + RELEASE;
const fieldRef = ref<FieldApi | null>(null);

defineExpose({
  /** Play the entrance animation again. */
  play: () => {
    replay.value += 1;
  },
  /**
   * Temporarily run the ambient motion much faster, then settle back —
   * a page-transition flourish. Defaults to 24x for two seconds.
   */
  burst: (o?: { speed?: number; ms?: number }) => {
    // The friendly two-argument form outside, the envelope inside: a custom
    // total scales all three phases so the shape is preserved rather than
    // the hold absorbing the whole difference.
    const k = (o?.ms ?? props.burstMs) / TOTAL;
    fieldRef.value?.burst({
      to: o?.speed ?? props.burstSpeed,
      attack: ATTACK * k,
      hold: HOLD * k,
      release: RELEASE * k
    });
  },
  /** Cut a burst short. */
  stopBurst: () => fieldRef.value?.stopBurst(),
  /** The settings actually in effect, after every prop has been applied. */
  settings
});

const grainScoped = computed(() => settings.value.lensScope === "blobs");

const grainProps = computed(() => ({
  amount: settings.value.grain,
  size: settings.value.grainSize,
  rough: settings.value.grainRough,
  blend: settings.value.grainBlend
}));
</script>

<style scoped lang="scss">
// The facade owns a box rather than borrowing one. `inline` used to inherit
// whatever the parent happened to be, so a parent that was not positioned
// let the field escape to some ancestor, and a content-sized empty parent
// made it 0x0 — nothing rendered, with no error.
.hbg {
  display: contents;
}

.hbg--inline {
  display: block;
  position: absolute;
  inset: 0;
  pointer-events: none;
}
</style>
