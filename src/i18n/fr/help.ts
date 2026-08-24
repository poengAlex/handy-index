import type enUS from "../en-US/help";

// The feature tour at /help — one row per capability, grouped the way people
// actually use the site. Every `label` is a short feature name; every
// `caption` is the single sentence sitting under it. Keep captions to one
// sentence: the row truncates nothing, but a second sentence turns the list
// into documentation, which is what this page exists to replace.
const help: typeof enUS = {
  title: "Aide",
  lead: "Tout ce que ce site sait faire, au même endroit. Les lignes avec une flèche vous y emmènent directement.",

  finding: {
    title: "Trouver des vidéos",
    search: {
      label: "Rechercher et filtrer",
      caption:
        "Cherchez dans les titres, puis affinez par tag, site, acteur, VR et durée — chaque filtre vit dans l'URL, donc les résultats se partagent"
    },
    sort: {
      label: "Trier comme vous voulez",
      caption:
        "Ajoutées récemment, les mieux notées, les plus jouées et le reste — le bouton flèche à côté du tri inverse le sens"
    },
    tags: {
      label: "Nuage de tags",
      caption:
        "Tous les tags du catalogue sauf ceux que vous avez mis en sourdine, avec recherche et tri — un clic filtre la page Vidéos"
    },
    performers: {
      label: "Acteurs",
      caption:
        "Parcourez par acteur, les filmographies les plus fournies en premier"
    },
    sites: {
      label: "Sites",
      caption:
        "Tous les sites partenaires de l'index, avec leur nombre de vidéos"
    }
  },

  library: {
    title: "Votre bibliothèque",
    favorites: {
      label: "Favoris",
      caption:
        "Mettez un cœur sur une vidéo pour la garder sous la main — tout est stocké sur cet appareil"
    },
    playlists: {
      label: "Playlists",
      caption:
        "Créez, renommez et composez des playlists avec n'importe quelle vidéo"
    },
    transfer: {
      label: "Partager, importer et exporter des playlists",
      caption:
        "Déplacez une playlist sous forme de fichier, de texte JSON copiable ou de lien de partage temporaire — et importez depuis n'importe lequel des trois"
    },
    bulkDownload: {
      label: "Obtenir tous les scripts d'un coup",
      caption:
        "Un clic sur une playlist télécharge tous les scripts gratuits qu'elle contient"
    },
    quickMenu: {
      label: "Menu rapide",
      caption:
        "Clic droit (ou appui long) sur une miniature pour les favoris, les playlists, la copie du lien et le reste"
    }
  },

  scripts: {
    title: "Les scripts et votre Handy",
    free: {
      label: "Scripts gratuits",
      caption:
        "Les vidéos marquées Gratuit ont un script que vous pouvez télécharger avec votre clé de connexion Handy"
    },
    rate: {
      label: "Noter les scripts",
      caption:
        "Donnez des étoiles à un script gratuit directement sur la page vidéo"
    },
    comments: {
      label: "Commentaires sur les scripts",
      caption: "Lisez et publiez des commentaires anonymes sur les scripts"
    },
    requests: {
      label: "Demander des vidéos",
      caption:
        "Demandez un script pour n'importe quelle vidéo, et votez pour la prochaine à en recevoir un"
    }
  },

  personalize: {
    title: "À votre goût",
    previews: {
      label: "Aperçus explicites",
      caption: "Désactivés par défaut — activez les visuels dans les paramètres"
    },
    players: {
      label: "Lecteurs intégrés",
      caption:
        "Désactivés par défaut — regardez les vidéos Pornhub et xHamster directement sur la page vidéo (la lecture ne se synchronise pas avec le Handy)"
    },
    filters: {
      label: "Filtres d'orientation, de script et de vidéo",
      caption:
        "Scripts gratuits ou premium, vidéos gratuites ou premium, et qui joue dedans — dans les paramètres, ou directement dans les filtres de la page Vidéos"
    },
    mutedTags: {
      label: "Tags en sourdine",
      caption:
        "Mettez un tag en sourdine et toutes les vidéos qui le portent sortent du catalogue — clic droit sur une pastille de tag, ou gérez la liste dans les paramètres"
    },
    theme: {
      label: "Thème clair et sombre",
      caption: "Basculez depuis l'en-tête — votre choix vous suit partout"
    },
    share: {
      label: "Partage",
      caption:
        "Chaque page vidéo et chaque liste de résultats filtrée a son lien partageable"
    }
  }
};

export default help;
