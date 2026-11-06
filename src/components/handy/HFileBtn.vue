<template>
  <HBtn
    v-if="!folder || folderSupported"
    :variant="variant"
    :size="size"
    :icon="icon || (folder ? 'folder_open' : 'upload_file')"
    :label="label || kitLabel(labelKey)"
    :disable="disable"
    @click="open"
  />
</template>

<script setup lang="ts">
// The way in for files (design.md 6.4 File picker): a button that opens the
// system's picker and hands the page what was chosen. The window taking drops
// (useFileDrop + HDropOverlay) is the other way in, and never the only one: a
// drag is a pointer's gesture, so every page that takes a drop has this too.
//
// `folder` asks for a folder instead and hands over its handle, for an app
// that keeps folders between visits. Only Chrome and Edge on a computer can,
// so elsewhere the button is absent rather than disabled: there is nothing a
// person could do to enable it.
import { computed } from "vue";
import HBtn from "./HBtn.vue";
import { canPickFolder, pickFiles, pickFolder } from "./files";
import { kitLabel } from "./labels";

const props = withDefaults(
  defineProps<{
    /** What the picker offers ("video/*,.funscript"): a hint, not a check. */
    accept?: string;
    multiple?: boolean;
    /** Pick a folder and emit `folder` with its handle. */
    folder?: boolean;
    /** The page's own verb ("Add files"); defaults to "Choose files". */
    label?: string;
    icon?: string;
    variant?: "primary" | "secondary" | "tertiary";
    size?: "sm" | "md" | "lg";
    disable?: boolean;
  }>(),
  {
    accept: "",
    multiple: false,
    folder: false,
    label: "",
    icon: "",
    variant: "secondary",
    size: "md",
    disable: false
  }
);

const emit = defineEmits<{
  /** What was chosen. Not emitted when the picker is cancelled. */
  files: [files: File[]];
  folder: [handle: FileSystemDirectoryHandle];
}>();

// read once: a browser doesn't grow a folder picker while the page is open
const folderSupported = canPickFolder();

// the key, not the words: the label is read during render, so it follows a
// language change
const labelKey = computed(() =>
  props.folder ? "chooseFolder" : props.multiple ? "chooseFiles" : "chooseFile"
);

// Straight from the click, nothing awaited first: the picker needs the
// click's activation, and the browser forgets it at the first await.
function open(): void {
  if (props.folder) {
    void pickFolder().then(handle => {
      if (handle) emit("folder", handle);
    });
    return;
  }
  void pickFiles({ accept: props.accept, multiple: props.multiple }).then(
    files => {
      if (files.length) emit("files", files);
    }
  );
}
</script>
