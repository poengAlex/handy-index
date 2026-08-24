import type enUS from "../en-US/help";

const help: typeof enUS = {
  title: "Hjelp",
  lead: "Alt nettstedet kan gjøre, samlet på ett sted. Radene med pil tar deg rett dit.",

  finding: {
    title: "Finne videoer",
    search: {
      label: "Søk og filtrer",
      caption:
        "Søk i titler og snevre inn med tagg, nettsted, skuespiller, VR og varighet — alle filtrene ligger i URL-en, så resultatene kan deles"
    },
    sort: {
      label: "Sorter som du vil",
      caption:
        "Nylig lagt til, best vurdert, mest spilt og mer — pilknappen ved siden av sorteringen snur rekkefølgen"
    },
    tags: {
      label: "Taggsky",
      caption:
        "Alle tagger i katalogen bortsett fra dem du har dempet, søkbare og sorterbare — ett klikk filtrerer videolisten"
    },
    performers: {
      label: "Skuespillere",
      caption: "Utforsk etter skuespiller — de med flest videoer først"
    },
    sites: {
      label: "Nettsteder",
      caption: "Alle partnernettsteder i indeksen, med antall videoer"
    }
  },

  library: {
    title: "Biblioteket ditt",
    favorites: {
      label: "Favoritter",
      // "keep it handy" is a pun on the device; "ha den for hånden" is the
      // Norwegian idiom for the same thing, so the wink survives.
      caption:
        "Trykk på hjertet på en video for å ha den for hånden — lagres på denne enheten"
    },
    playlists: {
      label: "Spillelister",
      caption:
        "Opprett spillelister, gi dem nytt navn og fyll dem med videoene du vil ha"
    },
    transfer: {
      label: "Del, importer og eksporter spillelister",
      caption:
        "Flytt en spilleliste som fil, som JSON-tekst du kan kopiere, eller som en midlertidig delingslenke — og importer fra alle tre"
    },
    bulkDownload: {
      label: "Hent alle skript på én gang",
      caption:
        "Ett klikk på en spilleliste laster ned alle de gratis skriptene i den"
    },
    quickMenu: {
      label: "Hurtigmeny",
      caption:
        "Høyreklikk (eller trykk og hold) på et miniatyrbilde for favoritter, spillelister, kopier lenke og mer"
    }
  },

  scripts: {
    // "Handy-en" with a hyphen, same as video.ts and services.ts: the definite
    // ending on an English brand name reads as a typo without it.
    title: "Skript og Handy-en din",
    free: {
      label: "Gratis skript",
      caption:
        "Videoer merket «Gratis» har et skript du kan laste ned med tilkoblingsnøkkelen din"
    },
    rate: {
      label: "Vurder skript",
      caption: "Gi gratis skript stjerner rett på videosiden"
    },
    comments: {
      label: "Skriptkommentarer",
      caption: "Les og skriv anonyme kommentarer på skript"
    },
    requests: {
      label: "Be om videoer",
      caption:
        "Be om skript til en video, og stem på hva som skal skriptes neste"
    }
  },

  personalize: {
    title: "Gjør det til ditt",
    previews: {
      label: "Eksplisitte forhåndsvisninger",
      caption: "Av som standard — slå på ekte bilder i innstillingene"
    },
    players: {
      label: "Innebygde spillere",
      caption:
        "Av som standard — se videoer fra Pornhub og xHamster rett på videosiden (avspillingen synkroniseres ikke med Handy-en)"
    },
    filters: {
      label: "Filtre for orientering, skript og video",
      // "videolisten", not "videosiden": videosiden is the detail page for a
      // single video everywhere else in the app, and these filters sit on the
      // listing.
      caption:
        "Gratis eller premium-skript, gratis eller premium-videoer, og hvem som er med — i innstillingene, eller rett i filtrene på videolisten"
    },
    mutedTags: {
      label: "Dempede tagger",
      caption:
        "Demp en tagg, så forsvinner alle videoer med den fra katalogen — høyreklikk på en tagg, eller administrer listen i innstillingene"
    },
    theme: {
      label: "Lys og mørk modus",
      caption: "Bytt i toppmenyen — valget følger deg overalt"
    },
    share: {
      label: "Del videoer og resultater",
      caption:
        "Hver videoside og hver filtrert resultatliste har en lenke du kan dele"
    }
  }
};

export default help;
