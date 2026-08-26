import { defineBoot } from "#q-app";

// A card's quick menu is a right-click on desktop and a long press on touch
// (Quasar's own gesture, at 300ms). Chrome on Android raises its *own*
// link/image menu on that same press, so both used to appear.
//
// Cancelling `contextmenu` on the artwork isn't enough. The quick menu is
// anchored at the touch position and opens first, so by the time the browser
// gets to its menu the finger is over our list: the event fires there —
// outside the card, in a portal at the end of <body> — and a card-scoped
// preventDefault never sees it.
//
// So it's the gesture that's tracked, not the element. A press that STARTS on
// tile artwork owns the whole press, and whatever `contextmenu` it ends in is
// cancelled. Presses anywhere else keep the browser's menu: long-press a card
// title to select it, right-click a link as usual.
const ARTWORK = ".tile-card__media";
/** wherever the press ended up, if it opened a menu of ours */
const SUPPRESSED = `${ARTWORK}, .q-menu`;

export default defineBoot(() => {
  /** the press in progress began on a tile's artwork */
  let onArtwork = false;

  const listen = (
    type: string,
    handler: (e: Event) => void,
    passive: boolean
  ) => {
    document.addEventListener(type, handler, { capture: true, passive });
  };

  listen(
    "touchstart",
    e => {
      onArtwork = (e.target as Element | null)?.closest?.(ARTWORK) != null;
    },
    true
  );

  // the press is over and the browser never asked for a menu — disarm, so a
  // right-click elsewhere later keeps its own
  const disarm = () => {
    onArtwork = false;
  };
  listen("touchend", disarm, true);
  listen("touchcancel", disarm, true);

  listen(
    "contextmenu",
    e => {
      // the element check covers pointers that fire no touch events (mouse,
      // pen) and a menu that outlives the press that opened it
      if (onArtwork || (e.target as Element | null)?.closest?.(SUPPRESSED)) {
        e.preventDefault();
      }
    },
    false
  );
});
