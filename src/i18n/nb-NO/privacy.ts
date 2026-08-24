import type enUS from "../en-US/privacy";

const privacy: typeof enUS = {
  title: "Personvern og vilkår",

  authoritativeNotice:
    "Dette er en oversettelse. Ved uenighet mellom versjonene er det den engelske som gjelder.",

  intro:
    "IVDB er en katalog over videoer som har Handy-skript, drevet av Handy-teamet (Ohdoki AS). Denne siden forklarer hva nettstedet gjør med dataene dine — kortversjonen: så lite som mulig.",

  what: {
    title: "Hva dette nettstedet er",
    body: "Nettstedet lister opp videoer med skript og lenker deg videre til skriptene og til partnernettstedene der selve innholdet ligger. Ingen videoer lagres på våre servere — bare skriptene. Å utforske katalogen er gratis for Handy-brukere.",
    // "offentlige", ikke "åpne": setningen ender på "åpen kildekode" og
    // "full åpenhet", og tre åpne på rad blir støy
    apiBody:
      "Nettstedet er bygget på det offentlige API-et til skriptindeksen — bruk det gjerne i dine egne prosjekter: {apiDocs}. Selve nettstedet er åpen kildekode, for full åpenhet: {repo}.",
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
      accessFilters: "tilgangsfiltrene dine for skript og video",
      favorites: "favorittene dine",
      votes: "stemmene du har avgitt på videoforespørsler",
      connectionKey: "tilkoblingsnøkkelen til Handy-en din"
    },
    outro:
      "Åpner du nettstedet på en annen enhet — eller sletter nettleserdataene dine — er alt dette borte; det finnes ingenting å hente tilbake fra en server. Baksiden av å ikke ha analyse er at vi ikke ser feil når de skjer, så feilrapporter er ekstra velkomne."
  },

  catalog: {
    title: "Hvor katalogen kommer fra",
    body: "Katalogen, metadataene og skriptene lastes fra skriptindeks-API-et på handyfeeling.com. Når du laster ned et skript, sender inn en videoforespørsel eller stemmer på en, sendes tilkoblingsnøkkelen din til det API-et som autorisasjon — det er den eneste gangen noe du har skrevet inn forlater nettleseren din."
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
    body: "Ingenting av det du valgte i dialogen ved første besøk er endelig. Eksplisitte forhåndsvisninger, orientering og tilgangsfiltrene for skript og video kan endres når som helst fra innstillingsdialogen i toppmenyen."
  },

  contact: {
    title: "Kontakt",
    // "forespørsel" er reservert for videoforespørsler i resten av appen, så
    // takedowns blir "henvendelser"
    body: "Spørsmål, feilrapporter eller henvendelser om fjerning av innhold: {email}"
  }
};

export default privacy;
