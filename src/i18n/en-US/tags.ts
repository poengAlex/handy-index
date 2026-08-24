// The tag cloud at /tags: every tag in the visible catalog as a clickable
// pill, searchable and sortable, plus the long index-download wait it sits
// behind and the right-click menu that mutes a tag.
export default {
  title: "Tags",
  errorTitle: "Couldn't load tags",

  // The cloud can't draw a pill until the whole ~40 MB index is in, so the
  // wait gets a phase, a percentage and a reason it's worth it.
  loading: {
    barLabel: "Loading tags",
    // Norwegian puts a space before the percent sign, so this is a message
    // rather than a bare "%" glued on in the template
    percent: "{percent}%",
    downloading: "Downloading the script index",
    parsing: "Reading the index",
    noteParsing: "All in — sorting it into tags now.",
    note: "{received} of ~{total} MB unpacked — the whole catalog, fetched once, so every page after this is instant.",
    // the expected total is only last visit's size, so an index that grew
    // since gets a line that doesn't print "44 of ~41 MB"
    noteOversize: "{received} MB unpacked — the whole catalog, fetched once."
  },

  controls: {
    searchPlaceholder: "Search tags",
    searchLabel: "Search tags",
    sortLabel: "Sort tags",
    sortByCount: "Most videos",
    // the alphabet's first and last letter — Norwegian ends at Å
    sortByName: "A–Z",
    sortedDescLabel: "Sorted descending — reverse",
    sortedAscLabel: "Sorted ascending — reverse",
    sortedDescTitle: "Sorted descending — click to reverse",
    sortedAscTitle: "Sorted ascending — click to reverse",
    muted: "Muted",
    mutedCount: "Muted ({count})"
  },

  empty: {
    searchTitle: "No tags match",
    searchBody: "Nothing in the index matches “{query}”.",
    filteredBody:
      "Your filters and muted tags hide every tag in the index. Loosen them in settings.",
    filteredAction: "Muted tags"
  },

  menu: {
    browse: "Browse this tag",
    mute: "Mute this tag"
  },

  toast: {
    refusedTitle: "“{tag}” can't be muted",
    refusedBody:
      "Orientation tags decide which catalog you see — change that in settings.",
    mutedTitle: "Muted “{tag}”",
    mutedBody: "It's in your muted list — unmute any time."
  }
};
