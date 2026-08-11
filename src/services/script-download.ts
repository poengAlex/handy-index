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
  getVideoScripts
} from "@/services/script-index/client";
import type { PartnerVideo } from "@/services/script-index/types";

/** Downloads the free script for a video and saves it under a name derived
 * from the video title. Throws when no free script is listed or a request
 * fails — resolves only once the file has been handed to the browser. */
export async function downloadFreeScript(
  video: Pick<PartnerVideo, "partnerVideoId" | "title">,
  connectionKey: string
): Promise<void> {
  const scripts = await getVideoScripts(video.partnerVideoId);
  const script = scripts.find(item => item.access === "public");
  if (!script) throw new Error("no free script listed");
  const token = await getScriptTokenUrl(
    video.partnerVideoId,
    script.scriptId,
    connectionKey
  );
  const response = await fetch(token.url);
  if (!response.ok) throw new Error(`script fetch failed: ${response.status}`);
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

function funscriptName(
  video: Pick<PartnerVideo, "partnerVideoId" | "title">
): string {
  const slug = (video.title ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${slug || video.partnerVideoId}.funscript`;
}
