import { acceptHMRUpdate, defineStore } from "pinia";
import { computed, ref, shallowRef } from "vue";
import {
  getCachedIndex,
  getCategories,
  getIndex,
  getTags
} from "@/services/script-index/client";
import type { Tag } from "@/services/script-index/types";
import {
  ORIENTATION_TAGS_SEED,
  byIds,
  gateBreakdown,
  visibleVideos
} from "@/services/script-index/queries";
import type { PartnerVideo } from "@/services/script-index/types";
import { useSettingsStore } from "./settings";

export type CatalogStatus = "idle" | "loading" | "ready" | "error";

/** The API's index has no readable Content-Length (chunked gzip, and CORS
 * exposes no size header), so when the snapshot comes from there the
 * denominator for a progress bar has to come from somewhere else: whatever
 * the last successful load decoded to. The seed is a measured figure (the
 * API's, October 2026), so even a first visit gets a bar that tracks reality.
 * Our own server's slimmed copy states its size outright. */
const SIZE_KEY = "ivdb.index-bytes";
const SIZE_SEED = 83_000_000;

/** How long a disk copy counts as current, matching the endpoint's own
 * `max-age`. Past this the snapshot still renders straight away — waiting on
 * 9 MB to see a catalog we already hold would be the wrong trade — and a fresh
 * one downloads behind it. */
const FRESH_MS = 60 * 60 * 1000;

/** …but only up to here. A copy this old is from a different browsing session
 * entirely, and quietly serving day-old rankings and script counts is worse
 * than one honest progress bar. */
const MAX_STALE_MS = 24 * 60 * 60 * 1000;

/** The stream hands back ~6k chunks for one index. A 4 px bar does not need
 * 6k re-renders — and each one competes with the download for the main
 * thread — so only redraw every quarter-megabyte (~170 steps, still smooth). */
const PROGRESS_STEP = 250_000;

function rememberedSize(): number {
  try {
    const stored = Number(localStorage.getItem(SIZE_KEY));
    // a stored size wildly off (truncated write, an index that halved) would
    // pin the bar at 1% or at 99% — only trust the same order of magnitude
    if (stored > SIZE_SEED / 4 && stored < SIZE_SEED * 4) return stored;
  } catch {
    // private mode / storage disabled — the seed is fine
  }
  return SIZE_SEED;
}

function rememberSize(bytes: number) {
  try {
    localStorage.setItem(SIZE_KEY, String(bytes));
  } catch {
    // nothing to do: next load just uses the seed again
  }
}

/** `/categories` as last fetched, and when. The list is short and rarely
 * changes, so it is asked for again only once this copy is a week old —
 * unlike which tag is in which category, which comes with every visit's
 * `/tags` list. */
const CATEGORIES_KEY = "ivdb.tag-categories";
const CATEGORIES_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

function rememberedCategories(): { names: string[]; at: number } | null {
  try {
    const raw: unknown = JSON.parse(
      localStorage.getItem(CATEGORIES_KEY) ?? "null"
    );
    if (
      raw &&
      typeof raw === "object" &&
      Array.isArray((raw as { names?: unknown }).names) &&
      typeof (raw as { at?: unknown }).at === "number"
    ) {
      const { names, at } = raw as { names: unknown[]; at: number };
      return {
        names: names.filter(n => typeof n === "string") as string[],
        at
      };
    }
  } catch {
    // private mode or a mangled blob — the seed is fine
  }
  return null;
}

/** The categories list as `/categories` serves it: the last fetched copy
 * while it is under a week old, otherwise a fresh one (remembered for next
 * time). If that fails, the last copy of any age, then nothing — the caller
 * falls back to the categories the tags themselves carry. */
async function categoryNames(): Promise<string[]> {
  const remembered = rememberedCategories();
  if (
    remembered?.names.length &&
    Date.now() - remembered.at < CATEGORIES_MAX_AGE_MS
  ) {
    return remembered.names;
  }
  try {
    const names = await getCategories();
    try {
      localStorage.setItem(
        CATEGORIES_KEY,
        JSON.stringify({ names, at: Date.now() })
      );
    } catch {
      // storage full or disabled — this visit still has the list
    }
    return names;
  } catch {
    return remembered?.names ?? [];
  }
}

