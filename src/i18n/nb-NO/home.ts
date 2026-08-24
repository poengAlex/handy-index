import type enUS from "../en-US/home";

const home: typeof enUS = {
  hero: {
    kicker: "Utvalgt",
    alt: "Utvalgt video",
    cta: "Se video",
    emptyTitle: "Ingenting å vise fram"
  },

  filteredOutBody:
    "Filtrene og de dempede taggene dine skjuler hele katalogen. Løsne på dem i innstillingene.",

  rows: {
    recent: "Nylig lagt til",
    favorites: "Mine favoritter",
    recentlyViewed: "Nylig sett",
    recentlyViewedHint:
      "Lagres bare i denne nettleseren — det du ser på, blir aldri sporet eller sendt videre.",
    recentlyViewedClear: "Tøm nylig sett",
    becauseYouLike: "Fordi du liker {tag}",
    topRated: "Best vurdert",
    mostPlayed: "Mest spilt",
    updated: "Nylig oppdatert"
  },

  clearHistory: {
    title: "Tømme nylig sett?",
    body: "Videoene blir liggende i katalogen — det er bare denne nettleserens liste over hva du har åpnet som forsvinner.",
    confirm: "Tøm historikken",
    done: "Nylig sett er tømt"
  }
};

export default home;
