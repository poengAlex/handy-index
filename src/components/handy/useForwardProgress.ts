import { onMounted, ref, watch, type Ref } from "vue";

/**
 * Determinate progress runs forward only.
 *
 * Quasar animates its progress meters in BOTH directions — the ring's
 * `stroke-dashoffset`, the bar's `transform` — so a meter reset to zero
 * unwinds backwards for the length of the transition before it starts
 * again, which reads as "something just finished and is being undone":
 * the opposite of "starting". The same transition on the very first paint
 * sweeps the meter in from empty before the page has settled.
 *
 * Both Quasar progress components take an `instant-feedback` prop that
 * drops the transition for as long as it is true. This owns the timing of
 * that flag: true through the first paint, and true again for one painted
 * frame whenever the value drops.
 *
 * @param source getter for the value being displayed
 * @returns `instant` to bind to `instant-feedback`, and `flush()` to force
 *   the meter to the current value without animating (a reset that isn't a
 *   decrease, a jump to a freshly measured state).
 */
export function useForwardProgress(source: () => number): {
  instant: Ref<boolean>;
  flush: () => void;
} {
  // Quasar's transition is off while this is true. It starts true so the
  // first paint lands at its value.
  const instant = ref(true);

  onMounted(() => {
    instant.value = false;
  });

  /**
   * Restore the transition only after the browser has actually drawn a frame
   * without it.
   *
   * nextTick is not enough, and this is the whole trick: it runs before
   * paint, so the transition would be removed and put back inside a single
   * frame — the compositor never sees it go, and animates the drop anyway.
   * Two nested rAFs is the shortest wait that guarantees one composited
   * frame in between.
   */
  function restoreAfterPaint() {
    if (typeof requestAnimationFrame !== "function") {
      instant.value = false;
      return;
    }
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        instant.value = false;
      });
    });
  }

  function flush() {
    instant.value = true;
    restoreAfterPaint();
  }

  // `flush: "pre"` (the default) matters here — the watcher has to set the
  // flag BEFORE the component re-renders, or the render that carries the new
  // value still carries the transition with it.
  watch(source, (next, previous) => {
    if (next >= previous) return;
    flush();
  });

  return { instant, flush };
}
