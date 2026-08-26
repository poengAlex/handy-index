/**
 * Hold a finger on something → open its menu.
 *
 * Not Quasar's `context-menu` gesture, which a phone doesn't survive: it
 * cancels on the FIRST touchmove with no tolerance at all, and iOS reports
 * one for a fingerprint's worth of drift, so the press rarely reaches
 * Quasar's 300ms. It also hangs its listeners on the element the touch
 * started on — which a card is free to swap out mid-press (a preview cycling
 * stills mounts a fresh <img> each time), and a touch target that leaves the
 * DOM is a touchcancel.
 *
 * So: real slop, and handlers the caller binds wherever the gesture belongs —
 * for a tile that is the whole card, not the artwork inside it.
 */
import { onBeforeUnmount } from "vue";

/** what reads as "held it" without eating the start of a scroll — and a beat
 * before Chrome's own long-press menu, which we then have to suppress */
const HOLD_MS = 400;
/** a resting finger drifts a few pixels; a scrolling one leaves for good */
const SLOP_PX = 10;

export function useLongPress(onHold: (evt: TouchEvent) => void) {
  let timer = 0;
  /** the press became a hold — the finger is on an open menu now */
  let held = false;
  let startX = 0;
  let startY = 0;

  function abort() {
    window.clearTimeout(timer);
    timer = 0;
    held = false;
  }

  function start(evt: TouchEvent) {
    abort();
    const touch = evt.touches[0];
    // a second finger is a pinch or a two-hand scroll, never a press
    if (!touch || evt.touches.length > 1) return;
    startX = touch.clientX;
    startY = touch.clientY;
    timer = window.setTimeout(() => {
      timer = 0;
      held = true;
      // the original event: its touch coordinates are the press, and that is
      // what anchors the menu
      onHold(evt);
    }, HOLD_MS);
  }

  function move(evt: TouchEvent) {
    const touch = evt.touches[0];
    if (!timer || !touch) return;
    if (
      Math.abs(touch.clientX - startX) > SLOP_PX ||
      Math.abs(touch.clientY - startY) > SLOP_PX
    ) {
      abort();
    }
  }

  function end(evt: TouchEvent) {
    // The press opened a menu under the finger, so lifting it must not also
    // click through — onto a menu item, or onto the link the card itself is.
    // Cancelling the touch sequence is what suppresses the compatibility
    // click; taps that never became a hold are left completely alone.
    if (held) evt.preventDefault();
    abort();
  }

  onBeforeUnmount(abort);

  return { start, move, end, abort };
}
