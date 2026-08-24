import type enUS from "../en-US/video";

// The video detail page — the biggest single surface in the app: the hero and
// its chips, the action row, the opt-in partner player, the tag strip, the
// details card, the star rating, the stills gallery and its full-size viewer,
// script comments, the "more like this" shelves, and a toast for every
// outcome each of those can produce.
const video: typeof enUS = {
  missingTitle: "Vídeo não encontrado",
  missingBody: "Este vídeo não está mais no índice, ou o link está errado.",

  // Stand-ins for catalog fields the index published empty. They are read
  // out loud (alt text, an iframe title) or land mid-sentence, so each one
  // has to work in the slot it fills — "Watch on the site" (the same reading
  // media.ts gives an unnamed partner), "Still 3 from Video".
  fallback: {
    video: "Vídeo",
    player: "Player de vídeo",
    site: "site",
    thisSite: "mesmo site"
  },

  hero: {
    premiumChip: "Script premium"
  },

  action: {
    getScript: "Baixar script",
    // {site} is the partner's own name, or `fallback.site` when it has none
    watchOn: "Assistir no {site}",
    addFavorite: "Adicionar aos favoritos",
    removeFavorite: "Remover dos favoritos",
    addToPlaylist: "Adicionar a uma playlist",
    report: "Denunciar este vídeo"
  },

  premiumNote:
    "O script deste vídeo é premium — ele vem junto com o vídeo no site parceiro.",

  playerNote:
    "O Handy não sincroniza com a reprodução aqui no IVDB — este player só mostra o vídeo. Baixe o script e reproduza pelo seu setup do Handy para ter os movimentos sincronizados.",

  tag: {
    unmuteAria: "Deixar de silenciar a tag: {tag}",
    mutedTitle: "“{tag}” está silenciada — clique para desfazer",
    browse: "Explorar esta tag",
    mute: "Silenciar esta tag"
  },

  details: {
    title: "Detalhes",
    script: "Script",
    free: "Grátis",
    premium: "Premium",
    published: "Publicado",
    duration: "Duração",
    format: "Formato",
    // the non-VR case: an ordinary 2D video
    formatFlat: "2D",
    site: "Site",
    scriptBy: "Script de",
    rating: "Avaliação",
    ratingValue: "{percent}%",
    // {votes} arrives already pluralized from useFormat().count("votes", n)
    ratingWithVotes: "{percent}% · {votes}",
    scriptPlays: "Reproduções do script"
  },

  rate: {
    title: "Avalie este script",
    community: "Comunidade: {percent}%",
    thanks: "Obrigado por avaliar este script",
    errorTitle: "Não foi possível salvar sua avaliação"
  },

  gallery: {
    // the strip is headed "Photos" unless the only thing in it is the
    // partner's roll clip
    photosTitle: "Fotos",
    previewTitle: "Prévia",
    previewBadge: "Prévia",
    clipAria: "Reproduzir a prévia em tela cheia",
    photoAria: "Abrir foto {index} de {total}",
    stillAlt: "Imagem {number} de {title}",
    previousPhoto: "Foto anterior",
    nextPhoto: "Próxima foto",
    closeViewer: "Fechar visualizador",
    // position counter under the full-size viewer — "3 / 12"
    viewerCount: "{index} / {total}"
  },

  comments: {
    title: "Comentários",
    gateHint: "Os comentários precisam da sua chave de conexão.",
    gateAction: "Adicionar chave",
    inputLabel: "Adicionar um comentário",
    submit: "Comentar",
    errorHint: "Não foi possível carregar os comentários.",
    emptyHint: "Nenhum comentário ainda — seja o primeiro.",
    postedTitle: "Comentário enviado",
    postedBody: "Ele aparece assim que passar pela revisão.",
    postErrorTitle: "Não foi possível publicar seu comentário"
  },

  more: {
    related: "Mais como este",
    fromPartner: "Mais do {site}"
  },

  // Replaces ConnectionKeyDialog's generic blurb — the reason the key is
  // being asked for differs per action.
  keyPrompt: {
    script:
      "Os scripts estão vinculados ao seu Handy. Digite a chave de conexão do app do Handy para continuar.",
    action:
      "As avaliações e os comentários estão vinculados ao seu Handy. Digite a chave de conexão do app do Handy para continuar."
  },

  script: {
    readyTitle: "Script pronto",
    readyBody: "O download abriu em uma nova aba.",
    errorTitle: "Não foi possível baixar o script",
    errorBody:
      "Ou a chave de conexão está errada, ou o seu Handy não está online. Verifique os dois e tente de novo."
  },

  mute: {
    refusedTitle: "“{tag}” não pode ser silenciada",
    refusedBody:
      "As tags de orientação definem qual catálogo você vê — mude isso nas configurações.",
    doneTitle: "“{tag}” silenciada",
    doneBody:
      "Está na sua lista de silenciadas — dá para desfazer quando quiser.",
    undoneTitle: "“{tag}” não está mais silenciada"
  },

  share: {
    copiedTitle: "Link copiado",
    errorTitle: "Não foi possível copiar o link"
  },

  // The report button opens a pre-filled mail draft. The reader is the one
  // who finishes and sends it, so the draft is written in their language;
  // the identifying lines keep it useful once it reaches the inbox.
  report: {
    subject: "Quero denunciar um vídeo",
    intro: "Quero denunciar um vídeo.",
    titleLine: "Título: {title}",
    untitled: "(sem título)",
    idLine: "ID do vídeo: {id}",
    siteLine: "Site: {site}",
    linkLine: "Link: {link}",
    reasonLine: "Motivo da denúncia:"
  }
};

export default video;
