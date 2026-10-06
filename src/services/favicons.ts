// The site icons bundled under public/favicons — one per partner site and
// per site performers commonly link to (scripts/fetch-favicons.py). Bundled
// rather than loaded from each site: a third of the partners name their icon
// only in their page's HTML, and a favicon service would learn which links
// every visitor looks at.
import bundled from "./favicons.json";

const HOSTS = new Set<string>(bundled);

/** Short-link and alternate domains that are the same site as one with an
 * icon. */
const ALIASES: Record<string, string> = {
  "fans.ly": "fansly.com",
  "a.co": "amazon.com",
  "amzn.to": "amazon.com"
};

/**
 * The bundled icon for the site a URL points to, or undefined. A subdomain
 * without one of its own takes its parent's (m.youtube.com, de.xhamster.com).
 * Relative, like index.html's own icons: the app is served from the root
 * and routes by hash.
 */
export function faviconFor(url: string | undefined): string | undefined {
  let host: string;
  try {
    host = new URL(url ?? "").hostname;
  } catch {
    return undefined;
  }
  return faviconForHost(host);
}

/** The same, from a bare domain — a partner's name is one ("pornhub.com"). */
export function faviconForHost(host: string): string | undefined {
  const bare = host
    .trim()
    .toLowerCase()
    .replace(/^www\./, "");
  for (let name = bare; name.includes(".");) {
    const known = ALIASES[name] ?? name;
    if (HOSTS.has(known)) return `favicons/${known}.png`;
    name = name.slice(name.indexOf(".") + 1);
  }
  return undefined;
}
