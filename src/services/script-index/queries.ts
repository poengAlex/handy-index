// Pure selectors over the in-memory catalog. Every listing in the app (rows,
// filters, search) is a composition of these — components never sort or
// filter PartnerVideo[] themselves.
import type { PartnerVideo } from "./types";

export type Orientation = "straight" | "gay" | "trans" | "all";

export const ORIENTATIONS: Orientation[] = ["straight", "gay", "trans", "all"];

export function matchesOrientation(
  video: PartnerVideo,
  orientation: Orientation
): boolean {
  if (orientation === "all") return true;
  const tags = video.tags ?? [];
  const gay = tags.some(tag => tag.includes("gay"));
  const trans = tags.some(tag => tag.includes("trans"));
  if (orientation === "gay") return gay;
  if (orientation === "trans") return trans;
  return !gay && !trans;
}

export interface CatalogFilter {
  orientation: Orientation;
  /** include videos whose script is not free */
  premium: boolean;
}

/** Baseline gate applied before any row query. */
export function visibleVideos(
  videos: readonly PartnerVideo[],
  filter: CatalogFilter
): PartnerVideo[] {
  return videos.filter(
    video =>
      matchesOrientation(video, filter.orientation) &&
      (filter.premium || video.scriptAccess === "public")
  );
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

export function recentFirst(videos: readonly PartnerVideo[]): PartnerVideo[] {
  return [...videos].sort((a, b) => time(b.publishedAt) - time(a.publishedAt));
}

export function recentlyUpdatedFirst(
  videos: readonly PartnerVideo[]
): PartnerVideo[] {
  return [...videos].sort((a, b) => time(b.updatedAt) - time(a.updatedAt));
}

/** Rating (0–100) damped by vote count so lone 5-star votes don't dominate. */
function ratingScore(video: PartnerVideo): number {
  const votes = (video.upVotes ?? 0) + (video.downVotes ?? 0);
  return (video.rating ?? 0) * Math.log10(votes + 2);
}

export function topRated(videos: readonly PartnerVideo[]): PartnerVideo[] {
  return [...videos]
    .filter(video => (video.rating ?? 0) > 0)
    .sort((a, b) => ratingScore(b) - ratingScore(a));
}

export function mostPlayed(videos: readonly PartnerVideo[]): PartnerVideo[] {
  return [...videos]
    .filter(video => (video.scriptPlays ?? 0) > 0)
    .sort((a, b) => (b.scriptPlays ?? 0) - (a.scriptPlays ?? 0));
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

export function withThumbnail(videos: readonly PartnerVideo[]): PartnerVideo[] {
  return videos.filter(video => Boolean(artworkOf(video)));
}

export interface TagSummary {
  tag: string;
  count: number;
}

/** Every tag in the catalog with its video count, most-used first. */
export function tagsOf(videos: readonly PartnerVideo[]): TagSummary[] {
  const counts = new Map<string, number>();
  for (const video of videos) {
    for (const tag of video.tags ?? []) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

/** Tags ranked by how many videos carry them. */
export function topTags(
  videos: readonly PartnerVideo[],
  count: number
): string[] {
  return tagsOf(videos)
    .slice(0, count)
    .map(summary => summary.tag);
}

export interface PartnerSummary {
  partnerId: string;
  name: string;
  count: number;
}

/** Every site in the catalog with its video count, biggest first. */
export function partnersOf(videos: readonly PartnerVideo[]): PartnerSummary[] {
  const partners = new Map<string, PartnerSummary>();
  for (const video of videos) {
    const existing = partners.get(video.partnerId);
    if (existing) {
      existing.count += 1;
    } else {
      partners.set(video.partnerId, {
        partnerId: video.partnerId,
        name: video.partnerName ?? video.partnerId,
        count: 1
      });
    }
  }
  return [...partners.values()].sort((a, b) => b.count - a.count);
}

export interface PerformerSummary {
  performerId: string;
  name: string;
  avatar?: string | undefined;
  count: number;
}

/** Every performer in the catalog with their video count, biggest first. */
export function performersOf(
  videos: readonly PartnerVideo[]
): PerformerSummary[] {
  const performers = new Map<string, PerformerSummary>();
  for (const video of videos) {
    for (const performer of video.performers ?? []) {
      if (!performer.name?.trim()) continue;
      const existing = performers.get(performer.performerId);
      if (existing) {
        existing.count += 1;
        existing.avatar ??= performer.avatar;
      } else {
        performers.set(performer.performerId, {
          performerId: performer.performerId,
          name: performer.name,
          avatar: performer.avatar,
          count: 1
        });
      }
    }
  }
  return [...performers.values()].sort((a, b) => b.count - a.count);
}

/** Hero candidate: fresh, decently rated and has artwork. */
export function featuredPick(
  videos: readonly PartnerVideo[]
): PartnerVideo | undefined {
  const candidates = recentFirst(withThumbnail(videos)).slice(0, 50);
  return topRated(candidates)[0] ?? candidates[0];
}
