// What a performer's page can show of them beyond the avatar: a photo
// slideshow of pictures of them, and a reel of their videos, most played
// first — their preview clips, or their stills where none has a clip. Pure
// selection — which pictures and which videos, in which order. Loading and
// playing them is the components'.
import type { PartnerVideo, PerformerProfile } from "./types";

/** Pornhub's grey silhouette for an account without a picture — a picture
 * of nobody (see usePerformerPictures) */
const STAND_IN = /\/pics\/users\/default\//;

export const GALLERY_MAX = 48;
export const REEL_MAX = 24;

/** Most played first, then newest: the videos people come back to are the
 * ones that best say who someone is. Copied, never sorted in place — the
 * caller's list is usually a catalog selector's result. */
function strongestFirst(videos: readonly PartnerVideo[]): PartnerVideo[] {
  return [...videos].sort(
    (a, b) =>
      (b.scriptPlays ?? 0) - (a.scriptPlays ?? 0) ||
      (b.createdAt ?? "").localeCompare(a.createdAt ?? "")
  );
}

/**
 * The photo slideshow: pictures of the performer themselves — the
 * catalog's avatar for them and their profile's pictures — never stills
 * from their videos, which belong to the reel. Duplicates (the avatar is
 * usually also the profile's first picture) and pictures known to be dead
 * are skipped.
 */
export function performerPhotos(
  avatars: readonly (string | undefined)[],
  profile: PerformerProfile | undefined,
  broken: ReadonlySet<string>,
  max = GALLERY_MAX
): string[] {
  const photos: string[] = [];
  for (const url of [...avatars, profile?.avatar, ...(profile?.images ?? [])]) {
    if (!url || photos.includes(url) || broken.has(url) || STAND_IN.test(url)) {
      continue;
    }
    photos.push(url);
  }
  return photos.slice(0, max);
}

/** A video's stills, poster first — deduped (10,958 videos repeat their
 * thumbnail inside `images`) and without any known to be dead. */
export function videoStills(
  video: PartnerVideo,
  broken: ReadonlySet<string>
): string[] {
  const stills: string[] = [];
  for (const url of [video.thumbnail, ...(video.images ?? [])]) {
    if (url && !stills.includes(url) && !broken.has(url)) stills.push(url);
  }
  return stills;
}

/** What the reel can be made of, both lists most played first: the videos
 * with a preview clip, and the videos with stills. */
export interface ReelSource {
  clips: PartnerVideo[];
  stills: PartnerVideo[];
}

/** The reel is clips or photos, never a mix: the videos' preview clips
 * wherever any of them has one, and their stills only for a performer none
 * of whose videos has a clip (the component falls back to `stills` too if
 * every clip turns out not to play). */
export function performerReel(
  videos: readonly PartnerVideo[],
  max = REEL_MAX
): ReelSource {
  const ranked = strongestFirst(videos);
  return {
    clips: ranked.filter(video => video.preview).slice(0, max),
    stills: ranked
      .filter(video => video.thumbnail || video.images?.length)
      .slice(0, max)
  };
}
