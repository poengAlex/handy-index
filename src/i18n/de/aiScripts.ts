import type enUS from "../en-US/aiScripts";

// The AI scripts page (/ai-scripts): every script Handy's auto-scripter has
// published. Reached only from the help page. The warning is the point of
// the page — translate its claim as strongly as English makes it: made by
// AI, checked by nobody.
const aiScripts: typeof enUS = {
  title: "KI-Scripts",
  lead: "Alle Scripts, die der Auto-Scripter von The Handy erstellt hat, die neuesten zuerst.",

  warning: {
    title: "Hochgradig experimentell",
    body: "Jedes Script auf dieser Seite wurde von KI erstellt und von keinem Menschen geprüft. Rechne mit Fehlern: Bewegungen, die nicht zum Video passen, fehlende oder falsche Stellen. Nutzung auf eigene Gefahr."
  },

  search: {
    placeholder: "KI-Scripts suchen",
    aria: "KI-Scripts nach Videotitel suchen"
  },

  count: "{count} KI-Script | {count} KI-Scripts",
  /** under each title, after the length; {when} is "3 hours ago" */
  made: "Erstellt {when}",
  download: "Herunterladen",
  showMore: "Mehr anzeigen",

  emptyBody: "Der Auto-Scripter hat noch keine Scripts veröffentlicht.",
  errorTitle: "KI-Scripts konnten nicht geladen werden",
  errorBody:
    "Der Server für KI-Scripts hat nicht geantwortet. Versuche es gleich noch einmal.",
  noMatchTitle: "Keine passenden Scripts",
  noMatchBody: "Kein KI-Script hat einen Titel, der das enthält."
};

export default aiScripts;
