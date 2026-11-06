import type enUS from "../en-US/performers";

// The performer directory (/performers): a grid of avatar cards with a name
// search, a sort control and endless scroll. Same page shape as `sites` — a
// header count line, a search box and two empty states — so the key names are
// kept parallel with that namespace on purpose.
const performers: typeof enUS = {
  title: "Intérpretes",

  search: {
    placeholder: "Buscar intérpretes",
    aria: "Buscar intérpretes por nombre"
  },

  sort: {
    aria: "Ordenar intérpretes",
    count: "Más vídeos",
    plays: "Más reproducciones",
    rating: "Mejor valorados",
    // an alphabet range, so it changes with the language
    name: "A–Z",
    // the profile properties with an order; they start low to high
    age: "Edad",
    height: "Altura",
    weight: "Peso",
    bmi: "Complexión",
    cup: "Copa",
    // under the controls while a profile property is the sort
    unknownLast:
      "Quienes no lo indican en su perfil aparecen al final, en cualquier orden.",
    profilesError:
      "Este orden necesita todos los perfiles y no se pudieron descargar. Revisa tu conexión e inténtalo de nuevo.",
    // Four whole messages rather than one with a {direction} param: the
    // button says what the order *is* and what clicking does, and neither
    // language builds that sentence from the same pieces.
    descAria: "Orden descendente — invertir",
    ascAria: "Orden ascendente — invertir",
    descTitle: "Orden descendente — haz clic para invertir",
    ascTitle: "Orden ascendente — haz clic para invertir"
  },

  // the star chip on a card; Norwegian puts a space before the percent sign
  ratingBadge: "★ {rating}%",

  // the value a card shows while the list is sorted by a profile property;
  // all numbers arrive localized, heights and weights with every unit
  card: {
    age: "{age} años",
    height: "{cm} cm",
    weight: "{kg} kg",
    cup: "Copa {cup}"
  },

  errorTitle: "No se han podido cargar los intérpretes",
  hiddenBody:
    "Tu filtro premium y las etiquetas silenciadas ocultan a todos los intérpretes. Quita alguno en los ajustes.",
  noMatchTitle: "Ningún intérprete coincide",
  noMatchBody:
    "Nada del índice coincide con «{query}». Prueba con un nombre más corto.",

  // The property filters: a dialog of toggle pills per facet (hair, eyes, …)
  // and a track each for age and height, plus one chip per facet in use on
  // the page. Every value is folded from the profiles' free text into a few
  // groups, so these name the groups, not anything a site wrote.
  filters: {
    title: "Filtrar intérpretes",
    lead: "La mayoría de los perfiles solo indican algunos de estos datos. Un filtro conserva únicamente a los intérpretes cuyo perfil dice lo que has elegido.",
    errorTitle: "No se han podido cargar los perfiles",
    errorBody:
      "Los filtros necesitan el perfil de todos, y la descarga ha fallado. Comprueba tu conexión e inténtalo de nuevo.",
    noMatchBody:
      "Ningún intérprete del índice cumple todos estos filtros. Quita alguno para ver más.",
    // an active-filter chip on the page; {facet} is one of the facets below,
    // {value} its picks joined with "or" ("Blonde or Red") or an age or
    // height band as the track prints it
    chip: "{facet}: {value}",
    facets: {
      gender: "Género",
      hair: "Cabello",
      eyes: "Ojos",
      ethnicity: "Etnia",
      cup: "Copa",
      // natural or enhanced breasts
      natural: "Pecho",
      tattoos: "Tatuajes",
      piercings: "Piercings",
      age: "Edad",
      height: "Altura",
      bmi: "Complexión"
    },
    options: {
      gender: {
        woman: "Mujer",
        man: "Hombre",
        trans: "Trans",
        couple: "Pareja",
        nonBinary: "No binario"
      },
      hair: {
        blonde: "Rubio",
        brunette: "Castaño",
        black: "Negro",
        red: "Pelirrojo",
        grey: "Gris",
        bald: "Calvo",
        other: "Otro"
      },
      eyes: {
        brown: "Marrones",
        blue: "Azules",
        green: "Verdes",
        hazel: "Avellana",
        grey: "Grises",
        black: "Negros",
        other: "Otros"
      },
      ethnicity: {
        white: "Blanca",
        latina: "Latina",
        asian: "Asiática",
        black: "Negra",
        indian: "India",
        middleEastern: "Oriente Medio",
        mixed: "Mestiza",
        other: "Otra"
      },
      // US cup letters, as the measurements give them
      cup: {
        a: "A",
        b: "B",
        c: "C",
        d: "D",
        ddPlus: "DD+"
      },
      natural: {
        natural: "Natural",
        enhanced: "Aumentado"
      }
    },
    // The age, height and build tracks. Their ends are open: a handle resting on
    // one means no limit that way. All numbers arrive localized; heights
    // are printed in cm here.
    ageAny: "Cualquier edad",
    ageFrom: "{min} años o más",
    ageUpTo: "{max} años o menos",
    ageRange: "{min}–{max} años",
    heightAny: "Cualquier altura",
    heightFrom: "{min} cm o más",
    heightUpTo: "{max} cm o menos",
    heightRange: "{min}–{max} cm",
    // build: {min} and {max} arrive as the words below, never as numbers
    bmiAny: "Cualquier complexión",
    bmiFrom: "{min} o más",
    bmiUpTo: "{max} o menos",
    bmiRange: "de {min} a {max}",
    // the build words, slimmest first — the range reads in these, not in
    // numbers
    build: {
      slender: "menuda",
      slim: "delgada",
      medium: "media",
      curvy: "curvilínea",
      full: "voluptuosa"
    }
  },

  // The ? on a performer's profile: a disclaimer that profile details are
  // scraped and unchecked, and a correction report the reader sends from
  // their own email app. `email` is that email's text, in the reader's
  // language; {link} is the page address.
  report: {
    helpAria: "Sobre este perfil: avisar de un error",
    title: "Sobre este perfil",
    disclaimer:
      "Los datos del perfil vienen de los sitios asociados y de otras fuentes públicas. IVDB no los comprueba, así que algunos pueden estar mal o desactualizados.",
    question: "¿Has visto un error? Marca lo que está mal:",
    reason: {
      measurements: "Medidas, altura o peso",
      age: "Edad o fecha de nacimiento",
      details: "Otro dato (pelo, ojos, país…)",
      media: "Las fotos o los vídeos no son de esta persona",
      self: "Soy esta persona y quiero corregir o retirar algo",
      other: "Otra cosa"
    },
    detailsLabel: "¿Qué está mal y qué debería decir? (opcional)",
    note: "Se abrirá tu app de correo con el aviso ya escrito, dirigido al equipo de IVDB.",
    send: "Escribir correo",
    email: {
      subject: "Corrección de perfil en IVDB: {name}",
      intro: "Quiero avisar de un error en este perfil.",
      nameLine: "Intérprete: {name}",
      idLine: "ID: {id}",
      linkLine: "Página: {link}",
      reasonsLine: "Qué está mal:",
      detailsLine: "Detalles:",
      profileLine: "Lo que dice el perfil ahora:"
    }
  },

  // Under the profile panel: two slideshows, one item at a time — photos
  // of them, and their videos (a preview clip, or the video's stills where
  // it has none). Settings can switch both off.
  media: {
    photos: "Fotos",
    reel: "Clips",
    // stand-in link text for a video with no title
    fromVideo: "Abrir el vídeo",
    counter: "{index} / {total}",
    // what a screen reader calls the photo and clip players
    slideshow: "presentación",
    previous: "Foto anterior",
    next: "Foto siguiente",
    previousVideo: "Video anterior",
    nextVideo: "Video siguiente",
    // the slideshows' pause/play button
    pause: "Pausar",
    play: "Reproducir"
  },

  profile: {
    eyebrow: "Intérprete",
    plays:
      "{count} reproducción del script | {count} reproducciones del script",
    linkAria: "{site} — se abre en una pestaña nueva",
    // the two link cards: their own accounts, and their profile on each
    // partner site; {name} is the performer's, as the panel prints it
    socials: "Redes sociales",
    moreOf: "Más de {name}",
    // {site} is the partner site's domain — "pornhub.com"
    partnerLinkAria: "Perfil en {site} — se abre en una pestaña nueva",
    about: "Biografía",
    hobbies: "Aficiones",
    details: "Perfil",
    born: "Nacimiento",
    age: "Edad",
    from: "Origen",
    career: "Carrera",
    careerSpan: "{start}–{end}",
    careerSince: "Desde {start}",
    careerActive: "En activo",
    careerInactive: "Sin actividad",
    height: "Altura",
    weight: "Peso",
    heightValue: "{cm} cm",
    weightValue: "{kg} kg",
    measurements: "Medidas",
    hair: "Cabello",
    eyes: "Ojos",
    ethnicity: "Etnia",
    starSign: "Signo del zodiaco",
    tattoos: "Tatuajes",
    piercings: "Piercings",
    yes: "Sí",
    no: "No"
  }
};

export default performers;
