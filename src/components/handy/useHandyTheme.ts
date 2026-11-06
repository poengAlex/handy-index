// The theme contract (design.md 9.2), in one place: persist the choice under
// "handy-theme", set BOTH the data-theme attribute on <html> (drives the
// CSS tokens) and Quasar's dark flag (drives q- components). Until the user
// picks a side, the OS preference decides — and keeps deciding, so the app
// follows a system light/dark switch live. State is module-scoped, so every
// consumer (shell, HThemeToggle, pages) shares the same `dark` ref. Call
// init() once per shell mount.
import { ref } from "vue";
import { useQuasar } from "quasar";

const STORAGE_KEY = "handy-theme";
const dark = ref(false);

const systemQuery = () =>
  typeof matchMedia !== "undefined"
    ? matchMedia("(prefers-color-scheme: dark)")
    : null;

// Module-scoped so the OS listener is attached once, not once per shell that
// calls init() — this repo alone calls it from four page shells.
let following = false;

export function useHandyTheme() {
  const $q = useQuasar();

  /**
   * Paint a theme WITHOUT claiming it as the user's choice.
   *
   * The split from apply() is the whole point: the old init() wrote storage on
   * first paint, which permanently opted a user who had never touched the
   * toggle out of ever following their OS again.
   */
  function set(value: boolean) {
    // The switch is instant (design.md 9.2). Every token flips at once, and
    // the 180ms colour transitions on buttons, segments and fields would
    // otherwise cross-fade each label from one theme's ink to the other's, so
    // transitions are off until a frame with the new theme has been painted
    // (two frames: one is not guaranteed to reach the screen).
    const root = document.documentElement;
    root.classList.add("h-theme-switching");
    dark.value = value;
    $q.dark.set(value);
    root.setAttribute("data-theme", value ? "dark" : "light");
    requestAnimationFrame(() =>
      requestAnimationFrame(() => root.classList.remove("h-theme-switching"))
    );
  }

  /** paint a theme AND record it as the user's explicit choice */
  function apply(value: boolean) {
    set(value);
    localStorage.setItem(STORAGE_KEY, value ? "dark" : "light");
  }

  function toggle() {
    apply(!dark.value);
  }

  /** forget the stored choice and go back to following the browser */
  function followSystem() {
    localStorage.removeItem(STORAGE_KEY);
    set(systemQuery()?.matches ?? false);
  }

  /** restore the persisted choice, or follow the OS — from the shell's onMounted */
  function init() {
    const stored = localStorage.getItem(STORAGE_KEY);
    const query = systemQuery();

    if (stored === "dark" || stored === "light") {
      set(stored === "dark");
    } else {
      set(query?.matches ?? false);
    }

    // Track the OS for as long as no explicit choice is stored; the first
    // apply() ends the tracking by writing the key.
    if (query && !following) {
      following = true;
      query.addEventListener("change", event => {
        if (localStorage.getItem(STORAGE_KEY) === null) set(event.matches);
      });
    }
  }

  return { dark, apply, toggle, followSystem, init };
}
