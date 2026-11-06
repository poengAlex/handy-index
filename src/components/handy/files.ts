// Files from the person's own computer: asking for them, taking them from a
// drop, and the words and icons a file is shown with (design.md 6.4 File
// picker, 6.7 File row and media tile, 10.3 Formats).
//
// Pure DOM and no Vue, so the vanilla kit can share it later. Nothing here
// keeps a file or a handle: remembering a folder between visits, reading a
// video's poster, pairing a script with its video are the app's.

/** What a file is, as far as the kit shows it: its icon and nothing more. */
export type FileKind =
  | "video"
  | "audio"
  | "script"
  | "image"
  | "data"
  | "folder"
  | "file";

/** Material Symbols names, one per kind. `folder` only ever comes from a
 * caller: a File is never a folder. */
export const FILE_KIND_ICONS: Readonly<Record<FileKind, string>> = {
  video: "movie",
  audio: "music_note",
  script: "graphic_eq",
  image: "image",
  data: "data_object",
  folder: "folder",
  file: "draft"
};

const KIND_BY_EXTENSION: Readonly<Record<string, Exclude<FileKind, "folder">>> =
  {
    ...byExtension("video", "mp4 m4v mov webm mkv avi wmv mpg mpeg"),
    ...byExtension("audio", "mp3 m4a aac wav ogg oga opus flac"),
    ...byExtension("script", "funscript"),
    ...byExtension("image", "png jpg jpeg gif webp avif heic svg"),
    ...byExtension("data", "json csv txt")
  };

function byExtension<K extends FileKind>(
  kind: K,
  list: string
): Record<string, K> {
  return Object.fromEntries(list.split(" ").map(ext => [ext, kind]));
}

/** The extension, lower case and without its dot: "mp4". "" for none, and
 * for a hidden file's leading dot (".DS_Store" has no extension). */
export function fileExtension(name: string): string {
  const dot = name.lastIndexOf(".");
  return dot > 0 && dot < name.length - 1
    ? name.slice(dot + 1).toLowerCase()
    : "";
}

/**
 * What a file is, by its extension first: a dropped file often has no type,
 * and a `.funscript` never has one. The MIME type decides only what the
 * extension doesn't know. Never "folder": a name can't say so.
 */
export function fileKind(file: File | string): Exclude<FileKind, "folder"> {
  const name = typeof file === "string" ? file : file.name;
  const known = KIND_BY_EXTENSION[fileExtension(name)];
  if (known) return known;
  const type = typeof file === "string" ? "" : file.type;
  if (type.startsWith("video/")) return "video";
  if (type.startsWith("audio/")) return "audio";
  if (type.startsWith("image/")) return "image";
  return "file";
}

/** The icon a file is drawn with when it has no picture of its own. */
export function fileKindIcon(kind: FileKind): string {
  return FILE_KIND_ICONS[kind];
}

/** A file's size in decimal units with a space (10.3): 512 B, 8.4 KB, 84 KB,
 * 1.2 GB. One decimal under 10, none from 10. Decimal, as the apps already
 * count (a "1.2 GB" video is 1.2 billion bytes). */
export function formatFileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return "";
  if (bytes < 1000) return `${Math.round(bytes)} B`;
  const units = ["KB", "MB", "GB", "TB"];
  let value = bytes / 1000;
  let unit = 0;
  // stepped on the ROUNDED figure: 999.96 KB is "1.0 MB", not "1000 KB"
  while (Number(sizeFigure(value)) >= 1000 && unit < units.length - 1) {
    value /= 1000;
    unit++;
  }
  return `${sizeFigure(value)} ${units[unit]}`;
}

/** One decimal under 10, none from 10, judged on the rounded value: 9.96 is
 * "10", not "10.0". */
function sizeFigure(value: number): string {
  const tenths = value.toFixed(1);
  return Number(tenths) < 10 ? tenths : String(Math.round(value));
}

/** A media file's length (10.3): m:ss, or h:mm:ss from an hour. "" for a
 * length not known. Rounded, not floored: it is a length, not a position. */
export function formatDuration(ms: number): string {
  if (!Number.isFinite(ms) || ms <= 0) return "";
  const total = Math.round(ms / 1000);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = String(total % 60).padStart(2, "0");
  return hours > 0
    ? `${hours}:${String(minutes).padStart(2, "0")}:${seconds}`
    : `${minutes}:${seconds}`;
}

/**
 * A file name in two parts for a cut in the middle (design.md 6.7): the head
 * gives way with an ellipsis, the tail always shows. The tail is the
 * extension and the last `keep` characters before it, which is where similar
 * files differ ("Sunset_session_part2.mp4"). A name short enough is all tail.
 */
export function splitFileName(name: string, keep = 6): [string, string] {
  const ext = fileExtension(name);
  // an extension too long to be one is just more name
  const suffix = ext && ext.length <= 10 ? ext.length + 1 : 0;
  const cut = Math.max(0, name.length - suffix - keep);
  return [name.slice(0, cut), name.slice(cut)];
}

/** `.DS_Store`, `._clip.mp4`, `.git`: never content. */
export function isHiddenFile(name: string): boolean {
  return name.startsWith(".");
}

/**
 * The files of a drop, hidden files and folders left out. Synchronous on
 * purpose: call it inside the drop handler, because the transfer empties
 * the moment the handler returns.
 */
