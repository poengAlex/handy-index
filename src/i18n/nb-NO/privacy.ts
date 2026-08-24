import type enUS from "../en-US/privacy";

const privacy: typeof enUS = {
  title: "Personvern og vilkår",

  authoritativeNotice:
    "Dette er en oversettelse. Ved uenighet mellom versjonene er det den engelske som gjelder.",

  intro:
    "IVDB er en katalog over videoer som har Handy-scripts, drevet av Handy-teamet (Ohdoki AS). Denne siden forklarer hva nettstedet gjør med dataene dine — kortversjonen: så lite som mulig.",

  what: {
    title: "Hva dette nettstedet er",
    body: "Nettstedet lister opp videoer med script og lenker deg videre til scripts og til partnernettstedene der selve innholdet ligger. Ingen videoer lagres på våre servere — bare scripts. Å utforske katalogen er gratis for Handy-brukere.",
    // "offentlige", not "åpne": the sentence already ends on "åpen kildekode"
    // and "full åpenhet", and three "åpen" in a row is noise
    apiBody:
      "Nettstedet er bygget på det offentlige API-et til script-indeksen — bruk det gjerne i dine egne prosjekter: {apiDocs}. Selve nettstedet er åpen kildekode, for full åpenhet: {repo}.",
    apiDocsLink: "API-dokumentasjon",
    repoLink: "GitHub-repoet"
  },

  local: {
    title: "Hva som blir værende i denne nettleseren",
    intro:
      "Det finnes ingen brukerkontoer, ingen informasjonskapsler og ingen analyse. Alt du stiller inn lagres bare i denne nettleserens lokale lagring:",
    item: {
      consent: "svaret ditt i samtykkedialogen ved første besøk",
      previews: "innstillingen for eksplisitte forhåndsvisninger (NSFW)",
      orientation: "orienteringsfilteret",
      accessFilters: "tilgangsfiltrene dine for script og video",
      favorites: "favorittene dine",
      votes: "stemmene du har avgitt på videoforespørsler",
      connectionKey: "connection key til din Handy"
    },
    outro:
      "Åpner du nettstedet på en annen enhet — eller sletter nettleserdataene dine — er alt dette borte; det finnes ingenting å hente tilbake fra en server. Baksiden av å ikke ha analyse er at vi ikke ser feil når de skjer, så feilrapporter er ekstra velkomne."
  },

  catalog: {
    title: "Hvor katalogen kommer fra",
    body: "Katalogen, metadataene og alle scripts lastes fra API-et til script-indeksen på handyfeeling.com. Når du laster ned et script, sender inn en videoforespørsel eller stemmer på en, sendes din connection key til det API-et som autorisasjon — det er den eneste gangen noe du har skrevet inn forlater nettleseren din."
  },

  thirdParty: {
    title: "Tredjepartsnettsteder",
    body: "Videosidene lenker ut til partnernettstedene der videoene ligger. Det er tredjepartsnettsteder med vokseninnhold, og de har sine egne personvernerklæringer og sin egen analyse — når du forlater IVDB, er det deres regler som gjelder. Når eksplisitte forhåndsvisninger er på, lastes miniatyrbildene direkte fra partnernettstedene, så nettleseren din sender forespørsler som serverne deres kan logge. Er det et problem for deg, la forhåndsvisningene være av eller bruk VPN."
  },

  age: {
    title: "Aldersgrense",
    body: "Dette nettstedet indekserer vokseninnhold og er bare for voksne. Du må være 18 år eller eldre — eller ha nådd myndighetsalderen der du bor — for å bruke det."
  },

  choices: {
    title: "Endre valgene dine",
    body: "Ingenting av det du valgte i dialogen ved første besøk er endelig. Eksplisitte forhåndsvisninger, orientering og tilgangsfiltrene for script og video kan endres når som helst fra innstillingsdialogen i toppmenyen."
  },

  contact: {
    title: "Kontakt",
    // "forespørsel" is reserved for video requests everywhere else in the
    // app, so a takedown is a "henvendelse"
    body: "Spørsmål, feilrapporter eller henvendelser om fjerning av innhold: {email}"
  }
};

export default privacy;
