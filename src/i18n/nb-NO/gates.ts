import type enUS from "../en-US/gates";

const gates: typeof enUS = {
  notice: {
    hiddenByMuted: "{count} skjult av dempede tagger",
    hiddenByOrientation: "{count} skjult av {orientation}-filteret",
    hiddenByScript: "{count} skjult av premiumskriptfilteret",
    hiddenByVideo: "{count} skjult av premiumvideofilteret",

    hiddenTotal: "{count} skjult",
    byMuted: "{count} av dempede tagger",
    byOrientation: "{count} av {orientation}-filteret",
    byScript: "{count} av premiumskriptfilteret",
    byVideo: "{count} av premiumvideofilteret"
  },

  muted: {
    title: "Dempede tagger",
    lead:
      "Dempede tagger forsvinner fra katalogen — de dukker ikke opp i " +
      "utforsking, søk, rader eller relaterte videoer. Demping treffer bare " +
      "eksakte tagger, så «gay» demper ikke «gay massage». Favoritter og " +
      "spillelister er dine, så de blir værende.",

    pickerLabel: "Demp en tagg",
    pickerEmpty: "Ingen tagger traff søket",
    costNone: "ingen av videoene du kan se",
    costLine: "{count} · {share} av det du ser",
    // Norwegian sets a space between the number and the percent sign
    percent: "{value} %",
    percentTiny: "<1 %",

    confirmBody:
      "«{tag}» finnes på {count} — {share} av det du kan se akkurat nå. " +
      "Demper du den, forsvinner de overalt: fra utforsking, søk, rader og " +
      "relaterte videoer.",
    confirmMute: "Demp likevel",

    chipUnmuteAria: "Fjern demping av taggen {tag}",
    empty:
      "Ingenting er dempet ennå. Velg en tagg over, så forsvinner alle " +
      "videoer med den ut av katalogen.",
    unmuteAll: "Fjern all demping",

    toastMutedTitle: "Dempet «{tag}»",
    toastMutedBody: "{count} skjult",
    toastUnmutedAll: "All demping er fjernet"
  }
};

export default gates;
