// Pure selectors over the in-memory catalog. Every listing in the app (rows,
// filters, search) is a composition of these — components never sort or
// filter PartnerVideo[] themselves.
import { scriptHeat } from "../script-heat";
import type { PartnerVideo } from "./types";

export type Orientation = "straight" | "gay" | "trans" | "all";

export const ORIENTATIONS: Orientation[] = ["straight", "gay", "trans", "all"];

// The display names that used to live here moved to `common.orientation.*`
// (read through `useFormat().orientation`) when the app gained a second
// language — this layer is framework-free *and* language-free.

export const ORIENTATION_ICONS: Record<Orientation, string> = {
  straight: "woman",
  gay: "man",
  trans: "transgender",
  all: "all_inclusive"
};

/** The tags `/tags` files under the "orientation" category, as of October
 * 2026 (5 of its 30,412). The gate goes by these until the live list arrives
 * — and keeps going by them if it never does, since an empty list would file
 * every video under Straight. */
export const ORIENTATION_TAGS_SEED: readonly string[] = [
  "bisexual",
  "gay",
  "shemale",
  "straight",
  "trans"
];

/** Which filter an orientation tag files a video under. Two are our own
 * filters' names, and shemale goes on exactly the videos trans does (1,133 of
 * 16,762, never one without the other). The rest file a video nowhere:
 * Straight is whatever carries neither gay nor trans — the straight tag
 * itself is on only 469 videos — and bisexual is on 56 that are otherwise
 * M/F or lesbian, which is where Straight already put them. */
const FILED_UNDER: ReadonlyMap<string, "gay" | "trans"> = new Map([
  ["gay", "gay"],
  ["trans", "trans"],
  ["shemale", "trans"]
]);

/** Orientation goes by the index's own orientation tags (`orientationTags`,
 * the live `/tags` list or the seed above) and nothing else. Looking for the
 * words inside other tags kept misfiling: a prefix test put translated and
 * transformation under Trans, and a substring test put trans videos tagged
 * "black gays" or "gay trans" under Gay as well. */
export function matchesOrientation(
  video: PartnerVideo,
  orientation: Orientation,
  orientationTags: ReadonlySet<string>
): boolean {
  if (orientation === "all") return true;
  const filed = filedUnder(video, orientationTags);
  if (orientation === "gay") return (filed & FILED_GAY) !== 0;
  if (orientation === "trans") return (filed & FILED_TRANS) !== 0;
  return filed === 0;
}

const FILED_GAY = 1;
const FILED_TRANS = 2;

/** Which orientations a video is filed under, as FILED_* bits — remembered
 * per video for one orientation-tag list. Every page load walks the whole
 * catalog's tags twice (the visible list and the header's gate counts) and
 * every orientation or access change twice again; the answer only changes
 * with the snapshot (new video objects) or the tag list (a new Set). */
let filedMemo = {
  tags: undefined as ReadonlySet<string> | undefined,
  byVideo: new WeakMap<PartnerVideo, number>()
};

function filedUnder(
  video: PartnerVideo,
  orientationTags: ReadonlySet<string>
): number {
  if (filedMemo.tags !== orientationTags) {
    filedMemo = { tags: orientationTags, byVideo: new WeakMap() };
  }
  let filed = filedMemo.byVideo.get(video);
  if (filed === undefined) {
    filed = 0;
    for (const tag of video.tags ?? []) {
      if (!orientationTags.has(tag)) continue;
      const under = FILED_UNDER.get(tag);
      if (under === "gay") filed |= FILED_GAY;
      else if (under === "trans") filed |= FILED_TRANS;
    }
    filedMemo.byVideo.set(video, filed);
  }
  return filed;
}

/** Orientation is derived from tags (see matchesOrientation), so muting one
 * of these would fight the orientation gate and collapse the catalog toward
 * empty. Never offered in the mute picker, refused by the store action. */
export const UNMUTABLE_TAGS: ReadonlySet<string> = new Set([
  "straight",
  "gay",
  "trans"
]);

