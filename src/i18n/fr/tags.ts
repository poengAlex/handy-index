import type enUS from "../en-US/tags";

// The tag cloud at /tags: every tag in the visible catalog as a clickable
// pill, searchable and sortable, plus the long index-download wait it sits
// behind and the right-click menu that mutes a tag.
const tags: typeof enUS = {
  title: "Tags",
  errorTitle: "Impossible de charger les tags",

  // The cloud can't draw a pill until the whole ~40 MB index is in, so the
  // wait gets a phase, a percentage and a reason it's worth it.
  loading: {
    barLabel: "Chargement des tags",
    // Norwegian puts a space before the percent sign, so this is a message
    // rather than a bare "%" glued on in the template
    percent: "{percent} %",
    downloading: "Téléchargement de l'index des scripts",
    parsing: "Lecture de l'index",
    noteParsing: "Tout est là — tri par tags en cours.",
    note: "{received} sur ~{total} Mo décompressés — tout le catalogue, récupéré une seule fois, pour que chaque page suivante soit instantanée.",
    // the expected total is only last visit's size, so an index that grew
    // since gets a line that doesn't print "44 of ~41 MB"
    noteOversize:
      "{received} Mo décompressés — tout le catalogue, récupéré une seule fois."
  },

  controls: {
    searchPlaceholder: "Rechercher un tag",
    searchLabel: "Rechercher un tag",
    sortLabel: "Trier les tags",
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
    searchTitle: "Aucun tag ne correspond",
    searchBody: "Rien dans l'index ne correspond à « {query} ».",
    filteredBody:
      "Vos filtres et vos tags en sourdine masquent tous les tags de l'index. Assouplissez-les dans les paramètres.",
    filteredAction: "Tags en sourdine"
  },

  menu: {
    browse: "Parcourir ce tag",
    mute: "Mettre ce tag en sourdine"
  },

  toast: {
    refusedTitle: "« {tag} » ne peut pas être mis en sourdine",
    refusedBody:
      "Les tags d'orientation déterminent le catalogue que vous voyez — cela se change dans les paramètres.",
    mutedTitle: "« {tag} » mis en sourdine",
    mutedBody:
      "Il figure dans vos tags en sourdine — vous pouvez le réactiver à tout moment."
  }
};

export default tags;
