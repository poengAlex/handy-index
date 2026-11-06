<template>
  <Teleport to="body">
    <Transition name="h-drop-overlay">
      <div v-if="show" class="h-drop-overlay" aria-hidden="true">
        <div class="h-drop-overlay__card">
          <q-icon :name="icon" size="40px" class="h-drop-overlay__icon" />
          <p class="text-h4 h-drop-overlay__title">
            {{ title || kitLabel("dropToOpen") }}
          </p>
          <p v-if="body" class="text-body-sm h-drop-overlay__body">
            {{ body }}
          </p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
// What a drop will do, over the whole window while files are dragged in
// (design.md 6.4 File picker). The page shows it from useFileDrop's `over`.
// It takes no pointer events, so the drop lands on the page, and it is hidden
// from assistive tech: a drag is a pointer's gesture, and the page's file
// button is the way in for everyone else. In <body>, so a transformed
// ancestor (a page transition) can't trap a fixed layer.
import { kitLabel } from "./labels";

withDefaults(
  defineProps<{
    show: boolean;
    /** What a drop does: "Drop to open", "Drop the video". */
    title?: string;
    /** What it takes: "A video and its script". */
    body?: string;
    icon?: string;
  }>(),
  { title: "", body: "", icon: "download" }
);
</script>

<style scoped lang="scss">
.h-drop-overlay {
  position: fixed;
  inset: 0;
  // above every Quasar layer (dialogs and menus 6000, tooltips 9000, toasts
  // 9500, its own maximum 9998): files get dropped with a dialog open too
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-md);
  // the backdrop every dialog has (design.md 5.5)
  background: var(--color-bg-overlay);
  backdrop-filter: blur(4px);
  pointer-events: none;
}

.h-drop-overlay__card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-xs);
  width: min(460px, 100%);
  padding: var(--space-xl) var(--space-lg);
  // the dashed edge says "drop here" without words; the link colour is
  // Brand Blue on light and stays readable on the dark card
  border: 2px dashed var(--color-text-link);
  border-radius: var(--radius-lg);
  background: var(--color-bg-card);
  box-shadow: var(--shadow-xl);
  color: var(--color-text-primary);
  text-align: center;
}

.h-drop-overlay__icon {
  margin-bottom: var(--space-2xs);
  color: var(--color-text-link);
}

.h-drop-overlay__title {
  margin: 0;
}

.h-drop-overlay__body {
  max-width: 36ch;
  margin: 0;
  color: var(--color-text-secondary);
}

.h-drop-overlay-enter-active,
.h-drop-overlay-leave-active {
  transition: opacity 180ms ease;

  .h-drop-overlay__card {
    transition: transform 180ms ease;
  }
}

.h-drop-overlay-enter-from,
.h-drop-overlay-leave-to {
  opacity: 0;

  .h-drop-overlay__card {
    transform: scale(0.97);
  }
}

// the fade stays: it is not movement. The card no longer grows into place.
@media (prefers-reduced-motion: reduce) {
  .h-drop-overlay-enter-from .h-drop-overlay__card,
  .h-drop-overlay-leave-to .h-drop-overlay__card {
    transform: none;
  }
}
</style>