/** The index carries TWO independent paywalls and they cross freely — of
 * 15,572 videos, 2,939 are premium videos with a free script and 2,684 are
 * premium on both — so scripts and videos get one switch each, never a
 * shared one.
 *
 * Both access fields are optional in the index, and an absent value is not a
 * promise of free access, so anything but "public" counts as behind the
 * paywall. */
function hasFreeScript(video: PartnerVideo): boolean {
  return video.scriptAccess === "public";
}

function hasFreeVideo(video: PartnerVideo): boolean {
  return video.videoAccess === "public";
}

export interface CatalogFilter {
  orientation: Orientation;
  /** the index's orientation tags — see matchesOrientation */
  orientationTags: ReadonlySet<string>;
  /** include videos whose script is behind a partner's paywall */
  premiumScripts: boolean;
  /** include videos behind the partner's own paywall — a different question:
   * this is a script database, so it matters less here */
  paidVideos: boolean;
  /** tags the user muted. A Set, built once by the caller — passing an array
   * would make the 15k pass O(videos × tags × muted) string compares. */
  mutedTags: ReadonlySet<string>;
}

/** True when the video carries at least one muted tag. Exported for the
 * deliberately ungated surfaces that filter (or mark) on their own. */
export function hasMutedTag(
  video: PartnerVideo,
  muted: ReadonlySet<string>
): boolean {
  if (!muted.size) return false;
  const tags = video.tags;
  if (!tags) return false;
  for (const tag of tags) {
    if (muted.has(tag)) return true;
  }
  return false;
}

/** Baseline gate applied before any row query: orientation + the two paywall
 * switches + mutes. Matching is exact — a substring rule would make "teen"
 * mute "eighteen". */
export function visibleVideos(
  videos: readonly PartnerVideo[],
  filter: CatalogFilter
): PartnerVideo[] {
  const base = (video: PartnerVideo) =>
    matchesOrientation(video, filter.orientation, filter.orientationTags) &&
    (filter.premiumScripts || hasFreeScript(video)) &&
    (filter.paidVideos || hasFreeVideo(video));
  // nothing muted (the common case) skips the per-video tag loop entirely
  if (!filter.mutedTags.size) return videos.filter(base);
  return videos.filter(
    video => base(video) && !hasMutedTag(video, filter.mutedTags)
  );
}

export interface GateBreakdown {
  /** everything in the index */
  total: number;
  /** what visibleVideos returns for the same filter */
  visible: number;
  hidden: number;
  byOrientation: number;
  byScript: number;
  byVideo: number;
  byMutedTags: number;
}

/** Why visibleVideos dropped what it dropped — the numbers behind a "9,284
 * videos hidden" disclosure. Attribution is first-reason-wins in the same
 * order the gate applies, so a video that is both off-orientation and muted
 * is counted once and the reasons sum exactly to `hidden` (independent
 * per-gate counts would overlap and overstate the total — and with two
 * access filters that overlap is thousands of videos wide). Must stay in
 * step with visibleVideos: same predicates, same order. */
export function gateBreakdown(
  videos: readonly PartnerVideo[],
  filter: CatalogFilter
): GateBreakdown {
  let byOrientation = 0;
  let byScript = 0;
  let byVideo = 0;
  let byMutedTags = 0;
  for (const video of videos) {
    if (
      !matchesOrientation(video, filter.orientation, filter.orientationTags)
    ) {
      byOrientation += 1;
    } else if (!(filter.premiumScripts || hasFreeScript(video))) {
      byScript += 1;
    } else if (!(filter.paidVideos || hasFreeVideo(video))) {
      byVideo += 1;
    } else if (hasMutedTag(video, filter.mutedTags)) {
      byMutedTags += 1;
    }
  }
  const hidden = byOrientation + byScript + byVideo + byMutedTags;
  return {
    total: videos.length,
    visible: videos.length - hidden,
    hidden,
    byOrientation,
    byScript,
    byVideo,
    byMutedTags
  };
}

// parsed-timestamp cache: sorting the 15k-item catalog would otherwise call
// Date.parse hundreds of thousands of times per re-sort
const timeCache = new Map<string, number>();

