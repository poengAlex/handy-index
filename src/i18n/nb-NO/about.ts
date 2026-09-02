import type enUS from "../en-US/about";

const about: typeof enUS = {
  title: "Om IVDB",
  body: "IVDB er en katalog over videoer som har Handy-skript. Den lages av Handy-teamet i Ohdoki AS, og den er gratis å bruke.",
  beta: "Denne versjonen er fortsatt en beta. Noe er uferdig, og noe er nok ødelagt — finner du noe, vil vi gjerne høre om det.",

  version: "Versjon {version}",
  built: "Bygget {date}",
  copyright: "© {year} Ohdoki AS",

  changelog: {
    title: "Hva er nytt",
    lead: "Endringer på nettstedet, nyeste først.",
    englishOnly: "Denne listen finnes bare på engelsk.",
    errorTitle: "Klarte ikke å laste endringene",
    errorBody: "Listen ble ikke lastet. Sjekk tilkoblingen og prøv igjen."
  }
};

export default about;
