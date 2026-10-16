// The AI scripts Handy's auto-scripter makes for videos on the request board
// (and for popular videos between them), matched to the requests they are
// for. The list is public and read-only; our own server keeps a synced copy
// (server/ai-scripts.js), and the auto-scripter's list is the fallback
// whenever that is unavailable — the dev server, the first seconds after a
// deploy. Its host must stay in index.html's connect-src for that, and for
// the download.
//
// Everything in an entry is third-party data: only an https address on the
// auto-scripter's own host is ever linked or fetched.
import { saveBlob } from "@/services/script-download";

const LIVE = "https://playground.handyfeeling.com/classifier/api/live";
const LIVE_HOST = "playground.handyfeeling.com";
const PAGE = 5000;
/** backstop against a cursor that never advances */
const MAX_PAGES = 20;

export interface AiScript {
  /** "<site>-<video id>", "xhamster-xhSMp1A" */
  id: string;
  /** the request it was made for; null for a popular video scripted
   * between requests */
  requestId: string | null;
  actions: number | null;
  /** ISO time it was made, or last replaced by a newer script */
  updated: string;
  download: string;
}

/** Why a download failed, as a code — the calling surface owns the words.
 * `gone` is a 404: the script was taken down since the list was synced. */
export type AiScriptFailure = "gone" | "failed";

export class AiScriptDownloadError extends Error {
  readonly code: AiScriptFailure;

  constructor(code: AiScriptFailure, detail?: string) {
    super(
      detail
        ? `AI script download failed: ${code} (${detail})`
        : `AI script download failed: ${code}`
    );
    this.name = "AiScriptDownloadError";
    this.code = code;
  }
}

export function aiScriptFailure(error: unknown): AiScriptFailure {
  return error instanceof AiScriptDownloadError ? error.code : "failed";
}

function str(value: unknown): string | null {
  return typeof value === "string" && value ? value : null;
}

/** The download address, if it is one we'll hand the browser. */
function safeDownload(value: unknown): string | null {
  const raw = str(value);
  if (!raw) return null;
  try {
    const url = new URL(raw);
    return url.protocol === "https:" && url.hostname === LIVE_HOST
      ? url.href
      : null;
  } catch {
    return null;
  }
}

/** One entry of either list (ours or the auto-scripter's — same fields), or
 * null for one that can't be offered. */
function parseEntry(entry: unknown): AiScript | null {
  if (!entry || typeof entry !== "object") return null;
  const raw = entry as Record<string, unknown>;
  const id = str(raw.id);
  const updated = str(raw.updated);
  const download = safeDownload(raw.download);
  if (!id || !updated || !download) return null;
  return {
    id,
    requestId: str(raw.request_id),
    actions: typeof raw.actions === "number" ? raw.actions : null,
    updated,
    download
  };
}

function parseList(body: unknown): AiScript[] | null {
  const list = (body as { scripts?: unknown } | null)?.scripts;
  if (!Array.isArray(list)) return null;
  return list.map(parseEntry).filter(entry => entry !== null);
}

/** Every live AI script. Our server's copy first; the auto-scripter's list,
 * page by page, when that is unavailable. Throws when neither answers. */
export async function getAiScripts(): Promise<AiScript[]> {
  try {
    const own = await fetch("api/ai-scripts");
    // a dev server answers any unknown path with index.html and a 200
    if (own.ok && own.headers.get("content-type")?.includes("json")) {
      const list = parseList(await own.json());
      if (list) return list;
    }
  } catch {
    // offline or blocked — the request below reports which
  }

  const all: AiScript[] = [];
  let since: string | null = null;
  for (let page = 0; page < MAX_PAGES; page += 1) {
    const url = new URL(LIVE);
    url.searchParams.set("limit", String(PAGE));
    if (since) url.searchParams.set("since", since);
    const response = await fetch(url);
    if (!response.ok)
      throw new Error(`AI script list: HTTP ${response.status}`);
    const body = (await response.json()) as { next?: unknown };
    const list = parseList(body);
    if (!list) throw new Error("AI script list: no scripts array");
    all.push(...list);
    since = str(body.next);
    if (!since) break;
  }
  return all;
}

/** A video's AI-script id from its page URL, or null — the auto-scripter's
 * own rule (liveIdFromUrl in classifier-api), so this matches exactly what
 * its `?url=` would. xhamster pages end in "-xh<token>" (newer) or
 * "-<number>" (older), on any of its mirror domains. */
export function aiScriptIdFromUrl(raw: string | undefined): string | null {
  if (!raw) return null;
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }
  const host = url.hostname.toLowerCase().replace(/^www\./, "");
  if (/^xhamster\d*\.[a-z]+$/.test(host) || host === "xhamster.desi") {
    const match = /-(xh[A-Za-z0-9]+|\d{5,})\/?$/.exec(url.pathname);
    return match ? `xhamster-${match[1]}` : null;
  }
  return null;
}

export interface AiScriptIndex {
  byRequest: Map<string, AiScript>;
  byVideo: Map<string, AiScript>;
}

function newer(a: AiScript | undefined, b: AiScript): AiScript {
  return a && a.updated >= b.updated ? a : b;
}

export function indexAiScripts(scripts: readonly AiScript[]): AiScriptIndex {
  const byRequest = new Map<string, AiScript>();
  const byVideo = new Map<string, AiScript>();
  for (const script of scripts) {
    if (script.requestId) {
      byRequest.set(
        script.requestId,
        newer(byRequest.get(script.requestId), script)
      );
    }
    byVideo.set(script.id, newer(byVideo.get(script.id), script));
  }
  return { byRequest, byVideo };
}

/** The AI script for a request: the one made for it, else one made for the
 * same video — a popular video's script, or one made for an earlier request
 * of it. */
export function aiScriptFor(
  index: AiScriptIndex,
  request: { requestId: string; url?: string | undefined }
): AiScript | undefined {
  const made = index.byRequest.get(request.requestId);
  if (made) return made;
  const id = aiScriptIdFromUrl(request.url);
  return id ? index.byVideo.get(id) : undefined;
}

/** The server's filename from a Content-Disposition header: the UTF-8
 * `filename*` (named after the video) over the plain ASCII one. */
function dispositionName(header: string | null): string | null {
  if (!header) return null;
  let name: string | null = null;
  const extended = /filename\*=UTF-8''([^;]+)/i.exec(header);
  if (extended?.[1]) {
    try {
      name = decodeURIComponent(extended[1]);
    } catch {
      name = null;
    }
  }
  name ??= /filename="([^"]+)"/i.exec(header)?.[1] ?? null;
  // third-party text on its way into a save dialog: no paths, no control
  // characters, and it stays a funscript
  const clean = name
    ?.replace(/[/\\]/g, " ")
    .replace(/\p{Cc}/gu, "")
    .trim();
  return clean && /\.funscript$/i.test(clean) ? clean : null;
}

/** Fetches the script and saves it under the server's name for it. Throws an
 * `AiScriptDownloadError`: `gone` for a 404, `failed` for anything else. */
export async function downloadAiScript(script: AiScript): Promise<void> {
  const response = await fetch(script.download).catch((error: unknown) => {
    throw new AiScriptDownloadError("failed", String(error));
  });
  if (response.status === 404) throw new AiScriptDownloadError("gone");
  if (!response.ok) {
    throw new AiScriptDownloadError("failed", `HTTP ${response.status}`);
  }
  const blob = await response.blob();
  saveBlob(
    blob,
    dispositionName(response.headers.get("content-disposition")) ??
      `${script.id}.funscript`
  );
}
