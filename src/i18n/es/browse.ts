import type enUS from "../en-US/browse";

// The browse + search page (/videos): the toolbar above the grid, the
// active-filter chips, the advanced-filters modal, and one empty state per
// reason the grid can come back empty (a muted tag, the orientation gate,
// or plain over-filtering).
const browse: typeof enUS = {
  title: "Vídeos",

  toolbar: {
    searchPlaceholder: "Buscar por título",
    searchAria: "Buscar vídeos por título",
    sortAria: "Ordenar vídeos",
    // The flip button names the direction the list is *in*, then what a
    // click would do — four flat keys rather than a sentence assembled from
    // a direction word, which would strand the translator.
    dirDescAria: "Orden descendente — invertir",
    dirAscAria: "Orden ascendente — invertir",
    dirDescTitle: "Orden descendente — haz clic para invertir",
    dirAscTitle: "Orden ascendente — haz clic para invertir",
    filters: "Filtros",
    filtersCount: "Filtros ({count})",
    shareAria: "Compartir estos resultados — el enlace lleva todos los filtros"
  },

  // The sort dropdown. Keyed by SortKey so the option list can stay a
  // module constant holding keys instead of English.
  sort: {
    recent: "Recién añadidos",
    updated: "Recién actualizados",
    top: "Mejor valorados",
    plays: "Más reproducidos",
    views: "Más vistos",
    longest: "Más largos",
    title: "A–Z"
  },

  chip: {
    // {label} is catalog data — a tag, a site name, a performer name
    removeAria: "Quitar filtro: {label}",
    // stand-ins for a filtered id whose name isn't in the loaded catalog
    partnerFallback: "Sitio",
    performerFallback: "Intérprete"
  },

  filters: {
    title: "Filtros",
    addTag: "Añadir etiqueta",
    noTags: "Ninguna etiqueta coincide",
    site: "Sitio",
    noSites: "Ningún sitio coincide",
    // one row of either picker: the tag or site name, then how many videos
    // picking it would leave on screen
    option: "{name} ({count})",
    vrLabel: "Solo VR",
    vrCaption: "Solo vídeos de realidad virtual",
    orientation: "Orientación",
    access: "Acceso",
    premiumScriptsLabel: "Scripts premium",
    premiumScriptsCaption:
      "Incluir los scripts tras el muro de pago de un sitio asociado",
    premiumVideosLabel: "Vídeos premium",
    premiumVideosCaption:
      "Incluir los vídeos tras el muro de pago de un sitio asociado",
    mutedLabel: "Etiquetas silenciadas",
    mutedNone: "Nada silenciado",
    // {tags} is a comma-joined list of the first few muted tags
    mutedMore: "{tags} +{rest} más",
    duration: "Duración",
    durationAny: "Cualquiera",
    durationFrom: "{min}+ min",
    durationRange: "{min}–{max} min"
  },

  empty: {
    // A muted tag arriving via ?tag= empties the grid and no filter change
    // can fix it, so the one-tag case names the tag it is talking about.
    mutedOneTitle: "«{tag}» está silenciada",
    mutedOneBody:
      "Los vídeos con esta etiqueta están ocultos en todo el sitio. Deja de silenciarla para ver estos resultados.",
    mutedOneAction: "Dejar de silenciar «{tag}»",
    mutedManyTitle: "Algunas de estas etiquetas están silenciadas",
    mutedManyBody:
      "Los vídeos con estas etiquetas están ocultos en todo el sitio. Deja de silenciarlas para ver estos resultados.",
    mutedManyAction: "Dejar de silenciarlas",
    // {orientation} comes from common.orientation.* via useFormat()
    orientationTitle: "Nada que mostrar con el filtro «{orientation}»",
    // one sentence, not a count phrase glued to a clause: the verb agrees
    // with the count in English and the word order differs in Norwegian
    orientationBody:
      "Hay {count} vídeo que coincide con todo lo demás que has elegido, pero no con el filtro «{orientation}». | Hay {count} vídeos que coinciden con todo lo demás que has elegido, pero no con el filtro «{orientation}».",
    orientationAction: "Ver todas las orientaciones",
    noneTitle: "Ningún vídeo coincide",
    noneBody:
      "Los filtros han dejado fuera todos los vídeos. Amplía la búsqueda o quita algunos filtros.",
    noneAction: "Quitar todos los filtros"
  },

  share: {
    // {count} arrives already localized and pluralized as "12 videos"
    // (useFormat().count), so this message only decides where it sits
    title: "IVDB — {count}",
    fallbackTitle: "Vídeos de IVDB",
    copiedTitle: "Enlace copiado",
    copiedBody: "Lleva todos los filtros que has elegido.",
    failedTitle: "No se ha podido copiar el enlace"
  }
};

export default browse;
