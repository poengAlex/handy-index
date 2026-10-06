// ============================================================
// Reading the host page.
//
// This component now lands in apps it was never written for, and three of
// its assumptions do not survive the trip:
//
//   1. Dark mode was detected with four hard-coded ancestor selectors. That
//      misses the most common signal of all — a host that only implements
//      @media (prefers-color-scheme: dark) — plus Tailwind's html.dark and
//      anything bespoke.
//   2. Because the pin was also a class, `theme="dark"` lost a specificity
//      tie to a `.section-light` ancestor. The prop was not a pin at all.
//   3. The haze veil fell back to #fff whatever the theme, so on a dark page
//      it painted a white sheet over everything.
//
// All three go away if the answer is computed in JS and written as an inline
// custom property on the component's own root: an inline custom property
// beats every selector, so nothing about the host's cascade is load-bearing.
// The CSS ancestor rules stay only as a first-paint hint for SSR.
// ============================================================

import { onBeforeUnmount, onMounted, ref, type Ref } from "vue";

export type ThemeChoice = "auto" | "light" | "dark";
export type Resolved = "light" | "dark";

function isDarkColor(css: string): boolean | null {
  const m = /rgba?\(([^)]+)\)/.exec(css);
  if (!m) return null;
  const parts = m[1]!.split(",").map(n => Number.parseFloat(n));
  const [r, g, b] = parts;
  const alpha = parts.length > 3 ? parts[3]! : 1;
  if (alpha < 0.5 || r === undefined || g === undefined || b === undefined) {
    return null;
  }
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255 < 0.5;
}

/**
 * What theme is this page, really? Asked in the order a host is most likely
 * to answer, and ending on the media query rather than on a guess.
 */
export function detectTheme(el: HTMLElement | null): Resolved {
  if (typeof document === "undefined") return "light";
  const html = document.documentElement;
  const body = document.body;

  for (const node of [html, body]) {
    const attr = node?.getAttribute("data-theme");
    if (attr === "dark" || attr === "light") return attr;
  }
  if (body?.classList.contains("body--dark")) return "dark"; // Quasar
  for (const c of ["dark", "theme-dark", "is-dark"]) {
    if (html?.classList.contains(c) || body?.classList.contains(c))
      return "dark";
  }
  // ask the page what colour it actually is
  let node: HTMLElement | null = el?.parentElement ?? null;
  while (node) {
    const dark = isDarkColor(getComputedStyle(node).backgroundColor);
    if (dark !== null) return dark ? "dark" : "light";
    node = node.parentElement;
  }
  if (typeof matchMedia !== "undefined") {
    return matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return "light";
}

/** The page colour behind the field, for the haze veil. */
export function detectSurface(el: HTMLElement | null): string | null {
  if (typeof document === "undefined") return null;
  let node: HTMLElement | null = el?.parentElement ?? null;
  while (node) {
    const bg = getComputedStyle(node).backgroundColor;
    const m = /rgba?\(([^)]+)\)/.exec(bg);
    if (m) {
      const parts = m[1]!.split(",").map(n => Number.parseFloat(n));
      if ((parts.length > 3 ? parts[3]! : 1) >= 0.99) return bg;
    }
    node = node.parentElement;
  }
  return null;
}

const FIXED_BREAKERS = [
  "transform",
  "perspective",
  "filter",
  "backdropFilter"
] as const;

/**
 * A `position: fixed` layer stops being fixed if any ancestor has a
 * transform, filter, perspective or paint containment. Stock Quasar does
 * exactly that: `<q-layout container>` puts `transform: translate3d(0,0,0)`
 * on its scroller, and QScrollArea sets `contain: strict`. We cannot fix the
 * host's CSS, but failing silently is the part that wastes an afternoon.
 */
export function findFixedBreaker(el: HTMLElement | null): string | null {
  if (typeof getComputedStyle === "undefined") return null;
  let node: HTMLElement | null = el?.parentElement ?? null;
  while (node && node !== document.documentElement) {
    const cs = getComputedStyle(node);
    for (const prop of FIXED_BREAKERS) {
      const v = cs[prop];
      if (v && v !== "none")
        return `${node.tagName.toLowerCase()}.${node.className || "?"} has ${prop}: ${v}`;
    }
    if (/paint|layout|strict|content/.test(cs.contain)) {
      return `${node.tagName.toLowerCase()}.${node.className || "?"} has contain: ${cs.contain}`;
    }
    node = node.parentElement;
  }
  return null;
}

/** Is the document root actually the thing that scrolls? */
/**
 * The nearest ancestor that scrolls INSTEAD of the document — a
 * `<q-layout container>` scroller, a scroll area, any `overflow-y: auto`
 * box that actually overflows. Null when the document is the scroller,
 * which is the normal case.
 *
 * This is the only host condition the scroll-driven attachments genuinely
 * cannot survive, and unlike "does the page scroll yet" it is structural:
 * it does not depend on how much content has arrived.
 */
export function scrollingAncestor(el: HTMLElement | null): HTMLElement | null {
  if (typeof getComputedStyle === "undefined") return null;
  let node: HTMLElement | null = el?.parentElement ?? null;
  while (node && node !== document.documentElement) {
    const cs = getComputedStyle(node);
    if (
      /auto|scroll/.test(cs.overflowY) &&
      node.scrollHeight > node.clientHeight + 1
    ) {
      return node;
    }
    node = node.parentElement;
  }
  return null;
}

export interface HostEnv {
  theme: Ref<Resolved>;
  surface: Ref<string | null>;
}

/**
 * Watch the host and keep the answers current — a theme toggle, a route
 * change, or the OS flipping to dark all have to be picked up.
 */
export function useHost(
  el: Ref<HTMLElement | null>,
  choice: Ref<ThemeChoice>
): HostEnv {
  const theme = ref<Resolved>("light");
  const surface = ref<string | null>(null);
  let observer: MutationObserver | null = null;
  let media: MediaQueryList | null = null;

  function resolve() {
    theme.value =
      choice.value === "auto" ? detectTheme(el.value) : choice.value;
    surface.value = detectSurface(el.value);
  }

  onMounted(() => {
    resolve();
    if (typeof MutationObserver !== "undefined") {
      observer = new MutationObserver(resolve);
      const opts = {
        attributes: true,
        attributeFilter: ["class", "data-theme", "style"]
      };
      observer.observe(document.documentElement, opts);
      if (document.body) observer.observe(document.body, opts);
    }
    if (typeof matchMedia !== "undefined") {
      media = matchMedia("(prefers-color-scheme: dark)");
      media.addEventListener("change", resolve);
    }
  });

  onBeforeUnmount(() => {
    observer?.disconnect();
    media?.removeEventListener("change", resolve);
  });

  return { theme, surface };
}
