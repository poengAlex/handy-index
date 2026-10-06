import { reactive, readonly, ref, watch, type Ref } from "vue";
import {
  ScriptIndexError,
  getPerformer,
  getPerformerRoster
} from "@/services/script-index/client";
import type { PerformerProfile } from "@/services/script-index/types";
import { useCatalogStore } from "@/stores/catalog";

/** Profiles already fetched this session, so going back to a performer's
 * page shows their profile at once. null = no profile anywhere, which is as
 * worth remembering as the profile itself. A failed request is not
 * remembered: the next visit asks again. */
const profiles = new Map<string, PerformerProfile | null>();

/** The whole list, by id — downloaded once, on the first 404 or the first
 * look at the directory's filters, and shared by everything after it.
 * Dropped if the download fails, so the next ask retries instead of
 * inheriting the failure. */
let roster: Promise<Map<string, PerformerProfile>> | undefined;

export function loadRoster(): Promise<Map<string, PerformerProfile>> {
  roster ??= getPerformerRoster().then(
    list => new Map(list.map(entry => [entry.performerId, entry])),
    (error: unknown) => {
      roster = undefined;
      throw error;
    }
  );
  return roster;
}

/** `/performers/{id}`, falling back to the list for the third of performers
 * it answers 404 for despite the list holding their whole profile. */
async function fetchProfile(id: string): Promise<PerformerProfile | null> {
  try {
    return await getPerformer(id);
  } catch (error) {
    if (!(error instanceof ScriptIndexError && error.status === 404)) {
      throw error;
    }
    return (await loadRoster()).get(id) ?? null;
  }
}

/**
 * The profile for whichever performer `performerId` names, refetched as it
 * changes. undefined while loading and whenever there is none to show — the
 * caller renders what the catalog knows either way, so a missing profile is
 * a shorter panel, never an error.
 */
export function usePerformerProfile(performerId: Ref<string>) {
  const profile = ref<PerformerProfile>();

  watch(
    performerId,
    async id => {
      profile.value = undefined;
      if (!id) return;
      const cached = profiles.get(id);
      if (cached !== undefined) {
        profile.value = cached ?? undefined;
        return;
      }
      try {
        const fetched = await fetchProfile(id);
        profiles.set(id, fetched);
        // the id may have moved on while this was in flight
        if (performerId.value === id) profile.value = fetched ?? undefined;
      } catch {
        // offline or the API is down: the panel keeps what the catalog knows
      }
    },
    { immediate: true }
  );

  return profile;
}

// --- pictures for performers the index has none for ---
//
// 155 performers carry no picture on any of their videos (Lana Rhoades, 202
// videos, among them) but do have pictures in their profile, and others carry
// one on a host that has since dropped it (410 Gone) while their profile
// lists the same picture somewhere that still serves it. Either way the
// picture is taken from the profile — but not blindly: some profiles lead
// with a 1323×270 banner, which a square tile crops to a strip. Each
// candidate is loaded once to read its shape, and only a square or portrait
// one is used; that load is also the one the tile then draws from the
// browser's cache.

/** Pictures found so far, by performer id. Reactive, so tiles fill in. */
const pictures = reactive(new Map<string, string>());

/** Performers already looked at — found or not — so a scroll back up doesn't
 * look again. Cleared for a batch whose list download failed. */
const looked = new Set<string>();

/** Candidates tried per performer before giving up. Four, because a dead
 * avatar is often followed by its banner and then by the same avatar on a
 * host that still serves it (Alex Adams, Jax Slayher). */
const MAX_CANDIDATES = 4;

/** Pornhub's grey silhouette for an account without a picture — a picture
 * of nobody, which the tile's own placeholder already says better. */
const STAND_IN = /\/pics\/users\/default\//;

/** Wider than this (width ÷ height) is a banner, not a face. */
const MAX_ASPECT = 1.25;

/** How long the pictures already on screen get the network to themselves.
 * The main thread goes idle within milliseconds of the grid painting, while
 * its 48 card pictures are still downloading — on a slow phone, 3.6 MB
 * arriving alongside them would hold up the very pictures being looked at. */
const HEAD_START_MS = 1500;

/** Resolves once the page has had its head start and the browser has
 * nothing better to do — the list behind these pictures only adds to a page
 * that is already complete, so it waits its turn. Safari has no
 * requestIdleCallback. */
function whenIdle(): Promise<void> {
  return new Promise(resolve => {
    setTimeout(() => {
      if (typeof requestIdleCallback === "function") {
        requestIdleCallback(() => resolve(), { timeout: 3000 });
      } else {
        resolve();
      }
    }, HEAD_START_MS);
  });
}

/** Each candidate's verdict, so a picture two lookups share is loaded once. */
const shapes = new Map<string, Promise<boolean>>();

function isPortrait(url: string): Promise<boolean> {
  let verdict = shapes.get(url);
  if (!verdict) {
    verdict = new Promise(resolve => {
      // off-DOM (tests) there is nothing to measure with
      if (typeof Image === "undefined") {
        resolve(false);
        return;
      }
      const image = new Image();
      image.onload = () =>
        resolve(image.naturalWidth <= image.naturalHeight * MAX_ASPECT);
      image.onerror = () => resolve(false);
      image.src = url;
    });
    shapes.set(url, verdict);
  }
  return verdict;
}

async function firstPortrait(
  profile: PerformerProfile | null | undefined
): Promise<string | undefined> {
  const broken = useCatalogStore().brokenArtwork;
  const candidates = [...new Set([profile?.avatar, ...(profile?.images ?? [])])]
    .filter(
      (url): url is string =>
        Boolean(url) && !broken.has(url ?? "") && !STAND_IN.test(url ?? "")
    )
    .slice(0, MAX_CANDIDATES);
  for (const url of candidates) {
    if (await isPortrait(url)) return url;
  }
  return undefined;
}

/** Look for pictures for these performers — ids the catalog has no working
 * picture for. A profile already fetched is tried first; anyone it doesn't
 * settle needs the full list, downloaded once, when the browser is idle.
 * The list is worth asking even when the profile is in hand: for some
 * performers it carries pictures `/performers/{id}` leaves out — the only
 * working copies of Alex Adams' avatar are in the list. */
async function findPictures(ids: readonly string[]): Promise<void> {
  const pending = ids.filter(id => !looked.has(id));
  if (!pending.length) return;
  for (const id of pending) looked.add(id);
  const unsettled: string[] = [];
  await Promise.all(
    pending.map(async id => {
      const url = await firstPortrait(profiles.get(id));
      if (url) pictures.set(id, url);
      else unsettled.push(id);
    })
  );
  if (!unsettled.length) return;
  let list: Map<string, PerformerProfile>;
  try {
    await whenIdle();
    list = await loadRoster();
  } catch {
    // try these again on the next call
    for (const id of unsettled) looked.delete(id);
    return;
  }
  await Promise.all(
    unsettled.map(async id => {
      const url = await firstPortrait(list.get(id));
      if (url) pictures.set(id, url);
    })
  );
}

/** A picture for performers the index has none for, found after the fact.
 * `pictures` fills in as `findPictures` finds them; `working` says whether a
 * catalog picture is worth drawing — present, and not known dead. */
export function usePerformerPictures() {
  const catalog = useCatalogStore();
  function working(url: string | undefined): url is string {
    return Boolean(url) && !catalog.brokenArtwork.has(url ?? "");
  }
  return { pictures: readonly(pictures), findPictures, working };
}
