import type enUS from "../en-US/tags";

// The tag cloud at /tags: every tag in the visible catalog as a clickable
// pill, searchable and sortable, plus the long index-download wait it sits
// behind and the right-click menu that mutes a tag.
const tags: typeof enUS = {
  title: "Tags",
  errorTitle: "Não foi possível carregar as tags",

  // The cloud can't draw a pill until the whole ~40 MB index is in, so the
  // wait gets a phase, a percentage and a reason it's worth it.
  loading: {
    barLabel: "Carregando tags",
    // Norwegian puts a space before the percent sign, so this is a message
    // rather than a bare "%" glued on in the template
    percent: "{percent}%",
    downloading: "Baixando o índice de scripts",
    parsing: "Lendo o índice",
    noteParsing: "Tudo baixado — organizando em tags agora.",
    note: "{received} de ~{total} MB descompactados — o catálogo inteiro, baixado uma vez só, então toda página depois desta abre na hora.",
    // the expected total is only last visit's size, so an index that grew
    // since gets a line that doesn't print "44 of ~41 MB"
    noteOversize:
      "{received} MB descompactados — o catálogo inteiro, baixado uma vez só."
  },

  controls: {
    searchPlaceholder: "Buscar tags",
    searchLabel: "Buscar tags",
    sortLabel: "Ordenar tags",
    sortByCount: "Mais vídeos",
    // the alphabet's first and last letter — Norwegian ends at Å
    sortByName: "A–Z",
    sortedDescLabel: "Ordem decrescente — inverter",
    sortedAscLabel: "Ordem crescente — inverter",
    sortedDescTitle: "Ordem decrescente — clique para inverter",
    sortedAscTitle: "Ordem crescente — clique para inverter",
    muted: "Silenciadas",
    mutedCount: "Silenciadas ({count})"
  },

  empty: {
    searchTitle: "Nenhuma tag encontrada",
    searchBody: "Nada no índice corresponde a “{query}”.",
    filteredBody:
      "Seus filtros e tags silenciadas escondem todas as tags do índice. Ajuste os filtros nas configurações.",
    filteredAction: "Tags silenciadas"
  },

  menu: {
    browse: "Explorar esta tag",
    mute: "Silenciar esta tag"
  },

  toast: {
    refusedTitle: "“{tag}” não pode ser silenciada",
    refusedBody:
      "As tags de orientação definem qual catálogo você vê — mude isso nas configurações.",
    mutedTitle: "“{tag}” silenciada",
    mutedBody:
      "Está na sua lista de silenciadas — dá para desfazer quando quiser."
  }
};

export default tags;
