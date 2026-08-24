import type enUS from "../en-US/browse";

// The browse + search page (/videos): the toolbar above the grid, the
// active-filter chips, the advanced-filters modal, and one empty state per
// reason the grid can come back empty (a muted tag, the orientation gate,
// or plain over-filtering).
const browse: typeof enUS = {
  title: "Vidéos",

  toolbar: {
    searchPlaceholder: "Rechercher un titre",
    searchAria: "Rechercher des vidéos par titre",
    sortAria: "Trier les vidéos",
    // The flip button names the direction the list is *in*, then what a
    // click would do — four flat keys rather than a sentence assembled from
    // a direction word, which would strand the translator.
    dirDescAria: "Tri décroissant — inverser",
    dirAscAria: "Tri croissant — inverser",
    dirDescTitle: "Tri décroissant — cliquer pour inverser",
    dirAscTitle: "Tri croissant — cliquer pour inverser",
    filters: "Filtres",
    filtersCount: "Filtres ({count})",
    shareAria: "Partager ces résultats — le lien conserve tous les filtres"
  },

  // The sort dropdown. Keyed by SortKey so the option list can stay a
  // module constant holding keys instead of English.
  sort: {
    recent: "Ajoutées récemment",
    updated: "Mises à jour récemment",
    top: "Les mieux notées",
    plays: "Les plus jouées",
    views: "Les plus vues",
    longest: "Les plus longues",
    title: "A–Z"
  },

  chip: {
    // {label} is catalog data — a tag, a site name, a performer name
    removeAria: "Retirer le filtre : {label}",
    // stand-ins for a filtered id whose name isn't in the loaded catalog
    partnerFallback: "Partenaire",
    performerFallback: "Acteur"
  },

  filters: {
    title: "Filtres",
    addTag: "Ajouter un tag",
    noTags: "Aucun tag correspondant",
    site: "Site",
    noSites: "Aucun site correspondant",
    // one row of either picker: the tag or site name, then how many videos
    // picking it would leave on screen
    option: "{name} ({count})",
    vrLabel: "VR uniquement",
    vrCaption: "Uniquement les vidéos en réalité virtuelle",
    orientation: "Orientation",
    access: "Accès",
    premiumScriptsLabel: "Scripts premium",
    premiumScriptsCaption: "Inclure les scripts payants chez un partenaire",
    premiumVideosLabel: "Vidéos premium",
    premiumVideosCaption: "Inclure les vidéos payantes chez un partenaire",
    mutedLabel: "Tags en sourdine",
    mutedNone: "Rien en sourdine",
    // {tags} is a comma-joined list of the first few muted tags
    mutedMore: "{tags} +{rest} autres",
    duration: "Durée",
    durationAny: "Toutes durées",
    durationFrom: "{min}+ min",
    durationRange: "{min}–{max} min"
  },

  empty: {
    // A muted tag arriving via ?tag= empties the grid and no filter change
    // can fix it, so the one-tag case names the tag it is talking about.
    mutedOneTitle: "« {tag} » est en sourdine",
    mutedOneBody:
      "Les vidéos portant ce tag sont masquées partout. Réactivez-le pour voir ces résultats.",
    mutedOneAction: "Réactiver « {tag} »",
    mutedManyTitle: "Certains de ces tags sont en sourdine",
    mutedManyBody:
      "Les vidéos portant ces tags sont masquées partout. Réactivez-les pour voir ces résultats.",
    mutedManyAction: "Les réactiver",
    // {orientation} comes from common.orientation.* via useFormat()
    // "le filtre {orientation}" and never "en {orientation}": the value
    // arrives in its dictionary form and takes no article of its own
    orientationTitle: "Rien avec le filtre {orientation}",
    // one sentence, not a count phrase glued to a clause: the verb agrees
    // with the count in English and the word order differs in Norwegian
    orientationBody:
      "{count} vidéo correspond à tous vos autres critères, mais pas au filtre {orientation}. | {count} vidéos correspondent à tous vos autres critères, mais pas au filtre {orientation}.",
    orientationAction: "Afficher toutes les orientations",
    noneTitle: "Aucune vidéo ne correspond",
    noneBody:
      "Toutes les vidéos ont été filtrées. Élargissez la recherche ou retirez des filtres.",
    noneAction: "Effacer tous les filtres"
  },

  share: {
    // {count} arrives already localized and pluralized as "12 videos"
    // (useFormat().count), so this message only decides where it sits
    title: "IVDB — {count}",
    fallbackTitle: "Vidéos IVDB",
    copiedTitle: "Lien copié",
    copiedBody: "Il conserve tous les filtres que vous avez choisis.",
    failedTitle: "Impossible de copier le lien"
  }
};

export default browse;