function time(value?: string): number {
  if (!value) return 0;
  let parsed = timeCache.get(value);
  if (parsed === undefined) {
    parsed = Date.parse(value);
    timeCache.set(value, parsed);
  }
  return parsed;
}

/** Newest first, on `publishedAt` — the day the video went live on the index.
 *
 * NOT `createdAt`: that is when the entry was started, which on the live index
 * comes a median 34 days (p90: 129) before it is published, and on 15,916 of
 * 16,762 videos more than a day before. A shelf sorted on it surfaces videos
 * by when work on them began, not when anyone could see them.
 *
 * `publishedAt` goes out in batches — 1,863 distinct values, 992 videos on
 * the single instant 2025-04-22T07:21:04 — so ties are broken on `createdAt`
 * to keep the order stable instead of whatever the engine emits first. Same
 * field `publishedWithin` cuts on, so the shelf and the filter agree. */
export function recentFirst(
  videos: readonly PartnerVideo[],
  limit?: number
): PartnerVideo[] {
  return sortedHead(
    videos,
    (a, b) =>
      time(b.publishedAt) - time(a.publishedAt) ||
      time(b.createdAt) - time(a.createdAt),
    limit
  );
}

export function recentlyUpdatedFirst(
  videos: readonly PartnerVideo[],
  limit?: number
): PartnerVideo[] {
  return sortedHead(
    videos,
    (a, b) => time(b.updatedAt) - time(a.updatedAt),
    limit
  );
}

/** `[...items].sort(compare).slice(0, limit)`, without sorting the rest.
 * A shelf shows 20 of a ~10k pool, and a full sort per shelf on every visit
 * was the larger part of the homepage's cost on a slow phone. Ties keep
 * their input order, exactly as the (stable) full sort leaves them. No limit
 * is the plain full sort. */
function sortedHead<T>(
  items: readonly T[],
  compare: (a: T, b: T) => number,
  limit?: number
): T[] {
  if (limit === undefined || limit >= items.length) {
    return [...items].sort(compare);
  }
  const head: T[] = [];
  if (limit <= 0) return head;
  for (const item of items) {
    // full, and not strictly ahead of the last kept: a stable sort puts it
    // after that one too
    if (head.length === limit && compare(item, head[limit - 1]!) >= 0) {
      continue;
    }
    // first slot whose occupant sorts strictly after this item
    let low = 0;
    let high = head.length;
    while (low < high) {
      const mid = (low + high) >> 1;
      if (compare(item, head[mid]!) < 0) high = mid;
      else low = mid + 1;
    }
    head.splice(low, 0, item);
    if (head.length > limit) head.pop();
  }
  return head;
}

/** Votes a rating needs before it ranks purely on its percentage — anything
 * below the floor sorts after every established rating, so a lone 5-star
 * vote can't top the list. */
const RATING_VOTE_FLOOR = 10;

function voteCount(video: PartnerVideo): number {
  return (video.upVotes ?? 0) + (video.downVotes ?? 0);
}

/** Exact rating order (matches the % shown on cards), established ratings
 * first, ties broken by vote count. */
export function topRated(
  videos: readonly PartnerVideo[],
  limit?: number
): PartnerVideo[] {
  return sortedHead(
    videos.filter(video => (video.rating ?? 0) > 0),
    (a, b) => {
      const aEstablished = voteCount(a) >= RATING_VOTE_FLOOR;
      const bEstablished = voteCount(b) >= RATING_VOTE_FLOOR;
      if (aEstablished !== bEstablished) return aEstablished ? -1 : 1;
      return (b.rating ?? 0) - (a.rating ?? 0) || voteCount(b) - voteCount(a);
    },
    limit
  );
}

export function mostPlayed(
  videos: readonly PartnerVideo[],
  limit?: number
): PartnerVideo[] {
  return sortedHead(
    videos.filter(video => (video.scriptPlays ?? 0) > 0),
    (a, b) => (b.scriptPlays ?? 0) - (a.scriptPlays ?? 0),
    limit
  );
}

