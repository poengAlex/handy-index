// Starting script downloads from anywhere that isn't the video detail page
// (quick menu, playlist bulk download) — shared so the free-script lookup and
// the download mechanics stay identical.
//
// The file is fetched as a blob and saved through an object-URL anchor: the
// CSP only allows scripts01.handyfeeling.com via connect-src (frames are
// locked to 'self'), and a same-origin blob also lets the `download`
// filename stick, which cross-origin navigation would ignore.
import {
  getScriptTokenUrl,
  getVideoScripts,
  isAuthError
} from "@/services/script-index/client";
import type {
  PartnerVideo,
  Script,
  TokenUrl
} from "@/services/script-index/types";

/**
 * Why a download failed, as a code rather than a sentence: `services/` is
 * framework-free by architectural rule, so it cannot reach vue-i18n and has
 * no business deciding what language the user reads. The calling surface maps
 * these to `services.scriptDownload.<code>`.
 *
 * - `noFreeScript` — nothing public to fetch; the index metadata was stale
 * - `unauthorized` — the API rejected the connection key (401/403)
 * - `failed` — anything else: the server didn't answer, or the file didn't
 */
export type ScriptDownloadFailure = "noFreeScript" | "unauthorized" | "failed";

/** A download failure the UI can explain. `message` stays English and
 * diagnostic — it is for devtools and never reaches a screen; `code` is the
 * part callers are meant to read. */
export class ScriptDownloadError extends Error {
  readonly code: ScriptDownloadFailure;

  constructor(code: ScriptDownloadFailure, detail?: string) {
    super(
      detail
        ? `Script download failed: ${code} (${detail})`
        : `Script download failed: ${code}`
    );
    this.name = "ScriptDownloadError";
    this.code = code;
  }
}

/** The failure code behind anything thrown out of `downloadFreeScript`. A
 * throw from somewhere else entirely (the network dropping mid-blob) falls
 * back to the generic failure, so a caller can go straight from `catch` to a
 * message key without a type test of its own. */
export function scriptDownloadCode(error: unknown): ScriptDownloadFailure {
  return error instanceof ScriptDownloadError ? error.code : "failed";
}

/** Downloads the free script for a video and saves it under a name derived
 * from the video title. Throws a `ScriptDownloadError` when no free script is
 * listed or a request fails — resolves only once the file has been handed to
 * the browser. */
export async function downloadFreeScript(
  video: Pick<PartnerVideo, "partnerVideoId" | "title">,
  connectionKey: string
): Promise<void> {
  let scripts: Script[];
  try {
    scripts = await getVideoScripts(video.partnerVideoId);
  } catch (error) {
    throw new ScriptDownloadError("failed", String(error));
  }

  const script = scripts.find(item => item.access === "public");
  // the menu item is hidden unless the index says there is a free script, so
  // reaching this means the index disagreed with the API — worth saying out
  // loud rather than blaming the user's connection key for it
  if (!script) throw new ScriptDownloadError("noFreeScript");

  let token: TokenUrl;
  try {
    token = await getScriptTokenUrl(
      video.partnerVideoId,
      script.scriptId,
      connectionKey
    );
  } catch (error) {
    // the token endpoint is the only authenticated hop, so a 401/403 here is
    // the one failure the user can actually act on
    throw new ScriptDownloadError(
      isAuthError(error) ? "unauthorized" : "failed",
      String(error)
    );
  }

  const response = await fetch(token.url).catch(error => {
    throw new ScriptDownloadError("failed", String(error));
  });
  if (!response.ok) {
    throw new ScriptDownloadError("failed", `HTTP ${response.status}`);
  }
  const blob = await response.blob();
  saveBlob(blob, urlFilename(token.url) ?? funscriptName(video));
}

function saveBlob(blob: Blob, filename: string): void {
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  // deferred — revoking synchronously can race the download in some browsers
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 10_000);
}

/** The server's own filename when the token URL path carries one. */
function urlFilename(url: string): string | undefined {
  try {
    const segment = new URL(url).pathname.split("/").filter(Boolean).pop();
    const name = decodeURIComponent(segment ?? "");
    return /\.[a-z0-9]{2,10}$/i.test(name) ? name : undefined;
  } catch {
    return undefined;
  }
}

// The saved filename is a slug of the video's own title — catalog data, not
// UI copy, so it stays as the partner wrote it in every language.
function funscriptName(
  video: Pick<PartnerVideo, "partnerVideoId" | "title">
): string {
  const slug = (video.title ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${slug || video.partnerVideoId}.funscript`;
}