export function filesFromDrop(transfer: DataTransfer): File[] {
  const files = [...transfer.files];
  // items and files list the same entries in the same order; an item that
  // is a folder still appears in `files`, as a File that can't be read
  const folders = new Set<number>();
  for (let i = 0; i < transfer.items.length; i++) {
    const item = transfer.items[i];
    if (item?.kind === "file" && item.webkitGetAsEntry?.()?.isDirectory) {
      folders.add(i);
    }
  }
  return files.filter((f, i) => !folders.has(i) && !isHiddenFile(f.name));
}

/**
 * Open the system's file picker; resolves with what was chosen, or nothing
 * when it was cancelled. Call it straight from the click, before anything is
 * awaited, or the browser won't open it. `accept` is a hint the picker
 * offers ("video/*,.funscript"), not a check: look at what arrives.
 */
export function pickFiles(
  options: { accept?: string; multiple?: boolean } = {}
): Promise<File[]> {
  return new Promise(resolve => {
    const input = document.createElement("input");
    input.type = "file";
    if (options.accept) input.accept = options.accept;
    input.multiple = options.multiple ?? false;
    input.hidden = true;
    let settled = false;
    const done = (files: File[]) => {
      if (settled) return;
      settled = true;
      input.remove();
      resolve(files);
    };
    input.addEventListener("change", () => done([...(input.files ?? [])]));
    // fired by every current browser when the picker is dismissed
    input.addEventListener("cancel", () => done([]));
    document.body.appendChild(input);
    input.click();
  });
}

type FolderPicker = (options?: {
  id?: string;
  mode?: "read" | "readwrite";
  startIn?: string;
}) => Promise<FileSystemDirectoryHandle>;

/** lib.dom has the handle types but not the picker itself. Through
 * `unknown`, because a host may declare its own (scripter4 does), and a
 * direct cast between two declarations of it fails to compile. */
function folderPicker(): FolderPicker | undefined {
  if (typeof window === "undefined") return undefined;
  const picker = (window as unknown as { showDirectoryPicker?: FolderPicker })
    .showDirectoryPicker;
  return typeof picker === "function" ? picker.bind(window) : undefined;
}

/**
 * Can this browser hand out a folder to keep: Chrome and Edge on a computer.
 * Probes the picker itself, not the handle types, which Firefox and Safari
 * define without shipping any picker.
 */
export function canPickFolder(): boolean {
  return folderPicker() !== undefined;
}

/**
 * Open the system's folder picker. Resolves with the folder's handle, or
 * null when it was cancelled or the browser has no folder picker. Like
 * `pickFiles`, call it straight from the click. `id` lets the picker reopen
 * where this one was last used (letters, digits, - and _, up to 32).
 */
export async function pickFolder(
  options: { id?: string; mode?: "read" | "readwrite"; startIn?: string } = {}
): Promise<FileSystemDirectoryHandle | null> {
  const picker = folderPicker();
  if (!picker) return null;
  try {
    return await picker({ mode: "read", ...options });
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") return null;
    throw err;
  }
}

/** Is a drag carrying files from the computer (not text, a link, an image
 * from another page)? */
export function carriesFiles(event: DragEvent): boolean {
  return [...(event.dataTransfer?.types ?? [])].includes("Files");
}

/** How long without a dragover before a drag is taken as gone. Browsers fire
 * dragover at least every ~550 ms while a drag is over the page, so this only
 * catches one that ended without a leave (dropped on another window, Esc). */
const DRAG_STALE_MS = 1200;

export interface DragTracker {
  enter(): void;
  over(): void;
  leave(): void;
  reset(): void;
}

/**
 * Whether a drag is over an element, for `useFileDrop` and `HDropZone`.
 * Enter and leave fire for every element the pointer crosses, and enter
 * comes before the leave it replaces, so they are counted: the count stays
 * above zero while the drag is inside and reaches zero when it leaves. A drag
 * that ends without a leave expires. `onChange` hears only changes.
 */
export function trackDrag(
  onChange: (active: boolean) => void,
  staleMs = DRAG_STALE_MS
): DragTracker {
  let depth = 0;
  let active = false;
  let stale: ReturnType<typeof setTimeout> | undefined;

  const set = (next: boolean) => {
    if (next === active) return;
    active = next;
    onChange(next);
  };

  const reset = () => {
    depth = 0;
    clearTimeout(stale);
    stale = undefined;
    set(false);
  };

  const touch = () => {
    set(true);
    clearTimeout(stale);
    stale = setTimeout(reset, staleMs);
  };

  return {
    enter() {
      depth++;
      touch();
    },
    over: touch,
    leave() {
      depth = Math.max(0, depth - 1);
      if (depth === 0) reset();
    },
    reset
  };
}

/**
 * Keep a file dropped where nothing takes it from opening in the tab and
 * losing the page: the cursor says no, and the drop does nothing. Install it
 * once, in the layout or a boot file (an `HDropZone` also holds one while it
 * is mounted). Returns the uninstaller.
 *
 * Whatever takes a drag event marks it taken with `preventDefault()`, and the
 * guard, on the window and so the last to hear it, leaves a taken event
 * alone: a drop zone or a page's `useFileDrop` needs to stop nothing.
 */
export function installDropGuard(): () => void {
  const block = (event: DragEvent) => {
    if (!carriesFiles(event) || event.defaultPrevented) return;
    event.preventDefault();
    if (event.dataTransfer) event.dataTransfer.dropEffect = "none";
  };
  window.addEventListener("dragover", block);
  window.addEventListener("drop", block);
  return () => {
    window.removeEventListener("dragover", block);
    window.removeEventListener("drop", block);
  };
}
