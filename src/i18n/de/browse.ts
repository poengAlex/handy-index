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
    addTag: "Tag hinzufügen",
    noTags: "Keine passenden Tags",
    site: "Website",
    noSites: "Keine passenden Websites",
    // one row of either picker: the tag or site name, then how many videos
    // picking it would leave on screen
    option: "{name} ({count})",
    vrLabel: "Nur VR",
    vrCaption: "Nur Virtual-Reality-Videos",
    orientation: "Orientierung",
    access: "Zugang",
    premiumScriptsLabel: "Premium-Skripte",
    premiumScriptsCaption:
      "Auch Skripte hinter der Bezahlschranke eines Partners zeigen",
    premiumVideosLabel: "Premium-Videos",
    premiumVideosCaption:
      "Auch Videos hinter der Bezahlschranke eines Partners zeigen",
    mutedLabel: "Stummgeschaltete Tags",
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
      "Videos mit diesem Tag sind überall ausgeblendet. Hebe die Stummschaltung auf, um diese Ergebnisse zu sehen.",
    mutedOneAction: "Stummschaltung für „{tag}“ aufheben",
    mutedManyTitle: "Einige dieser Tags sind stummgeschaltet",
    mutedManyBody:
      "Videos mit diesen Tags sind überall ausgeblendet. Hebe die Stummschaltung auf, um diese Ergebnisse zu sehen.",
    mutedManyAction: "Stummschaltungen aufheben",
    // {orientation} comes from common.orientation.* via useFormat()
    orientationTitle: "Hier gibt es nichts für {orientation}",
    // one sentence, not a count phrase glued to a clause: the verb agrees
    // with the count in English and the word order differs in Norwegian
    orientationBody:
      "{count} Video hier erfüllt alle deine anderen Einstellungen, nur nicht den Filter {orientation}. | {count} Videos hier erfüllen alle deine anderen Einstellungen, nur nicht den Filter {orientation}.",
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
