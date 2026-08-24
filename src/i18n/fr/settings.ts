import type enUS from "../en-US/settings";

// The settings modal and the three dialogs that hang off it: clear-data, the
// first-visit consent gate, and the connection-key prompt. The language
// picker inside settings is `common.language.*`, because the same wording is
// used wherever a locale is offered.
const settings: typeof enUS = {
  title: "Paramètres",

  // the toggle list at the top of the modal
  display: {
    darkModeLabel: "Mode sombre",
    darkModeCaption: "Utiliser le thème de couleurs sombre",
    nsfwLabel: "Aperçus explicites",
    nsfwCaption: "Afficher les vraies images au lieu de vignettes neutres",
    playersLabel: "Lecteurs intégrés",
    playersCaption:
      "Lire les vidéos Pornhub et xHamster directement sur la page vidéo",
    fullWidthLabel: "Pleine largeur",
    fullWidthCaption: "Utiliser tout l'écran au lieu d'une colonne centrée",
    backgroundLabel: "Fond animé",
    backgroundCaption:
      "Afficher le dégradé doux et mouvant derrière chaque page"
  },

  // The muted-tags row. `caption` pluralizes over the count itself rather
  // than taking a pre-counted noun phrase: Bokmål inflects the adjective with
  // the noun ("1 dempet tagg" / "2 dempede tagger"), which a `{tags}` slot
  // cannot express
  // ("3 tags") rather than a bare number, so the pluralization stays in
  // `common.count.tags` and this message only carries the verb.
  muted: {
    label: "Tags en sourdine",
    caption: "{count} tag en sourdine | {count} tags en sourdine",
    empty: "Rien en sourdine"
  },

  orientationTitle: "Orientation",

  access: {
    title: "Accès",
    premiumScriptsLabel: "Scripts premium",
    premiumScriptsCaption:
      "Inclure les vidéos dont le script est payant chez un partenaire",
    premiumVideosLabel: "Vidéos premium",
    premiumVideosCaption: "Inclure les vidéos payantes chez un partenaire"
  },

  previews: {
    title: "Aperçus des cartes",
    hint:
      "Survolez une carte — ou faites glisser un doigt dessus — pour la " +
      "prévisualiser. Cliquez sur un libellé pour rétablir la vitesse " +
      "d'origine.",
    imageSpeed: "Vitesse des images",
    clipSpeed: "Vitesse des clips"
  },

  // shared by the settings field and the connection-key prompt
  connectionKey: {
    label: "Clé de connexion",
    placeholder: "ex. a1B2c3D4e5",
    hint: "Votre clé de connexion Handy, utilisée pour télécharger les scripts."
  },

  clearDataAction: "Effacer les données…",

  // ClearDataDialog. Every row names its own toast instead of sharing one
  // "{thing} cleared" template: the verb already differs per row in English
  // (a key is deleted, preferences are reset), and more so in Norwegian.
  clear: {
    title: "Effacer les données enregistrées",
    lead:
      "Tout ce que ce site retient est conservé dans ce navigateur. Effacez " +
      "les éléments un par un, ou tout d'un coup.",
    clearAll: "Effacer toutes les données",
    allToast: "Toutes les données locales ont été effacées",

    recentLabel: "Vues récemment",
    recentToast: "Historique effacé",
    favoritesLabel: "Favoris",
    favoritesToast: "Favoris effacés",
    playlistsLabel: "Playlists",
    playlistsToast: "Playlists effacées",
    mutedToast: "Tags en sourdine effacés",

    // the two halves of the ratings row's caption, printed side by side
    votesLabel: "Notes et votes",
    votesEmpty: "Rien d'enregistré",
    votesToast: "Notes et votes effacés",
    ratingCount: "{count} note de script | {count} notes de script",
    requestVoteCount:
      "{count} vote sur une demande | {count} votes sur des demandes",

    keySaved: "Enregistrée sur cet appareil",
    keyUnset: "Non définie",
    keyToast: "Clé de connexion effacée",

    preferencesLabel: "Préférences d'affichage",
    preferencesCaption:
      "Aperçus explicites, orientation, filtres d'accès, vitesses " +
      "d'aperçu, fond animé",
    preferencesToast: "Préférences d'affichage réinitialisées"
  },

  // ConsentDialog — the first-visit age gate. Legally load-bearing: every
  // condition the English states has to survive into every translation.
  consent: {
    title: "Avant de commencer",
    body:
      "IVDB répertorie des vidéos interactives pour adultes, avec des " +
      "scripts pour The Handy. Confirmez que vous avez 18 ans ou plus pour " +
      "naviguer avec les aperçus explicites. Continuez sans confirmer et les " +
      "aperçus restent masqués — vous pouvez changer cela à tout moment dans " +
      "les paramètres. Vos préférences sont conservées uniquement dans ce " +
      "navigateur.",
    decline: "Continuer sans les aperçus",
    accept: "J'ai 18 ans ou plus"
  },

  // ConnectionKeyDialog — shown when an action needs a key that isn't set
  keyPrompt: {
    title: "Clé de connexion requise",
    body:
      "Cette action est liée à votre Handy. Saisissez la clé de connexion " +
      "de l'application Handy pour continuer.",
    hint:
      "Votre Handy doit être allumé et en ligne pour que la clé fonctionne " +
      "— un appareil hors ligne échoue exactement comme une clé erronée.",
    save: "Enregistrer et continuer"
  }
};

export default settings;
