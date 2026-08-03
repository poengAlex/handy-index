<template>
  <router-link :to="to" class="tile-card">
    <div class="tile-card__media" :style="{ aspectRatio: aspect }">
      <slot name="media" />
    </div>
    <div class="tile-card__body">
      <slot />
    </div>
  </router-link>
</template>

<script setup lang="ts">
// The shared media-tile contract (VideoCard, performer cards): flat card
// surface, fixed-ratio media well over a text body, hover lift per theme.
// Slotted imagery uses .tile-card__img / .tile-card__placeholder so the well
// owns the sizing (absolute cover — content can't stretch the ratio).
withDefaults(defineProps<{ to: string; aspect?: string }>(), {
  aspect: "16 / 9"
});
</script>

<style scoped lang="scss">
.tile-card {
  display: flex;
  flex-direction: column;
  border-radius: var(--radius-lg);
  background: var(--color-bg-card);
  overflow: hidden;
  color: var(--color-text-primary);
  text-decoration: none !important;
  transition: box-shadow 180ms ease;

  &:hover {
    box-shadow: var(--shadow-md);
  }
}

.tile-card__media {
  position: relative;
  background: var(--color-bg-page-alt);
}

:slotted(.tile-card__img) {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

:slotted(.tile-card__placeholder) {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-tertiary);
}

.tile-card__body {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: var(--space-sm);
}
</style>

<style lang="scss">
// Shadows don't read on dark — hover lifts via an *outset* hairline ring
// (an inset one gets painted over by the edge-to-edge media).
[data-theme="dark"] .tile-card:hover,
.section-dark .tile-card:hover {
  box-shadow: 0 0 0 1px var(--color-stroke-default);
}
</style>
