/**
 * One preview plays at a time, anywhere in the app — the stage.
 *
 * Two things need coordinating across cards, and neither can be done from
 * inside one:
 *
 * 1. **Exclusivity.** A pointer can only hover one tile, but a touch preview
 *    keeps playing after you lift your finger, so without a single owner you
 *    would collect a screenful of playing videos as you scrolled.
 * 2. **The touch gesture.** A touchmove is delivered to the element the touch
 *    STARTED on, forever — drag from card A onto card B and B never hears a
 *    thing. So the stage hit-tests the finger and hands the gesture to
 *    whichever registered card is actually beneath it.
 *
 * Touch previews are sticky: taking your finger off doesn't stop the clip.
 * It ends when another card claims the stage, when you touch something that
 * isn't a card, or when it scrolls out of view.
 *
 * Listeners are passive and only attached while cards are registered — the
 * page must keep scrolling normally, since scrolling is how you use this.
 */

interface PreviewTarget {
  start: () => void;
  stop: () => void;
}

/** cards mount and unmount constantly (grids recycle, carousels scroll) */
const targets = new Map<Element, PreviewTarget>();

let current: Element | null = null;
let listening = false;
let rafId = 0;
let holdTimer = 0;
let watcher: IntersectionObserver | undefined;

// a tap navigates: a stationary touch waits this long before previewing, so
// tapping a card doesn't flash a frame on the way to its page
const TAP_GRACE_MS = 150;

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

function stopCurrent(): void {
  if (current) targets.get(current)?.stop();
}

// a sticky preview whose card has scrolled away is a video decoding for
// nobody — one observer, pointed at whoever holds the stage
function watch(el: Element): void {
  watcher ??= new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) targets.get(entry.target)?.stop();
    }
  });
  watcher.disconnect();
  watcher.observe(el);
}

// --- the touch gesture ---

function cardUnder(touch: Touch): Element | null {
  const el = document.elementFromPoint(touch.clientX, touch.clientY);
  return el?.closest("[data-preview]") ?? null;
}

/** hand the stage to the card under the finger — or clear it, if the finger
 * is on something else entirely */
function previewUnder(touch: Touch): void {
  const el = cardUnder(touch);
  if (el) targets.get(el)?.start();
  else stopCurrent();
}

function onTouchStart(event: TouchEvent): void {
  const touch = event.touches[0];
  if (!touch) return;
  window.clearTimeout(holdTimer);
  holdTimer = window.setTimeout(() => previewUnder(touch), TAP_GRACE_MS);
}

function onTouchMove(event: TouchEvent): void {
  const touch = event.touches[0];
  if (!touch || rafId) return;
  // the finger crosses many cards in a flick, and elementFromPoint forces
  // layout — once per frame is enough to track it
  rafId = requestAnimationFrame(() => {
    rafId = 0;
    // dragging IS the gesture, so no grace period once moving
    window.clearTimeout(holdTimer);
    previewUnder(touch);
  });
}

// deliberately no touchend handler: the preview outlives the touch

function listen(on: boolean): void {
  if (on === listening) return;
  listening = on;
  const method = on ? "addEventListener" : "removeEventListener";
  document[method]("touchstart", onTouchStart as EventListener, {
    passive: true
  });
  document[method]("touchmove", onTouchMove as EventListener, {
    passive: true
  });
}

// --- registration ---

export function registerPreview(el: Element, target: PreviewTarget): void {
  targets.set(el, target);
  listen(true);
}

export function unregisterPreview(el: Element): void {
  releasePreview(el);
  targets.delete(el);
  if (!targets.size) {
    listen(false);
    window.clearTimeout(holdTimer);
    cancelAnimationFrame(rafId);
    rafId = 0;
  }
}
