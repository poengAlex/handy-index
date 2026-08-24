import type enUS from "../en-US/playlists";

// The three playlist surfaces: the overview page, one playlist's own page
// (rename, delete, share/export, bulk script download) and the "add to
// playlist" dialog on a video.
//
// Playlist names are the user's own words — they are interpolated as {name}
// and never translated. Counts of playlists and videos come from
// `useFormat().count()`, so they are not repeated here.
const playlists: typeof enUS = {
  title: "Playlists",

  // the create row on the overview page and inside the add dialog
  newLabel: "Nouvelle playlist",
  newPlaceholder: "ex. Sélection du week-end",
  nameLabel: "Nom de la playlist",
  importHint: "Importez une playlist exportée depuis ce site",

  emptyTitle: "Aucune playlist pour l'instant",
  emptyBody:
    "Créez-en une ici, ou utilisez le bouton playlist sur une page vidéo pour en démarrer une à partir d'une vidéo qui vous plaît.",

  import: {
    title: "Importer une playlist",
    placeholder: "Collez un export de playlist (JSON) ou un lien pastes.dev",
    inputAria: "Texte d'export de playlist ou lien de partage",
    chooseFile: "Choisir un fichier…",
    // The name an export gets when the file carried none. It becomes the
    // playlist's name, so write a name, not a sentence.
    defaultName: "Playlist importée",
    doneTitle: "Playlist importée",
    doneBody: "« {name} » — {count} vidéo. | « {name} » — {count} vidéos.",
    failedTitle: "Impossible d'importer",
    // One key per `PlaylistImportFailure` in services/playlist-transfer.ts,
    // plus `unknown` for a throw from somewhere else entirely.
    error: {
      unreachable: "Impossible de joindre le service de partage.",
      linkDead: "Ce lien de partage ne répond pas — il a peut-être expiré.",
      notJson: "Ce fichier n'est pas du JSON valide.",
      notExport: "Ce fichier n'est pas un export de playlist.",
      tooNew:
        "Ce fichier a été exporté par une version plus récente de ce site. Rechargez la page et réessayez.",
      malformed: "La playlist de ce fichier est mal formée.",
      unknown: "La lecture de l'export a échoué."
    }
  },

  // one playlist's page
  detail: {
    notFoundTitle: "Playlist introuvable",
    notFoundBody: "Cette playlist n'existe plus, ou le lien est erroné.",
    notFoundAction: "Toutes les playlists",
    emptyTitle: "Rien ici pour l'instant",
    emptyBody:
      "Utilisez le bouton playlist sur une page vidéo pour y ajouter des vidéos.",
    // toggles the grid into remove-a-video mode; "Done" turns it back off
    edit: "Modifier",
    removeVideo: "Retirer de la playlist",
    renameTitle: "Renommer la playlist",
    deleteTitle: "Supprimer « {name} » ?",
    deleteBody:
      "Les vidéos restent dans le catalogue — seule la playlist disparaît.",
    deleteConfirm: "Supprimer la playlist",
    deletedTitle: "Playlist supprimée",
    deletedBody: "« {name} » a disparu."
  },

  // share dialog: the export as JSON text, as a file, or as a paste link
  share: {
    title: "Partager la playlist",
    open: "Partager la playlist",
    openHint: "Partager ou exporter cette playlist",
    exportAria: "JSON d'export de la playlist",
    linkAria: "Lien de partage",
    copyLink: "Copier le lien de partage",
    note: "Toute personne disposant du lien peut importer cette playlist. Le partage est temporaire — il expire au bout de 90 jours environ.",
    copyJson: "Copier le JSON",
    saveFile: "Enregistrer le fichier",
    createLink: "Créer un lien de partage",
    newLink: "Nouveau lien de partage",
    jsonCopied: "JSON copié",
    jsonCopyFailed: "Impossible de copier le JSON",
    linkCopied: "Lien de partage copié",
    linkCopiedBody:
      "Toute personne disposant du lien peut importer cette playlist.",
    linkCopyFailed: "Impossible de copier le lien",
    linkCreated: "Lien de partage créé",
    linkFailedTitle: "Impossible de créer un lien de partage",
    linkFailedBody:
      "Le service de partage n'a pas répondu. Copiez le JSON à la place."
  },

  // downloading every free script in the playlist, one after another
  bulk: {
    label: "Obtenir tous les scripts ({count})",
    progress: "Téléchargement {done}/{total}…",
    keyPrompt:
      "Les scripts sont liés à votre Handy. Saisissez la clé de connexion de l'application Handy pour continuer.",
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
    title: "Ajouter à une playlist",
    empty: "Aucune playlist pour l'instant — créez la première ci-dessous."
  }
};

export default playlists;
