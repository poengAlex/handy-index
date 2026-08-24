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
//
// The sentence forms name the gate first: "{count} masquées" would have to
// agree with a count the message cannot see ("1 vidéo masquée"), while a
// filter doing the masking keeps the verb fixed. `hiddenTotal` only ever runs
// with two reasons or more, so its plural is safe.
const gates: typeof enUS = {
  notice: {
    hiddenByMuted: "Les tags en sourdine masquent {count}",
    hiddenByOrientation: "Le filtre {orientation} masque {count}",
    hiddenByScript: "Le filtre scripts premium masque {count}",
    hiddenByVideo: "Le filtre vidéos premium masque {count}",

    hiddenTotal: "{count} masquées",
    byMuted: "{count} par les tags en sourdine",
    byOrientation: "{count} par le filtre {orientation}",
    byScript: "{count} par le filtre scripts premium",
    byVideo: "{count} par le filtre vidéos premium"
  },

  muted: {
    title: "Tags en sourdine",
    lead:
      "Les tags en sourdine disparaissent du catalogue — la navigation, la " +
      "recherche, les rangées et les vidéos similaires les ignorent. La " +
      "correspondance est exacte : mettre « gay » en sourdine ne touche " +
      "pas « gay massage ». Vos favoris et vos playlists vous " +
      "appartiennent, ils restent en place.",

    // the tag picker, and the cost printed under every option in it
    pickerLabel: "Mettre un tag en sourdine",
    pickerEmpty: "Aucun tag correspondant",
    costNone: "aucune des vidéos que vous pouvez voir",
    costLine: "{count} · {share} de ce que vous voyez",
    // a share small enough to round to zero still isn't nothing, so it gets
    // its own reading rather than "0%"
    percent: "{value} %",
    percentTiny: "<1 %",

    // the inline confirm a tag heavy enough to take a tenth of the catalog
    // has to pass first
    confirmBody:
      "« {tag} » concerne {count} — {share} de ce que vous pouvez voir " +
      "actuellement. Le mettre en sourdine les retire de la navigation, de " +
      "la recherche, des rangées et des vidéos similaires, partout.",
    confirmMute: "Mettre en sourdine quand même",

    chipUnmuteAria: "Réactiver le tag : {tag}",
    empty:
      "Rien en sourdine pour l'instant. Choisissez un tag ci-dessus et " +
      "toutes les vidéos qui le portent quittent le catalogue.",
    unmuteAll: "Tout réactiver",

    toastMutedTitle: "« {tag} » mis en sourdine",
    toastMutedBody: "{count} hors catalogue",
    toastUnmutedAll: "Tous les tags ont été réactivés"
  }
};

export default gates;
