// The three playlist surfaces: the overview page, one playlist's own page
// (rename, delete, share/export, bulk script download) and the "add to
// playlist" dialog on a video.
//
// Playlist names are the user's own words — they are interpolated as {name}
// and never translated. Counts of playlists and videos come from
// `useFormat().count()`, so they are not repeated here.
export default {
  title: "Playlists",

  // the create row on the overview page and inside the add dialog
  newLabel: "New playlist",
  newPlaceholder: "e.g. Weekend picks",
  nameLabel: "Playlist name",
  importHint: "Import a playlist exported from this site",

  emptyTitle: "No playlists yet",
  emptyBody:
    "Create one right here, or use the playlist button on any video page to start one from a video you like.",

  import: {
    title: "Import playlist",
    placeholder: "Paste a playlist export (JSON) or a pastes.dev link",
    inputAria: "Playlist export text or share link",
    chooseFile: "Choose file…",
    // The name an export gets when the file carried none. It becomes the
    // playlist's name, so write a name, not a sentence.
    defaultName: "Imported playlist",
    doneTitle: "Playlist imported",
    doneBody: "“{name}” — {count} video. | “{name}” — {count} videos.",
    failedTitle: "Couldn't import that",
    // One key per `PlaylistImportFailure` in services/playlist-transfer.ts,
    // plus `unknown` for a throw from somewhere else entirely.
    error: {
      unreachable: "Couldn't reach the paste service.",
      linkDead: "That share link doesn't answer — it may have expired.",
      notJson: "That file isn't valid JSON.",
      notExport: "That file isn't a playlist export.",
      tooNew:
        "That file was exported by a newer version of this site. Reload the page and try again.",
      malformed: "The playlist in that file is malformed.",
      unknown: "Something went wrong reading the export."
    }
  },

  // one playlist's page
  detail: {
    notFoundTitle: "Playlist not found",
    notFoundBody: "This playlist doesn't exist anymore, or the link is wrong.",
    notFoundAction: "All playlists",
    emptyTitle: "Nothing here yet",
    emptyBody: "Use the playlist button on any video page to add videos here.",
    // toggles the grid into remove-a-video mode; "Done" turns it back off
    edit: "Edit",
    removeVideo: "Remove from playlist",
    renameTitle: "Rename playlist",
    deleteTitle: "Delete “{name}”?",
    deleteBody: "The videos stay in the catalog — only the playlist goes away.",
    deleteConfirm: "Delete playlist",
    deletedTitle: "Playlist deleted",
    deletedBody: "“{name}” is gone."
  },

  // share dialog: the export as JSON text, as a file, or as a paste link
  share: {
    title: "Share playlist",
    open: "Share playlist",
    openHint: "Share or export this playlist",
    exportAria: "Playlist export JSON",
    linkAria: "Share link",
    copyLink: "Copy share link",
    note: "Anyone with the link can import this playlist. The paste is temporary — it expires after about 90 days.",
    copyJson: "Copy JSON",
    saveFile: "Save file",
    createLink: "Create share link",
    newLink: "New share link",
    jsonCopied: "JSON copied",
    jsonCopyFailed: "Couldn't copy the JSON",
    linkCopied: "Share link copied",
    linkCopiedBody: "Anyone with the link can import this playlist.",
    linkCopyFailed: "Couldn't copy the link",
    linkCreated: "Share link created",
    linkFailedTitle: "Couldn't create a share link",
    linkFailedBody: "The paste service didn't answer. Copy the JSON instead."
  },

  // downloading every free script in the playlist, one after another
  bulk: {
    label: "Get all scripts ({count})",
    progress: "Getting {done}/{total}…",
    keyPrompt:
      "Scripts are bound to your Handy. Enter the connection key from the Handy app to continue.",
    // the explanation under this title is the shared one from
    // `services.scriptDownload.*` — same failure, same words as everywhere else
    failedTitle: "Couldn't get the scripts",
    doneTitle: "Scripts downloaded",
    doneBody: "{count} script saved. | {count} scripts saved.",
    // both counts in one sentence: the split between them is not the same
    // shape in every language
    partialBody: "{saved} saved, {failed} failed."
  },

  // the dialog a video page opens to file that video
  add: {
    title: "Add to playlist",
    empty: "No playlists yet — create your first one below."
  }
};
