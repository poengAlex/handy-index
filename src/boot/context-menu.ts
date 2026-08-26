import { defineBoot } from "#q-app";

// A video card's quick menu is a right-click on desktop and a long press on
// touch (see useLongPress). Chrome on Android raises its *own* link/image
// menu on that same press, so both used to appear.
//
// Cancelling `contextmenu` on the card isn't enough. Our menu opens at the
// touch position and gets there first, so by the time the browser reaches its
// own the finger is over our list: the event fires there — outside the card,
// in a portal at the end of <body> — and a card-scoped preventDefault never
// sees it.
//
// So it's the gesture that's tracked, not the element. A press that STARTS on
// a video card owns the whole press, and whatever `contextmenu` it ends in is
// cancelled. Everything else keeps the browser's menu — including request
// tiles, which have no quick menu of their own and whose "open link in new
// tab" is worth keeping.
const CARD = ".video-card";
/** wherever the press ended up, if it opened a menu of ours */
const SUPPRESSED = `${CARD}, .q-menu`;

export default defineBoot(() => {
  /** the press in progress began on a video card */
  let onCard = false;

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
      onCard = (e.target as Element | null)?.closest?.(CARD) != null;
    },
    true
  );

  // the press is over and the browser never asked for a menu — disarm, so a
  // right-click elsewhere later keeps its own
  const disarm = () => {
    onCard = false;
  };
  listen("touchend", disarm, true);
  listen("touchcancel", disarm, true);

  listen(
    "contextmenu",
    e => {
      // the element check covers pointers that fire no touch events (mouse,
      // pen) and a menu that outlives the press that opened it
      if (onCard || (e.target as Element | null)?.closest?.(SUPPRESSED)) {
        e.preventDefault();
      }
    },
    false
  );
});