export function mostViewed(videos: readonly PartnerVideo[]): PartnerVideo[] {
  return [...videos]
    .filter(video => (video.views ?? 0) > 0)
    .sort((a, b) => (b.views ?? 0) - (a.views ?? 0));
}

/** Inclusive duration window in seconds; pass Infinity for an open end. */
export function byDurationRange(
  videos: readonly PartnerVideo[],
  minSeconds: number,
  maxSeconds: number
): PartnerVideo[] {
  if (minSeconds <= 0 && maxSeconds === Infinity) return [...videos];
  return videos.filter(video => {
    const duration = video.duration ?? 0;
    return duration >= minSeconds && duration <= maxSeconds;
  });
}

export function byTag(
  videos: readonly PartnerVideo[],
  tag: string
): PartnerVideo[] {
  return videos.filter(video => video.tags?.includes(tag));
}

export function byPartner(
  videos: readonly PartnerVideo[],
  partnerId: string
): PartnerVideo[] {
  return videos.filter(video => video.partnerId === partnerId);
}

export function byPerformer(
  videos: readonly PartnerVideo[],
  performerId: string
): PartnerVideo[] {
  return videos.filter(video =>
    video.performers?.some(performer => performer.performerId === performerId)
  );
}

/** Videos scripted by one person. Matched on `scripterName` rather than
 * `scripteId` (the API's own spelling) because the name is what a shareable
 * URL can carry and what a chip can print — and there are only 17 distinct
 * scripters across the whole catalog, so collisions are not a live concern. */
export function byScripter(
  videos: readonly PartnerVideo[],
  scripter: string
): PartnerVideo[] {
  return videos.filter(video => video.scripterName === scripter);
}

/**
 * Published within the last `days`, measured on `publishedAt`.
 *
 * NOT `createdAt`, which is when the entry was started, not when it went
 * live: it runs a median 34 days ahead of `publishedAt`, so a "past week" cut
 * on it found 2 videos in a week the index published 197. (2.5.0 had this the
 * other way round, reading `publishedAt`'s batch ties as an ingest artefact.
 * They are real — publishing happens in batches.)
 *
 * Videos with no `publishedAt` drop out rather than passing through: an
 * undated entry is not evidence of being recent. (Every live entry carries
 * one.)
 */
export function publishedWithin(
  videos: readonly PartnerVideo[],
  days: number
): PartnerVideo[] {
  if (!(days > 0)) return [...videos];
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  return videos.filter(video => {
    const at = video.publishedAt ? Date.parse(video.publishedAt) : NaN;
    return Number.isFinite(at) && at >= cutoff;
  });
}

/**
 * Published in `[from, to)`, on `publishedAt` — for a closed window such as a
 * calendar month, where `publishedWithin` only reaches back from now.
 *
 * A month that has ended is final on this field: `publishedAt` is stamped
 * when a batch goes live (September 2026's batches include 203 videos created
 * back in 2024), so nothing arrives later carrying an earlier date. Counting
 * on `createdAt` would not be — September has 110 by that field today and
 * keeps growing for months, since entries publish a median 20 days after they
 * are started (p90: 61).
 */
export function publishedBetween(
  videos: readonly PartnerVideo[],
  from: Date,
  to: Date
): PartnerVideo[] {
  const start = from.getTime();
  const end = to.getTime();
  return videos.filter(video => {
    const at = time(video.publishedAt);
    return at >= start && at < end;
  });
}

/**
 * Strokes per minute while the script is moving, or `null` when this video
 * carries no usable measurement (1.2% of the catalog).
 *
 * Read off the `scriptMetadata` the index now ships inline, so this costs no
 * request and covers videos the per-video endpoint has not enriched yet. That
 * copy is downsampled — a median 7 s segment, against the endpoint's 1 s — and
 * because a segment holding one second of motion counts as a full segment of
 * active time, the figure reads slightly low: measured against the endpoint on
 * 50 videos the ratio is p50 0.923, within 10% on 32 and within 20% on 47. The
 * bias is one-directional and the ordering is preserved, which is what a
 * filter and a sort need. Every surface reads THIS function so one video can
 * never show two speeds.
 *
 * Memoised on the video object: the catalog is frozen and long-lived, while
 * a filter pass re-runs on every keystroke, and decoding 16k run-length
 * arrays per pass is the one thing here that would be felt.
 */
