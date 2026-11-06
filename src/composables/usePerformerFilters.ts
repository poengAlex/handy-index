import { computed, reactive, readonly, ref, shallowRef, type Ref } from "vue";
import { loadRoster } from "@/composables/usePerformerProfile";
import {
  TRAIT_FACET_KEYS,
  TRAIT_RANGE_KEYS,
  emptyTraitFilters,
  fullTrack,
  profileTraits,
  rangeActive,
  traitsMatch,
  type PerformerTraits,
  type RangeValue,
  type TraitFacet,
  type TraitRange
} from "@/services/script-index/performer-traits";
import type { PerformerSummary } from "@/services/script-index/queries";
import type { PerformerProfile } from "@/services/script-index/types";

/** Each roster's traits, worked out once: coming back to the directory
 * finds the same roster and the same map. */
const traitsOf = new WeakMap<
  Map<string, PerformerProfile>,
  Map<string, PerformerTraits>
>();

function traitsFor(
  list: Map<string, PerformerProfile>
): Map<string, PerformerTraits> {
  let traits = traitsOf.get(list);
  if (!traits) {
    const now = new Date();
    traits = new Map(
      [...list].map(([id, profile]) => [id, profileTraits(profile, now)])
    );
    traitsOf.set(list, traits);
  }
  return traits;
}

export type TraitsStatus = "idle" | "loading" | "ready" | "error";

/**
 * The directory's property filters — hair, eyes, cup size, age and the rest.
 * The catalog knows a performer's name and picture only; the properties are
 * in the profile list, about 3.6 MB, so it is fetched when the filters are
 * first opened (`load`) rather than with the page. Until then nothing is
 * filtered and `results` is the pool as given.
 *
 * Local state, like the page's search and sort: the directory keeps none of
 * its controls in the URL.
 */
export function usePerformerFilters(pool: Ref<readonly PerformerSummary[]>) {
  const status = ref<TraitsStatus>("idle");
  const traits = shallowRef<Map<string, PerformerTraits>>();
  const filters = reactive(emptyTraitFilters());

  async function load(): Promise<void> {
    if (status.value === "loading" || status.value === "ready") return;
    status.value = "loading";
    try {
      traits.value = traitsFor(await loadRoster());
      status.value = "ready";
    } catch {
      status.value = "error";
    }
  }

  /** the facets and bands narrowing the list, in the dialog's order */
  const activeFacets = computed(() =>
    TRAIT_FACET_KEYS.filter(facet => filters.codes[facet].length)
  );
  const activeRanges = computed(() =>
    TRAIT_RANGE_KEYS.filter(key => rangeActive(key, filters.ranges[key]))
  );

  const activeCount = computed(
    () => activeFacets.value.length + activeRanges.value.length
  );

  const results = computed<readonly PerformerSummary[]>(() => {
    const known = traits.value;
    if (!known || !activeCount.value) return pool.value;
    return pool.value.filter(performer =>
      traitsMatch(known.get(performer.performerId), filters)
    );
  });

  /** For each facet, how many performers each of its codes would leave,
   * given every other filter — so an option that would empty the grid can
   * say so before it is picked. Lazy: only worked out while the dialog
   * shows it. */
  const counts = computed(() => {
    const known = traits.value;
    const tally = Object.fromEntries(
      TRAIT_FACET_KEYS.map(facet => [facet, new Map<string, number>()])
    ) as Record<TraitFacet, Map<string, number>>;
    if (!known) return tally;
    for (const performer of pool.value) {
      const own = known.get(performer.performerId);
      if (!own) continue;
      for (const facet of TRAIT_FACET_KEYS) {
        const codes = own.codes[facet];
        if (!codes || !traitsMatch(own, filters, facet)) continue;
        for (const code of codes) {
          tally[facet].set(code, (tally[facet].get(code) ?? 0) + 1);
        }
      }
    }
    return tally;
  });

  function toggle(facet: TraitFacet, code: string): void {
    const picked = filters.codes[facet];
    filters.codes[facet] = picked.includes(code)
      ? picked.filter(entry => entry !== code)
      : [...picked, code];
  }

  function clearFacet(facet: TraitFacet): void {
    filters.codes[facet] = [];
  }

  function setRange(key: TraitRange, value: RangeValue): void {
    filters.ranges[key] = { min: value.min, max: value.max };
  }

  function clearRange(key: TraitRange): void {
    filters.ranges[key] = fullTrack(key);
  }

  function clear(): void {
    Object.assign(filters, emptyTraitFilters());
  }

  return {
    status,
    /** every profile's traits by performer id, once loaded */
    traits: readonly(traits),
    filters,
    activeFacets,
    activeRanges,
    activeCount,
    results,
    counts,
    load,
    toggle,
    clearFacet,
    setRange,
    clearRange,
    clear
  };
}
