// The shared q-scroll-area skin [DESIGN.md 5.6 Text card] — every in-card
// scroll region uses Quasar's scroll area with this slim token-coloured
// thumb on an invisible track, never a native browser bar punching through
// a radius. Pass to q-scroll-area's thumb-style/bar-style (vertical) or
// horizontal-thumb-style/horizontal-bar-style.
// (Typed as Partial<CSSStyleDeclaration> — that's q-scroll-area's prop type;
// Vue's CSSProperties doesn't satisfy it under exactOptionalPropertyTypes.)

export const H_SCROLL_THUMB_STYLE: Partial<CSSStyleDeclaration> = {
  width: "4px",
  borderRadius: "2px",
  background: "var(--color-stroke-default)",
  opacity: "0.65"
};

export const H_SCROLL_BAR_STYLE: Partial<CSSStyleDeclaration> = {
  width: "4px",
  background: "transparent"
};

export const H_SCROLL_THUMB_STYLE_HORIZONTAL: Partial<CSSStyleDeclaration> = {
  height: "4px",
  borderRadius: "2px",
  background: "var(--color-stroke-default)",
  opacity: "0.65"
};

export const H_SCROLL_BAR_STYLE_HORIZONTAL: Partial<CSSStyleDeclaration> = {
  height: "4px",
  background: "transparent"
};
