import type enUS from "../en-US/playlists";

// The three playlist surfaces: the overview page, one playlist's own page
// (rename, delete, share/export, bulk script download) and the "add to
// playlist" dialog on a video.
//
// Playlist names are the user's own words — they are interpolated as {name}
// and never translated. Counts of playlists and videos come from
// `useFormat().count()`, so they are not repeated here.
const playlists: typeof enUS = {
  title: "Wiedergabelisten",

  // the create row on the overview page and inside the add dialog
  newLabel: "Neue Wiedergabeliste",
  newPlaceholder: "z. B. Wochenend-Auswahl",
  nameLabel: "Name der Wiedergabeliste",
  importHint: "Eine von dieser Seite exportierte Wiedergabeliste importieren",

  emptyTitle: "Noch keine Wiedergabelisten",
  emptyBody:
    "Leg gleich hier eine an — oder starte über den Wiedergabelisten-Button auf einer Videoseite eine Liste mit einem Video, das dir gefällt.",

  import: {
    title: "Wiedergabeliste importieren",
    placeholder:
      "Export einer Wiedergabeliste (JSON) oder pastes.dev-Link einfügen",
    inputAria: "Exporttext oder Teilen-Link einer Wiedergabeliste",
    chooseFile: "Datei wählen…",
    // The name an export gets when the file carried none. It becomes the
    // playlist's name, so write a name, not a sentence.
    defaultName: "Importierte Wiedergabeliste",
    doneTitle: "Wiedergabeliste importiert",
    doneBody: "„{name}“ — {count} Video. | „{name}“ — {count} Videos.",
    failedTitle: "Import fehlgeschlagen",
    // One key per `PlaylistImportFailure` in services/playlist-transfer.ts,
    // plus `unknown` for a throw from somewhere else entirely.
    error: {
      unreachable: "Der Paste-Dienst war nicht erreichbar.",
      linkDead:
        "Dieser Teilen-Link antwortet nicht — vielleicht ist er abgelaufen.",
      notJson: "Diese Datei ist kein gültiges JSON.",
      notExport: "Diese Datei ist kein Export einer Wiedergabeliste.",
      tooNew:
        "Diese Datei stammt aus einer neueren Version dieser Seite. Lade die Seite neu und versuche es erneut.",
      malformed: "Die Wiedergabeliste in dieser Datei ist fehlerhaft.",
      unknown: "Beim Lesen des Exports ist etwas schiefgegangen."
    }
  },

  // one playlist's page
  detail: {
    notFoundTitle: "Wiedergabeliste nicht gefunden",
    notFoundBody:
      "Diese Wiedergabeliste gibt es nicht mehr, oder der Link stimmt nicht.",
    notFoundAction: "Alle Wiedergabelisten",
    emptyTitle: "Noch nichts drin",
    emptyBody:
      "Über den Wiedergabelisten-Button auf einer Videoseite fügst du hier Videos hinzu.",
    // toggles the grid into remove-a-video mode; "Done" turns it back off
    edit: "Bearbeiten",
    removeVideo: "Aus der Wiedergabeliste entfernen",
    renameTitle: "Wiedergabeliste umbenennen",
    deleteTitle: "„{name}“ löschen?",
    deleteBody:
      "Die Videos bleiben im Katalog — nur die Wiedergabeliste verschwindet.",
    deleteConfirm: "Wiedergabeliste löschen",
    deletedTitle: "Wiedergabeliste gelöscht",
    deletedBody: "„{name}“ ist weg."
  },

  // share dialog: the export as JSON text, as a file, or as a paste link
  share: {
    title: "Wiedergabeliste teilen",
    open: "Wiedergabeliste teilen",
    openHint: "Diese Wiedergabeliste teilen oder exportieren",
    exportAria: "Export-JSON der Wiedergabeliste",
    linkAria: "Teilen-Link",
    copyLink: "Teilen-Link kopieren",
    note: "Wer den Link hat, kann diese Wiedergabeliste importieren. Der Paste ist temporär — er läuft nach etwa 90 Tagen ab.",
    copyJson: "JSON kopieren",
    saveFile: "Datei speichern",
    createLink: "Teilen-Link erstellen",
    newLink: "Neuer Teilen-Link",
    jsonCopied: "JSON kopiert",
    jsonCopyFailed: "JSON konnte nicht kopiert werden",
    linkCopied: "Teilen-Link kopiert",
    linkCopiedBody: "Wer den Link hat, kann diese Wiedergabeliste importieren.",
    linkCopyFailed: "Link konnte nicht kopiert werden",
    linkCreated: "Teilen-Link erstellt",
    linkFailedTitle: "Teilen-Link konnte nicht erstellt werden",
    linkFailedBody:
      "Der Paste-Dienst hat nicht geantwortet. Kopiere stattdessen das JSON."
  },

  // downloading every free script in the playlist, one after another
  bulk: {
    label: "Alle Skripte holen ({count})",
    progress: "Hole {done}/{total}…",
    keyPrompt:
      "Skripte sind an dein Handy gebunden. Gib den Verbindungsschlüssel aus der Handy-App ein, um fortzufahren.",
    // the explanation under this title is the shared one from
    // `services.scriptDownload.*` — same failure, same words as everywhere else
    failedTitle: "Skripte konnten nicht abgerufen werden",
    doneTitle: "Skripte heruntergeladen",
    doneBody: "{count} Skript gespeichert. | {count} Skripte gespeichert.",
    // both counts in one sentence: the split between them is not the same
    // shape in every language
    partialBody: "{saved} gespeichert, {failed} fehlgeschlagen."
  },

  // the dialog a video page opens to file that video
  add: {
    title: "Zur Wiedergabeliste hinzufügen",
    empty: "Noch keine Wiedergabelisten — leg unten deine erste an."
  }
};

export default playlists;
