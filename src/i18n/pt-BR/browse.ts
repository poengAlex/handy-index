import type enUS from "../en-US/browse";

// The browse + search page (/videos): the toolbar above the grid, the
// active-filter chips, the advanced-filters modal, and one empty state per
// reason the grid can come back empty (a muted tag, the orientation gate,
// or plain over-filtering).
const browse: typeof enUS = {
  title: "Vídeos",

  toolbar: {
    searchPlaceholder: "Buscar títulos",
    searchAria: "Buscar vídeos por título",
    sortAria: "Ordenar vídeos",
    // The flip button names the direction the list is *in*, then what a
    // click would do — four flat keys rather than a sentence assembled from
    // a direction word, which would strand the translator.
    dirDescAria: "Ordem decrescente — inverter",
    dirAscAria: "Ordem crescente — inverter",
    dirDescTitle: "Ordem decrescente — clique para inverter",
    dirAscTitle: "Ordem crescente — clique para inverter",
    filters: "Filtros",
    filtersCount: "Filtros ({count})",
    shareAria: "Compartilhar estes resultados — o link leva todos os filtros"
  },

  // The sort dropdown. Keyed by SortKey so the option list can stay a
  // module constant holding keys instead of English.
  sort: {
    recent: "Adicionados recentemente",
    updated: "Atualizados recentemente",
    top: "Mais bem avaliados",
    plays: "Mais reproduzidos",
    views: "Mais vistos",
    longest: "Mais longos",
    title: "A–Z"
  },

  chip: {
    // {label} is catalog data — a tag, a site name, a performer name
    removeAria: "Remover filtro: {label}",
    // stand-ins for a filtered id whose name isn't in the loaded catalog
    partnerFallback: "Parceiro",
    performerFallback: "Artista"
  },

  filters: {
    title: "Filtros",
    addTag: "Adicionar tag",
    noTags: "Nenhuma tag encontrada",
    site: "Site",
    noSites: "Nenhum site encontrado",
    // one row of either picker: the tag or site name, then how many videos
    // picking it would leave on screen
    option: "{name} ({count})",
    vrLabel: "Apenas VR",
    vrCaption: "Somente vídeos de realidade virtual",
    orientation: "Orientação",
    access: "Acesso",
    premiumScriptsLabel: "Scripts premium",
    premiumScriptsCaption:
      "Incluir scripts que ficam na área paga de um parceiro",
    premiumVideosLabel: "Vídeos premium",
    premiumVideosCaption:
      "Incluir vídeos que ficam na área paga de um parceiro",
    mutedLabel: "Tags silenciadas",
    mutedNone: "Nada silenciado",
    // {tags} is a comma-joined list of the first few muted tags
    mutedMore: "{tags} +{rest} outras",
    duration: "Duração",
    durationAny: "Qualquer",
    durationFrom: "{min}+ min",
    durationRange: "{min}–{max} min"
  },

  empty: {
    // A muted tag arriving via ?tag= empties the grid and no filter change
    // can fix it, so the one-tag case names the tag it is talking about.
    mutedOneTitle: "“{tag}” está silenciada",
    mutedOneBody:
      "Vídeos com essa tag ficam ocultos em todo o site. Deixe de silenciar a tag para ver estes resultados.",
    mutedOneAction: "Deixar de silenciar “{tag}”",
    mutedManyTitle: "Algumas dessas tags estão silenciadas",
    mutedManyBody:
      "Vídeos com essas tags ficam ocultos em todo o site. Deixe de silenciar as tags para ver estes resultados.",
    mutedManyAction: "Deixar de silenciar as tags",
    // {orientation} comes from common.orientation.* via useFormat(), and
    // those four option names are pinned to English — so this slot always
    // receives a Latin word ("Straight"), never a Portuguese one that could
    // inflect. It is quoted like a tag name above, so it reads as the option
    // you picked rather than as an English adjective on "filtro".
    orientationTitle: "Nada por aqui no filtro “{orientation}”",
    // one sentence, not a count phrase glued to a clause: the verb agrees
    // with the count in English and the word order differs in Norwegian
    orientationBody:
      "{count} vídeo aqui combina com o resto dos seus filtros, mas não com o filtro “{orientation}”. | {count} vídeos aqui combinam com o resto dos seus filtros, mas não com o filtro “{orientation}”.",
    orientationAction: "Mostrar todas as orientações",
    noneTitle: "Nenhum vídeo encontrado",
    noneBody:
      "Todos os vídeos foram filtrados. Amplie a busca ou remova alguns filtros.",
    noneAction: "Limpar todos os filtros"
  },

  share: {
    // {count} arrives already localized and pluralized as "12 videos"
    // (useFormat().count), so this message only decides where it sits
    title: "IVDB — {count}",
    fallbackTitle: "Vídeos do IVDB",
    copiedTitle: "Link copiado",
    copiedBody: "Ele leva todos os filtros que você definiu.",
    failedTitle: "Não foi possível copiar o link"
  }
};

export default browse;
