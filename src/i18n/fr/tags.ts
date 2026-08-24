import type enUS from "../en-US/tags";

// The tag cloud at /tags: every tag in the visible catalog as a clickable
// pill, searchable and sortable, plus the long index-download wait it sits
// behind and the right-click menu that mutes a tag.
const tags: typeof enUS = {
  title: "Étiquettes",
  errorTitle: "Impossible de charger les étiquettes",

  // The cloud can't draw a pill until the whole ~40 MB index is in, so the
  // wait gets a phase, a percentage and a reason it's worth it.
  loading: {
    barLabel: "Chargement des étiquettes",
    // Norwegian puts a space before the percent sign, so this is a message
    // rather than a bare "%" glued on in the template
    percent: "{percent} %",
    downloading: "Téléchargement de l'index des scripts",
    parsing: "Lecture de l'index",
    noteParsing: "Tout est là — tri par étiquettes en cours.",
    note: "{received} sur ~{total} Mo décompressés — tout le catalogue, récupéré une seule fois, pour que chaque page suivante soit instantanée.",
    // the expected total is only last visit's size, so an index that grew
    // since gets a line that doesn't print "44 of ~41 MB"
    noteOversize:
      "{received} Mo décompressés — tout le catalogue, récupéré une seule fois."
  },

  controls: {
    searchPlaceholder: "Rechercher une étiquette",
    searchLabel: "Rechercher une étiquette",
    sortLabel: "Trier les étiquettes",
    sortByCount: "Le plus de vidéos",
    // the alphabet's first and last letter — Norwegian ends at Å
    sortByName: "A–Z",
    sortedDescLabel: "Tri décroissant — inverser",
    sortedAscLabel: "Tri croissant — inverser",
    sortedDescTitle: "Tri décroissant — cliquer pour inverser",
    sortedAscTitle: "Tri croissant — cliquer pour inverser",
    muted: "En sourdine",
    mutedCount: "En sourdine ({count})"
  },

  empty: {
    searchTitle: "Aucune étiquette ne correspond",
    searchBody: "Rien dans l'index ne correspond à « {query} ».",
    filteredBody:
      "Tes filtres et tes étiquettes en sourdine masquent toutes les étiquettes de l'index. Assouplis-les dans les paramètres.",
    filteredAction: "Étiquettes en sourdine"
  },

  menu: {
    browse: "Parcourir cette étiquette",
    mute: "Mettre cette étiquette en sourdine"
  },

  toast: {
    refusedTitle: "L'étiquette « {tag} » ne peut pas être mise en sourdine",
    refusedBody:
      "Les étiquettes d'orientation déterminent le catalogue que tu vois — cela se change dans les paramètres.",
    mutedTitle: "Étiquette « {tag} » mise en sourdine",
    mutedBody:
      "Elle figure dans tes étiquettes en sourdine — tu peux la réactiver à tout moment."
  }
};

export default tags;
