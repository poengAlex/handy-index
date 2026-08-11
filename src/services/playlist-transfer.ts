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

/** Import failure whose message is written for the user (toast body). */
export class PlaylistImportError extends Error {}

export interface ImportedPlaylist {
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

function fileSlug(name: string): string {
  const slug = name
    .toLowerCase()
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
    throw new PlaylistImportError("Couldn't reach the paste service.");
  }
  if (!fetched.ok) {
    throw new PlaylistImportError(
      "That share link doesn't answer — it may have expired."
    );
  }
  return parsePlaylistExport(await fetched.text());
}

/** Validates an export file's text; throws PlaylistImportError with a
 * user-facing message on anything that isn't an importable playlist. */
export function parsePlaylistExport(text: string): ImportedPlaylist {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    throw new PlaylistImportError("That file isn't valid JSON.");
  }
  if (
    typeof raw !== "object" ||
    raw === null ||
    (raw as { format?: unknown }).format !== PLAYLIST_EXPORT_FORMAT
  ) {
    throw new PlaylistImportError("That file isn't a playlist export.");
  }
  const envelope = raw as { version?: unknown; playlist?: unknown };
  if (typeof envelope.version !== "number") {
    throw new PlaylistImportError("That file isn't a playlist export.");
  }
  if (envelope.version > PLAYLIST_EXPORT_VERSION) {
    throw new PlaylistImportError(
      "That file was exported by a newer version of this site. Reload the page and try again."
    );
  }
  // version 1 — the only shape so far; future versions migrate above
  const playlist = envelope.playlist as
    | { name?: unknown; videoIds?: unknown }
    | undefined;
  if (!Array.isArray(playlist?.videoIds)) {
    throw new PlaylistImportError("The playlist in that file is malformed.");
  }
  const videoIds = playlist.videoIds.filter(
    (id): id is string => typeof id === "string" && id.length > 0
  );
  const name = typeof playlist.name === "string" ? playlist.name.trim() : "";
  return {
    name: name || "Imported playlist",
    videoIds: [...new Set(videoIds)]
  };
}
