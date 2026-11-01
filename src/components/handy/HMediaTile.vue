<template>
  <div class="h-media-tile">
    <!-- disabled dims the button alone: what sits in the corner (a menu
         with Remove) still works for a file out of reach -->
    <button
      type="button"
      class="h-media-tile__card"
      :disabled="disable"
      @click="emit('click')"
    >
      <span class="h-media-tile__poster">
        <img v-if="poster" :src="poster" alt="" loading="lazy" />
        <q-icon v-else :name="fileKindIcon(shownKind)" size="32px" />
        <span v-if="length" class="h-media-tile__length">{{ length }}</span>
      </span>
      <HFileName :name="name" class="h-media-tile__name text-body-compact" />
      <span v-if="caption" class="h-media-tile__caption text-body-sm">{{
        caption
      }}</span>
    </button>
    <div v-if="$slots.corner" class="h-media-tile__corner">
      <slot name="corner" />
    </div>
  </div>
</template>

<script setup lang="ts">
// A video or audio file as a tile in a grid (design.md 6.7 File row and media
// tile): a 16:9 poster with the length on its corner, the name cut in the
// middle, one line under it. The tile is one button, so it is one target and
// one thing to a screen reader. What goes in the poster's top corner (a VR
// chip, a menu) sits beside the button, over the poster, so it can be a
// button of its own. The poster box holds its shape with or without a
// picture, so a poster arriving later never reflows the grid.
//
// From onboardingv4's library. The page lays tiles out in a grid at least
// 160px a column (README, HMediaTile).
import { computed } from "vue";
import HFileName from "./HFileName.vue";
import { fileKind, fileKindIcon, formatDuration, type FileKind } from "./files";

const props = withDefaults(
  defineProps<{
    name: string;
    // `| undefined` throughout, so a page can pass what it may not know yet
    /** A picture URL; without one the kind's icon stands in. */
    poster?: string | undefined;
    /** Shown on the poster's corner ("12:04"). */
    durationMs?: number | undefined;
    /** The line under the name: its script, its folder, nothing. */
    caption?: string | undefined;
    /** Overrides what the name says the file is. */
    kind?: FileKind | undefined;
    disable?: boolean;
  }>(),
  { poster: "", durationMs: 0, caption: "", disable: false }
);

const emit = defineEmits<{ click: [] }>();

const shownKind = computed(() => props.kind ?? fileKind(props.name));
const length = computed(() => formatDuration(props.durationMs));
</script>

<style scoped lang="scss">
.h-media-tile {
  position: relative;
  min-width: 0;
}

.h-media-tile__card {
  display: flex;
  flex-direction: column;
  gap: var(--space-2xs);
  width: 100%;
  min-width: 0;
  padding: 0;
  border: 0;
  // the focus ring follows the poster's corners
  border-radius: var(--radius-sm);
  background: none;
  color: var(--color-text-primary);
  font: inherit;
  text-align: left;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
  }
}

.h-media-tile__poster {
  position: relative;
  display: grid;
  place-items: center;
  width: 100%;
  aspect-ratio: 16 / 9;
  margin-bottom: var(--space-2xs);
  overflow: hidden;
  border-radius: var(--radius-sm);
  // the chip fill never blends into the surface it sits on
  background: var(--h-chip-bg);
  color: var(--color-text-tertiary);
  transition: box-shadow 180ms ease;

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

// a tile that does something lifts on hover, as a card that goes somewhere
// does (design.md 6.5); dark draws a hairline instead, in the unscoped block
.h-media-tile__card:not(:disabled):hover .h-media-tile__poster {
  box-shadow: var(--shadow-md);
}

// over any picture, so a fixed ink on the overlay colour, not a theme token
.h-media-tile__length {
  position: absolute;
  right: var(--space-2xs);
  bottom: var(--space-2xs);
  padding: 1px 6px;
  border-radius: var(--radius-xs);
  background: var(--color-bg-overlay);
  color: var(--color-text-on-fill);
  font-size: var(--text-caption-size);
  font-variant-numeric: tabular-nums;
  line-height: 1.5;
}

.h-media-tile__caption {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--color-text-secondary);
}

.h-media-tile__corner {
  position: absolute;
  top: var(--space-2xs);
  right: var(--space-2xs);
  display: flex;
  gap: var(--space-2xs);
}
</style>

<style lang="scss">
// Shadows don't read on dark: the hover is a hairline, as on a nav card. An
// outline rather than an inset shadow, which the picture would cover.
[data-theme="dark"]
  .h-media-tile__card:not(:disabled):hover
  .h-media-tile__poster,
.section-dark .h-media-tile__card:not(:disabled):hover .h-media-tile__poster {
  box-shadow: none;
  outline: 1px solid var(--color-stroke-default);
  outline-offset: -1px;
}
</style>
