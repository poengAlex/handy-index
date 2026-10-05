import { ref, watch, type Ref } from "vue";
import {
  ScriptIndexError,
  getPerformer,
  getPerformerRoster
} from "@/services/script-index/client";
import type { PerformerProfile } from "@/services/script-index/types";

/** Profiles already fetched this session, so going back to a performer's
 * page shows their profile at once. null = no profile anywhere, which is as
 * worth remembering as the profile itself. A failed request is not
 * remembered: the next visit asks again. */
const profiles = new Map<string, PerformerProfile | null>();

/** The whole list, by id — downloaded once, on the first 404, and shared by
 * every miss after it. Dropped if the download fails, so the next miss
 * retries instead of inheriting the failure. */
let roster: Promise<Map<string, PerformerProfile>> | undefined;

function loadRoster(): Promise<Map<string, PerformerProfile>> {
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
