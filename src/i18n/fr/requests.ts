import type enUS from "../en-US/requests";

// The community side of the catalog: the voting board (submit a video URL,
// upvote what should get scripted next) and the queue that shows the same
// requests in scripting order. Both are gated on the Handy connection key,
// which is why `key.*` carries a body per surface — the sentence names the
// thing you were trying to reach.
const requests: typeof enUS = {
  // Connection-key gate and the two failure states behind it. Shown by both
  // pages; only the body differs.
  key: {
    title: "Clé de connexion requise",
    boardBody:
      "Le tableau des demandes est lié à votre Handy. Ajoutez la clé de connexion de l'application Handy pour consulter les demandes, en soumettre et voter.",
    queueBody:
      "La file d'attente est liée à votre Handy. Ajoutez la clé de connexion de l'application Handy pour la consulter.",
    addAction: "Ajouter la clé de connexion",
    rejectedTitle: "Clé de connexion refusée",
    rejectedBody:
      "Soit la clé est incorrecte, soit votre Handy n'est pas en ligne. Vérifiez la clé dans l'application Handy, assurez-vous que l'appareil est allumé et connecté, puis saisissez-la de nouveau.",
    rejectedAction: "Saisir la clé de nouveau",
    boardDialog:
      "Le tableau des demandes est lié à votre Handy. Saisissez la clé de connexion de l'application Handy pour continuer.",
    queueDialog:
      "La file d'attente est liée à votre Handy. Saisissez la clé de connexion de l'application Handy pour continuer."
  },

  // The voting board page. There are four count messages rather than one
  // stem the render bolts suffixes onto: "of {total}" only appears while
  // filters narrow the list, and the capped note only when the board is
  // longer than the single load we do. `{requests}` arrives already counted
  // and pluralized ("12 requests", from common.count.requests) — move it
  // wherever the sentence wants it.
  //
  // All four French messages end in an invariable phrase ("en attente de
  // vote", "sur {total}"): {requests} already carries its own number, and
  // nothing in the sentence may have to agree with it.
  board: {
    title: "Demandes de script",
    lead: "Votez pour les vidéos qui recevront un script — la demande la plus votée passe en premier.",
    queueLink: "Voir la file d'attente",
    emptyTitle: "Aucune demande en attente",
    emptyBody:
      "Rien n'est soumis au vote pour le moment. Demandez une vidéo ci-dessus pour lancer le mouvement.",
    errorTitle: "Impossible de charger les demandes",
    noMatchBody:
      "Aucune demande du tableau ne correspond à ces filtres. Élargissez-les pour voir le reste.",
    countAll: "{requests} en attente de vote",
    countAllCapped:
      "{requests} en attente de vote (le tableau est plus long que ce que nous avons chargé)",
    countFiltered: "{requests} sur {total}",
    countFilteredCapped:
      "{requests} sur {total} (le tableau est plus long que ce que nous avons chargé)"
  },

  // The queue page: the same requests, ranked, read-only.
  queue: {
    title: "File d'attente",
    lead: "L'ordre de création des scripts : la demande la plus votée reçoit son script en premier.",
    boardLink: "Tableau de vote",
    emptyTitle: "La file d'attente est vide",
    emptyBody:
      "Rien n'attend de script pour le moment. Demandez une vidéo depuis le tableau de vote pour lancer le mouvement.",
    emptyAction: "Aller aux demandes",
    errorTitle: "Impossible de charger la file d'attente",
    noMatchBody:
      "Aucune demande de la file d'attente ne correspond à ces filtres. Élargissez-les pour voir le reste.",
    countWaiting: "{requests} en attente",
    countWaitingCapped:
      "{requests} en attente (la file d'attente est plus longue que ce que nous avons chargé)",
    countFiltered: "{requests} sur {total} en attente",
    countFilteredCapped:
      "{requests} sur {total} (la file d'attente est plus longue que ce que nous avons chargé)"
  },

  // The submit row on the board, plus the two toasts it can raise.
  submit: {
    title: "Demander une vidéo",
    hint: "Collez le lien d'une vidéo pour laquelle vous voulez un script. Elle passe par une vérification avant d'être soumise au vote.",
    urlLabel: "URL de la vidéo",
    action: "Envoyer la demande",
    sentTitle: "Demande envoyée",
    sentBody: "Elle passe par une vérification avant d'être soumise au vote.",
    failedTitle: "Échec de la demande",
    failedBody: "L'index des scripts n'a pas accepté l'URL. Réessayez."
  },

  // The vote button and its toasts. `failedKeyBody` is the auth case: the key
  // was rotated or the device went offline mid-session.
  vote: {
    action: "Voter",
    voted: "Voté",
    successTitle: "Vote enregistré",
    successBody:
      "Les demandes les plus votées reçoivent leur script en premier.",
    failedTitle: "Échec du vote",
    failedKeyBody:
      "Soit la clé est incorrecte, soit votre Handy n'est pas en ligne — vérifiez les deux et saisissez-la de nouveau.",
    failedBody: "L'index des scripts n'a pas accepté le vote. Réessayez."
  },

  // One request tile.
  card: {
    untitled: "Demande de vidéo",
    openAria: "Ouvrir {name}",
    // the request's place in the scripting order, on a badge with room for
    // about four characters
    rank: "#{rank}"
  },

  // The control row shared by both pages.
  filters: {
    searchPlaceholder: "Rechercher une demande",
    searchAria: "Rechercher des demandes par titre",
    sortAria: "Trier les demandes",
    tagLabel: "Tag",
    tagEmpty: "Aucun tag correspondant",
    // one row of the tag picker: the tag, then how many requests carry it
    tagOption: "{tag} ({count})",
    removeTagAria: "Retirer le filtre : {tag}",
    hideVoted: "Masquer les demandes votées",
    hideVotedTitle: "Masquer les demandes pour lesquelles vous avez déjà voté",
    emptyTitle: "Aucune demande ne correspond"
  },

  // Sort picker. Keys match RequestSortKey.
  sort: {
    votes: "Les plus votées",
    newest: "Les plus récentes",
    longest: "Les plus longues",
    title: "A–Z"
  }
};

export default requests;
