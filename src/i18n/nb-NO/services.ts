import type enUS from "../en-US/services";

// Typed against the English namespace: a key that exists there and not here
// is a build error, not a silent English string in the middle of a Norwegian
// page. Same contract in every nb-NO file.
const services: typeof enUS = {
  scriptDownload: {
    noFreeScript:
      "Det finnes ikke noe gratis script for denne videoen. Oppføringen i katalogen er utdatert.",
    // The name is never translated and never takes a Norwegian definite
    // suffix — "din Handy". `connection key` and `script` stay English for
    // the same reason: they are the terms the Handy app and support articles
    // use. Norwegian inflection is built around `script`, never on it — the
    // neuter agreement sits on "noe gratis", and the compound takes a hyphen
    // so the Norwegian head carries the suffix ("Script-serveren").
    unauthorized:
      "Enten er connection key feil, eller så er ikke din Handy på nett. Sjekk begge deler og prøv igjen.",
    failed: "Script-serveren svarte ikke. Sjekk nettforbindelsen og prøv igjen."
  }
};

export default services;
