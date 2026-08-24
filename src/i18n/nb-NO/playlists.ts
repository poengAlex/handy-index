import type enUS from "../en-US/playlists";

const playlists: typeof enUS = {
  title: "Spillelister",

  newLabel: "Ny spilleliste",
  newPlaceholder: "f.eks. Helgefavoritter",
  nameLabel: "Navn på spillelisten",
  importHint: "Importer en spilleliste som er eksportert fra dette nettstedet",

  emptyTitle: "Ingen spillelister ennå",
  emptyBody:
    "Opprett en her, eller bruk spillelisteknappen på en videoside for å starte en ny fra en video du liker.",

  import: {
    title: "Importer spilleliste",
    placeholder:
      "Lim inn en spillelisteeksport (JSON) eller en pastes.dev-lenke",
    inputAria: "Spillelisteeksport eller delingslenke",
    chooseFile: "Velg fil…",
    defaultName: "Importert spilleliste",
    doneTitle: "Spilleliste importert",
    doneBody: "«{name}» — {count} video. | «{name}» — {count} videoer.",
    failedTitle: "Klarte ikke å importere",
    error: {
      // "paste service" is pastes.dev; to the user it is just the service the
      // share link lives on, so it gets the plainer Norwegian name
      unreachable: "Fikk ikke kontakt med delingstjenesten.",
      linkDead: "Delingslenken svarer ikke — den kan ha utløpt.",
      notJson: "Filen er ikke gyldig JSON.",
      notExport: "Filen er ikke en spillelisteeksport.",
      tooNew:
        "Filen ble eksportert fra en nyere versjon av dette nettstedet. Last inn siden på nytt og prøv igjen.",
      malformed: "Spillelisten i filen har feil format.",
      unknown: "Noe gikk galt under innlesingen av eksporten."
    }
  },

  detail: {
    notFoundTitle: "Fant ikke spillelisten",
    notFoundBody:
      "Denne spillelisten finnes ikke lenger, eller så er lenken feil.",
    notFoundAction: "Alle spillelister",
    emptyTitle: "Ingenting her ennå",
    emptyBody:
      "Bruk spillelisteknappen på en videoside for å legge til videoer her.",
    edit: "Rediger",
    removeVideo: "Fjern fra spillelisten",
    renameTitle: "Gi spillelisten nytt navn",
    deleteTitle: "Slette «{name}»?",
    deleteBody:
      "Videoene blir liggende i katalogen — det er bare spillelisten som forsvinner.",
    deleteConfirm: "Slett spillelisten",
    deletedTitle: "Spilleliste slettet",
    deletedBody: "«{name}» er borte."
  },

  share: {
    title: "Del spilleliste",
    open: "Del spillelisten",
    openHint: "Del eller eksporter denne spillelisten",
    exportAria: "Spillelisteeksport som JSON",
    linkAria: "Delingslenke",
    copyLink: "Kopier delingslenken",
    note: "Alle med lenken kan importere denne spillelisten. Lenken er midlertidig — den utløper etter omtrent 90 dager.",
    copyJson: "Kopier JSON",
    saveFile: "Lagre fil",
    createLink: "Lag delingslenke",
    newLink: "Ny delingslenke",
    jsonCopied: "JSON kopiert",
    jsonCopyFailed: "Klarte ikke å kopiere JSON-en",
    linkCopied: "Delingslenke kopiert",
    linkCopiedBody: "Alle med lenken kan importere denne spillelisten.",
    linkCopyFailed: "Klarte ikke å kopiere lenken",
    linkCreated: "Delingslenke laget",
    linkFailedTitle: "Klarte ikke å lage delingslenke",
    linkFailedBody: "Delingstjenesten svarte ikke. Kopier JSON-en i stedet."
  },

  bulk: {
    label: "Hent alle skript ({count})",
    progress: "Henter {done}/{total}…",
    // "Handy-en din" with a hyphen, same as services.ts: the definite ending
    // on an English brand name reads as a typo without it
    keyPrompt:
      "Skript er bundet til Handy-en din. Skriv inn tilkoblingsnøkkelen fra Handy-appen for å fortsette.",
    failedTitle: "Klarte ikke å hente skriptene",
    doneTitle: "Skript lastet ned",
    // "skript" is neuter and one syllable, so the plural is unmarked — both
    // sides of the | are meant to be identical
    doneBody: "{count} skript lagret. | {count} skript lagret.",
    partialBody: "{saved} lagret, {failed} mislyktes."
  },

  add: {
    title: "Legg til i spilleliste",
    empty: "Ingen spillelister ennå — opprett din første nedenfor."
  }
};

export default playlists;
