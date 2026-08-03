// The theme contract (v11 §12), in one place: persist the choice under
// "handy-theme", set BOTH the data-theme attribute on <html> (drives the
// CSS tokens) and Quasar's dark flag (drives q- components). State is
// module-scoped, so every consumer (shell, HThemeToggle, pages) shares the
// same `dark` ref. Call init() once per shell mount.
import { ref } from "vue";
import { useQuasar } from "quasar";

const STORAGE_KEY = "handy-theme";
const dark = ref(false);

export function useHandyTheme() {
  const $q = useQuasar();

  function apply(value: boolean) {
    dark.value = value;
    $q.dark.set(value);
    document.documentElement.setAttribute(
      "data-theme",
      value ? "dark" : "light"
    );
    localStorage.setItem(STORAGE_KEY, value ? "dark" : "light");
  }

  function toggle() {
    apply(!dark.value);
  }

  /** restore the persisted choice — call from the shell's onMounted */
  function init() {
    apply(localStorage.getItem(STORAGE_KEY) === "dark");
  }

  return { dark, apply, toggle, init };
}
