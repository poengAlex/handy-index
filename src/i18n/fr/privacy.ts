import type enUS from "../en-US/privacy";

// The privacy & terms page at /privacy. Every sentence here is a factual
// claim about what the site stores, what leaves the browser and who may use
// it — translate the claim, never a looser version of it. `apiBody` and
// `contact.body` are rendered through <i18n-t> with the anchors supplied as
// named slots, so the link text lives in its own key and the sentence stays
// one unit whose word order a translator is free to move.
const privacy: typeof enUS = {
  title: "Confidentialité et conditions",

  // Shown only when the page is being read in a translation — the English
  // wording is the one the site is held to, and a reader of the Norwegian
  // needs to know that before the first claim, not after the last.
  authoritativeNotice:
    "Ceci est une traduction. En cas de divergence entre les deux versions, c'est la version anglaise qui fait foi.",

  intro:
    "IVDB est un catalogue de vidéos qui disposent de scripts Handy, tenu à jour par l'équipe Handy (Ohdoki AS). Cette page explique ce que le site fait de vos données — en résumé : le moins possible.",

  what: {
    title: "Ce qu'est ce site",
    body: "Le site répertorie les vidéos scriptées et vous renvoie vers les scripts ainsi que vers les sites partenaires qui hébergent le contenu lui-même. Aucune vidéo n'est stockée sur nos serveurs — uniquement les scripts. La navigation est gratuite pour les utilisateurs du Handy.",
    apiBody:
      "Le site repose sur l'API publique de l'index des scripts — servez-vous-en pour vos propres projets : {apiDocs}. Le site lui-même est open source, pour une transparence totale : {repo}.",
    apiDocsLink: "Documentation de l'API",
    repoLink: "Dépôt GitHub"
  },

  local: {
    title: "Ce qui reste dans ce navigateur",
    intro:
      "Il n'y a ni comptes, ni cookies, ni outils de mesure d'audience. Tout ce que vous réglez est stocké uniquement dans le stockage local de ce navigateur :",
    item: {
      consent:
        "votre réponse à la fenêtre de consentement de la première visite",
      previews: "le réglage des aperçus explicites (NSFW)",
      orientation: "le filtre d'orientation",
      accessFilters: "vos filtres d'accès aux scripts et aux vidéos",
      favorites: "vos favoris",
      votes: "les votes que vous avez exprimés sur des demandes de vidéos",
      connectionKey: "votre clé de connexion Handy"
    },
    outro:
      "Ouvrez le site sur un autre appareil — ou effacez les données de votre navigateur — et tout cela disparaît ; il n'y a rien à récupérer sur un serveur. La contrepartie de l'absence de mesure d'audience, c'est que nous ne voyons pas les erreurs se produire : les rapports de bugs sont donc particulièrement bienvenus."
  },

  catalog: {
    title: "D'où vient le catalogue",
    body: "Le catalogue, ses métadonnées et les scripts sont chargés depuis l'API de l'index des scripts de handyfeeling.com. Lorsque vous téléchargez un script, soumettez une demande de vidéo ou votez pour l'une d'elles, votre clé de connexion est envoyée à cette API comme autorisation — c'est le seul moment où quelque chose que vous avez saisi quitte votre navigateur."
  },

  thirdParty: {
    title: "Sites tiers",
    body: "Les pages vidéo renvoient vers les sites partenaires qui hébergent les vidéos. Ce sont des sites pour adultes tiers, avec leurs propres politiques de confidentialité et leurs propres outils de mesure d'audience — dès que vous quittez IVDB, ce sont leurs règles qui s'appliquent. Lorsque les aperçus explicites sont activés, les miniatures sont chargées directement depuis les sites partenaires : votre navigateur envoie donc des requêtes que leurs serveurs peuvent enregistrer. Si cela vous dérange, laissez les aperçus désactivés ou utilisez un VPN."
  },

  age: {
    title: "Condition d'âge",
    body: "Ce site répertorie du contenu pour adultes et est réservé aux adultes. Vous devez avoir 18 ans ou plus — ou l'âge de la majorité là où vous vivez — pour l'utiliser."
  },

  choices: {
    title: "Modifier vos choix",
    body: "Rien de ce que vous avez choisi dans la fenêtre de première visite n'est définitif. Les aperçus explicites, l'orientation et les filtres d'accès aux scripts et aux vidéos peuvent être modifiés à tout moment depuis la fenêtre des paramètres, dans la barre du haut."
  },

  contact: {
    title: "Contact",
    body: "Questions, rapports de bugs ou demandes de retrait : {email}"
  }
};

export default privacy;
