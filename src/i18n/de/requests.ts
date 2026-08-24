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
    title: "Connection key nötig",
    boardBody:
      "Die Anfrageliste ist an The Handy gebunden. Trage den connection key aus der Handy-App ein, um Anfragen zu sehen, zu stellen und darüber abzustimmen.",
    queueBody:
      "Die Warteschlange ist an The Handy gebunden. Trage den connection key aus der Handy-App ein, um sie zu sehen.",
    addAction: "Connection key hinzufügen",
    rejectedTitle: "Connection key abgelehnt",
    rejectedBody:
      "Entweder ist der connection key falsch, oder The Handy ist nicht online. Prüfe den connection key in der Handy-App, stelle sicher, dass das Gerät eingeschaltet und verbunden ist, und gib ihn dann erneut ein.",
    rejectedAction: "Connection key erneut eingeben",
    boardDialog:
      "Die Anfrageliste ist an The Handy gebunden. Gib den connection key aus der Handy-App ein, um fortzufahren.",
    queueDialog:
      "Die Warteschlange ist an The Handy gebunden. Gib den connection key aus der Handy-App ein, um fortzufahren."
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
    queueLink: "Warteschlange ansehen",
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

  // The queue page: the same requests, ranked, read-only.
  queue: {
    title: "Anfrage-Warteschlange",
    lead: "Die Reihenfolge, in der scripts entstehen: Die Anfrage mit den meisten Stimmen bekommt zuerst ein script.",
    boardLink: "Zur Abstimmung",
    emptyTitle: "Die Warteschlange ist leer",
    emptyBody:
      "Zurzeit wartet nichts auf ein script. Frag bei den Anfragen ein Video an, dann geht es los.",
    emptyAction: "Zu den Anfragen",
    errorTitle: "Warteschlange konnte nicht geladen werden",
    noMatchBody:
      "In der Warteschlange passt nichts zu diesen Filtern. Lockere sie, um den Rest zu sehen.",
    countWaiting: "{requests} in der Warteschlange",
    countWaitingCapped:
      "{requests} in der Warteschlange (sie ist länger, als wir geladen haben)",
    countFiltered: "{requests} von {total} in der Warteschlange",
    countFilteredCapped:
      "{requests} von {total} (die Warteschlange ist länger, als wir geladen haben)"
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

  // The control row shared by both pages.
  filters: {
    searchPlaceholder: "Anfragen suchen",
    searchAria: "Anfragen nach Titel suchen",
    sortAria: "Anfragen sortieren",
    tagLabel: "Schlagwort",
    tagEmpty: "Keine passenden Schlagwörter",
    // one row of the tag picker: the tag, then how many requests carry it
    tagOption: "{tag} ({count})",
    removeTagAria: "Filter entfernen: {tag}",
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
