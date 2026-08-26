import type enUS from "../en-US/requests";

// The community side of the catalog: one voting board that is also the
// queue — submit a video URL, upvote what should get scripted next, and read
// each tile's rank as its place in the scripting order. The board is gated on
// the Handy connection key, which is what `key.*` covers.
const requests: typeof enUS = {
  // Connection-key gate and the two failure states behind it.
  key: {
    title: "Hace falta la connection key",
    boardBody:
      "El tablero de solicitudes está vinculado a tu Handy. Añade la connection key de la app de Handy para ver, enviar y votar solicitudes.",
    addAction: "Añadir la connection key",
    rejectedTitle: "Connection key rechazada",
    rejectedBody:
      "O la clave es incorrecta o tu Handy no está en línea. Revisa la clave en la app de Handy, comprueba que el dispositivo está encendido y conectado, y escríbela otra vez.",
    rejectedAction: "Escribir la clave otra vez",
    boardDialog:
      "El tablero de solicitudes está vinculado a tu Handy. Escribe la connection key de la app de Handy para continuar."
  },

  // The voting board page. There are four count messages rather than one
  // stem the render bolts suffixes onto: "of {total}" only appears while
  // filters narrow the list, and the capped note only when the board is
  // longer than the single load we do. `{requests}` arrives already counted
  // and pluralized ("12 requests", from common.count.requests) — move it
  // wherever the sentence wants it.
  board: {
    title: "Solicitudes de scripts",
    lead: "Vota qué vídeos tendrán script a continuación — la solicitud más votada va primero.",
    emptyTitle: "No hay solicitudes esperando",
    emptyBody:
      "Ahora mismo no hay nada en votación. Solicita un vídeo aquí arriba para poner esto en marcha.",
    errorTitle: "No se han podido cargar las solicitudes",
    noMatchBody:
      "Nada del tablero coincide con esos filtros. Quita alguno para ver el resto.",
    countAll: "{requests} en votación",
    countAllCapped:
      "{requests} en votación (el tablero es más largo de lo que cargamos)",
    countFiltered: "{requests} de {total}",
    countFilteredCapped:
      "{requests} de {total} (el tablero es más largo de lo que cargamos)"
  },

  // The submit row on the board, plus the two toasts it can raise.
  submit: {
    title: "Solicitar un vídeo",
    hint: "Pega el enlace de un vídeo al que quieras que le hagan un script. Pasa por una verificación antes de aparecer en la votación.",
    urlLabel: "URL del vídeo",
    action: "Solicitar vídeo",
    sentTitle: "Solicitud enviada",
    sentBody: "Pasa por una verificación antes de aparecer en la votación.",
    failedTitle: "La solicitud ha fallado",
    failedBody:
      "El índice de scripts no ha aceptado la URL. Vuelve a intentarlo."
  },

  // The vote button and its toasts. `failedKeyBody` is the auth case: the key
  // was rotated or the device went offline mid-session.
  vote: {
    action: "Votar",
    voted: "Votado",
    successTitle: "Voto registrado",
    successBody: "Las solicitudes más votadas reciben su script primero.",
    failedTitle: "El voto ha fallado",
    failedKeyBody:
      "O la clave es incorrecta o tu Handy no está en línea — revisa las dos cosas y escríbela otra vez.",
    failedBody:
      "El índice de scripts no ha aceptado el voto. Vuelve a intentarlo."
  },

  // One request tile.
  card: {
    untitled: "Solicitud de vídeo",
    openAria: "Abrir {name}",
    // the request's place in the scripting order, on a badge with room for
    // about four characters
    rank: "#{rank}"
  },

  // The control row above the list.
  filters: {
    searchPlaceholder: "Buscar solicitudes",
    searchAria: "Buscar solicitudes por título",
    sortAria: "Ordenar solicitudes",
    tagLabel: "Etiqueta",
    tagEmpty: "Ninguna etiqueta coincide",
    // one row of the tag picker: the tag, then how many requests carry it
    tagOption: "{tag} ({count})",
    removeTagAria: "Quitar filtro: {tag}",
    performerLabel: "Intérprete",
    performerEmpty: "Ningún intérprete coincide",
    // one row of the performer picker: who they are, then how many
    // requests name them
    performerOption: "{name} ({count})",
    removePerformerAria: "Quitar filtro: {name}",
    hideVoted: "Ocultar votadas",
    hideVotedTitle: "Ocultar las solicitudes que ya has votado",
    emptyTitle: "Ninguna solicitud coincide"
  },

  // Sort picker. Keys match RequestSortKey.
  sort: {
    votes: "Más votos",
    newest: "Más recientes",
    longest: "Más largos",
    title: "A–Z"
  }
};

export default requests;
