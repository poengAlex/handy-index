// The theme contract (v11 §12), in one place: persist the choice under
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
  typeof window.matchMedia === "function"
    ? window.matchMedia("(prefers-color-scheme: dark)")
    : null;

/** true once the OS listener is attached — module-scoped, so only once */
let following = false;

export function useHandyTheme() {
  const $q = useQuasar();

  /** paint a theme without claiming it as the user's choice */
  function set(value: boolean) {
    dark.value = value;
    $q.dark.set(value);
    document.documentElement.setAttribute(
      "data-theme",
      value ? "dark" : "light"
    );
  }

  function apply(value: boolean) {
    set(value);
    localStorage.setItem(STORAGE_KEY, value ? "dark" : "light");
  }

  function toggle() {
    apply(!dark.value);
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

    // Track the OS for as long as no explicit choice is stored; apply() wins
    // from the moment the user toggles.
    if (query && !following) {
      following = true;
      query.addEventListener("change", (event) => {
        if (localStorage.getItem(STORAGE_KEY) === null) set(event.matches);
      });
    }
  }

  return { dark, apply, toggle, init };
}
