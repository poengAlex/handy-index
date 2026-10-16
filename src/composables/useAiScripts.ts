import { reactive, shallowRef } from "vue";
import {
  aiScriptFor,
  getAiScripts,
  indexAiScripts,
  type AiScript
} from "@/services/ai-scripts";
import type { VideoRequest } from "@/services/script-index/types";

/** the same cadence our server syncs at — loading more often than that only
 * re-reads the same copy */
const FRESH_MS = 15 * 60 * 1000;

// module-level: one list for the session, so leaving the board and coming
// back doesn't fetch it again
const index = shallowRef(indexAiScripts([]));
/** id → the `updated` of a version whose download answered 404. That version
 * stays hidden; a newer one, from a later sync, shows again. */
const gone = reactive(new Map<string, string>());
let loadedAt = 0;
let pending: Promise<void> | null = null;

/**
 * The AI scripts Handy's auto-scripter has made, matched to board requests.
 * Having none — or failing to load them — is a board without the download
 * buttons, not an error state: the board itself works either way.
 */
export function useAiScripts() {
  function load(): Promise<void> {
    if (pending) return pending;
    if (Date.now() - loadedAt < FRESH_MS) return Promise.resolve();
    pending = getAiScripts()
      .then(scripts => {
        index.value = indexAiScripts(scripts);
        loadedAt = Date.now();
      })
      .catch(() => {
        // keeps whatever an earlier load had; the next visit tries again
      })
      .finally(() => {
        pending = null;
      });
    return pending;
  }

  function forRequest(request: VideoRequest): AiScript | undefined {
    const script = aiScriptFor(index.value, request);
    return script && gone.get(script.id) !== script.updated
      ? script
      : undefined;
  }

  function markGone(script: AiScript): void {
    gone.set(script.id, script.updated);
  }

  return { load, forRequest, markGone };
}
