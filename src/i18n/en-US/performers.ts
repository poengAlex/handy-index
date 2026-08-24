// The performer directory (/performers): a grid of avatar cards with a name
// search, a sort control and endless scroll. Same page shape as `sites` — a
// header count line, a search box and two empty states — so the key names are
// kept parallel with that namespace on purpose.
export default {
  title: "Performers",

  search: {
    placeholder: "Search performers",
    aria: "Search performers by name"
  },

  sort: {
    aria: "Sort performers",
    count: "Most videos",
    rating: "Best rated",
    // an alphabet range, so it changes with the language
    name: "A–Z",
    // Four whole messages rather than one with a {direction} param: the
    // button says what the order *is* and what clicking does, and neither
    // language builds that sentence from the same pieces.
    descAria: "Sorted descending — reverse",
    ascAria: "Sorted ascending — reverse",
    descTitle: "Sorted descending — click to reverse",
    ascTitle: "Sorted ascending — click to reverse"
  },

  // the star chip on a card; Norwegian puts a space before the percent sign
  ratingBadge: "★ {rating}%",

  errorTitle: "Couldn't load performers",
  hiddenBody:
    "Your premium filter and muted tags hide every performer. Loosen them in settings.",
  noMatchTitle: "No performers match",
  noMatchBody: "Nothing in the index matches “{query}”. Try a shorter name."
};
