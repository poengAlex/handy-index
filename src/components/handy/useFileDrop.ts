// Drop anywhere (design.md 6.4 File picker): the whole window takes files.
// While a page that calls useFileDrop() is mounted and takes files, a file
// drag anywhere in the window lights `over` (bind it to HDropOverlay's
// `show`) and a drop hands the files over. A page that takes files only in a
// drop zone doesn't call it.
//
// It is the classifier's dropzone, the most complete of the three the apps
// had built: enter and leave are counted and a drag that ends without a leave
// expires (trackDrag), hidden files and folders are left out, and a drop
// never opens the file in the tab. Plus scripter4's rule for the drop itself:
// the page's handler runs inside the drop's own turn. A drop something below
// already took (an HDropZone marks it with preventDefault) only ends the drag
// here.
import { onBeforeUnmount, onMounted, readonly, ref, type Ref } from "vue";
import { carriesFiles, filesFromDrop, trackDrag } from "./files";

export interface FileDropOptions {
  /**
   * A drop of files. `files` leaves out hidden files and folders, so it can
   * be empty: a folder on its own was dropped. It runs inside the drop's own
   * turn, and the transfer empties when it returns: read anything else from
   * it (a folder's handle, `getAsFileSystemHandle()`) before the first await.
   */
  onFiles: (files: File[], transfer: DataTransfer) => void;
  /** Whether the page takes files right now. Defaults to always. */
  enabled?: () => boolean;
}

export function useFileDrop(options: FileDropOptions): {
  over: Readonly<Ref<boolean>>;
} {
  const over = ref(false);
  const drag = trackDrag(active => (over.value = active));

  const takes = (event: DragEvent) =>
    (options.enabled?.() ?? true) && carriesFiles(event);

  function onEnter(event: DragEvent): void {
    if (!takes(event)) return;
    event.preventDefault();
    drag.enter();
  }

  function onOver(event: DragEvent): void {
    if (!takes(event)) {
      // the page stopped taking files mid-drag
      if (over.value) drag.reset();
      return;
    }
    // marked taken, so the drop guard on the window leaves it alone
    event.preventDefault();
    event.dataTransfer!.dropEffect = "copy";
    drag.over();
  }

  function onLeave(event: DragEvent): void {
    if (!takes(event)) return;
    drag.leave();
  }

  function onDrop(event: DragEvent): void {
    if (!takes(event)) return;
    drag.reset();
    // a drop zone under the pointer took it already
    if (event.defaultPrevented) return;
    event.preventDefault();
    const transfer = event.dataTransfer!;
    options.onFiles(filesFromDrop(transfer), transfer);
  }

  onMounted(() => {
    document.addEventListener("dragenter", onEnter);
    document.addEventListener("dragover", onOver);
    document.addEventListener("dragleave", onLeave);
    document.addEventListener("drop", onDrop);
  });

  onBeforeUnmount(() => {
    document.removeEventListener("dragenter", onEnter);
    document.removeEventListener("dragover", onOver);
    document.removeEventListener("dragleave", onLeave);
    document.removeEventListener("drop", onDrop);
    drag.reset();
  });

  return { over: readonly(over) };
}
