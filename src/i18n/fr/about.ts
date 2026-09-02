import type enUS from "../en-US/about";

const about: typeof enUS = {
  title: "À propos d'IVDB",
  body: "IVDB est un catalogue de vidéos qui ont des scripts Handy. Il est fait par l'équipe Handy chez Ohdoki AS, et il est gratuit.",
  beta: "Cette version est encore une bêta. Certaines choses sont inachevées et d'autres sont sûrement cassées — si tu en trouves une, on aimerait le savoir.",

  version: "Version {version}",
  built: "Compilé le {date}",
  copyright: "© {year} Ohdoki AS",

  changelog: {
    title: "Nouveautés",
    lead: "Les changements du site, du plus récent au plus ancien.",
    englishOnly: "Cette liste n'existe qu'en anglais.",
    errorTitle: "Impossible de charger la liste des changements",
    errorBody:
      "La liste ne s'est pas chargée. Vérifie ta connexion et réessaie."
  }
};

export default about;
