import type enUS from "../en-US/requests";

// The community side of the catalog: one voting board that is also the
// queue — submit a video URL, upvote what should get scripted next, and read
// each tile's rank as its place in the scripting order. The board is gated on
// the Handy connection key, which is what `key.*` covers.
const requests: typeof enUS = {
  // Connection-key gate and the two failure states behind it.
  key: {
    title: "Connection key requise",
    boardBody:
      "Le tableau des demandes est lié à ton Handy. Ajoute la connection key de l'application Handy pour consulter les demandes, en soumettre et voter.",
    addAction: "Ajouter la connection key",
    rejectedTitle: "Connection key refusée",
    rejectedBody:
      "Soit la clé est incorrecte, soit ton Handy n'est pas en ligne. Vérifie la clé dans l'application Handy, assure-toi que l'appareil est allumé et connecté, puis saisis-la de nouveau.",
    rejectedAction: "Saisir la clé de nouveau",
    boardDialog:
      "Le tableau des demandes est lié à ton Handy. Saisis la connection key de l'application Handy pour continuer."
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
    lead: "Vote pour les vidéos qui recevront un script — la demande la plus votée passe en premier.",
    emptyTitle: "Aucune demande en attente",
    emptyBody:
      "Rien n'est soumis au vote pour le moment. Demande une vidéo ci-dessus pour lancer le mouvement.",
    errorTitle: "Impossible de charger les demandes",
    noMatchBody:
      "Aucune demande du tableau ne correspond à ces filtres. Élargis-les pour voir le reste.",
    countAll: "{requests} en attente de vote",
    countAllCapped:
      "{requests} en attente de vote (le tableau est plus long que ce que nous avons chargé)",
    countFiltered: "{requests} sur {total}",
    countFilteredCapped:
      "{requests} sur {total} (le tableau est plus long que ce que nous avons chargé)"
  },

  // The submit row on the board, plus the two toasts it can raise.
  submit: {
    title: "Demander une vidéo",
    hint: "Colle le lien d'une vidéo pour laquelle tu veux un script. Elle passe par une vérification avant d'être soumise au vote.",
    urlLabel: "URL de la vidéo",
    action: "Envoyer la demande",
    sentTitle: "Demande envoyée",
    sentBody: "Elle passe par une vérification avant d'être soumise au vote.",
    failedTitle: "Échec de la demande",
    failedBody: "L'index des scripts n'a pas accepté l'URL. Réessaie."
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
      "Soit la clé est incorrecte, soit ton Handy n'est pas en ligne — vérifie les deux et saisis-la de nouveau.",
    failedBody: "L'index des scripts n'a pas accepté le vote. Réessaie."
  },

  // One request tile.
  card: {
    untitled: "Demande de vidéo",
    openAria: "Ouvrir {name}",
    // the request's place in the scripting order, on a badge with room for
    // about four characters
    rank: "#{rank}"
  },

  // The control row above the list.
  filters: {
    searchPlaceholder: "Rechercher une demande",
    searchAria: "Rechercher des demandes par titre",
    sortAria: "Trier les demandes",
    tagLabel: "Étiquette",
    tagEmpty: "Aucune étiquette correspondante",
    // one row of the tag picker: the tag, then how many requests carry it
    tagOption: "{tag} ({count})",
    removeTagAria: "Retirer le filtre : {tag}",
    performerLabel: "Acteur",
    performerEmpty: "Aucun acteur correspondant",
    // one row of the performer picker: who they are, then how many
    // requests name them
    performerOption: "{name} ({count})",
    removePerformerAria: "Retirer le filtre : {name}",
    hideVoted: "Masquer les demandes votées",
    hideVotedTitle: "Masquer les demandes pour lesquelles tu as déjà voté",
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
