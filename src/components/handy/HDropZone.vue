<template>
  <button
    type="button"
    class="h-drop-zone"
    :class="{ 'h-drop-zone--dragging': lit }"
    :disabled="disable"
    @click="open"
    @dragenter="onEnter"
    @dragover="onOver"
    @drop="onDrop"
  >
    <q-icon :name="icon" size="40px" class="h-drop-zone__icon" />
    <span v-if="lit" class="text-body-compact h-drop-zone__title">{{
      kitLabel("dropHere")
    }}</span>
    <span v-else-if="title" class="text-body-compact h-drop-zone__title">{{
      title
    }}</span>
    <template v-else>
      <span
        class="text-body-compact h-drop-zone__title h-drop-zone__title--pointer"
        >{{ kitLabel("dropZone") }}</span
      >
      <span
        class="text-body-compact h-drop-zone__title h-drop-zone__title--touch"
        >{{ kitLabel("dropZoneTouch") }}</span
      >
    </template>
    <!-- kept in place while it is hidden, so the title doesn't jump -->
    <span
      v-if="caption"
      class="text-caption h-drop-zone__caption"
      :class="{ 'h-drop-zone__caption--hidden': lit }"
      >{{ caption }}</span
    >
  </button>
</template>

<script setup lang="ts">
// The file picker as a place (design.md 6.4): a drop zone for a page that is
// waiting for files, after the Handyverse player's empty stage. The whole box
// is one button that opens the system's picker, and it takes a drop. The
// dashed edge, a little inside the box, says so before anyone tries.
//
// While files are dragged anywhere over the window, the zone lights up hard
// (a thicker line, a deeper tint, "Drop here"), so it can be found: on a page
// that takes files only here, a drop anywhere else is refused, and the zone
// refuses it itself while mounted (installDropGuard). On a page that takes
// drops anywhere (useFileDrop), the drop overlay covers it during the drag,
// and a drop on the zone is still the zone's.
//
// What it takes, it marks taken (preventDefault) and lets bubble: the page's
// useFileDrop and the guard see a taken drop and leave it alone, and nothing
// here hides a drag from them.
//
// It fills its container, at least 160px tall, so a stage that keeps a 16:9
// box (a player before its video) keeps it with the zone in it.
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import {
  carriesFiles,
  filesFromDrop,
  installDropGuard,
  pickFiles,
  trackDrag
} from "./files";
import { kitLabel } from "./labels";

const props = withDefaults(
  defineProps<{
    /** What the picker offers ("video/*,.funscript"): a hint, not a check. */
    accept?: string;
    multiple?: boolean;
    /** What to drop: "Drop a video and its script here". */
    title?: string;
    /** A quieter, smaller line under it: "Or click to choose them". */
    caption?: string;
    icon?: string;
    /** Lit as during a drag, without one: for a page that tracks drags itself,
     * or shows the state. A real drag lights it by itself. */
    dragging?: boolean;
    disable?: boolean;
  }>(),
  {
    accept: "",
    multiple: false,
    title: "",
    caption: "",
    icon: "download",
    dragging: false,
    disable: false
  }
);

const emit = defineEmits<{
  /**
   * What was chosen or dropped. A pick passes no transfer and is never empty.
   * A drop passes its transfer, to read anything else from before the first
   * await, and leaves out hidden files and folders, so it can be empty.
   */
  files: [files: File[], transfer: DataTransfer | null];
}>();

/** Files somewhere over the window. Seen in the capture phase, so a page
 * that stops a drag event further down can't keep it from the zone. */
const inWindow = ref(false);
const windowDrag = trackDrag(active => (inWindow.value = active));

const lit = computed(
  () => !props.disable && (inWindow.value || props.dragging)
);

function onWindowEnter(event: DragEvent): void {
  if (carriesFiles(event)) windowDrag.enter();
}

function onWindowOver(event: DragEvent): void {
  if (carriesFiles(event)) windowDrag.over();
}

function onWindowLeave(event: DragEvent): void {
  if (carriesFiles(event)) windowDrag.leave();
}

function onWindowDrop(): void {
  windowDrag.reset();
}

const takes = (event: DragEvent) => !props.disable && carriesFiles(event);

