// Hover to preview, click to pin — what a help popup needs once it is taller
// than the room it has.
//
// A q-tooltip cannot be read past its own edge. Quasar renders tooltip content
// with `no-pointer-events`, while the position engine caps its height at the
// gap between the anchor and the edge of the window: a long tip therefore
// grows a scrollbar the mouse physically cannot touch, and would die on
// mouseleave even if it could. No amount of styling fixes that — the popup has
// to become a real element, which is q-menu.
//
// Unpinned, the menu is dressed to behave exactly like the tooltip it
// replaces. It carries Quasar's own `no-pointer-events` class, so it never
// swallows a click meant for whatever it covers, and `no-focus`, because
// q-menu blurs the active element as it shows — a preview that appears on
// hover would otherwise drop the caret out of the field the user is typing in.
// Clicking the ? turns both off and the popup wakes up: scrollable,
// selectable, and dismissed by Esc, a click outside, or the ? again.
//
// The one thing the caller must not forget is `.stop` on that click — a ? very
// often sits inside a row that is itself clickable (HToggleRow flips on any
// click), and pinning a tip must not flip the setting it explains.

import { nextTick, ref } from "vue";
import type { QMenu } from "quasar";

export function usePinnableTip() {
  const menuRef = ref<QMenu | null>(null);
  /**
   * The scrolling part of the sheet. The menu itself must not scroll: the
   * "click to pin" line is only worth printing on a sheet too tall to read,
   * which is exactly the sheet whose bottom nobody can see — so the body
   * scrolls inside a menu that doesn't, and the line sits below it as a
   * footer that stays put.
   */
  const bodyRef = ref<HTMLElement | null>(null);
  /** Showing at all — as a hover preview or pinned. */
  const open = ref(false);
  /** Pinned: interactive, and hover no longer closes it. */
  const pinned = ref(false);
  /** Taller than the room it was given, so it can only be read pinned. */
  const overflows = ref(false);

  function preview() {
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

    // q-menu only takes focus as part of showing, so a pin landing on a
    // preview that is already up has to ask for it — otherwise the keyboard
    // never reaches the thing we just made scrollable.
    if (open.value) void nextTick(() => menuRef.value?.focus());
    else open.value = true;
  }

  /** Menu dismissed by Esc, a click outside, or a route change. */
  function unpin() {
    pinned.value = false;
  }

  // Whether the content overflows is only knowable after the position engine
  // has capped its height, i.e. once it is on screen. `overflows` deliberately
  // survives the hide, so nothing flickers away mid-transition; the next show
  // measures again.
  function measure() {
    void nextTick(() => {
      const el = bodyRef.value;
      // a hair of slack: sub-pixel layout can put scrollHeight a fraction over
      overflows.value = el ? el.scrollHeight > el.clientHeight + 1 : false;
    });
  }

  return {
    menuRef,
    bodyRef,
    open,
    pinned,
    overflows,
    preview,
    endPreview,
    togglePin,
    unpin,
    measure
  };
}
