import type enUS from "../en-US/performers";

// The performer directory (/performers): a grid of avatar cards with a name
// search, a sort control and endless scroll. Same page shape as `sites` — a
// header count line, a search box and two empty states — so the key names are
// kept parallel with that namespace on purpose.
const performers: typeof enUS = {
  title: "Darsteller",

  search: {
    placeholder: "Darsteller suchen",
    aria: "Darsteller nach Namen suchen"
  },

  sort: {
    aria: "Darsteller sortieren",
    count: "Meiste Videos",
    rating: "Bestbewertet",
    // an alphabet range, so it changes with the language
    name: "A–Z",
    // Four whole messages rather than one with a {direction} param: the
    // button says what the order *is* and what clicking does, and neither
    // language builds that sentence from the same pieces.
    descAria: "Absteigend sortiert — umkehren",
    ascAria: "Aufsteigend sortiert — umkehren",
    descTitle: "Absteigend sortiert — zum Umkehren klicken",
    ascTitle: "Aufsteigend sortiert — zum Umkehren klicken"
  },

  // the star chip on a card; Norwegian puts a space before the percent sign
  // — so does German, and here it is a non-breaking one (U+00A0) so the chip
  // never wraps between the number and the sign
  ratingBadge: "★ {rating} %",

  errorTitle: "Darsteller konnten nicht geladen werden",
  hiddenBody:
    "Dein Premium-Filter und die stummgeschalteten Tags verbergen jeden Darsteller. Lockere sie in den Einstellungen.",
  noMatchTitle: "Keine passenden Darsteller",
  noMatchBody:
    "Nichts im Index passt zu „{query}“. Versuche es mit einem kürzeren Namen."
};

export default performers;
