import type enUS from "../en-US/playlists";

// The three playlist surfaces: the overview page, one playlist's own page
// (rename, delete, share/export, bulk script download) and the "add to
// playlist" dialog on a video.
//
// Playlist names are the user's own words — they are interpolated as {name}
// and never translated. Counts of playlists and videos come from
// `useFormat().count()`, so they are not repeated here.
const playlists: typeof enUS = {
  title: "Listas de reproducción",

  // the create row on the overview page and inside the add dialog
  newLabel: "Nueva lista",
  newPlaceholder: "p. ej. Para el fin de semana",
  nameLabel: "Nombre de la lista",
  importHint: "Importar una lista exportada desde este sitio",

  emptyTitle: "Todavía no hay listas",
  emptyBody:
    "Crea una aquí mismo, o usa el botón de listas en cualquier página de vídeo para empezar una con un vídeo que te guste.",

  import: {
    title: "Importar una lista",
    placeholder: "Pega una lista exportada (JSON) o un enlace de pastes.dev",
    inputAria: "Texto de la lista exportada o enlace para compartir",
    chooseFile: "Elegir archivo…",
    // The name an export gets when the file carried none. It becomes the
    // playlist's name, so write a name, not a sentence.
    defaultName: "Lista importada",
    doneTitle: "Lista importada",
    doneBody: "«{name}» — {count} vídeo. | «{name}» — {count} vídeos.",
    failedTitle: "No se ha podido importar eso",
    // One key per `PlaylistImportFailure` in services/playlist-transfer.ts,
    // plus `unknown` for a throw from somewhere else entirely.
    error: {
      unreachable: "No se ha podido contactar con el servicio de enlaces.",
      linkDead: "Ese enlace no responde — puede que haya caducado.",
      notJson: "Ese archivo no es JSON válido.",
      notExport: "Ese archivo no es una lista exportada.",
      tooNew:
        "Ese archivo lo exportó una versión más nueva de este sitio. Recarga la página y vuelve a intentarlo.",
      malformed: "La lista de ese archivo está mal formada.",
      unknown: "Algo ha salido mal al leer la lista exportada."
    }
  },

  // one playlist's page
  detail: {
    notFoundTitle: "Lista no encontrada",
    notFoundBody: "Esta lista ya no existe, o el enlace es incorrecto.",
    notFoundAction: "Todas las listas",
    emptyTitle: "Todavía no hay nada aquí",
    emptyBody:
      "Usa el botón de listas en cualquier página de vídeo para añadir vídeos aquí.",
    // toggles the grid into remove-a-video mode; "Done" turns it back off
    edit: "Editar",
    removeVideo: "Quitar de la lista",
    renameTitle: "Renombrar la lista",
    deleteTitle: "¿Eliminar «{name}»?",
    deleteBody: "Los vídeos siguen en el catálogo — solo desaparece la lista.",
    deleteConfirm: "Eliminar la lista",
    deletedTitle: "Lista eliminada",
    deletedBody: "«{name}» ya no existe."
  },

  // share dialog: the export as JSON text, as a file, or as a paste link
  share: {
    title: "Compartir la lista",
    open: "Compartir la lista",
    openHint: "Compartir o exportar esta lista",
    exportAria: "JSON de la lista exportada",
    linkAria: "Enlace para compartir",
    copyLink: "Copiar el enlace",
    note: "Cualquiera que tenga el enlace puede importar esta lista. El enlace es temporal — caduca al cabo de unos 90 días.",
    copyJson: "Copiar el JSON",
    saveFile: "Guardar archivo",
    createLink: "Crear enlace para compartir",
    newLink: "Nuevo enlace para compartir",
    jsonCopied: "JSON copiado",
    jsonCopyFailed: "No se ha podido copiar el JSON",
    linkCopied: "Enlace copiado",
    linkCopiedBody: "Cualquiera que tenga el enlace puede importar esta lista.",
    linkCopyFailed: "No se ha podido copiar el enlace",
    linkCreated: "Enlace creado",
    linkFailedTitle: "No se ha podido crear el enlace",
    linkFailedBody:
      "El servicio de enlaces no ha respondido. Copia el JSON en su lugar."
  },

  // downloading every free script in the playlist, one after another
  bulk: {
    label: "Descargar todos los scripts ({count})",
    progress: "Descargando {done}/{total}…",
    keyPrompt:
      "Los scripts están vinculados a tu Handy. Escribe la connection key de la app de Handy para continuar.",
    // the explanation under this title is the shared one from
    // `services.scriptDownload.*` — same failure, same words as everywhere else
    failedTitle: "No se han podido descargar los scripts",
    doneTitle: "Scripts descargados",
    doneBody: "{count} script guardado. | {count} scripts guardados.",
    // both counts in one sentence: the split between them is not the same
    // shape in every language
    partialBody: "{saved} guardados, {failed} fallidos."
  },

  // the dialog a video page opens to file that video
  add: {
    title: "Añadir a una lista",
    empty: "Todavía no hay listas — crea la primera aquí abajo."
  }
};

export default playlists;