const speedCache = new WeakMap<PartnerVideo, number | null>();

export function scriptSpeed(video: PartnerVideo): number | null {
  // worked out ahead by our own server with this same arithmetic, when the
  // snapshot came from there (server/catalog.js) — its entries carry no
  // segments to decode
  if (video.spm !== undefined) return video.spm;
  const cached = speedCache.get(video);
  if (cached !== undefined) return cached;
  const heat = scriptHeat(video.scriptMetadata);
  const speed = heat ? heat.strokesPerMinute : null;
  speedCache.set(video, speed);
  return speed;
}

/** Inclusive strokes-per-minute window; pass Infinity for an open end.
 * Videos with no measurement drop out whenever the filter is narrowed at all
 * — an unmeasured script is not evidence of being in range — so the caller
 * discloses how many that cost (see the browse page's count line). */
export function bySpeedRange(
  videos: readonly PartnerVideo[],
  minSpm: number,
  maxSpm: number
): PartnerVideo[] {
  if (minSpm <= 0 && maxSpm === Infinity) return [...videos];
  return videos.filter(video => {
    const speed = scriptSpeed(video);
    return speed !== null && speed >= minSpm && speed <= maxSpm;
  });
}

/** How many of these carry no speed measurement — the number behind the
 * "N not measured" note the range filter shows. */
export function unmeasuredCount(videos: readonly PartnerVideo[]): number {
  let count = 0;
  for (const video of videos) {
    if (scriptSpeed(video) === null) count += 1;
  }
  return count;
}

/** Fastest first. Unmeasured videos are DROPPED rather than parked at the
 * end: the browse page reverses the sorted array in place to flip direction,
 * which would otherwise float every unmeasured video to the top of an
 * ascending sort. Same rule topRated and mostPlayed already follow. */
export function fastestFirst(videos: readonly PartnerVideo[]): PartnerVideo[] {
  return videos
    .filter(video => scriptSpeed(video) !== null)
    .sort((a, b) => (scriptSpeed(b) ?? 0) - (scriptSpeed(a) ?? 0));
}

/** Videos shipping a short silent roll clip — 46.7% of the catalog. */
export function withPreview(videos: readonly PartnerVideo[]): PartnerVideo[] {
  return videos.filter(video => Boolean(video.preview));
}

/** AND-match: the video must carry every requested tag. */
export function byTags(
  videos: readonly PartnerVideo[],
  tags: readonly string[]
): PartnerVideo[] {
  if (!tags.length) return [...videos];
  return videos.filter(video => tags.every(tag => video.tags?.includes(tag)));
}

export function searchTitle(
  videos: readonly PartnerVideo[],
  query: string
): PartnerVideo[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return [...videos];
  return videos.filter(video => video.title?.toLowerCase().includes(needle));
}

export function longestFirst(videos: readonly PartnerVideo[]): PartnerVideo[] {
  return [...videos].sort((a, b) => (b.duration ?? 0) - (a.duration ?? 0));
}

export function alphabetical(videos: readonly PartnerVideo[]): PartnerVideo[] {
  return [...videos].sort((a, b) =>
    (a.title ?? "").localeCompare(b.title ?? "")
  );
}

export function vrOnly(videos: readonly PartnerVideo[]): PartnerVideo[] {
  return videos.filter(video => video.format?.format === "vr");
}

export function byIds(
  videos: readonly PartnerVideo[],
  ids: readonly string[]
): PartnerVideo[] {
  const wanted = new Set(ids);
  return videos.filter(video => wanted.has(video.partnerVideoId));
}

/** Like byIds, but preserving the order of `ids` (history, playlists). */
export function inOrder(
  videos: readonly PartnerVideo[],
  ids: readonly string[]
): PartnerVideo[] {
  const byId = new Map(videos.map(video => [video.partnerVideoId, video]));
  return ids
    .map(id => byId.get(id))
    .filter((video): video is PartnerVideo => video !== undefined);
}

