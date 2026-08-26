import type enUS from "../en-US/browse";

// The browse + search page (/videos): the toolbar above the grid, the
// active-filter chips, the advanced-filters modal, and one empty state per
// reason the grid can come back empty (a muted tag, the orientation gate,
// or plain over-filtering).
const browse: typeof enUS = {
  title: "Videos",

  toolbar: {
    searchPlaceholder: "Titel suchen",
    searchAria: "Videos nach Titel suchen",
    sortAria: "Videos sortieren",
    // The flip button names the direction the list is *in*, then what a
    // click would do — four flat keys rather than a sentence assembled from
    // a direction word, which would strand the translator.
    dirDescAria: "Absteigend sortiert — umkehren",
    dirAscAria: "Aufsteigend sortiert — umkehren",
    dirDescTitle: "Absteigend sortiert — zum Umkehren klicken",
    dirAscTitle: "Aufsteigend sortiert — zum Umkehren klicken",
    filters: "Filter",
    filtersCount: "Filter ({count})",
    shareAria: "Diese Ergebnisse teilen — der Link enthält alle Filter"
  },

  // The sort dropdown. Keyed by SortKey so the option list can stay a
  // module constant holding keys instead of English.
  sort: {
    recent: "Zuletzt hinzugefügt",
    updated: "Zuletzt aktualisiert",
    top: "Bestbewertet",
    plays: "Meistgespielt",
    views: "Meistgesehen",
    longest: "Längste",
    title: "A–Z"
  },

  chip: {
    // {label} is catalog data — a tag, a site name, a performer name
    removeAria: "Filter entfernen: {label}",
    // stand-ins for a filtered id whose name isn't in the loaded catalog
    partnerFallback: "Partner",
    performerFallback: "Darsteller"
  },

  filters: {
    title: "Filter",
    addTag: "Schlagwort hinzufügen",
    noTags: "Keine passenden Schlagwörter",
    site: "Website",
    noSites: "Keine passenden Websites",
    performer: "Darsteller",
    noPerformers: "Keine passenden Darsteller",
    // one row of any picker: the tag, site or performer name, then how
    // many videos picking it would leave on screen
    option: "{name} ({count})",
    vrLabel: "Nur VR",
    vrCaption: "Nur Virtual-Reality-Videos",
    orientation: "Orientierung",
    access: "Zugang",
    premiumScriptsLabel: "Premium-Scripts",
    premiumScriptsCaption:
      "Auch scripts hinter der Bezahlschranke eines Partners zeigen",
    premiumVideosLabel: "Premium-Videos",
    premiumVideosCaption:
      "Auch Videos hinter der Bezahlschranke eines Partners zeigen",
    mutedLabel: "Stummgeschaltete Schlagwörter",
    mutedNone: "Nichts stummgeschaltet",
    // {tags} is a comma-joined list of the first few muted tags
    mutedMore: "{tags} +{rest} weitere",
    duration: "Dauer",
    durationAny: "Beliebig",
    durationFrom: "{min}+ Min.",
    durationRange: "{min}–{max} Min."
  },

  empty: {
    // A muted tag arriving via ?tag= empties the grid and no filter change
    // can fix it, so the one-tag case names the tag it is talking about.
    mutedOneTitle: "„{tag}“ ist stummgeschaltet",
    mutedOneBody:
      "Videos mit diesem Schlagwort sind überall ausgeblendet. Hebe die Stummschaltung auf, um diese Ergebnisse zu sehen.",
    mutedOneAction: "Stummschaltung für „{tag}“ aufheben",
    mutedManyTitle: "Einige dieser Schlagwörter sind stummgeschaltet",
    mutedManyBody:
      "Videos mit diesen Schlagwörtern sind überall ausgeblendet. Hebe die Stummschaltung auf, um diese Ergebnisse zu sehen.",
    mutedManyAction: "Stummschaltungen aufheben",
    // {orientation} comes from common.orientation.* via useFormat(), where
    // it is pinned to English — so it lands here as a Latin-script data
    // value and is quoted as the label it is, rather than left bare
    orientationTitle: "Hier gibt es nichts für „{orientation}“",
    // one sentence, not a count phrase glued to a clause: the verb agrees
    // with the count in English and the word order differs in Norwegian.
    // The value cannot inflect, so it is hyphenated onto the noun the same
    // way gates.notice.*Orientation does it, and the case sits on "Filter".
    orientationBody:
      "{count} Video hier entspricht allen deinen anderen Einstellungen, nur nicht dem {orientation}-Filter. | {count} Videos hier entsprechen allen deinen anderen Einstellungen, nur nicht dem {orientation}-Filter.",
    orientationAction: "Alle Orientierungen zeigen",
    noneTitle: "Keine passenden Videos",
    noneBody:
      "Alle Videos wurden herausgefiltert. Lockere die Suche oder entferne ein paar Filter.",
    noneAction: "Alle Filter zurücksetzen"
  },

  share: {
    // {count} arrives already localized and pluralized as "12 videos"
    // (useFormat().count), so this message only decides where it sits
    title: "IVDB — {count}",
    fallbackTitle: "IVDB-Videos",
    copiedTitle: "Link kopiert",
    copiedBody: "Er enthält alle Filter, die du gesetzt hast.",
    failedTitle: "Link konnte nicht kopiert werden"
  }
};

export default browse;
