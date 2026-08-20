import { acceptHMRUpdate, defineStore } from "pinia";
import { computed, ref, shallowRef } from "vue";
import { getIndex } from "@/services/script-index/client";
import {
  byIds,
  gateBreakdown,
  visibleVideos
} from "@/services/script-index/queries";
import type { PartnerVideo } from "@/services/script-index/types";
import { useSettingsStore } from "./settings";

export type CatalogStatus = "idle" | "loading" | "ready" | "error";

/** The index has no readable Content-Length (chunked gzip, and CORS exposes
 * no size header), so the denominator for a progress bar has to come from
 * somewhere else: whatever the last successful load decoded to. The seed is a
 * measured figure, so even a first visit gets a bar that tracks reality. */
const SIZE_KEY = "ivdb.index-bytes";
const SIZE_SEED = 43_000_000;

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
      script: settings.scriptFilter,
      video: settings.videoFilter,
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
      script: settings.scriptFilter,
      video: settings.videoFilter,
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
      script: settings.scriptFilter,
      video: settings.videoFilter,
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

  async function load(): Promise<void> {
    if (status.value === "loading" || status.value === "ready") return;
    status.value = "loading";
    loadedBytes.value = 0;
    parsing.value = false;
    expectedBytes.value = rememberedSize();
    let drawn = 0;
    try {
      videos.value = Object.freeze(
        await getIndex(({ received, parsing: isParsing }) => {
          // the parse tick always lands: it carries the final byte count
          if (!isParsing && received - drawn < PROGRESS_STEP) return;
          drawn = received;
          loadedBytes.value = received;
          parsing.value = isParsing;
        })
      );
      status.value = "ready";
      // only a completed load is worth remembering as the size
      if (loadedBytes.value > 0) rememberSize(loadedBytes.value);
    } catch {
      status.value = "error";
    } finally {
      parsing.value = false;
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
    progress,
    visible,
    anyOrientation,
    gates,
    favorites,
    brokenArtwork,
    markArtworkBroken,
    load,
    retry
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCatalogStore, import.meta.hot));
}
