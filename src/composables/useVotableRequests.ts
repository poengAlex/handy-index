import { computed, ref } from "vue";
import {
  getVotableRequests,
  isAuthError
} from "@/services/script-index/client";
import type { VideoRequest } from "@/services/script-index/types";
import { useSettingsStore } from "@/stores/settings";

const PAGE_SIZE = 100;
// backstop against a runaway loop — the live board is ~1.1k, so this covers it
// with headroom; if it's ever hit, `capped` says the list is partial
const MAX_REQUESTS = 2000;

export type RequestsState = "idle" | "loading" | "ready" | "error" | "rejected";

/**
 * The whole votable set, in one load. Both request surfaces need every row in
 * memory rather than a page at a time: the endpoint can only take/skip, so
 * filtering, sorting and ranking all have to happen here — and a control that
 * searched only the pages you had scrolled past would be lying.
 */
export function useVotableRequests() {
  const settings = useSettingsStore();

  const requests = ref<VideoRequest[]>([]);
  const state = ref<RequestsState>("idle");
  /** the fetch loop hit MAX_REQUESTS — everything derived covers only what
   * we got */
  const capped = ref(false);

  const hasKey = computed(() => settings.connectionKey.trim().length > 0);

  async function load(): Promise<void> {
    const key = settings.connectionKey.trim();
    if (!key || state.value === "loading") return;
    state.value = "loading";
    try {
      const all: VideoRequest[] = [];
      let sawShortPage = false;
      for (let skip = 0; skip < MAX_REQUESTS; skip += PAGE_SIZE) {
        const page = await getVotableRequests(key, PAGE_SIZE, skip);
        all.push(...page);
        if (page.length < PAGE_SIZE) {
          sawShortPage = true;
          break;
        }
      }
      requests.value = all;
      capped.value = !sawShortPage;
      state.value = "ready";
    } catch (error) {
      state.value = isAuthError(error) ? "rejected" : "error";
    }
  }

  /** after the key dialog saves — a board that already loaded stays put */
  function loadUnlessReady(): void {
    if (state.value !== "ready") void load();
  }

  return { requests, state, capped, hasKey, load, loadUnlessReady };
}
