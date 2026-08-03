// Glass-on-scroll (v11 §5): the sticky nav adopts glass once scrolled past
// the hero. `scrolled` flips at the threshold; the shell binds it to the
// .glass-light / .glass-dark classes. Listener is passive and cleaned up.
import { onMounted, onUnmounted, ref } from "vue";

export function useGlassOnScroll(threshold = 24) {
  const scrolled = ref(false);

  function onScroll() {
    scrolled.value = window.scrollY > threshold;
  }

  onMounted(() => {
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  });

  onUnmounted(() => {
    window.removeEventListener("scroll", onScroll);
  });

  return { scrolled };
}