/** Videos most similar to `video` by shared-tag overlap, best first. */
export function relatedTo(
  videos: readonly PartnerVideo[],
  video: PartnerVideo,
  count = 20
): PartnerVideo[] {
  const wanted = new Set(video.tags ?? []);
  if (!wanted.size) return [];
  const scored: { candidate: PartnerVideo; overlap: number }[] = [];
  for (const candidate of videos) {
    if (candidate.partnerVideoId === video.partnerVideoId) continue;
    let overlap = 0;
    for (const tag of candidate.tags ?? []) {
      if (wanted.has(tag)) overlap += 1;
    }
    if (overlap >= 2) scored.push({ candidate, overlap });
  }
  return scored
    .sort(
      (a, b) =>
        b.overlap - a.overlap ||
        (b.candidate.rating ?? 0) - (a.candidate.rating ?? 0)
    )
    .slice(0, count)
    .map(entry => entry.candidate);
}

/** The one artwork rule: thumbnail first, first still as fallback. */
export function artworkOf(video: PartnerVideo): string | undefined {
  return video.thumbnail ?? video.images?.[0];
}

/** Inline-player embed URL for partners with a public embed endpoint
 * (Pornhub, xHamster) — derived from videoUrl; undefined for everyone else.
 * Both hosts must stay in index.html's frame-src for the iframe to load. */
export function embedUrlOf(video: PartnerVideo): string | undefined {
  if (!video.videoUrl) return undefined;
  let url: URL;
  try {
    url = new URL(video.videoUrl);
  } catch {
    return undefined;
  }
  const host = url.hostname.replace(/^www\./, "");
  if (host === "pornhub.com") {
    const viewkey = url.searchParams.get("viewkey");
    return viewkey
      ? `https://www.pornhub.com/embed/${encodeURIComponent(viewkey)}`
      : undefined;
  }
  if (host === "xhamster.com") {
    // /videos/<slug>-<id> where the id is numeric (legacy) or xh-prefixed
    const id = /-((?:\d+)|(?:xh[A-Za-z0-9]+))\/?$/.exec(url.pathname)?.[1];
    return id ? `https://xhamster.com/xembed.php?video=${id}` : undefined;
  }
  return undefined;
}

/** Videos with usable artwork. Metadata presence alone isn't enough — dead
 * partner CDNs leave stale links behind — so callers can also pass the
 * catalog's broken-artwork registry to drop videos whose link 404'd. */
export function withThumbnail(
  videos: readonly PartnerVideo[],
  brokenArtwork?: ReadonlySet<string>
): PartnerVideo[] {
  return videos.filter(video => {
    const artwork = artworkOf(video);
    if (!artwork) return false;
    return !brokenArtwork?.has(artwork);
  });
}

export interface TagSummary {
  tag: string;
  count: number;
}

