<template>
  <HListRow
    :label="name"
    :caption="facts"
    :clickable="clickable && !disable"
    :class="['h-file-row', { 'h-file-row--disabled': disable }]"
    @click="emit('click')"
  >
    <template #leading>
      <span v-if="thumbnail !== undefined" class="h-file-row__thumb">
        <img v-if="thumbnail" :src="thumbnail" alt="" loading="lazy" />
        <q-icon v-else :name="fileKindIcon(shownKind)" size="20px" />
      </span>
      <q-icon v-else :name="fileKindIcon(shownKind)" size="24px" />
    </template>

    <template #label>
      <HFileName :name="name" class="text-body-compact" />
    </template>

    <template v-if="$slots.suffix" #suffix>
      <slot name="suffix" />
    </template>

    <template v-if="removable || $slots.trailing" #trailing>
      <span class="h-file-row__trailing">
        <slot name="trailing" />
        <!-- the kit's close button, as on a dismissible banner -->
        <q-btn
          v-if="removable"
          flat
          round
          dense
          size="sm"
          icon="close"
          class="h-file-row__remove"
          :aria-label="kitLabelFor('removeFile', name)"
          @click.stop="emit('remove')"
        />
      </span>
    </template>
  </HListRow>
</template>

<script setup lang="ts">
// One file in a list (design.md 6.7 File row and media tile): the grouped-list
// row with a file wired in. An icon for its kind or a 16:9 thumbnail, the
// name cut in the middle, a caption of facts, and at the end an optional
// remove button and anything the page adds before it (a badge, a ring, a
// menu). It reports; the page removes the file or opens it.
//
// `thumbnail` reserves the 16:9 box as soon as it is given at all: pass ""
// while the picture is still being read, and the row won't change shape when
// it arrives. Left out, the row shows the kind's icon. In a list that mixes,
// give every row the box ("" for a file with no picture), so the names line
// up.
//
// `disable` is a file out of reach (moved, deleted, not allowed): the icon
// and the text dim and the row doesn't open, but what sits at its end still
// works, so the file can be taken off the list. That is why it isn't
// Quasar's disabled item, whose rule strips the focus ring and the cursor
// from everything inside the row, and why the row carries no aria-disabled,
// which would disable its remove button for assistive tech too. The row
// doesn't open, and the caption says why.
import { computed } from "vue";
import HFileName from "./HFileName.vue";
import HListRow from "./HListRow.vue";
import {
  fileKind,
  fileKindIcon,
  formatDuration,
  formatFileSize,
  type FileKind
} from "./files";
import { kitLabelFor } from "./labels";

const props = withDefaults(
  defineProps<{
    name: string;
    // `| undefined` throughout, so a page can pass what it may not know yet
    /** Bytes; shown first in the caption ("1.2 GB"). */
    size?: number | undefined;
    /** A media file's length; shown after the size ("12:04"). */
    durationMs?: number | undefined;
    /** The rest of the caption, after the size and length. */
    caption?: string | undefined;
    /** Overrides what the name says the file is (a folder, say). */
    kind?: FileKind | undefined;
    /** A picture URL, or "" to hold its place until one arrives. */
    thumbnail?: string | undefined;
    removable?: boolean;
    /** The row opens the file: hover tint, ripple, `click`. */
    clickable?: boolean;
    disable?: boolean;
  }>(),
  // size, durationMs, kind and thumbnail have no default: left out, they
  // are not shown
  { caption: "", removable: false, clickable: false, disable: false }
);

const emit = defineEmits<{ click: []; remove: [] }>();

const shownKind = computed(() => props.kind ?? fileKind(props.name));

const facts = computed(() =>
  [
    props.size === undefined ? "" : formatFileSize(props.size),
    props.durationMs === undefined ? "" : formatDuration(props.durationMs),
    props.caption
  ]
    .filter(Boolean)
    .join(" · ")
);
</script>

<style scoped lang="scss">
// the name gives way before a badge beside it does: the row's label line
// stays one line, and what sits beside the name keeps its size
.h-file-row :deep(.h-list-row__label) {
  flex-wrap: nowrap;
  min-width: 0;

  > :not(.h-file-name) {
    flex: none;
  }
}

// the kit's 50%, on the file's part of the row only
.h-file-row--disabled {
  cursor: not-allowed;

  :deep(.h-list-row__leading),
  :deep(.q-item__section--main) {
    opacity: 0.5;
  }
}

.h-file-row__thumb {
  display: grid;
  place-items: center;
  width: 80px;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  border-radius: var(--radius-sm);
  // the chip fill never blends into the surface it sits on
  background: var(--h-chip-bg);
  color: var(--color-text-tertiary);

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.h-file-row__trailing {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
}

.h-file-row__remove {
  color: var(--color-text-tertiary);
}
</style>
