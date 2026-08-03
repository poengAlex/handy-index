import { defineBoot } from "#q-app";
import { IconSet } from "quasar";

// DESIGN.md §12 — Material Symbols Outlined is the canonical set, forced
// globally. Code uses plain icon names ("home", icon: "bluetooth"); this
// map function rewrites every resolved name to its sym_o_ variant, so an
// off-set icon can't slip in anywhere. It lives on the IconSet plugin at
// runtime (a function can't sit in the serializable quasar.config), and
// because Quasar's own internal icons (dropdown arrows, chip close, …)
// resolve through the same path, they restyle too.
const PLAIN_LIGATURE = /^[a-z0-9_]+$/;
const PREFIXED = /^(o_|r_|s_|sym_)/;

export default defineBoot(() => {
  IconSet.iconMapFn = (iconName: string) => {
    if (PLAIN_LIGATURE.test(iconName) && !PREFIXED.test(iconName)) {
      return { icon: `sym_o_${iconName}` };
    }
    // anything else (already prefixed, img:, svguse:, mdi-, svg paths) passes through
    return undefined;
  };
});
