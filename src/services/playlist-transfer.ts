// Playlist import/export: a versioned JSON envelope so playlists can move
// between browsers and devices. When the payload shape changes, bump
// PLAYLIST_EXPORT_VERSION and add a migration branch to parsePlaylistExport —
// files exported by older builds must keep importing forever.
import type { Playlist } from "@/stores/settings";

export const PLAYLIST_EXPORT_FORMAT = "handy-index-playlist";
export const PLAYLIST_EXPORT_VERSION = 1;

interface PlaylistExportV1 {
  format: typeof PLAYLIST_EXPORT_FORMAT;
  version: 1;
  exportedAt: string;
  playlist: {
    name: string;
    videoIds: string[];
  };
}

/**
 * Why an import failed, as a code rather than a sentence: `services/` is
 * framework-free by architectural rule, so it cannot reach vue-i18n and has no
 * business deciding what language the user reads. The playlists page maps
 * these to `playlists.import.error.<code>`.
 *
 * - `unreachable` — the paste host never answered the fetch
 * - `linkDead` — the paste host answered, but not with that paste
 * - `notJson` — the text isn't JSON at all
 * - `notExport` — valid JSON, but not one of our envelopes
 * - `tooNew` — a version this build has no migration for
 * - `malformed` — our envelope, with the playlist inside it broken
 */
export type PlaylistImportFailure =
  | "unreachable"
  | "linkDead"
  | "notJson"
  | "notExport"
  | "tooNew"
  | "malformed";

/** An import failure the UI can explain. `message` stays English and
 * diagnostic — it is for devtools and never reaches a screen; `code` is the
 * part callers are meant to read. */
export class PlaylistImportError extends Error {
  readonly code: PlaylistImportFailure;

  constructor(code: PlaylistImportFailure) {
    super(`Playlist import failed: ${code}`);
    this.name = "PlaylistImportError";
    this.code = code;
  }
}

export interface ImportedPlaylist {
  /** The exported name, trimmed — empty when the file carried none. The
   * caller supplies the fallback, because a default name is UI copy and this
   * layer has no locale to write it in. */
  name: string;
  videoIds: string[];
}

function buildExport(playlist: Playlist): PlaylistExportV1 {
  return {
    format: PLAYLIST_EXPORT_FORMAT,
    version: PLAYLIST_EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    playlist: {
      name: playlist.name,
      videoIds: [...playlist.videoIds]
    }
  };
}

/** The export as pretty JSON — the "share as text" form; parsePlaylistExport
 * accepts it back verbatim. */
export function playlistExportText(playlist: Playlist): string {
  return JSON.stringify(buildExport(playlist), null, 2);
}

/** Serializes a playlist and hands it to the browser as a .json download. */
export function exportPlaylist(playlist: Playlist): void {
  const blob = new Blob([playlistExportText(playlist)], {
    type: "application/json"
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${fileSlug(playlist.name)}.playlist.json`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

// Norwegian letters have to survive as letters, not as separators: stripping
// them turned "Øl og bål" into "l-og-b-l" and a name written entirely in them
// into nothing at all. NFD splits the accented Latin letters into base +
// combining mark so the mark can be dropped; æ/ø/å carry no mark and need the
// explicit map. The output stays ASCII on purpose — a filename that survives
// every filesystem is worth more than a faithful one.
const TRANSLITERATE: Record<string, string> = {
  æ: "ae",
  ø: "o",
  å: "a",
  ß: "ss",
  đ: "d",
  ð: "d",
  þ: "th",
  ł: "l"
};

function fileSlug(name: string): string {
  const slug = name
    .toLowerCase()
    .replace(/[æøåßđðþł]/g, char => TRANSLITERATE[char] ?? char)
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "playlist";
}

// --- temporary share links (pastes.dev — anonymous, kept ~90 days) ---

const PASTE_API = "https://api.pastes.dev";
const PASTE_VIEW = "https://pastes.dev";

/** Uploads the export text to pastes.dev; resolves to the shareable URL.
 * The host must stay in index.html's connect-src for this to work. */
export async function uploadPlaylistPaste(playlist: Playlist): Promise<string> {
  const response = await fetch(`${PASTE_API}/post`, {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: playlistExportText(playlist)
  });
  if (!response.ok) {
    throw new Error(`paste upload failed: ${response.status}`);
  }
  const data = (await response.json()) as { key?: string };
  if (!data.key) throw new Error("paste service returned no key");
  return `${PASTE_VIEW}/${data.key}`;
}

function matchPasteUrl(text: string): string | undefined {
  const match = /^https:\/\/(?:api\.)?pastes\.dev\/([A-Za-z0-9]+)$/.exec(text);
  return match?.[1];
}

/** Import from pasted text: accepts the export JSON itself or a pastes.dev
 * share link (whose raw content is fetched first). */
export async function resolveImportText(
  input: string
): Promise<ImportedPlaylist> {
  const text = input.trim();
  const pasteKey = matchPasteUrl(text);
  if (!pasteKey) return parsePlaylistExport(text);
  let fetched: Response;
  try {
    fetched = await fetch(`${PASTE_API}/${pasteKey}`);
  } catch {
    throw new PlaylistImportError("unreachable");
  }
  if (!fetched.ok) {
    throw new PlaylistImportError("linkDead");
  }
  return parsePlaylistExport(await fetched.text());
}

/** Validates an export file's text; throws PlaylistImportError with a reason
 * code on anything that isn't an importable playlist. */
export function parsePlaylistExport(text: string): ImportedPlaylist {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    throw new PlaylistImportError("notJson");
  }
  if (
    typeof raw !== "object" ||
    raw === null ||
    (raw as { format?: unknown }).format !== PLAYLIST_EXPORT_FORMAT
  ) {
    throw new PlaylistImportError("notExport");
  }
  const envelope = raw as { version?: unknown; playlist?: unknown };
  if (typeof envelope.version !== "number") {
    throw new PlaylistImportError("notExport");
  }
  if (envelope.version > PLAYLIST_EXPORT_VERSION) {
    throw new PlaylistImportError("tooNew");
  }
  // version 1 — the only shape so far; future versions migrate above
  const playlist = envelope.playlist as
    | { name?: unknown; videoIds?: unknown }
    | undefined;
  if (!Array.isArray(playlist?.videoIds)) {
    throw new PlaylistImportError("malformed");
  }
  const videoIds = playlist.videoIds.filter(
    (id): id is string => typeof id === "string" && id.length > 0
  );
  const name = typeof playlist.name === "string" ? playlist.name.trim() : "";
  return {
    name,
    videoIds: [...new Set(videoIds)]
  };
}
