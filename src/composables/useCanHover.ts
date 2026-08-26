/**
 * Does this device have a pointer that can hover?
 *
 * The card affordances split on it: hovering previews and right-click opens
 * the quick menu where there is a pointer to do either with, and a visible
 * ⋮ button stands in where there isn't. One answer, shared, so the two can't
 * disagree — and a live one, because a tablet that gains a mouse changes it.
 */
import { readonly, ref } from "vue";

const query =
  typeof matchMedia === "undefined" ? null : matchMedia("(hover: hover)");

// no matchMedia at all is a build-time/SSR context, not a phone
const state = ref(query?.matches ?? true);

query?.addEventListener("change", e => {
  state.value = e.matches;
});

export const canHover = readonly(state);
