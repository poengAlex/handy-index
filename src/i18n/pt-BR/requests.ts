import type enUS from "../en-US/requests";

// The community side of the catalog: the voting board (submit a video URL,
// upvote what should get scripted next) and the queue that shows the same
// requests in scripting order. Both are gated on the Handy connection key,
// which is why `key.*` carries a body per surface — the sentence names the
// thing you were trying to reach.
const requests: typeof enUS = {
  // Connection-key gate and the two failure states behind it. Shown by both
  // pages; only the body differs.
  key: {
    title: "Chave de conexão necessária",
    boardBody:
      "O quadro de pedidos está vinculado ao seu Handy. Adicione a chave de conexão do app do Handy para ver, enviar e votar em pedidos.",
    queueBody:
      "A fila está vinculada ao seu Handy. Adicione a chave de conexão do app do Handy para vê-la.",
    addAction: "Adicionar chave de conexão",
    rejectedTitle: "Chave de conexão recusada",
    rejectedBody:
      "Ou a chave está errada, ou o seu Handy não está online. Verifique a chave no app do Handy, veja se o dispositivo está ligado e conectado e digite-a de novo.",
    rejectedAction: "Digitar a chave de novo",
    boardDialog:
      "O quadro de pedidos está vinculado ao seu Handy. Digite a chave de conexão do app do Handy para continuar.",
    queueDialog:
      "A fila está vinculada ao seu Handy. Digite a chave de conexão do app do Handy para continuar."
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
    queueLink: "Ver fila",
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

  // The queue page: the same requests, ranked, read-only.
  queue: {
    title: "Fila de pedidos",
    lead: "A ordem de criação dos scripts: o pedido mais votado ganha script primeiro.",
    boardLink: "Quadro de votação",
    emptyTitle: "A fila está vazia",
    emptyBody:
      "Nada está esperando script no momento. Peça um vídeo no quadro de votação para as coisas andarem.",
    emptyAction: "Ir para os pedidos",
    errorTitle: "Não foi possível carregar a fila",
    noMatchBody:
      "Nada na fila corresponde a esses filtros. Remova alguns filtros para ver o resto.",
    countWaiting: "{requests} esperando",
    countWaitingCapped:
      "{requests} esperando (a fila é maior do que carregamos)",
    countFiltered: "{requests} de {total} esperando",
    countFilteredCapped:
      "{requests} de {total} (a fila é maior do que carregamos)"
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

  // The control row shared by both pages.
  filters: {
    searchPlaceholder: "Buscar pedidos",
    searchAria: "Buscar pedidos por título",
    sortAria: "Ordenar pedidos",
    tagLabel: "Tag",
    tagEmpty: "Nenhuma tag encontrada",
    // one row of the tag picker: the tag, then how many requests carry it
    tagOption: "{tag} ({count})",
    removeTagAria: "Remover filtro: {tag}",
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
