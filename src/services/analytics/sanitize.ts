// The last thing every event passes through before it leaves the browser.
//
// The URL carries the browse filters — search text, tags, orientation,
// performer names — and PostHog copies URLs into several properties of its
// own ($current_url, $session_entry_url, $initial_* and so on). Rather than
// list those properties, or list our query parameters, every string that is a
// URL anywhere in an event is cleaned: our own URLs lose their query string
// entirely, so a parameter added later cannot leak either, and anyone else's
// (the referrer) is cut to its origin.

type Json = unknown;

const MAX_DEPTH = 6;

/** The URL without any query string — the page's own (`?…`) and, under hash
 * routing, the route's (`#/videos?q=…`). Anything unparseable comes back
 * unchanged: it isn't a URL. */
export function stripQuery(url: string): string {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return url;
  }
  parsed.search = "";
  const routeQuery = parsed.hash.indexOf("?");
  if (routeQuery !== -1) parsed.hash = parsed.hash.slice(0, routeQuery);
  return parsed.toString();
}

/** The route path inside a hash-routed URL ("/videos/123"), or null. */
export function routePath(url: string): string | null {
  try {
    const hash = new URL(url).hash;
    if (!hash.startsWith("#/")) return null;
    const end = hash.indexOf("?");
    return end === -1 ? hash.slice(1) : hash.slice(1, end);
  } catch {
    return null;
  }
}

function cleanUrl(url: string, ownOrigin: string): string {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return url;
  }
  return parsed.origin === ownOrigin ? stripQuery(url) : parsed.origin;
}

function clean(value: Json, ownOrigin: string, depth: number): Json {
  if (typeof value === "string") {
    return /^https?:\/\//i.test(value) ? cleanUrl(value, ownOrigin) : value;
  }
  if (depth >= MAX_DEPTH || value === null || typeof value !== "object") {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map(entry => clean(entry, ownOrigin, depth + 1));
  }
  const out: Record<string, Json> = {};
  for (const [key, entry] of Object.entries(value)) {
    out[key] = clean(entry, ownOrigin, depth + 1);
  }
  return out;
}

interface EventLike {
  properties?: Record<string, Json>;
  $set?: Record<string, Json>;
  $set_once?: Record<string, Json>;
}

/**
 * Cleans an event in place of PostHog's own: every URL stripped, and
 * `$pathname` set to the route — under hash routing the browser's pathname
 * is always "/", which would file every page under one.
 */
export function sanitizeEvent<T extends EventLike>(
  event: T,
  ownOrigin: string
): T {
  const out = { ...event };
  if (event.properties) {
    const properties = clean(event.properties, ownOrigin, 0) as Record<
      string,
      Json
    >;
    const current = properties.$current_url;
    const route = typeof current === "string" ? routePath(current) : null;
    if (route) properties.$pathname = route;
    out.properties = properties;
  }
  if (event.$set) {
    out.$set = clean(event.$set, ownOrigin, 0) as Record<string, Json>;
  }
  if (event.$set_once) {
    out.$set_once = clean(event.$set_once, ownOrigin, 0) as Record<
      string,
      Json
    >;
  }
  return out;
}
