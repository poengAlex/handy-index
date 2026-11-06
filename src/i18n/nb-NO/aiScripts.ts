import type enUS from "../en-US/aiScripts";

// The AI scripts page (/ai-scripts): every script Handy's auto-scripter has
// published. Reached only from the help page. The warning is the point of
// the page — translate its claim as strongly as English makes it: made by
// AI, checked by nobody.
const aiScripts: typeof enUS = {
  title: "AI-script",
  lead: "Alle script auto-scripteren til Handy har laget, nyeste først.",

  warning: {
    title: "Svært eksperimentelt",
    body: "Alle script på denne siden er laget av AI og har ikke blitt sjekket av noe menneske. Regn med feil: bevegelser i utakt, deler som mangler eller er feil. Bruk dem på eget ansvar."
  },

  search: {
    placeholder: "Søk i AI-script",
    aria: "Søk i AI-script etter videotittel"
  },

  count: "{count} AI-script | {count} AI-script",
  /** under each title, after the length; {when} is "3 hours ago" */
  made: "Laget {when}",
  download: "Last ned",
  showMore: "Vis flere",

  emptyBody: "Auto-scripteren har ikke publisert noen script ennå.",
  errorTitle: "Kunne ikke laste AI-script",
  errorBody: "Serveren for AI-script svarte ikke. Prøv igjen om litt.",
  noMatchTitle: "Ingen script passer",
  noMatchBody: "Ingen AI-script har en tittel som inneholder det."
};

export default aiScripts;
