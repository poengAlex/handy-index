import type enUS from "../en-US/common";

// Vocabulary shared by more than one surface. Same admission rule as the
// component menu in ARCHITECTURE.md: a string is promoted here on its
// *second* consumer — a phrase used once belongs in its feature namespace,
// where a translator can see the context it is used in.
//
// Plural messages carry a `{count}` named param instead of vue-i18n's bare
// `{n}`, because the count has to be run through `$n()` first so 15000 reads
// "15,000" in English and "15 000" in Norwegian. Call them as
// `$t("common.count.videos", { count: $n(x) }, x)`.
const common: typeof enUS = {
  action: {
    backToHome: "Voltar ao início",
    browseVideos: "Explorar vídeos",
    cancel: "Cancelar",
    clear: "Limpar",
    clearFilters: "Limpar filtros",
    clearSearch: "Limpar busca",
    create: "Criar",
    delete: "Excluir",
    done: "Pronto",
    import: "Importar",
    manage: "Gerenciar",
    rename: "Renomear",
    retry: "Tentar de novo",
    save: "Salvar",
    share: "Compartilhar"
  },

  state: {
    catalogErrorTitle: "Não foi possível carregar o catálogo",
    catalogErrorBody:
      "O índice de scripts não respondeu. Verifique sua conexão e tente de novo.",
    emptyTitle: "Nada para mostrar"
  },

  // "12 of 340" — the shown/total pair every filtered listing prints. Both
  // sides arrive pre-formatted through `$n()`.
  ofTotal: {
    videos: "{shown} de {total} vídeo | {shown} de {total} vídeos",
    performers: "{shown} de {total} artista | {shown} de {total} artistas",
    tags: "{shown} de {total} tag | {shown} de {total} tags"
  },

  count: {
    performers: "{count} artista | {count} artistas",
    playlists: "{count} playlist | {count} playlists",
    requests: "{count} pedido | {count} pedidos",
    sites: "{count} site | {count} sites",
    tags: "{count} tag | {count} tags",
    videos: "{count} vídeo | {count} vídeos",
    votes: "{count} voto | {count} votos"
  },

  // Duration is assembled from parts rather than formatted in the service:
  // Norwegian abbreviates hours "t", not "h", and only the message layer
  // knows that. `durationParts()` in services/format.ts picks which key.
  duration: {
    hoursMinutes: "{hours} h {minutes} min",
    hours: "{hours} h",
    minutes: "{minutes} min",
    seconds: "{seconds} s"
  },

  justNow: "agora mesmo",

  // Shared by the settings radio group, the browse filters and the header
  // switcher — the same "can't drift apart" reason ORIENTATION_LABELS gave
  // for living in queries.ts, which is where these strings came from.
  orientation: {
    straight: "Straight",
    gay: "Gay",
    trans: "Trans",
    all: "Everything"
  },

  language: {
    label: "Idioma",
    caption: "Escolha o idioma em que o site é exibido",
    system: "Igual ao navegador"
  }
};

export default common;
