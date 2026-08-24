import type enUS from "../en-US/tags";

// The tag cloud at /tags: every tag in the visible catalog as a clickable
// pill, searchable and sortable, plus the long index-download wait it sits
// behind and the right-click menu that mutes a tag.
const tags: typeof enUS = {
  title: "Etiquetas",
  errorTitle: "No se pudieron cargar las etiquetas",

  // The cloud can't draw a pill until the whole ~40 MB index is in, so the
  // wait gets a phase, a percentage and a reason it's worth it.
  loading: {
    barLabel: "Cargando etiquetas",
    // Norwegian puts a space before the percent sign, so this is a message
    // rather than a bare "%" glued on in the template
    percent: "{percent}%",
    downloading: "Descargando el índice de scripts",
    parsing: "Leyendo el índice",
    noteParsing: "Ya está todo — ahora se ordena en etiquetas.",
    note: "{received} de ~{total} MB descomprimidos — el catálogo entero, descargado una sola vez, así que a partir de aquí cada página es instantánea.",
    // the expected total is only last visit's size, so an index that grew
    // since gets a line that doesn't print "44 of ~41 MB"
    noteOversize:
      "{received} MB descomprimidos — el catálogo entero, descargado una sola vez."
  },

  controls: {
    searchPlaceholder: "Buscar etiquetas",
    searchLabel: "Buscar etiquetas",
    sortLabel: "Ordenar etiquetas",
    sortByCount: "Más videos",
    // the alphabet's first and last letter — Norwegian ends at Å
    sortByName: "A–Z",
    sortedDescLabel: "Orden descendente — invertir",
    sortedAscLabel: "Orden ascendente — invertir",
    sortedDescTitle: "Orden descendente — haz clic para invertir",
    sortedAscTitle: "Orden ascendente — haz clic para invertir",
    muted: "Silenciadas",
    mutedCount: "Silenciadas ({count})"
  },

  empty: {
    searchTitle: "Ninguna etiqueta coincide",
    searchBody: "Nada del índice coincide con “{query}”.",
    filteredBody:
      "Tus filtros y etiquetas silenciadas ocultan todas las etiquetas del índice. Quita alguno en los ajustes.",
    filteredAction: "Etiquetas silenciadas"
  },

  menu: {
    browse: "Explorar esta etiqueta",
    mute: "Silenciar esta etiqueta"
  },

  toast: {
    refusedTitle: "“{tag}” no se puede silenciar",
    refusedBody:
      "Las etiquetas de orientación deciden qué catálogo ves — eso se cambia en los ajustes.",
    mutedTitle: "“{tag}” silenciada",
    mutedBody:
      "Está en tu lista de etiquetas silenciadas — puedes dejar de " +
      "silenciarla cuando quieras."
  }
};

export default tags;
