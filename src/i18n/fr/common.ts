import type enUS from "../en-US/common";

// Vocabulary shared by more than one surface. Same admission rule as the
// component menu in ARCHITECTURE.md: a string is promoted here on its
// *second* consumer — a phrase used once belongs in its feature namespace,
// where a translator can see the context it is used in.
//
// Plural messages carry a `{count}` named param instead of vue-i18n's bare
// `{n}`, because the count has to be run through `$n()` first so 15000 reads
// "15,000" in English and "15 000" in Norwegian. Call them as
// `$t("common.count.videos", { count: $n(x) }, x)`.
const common: typeof enUS = {
  action: {
    backToHome: "Retour à l'accueil",
    browseVideos: "Parcourir les vidéos",
    cancel: "Annuler",
    clear: "Effacer",
    clearFilters: "Effacer les filtres",
    clearSearch: "Effacer la recherche",
    create: "Créer",
    delete: "Supprimer",
    done: "Terminé",
    import: "Importer",
    manage: "Gérer",
    rename: "Renommer",
    retry: "Réessayer",
    save: "Enregistrer",
    share: "Partager"
  },

  state: {
    catalogErrorTitle: "Impossible de charger le catalogue",
    catalogErrorBody:
      "L'index des scripts n'a pas répondu. Vérifie ta connexion, puis réessaie.",
    emptyTitle: "Rien à afficher"
  },

  // "12 of 340" — the shown/total pair every filtered listing prints. Both
  // sides arrive pre-formatted through `$n()`.
  ofTotal: {
    videos: "{shown} sur {total} vidéo | {shown} sur {total} vidéos",
    performers: "{shown} sur {total} acteur | {shown} sur {total} acteurs",
    tags: "{shown} sur {total} étiquette | {shown} sur {total} étiquettes"
  },

  count: {
    performers: "{count} acteur | {count} acteurs",
    playlists: "{count} liste de lecture | {count} listes de lecture",
    requests: "{count} demande | {count} demandes",
    sites: "{count} site | {count} sites",
    tags: "{count} étiquette | {count} étiquettes",
    videos: "{count} vidéo | {count} vidéos",
    votes: "{count} vote | {count} votes"
  },

  // Duration is assembled from parts rather than formatted in the service:
  // Norwegian abbreviates hours "t", not "h", and only the message layer
  // knows that. `durationParts()` in services/format.ts picks which key.
  duration: {
    hoursMinutes: "{hours} h {minutes} min",
    hours: "{hours} h",
    minutes: "{minutes} min",
    seconds: "{seconds} s"
  },

  justNow: "à l'instant",

  // Shared by the settings radio group, the browse filters and the header
  // switcher — the same "can't drift apart" reason ORIENTATION_LABELS gave
  // for living in queries.ts, which is where these strings came from.
  orientation: {
    straight: "Straight",
    gay: "Gay",
    trans: "Trans",
    all: "Everything"
  },

  language: {
    label: "Langue",
    caption: "Choisis la langue d'affichage du site",
    system: "Suivre le navigateur"
  }
};

export default common;
