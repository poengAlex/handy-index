import { computed, ref, type Ref } from "vue";
import {
  alphabeticalRequests,
  byRequestPerformer,
  byRequestTags,
  longestRequests,
  mostVoted,
  newestRequests,
  requestPerformersOf,
  requestTagsOf,
  searchRequests,
  withoutVoted
} from "@/services/script-index/requests";
import type { VideoRequest } from "@/services/script-index/types";
import { useSettingsStore } from "@/stores/settings";

export type RequestSortKey = "votes" | "newest" | "longest" | "title";

/** The sort keys the picker offers, in the order it offers them. Keys only:
 * a module constant carrying display text is evaluated once at import and
 * would still be English after a language switch, so the labels are looked up
 * where the picker renders them. */
export const REQUEST_SORT_KEYS: readonly RequestSortKey[] = [
  "votes",
  "newest",
  "longest",
  "title"
];

const SORTERS: Record<
  RequestSortKey,
  (requests: readonly VideoRequest[]) => VideoRequest[]
> = {
  votes: mostVoted,
  newest: newestRequests,
  longest: longestRequests,
  title: alphabeticalRequests
};

/**
 * The board's filter/sort state and the composed result list — the same shape
 * the browse page gives the catalog, minus the URL plumbing: both request
 * surfaces are bound to your connection key, so there is no shared link to
 * reproduce and no reason to make every keystroke a router.replace.
 *
 * Sorting defaults to votes on both surfaces, which is the scripting order
 * the copy promises (the endpoint serves neither that nor any other order).
 */
export function useRequestFilters(source: Ref<readonly VideoRequest[]>) {
  const settings = useSettingsStore();

  const search = ref("");
  const sortKey = ref<RequestSortKey>("votes");
  const tags = ref<string[]>([]);
  const hideVoted = ref(false);
  // id is what filters; the name rides along so the chip and the picker have
  // something to print without a second pass over the board
  const performerId = ref("");
  const performerName = ref("");

  const allTags = computed(() => requestTagsOf(source.value));
  const allPerformers = computed(() => requestPerformersOf(source.value));

  const results = computed<VideoRequest[]>(() => {
    let pool = byRequestTags(source.value, tags.value);
    if (performerId.value) pool = byRequestPerformer(pool, performerId.value);
    if (hideVoted.value) pool = withoutVoted(pool, settings.requestUpvotes);
    pool = searchRequests(pool, search.value);
    return SORTERS[sortKey.value](pool);
  });

  /** how many filters are narrowing the list (sort never counts) */
  const activeCount = computed(
    () =>
      tags.value.length +
      (search.value.trim() ? 1 : 0) +
      (performerId.value ? 1 : 0) +
      (hideVoted.value ? 1 : 0)
  );

  function addTag(tag: string): void {
    if (!tag || tags.value.includes(tag)) return;
    tags.value = [...tags.value, tag];
  }

  function removeTag(tag: string): void {
    tags.value = tags.value.filter(entry => entry !== tag);
  }

  /** One performer at a time: unlike tags, an AND across two of them matches
   * only the rare request that lists both, so a second pick replaces the
   * first. Passing "" clears the filter. */
  function setPerformer(id: string): void {
    performerId.value = id;
    performerName.value = id
      ? (allPerformers.value.find(entry => entry.performerId === id)?.name ??
        "")
      : "";
  }

  function clear(): void {
    search.value = "";
    tags.value = [];
    hideVoted.value = false;
    setPerformer("");
  }

  return {
    search,
    sortKey,
    tags,
    hideVoted,
    performerId,
    performerName,
    allTags,
    allPerformers,
    results,
    activeCount,
    addTag,
    removeTag,
    setPerformer,
    clear
  };
}
