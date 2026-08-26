// The browse + search page (/videos): the toolbar above the grid, the
// active-filter chips, the advanced-filters modal, and one empty state per
// reason the grid can come back empty (a muted tag, the orientation gate,
// or plain over-filtering).
export default {
  title: "Videos",

  toolbar: {
    searchPlaceholder: "Search titles",
    searchAria: "Search videos by title",
    sortAria: "Sort videos",
    // The flip button names the direction the list is *in*, then what a
    // click would do — four flat keys rather than a sentence assembled from
    // a direction word, which would strand the translator.
    dirDescAria: "Sorted descending — reverse",
    dirAscAria: "Sorted ascending — reverse",
    dirDescTitle: "Sorted descending — click to reverse",
    dirAscTitle: "Sorted ascending — click to reverse",
    filters: "Filters",
    filtersCount: "Filters ({count})",
    shareAria: "Share these results — the link carries every filter"
  },

  // The sort dropdown. Keyed by SortKey so the option list can stay a
  // module constant holding keys instead of English.
  sort: {
    recent: "Recently added",
    updated: "Recently updated",
    top: "Top rated",
    plays: "Most played",
    views: "Most viewed",
    longest: "Longest",
    title: "A–Z"
  },

  chip: {
    // {label} is catalog data — a tag, a site name, a performer name
    removeAria: "Remove filter: {label}",
    // stand-ins for a filtered id whose name isn't in the loaded catalog
    partnerFallback: "Partner",
    performerFallback: "Performer"
  },

  filters: {
    title: "Filters",
    addTag: "Add tag",
    noTags: "No matching tags",
    site: "Site",
    noSites: "No matching sites",
    performer: "Performer",
    noPerformers: "No matching performers",
    // one row of any picker: the tag, site or performer name, then how
    // many videos picking it would leave on screen
    option: "{name} ({count})",
    vrLabel: "VR only",
    vrCaption: "Only virtual-reality videos",
    orientation: "Orientation",
    access: "Access",
    premiumScriptsLabel: "Premium scripts",
    premiumScriptsCaption: "Include scripts behind a partner's paywall",
    premiumVideosLabel: "Premium videos",
    premiumVideosCaption: "Include videos behind a partner's paywall",
    mutedLabel: "Muted tags",
    mutedNone: "Nothing muted",
    // {tags} is a comma-joined list of the first few muted tags
    mutedMore: "{tags} +{rest} more",
    duration: "Duration",
    durationAny: "Any",
    durationFrom: "{min}+ min",
    durationRange: "{min}–{max} min"
  },

  empty: {
    // A muted tag arriving via ?tag= empties the grid and no filter change
    // can fix it, so the one-tag case names the tag it is talking about.
    mutedOneTitle: "“{tag}” is muted",
    mutedOneBody:
      "Videos with this tag are hidden everywhere. Unmute it to see these results.",
    mutedOneAction: "Unmute “{tag}”",
    mutedManyTitle: "Some of these tags are muted",
    mutedManyBody:
      "Videos with these tags are hidden everywhere. Unmute them to see these results.",
    mutedManyAction: "Unmute them",
    // {orientation} comes from common.orientation.* via useFormat()
    orientationTitle: "Nothing here in {orientation}",
    // one sentence, not a count phrase glued to a clause: the verb agrees
    // with the count in English and the word order differs in Norwegian
    orientationBody:
      "{count} video here matches everything else you set, but not the {orientation} filter. | {count} videos here match everything else you set, but not the {orientation} filter.",
    orientationAction: "Show every orientation",
    noneTitle: "No videos match",
    noneBody:
      "Every video got filtered out. Loosen the search or remove some filters.",
    noneAction: "Clear all filters"
  },

  share: {
    // {count} arrives already localized and pluralized as "12 videos"
    // (useFormat().count), so this message only decides where it sits
    title: "IVDB — {count}",
    fallbackTitle: "IVDB videos",
    copiedTitle: "Link copied",
    copiedBody: "It carries every filter you set.",
    failedTitle: "Couldn't copy the link"
  }
};
