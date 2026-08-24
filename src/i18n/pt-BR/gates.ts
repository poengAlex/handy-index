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
    hiddenByMuted: "{count} fora do catálogo por tags silenciadas",
    hiddenByOrientation: "{count} fora do catálogo pelo filtro {orientation}",
    hiddenByScript: "{count} fora do catálogo pelo filtro de scripts premium",
    hiddenByVideo: "{count} fora do catálogo pelo filtro de vídeos premium",

    hiddenTotal: "{count} fora do catálogo",
    byMuted: "{count} por tags silenciadas",
    byOrientation: "{count} pelo filtro {orientation}",
    byScript: "{count} pelo filtro de scripts premium",
    byVideo: "{count} pelo filtro de vídeos premium"
  },

  muted: {
    title: "Tags silenciadas",
    lead:
      "Tags silenciadas somem do catálogo — navegação, busca, listas e " +
      "vídeos relacionados pulam todas elas. A correspondência é exata: " +
      "silenciar “gay” não silencia “gay massage”. Favoritos e playlists " +
      "são seus, então continuam onde estão.",

    // the tag picker, and the cost printed under every option in it
    pickerLabel: "Silenciar uma tag",
    pickerEmpty: "Nenhuma tag encontrada",
    costNone: "nenhum dos vídeos que você vê",
    costLine: "{count} · {share} do que você vê",
    // a share small enough to round to zero still isn't nothing, so it gets
    // its own reading rather than "0%"
    percent: "{value}%",
    percentTiny: "<1%",

    // the inline confirm a tag heavy enough to take a tenth of the catalog
    // has to pass first
    confirmBody:
      "“{tag}” está em {count} — {share} do que você vê agora. Silenciar a " +
      "tag tira esses vídeos da navegação, da busca, das listas e dos " +
      "relacionados em todo o site.",
    confirmMute: "Silenciar mesmo assim",

    chipUnmuteAria: "Deixar de silenciar a tag: {tag}",
    empty:
      "Nada silenciado ainda. Escolha uma tag acima e todo vídeo com ela " +
      "sai do catálogo.",
    unmuteAll: "Deixar de silenciar todas",

    toastMutedTitle: "“{tag}” silenciada",
    toastMutedBody: "{count} fora do catálogo",
    toastUnmutedAll: "Nenhuma tag está mais silenciada"
  }
};

export default gates;
