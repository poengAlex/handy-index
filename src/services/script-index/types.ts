// Types for the handyfeeling.com Script Index API (v0), written against the
// live payload — the OpenAPI spec omits scripterName/scriptPlays on index
// items and models video rating as an object while the API returns a number.

export type VideoAccess =
  | "public"
  | "premium"
  | "private"
  | "unlisted"
  | "member";

/** public = a free script exists for the video */
export type ScriptAccessIndicator = "public" | "non-public";

export type ScriptAccess = "public" | "premium" | "private" | "member";

export interface VideoFormat {
  format?: "vr" | "flat" | "unknown";
  view?: "180" | "360" | "na";
}

export interface Performer {
  performerId: string;
  name: string;
  avatar?: string;
}

/** The request board's cast is NOT the index's. A request is scraped from the
 * source partner's page before anything is registered, so its performers
 * carry a name and a link to their profile on that site and nothing else —
 * every one of the 1,351 entries on the live board is missing performerId,
 * and only three carry an avatar. Name is the only identity there is, which
 * is what the board filters on (see byRequestPerformer). */
export interface RequestPerformer {
  name: string;
  /** the performer's page on the source site */
  url?: string;
  avatar?: string;
}

export interface PartnerVideo {
  partnerVideoId: string;
  partnerId: string;
  partnerName?: string;
  title?: string;
  description?: string;
  externalRef?: string;
  videoUrl?: string;
  /** seconds */
  duration?: number;
  format?: VideoFormat;
  tags?: string[];
  images?: string[];
  thumbnail?: string;
  /** short silent roll clip (mp4/webm) — on 7,041 of the live 15,572 videos,
   * and 5,749 of those are AV1, which not every browser decodes */
  preview?: string;
  videoAccess?: VideoAccess;
  scriptAccess?: ScriptAccessIndicator;
  views?: number;
  /** 0–100 */
  rating?: number;
  upVotes?: number;
  downVotes?: number;
  performers?: Performer[];
  scripterName?: string;
  /** Script analytics carried inline on every index entry since the API
   * started shipping them (all 16,493 videos; `segment_distances` on 98.8%).
   * Downsampled relative to `/videos/{id}/scripts` — see ScriptMetadata —
   * but it needs no request, which is what makes a catalog-wide speed filter
   * possible at all. */
  scriptMetadata?: ScriptMetadata;
  scriptPlays?: number;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}

export interface Scripter {
  scripterId: string;
  name?: string;
  description?: string;
}

/** Per-second travel distance for a script, run-length encoded: a NEGATIVE
 * entry is a run of that many idle seconds, a non-negative entry is one
 * second carrying that much movement. Decoded, the array is exactly
 * `ceil(endTime / 1000)` long and aligned to the video's own clock — see
 * `decodeSegments` in services/script-heat.ts.
 *
 * `non_zero_segment_count` does NOT describe the encoded array (it counts
 * neither entries nor decoded seconds); nothing here reads it. */
export interface SegmentDistances {
  distances?: number[];
  max_value?: number;
  min_value?: number;
  /** milliseconds per segment — 1000 on every script observed */
  resolution?: number;
  /** summed |change in position| over the whole script, 0-100 scale */
  total_distance?: number;
  non_zero_segment_count?: number;
}

/** Script analytics the API returns but the OpenAPI spec doesn't document.
 * Two shapes are live: an enriched one carrying `points` and
 * `segment_distances`, and an un-enriched one (everything published in the
 * last few weeks) carrying only `relativeDistance` /
 * `relativeActionSpeedSum`. Every field is optional because a caller must
 * handle both — `scriptHeat()` returns null rather than guess. */
export interface ScriptMetadata {
  bytes?: number;
  points?: number;
  /** direction changes in the script; one stroke is two of them */
  actions?: number;
  /** milliseconds from the video's start to the last action */
  endTime?: number;
  /** milliseconds to the first action; absent on ~35% of scripts */
  startTime?: number;
  relative_total_distance?: number;
  relative_total_speed?: number;
  relative_average_speed?: number;
  segment_distances?: SegmentDistances;
  /** un-enriched shape only — a span-based total, not comparable to
   * `relative_total_distance` */
  relativeDistance?: number;
  /** un-enriched shape only */
  relativeActionSpeedSum?: number;
}

export interface Script {
  scriptId: string;
  scripter?: Scripter;
  tags?: string[];
  /** 0–100 */
  rating?: number;
  metadata?: ScriptMetadata;
  access?: ScriptAccess;
  plays?: number;
  publishedAt?: string;
  updatedAt?: string;
}

export interface TokenUrl {
  url: string;
}

/** Comments are anonymous — the API attaches no author to them. */
export interface ScriptComment {
  commentId: string;
  message?: string;
  /** seconds into the video the comment refers to */
  timestampStart?: number;
  timestampEnd?: number;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type VideoRequestStatus =
  | "pending.verification"
  | "pending.metadata"
  | "registered"
  | "accepted"
  | "pending.download"
  | "downloaded"
  | "rejected"
  | "published";

export interface VideoRequest {
  requestId: string;
  /** the spec names this videoUrl, but the live API returns url */
  url?: string;
  domain?: string;
  status?: VideoRequestStatus;
  votes?: number;
  partnerId?: string;
  partnerName?: string;
  title?: string;
  description?: string;
  /** seconds */
  duration?: number;
  tags?: string[];
  images?: string[];
  thumbnail?: string;
  performers?: RequestPerformer[];
  createdAt?: string;
  updatedAt?: string;
}
