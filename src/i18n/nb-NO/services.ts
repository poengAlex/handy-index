import type enUS from "../en-US/services";

// Typed against the English namespace: a key that exists there and not here
// is a build error, not a silent English string in the middle of a Norwegian
// page. Same contract in every nb-NO file.
const services: typeof enUS = {
  scriptDownload: {
    noFreeScript:
      "Det finnes ikke noe gratis skript for denne videoen. Oppføringen i katalogen er utdatert.",
    // "Handy-en" with a hyphen: the definite ending on an English brand name
    // reads as a typo without it, and the name itself is never translated.
    unauthorized:
      "Enten er tilkoblingsnøkkelen feil, eller så er ikke Handy-en din på nett. Sjekk begge deler og prøv igjen.",
    failed: "Skriptserveren svarte ikke. Sjekk nettforbindelsen og prøv igjen."
  }
};

export default services;
