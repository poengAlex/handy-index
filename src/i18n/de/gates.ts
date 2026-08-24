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
    hiddenByMuted: "{count} durch stummgeschaltete Tags ausgeblendet",
    // {orientation} arrives uninflected from common.orientation.*, so it is
    // hyphenated onto the noun rather than given a case of its own
    hiddenByOrientation: "{count} vom {orientation}-Filter ausgeblendet",
    hiddenByScript: "{count} vom Premium-Skript-Filter ausgeblendet",
    hiddenByVideo: "{count} vom Premium-Video-Filter ausgeblendet",

    hiddenTotal: "{count} ausgeblendet",
    byMuted: "{count} durch stummgeschaltete Tags",
    byOrientation: "{count} vom {orientation}-Filter",
    byScript: "{count} vom Premium-Skript-Filter",
    byVideo: "{count} vom Premium-Video-Filter"
  },

  muted: {
    title: "Stummgeschaltete Tags",
    lead:
      "Stummgeschaltete Tags verschwinden aus dem Katalog — in der " +
      "Videoübersicht, in der Suche, in den Reihen auf der Startseite und " +
      "bei ähnlichen Videos tauchen sie nicht mehr auf. Getroffen wird nur " +
      "exakt: „gay“ stummzuschalten schaltet „gay massage“ nicht mit " +
      "stumm. Favoriten und Wiedergabelisten gehören dir und bleiben, wo " +
      "sie sind.",

    // the tag picker, and the cost printed under every option in it
    pickerLabel: "Tag stummschalten",
    pickerEmpty: "Keine passenden Tags",
    costNone: "keines der Videos, die du sehen kannst",
    costLine: "{count} · {share} von dem, was du siehst",
    // a share small enough to round to zero still isn't nothing, so it gets
    // its own reading rather than "0%". The space before the sign is German
    // typography and is non-breaking (U+00A0).
    percent: "{value} %",
    percentTiny: "<1 %",

    // the inline confirm a tag heavy enough to take a tenth of the catalog
    // has to pass first
    confirmBody:
      "„{tag}“ steckt in {count} — {share} von dem, was du gerade sehen " +
      "kannst. Schaltest du den Tag stumm, verschwinden sie überall: aus " +
      "der Videoübersicht, aus der Suche, aus den Reihen und aus ähnlichen " +
      "Videos.",
    confirmMute: "Trotzdem stummschalten",

    chipUnmuteAria: "Stummschaltung aufheben: {tag}",
    empty:
      "Noch nichts stummgeschaltet. Wähle oben einen Tag aus, und jedes " +
      "Video mit diesem Tag verlässt den Katalog.",
    unmuteAll: "Alle Stummschaltungen aufheben",

    toastMutedTitle: "„{tag}“ stummgeschaltet",
    toastMutedBody: "{count} ausgeblendet",
    toastUnmutedAll: "Alle Stummschaltungen aufgehoben"
  }
};

export default gates;
