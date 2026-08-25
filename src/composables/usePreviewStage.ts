/**
 * One preview plays at a time, anywhere in the app — the stage.
 *
 * A pointer can only hover one tile, but nothing guarantees the tile it left
 * heard about it (a card can unmount mid-preview, and a route change takes
 * the whole grid with it). So previews announce themselves here and whatever
 * held the stage is stopped, which is also what keeps a preview that has
 * scrolled out of view from decoding for nobody.
 *
 * Previews are a POINTER affordance only. There was a touch gesture here
 * that hit-tested the finger on every touchmove and handed the stage to
 * whichever card was under it — see the note in MediaPreview.vue for why it
 * had to go.
 */

interface PreviewTarget {
  start: () => void;
  stop: () => void;
}

/** cards mount and unmount constantly (grids recycle, carousels scroll) */
const targets = new Map<Element, PreviewTarget>();

let current: Element | null = null;
let watcher: IntersectionObserver | undefined;

// --- the stage itself ---

/** A preview announcing it has started. Whatever held the stage is stopped. */
export function claimPreview(el: Element): void {
  if (current === el) return;
  const previous = current;
  // set first: the stop() below re-enters through releasePreview, and this is
  // what makes that call a no-op instead of clearing the new owner
  current = el;
  if (previous) targets.get(previous)?.stop();
  watch(el);
}

/** A preview announcing it has stopped on its own (pointer left, unmounted). */
export function releasePreview(el: Element): void {
  if (current !== el) return;
  current = null;
  watcher?.disconnect();
}

// a preview whose card has scrolled away is a video decoding for nobody —
// one observer, pointed at whoever holds the stage
function watch(el: Element): void {
  watcher ??= new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) targets.get(entry.target)?.stop();
    }
  });
  watcher.disconnect();
  watcher.observe(el);
}

// --- registration ---

export function registerPreview(el: Element, target: PreviewTarget): void {
  targets.set(el, target);
}

export function unregisterPreview(el: Element): void {
  releasePreview(el);
  targets.delete(el);
}
