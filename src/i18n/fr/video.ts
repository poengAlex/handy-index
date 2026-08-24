import type enUS from "../en-US/video";

// The video detail page — the biggest single surface in the app: the hero and
// its chips, the action row, the opt-in partner player, the tag strip, the
// details card, the star rating, the stills gallery and its full-size viewer,
// script comments, the "more like this" shelves, and a toast for every
// outcome each of those can produce.
const video: typeof enUS = {
  missingTitle: "Vidéo introuvable",
  missingBody: "Cette vidéo n'est plus dans l'index, ou le lien est erroné.",

  // Stand-ins for catalog fields the index published empty. They are read
  // out loud (alt text, an iframe title) or land mid-sentence, so each one
  // has to work in the slot it fills — "Watch on the site" (the same reading
  // media.ts gives an unnamed partner), "Still 3 from Video".
  fallback: {
    video: "Vidéo",
    player: "Lecteur vidéo",
    site: "le site",
    thisSite: "ce site"
  },

  hero: {
    premiumChip: "Script premium"
  },

  action: {
    getScript: "Obtenir le script",
    // {site} is the partner's own name, or `fallback.site` when it has none
    watchOn: "Regarder sur {site}",
    addFavorite: "Ajouter aux favoris",
    removeFavorite: "Retirer des favoris",
    addToPlaylist: "Ajouter à une liste de lecture",
    report: "Signaler cette vidéo"
  },

  premiumNote:
    "Le script de cette vidéo est premium — il est fourni avec la vidéo sur le site partenaire.",

  playerNote:
    "Le Handy ne se synchronise pas avec la lecture ici sur IVDB — ce lecteur ne diffuse que la vidéo. Télécharge le script et lance-le depuis ton installation Handy pour des va-et-vient synchronisés.",

  tag: {
    unmuteAria: "Réactiver l'étiquette : {tag}",
    mutedTitle:
      "L'étiquette « {tag} » est en sourdine — cliquer pour la réactiver",
    browse: "Parcourir cette étiquette",
    mute: "Mettre cette étiquette en sourdine"
  },

  details: {
    title: "Détails",
    script: "Script",
    free: "Gratuit",
    premium: "Premium",
    published: "Publication",
    duration: "Durée",
    format: "Format",
    // the non-VR case: an ordinary 2D video
    formatFlat: "2D",
    site: "Site",
    scriptBy: "Script par",
    rating: "Note",
    ratingValue: "{percent} %",
    // {votes} arrives already pluralized from useFormat().count("votes", n)
    ratingWithVotes: "{percent} % · {votes}",
    scriptPlays: "Lectures du script"
  },

  rate: {
    title: "Noter ce script",
    community: "Communauté : {percent} %",
    thanks: "Merci d'avoir noté ce script",
    errorTitle: "Impossible d'enregistrer ta note"
  },

  gallery: {
    // the strip is headed "Photos" unless the only thing in it is the
    // partner's roll clip
    photosTitle: "Photos",
    previewTitle: "Aperçu",
    previewBadge: "Aperçu",
    clipAria: "Lire l'aperçu en plein écran",
    photoAria: "Ouvrir la photo {index} sur {total}",
    // an em dash rather than "de {title}", which would need to elide to
    // "d'" whenever the title starts with a vowel
    stillAlt: "Image {number} — {title}",
    previousPhoto: "Photo précédente",
    nextPhoto: "Photo suivante",
    closeViewer: "Fermer la visionneuse",
    // position counter under the full-size viewer — "3 / 12"
    viewerCount: "{index} / {total}"
  },

  comments: {
    title: "Commentaires",
    gateHint: "Les commentaires nécessitent ta connection key.",
    gateAction: "Ajouter la clé",
    inputLabel: "Ajouter un commentaire",
    submit: "Commenter",
    errorHint: "Impossible de charger les commentaires.",
    emptyHint: "Aucun commentaire pour l'instant — sois le premier.",
    postedTitle: "Commentaire envoyé",
    postedBody: "Il apparaîtra après validation.",
    postErrorTitle: "Impossible de publier ton commentaire"
  },

  more: {
    related: "Vidéos similaires",
    // "sur {site}" and not "de {site}": the partner name can start with a
    // vowel, and "de" would have to elide
    fromPartner: "Plus de vidéos sur {site}"
  },

  // Replaces ConnectionKeyDialog's generic blurb — the reason the key is
  // being asked for differs per action.
  keyPrompt: {
    script:
      "Les scripts sont liés à ton Handy. Saisis la connection key de l'application Handy pour continuer.",
    action:
      "Les notes et les commentaires sont liés à ton Handy. Saisis la connection key de l'application Handy pour continuer."
  },

  script: {
    readyTitle: "Script prêt",
    readyBody: "Le téléchargement s'est ouvert dans un nouvel onglet.",
    errorTitle: "Impossible d'obtenir le script",
    errorBody:
      "Soit la connection key est incorrecte, soit ton Handy n'est pas en ligne. Vérifie les deux, puis réessaie."
  },

  mute: {
    refusedTitle: "L'étiquette « {tag} » ne peut pas être mise en sourdine",
    refusedBody:
      "Les étiquettes d'orientation déterminent le catalogue que tu vois — cela se change dans les paramètres.",
    doneTitle: "Étiquette « {tag} » mise en sourdine",
    doneBody:
      "Elle figure dans tes étiquettes en sourdine — tu peux la réactiver à tout moment.",
    undoneTitle: "Étiquette « {tag} » réactivée"
  },

  share: {
    copiedTitle: "Lien copié",
    errorTitle: "Impossible de copier le lien"
  },

  // The report button opens a pre-filled mail draft. The reader is the one
  // who finishes and sends it, so the draft is written in their language;
  // the identifying lines keep it useful once it reaches the inbox.
  report: {
    subject: "Je souhaite signaler une vidéo",
    intro: "Je souhaite signaler une vidéo.",
    titleLine: "Titre : {title}",
    untitled: "(sans titre)",
    idLine: "ID de la vidéo : {id}",
    siteLine: "Site : {site}",
    linkLine: "Lien : {link}",
    reasonLine: "Motif du signalement :"
  }
};

export default video;
