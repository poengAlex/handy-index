// Disk cache for the index snapshot, on top of the Cache Storage API.
//
// The index is ~9 MB gzipped / ~40 MB decoded and the endpoint answers every
// conditional request with a full 200 — `If-None-Match` never earns a 304 —
// so HTTP revalidation costs the whole body again. The browser's own cache is
// no help either: the response carries a `set-cookie`, a malformed `Vary`
// (an empty field among the list), and a body big enough to fall foul of the
// per-entry disk-cache cap. Without this, every new tab re-downloads 9 MB.
//
// Cache Storage is the right home for a body this size: it is built for large
// responses, has none of the HTTP cache's heuristics, and hands the entry back
// as a Response we can read as text.

/** Bump when the stored shape stops being readable by this code. */
const CACHE_NAME = "ivdb-index-v1";

/** Synthetic key. Not the live endpoint URL: what we store is our own
 * timestamped copy, and pointing at the real URL would suggest this is the
 * HTTP response (it isn't — the stamp header is ours). */
const CACHE_KEY = "https://ivdb.cache/index-snapshot";

/** When the copy was written, in epoch ms. Cache Storage keeps no metadata of
 * its own, so the age has to ride along in a header we set. */
const STAMP_HEADER = "x-ivdb-cached-at";

export interface CachedIndex {
  /** the raw JSON, still unparsed — the caller decides when to pay for that */
  text: string;
  /** ms since this copy was downloaded */
  age: number;
}

/** Cache Storage is absent outside secure contexts (plain-http preview builds)
 * and in a few privacy modes. Every call here degrades to "no cache". */
function cacheStore(): Promise<Cache> | null {
  if (typeof caches === "undefined") return null;
  try {
    return caches.open(CACHE_NAME);
  } catch {
    return null;
  }
}

/** The stored snapshot, or null if there is none, it is older than `maxAge`,
 * or anything about it looks wrong. A too-old entry is dropped on the way out:
 * it will never be served again, and it is 40 MB. */
export async function readCachedIndex(
  maxAge: number
): Promise<CachedIndex | null> {
  const store = cacheStore();
  if (!store) return null;
  try {
    const cache = await store;
    const hit = await cache.match(CACHE_KEY);
    if (!hit) return null;

    const stamp = Number(hit.headers.get(STAMP_HEADER));
    const age = Date.now() - stamp;
    // NaN (no stamp), or a clock that moved backwards since the write, both
    // land here — an age we can't trust is the same as no entry
    if (!Number.isFinite(stamp) || age < 0 || age > maxAge) {
      await cache.delete(CACHE_KEY);
      return null;
    }

    const text = await hit.text();
    if (!text) {
      await cache.delete(CACHE_KEY);
      return null;
    }
    return { text, age };
  } catch {
    // quota eviction mid-read, storage disabled — fall back to the network
    return null;
  }
}

/** Store a freshly downloaded snapshot. Fire-and-forget: a write that fails
 * (quota, private mode) costs the next load a download, nothing more. */
export async function writeCachedIndex(text: string): Promise<void> {
  const store = cacheStore();
  if (!store) return;
  try {
    const cache = await store;
    await cache.put(
      CACHE_KEY,
      new Response(text, {
        headers: {
          "Content-Type": "application/json",
          [STAMP_HEADER]: String(Date.now())
        }
      })
    );
  } catch {
    // no recovery worth attempting — the in-memory copy is already good
  }
}

/** Drop the snapshot. Used when the stored text turns out not to parse. */
export async function dropCachedIndex(): Promise<void> {
  const store = cacheStore();
  if (!store) return;
  try {
    await (await store).delete(CACHE_KEY);
  } catch {
    // already gone, or storage is unavailable
  }
}
