import type enUS from "../en-US/playlists";

// The three playlist surfaces: the overview page, one playlist's own page
// (rename, delete, share/export, bulk script download) and the "add to
// playlist" dialog on a video.
//
// Playlist names are the user's own words — they are interpolated as {name}
// and never translated. Counts of playlists and videos come from
// `useFormat().count()`, so they are not repeated here.
const playlists: typeof enUS = {
  title: "Listes de lecture",

  // the create row on the overview page and inside the add dialog
  newLabel: "Nouvelle liste de lecture",
  newPlaceholder: "ex. Sélection du week-end",
  nameLabel: "Nom de la liste de lecture",
  importHint: "Importe une liste de lecture exportée depuis ce site",

  emptyTitle: "Aucune liste de lecture pour l'instant",
  emptyBody:
    "Crées-en une ici, ou utilise le bouton de liste de lecture sur une page vidéo pour en démarrer une à partir d'une vidéo qui te plaît.",

  import: {
    title: "Importer une liste de lecture",
    placeholder:
      "Colle une liste de lecture exportée (JSON) ou un lien pastes.dev",
    inputAria: "Texte d'une liste de lecture exportée ou lien de partage",
    chooseFile: "Choisir un fichier…",
    // The name an export gets when the file carried none. It becomes the
    // playlist's name, so write a name, not a sentence.
    defaultName: "Liste de lecture importée",
    doneTitle: "Liste de lecture importée",
    doneBody: "« {name} » — {count} vidéo. | « {name} » — {count} vidéos.",
    failedTitle: "Impossible d'importer",
    // One key per `PlaylistImportFailure` in services/playlist-transfer.ts,
    // plus `unknown` for a throw from somewhere else entirely.
    error: {
      unreachable: "Impossible de joindre le service de partage.",
      linkDead: "Ce lien de partage ne répond pas — il a peut-être expiré.",
      notJson: "Ce fichier n'est pas du JSON valide.",
      notExport: "Ce fichier n'est pas une liste de lecture exportée.",
      tooNew:
        "Ce fichier a été exporté par une version plus récente de ce site. Recharge la page et réessaie.",
      malformed: "La liste de lecture de ce fichier est mal formée.",
      unknown: "La lecture du fichier exporté a échoué."
    }
  },

  // one playlist's page
  detail: {
    notFoundTitle: "Liste de lecture introuvable",
    notFoundBody:
      "Cette liste de lecture n'existe plus, ou le lien est erroné.",
    notFoundAction: "Toutes les listes de lecture",
    emptyTitle: "Rien ici pour l'instant",
    emptyBody:
      "Utilise le bouton de liste de lecture sur une page vidéo pour y ajouter des vidéos.",
    // toggles the grid into remove-a-video mode; "Done" turns it back off
    edit: "Modifier",
    removeVideo: "Retirer de la liste de lecture",
    renameTitle: "Renommer la liste de lecture",
    deleteTitle: "Supprimer « {name} » ?",
    deleteBody:
      "Les vidéos restent dans le catalogue — seule la liste de lecture disparaît.",
    deleteConfirm: "Supprimer la liste de lecture",
    deletedTitle: "Liste de lecture supprimée",
    deletedBody: "« {name} » a disparu."
  },

  // share dialog: the export as JSON text, as a file, or as a paste link
  share: {
    title: "Partager la liste de lecture",
    open: "Partager la liste de lecture",
    openHint: "Partager ou exporter cette liste de lecture",
    exportAria: "JSON de la liste de lecture exportée",
    linkAria: "Lien de partage",
    copyLink: "Copier le lien de partage",
    note: "Toute personne disposant du lien peut importer cette liste de lecture. Le partage est temporaire — il expire au bout de 90 jours environ.",
    copyJson: "Copier le JSON",
    saveFile: "Enregistrer le fichier",
    createLink: "Créer un lien de partage",
    newLink: "Nouveau lien de partage",
    jsonCopied: "JSON copié",
    jsonCopyFailed: "Impossible de copier le JSON",
    linkCopied: "Lien de partage copié",
    linkCopiedBody:
      "Toute personne disposant du lien peut importer cette liste de lecture.",
    linkCopyFailed: "Impossible de copier le lien",
    linkCreated: "Lien de partage créé",
    linkFailedTitle: "Impossible de créer un lien de partage",
    linkFailedBody:
      "Le service de partage n'a pas répondu. Copie le JSON à la place."
  },

  // downloading every free script in the playlist, one after another
  bulk: {
    label: "Obtenir tous les scripts ({count})",
    progress: "Téléchargement {done}/{total}…",
    keyPrompt:
      "Les scripts sont liés à ton Handy. Saisis la connection key de l'application Handy pour continuer.",
    // the explanation under this title is the shared one from
    // `services.scriptDownload.*` — same failure, same words as everywhere else
    failedTitle: "Impossible d'obtenir les scripts",
    doneTitle: "Scripts téléchargés",
    doneBody: "{count} script enregistré. | {count} scripts enregistrés.",
    // both counts in one sentence: the split between them is not the same
    // shape in every language.
    // Both params are bare numbers, so French puts the label first: a past
    // participle after the number would have to agree with it, and this
    // message has no plural branches to agree in.
    partialBody: "Enregistrés : {saved} — échecs : {failed}."
  },

  // the dialog a video page opens to file that video
  add: {
    title: "Ajouter à une liste de lecture",
    empty:
      "Aucune liste de lecture pour l'instant — crée la première ci-dessous."
  }
};

export default playlists;
