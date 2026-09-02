import type enUS from "../en-US/help";

// The feature tour at /help — one row per capability, grouped the way people
// actually use the site. Every `label` is a short feature name; every
// `caption` is the single sentence sitting under it. Keep captions to one
// sentence: the row truncates nothing, but a second sentence turns the list
// into documentation, which is what this page exists to replace.
const help: typeof enUS = {
  title: "Aide",
  lead: "Tout ce que ce site sait faire, au même endroit. Les lignes avec une flèche t'y emmènent directement.",

  finding: {
    title: "Trouver des vidéos",
    search: {
      label: "Rechercher et filtrer",
      caption:
        "Cherche dans les titres, puis affine par étiquette, site, acteur, VR et durée — chaque filtre vit dans l'URL, donc les résultats se partagent"
    },
    sort: {
      label: "Trier comme tu veux",
      caption:
        "Ajoutées récemment, les mieux notées, les plus jouées et le reste — le bouton flèche à côté du tri inverse le sens"
    },
    tags: {
      label: "Nuage d'étiquettes",
      caption:
        "Toutes les étiquettes du catalogue sauf celles que tu as mises en sourdine, avec recherche et tri — un clic filtre la page Vidéos"
    },
    performers: {
      label: "Acteurs",
      caption:
        "Parcours par acteur, les filmographies les plus fournies en premier"
    },
    sites: {
      label: "Sites",
      caption:
        "Tous les sites partenaires de l'index, avec leur nombre de vidéos"
    }
  },

  library: {
    title: "Ta bibliothèque",
    favorites: {
      label: "Favoris",
      caption:
        "Mets un cœur sur une vidéo pour la garder sous la main — tout est stocké sur cet appareil"
    },
    playlists: {
      label: "Listes de lecture",
      caption:
        "Crée, renomme et compose des listes de lecture avec n'importe quelle vidéo"
    },
    transfer: {
      label: "Partager, importer et exporter des listes de lecture",
      caption:
        "Déplace une liste de lecture sous forme de fichier, de texte JSON copiable ou de lien de partage temporaire — et importe depuis n'importe lequel des trois"
    },
    bulkDownload: {
      label: "Obtenir tous les scripts d'un coup",
      caption:
        "Un clic sur une liste de lecture télécharge tous les scripts gratuits qu'elle contient"
    },
    quickMenu: {
      label: "Menu rapide",
      caption:
        "Clic droit (ou appui long) sur une miniature pour les favoris, les listes de lecture, la copie du lien et le reste"
    }
  },

  scripts: {
    title: "Les scripts et ton Handy",
    free: {
      label: "Scripts gratuits",
      caption:
        "Les vidéos marquées Gratuit ont un script que tu peux télécharger avec ta connection key Handy"
    },
    rate: {
      label: "Noter les scripts",
      caption:
        "Donne des étoiles à un script gratuit directement sur la page vidéo"
    },
    comments: {
      label: "Commentaires sur les scripts",
      caption: "Lis et publie des commentaires anonymes sur les scripts"
    },
    requests: {
      label: "Demander des vidéos",
      caption:
        "Demande un script pour n'importe quelle vidéo, et vote pour la prochaine à en recevoir un"
    }
  },

  personalize: {
    title: "À ton goût",
    previews: {
      label: "Aperçus explicites",
      caption: "Désactivés par défaut — active les visuels dans les paramètres"
    },
    players: {
      label: "Lecteurs intégrés",
      caption:
        "Désactivés par défaut — regarde les vidéos Pornhub et xHamster directement sur la page vidéo (la lecture ne se synchronise pas avec le Handy)"
    },
    filters: {
      label: "Filtres d'orientation, de script et de vidéo",
      caption:
        "Scripts gratuits ou premium, vidéos gratuites ou premium, et qui joue dedans — dans les paramètres, ou directement dans les filtres de la page Vidéos"
    },
    mutedTags: {
      label: "Étiquettes en sourdine",
      caption:
        "Mets une étiquette en sourdine et toutes les vidéos qui la portent sortent du catalogue — clic droit sur une pastille d'étiquette, ou gère la liste dans les paramètres"
    },
    theme: {
      label: "Thème clair et sombre",
      caption: "Bascule depuis l'en-tête — ton choix te suit partout"
    },
    share: {
      label: "Partage",
      caption:
        "Chaque page vidéo et chaque liste de résultats filtrée a son lien partageable"
    }
  },

  about: {
    title: "À propos du site",
    appCaption: "Ce qu'est ce site, qui le fait et quelle version tu utilises",
    changelogCaption:
      "Tout ce qui a changé sur le site, du plus récent au plus ancien",
    privacyCaption:
      "Ce qui est stocké, ce qui quitte ton navigateur et la condition d'âge"
  }
};

export default help;
