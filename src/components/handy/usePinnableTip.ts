// Hover to preview, click to lock — what a help popup needs once it is taller
// than the room it has, and the only shape that survives a touch screen.
//
// A q-tooltip cannot be read past its own edge. Quasar renders tooltip content
// with `no-pointer-events`, while the position engine caps its height at the
// gap between the anchor and the edge of the window: a long tip therefore
// grows a scrollbar the mouse physically cannot touch, and would die on
// mouseleave even if it could. No amount of styling fixes that — the popup has
// to become a real element, which is q-menu.
//
// Unlocked, the menu is dressed to behave exactly like the tooltip it
// replaces. It carries Quasar's own `no-pointer-events` class, so it never
// swallows a click meant for whatever it covers, and `no-focus`, because
// q-menu blurs the active element as it shows — a preview that appears on
// hover would otherwise drop the caret out of the field the user is typing in.
// Clicking the ? turns both off and the popup wakes up: scrollable,
// selectable, and dismissed by Esc, a click outside, or the ? again.
//
// TOUCH. A phone has no hover, and the emulated one it fakes is worse than
// none: `mouseenter` fires on tap and `mouseleave` never fires at all, so a
// hover preview opens and then has nothing to close it. Hover is therefore
// gated on `pointerType === "mouse"` and a tap goes straight to locked, which
// is the state a touch user wanted anyway — the tip is scrollable from the
// first contact instead of the second. `coarse` records which kind of pointer
// asked, so the caller can say "tap outside" to a phone and "Esc or click
// outside" to a desktop rather than offering a key that isn't there.
//
// The one thing the caller must not forget is `.stop` on that click — a ? very
// often sits inside a row that is itself clickable (HToggleRow flips on any
// click), and locking a tip must not flip the setting it explains.

import { nextTick, ref } from "vue";
import type { QMenu } from "quasar";

export function usePinnableTip() {
  const menuRef = ref<QMenu | null>(null);
  /**
   * The scrolling part of the sheet. The menu itself must not scroll: the
   * locked-state line below it has to stay put, or the one line explaining how
   * to get out of a sheet too tall to read is the line scrolled off the
   * bottom of it.
   */
  const bodyRef = ref<HTMLElement | null>(null);
  /** Showing at all — as a hover preview or locked. */
  const open = ref(false);
  /** Locked: interactive, and hover no longer closes it. */
  const pinned = ref(false);
  /**
   * The last pointer to touch the ? could not hover — a finger or a pen.
   * Keyboard activation leaves it as it was, which defaults to false: the
   * copy that mentions Esc is the right copy for someone pressing Enter.
   */
  const coarse = ref(false);

  function notePointer(e: PointerEvent) {
    coarse.value = e.pointerType !== "mouse";
  }

  function preview(e: PointerEvent) {
    notePointer(e);
    // A finger's `pointerenter` is the front half of a tap, not a hover. Let
    // the click that follows lock it instead of flashing a preview first.
    if (coarse.value) return;
    if (!pinned.value) open.value = true;
  }

  function endPreview() {
    if (!pinned.value) open.value = false;
  }

  function togglePin() {
    if (pinned.value) {
      pinned.value = false;
      open.value = false;
      return;
    }

    pinned.value = true;

    // q-menu only takes focus as part of showing, so a lock landing on a
    // preview that is already up has to ask for it — otherwise the keyboard
    // never reaches the thing we just made scrollable.
    if (open.value) void nextTick(() => menuRef.value?.focus());
    else open.value = true;
  }

  /** Menu dismissed by Esc, a click outside, or a route change. */
  function unpin() {
    pinned.value = false;
  }

  return {
    menuRef,
    bodyRef,
    open,
    pinned,
    coarse,
    notePointer,
    preview,
    endPreview,
    togglePin,
    unpin
  };
}
