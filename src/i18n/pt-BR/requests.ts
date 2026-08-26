import type enUS from "../en-US/requests";

// The community side of the catalog: one voting board that is also the
// queue — submit a video URL, upvote what should get scripted next, and read
// each tile's rank as its place in the scripting order. The board is gated on
// the Handy connection key, which is what `key.*` covers.
const requests: typeof enUS = {
  // Connection-key gate and the two failure states behind it.
  key: {
    title: "Connection key necessária",
    boardBody:
      "O quadro de pedidos está vinculado ao seu Handy. Adicione a connection key do app do Handy para ver, enviar e votar em pedidos.",
    addAction: "Adicionar connection key",
    rejectedTitle: "Connection key recusada",
    rejectedBody:
      "Ou a chave está errada, ou o seu Handy não está online. Verifique a chave no app do Handy, veja se o dispositivo está ligado e conectado e digite-a de novo.",
    rejectedAction: "Digitar a chave de novo",
    boardDialog:
      "O quadro de pedidos está vinculado ao seu Handy. Digite a connection key do app do Handy para continuar."
  },

  // The voting board page. There are four count messages rather than one
  // stem the render bolts suffixes onto: "of {total}" only appears while
  // filters narrow the list, and the capped note only when the board is
  // longer than the single load we do. `{requests}` arrives already counted
  // and pluralized ("12 requests", from common.count.requests) — move it
  // wherever the sentence wants it.
  board: {
    title: "Pedidos de script",
    lead: "Vote nos vídeos que devem ganhar script — o pedido mais votado vem primeiro.",
    emptyTitle: "Nenhum pedido esperando",
    emptyBody:
      "Nada está em votação no momento. Peça um vídeo acima para as coisas andarem.",
    errorTitle: "Não foi possível carregar os pedidos",
    noMatchBody:
      "Nada no quadro corresponde a esses filtros. Remova alguns filtros para ver o resto.",
    countAll: "{requests} em votação",
    countAllCapped:
      "{requests} em votação (o quadro é maior do que carregamos)",
    countFiltered: "{requests} de {total}",
    countFilteredCapped:
      "{requests} de {total} (o quadro é maior do que carregamos)"
  },

  // The submit row on the board, plus the two toasts it can raise.
  submit: {
    title: "Pedir um vídeo",
    hint: "Cole o link de um vídeo que você quer ver com script. Ele passa por uma verificação antes de entrar em votação.",
    urlLabel: "URL do vídeo",
    action: "Pedir vídeo",
    sentTitle: "Pedido enviado",
    sentBody: "Ele passa por uma verificação antes de entrar em votação.",
    failedTitle: "O pedido falhou",
    failedBody: "O índice de scripts não aceitou a URL. Tente de novo."
  },

  // The vote button and its toasts. `failedKeyBody` is the auth case: the key
  // was rotated or the device went offline mid-session.
  vote: {
    action: "Votar",
    voted: "Votado",
    successTitle: "Voto computado",
    successBody: "Os pedidos mais votados ganham script primeiro.",
    failedTitle: "O voto falhou",
    failedKeyBody:
      "Ou a chave está errada, ou o seu Handy não está online — verifique os dois e digite a chave de novo.",
    failedBody: "O índice de scripts não aceitou o voto. Tente de novo."
  },

  // One request tile.
  card: {
    untitled: "Pedido de vídeo",
    openAria: "Abrir {name}",
    // the request's place in the scripting order, on a badge with room for
    // about four characters
    rank: "#{rank}"
  },

  // The control row above the list.
  filters: {
    searchPlaceholder: "Buscar pedidos",
    searchAria: "Buscar pedidos por título",
    sortAria: "Ordenar pedidos",
    tagLabel: "Tag",
    tagEmpty: "Nenhuma tag encontrada",
    // one row of the tag picker: the tag, then how many requests carry it
    tagOption: "{tag} ({count})",
    removeTagAria: "Remover filtro: {tag}",
    performerLabel: "Artista",
    performerEmpty: "Nenhum artista encontrado",
    // one row of the performer picker: who they are, then how many
    // requests name them
    performerOption: "{name} ({count})",
    removePerformerAria: "Remover filtro: {name}",
    hideVoted: "Ocultar votados",
    hideVotedTitle: "Ocultar os pedidos em que você já votou",
    emptyTitle: "Nenhum pedido encontrado"
  },

  // Sort picker. Keys match RequestSortKey.
  sort: {
    votes: "Mais votados",
    newest: "Mais recentes",
    longest: "Mais longos",
    title: "A–Z"
  }
};

export default requests;