/** Every tag in the catalog with its video count, most-used first. */
function tagCounts(videos: readonly PartnerVideo[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const video of videos) {
    for (const tag of video.tags ?? []) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return counts;
}

export function tagsOf(videos: readonly PartnerVideo[]): TagSummary[] {
  return [...tagCounts(videos).entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

/** Tags ranked by how many videos carry them. */
export function topTags(
  videos: readonly PartnerVideo[],
  count: number
): string[] {
  // the same order tagsOf would give, minus sorting all ~30k tags for 12
  return sortedHead([...tagCounts(videos)], (a, b) => b[1] - a[1], count).map(
    ([tag]) => tag
  );
}

export interface PartnerSummary {
  partnerId: string;
  name: string;
  count: number;
  /** videos behind the partner's own paywall (videoAccess) */
  paidVideoCount: number;
  /** videos whose script is not free (scriptAccess) — a different paywall */
  premiumScriptCount: number;
}

/** Every site in the catalog with its video count, biggest first. */
export function partnersOf(videos: readonly PartnerVideo[]): PartnerSummary[] {
  const partners = new Map<string, PartnerSummary>();
  for (const video of videos) {
    const paid = video.videoAccess !== "public" ? 1 : 0;
    const premium = video.scriptAccess !== "public" ? 1 : 0;
    const existing = partners.get(video.partnerId);
    if (existing) {
      existing.count += 1;
      existing.paidVideoCount += paid;
      existing.premiumScriptCount += premium;
    } else {
      partners.set(video.partnerId, {
        partnerId: video.partnerId,
        name: video.partnerName ?? video.partnerId,
        count: 1,
        paidVideoCount: paid,
        premiumScriptCount: premium
      });
    }
  }
  return [...partners.values()].sort((a, b) => b.count - a.count);
}

export interface ScripterSummary {
  name: string;
  count: number;
}

/** Every scripter in the catalog with their video count, biggest first.
 * A small facet — the live index has 17 of them — so the picker can list
 * the lot without a search box doing any real work. */
export function scriptersOf(
  videos: readonly PartnerVideo[]
): ScripterSummary[] {
  const scripters = new Map<string, number>();
  for (const video of videos) {
    const name = video.scripterName;
    if (!name) continue;
    scripters.set(name, (scripters.get(name) ?? 0) + 1);
  }
  return [...scripters]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

export interface PerformerSummary {
  performerId: string;
  name: string;
  avatar?: string | undefined;
  count: number;
  /** mean rating (0–100) across their rated videos; 0 when none are rated */
  avgRating: number;
  /** how many of their videos carry a rating */
  ratedCount: number;
}

/** Every performer in the catalog with their video count, biggest first. */
export function performersOf(
  videos: readonly PartnerVideo[]
): PerformerSummary[] {
  interface Accumulator extends PerformerSummary {
    ratingSum: number;
  }
  const performers = new Map<string, Accumulator>();
  for (const video of videos) {
    const rating = video.rating ?? 0;
    for (const performer of video.performers ?? []) {
      if (!performer.name?.trim()) continue;
      let entry = performers.get(performer.performerId);
      if (!entry) {
        entry = {
          performerId: performer.performerId,
          name: performer.name,
          avatar: performer.avatar,
          count: 0,
          avgRating: 0,
          ratedCount: 0,
          ratingSum: 0
        };
        performers.set(performer.performerId, entry);
      }
      entry.count += 1;
      entry.avatar ??= performer.avatar;
      if (rating > 0) {
        entry.ratingSum += rating;
        entry.ratedCount += 1;
      }
    }
  }
  return [...performers.values()]
    .map(({ ratingSum, ...summary }) => ({
      ...summary,
      avgRating: summary.ratedCount ? ratingSum / summary.ratedCount : 0
    }))
    .sort((a, b) => b.count - a.count);
}

/** How many of the strongest candidates the hero draws from. Wide enough
 * that coming back to home shows something else, narrow enough that every
 * entry deserves the slot. */
const FEATURED_POOL = 24;

export interface PerformerStats {
  /** as the index spells it on their videos; undefined when none are here */
  name?: string;
  avatar?: string | undefined;
  count: number;
  /** mean rating (0–100) across their rated videos, as `performersOf`
   * averages it, so the profile agrees with the directory card; 0 when none
   * are rated */
  avgRating: number;
  /** script plays summed across their videos */
  plays: number;
}

/** One performer's numbers across `videos` — what `performersOf` works out
 * for everyone, for a single id, without building the whole roster. */
export function performerStats(
  videos: readonly PartnerVideo[],
  performerId: string
): PerformerStats {
  const stats: PerformerStats = { count: 0, avgRating: 0, plays: 0 };
  let ratingSum = 0;
  let ratedCount = 0;
  for (const video of videos) {
    const performer = video.performers?.find(
      entry => entry.performerId === performerId
    );
    if (!performer) continue;
    stats.count += 1;
    stats.plays += video.scriptPlays ?? 0;
    if (performer.name?.trim()) stats.name ??= performer.name;
    stats.avatar ??= performer.avatar;
    if ((video.rating ?? 0) > 0) {
      ratingSum += video.rating ?? 0;
      ratedCount += 1;
    }
  }
  stats.avgRating = ratedCount ? ratingSum / ratedCount : 0;
  return stats;
}

/** Days after publication at which a video keeps half its freshness weight. */
const FEATURED_HALF_LIFE_DAYS = 120;

/** Exponent on the draw weights — above 1 tilts the roll toward the pool's
 * best entries without ever locking the weaker ones out. */
const FEATURED_BIAS = 3;

const DAY_MS = 86_400_000;

/** Neutral rating (0–1) a video is pulled toward while its votes are thin,
 * so a lone 100% vote can't outrank an established favourite. */
const FEATURED_RATING_BASELINE = 0.7;

function confidentRating(video: PartnerVideo): number {
  const rating = (video.rating ?? 0) / 100;
  // unrated sits just under the baseline: unproven, not disqualified
  if (rating <= 0) return FEATURED_RATING_BASELINE - 0.1;
  const votes = voteCount(video);
  const confidence = votes / (votes + RATING_VOTE_FLOOR);
  return (
    FEATURED_RATING_BASELINE + (rating - FEATURED_RATING_BASELINE) * confidence
  );
}

/** Hero worthiness, 0–1: mostly how well it's rated, then how many people
 * reached it, then how fresh it is. Freshness only tilts the odds — on its
 * own it used to pin the hero to whatever landed last night. */
function featuredScore(video: PartnerVideo, now: number): number {
  const published = time(video.publishedAt);
  const ageDays = published ? Math.max(0, (now - published) / DAY_MS) : 3650;
  const freshness = 0.5 ** (ageDays / FEATURED_HALF_LIFE_DAYS);
  // plays count quadruple — running the script is a stronger signal than
  // opening the page — and the log keeps one runaway hit from owning the slot
  const reach =
    Math.log10(1 + (video.scriptPlays ?? 0) * 4 + (video.views ?? 0)) / 6;
  return (
    0.5 * confidentRating(video) + 0.3 * Math.min(1, reach) + 0.2 * freshness
  );
}

/** Spreads an arbitrary seed number into a well-distributed 0–1 (mulberry32's
 * mixing step). The caller owns the seed so the hero re-rolls once per visit
 * rather than on every re-render. */
function seededUnit(seed: number): number {
  let t = (Math.trunc(seed * 0x1_0000_0000) ^ 0x9e37_79b9) >>> 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 0x1_0000_0000;
}

export interface FeaturedOptions {
  /** any number; the same seed always yields the same pick, so pass a fresh
   * one per page visit and hold it steady for the visit's lifetime. Omit for
   * the deterministic top scorer. */
  seed?: number;
  /** partnerVideoId to skip — the previous visit's hero, so a return trip
   * can't land on it twice */
  exclude?: string | undefined;
}

/** Hero candidate: drawn at random from the videos that score best on
 * rating, reach and freshness, and that have artwork known to load. */
export function featuredPick(
  videos: readonly PartnerVideo[],
  brokenArtwork?: ReadonlySet<string>,
  options?: FeaturedOptions
): PartnerVideo | undefined {
  const now = Date.now();
  const scored = withThumbnail(videos, brokenArtwork)
    .map(video => ({ video, score: featuredScore(video, now) }))
    .sort((a, b) => b.score - a.score);

  let pool = scored.slice(0, FEATURED_POOL);
  if (options?.exclude) {
    const trimmed = pool.filter(
      entry => entry.video.partnerVideoId !== options.exclude
    );
    // only honour the exclusion while something else is left to show
    if (trimmed.length) pool = trimmed;
  }
  if (!pool.length) return undefined;
  if (options?.seed === undefined) return pool[0]!.video;

  const weights = pool.map(entry => entry.score ** FEATURED_BIAS);
  let ticket = seededUnit(options.seed) * weights.reduce((a, b) => a + b, 0);
  for (const [index, weight] of weights.entries()) {
    ticket -= weight;
    if (ticket <= 0) return pool[index]!.video;
  }
  return pool[pool.length - 1]!.video;
}
