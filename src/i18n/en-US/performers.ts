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
    // the profile properties with an order; they start low to high
    age: "Age",
    height: "Height",
    weight: "Weight",
    bmi: "Build",
    cup: "Cup size",
    // under the controls while a profile property is the sort
    unknownLast:
      "Performers whose profile doesn't say come last, whichever way round.",
    profilesError:
      "Sorting by this needs everyone's profile, and that didn't download. Check your connection and try again.",
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

  // the value a card shows while the list is sorted by a profile property;
  // all numbers arrive localized, heights and weights with every unit
  card: {
    age: "Age {age}",
    height: "{feet}′{inches}″",
    weight: "{lb} lb",
    cup: "Cup {cup}",
    // the play button on a card on touch devices; {name} is the performer's
    previewPlay: "Play preview: {name}",
    previewStop: "Stop preview: {name}"
  },

  errorTitle: "Couldn't load performers",
  hiddenBody:
    "Your premium filter and muted tags hide every performer. Loosen them in settings.",
  noMatchTitle: "No performers match",
  noMatchBody: "Nothing in the index matches “{query}”. Try a shorter name.",

  // The property filters: a dialog of toggle pills per facet (hair, eyes, …)
  // and a track each for age and height, plus one chip per facet in use on
  // the page. Every value is folded from the profiles' free text into a few
  // groups, so these name the groups, not anything a site wrote.
  filters: {
    title: "Filter performers",
    lead: "Most profiles list only some of these. A filter keeps only the performers whose profile says what you picked.",
    errorTitle: "Couldn't load profiles",
    errorBody:
      "The filters need everyone's profile, and that didn't download. Check your connection and try again.",
    noMatchBody:
      "No one in the index fits all of these filters. Remove some to see more.",
    // an active-filter chip on the page; {facet} is one of the facets below,
    // {value} its picks joined with "or" ("Blonde or Red") or an age or
    // height band as the track prints it
    chip: "{facet}: {value}",
    facets: {
      gender: "Gender",
      hair: "Hair",
      eyes: "Eyes",
      ethnicity: "Ethnicity",
      cup: "Cup size",
      // natural or enhanced breasts
      natural: "Breasts",
      tattoos: "Tattoos",
      piercings: "Piercings",
      age: "Age",
      height: "Height",
      bmi: "Build"
    },
    options: {
      gender: {
        woman: "Female",
        man: "Male",
        trans: "Trans",
        couple: "Couple",
        nonBinary: "Non-binary"
      },
      hair: {
        blonde: "Blonde",
        brunette: "Brunette",
        black: "Black",
        red: "Red",
        grey: "Grey",
        bald: "Bald",
        other: "Other"
      },
      eyes: {
        brown: "Brown",
        blue: "Blue",
        green: "Green",
        hazel: "Hazel",
        grey: "Grey",
        black: "Black",
        other: "Other"
      },
      ethnicity: {
        white: "White",
        latina: "Latina",
        asian: "Asian",
        black: "Black",
        indian: "Indian",
        middleEastern: "Middle Eastern",
        mixed: "Mixed",
        other: "Other"
      },
      // US cup letters, as the measurements give them
      cup: {
        a: "A",
        b: "B",
        c: "C",
        d: "D",
        ddPlus: "DD+"
      },
      natural: {
        natural: "Natural",
        enhanced: "Enhanced"
      }
    },
    // The age, height and build tracks. Their ends are open: a handle resting on
    // one means no limit that way. All numbers arrive localized; heights
    // come with every unit — {min} and {max} in cm, {minFeet} {minInches}
    // {maxFeet} {maxInches} — so each language prints its own system.
    ageAny: "Any age",
    ageFrom: "{min} and older",
    ageUpTo: "{max} and younger",
    ageRange: "{min}–{max}",
    heightAny: "Any height",
    heightFrom: "{minFeet}′{minInches}″ and taller",
    heightUpTo: "{maxFeet}′{maxInches}″ and shorter",
    heightRange: "{minFeet}′{minInches}″–{maxFeet}′{maxInches}″",
    // build: {min} and {max} arrive as the words below, never as numbers
    bmiAny: "Any build",
    bmiFrom: "{min} or fuller",
    bmiUpTo: "{max} or slimmer",
    bmiRange: "{min} to {max}",
    // the build words, slimmest first — the range reads in these, not in
    // numbers
    build: {
      slender: "slender",
      slim: "slim",
      medium: "medium",
      curvy: "curvy",
      full: "full-figured"
    }
  },

  // Under the profile panel: two slideshows, one item at a time — photos
  // of them, and their videos (a preview clip, or the video's stills where
  // it has none). Settings can switch both off.
  media: {
    photos: "Photos",
    reel: "Reel",
    // stand-in link text for a video with no title
    fromVideo: "Open the video",
    counter: "{index} / {total}",
    // what a screen reader calls the photo and clip players
    slideshow: "slideshow",
    previous: "Previous photo",
    next: "Next photo",
    previousVideo: "Previous video",
    nextVideo: "Next video",
    // the slideshows' pause/play button
    pause: "Pause",
    play: "Play"
  },

  // The ? on a performer's profile: a disclaimer that profile details are
  // scraped and unchecked, and a correction report the reader sends from
  // their own email app. `email` is that email's text, in the reader's
  // language; {link} is the page address.
  report: {
    helpAria: "About this profile — report a mistake",
    title: "About this profile",
    disclaimer:
      "Profile details come from the partner sites and other public sources. IVDB doesn't check them, so some may be wrong or out of date.",
    question: "Spotted a mistake? Tick what's wrong:",
    reason: {
      measurements: "Measurements, height or weight",
      age: "Age or birthday",
      details: "Another detail (hair, eyes, country…)",
      media: "The photos or videos aren't this performer",
      self: "I'm this performer and want something corrected or removed",
      other: "Something else"
    },
    detailsLabel: "What's wrong, and what should it say? (optional)",
    note: "This opens your email app with the report filled in, addressed to the IVDB team.",
    send: "Write email",
    email: {
      subject: "IVDB profile correction: {name}",
      intro: "I'd like to report a mistake on this performer profile.",
      nameLine: "Performer: {name}",
      idLine: "Performer ID: {id}",
      linkLine: "Page: {link}",
      reasonsLine: "What's wrong:",
      detailsLine: "Details:",
      profileLine: "What the profile says now:"
    }
  },

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
    // the two link cards: their own accounts, and their profile on each
    // partner site; {name} is the performer's, as the panel prints it
    socials: "Socials",
    moreOf: "More of {name}",
    // {site} is the partner site's domain — "pornhub.com"
    partnerLinkAria: "{site} profile — opens in a new tab",
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
