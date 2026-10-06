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
    // script plays summed over all their videos
    plays: "Most played",
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
  noMatchBody: "Nothing in the index matches “{query}”. Try a shorter name.",

  // The profile panel above a performer's videos (/videos?performerId=…).
  // Only the labels are ours: every value beside them is the profile's own
  // free text, scraped from a partner site and shown as written.
  profile: {
    // the small line over the name, saying whose page this is
    eyebrow: "Performer",
    // script plays summed over their videos; {count} is already localized
    plays: "{count} script play | {count} script plays",
    // one of their own links; {site} is a proper name — "Instagram", "X"
    linkAria: "{site} — opens in a new tab",
    about: "About",
    hobbies: "Hobbies",
    details: "Profile",
    // birthday and age are two rows, not "{date} (age {age})", so no message
    // has to inflect the word for years by the number (Russian has three)
    born: "Born",
    age: "Age",
    from: "From",
    career: "Career",
    // career years; {start} and {end} are plain years, never grouped
    careerSpan: "{start}–{end}",
    careerSince: "Since {start}",
    careerActive: "Active",
    careerInactive: "Inactive",
    height: "Height",
    weight: "Weight",
    // Height and weight arrive with every unit filled in — {cm} and {kg},
    // {feet}, {inches} and {lb} — so each language prints the system its
    // readers measure in. All whole numbers, already localized.
    heightValue: "{feet}′{inches}″ ({cm} cm)",
    weightValue: "{lb} lb ({kg} kg)",
    measurements: "Measurements",
    hair: "Hair",
    eyes: "Eyes",
    ethnicity: "Ethnicity",
    starSign: "Star sign",
    tattoos: "Tattoos",
    piercings: "Piercings",
    // tattoos and piercings
    yes: "Yes",
    no: "No"
  }
};
