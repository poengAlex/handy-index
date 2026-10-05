// Minimal typed client for the Script Index API. Only the endpoints the app
// actually uses — the index snapshot, single-video lookups, the orientation
// tags, the script token flow and the video-request board. List queries
// (/videos, /tags as a listing, …) are deliberately absent: the API cannot
// sort, so every listing derives from the index via queries.ts.
import {
  dropCachedIndex,
  readCachedIndex,
  writeCachedIndex
} from "./index-cache";
import type {
  PartnerVideo,
  Script,
  ScriptComment,
  Tag,
  TokenUrl,
  VideoRequest
} from "./types";

const BASE_URL = "https://scripts01.handyfeeling.com/api/script/index/v0";

/** Non-2xx API answer; carries the HTTP status so pages can tell an
 * auth rejection (401/403) apart from a server failure. */
export class ScriptIndexError extends Error {
  readonly status: number;

  constructor(status: number, path: string) {
    super(`Script index request failed: ${status} ${path}`);
    this.name = "ScriptIndexError";
    this.status = status;
  }
}

export function isAuthError(error: unknown): boolean {
  return (
    error instanceof ScriptIndexError &&
    (error.status === 401 || error.status === 403)
  );
}

interface RequestOptions {
  method?: "GET" | "POST" | "PUT";
  body?: unknown;
  /** Handy connection key, sent as Bearer auth */
  connectionKey?: string;
}

async function request<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const headers: Record<string, string> = {};
  if (options.connectionKey) {
    headers.Authorization = `Bearer ${options.connectionKey}`;
  }
  const init: RequestInit = { method: options.method ?? "GET", headers };
  if (options.body !== undefined) {
    headers["Content-Type"] = "application/json";
    init.body = JSON.stringify(options.body);
  }
  const response = await fetch(`${BASE_URL}${path}`, init);
  if (!response.ok) {
    throw new ScriptIndexError(response.status, path);
  }
  // vote/create endpoints may answer with an empty body
  const text = await response.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

/** How far the index fetch has got. The endpoint answers chunked + gzipped
 * and exposes no Content-Length to CORS, so there is no total to divide by —
 * only decoded bytes so far, plus the moment the (blocking) parse starts. */
export interface IndexProgress {
  /** decoded JSON bytes read from the stream so far */
  received: number;
  /** the decoded total, when the server says (only our own one does) */
  expected?: number | undefined;
  /** true once every byte is in and JSON.parse is about to run */
  parsing: boolean;
}

/** A snapshot plus how old the copy is: 0 straight off the network, or the
 * age of the disk copy when it came from the cache. */
export interface IndexSnapshot {
  videos: PartnerVideo[];
  age: number;
}

/** The snapshot kept on disk by an earlier load, or null if there is none
 * younger than `maxAge`. `onParsing` fires the moment before the (blocking)
 * JSON.parse, same as the download path's parse tick. */
export async function getCachedIndex(
  maxAge: number,
  onParsing?: () => void
): Promise<IndexSnapshot | null> {
  const hit = await readCachedIndex(maxAge);
  if (!hit) return null;

  onParsing?.();
  await nextPaint();
  try {
    return { videos: JSON.parse(hit.text) as PartnerVideo[], age: hit.age };
  } catch {
    // a truncated write survives as unparseable text — bin it and download
    void dropCachedIndex();
    return null;
  }
}

/** Where the snapshot comes from, best first. Our own server's slimmed copy
 * (server/catalog.js) is about a quarter of the download, half the memory,
 * and answers at once instead of after the API's ~4.5 s. The API itself is
 * the fallback whenever that is unavailable: the dev server, the first
 * seconds after a deploy, or a host without the endpoint. */
async function fetchSnapshot(): Promise<Response> {
  try {
    const slim = await fetch("api/catalog");
    // a dev server answers any unknown path with index.html and a 200
    if (slim.ok && slim.headers.get("content-type")?.includes("json")) {
      return slim;
    }
  } catch {
    // offline or blocked — the API request below reports which
  }
  const response = await fetch(`${BASE_URL}/index`);
  if (!response.ok) throw new ScriptIndexError(response.status, "/index");
  return response;
}

/** The full catalog snapshot (~17k videos — fetch once). Pass `onProgress`
 * to read the body as a stream and get byte counts as they land; without it
 * this is a plain one-shot request. Either way the result is written to the
 * disk cache, so the next tab does not repeat the download. */
export async function getIndex(
  onProgress?: (progress: IndexProgress) => void
): Promise<PartnerVideo[]> {
  const response = await fetchSnapshot();
  // no streams (old browser, or a body-less mock) — fall back to one shot
  if (!response.body || !onProgress) {
    const text = await response.text();
    void writeCachedIndex(text);
    return JSON.parse(text) as PartnerVideo[];
  }

  const expected =
    Number(response.headers.get("x-decoded-length")) || undefined;
  // One branch streams straight to the disk cache, the other is counted for
  // the bar and decoded once. Holding the decoded chunks, then their join,
  // then a copy for the cache write kept three copies of the biggest thing
  // the app ever holds alive at once — the peak that gets a phone's tab
  // killed. Written as it arrives, not after the parse: the parse is the one
  // step that can still fail, and a snapshot that reached us intact is worth
  // keeping either way.
  const [toDisk, toParse] = response.body.tee();
  void writeCachedIndex(toDisk);
  let received = 0;
  const counted = toParse.pipeThrough(
    new TransformStream<Uint8Array, Uint8Array>({
      transform(chunk, controller) {
        received += chunk.byteLength;
        onProgress({ received, expected, parsing: false });
        controller.enqueue(chunk);
      }
    })
  );
  const text = await new Response(counted).text();

  onProgress({ received, expected, parsing: true });
  // JSON.parse on this much freezes the main thread for a beat, and a frame
  // that only renders after the freeze never says "parsing" — yield past one
  // paint so the message the user waits on is the one on screen
  await nextPaint();
  return JSON.parse(text) as PartnerVideo[];
}