function onEnter(event: DragEvent): void {
  if (takes(event)) event.preventDefault();
}

function onOver(event: DragEvent): void {
  if (!takes(event)) return;
  event.preventDefault();
  event.dataTransfer!.dropEffect = "copy";
}

function onDrop(event: DragEvent): void {
  if (!takes(event)) return;
  event.preventDefault();
  const transfer = event.dataTransfer!;
  emit("files", filesFromDrop(transfer), transfer);
}

// Straight from the click, nothing awaited first: the picker needs the
// click's activation, and the browser forgets it at the first await.
function open(): void {
  void pickFiles({ accept: props.accept, multiple: props.multiple }).then(
    files => {
      if (files.length) emit("files", files, null);
    }
  );
}

let unguard: (() => void) | undefined;

onMounted(() => {
  document.addEventListener("dragenter", onWindowEnter, true);
  document.addEventListener("dragover", onWindowOver, true);
  document.addEventListener("dragleave", onWindowLeave, true);
  document.addEventListener("drop", onWindowDrop, true);
  unguard = installDropGuard();
});

onBeforeUnmount(() => {
  document.removeEventListener("dragenter", onWindowEnter, true);
  document.removeEventListener("dragover", onWindowOver, true);
  document.removeEventListener("dragleave", onWindowLeave, true);
  document.removeEventListener("drop", onWindowDrop, true);
  windowDrag.reset();
  unguard?.();
});
</script>

<style scoped lang="scss">
.h-drop-zone {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-xs);
  width: 100%;
  height: 100%;
  min-height: 160px;
  padding: var(--space-lg) var(--space-md);
  border: 0;
  border-radius: var(--radius-lg);
  // the chip fill never blends into the surface it sits on
  background-color: var(--h-chip-bg);
  color: var(--color-text-secondary);
  font: inherit;
  text-align: center;
  cursor: pointer;
  transition: color 180ms ease;

  // the dashed edge, a little inside the box, and quiet until it matters
  &::before {
    content: "";
    position: absolute;
    inset: var(--space-xs);
    border: 2px dashed
      color-mix(in srgb, var(--color-text-tertiary) 55%, transparent);
    border-radius: calc(var(--radius-lg) - var(--space-xs));
    pointer-events: none;
    transition: border-color 180ms ease;
  }

  &:disabled {
    cursor: not-allowed;
  }
}

// pointed at: the line and the icon take the link colour, and the box the
// row-hover tint, laid over the fill because it is translucent
@media (hover: hover) {
  .h-drop-zone:not(:disabled):hover {
    color: var(--color-text-primary);
    background-image: linear-gradient(
      var(--color-row-hover),
      var(--color-row-hover)
    );

    &::before {
      border-color: var(--color-text-link);
    }

    .h-drop-zone__icon {
      color: var(--color-text-link);
    }
  }
}

// files anywhere over the window: harder, so the one place that takes them
// is found at a glance
.h-drop-zone--dragging {
  color: var(--color-text-primary);
  background-image: linear-gradient(
    color-mix(in srgb, var(--color-text-link) 16%, transparent),
    color-mix(in srgb, var(--color-text-link) 16%, transparent)
  );

  &::before {
    border-width: 3px;
    border-color: var(--color-text-link);
  }

  .h-drop-zone__icon {
    color: var(--color-text-link);
  }
}

.h-drop-zone__icon {
  margin-bottom: var(--space-2xs);
  transition: color 180ms ease;
}

// balanced, so a narrow zone breaks "Drop files here, / or click to choose"
// rather than leaving one word on the second line
.h-drop-zone__title,
.h-drop-zone__caption {
  max-width: 40ch;
  text-wrap: balance;
}

.h-drop-zone__caption {
  color: var(--color-text-tertiary);
}

.h-drop-zone__caption--hidden {
  visibility: hidden;
}

// the default words: a pointer drops or clicks, a touch screen only taps
.h-drop-zone__title--touch {
  display: none;
}

@media (hover: none) and (pointer: coarse) {
  .h-drop-zone__title--pointer {
    display: none;
  }

  .h-drop-zone__title--touch {
    display: inline;
  }
}
</style>
