<template>
  <transition name="back-to-top">
    <q-btn
      v-if="visible"
      round
      unelevated
      icon="arrow_upward"
      class="back-to-top"
      :class="dark ? 'glass-dark' : 'glass-light'"
      :aria-label="label"
      @click="toTop"
    >
      <q-tooltip>{{ label }}</q-tooltip>
    </q-btn>
  </transition>
</template>

<script setup lang="ts">
// The long-list escape hatch: a discreet glass FAB that appears only once the
// page is genuinely long to scroll back out of. The gate is measured in
// viewports rather than pixels — a fixed pixel threshold would surface it on
// the second screen of a phone and only on the fifth of a desktop monitor,
// where "how far did I scroll" is the same feeling in both. Two viewports
// means it never shows on a page that merely spills past the fold.
//
// Props in, no route access (ARCHITECTURE.md: components/ layer) — the shell
// decides which routes mount it.
import { onMounted, onUnmounted, ref } from "vue";
import { useHandyTheme } from "@/components/handy";

const props = withDefaults(
  defineProps<{
    /** Screen-reader name and tooltip. */
    label: string;
    /** How many viewport heights must be scrolled before it appears. */
    viewports?: number;
  }>(),
  { viewports: 2 }
);

const { dark } = useHandyTheme();
const visible = ref(false);

function onScroll() {
  visible.value = window.scrollY > window.innerHeight * props.viewports;
}

function toTop() {
  // The shell's own route-change reset uses an instant scroll; this one is
  // smooth on purpose — you asked to travel, and the motion is what says the
  // page moved rather than swapped. Honour the reduced-motion opt-out, which
  // a CSS rule cannot reach from here.
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
}

onMounted(() => {
  window.addEventListener("scroll", onScroll, { passive: true });
  // Endless-scroll pages restore mid-list on a back navigation, so the
  // button has to know where it stands before the first scroll event.
  onScroll();
});

onUnmounted(() => {
  window.removeEventListener("scroll", onScroll);
});
</script>

<style scoped lang="scss">
// Sits above the page surface but below the header (2000) and every overlay,
// so a dialog or the mobile drawer covers it rather than punching through.
.back-to-top {
  position: fixed;
  right: var(--space-md);
  bottom: calc(var(--space-md) + env(safe-area-inset-bottom, 0px));
  z-index: 1000;
  color: var(--color-text-secondary);
  border: 1px solid var(--color-stroke-subtle);
  box-shadow: var(--shadow-sm);
  transition:
    color 180ms ease,
    box-shadow 180ms ease;

  &:hover {
    color: var(--color-text-primary);
    box-shadow: var(--shadow-md);
  }

  @media (max-width: 599px) {
    right: var(--space-sm);
    bottom: calc(var(--space-sm) + env(safe-area-inset-bottom, 0px));
  }
}

.back-to-top-enter-active,
.back-to-top-leave-active {
  transition:
    opacity 180ms ease,
    transform 180ms ease;
}

.back-to-top-enter-from,
.back-to-top-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

@media (prefers-reduced-motion: reduce) {
  .back-to-top-enter-active,
  .back-to-top-leave-active {
    transition: none;
  }

  .back-to-top-enter-from,
  .back-to-top-leave-to {
    transform: none;
  }
}
</style>