/** What the slimmed snapshot leaves out of one video — its description and
 * the script measurements the video page draws — from the server that
 * slimmed it. Only ever asked about entries that came from there (they carry
 * `spm`); the API's own entries are complete. */
export async function getVideoExtras(
  partnerVideoId: string
): Promise<Pick<PartnerVideo, "description" | "scriptMetadata">> {
  const path = `api/catalog/${encodeURIComponent(partnerVideoId)}`;
  const response = await fetch(path);
  if (!response.ok) throw new ScriptIndexError(response.status, path);
  return (await response.json()) as Pick<
    PartnerVideo,
    "description" | "scriptMetadata"
  >;
}

/** Resolves after the next frame has been painted; off-DOM (tests) it is just
 * a macrotask. */
function nextPaint(): Promise<void> {
  return new Promise(resolve => {
    if (typeof requestAnimationFrame !== "function") {
      setTimeout(resolve, 0);
      return;
    }
    // the timeout lands after the frame rAF is queued in — rAF alone still
    // runs before the paint it precedes
    requestAnimationFrame(() => setTimeout(resolve, 0));
  });
}

/** `/tags` pages by take/skip like the request board. One page this size
 * holds the whole live list (30,412 tags, ~310 kB gzipped); the backstop only
 * stops a runaway loop. */
const TAG_PAGE_SIZE = 50_000;
const MAX_TAGS = 500_000;

/** The tags `/tags` files under the "orientation" category. It cannot filter
 * by category itself (a `category` parameter is ignored), so the whole list
 * comes down and is filtered here. */
export async function getOrientationTags(): Promise<string[]> {
  const found: string[] = [];
  for (let skip = 0; skip < MAX_TAGS; skip += TAG_PAGE_SIZE) {
    const page = await request<Tag[]>(
      `/tags?take=${TAG_PAGE_SIZE}&skip=${skip}`
    );
    for (const tag of page) {
      if (tag.category === "orientation") found.push(tag.tagId);
    }
    if (page.length < TAG_PAGE_SIZE) break;
  }
  return found;
}

export function getVideo(partnerVideoId: string): Promise<PartnerVideo> {
  return request<PartnerVideo>(`/videos/${encodeURIComponent(partnerVideoId)}`);
}

export function getVideoScripts(partnerVideoId: string): Promise<Script[]> {
  return request<Script[]>(
    `/videos/${encodeURIComponent(partnerVideoId)}/scripts`
  );
}

/** Handy-bound download URL for a script; needs the user's connection key. */
export function getScriptTokenUrl(
  partnerVideoId: string,
  scriptId: string,
  connectionKey: string
): Promise<TokenUrl> {
  const id = encodeURIComponent(partnerVideoId);
  const script = encodeURIComponent(scriptId);
  return request<TokenUrl>(`/videos/${id}/scripts/${script}/token`, {
    connectionKey
  });
}

/** Rate a script 0–100; the API keeps no per-user record, so remembering
 * "you voted" is the caller's job (settings.scriptVotes). */
export function rateScript(
  partnerVideoId: string,
  scriptId: string,
  value: number,
  connectionKey: string
): Promise<void> {
  const id = encodeURIComponent(partnerVideoId);
  const script = encodeURIComponent(scriptId);
  return request<void>(`/videos/${id}/scripts/${script}/rating`, {
    method: "POST",
    body: { value },
    connectionKey
  });
}

// Script comments — anonymous, and auth-gated even for reading.

export function getPublishedComments(
  partnerVideoId: string,
  scriptId: string,
  connectionKey: string
): Promise<ScriptComment[]> {
  const id = encodeURIComponent(partnerVideoId);
  const script = encodeURIComponent(scriptId);
  return request<ScriptComment[]>(
    `/videos/${id}/scripts/${script}/comments/published?take=50&skip=0`,
    { connectionKey }
  );
}

export function postScriptComment(
  partnerVideoId: string,
  scriptId: string,
  message: string,
  connectionKey: string
): Promise<ScriptComment> {
  const id = encodeURIComponent(partnerVideoId);
  const script = encodeURIComponent(scriptId);
  return request<ScriptComment>(`/videos/${id}/scripts/${script}/comments`, {
    method: "POST",
    body: { message },
    connectionKey
  });
}

// Video requests — the whole board is auth-gated by connection key.

/** Requests that passed verification and can receive votes. */
export function getVotableRequests(
  connectionKey: string,
  take: number,
  skip: number
): Promise<VideoRequest[]> {
  return request<VideoRequest[]>(`/requests/voting?take=${take}&skip=${skip}`, {
    connectionKey
  });
}

export function createVideoRequest(
  url: string,
  connectionKey: string
): Promise<VideoRequest> {
  return request<VideoRequest>("/requests", {
    method: "POST",
    body: { url },
    connectionKey
  });
}

export function voteForRequest(
  requestId: string,
  connectionKey: string
): Promise<void> {
  return request<void>(`/requests/${encodeURIComponent(requestId)}/vote`, {
    method: "PUT",
    connectionKey
  });
}
