import type enUS from "../en-US/library";

const library: typeof enUS = {
  favorites: {
    title: "Mine favoritter",
    count: "{count} lagret",
    emptyTitle: "Ingen favoritter ennå",
    emptyBody:
      "Trykk på hjerteknappen på en videoside, så lagres videoen her for rask tilgang."
  },

  history: {
    title: "Nylig sett",
    note: "Lagres bare i denne nettleseren — det du ser på, blir aldri sporet eller sendt videre.",
    emptyTitle: "Ingenting sett ennå",
    emptyBody: "Videoer du åpner huskes her, bare på denne enheten.",
    clearTitle: "Tømme nylig sett?",
    clearBody:
      "Videoene blir liggende i katalogen — det er bare denne nettleserens liste over hva du har åpnet som forsvinner.",
    clearConfirm: "Tøm historikken",
    clearedToast: "Nylig sett er tømt"
  }
};

export default library;
