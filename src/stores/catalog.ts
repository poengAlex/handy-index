import { acceptHMRUpdate, defineStore } from "pinia";
import { computed, ref, shallowRef } from "vue";
import { getIndex } from "@/services/script-index/client";
import { byIds, visibleVideos } from "@/services/script-index/queries";
import type { PartnerVideo } from "@/services/script-index/types";
import { useSettingsStore } from "./settings";

export type CatalogStatus = "idle" | "loading" | "ready" | "error";

/**
 * Holds the one-shot index snapshot. The array is kept in a shallowRef so its
 * ~15k items stay out of Vue's deep reactivity; treat entries as immutable.
 */
export const useCatalogStore = defineStore("catalog", () => {
  const videos = shallowRef<readonly PartnerVideo[]>([]);
  const status = ref<CatalogStatus>("idle");

  /** Catalog with the user's orientation + premium + muted-tag gate applied.
   * Every discovery surface derives from this, so the gate lives here only. */
  const visible = computed(() => {
    const settings = useSettingsStore();
    return visibleVideos(videos.value, {
      orientation: settings.orientation,
      premium: settings.showPremium,
      mutedTags: settings.mutedSet
    });
  });

  /** Same gate minus orientation. The performer and site directories list who
   * exists in the index, not who matches your preference — dropping them would
   * read as missing data — and picking one of them from that list is an
   * explicit choice that outranks the ambient filter. Premium + mutes still
   * apply, so this is never a way around them. */
  const anyOrientation = computed(() => {
    const settings = useSettingsStore();
    return visibleVideos(videos.value, {
      orientation: "all",
      premium: settings.showPremium,
      mutedTags: settings.mutedSet
    });
  });

  /** The user's favorited videos — never gated, favorites always show. */
  const favorites = computed(() => {
    const settings = useSettingsStore();
    return byIds(videos.value, settings.favorites);
  });

  async function load(): Promise<void> {
    if (status.value === "loading" || status.value === "ready") return;
    status.value = "loading";
    try {
      videos.value = Object.freeze(await getIndex());
      status.value = "ready";
    } catch {
      status.value = "error";
    }
  }

  async function retry(): Promise<void> {
    status.value = "idle";
    await load();
  }

  return { videos, status, visible, anyOrientation, favorites, load, retry };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCatalogStore, import.meta.hot));
}
