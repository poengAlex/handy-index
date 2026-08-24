import type enUS from "../en-US/video";

// The video detail page — the biggest single surface in the app: the hero and
// its chips, the action row, the opt-in partner player, the tag strip, the
// details card, the star rating, the stills gallery and its full-size viewer,
// script comments, the "more like this" shelves, and a toast for every
// outcome each of those can produce.
const video: typeof enUS = {
  missingTitle: "Vídeo no encontrado",
  missingBody: "Este vídeo ya no está en el índice, o el enlace es incorrecto.",

  // Stand-ins for catalog fields the index published empty. They are read
  // out loud (alt text, an iframe title) or land mid-sentence, so each one
  // has to work in the slot it fills — "Watch on the site" (the same reading
  // media.ts gives an unnamed partner), "Still 3 from Video".
  fallback: {
    video: "Vídeo",
    player: "Reproductor de vídeo",
    site: "el sitio",
    thisSite: "este sitio"
  },

  hero: {
    premiumChip: "Script premium"
  },

  action: {
    getScript: "Descargar script",
    // {site} is the partner's own name, or `fallback.site` when it has none
    watchOn: "Ver en {site}",
    addFavorite: "Añadir a favoritos",
    removeFavorite: "Quitar de favoritos",
    addToPlaylist: "Añadir a una lista",
    report: "Denunciar este vídeo"
  },

  premiumNote:
    "El script de este vídeo es premium — viene con el vídeo en el sitio asociado.",

  playerNote:
    "El Handy no se sincroniza con la reproducción aquí en IVDB — este reproductor solo muestra el vídeo. Descarga el script y reprodúcelo con tu Handy para que los movimientos vayan sincronizados.",

  tag: {
    unmuteAria: "Dejar de silenciar la etiqueta: {tag}",
    mutedTitle: "«{tag}» está silenciada — haz clic para dejar de silenciarla",
    browse: "Explorar esta etiqueta",
    mute: "Silenciar esta etiqueta"
  },

  details: {
    title: "Detalles",
    script: "Script",
    free: "Gratis",
    premium: "Premium",
    published: "Publicado",
    duration: "Duración",
    format: "Formato",
    // the non-VR case: an ordinary 2D video
    formatFlat: "2D",
    site: "Sitio",
    scriptBy: "Script de",
    rating: "Valoración",
    ratingValue: "{percent}%",
    // {votes} arrives already pluralized from useFormat().count("votes", n)
    ratingWithVotes: "{percent}% · {votes}",
    scriptPlays: "Reproducciones del script"
  },

  rate: {
    title: "Valora este script",
    community: "Comunidad: {percent}%",
    thanks: "Gracias por valorar este script",
    errorTitle: "No se ha podido guardar tu valoración"
  },

  gallery: {
    // the strip is headed "Photos" unless the only thing in it is the
    // partner's roll clip
    photosTitle: "Fotos",
    previewTitle: "Vista previa",
    previewBadge: "Vista previa",
    clipAria: "Reproducir el clip de vista previa a tamaño completo",
    photoAria: "Abrir la foto {index} de {total}",
    stillAlt: "Fotograma {number} de {title}",
    previousPhoto: "Foto anterior",
    nextPhoto: "Foto siguiente",
    closeViewer: "Cerrar el visor",
    // position counter under the full-size viewer — "3 / 12"
    viewerCount: "{index} / {total}"
  },

  comments: {
    title: "Comentarios",
    gateHint: "Para los comentarios hace falta tu connection key.",
    gateAction: "Añadir la clave",
    inputLabel: "Escribe un comentario",
    submit: "Comentar",
    errorHint: "No se han podido cargar los comentarios.",
    emptyHint: "Aún no hay comentarios — sé el primero.",
    postedTitle: "Comentario enviado",
    postedBody: "Aparece en cuanto pase la revisión.",
    postErrorTitle: "No se ha podido publicar tu comentario"
  },

  more: {
    related: "Vídeos relacionados",
    fromPartner: "Más de {site}"
  },

  // Replaces ConnectionKeyDialog's generic blurb — the reason the key is
  // being asked for differs per action.
  keyPrompt: {
    script:
      "Los scripts están vinculados a tu Handy. Escribe la connection key de la app de Handy para continuar.",
    action:
      "Las valoraciones y los comentarios están vinculados a tu Handy. Escribe la connection key de la app de Handy para continuar."
  },

  script: {
    readyTitle: "Script listo",
    readyBody: "La descarga se ha abierto en una pestaña nueva.",
    errorTitle: "No se ha podido descargar el script",
    errorBody:
      "O la connection key es incorrecta o tu Handy no está en línea. Revisa las dos cosas y vuelve a intentarlo."
  },

  mute: {
    refusedTitle: "«{tag}» no se puede silenciar",
    refusedBody:
      "Las etiquetas de orientación deciden qué catálogo ves — eso se cambia en los ajustes.",
    doneTitle: "«{tag}» silenciada",
    doneBody:
      "Está en tu lista de etiquetas silenciadas — puedes dejar de " +
      "silenciarla cuando quieras.",
    undoneTitle: "«{tag}» ya no está silenciada"
  },

  share: {
    copiedTitle: "Enlace copiado",
    errorTitle: "No se ha podido copiar el enlace"
  },

  // The report button opens a pre-filled mail draft. The reader is the one
  // who finishes and sends it, so the draft is written in their language;
  // the identifying lines keep it useful once it reaches the inbox.
  report: {
    subject: "Quiero denunciar un vídeo",
    intro: "Quiero denunciar un vídeo.",
    titleLine: "Título: {title}",
    untitled: "(sin título)",
    idLine: "ID del vídeo: {id}",
    siteLine: "Sitio: {site}",
    linkLine: "Enlace: {link}",
    reasonLine: "Motivo de la denuncia:"
  }
};

export default video;
