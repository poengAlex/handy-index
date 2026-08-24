import type enUS from "../en-US/requests";

const requests: typeof enUS = {
  key: {
    title: "Du trenger en tilkoblingsnøkkel",
    boardBody:
      "Avstemningen er knyttet til Handy-en din. Legg inn tilkoblingsnøkkelen fra Handy-appen for å se forespørsler, sende inn nye og stemme.",
    queueBody:
      "Køen er knyttet til Handy-en din. Legg inn tilkoblingsnøkkelen fra Handy-appen for å se den.",
    addAction: "Legg inn tilkoblingsnøkkel",
    rejectedTitle: "Tilkoblingsnøkkelen ble avvist",
    rejectedBody:
      "Enten er nøkkelen feil, eller så er ikke Handy-en din på nett. Sjekk nøkkelen i Handy-appen, pass på at enheten er slått på og tilkoblet, og skriv den inn på nytt.",
    rejectedAction: "Skriv inn nøkkelen på nytt",
    boardDialog:
      "Avstemningen er bundet til Handy-en din. Skriv inn tilkoblingsnøkkelen fra Handy-appen for å fortsette.",
    queueDialog:
      "Køen er bundet til Handy-en din. Skriv inn tilkoblingsnøkkelen fra Handy-appen for å fortsette."
  },

  board: {
    title: "Skriptforespørsler",
    lead: "Stem på hvilke videoer som skal skriptes neste gang — forespørselen med flest stemmer går først.",
    queueLink: "Se køen",
    emptyTitle: "Ingen forespørsler venter",
    emptyBody:
      "Ingenting er til avstemning akkurat nå. Be om en video i feltet over, så kommer det i gang.",
    errorTitle: "Kunne ikke laste forespørslene",
    noMatchBody:
      "Ingenting i avstemningen passer med filtrene. Fjern noen av dem for å se resten.",
    countAll: "{requests} til avstemning",
    // a literal "lengre enn det vi lastet" tells the reader nothing; the
    // point is that the number in front of it isn't the whole list
    countAllCapped:
      "{requests} til avstemning (vi har ikke lastet inn hele listen)",
    countFiltered: "{requests} av {total}",
    countFilteredCapped:
      "{requests} av {total} (vi har ikke lastet inn hele listen)"
  },

  queue: {
    title: "Forespørselskø",
    lead: "Rekkefølgen videoene skriptes i: forespørselen med flest stemmer kommer først.",
    boardLink: "Se avstemningen",
    emptyTitle: "Køen er tom",
    emptyBody:
      "Ingenting venter på et skript akkurat nå. Gå til avstemningen og be om en video, så kommer køen i gang.",
    // it goes to the voting board, so it is named after the destination —
    // the same word the button at the top of the page uses
    emptyAction: "Gå til avstemningen",
    errorTitle: "Kunne ikke laste køen",
    noMatchBody:
      "Ingenting i køen passer med filtrene. Fjern noen av dem for å se resten.",
    countWaiting: "{requests} venter",
    countWaitingCapped: "{requests} venter (vi har ikke lastet inn hele køen)",
    countFiltered: "{requests} av {total} venter",
    countFilteredCapped:
      "{requests} av {total} venter (vi har ikke lastet inn hele køen)"
  },

  submit: {
    title: "Be om en video",
    hint: "Lim inn en lenke til en video du vil ha skriptet. Den må gjennom verifisering før den dukker opp til avstemning.",
    urlLabel: "Video-URL",
    action: "Be om video",
    sentTitle: "Forespørselen er sendt",
    sentBody: "Den må gjennom verifisering før den dukker opp til avstemning.",
    // same shape as the other failures in the app: "Kunne ikke …"
    failedTitle: "Klarte ikke å sende forespørselen",
    failedBody: "Skriptindeksen godtok ikke URL-en. Prøv igjen."
  },

  vote: {
    action: "Stem",
    voted: "Stemt",
    successTitle: "Stemmen er registrert",
    successBody: "Forespørslene med flest stemmer skriptes først.",
    failedTitle: "Klarte ikke å registrere stemmen",
    failedKeyBody:
      "Enten er nøkkelen feil, eller så er ikke Handy-en din på nett — sjekk begge deler og skriv den inn på nytt.",
    failedBody: "Skriptindeksen godtok ikke stemmen. Prøv igjen."
  },

  card: {
    untitled: "Videoforespørsel",
    openAria: "Åpne {name}",
    rank: "{rank}."
  },

  filters: {
    searchPlaceholder: "Søk i forespørsler",
    searchAria: "Søk i forespørsler etter tittel",
    sortAria: "Sorter forespørsler",
    tagLabel: "Tagg",
    tagEmpty: "Ingen tagger traff søket",
    tagOption: "{tag} ({count})",
    removeTagAria: "Fjern filter: {tag}",
    // "Skjul stemte" is the English shape: you vote *på* a request in
    // Norwegian, so there is no such thing as "en stemt forespørsel". The
    // control row wraps rather than carry a phrase that doesn't exist.
    hideVoted: "Skjul dem jeg har stemt på",
    hideVotedTitle: "Skjul forespørslene du allerede har stemt på",
    emptyTitle: "Ingen treff blant forespørslene"
  },

  sort: {
    votes: "Flest stemmer",
    newest: "Nyeste",
    longest: "Lengst",
    // the Norwegian alphabet ends at Å, so the A–Z shorthand does too
    title: "A–Å"
  }
};

export default requests;