/** The orientation tags as `/tags` last listed them. Kept across visits so
 * that once the list moves on from ORIENTATION_TAGS_SEED, the gate goes by
 * the new one from the first paint, not only once this visit's copy lands. */
const ORIENTATION_KEY = "ivdb.orientation-tags";

function rememberedOrientationTags(): ReadonlySet<string> {
  try {
    const raw: unknown = JSON.parse(
      localStorage.getItem(ORIENTATION_KEY) ?? "null"
    );
    if (Array.isArray(raw)) {
      const tags = raw.filter(entry => typeof entry === "string");
      if (tags.length) return new Set(tags);
    }
  } catch {
    // private mode or a mangled blob — the seed is fine
  }
  return new Set(ORIENTATION_TAGS_SEED);
}

/** Artwork URLs that failed to load. Dead partner CDNs are common in the
 * index and the metadata still carries the stale link, so presence of a URL
 * says nothing — only a load attempt does. Remembered across visits because
 * a dead link stays dead; capped so the blob can't grow unbounded. */
const BROKEN_ART_KEY = "ivdb.broken-artwork";
const BROKEN_ART_CAP = 2000;

function rememberedBrokenArtwork(): Set<string> {
  try {
    const raw: unknown = JSON.parse(
      localStorage.getItem(BROKEN_ART_KEY) ?? "[]"
    );
    if (Array.isArray(raw)) {
      return new Set(raw.filter(entry => typeof entry === "string"));
    }
  } catch {
    // private mode or a mangled blob — start clean
  }
  return new Set();
}

/**
 * Holds the one-shot index snapshot. The array is kept in a shallowRef so its
 * ~15k items stay out of Vue's deep reactivity; treat entries as immutable.
 */
