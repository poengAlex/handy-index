import type enUS from "../en-US/aiScripts";

// The AI scripts page (/ai-scripts): every script Handy's auto-scripter has
// published. Reached only from the help page. The warning is the point of
// the page — translate its claim as strongly as English makes it: made by
// AI, checked by nobody.
const aiScripts: typeof enUS = {
  title: "Scripts IA",
  lead: "Tous les scripts créés par l'auto-scripter de Handy, les plus récents en premier.",

  warning: {
    title: "Hautement expérimental",
    body: "Chaque script de cette page a été créé par une IA et n'a été vérifié par aucun humain. Attends-toi à des erreurs : mouvements décalés, passages manquants ou faux. À utiliser à tes propres risques."
  },

  search: {
    placeholder: "Rechercher des scripts IA",
    aria: "Rechercher des scripts IA par titre de vidéo"
  },

  count: "{count} script IA | {count} scripts IA",
  /** under each title, after the length; {when} is "3 hours ago" */
  made: "Créé {when}",
  download: "Télécharger",
  showMore: "Afficher plus",

  emptyBody: "L'auto-scripter n'a encore publié aucun script.",
  errorTitle: "Impossible de charger les scripts IA",
  errorBody:
    "Le serveur des scripts IA n'a pas répondu. Réessaie dans un instant.",
  noMatchTitle: "Aucun script correspondant",
  noMatchBody: "Aucun script IA n'a de titre contenant cela."
};

export default aiScripts;
