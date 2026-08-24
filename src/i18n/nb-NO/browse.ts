import type enUS from "../en-US/browse";

const browse: typeof enUS = {
  title: "Videoer",

  toolbar: {
    searchPlaceholder: "Søk i titler",
    searchAria: "Søk i videoer etter tittel",
    sortAria: "Sorter videoer",
    dirDescAria: "Sortert synkende — snu",
    dirAscAria: "Sortert stigende — snu",
    dirDescTitle: "Sortert synkende — klikk for å snu",
    dirAscTitle: "Sortert stigende — klikk for å snu",
    filters: "Filtre",
    filtersCount: "Filtre ({count})",
    shareAria: "Del disse resultatene — lenken tar med seg alle filtrene"
  },

  sort: {
    recent: "Nylig lagt til",
    updated: "Nylig oppdatert",
    top: "Best vurdert",
    plays: "Mest spilt",
    views: "Mest sett",
    longest: "Lengst",
    // the Norwegian alphabet ends at Å, so the A–Z shorthand does too
    title: "A–Å"
  },

  chip: {
    removeAria: "Fjern filter: {label}",
    partnerFallback: "Nettsted",
    performerFallback: "Skuespiller"
  },

  filters: {
    title: "Filtre",
    addTag: "Legg til tagg",
    noTags: "Ingen tagger traff søket",
    site: "Nettsted",
    noSites: "Ingen nettsteder traff søket",
    option: "{name} ({count})",
    vrLabel: "Kun VR",
    vrCaption: "Bare videoer i virtuell virkelighet",
    orientation: "Orientering",
    access: "Tilgang",
    premiumScriptsLabel: "Premium-scripts",
    premiumScriptsCaption: "Ta med scripts bak en partners betalingsmur",
    premiumVideosLabel: "Premiumvideoer",
    premiumVideosCaption:
      "Ta med videoer som ligger bak en partners betalingsmur",
    mutedLabel: "Dempede tagger",
    mutedNone: "Ingenting dempet",
    mutedMore: "{tags} +{rest} til",
    duration: "Varighet",
    // the slider's "no limit" readout: a bare "Alle" would read as a count,
    // so the Norwegian names what there is no limit on
    durationAny: "Alle lengder",
    durationFrom: "{min}+ min",
    durationRange: "{min}–{max} min"
  },

  empty: {
    mutedOneTitle: "«{tag}» er dempet",
    mutedOneBody:
      "Videoer med denne taggen er skjult overalt. Fjern dempingen for å se disse resultatene.",
    mutedOneAction: "Fjern dempingen av «{tag}»",
    mutedManyTitle: "Noen av disse taggene er dempet",
    mutedManyBody:
      "Videoer med disse taggene er skjult overalt. Fjern dempingen for å se disse resultatene.",
    mutedManyAction: "Fjern dempingen",
    // {orientation} is a fixed English option name, so the title names it as
    // the category it is ("under Straight") and the body compounds it with a
    // hyphen, leaving the Norwegian ending on "filteret".
    orientationTitle: "Ingenting å vise under {orientation}",
    orientationBody:
      "{count} video passer med alt annet du har valgt, men ikke med {orientation}-filteret. | {count} videoer passer med alt annet du har valgt, men ikke med {orientation}-filteret.",
    orientationAction: "Vis alle orienteringer",
    noneTitle: "Ingen treff blant videoene",
    noneBody:
      "Alle videoene ble filtrert bort. Prøv et bredere søk eller fjern noen filtre.",
    noneAction: "Nullstill alle filtre"
  },

  share: {
    title: "IVDB — {count}",
    fallbackTitle: "IVDB-videoer",
    copiedTitle: "Lenken er kopiert",
    copiedBody: "Den tar med seg alle filtrene du har valgt.",
    failedTitle: "Klarte ikke å kopiere lenken"
  }
};

export default browse;
