// Minimal typed client for the Script Index API. Only the endpoints the app
// actually uses — the index snapshot, single-video lookups, the script token
// flow and the video-request board. List queries (/videos, /tags, …) are
// deliberately absent: the API cannot sort, so every listing derives from
// the index via queries.ts.
import type {
  PartnerVideo,
  Script,
  ScriptComment,
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
  /** true once every byte is in and JSON.parse is about to run */
  parsing: boolean;
}

/** The full catalog snapshot (~15k videos, ~40 MB of JSON — fetch once).
 * Pass `onProgress` to read the body as a stream and get byte counts as they
 * land; without it this is a plain one-shot request. */
export async function getIndex(
  onProgress?: (progress: IndexProgress) => void
): Promise<PartnerVideo[]> {
  if (!onProgress) return request<PartnerVideo[]>("/index");

  const response = await fetch(`${BASE_URL}/index`);
  if (!response.ok) throw new ScriptIndexError(response.status, "/index");
  // no streams (old browser, or a body-less mock) — fall back to one shot
  if (!response.body) return (await response.json()) as PartnerVideo[];

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  // chunks joined once at the end: 40 MB of `+=` is the one thing that would
  // cost more than the download itself
  const chunks: string[] = [];
  let received = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    received += value.byteLength;
    chunks.push(decoder.decode(value, { stream: true }));
    onProgress({ received, parsing: false });
  }
  chunks.push(decoder.decode());

  onProgress({ received, parsing: true });
  // JSON.parse on 40 MB freezes the main thread for a beat, and a frame that
  // only renders after the freeze never says "parsing" — yield past one paint
  // so the message the user waits on is the one on screen
  await nextPaint();
  return JSON.parse(chunks.join("")) as PartnerVideo[];
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