export const useCatalogStore = defineStore("catalog", () => {
  const videos = shallowRef<readonly PartnerVideo[]>([]);
  const status = ref<CatalogStatus>("idle");

  /** Download progress for the one big fetch: decoded bytes in, the size we
   * expect from last time, and the parse tail. The wait is long enough
   * (~40 MB) that a spinner alone reads as a hang. */
  const loadedBytes = ref(0);
  const expectedBytes = ref(SIZE_SEED);
  const parsing = ref(false);

  /** A stale disk copy is on screen while a current one downloads behind it.
   * Never an error state and never a spinner: the catalog is usable. */
  const refreshing = ref(false);

  /** When the snapshot in memory was downloaded, epoch ms; 0 before the first
   * load. Off a disk copy this is the original download, not the read — the
   * question the settings row answers is how old the data is. */
  const fetchedAt = ref(0);

  /** Which tags say a video's orientation — what the orientation gate reads.
   * Fetched whenever the snapshot itself is, so the two stay about as fresh
   * as each other; until then, last visit's list or the seed. */
  const orientationTags = shallowRef<ReadonlySet<string>>(
    rememberedOrientationTags()
  );

  /** Each categorised tag's category as `/tags` gives it, tag -> category —
   * what the tag page's category pills filter on. Empty until
   * loadTagCategories() has run. */
  const tagCategories = shallowRef<ReadonlyMap<string, string>>(new Map());
  /** The categories, in `/categories`' order. */
  const categories = shallowRef<readonly string[]>([]);
  const categoriesStatus = ref<"idle" | "loading" | "ready" | "error">("idle");

  /** One `/tags` download per visit, shared by the orientation gate and the
   * categories — it is the same ~31,000-entry list either way. `fresh`
   * (the manual catalog update) asks again. Dropped on failure so the next
   * ask retries. */
  let tagList: Promise<Tag[]> | undefined;
  function tagDirectory(fresh = false): Promise<Tag[]> {
    if (fresh || !tagList) {
      tagList = getTags().catch((error: unknown) => {
        tagList = undefined;
        throw error;
      });
    }
    return tagList;
  }

  /** 0–1, and never quite 1 while bytes are still arriving: a bar that sits
   * full through the last chunk is the same lie as a spinner. */
  const progress = computed(() => {
    if (status.value === "ready" || parsing.value) return 1;
    return Math.min(loadedBytes.value / expectedBytes.value, 0.99);
  });

  /** Catalog with the user's orientation + access + muted-tag gate applied.
   * Every discovery surface derives from this, so the gate lives here only. */
  const visible = computed(() => {
    const settings = useSettingsStore();
    return visibleVideos(videos.value, {
      orientation: settings.orientation,
      orientationTags: orientationTags.value,
      premiumScripts: settings.showPremiumScripts,
      paidVideos: settings.showPaidVideos,
      mutedTags: settings.mutedSet
    });
  });

  /** Same gate minus orientation. The performer and site directories list who
   * exists in the index, not who matches your preference — dropping them would
   * read as missing data — and picking one of them from that list is an
   * explicit choice that outranks the ambient filter. Access + mutes still
   * apply, so this is never a way around them. */
  const anyOrientation = computed(() => {
    const settings = useSettingsStore();
    return visibleVideos(videos.value, {
      orientation: "all",
      orientationTags: orientationTags.value,
      premiumScripts: settings.showPremiumScripts,
      paidVideos: settings.showPaidVideos,
      mutedTags: settings.mutedSet
    });
  });

  /** The arithmetic behind `visible`: what each gate actually costs. Muted
   * tags are the expensive one — a single common tag can carry half the
   * index — and the only gate with no control in sight while you browse, so
   * every listing surface discloses this rather than silently shrinking. */
  const gates = computed(() => {
    const settings = useSettingsStore();
    return gateBreakdown(videos.value, {
      orientation: settings.orientation,
      orientationTags: orientationTags.value,
      premiumScripts: settings.showPremiumScripts,
      paidVideos: settings.showPaidVideos,
      mutedTags: settings.mutedSet
    });
  });

  /** The user's favorited videos — never gated, favorites always show. */
  const favorites = computed(() => {
    const settings = useSettingsStore();
    return byIds(videos.value, settings.favorites);
  });

  /** Live registry of artwork URLs MediaImage failed to load. Reactive Set:
   * surfaces that filter on it re-run as broken links are discovered. */
  const brokenArtwork = ref<Set<string>>(rememberedBrokenArtwork());

  function markArtworkBroken(url: string): void {
    // offline isn't a dead link — don't poison the persisted set with URLs
    // that only failed because the network was down
    if (!url || !navigator.onLine || brokenArtwork.value.has(url)) return;
    brokenArtwork.value.add(url);
    if (brokenArtwork.value.size > BROKEN_ART_CAP) {
      // Sets iterate in insertion order, so this drops the oldest entries
      brokenArtwork.value = new Set(
        [...brokenArtwork.value].slice(-BROKEN_ART_CAP)
      );
    }
    try {
      localStorage.setItem(
        BROKEN_ART_KEY,
        JSON.stringify([...brokenArtwork.value])
      );
    } catch {
      // storage full or disabled — the in-session set still works
    }
  }

  /** Swap in the live orientation tags. Never throws, and never applies an
   * empty list: that would file every video under Straight, and is far
   * likelier a broken answer than the index dropping orientation. */
  async function updateOrientationTags(fresh = false): Promise<void> {
    let tags: string[];
    try {
      tags = (await tagDirectory(fresh))
        .filter(tag => tag.category === "orientation")
        .map(tag => tag.tagId);
    } catch {
      // last visit's list or the seed carries on
      return;
    }
    if (!tags.length) return;
    const current = orientationTags.value;
    // the same list (the usual answer) must not re-run every gate and row
    if (tags.length === current.size && tags.every(tag => current.has(tag))) {
      return;
    }
    orientationTags.value = new Set(tags);
    try {
      localStorage.setItem(ORIENTATION_KEY, JSON.stringify(tags));
    } catch {
      // storage full or disabled — this visit still has the list
    }
  }

  /** Fetch which tag is in which category, for the tag page. Never throws;
   * `categoriesStatus` says how it went. */
  async function loadTagCategories(): Promise<void> {
    if (categoriesStatus.value === "loading") return;
    if (categoriesStatus.value === "ready") return;
    categoriesStatus.value = "loading";
    try {
      // the names are only an ordering, and rarely change (see
      // categoryNames); which tag is in which category comes from `/tags`
      const [list, names] = await Promise.all([
        tagDirectory(),
        categoryNames()
      ]);
      // as the API has them: the app shows its data, it doesn't amend it
      const byTag = new Map<string, string>();
      for (const tag of list) {
        if (tag.category) byTag.set(tag.tagId, tag.category);
      }
      const ordered = [...new Set([...names, ...byTag.values()])];
      tagCategories.value = byTag;
      categories.value = ordered;
      categoriesStatus.value = "ready";
    } catch {
      categoriesStatus.value = "error";
    }
  }

  async function load(): Promise<void> {
    if (status.value === "loading" || status.value === "ready") return;
    status.value = "loading";
    loadedBytes.value = 0;
    parsing.value = false;
    expectedBytes.value = rememberedSize();
    let drawn = 0;

    // Disk first. The guard above only dedupes within one tab, so without
    // this every new tab pays the full 9 MB download again — and the endpoint
    // answers conditional requests with a full 200, so the browser's own
    // cache cannot spare us either.
    const cached = await getCachedIndex(MAX_STALE_MS, () => {
      // the parse still freezes the main thread for a beat; say so
      loadedBytes.value = expectedBytes.value;
      parsing.value = true;
    });
    if (cached) {
      videos.value = Object.freeze(cached.videos);
      fetchedAt.value = Date.now() - cached.age;
      status.value = "ready";
      parsing.value = false;
      if (cached.age > FRESH_MS) void refresh();
      return;
    }
    parsing.value = false;

    // a fraction of the snapshot's wait, so it is in before the gate first runs
    void updateOrientationTags();
    try {
      videos.value = Object.freeze(
        await getIndex(({ received, expected, parsing: isParsing }) => {
          // our own server states the real size; better than any memory of it
          if (expected) expectedBytes.value = expected;
          // the parse tick always lands: it carries the final byte count
          if (!isParsing && received - drawn < PROGRESS_STEP) return;
          drawn = received;
          loadedBytes.value = received;
          parsing.value = isParsing;
        })
      );
      fetchedAt.value = Date.now();
      status.value = "ready";
      // only a completed load is worth remembering as the size
      if (loadedBytes.value > 0) rememberSize(loadedBytes.value);
    } catch {
      status.value = "error";
    } finally {
      parsing.value = false;
    }
  }

  /** Replace whatever is in memory with a current download, skipping the disk
   * copy entirely, and without disturbing what is on screen. Used both by the
   * automatic top-up behind a stale snapshot and by the manual button in
   * settings. Answers whether it worked: the automatic caller ignores that —
   * the catalog the user is browsing stays exactly as it was, so a silent
   * failure is the honest outcome — while the manual one has someone waiting
   * on a reply and says so.
   *
   * Refuses while a first load is still running: there is nothing to top up
   * yet, and a second 9 MB download alongside the first helps no one. */
  async function refresh(): Promise<boolean> {
    if (refreshing.value || status.value !== "ready") return false;
    refreshing.value = true;
    void updateOrientationTags(true);
    try {
      videos.value = Object.freeze(await getIndex());
      fetchedAt.value = Date.now();
      return true;
    } catch {
      // next load tries again; the stale snapshot remains serviceable
      return false;
    } finally {
      refreshing.value = false;
    }
  }

  async function retry(): Promise<void> {
    status.value = "idle";
    await load();
  }

  return {
    videos,
    status,
    loadedBytes,
    expectedBytes,
    parsing,
    refreshing,
    fetchedAt,
    orientationTags,
    tagCategories,
    categories,
    categoriesStatus,
    loadTagCategories,
    progress,
    visible,
    anyOrientation,
    gates,
    favorites,
    brokenArtwork,
    markArtworkBroken,
    load,
    refresh,
    retry
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCatalogStore, import.meta.hot));
}
