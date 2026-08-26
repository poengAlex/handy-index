<template>
  <div class="tile-card">
    <component :is="tag" v-bind="linkAttrs" class="tile-card__link">
      <div class="tile-card__media" :style="{ aspectRatio: aspect }">
        <slot name="media" />
      </div>
      <div class="tile-card__body">
        <slot />
      </div>
    </component>
    <!-- outside the link on purpose: a tile whose actions are buttons (vote,
         and anything after it) can't nest them inside an anchor — every click
         would also navigate, and interactive content inside a link is a
         screen-reader trap -->
    <div v-if="$slots.footer" class="tile-card__footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
// The shared media-tile contract (VideoCard, performer cards, requests): flat
// card surface, fixed-ratio media well over a text body, hover lift per theme,
// optional action footer. Slotted imagery uses .tile-card__img /
// .tile-card__placeholder so the well owns the sizing (absolute cover —
// content can't stretch the ratio).
//
// Give it `to` for an in-app route or `href` for an external link (opened in
// a new tab); with neither, the tile is inert markup rather than a dead link.
import { computed } from "vue";

const props = withDefaults(
  defineProps<{ to?: string; href?: string; aspect?: string }>(),
  { to: "", href: "", aspect: "16 / 9" }
);

const tag = computed(() => {
  if (props.to) return "router-link";
  return props.href ? "a" : "div";
});

const linkAttrs = computed(() => {
  if (props.to) return { to: props.to };
  return props.href
    ? { href: props.href, target: "_blank", rel: "noopener noreferrer" }
    : {};
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
  transition: box-shadow 180ms ease;

  &:hover {
    box-shadow: var(--shadow-md);
  }
}

// the link fills the card so the whole tile (minus the footer) is the target
.tile-card__link {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  color: inherit;
  text-decoration: none !important;
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

// shares the body's inset, and hangs off the bottom of the card
.tile-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-xs);
  padding: 0 var(--space-sm) var(--space-sm);
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
