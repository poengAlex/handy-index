import type enUS from "../en-US/gates";

// Why the catalog is smaller than the index: the disclosure line under every
// listing (`notice`) and the muted-tag manager it opens (`muted`).
//
// `notice` carries two phrasings of the same four reasons on purpose. A lone
// reason is a whole sentence and says the noun ("7,468 videos hidden by muted
// tags"); once a total leads the line the noun has already been said, so each
// reason after it is a bare clause ("1,816 by the Straight filter"). Both
// receive `{count}` pre-formatted — the sentence form through
// `useFormat().count("videos", n)`, the clause form through `$n()`.
const gates: typeof enUS = {
  notice: {
    hiddenByMuted: "{count} sin mostrar por etiquetas silenciadas",
    hiddenByOrientation: "{count} sin mostrar por el filtro «{orientation}»",
    hiddenByScript: "{count} sin mostrar por el filtro de scripts premium",
    hiddenByVideo: "{count} sin mostrar por el filtro de vídeos premium",

    hiddenTotal: "{count} sin mostrar",
    byMuted: "{count} por etiquetas silenciadas",
    byOrientation: "{count} por el filtro «{orientation}»",
    byScript: "{count} por el filtro de scripts premium",
    byVideo: "{count} por el filtro de vídeos premium"
  },

  muted: {
    title: "Etiquetas silenciadas",
    lead:
      "Las etiquetas silenciadas desaparecen del catálogo — no aparecen al " +
      "explorar, ni en las búsquedas, ni en las filas, ni en los vídeos " +
      "relacionados. La coincidencia es exacta, así que silenciar «gay» no " +
      "silencia «gay massage». Los favoritos y las listas son tuyos, así " +
      "que se quedan donde están.",

    // the tag picker, and the cost printed under every option in it
    pickerLabel: "Silenciar una etiqueta",
    pickerEmpty: "Ninguna etiqueta coincide",
    costNone: "ninguno de los vídeos que ves",
    costLine: "{count} · {share} de lo que ves",
    // a share small enough to round to zero still isn't nothing, so it gets
    // its own reading rather than "0%"
    percent: "{value}%",
    percentTiny: "<1%",

    // the inline confirm a tag heavy enough to take a tenth of the catalog
    // has to pass first
    confirmBody:
      "«{tag}» está en {count} — {share} de lo que ves ahora mismo. Si la " +
      "silencias, esos vídeos dejan de aparecer al explorar, en las " +
      "búsquedas, en las filas y en los vídeos relacionados de todo el sitio.",
    confirmMute: "Silenciar de todos modos",

    chipUnmuteAria: "Dejar de silenciar la etiqueta: {tag}",
    empty:
      "Todavía no hay nada silenciado. Elige una etiqueta arriba y todos los " +
      "vídeos que la lleven saldrán del catálogo.",
    unmuteAll: "Dejar de silenciar todas",

    toastMutedTitle: "«{tag}» silenciada",
    toastMutedBody: "{count} sin mostrar",
    toastUnmutedAll: "Ya no hay etiquetas silenciadas"
  }
};

export default gates;
