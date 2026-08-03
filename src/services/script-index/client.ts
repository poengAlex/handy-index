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

/** The full catalog snapshot (~15k videos, tens of MB — fetch once). */
export function getIndex(): Promise<PartnerVideo[]> {
  return request<PartnerVideo[]>("/index");
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
