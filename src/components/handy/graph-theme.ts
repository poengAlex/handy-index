// Canvas color resolution for HGraph. Reads the Handy design tokens off the
// host element when they exist, falls back to hand-picked defaults, and
// follows data-theme flips on <html> and, while no theme is stamped, the
// OS's own — so the kit drops into token-less projects unchanged.
//
// Reading from the HOST element (not :root) is what makes a graph inside a
// .section-dark island on a light page pick up that island's tokens.

import type { GraphTheme } from "./graph-types";

/** design.md 6.7 — hero Brand Blue, then Dark Charcoal → Slate Gray →
 * Divider Gray. The ramp is an emphasis ladder, not a set of equal hues:
 * one series is the point, the rest are context. */
const LIGHT_SERIES: GraphTheme["series"] = [
  "#0064e0",
  "#1c2b33",
  "#5d6c7b",
  "#dee3e9"
];

/** On dark, hierarchy comes from white opacity rather than new greys
 * (design.md 5.2.2); the hero stays Brand Blue Light. */
const DARK_SERIES: GraphTheme["series"] = [
  "#47a5fa",
  "rgba(255, 255, 255, 0.85)",
  "rgba(255, 255, 255, 0.55)",
  "rgba(255, 255, 255, 0.30)"
];

const FALLBACK_LIGHT: GraphTheme = {
  axis: "#5d6c7b",
  grid: "#dee3e9",
  text: "#5d6c7b",
  cursor: "#1c2b33",
  selection: "#0064e0",
  series: LIGHT_SERIES
};

const FALLBACK_DARK: GraphTheme = {
  axis: "rgba(255, 255, 255, 0.72)",
  grid: "rgba(255, 255, 255, 0.08)",
  text: "rgba(255, 255, 255, 0.72)",
  cursor: "#ffffff",
  selection: "#47a5fa",
  series: DARK_SERIES
};

const TOKEN_MAP = {
  axis: "--color-text-secondary",
  grid: "--color-stroke-subtle",
  text: "--color-text-secondary",
  // the surface's ink, as HPlayhead's beam is, so a chart and the strip under
  // it read as one instrument (owner ruling 2026-10-16; it was red)
  cursor: "--color-text-primary",
  selection: "--color-stroke-focus"
} as const;

/** Optional per-project overrides; absent in brand-ux today, so the ramp
 * comes from the fallbacks above. */
const SERIES_TOKENS = [
  "--color-chart-hero",
  "--color-chart-2",
  "--color-chart-3",
  "--color-chart-4"
] as const;

const OS_DARK = "(prefers-color-scheme: dark)";

/** Which fallback set applies — the host's own surface decides, so a graph in
 * a .section-dark island on a light page still gets the dark ramp. Without a
 * data-theme on <html> the OS decides, as it does for the tokens
 * (styles/_tokens.scss): a page that never stamps one still has dark tokens
 * on a dark OS, and the light ramp drew Dark Charcoal series on them. */
function isDarkContext(host: HTMLElement | null): boolean {
  if (host?.closest(".section-dark")) return true;
  if (host?.closest(".section-light")) return false;
  const root = document.documentElement;
  if (root.hasAttribute("data-theme")) {
    return root.getAttribute("data-theme") === "dark";
  }
  return typeof matchMedia !== "undefined" && matchMedia(OS_DARK).matches;
}

export function resolveGraphTheme(
  host: HTMLElement | null,
  override?: Partial<GraphTheme>
): GraphTheme {
  const base = isDarkContext(host) ? FALLBACK_DARK : FALLBACK_LIGHT;
  const out: GraphTheme = { ...base, series: [...base.series] };

  if (host) {
    const style = getComputedStyle(host);
    for (const key of Object.keys(TOKEN_MAP) as (keyof typeof TOKEN_MAP)[]) {
      const value = style.getPropertyValue(TOKEN_MAP[key]).trim();
      if (value) out[key] = value;
    }
    SERIES_TOKENS.forEach((token, i) => {
      const value = style.getPropertyValue(token).trim();
      if (value) out.series[i] = value;
    });
  }

  return { ...out, ...override };
}

/** Re-run `callback` whenever the document theme attribute flips, or the OS
 * theme does (which is the page's theme while no data-theme is stamped). */
export function watchGraphTheme(callback: () => void): () => void {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme", "class"]
  });
  const os = typeof matchMedia !== "undefined" ? matchMedia(OS_DARK) : null;
  os?.addEventListener("change", callback);
  return () => {
    observer.disconnect();
    os?.removeEventListener("change", callback);
  };
}
