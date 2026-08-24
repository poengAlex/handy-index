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
    backToHome: "Volver al inicio",
    browseVideos: "Explorar vídeos",
    cancel: "Cancelar",
    clear: "Borrar",
    clearFilters: "Quitar filtros",
    clearSearch: "Borrar la búsqueda",
    create: "Crear",
    delete: "Eliminar",
    done: "Listo",
    import: "Importar",
    manage: "Gestionar",
    rename: "Renombrar",
    retry: "Reintentar",
    save: "Guardar",
    share: "Compartir"
  },

  state: {
    catalogErrorTitle: "No se ha podido cargar el catálogo",
    catalogErrorBody:
      "El índice de scripts no ha respondido. Revisa tu conexión y vuelve a intentarlo.",
    emptyTitle: "Nada que mostrar"
  },

  // "12 of 340" — the shown/total pair every filtered listing prints. Both
  // sides arrive pre-formatted through `$n()`.
  ofTotal: {
    videos: "{shown} de {total} vídeo | {shown} de {total} vídeos",
    performers:
      "{shown} de {total} intérprete | {shown} de {total} intérpretes",
    tags: "{shown} de {total} etiqueta | {shown} de {total} etiquetas"
  },

  count: {
    performers: "{count} intérprete | {count} intérpretes",
    playlists: "{count} lista | {count} listas",
    requests: "{count} solicitud | {count} solicitudes",
    sites: "{count} sitio | {count} sitios",
    tags: "{count} etiqueta | {count} etiquetas",
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

  justNow: "ahora mismo",

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
    caption: "Elige el idioma en el que se muestra el sitio",
    system: "Como el navegador"
  }
};

export default common;
