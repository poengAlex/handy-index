import type enUS from "../en-US/requests";

// The community side of the catalog: one voting board that is also the
// queue — submit a video URL, upvote what should get scripted next, and read
// each tile's rank as its place in the scripting order. The board is gated on
// the Handy connection key, which is what `key.*` covers.
const requests: typeof enUS = {
  // Connection-key gate and the two failure states behind it.
  key: {
    title: "Connection key nötig",
    boardBody:
      "Die Anfrageliste ist an The Handy gebunden. Trage den connection key aus der Handy-App ein, um Anfragen zu sehen, zu stellen und darüber abzustimmen.",
    addAction: "Connection key hinzufügen",
    rejectedTitle: "Connection key abgelehnt",
    rejectedBody:
      "Entweder ist der connection key falsch, oder The Handy ist nicht online. Prüfe den connection key in der Handy-App, stelle sicher, dass das Gerät eingeschaltet und verbunden ist, und gib ihn dann erneut ein.",
    rejectedAction: "Connection key erneut eingeben",
    boardDialog:
      "Die Anfrageliste ist an The Handy gebunden. Gib den connection key aus der Handy-App ein, um fortzufahren."
  },

  // The voting board page. There are four count messages rather than one
  // stem the render bolts suffixes onto: "of {total}" only appears while
  // filters narrow the list, and the capped note only when the board is
  // longer than the single load we do. `{requests}` arrives already counted
  // and pluralized ("12 requests", from common.count.requests) — move it
  // wherever the sentence wants it.
  board: {
    title: "Script-Anfragen",
    lead: "Stimme ab, welche Videos als Nächstes ein script bekommen — die Anfrage mit den meisten Stimmen kommt zuerst dran.",
    emptyTitle: "Keine offenen Anfragen",
    emptyBody:
      "Zurzeit steht nichts zur Abstimmung. Frag oben ein Video an, dann geht es los.",
    errorTitle: "Anfragen konnten nicht geladen werden",
    noMatchBody:
      "In der Anfrageliste passt nichts zu diesen Filtern. Lockere sie, um den Rest zu sehen.",
    countAll: "{requests} zur Abstimmung",
    countAllCapped:
      "{requests} zur Abstimmung (die Liste ist länger, als wir geladen haben)",
    countFiltered: "{requests} von {total}",
    countFilteredCapped:
      "{requests} von {total} (die Liste ist länger, als wir geladen haben)"
  },

  // The submit row on the board, plus the two toasts it can raise.
  submit: {
    title: "Video anfragen",
    hint: "Füge den Link zu einem Video ein, für das du ein script möchtest. Die Anfrage wird geprüft, bevor sie zur Abstimmung erscheint.",
    urlLabel: "Video-URL",
    action: "Video anfragen",
    sentTitle: "Anfrage gesendet",
    sentBody: "Sie wird geprüft, bevor sie zur Abstimmung erscheint.",
    failedTitle: "Anfrage fehlgeschlagen",
    failedBody:
      "Der Script-Index hat die URL nicht angenommen. Versuche es erneut."
  },

  // The vote button and its toasts. `failedKeyBody` is the auth case: the key
  // was rotated or the device went offline mid-session.
  vote: {
    action: "Abstimmen",
    voted: "Abgestimmt",
    successTitle: "Stimme gezählt",
    successBody: "Anfragen mit den meisten Stimmen bekommen zuerst ein script.",
    failedTitle: "Abstimmung fehlgeschlagen",
    failedKeyBody:
      "Entweder ist der connection key falsch, oder The Handy ist nicht online — prüfe beides und gib ihn erneut ein.",
    failedBody:
      "Der Script-Index hat die Stimme nicht angenommen. Versuche es erneut."
  },

  // One request tile.
  card: {
    untitled: "Video-Anfrage",
    openAria: "{name} öffnen",
    // the request's place in the scripting order, on a badge with room for
    // about four characters
    rank: "#{rank}"
  },

  // The control row above the list.
  filters: {
    searchPlaceholder: "Anfragen suchen",
    searchAria: "Anfragen nach Titel suchen",
    sortAria: "Anfragen sortieren",
    tagLabel: "Schlagwort",
    tagEmpty: "Keine passenden Schlagwörter",
    // one row of the tag picker: the tag, then how many requests carry it
    tagOption: "{tag} ({count})",
    removeTagAria: "Filter entfernen: {tag}",
    performerLabel: "Darsteller",
    performerEmpty: "Keine passenden Darsteller",
    // one row of the performer picker: who they are, then how many
    // requests name them
    performerOption: "{name} ({count})",
    removePerformerAria: "Filter entfernen: {name}",
    hideVoted: "Abgestimmte ausblenden",
    hideVotedTitle: "Anfragen ausblenden, für die du schon abgestimmt hast",
    emptyTitle: "Keine passenden Anfragen"
  },

  // Sort picker. Keys match RequestSortKey.
  sort: {
    votes: "Meiste Stimmen",
    newest: "Neueste",
    longest: "Längste",
    title: "A–Z"
  }
};

export default requests;
