import type enUS from "../en-US/performers";

// The performer directory (/performers): a grid of avatar cards with a name
// search, a sort control and endless scroll. Same page shape as `sites` — a
// header count line, a search box and two empty states — so the key names are
// kept parallel with that namespace on purpose.
const performers: typeof enUS = {
  title: "Artistas",

  search: {
    placeholder: "Buscar artistas",
    aria: "Buscar artistas pelo nome"
  },

  sort: {
    aria: "Ordenar artistas",
    count: "Mais vídeos",
    plays: "Mais reproduções",
    rating: "Mais bem avaliados",
    // an alphabet range, so it changes with the language
    name: "A–Z",
    age: "Idade",
    height: "Altura",
    weight: "Peso",
    bmi: "Silhueta",
    cup: "Tamanho do bojo",
    unknownLast:
      "Quem não informa isso no perfil aparece por último, em qualquer ordem.",
    profilesError:
      "Essa ordenação precisa de todos os perfis, e eles não foram baixados. Verifique sua conexão e tente de novo.",
    // Four whole messages rather than one with a {direction} param: the
    // button says what the order *is* and what clicking does, and neither
    // language builds that sentence from the same pieces.
    descAria: "Ordem decrescente — inverter",
    ascAria: "Ordem crescente — inverter",
    descTitle: "Ordem decrescente — clique para inverter",
    ascTitle: "Ordem crescente — clique para inverter"
  },

  // the star chip on a card; Norwegian puts a space before the percent sign
  ratingBadge: "★ {rating}%",

  card: {
    age: "{age} anos",
    height: "{cm} cm",
    weight: "{kg} kg",
    cup: "Bojo {cup}"
  },

  errorTitle: "Não foi possível carregar os artistas",
  hiddenBody:
    "Seu filtro premium e as tags silenciadas escondem todos os artistas. Ajuste os filtros nas configurações.",
  noMatchTitle: "Nenhum artista encontrado",
  noMatchBody:
    "Nada no índice corresponde a “{query}”. Tente um nome mais curto.",

  filters: {
    title: "Filtrar artistas",
    lead: "A maioria dos perfis informa só algumas dessas características. O filtro mantém apenas os artistas cujo perfil diz o que você escolheu.",
    errorTitle: "Não foi possível carregar os perfis",
    errorBody:
      "Os filtros precisam do perfil de todos, e o download falhou. Verifique sua conexão e tente de novo.",
    noMatchBody:
      "Ninguém no índice atende a todos esses filtros. Remova alguns para ver mais.",
    chip: "{facet}: {value}",
    facets: {
      gender: "Gênero",
      hair: "Cabelo",
      eyes: "Olhos",
      ethnicity: "Etnia",
      cup: "Tamanho do busto",
      natural: "Seios",
      tattoos: "Tatuagens",
      piercings: "Piercings",
      age: "Idade",
      height: "Altura",
      bmi: "Silhueta"
    },
    options: {
      gender: {
        woman: "Mulher",
        man: "Homem",
        trans: "Trans",
        couple: "Casal",
        nonBinary: "Não binário"
      },
      hair: {
        blonde: "Loiro",
        brunette: "Castanho",
        black: "Preto",
        red: "Ruivo",
        grey: "Grisalho",
        bald: "Careca",
        other: "Outro"
      },
      eyes: {
        brown: "Castanhos",
        blue: "Azuis",
        green: "Verdes",
        hazel: "Mel",
        grey: "Cinzentos",
        black: "Pretos",
        other: "Outros"
      },
      ethnicity: {
        white: "Branca",
        latina: "Latina",
        asian: "Asiática",
        black: "Negra",
        indian: "Indiana",
        middleEastern: "Oriente Médio",
        mixed: "Mista",
        other: "Outra"
      },
      cup: {
        a: "A",
        b: "B",
        c: "C",
        d: "D",
        ddPlus: "DD+"
      },
      natural: {
        natural: "Naturais",
        enhanced: "Com silicone"
      }
    },
    ageAny: "Qualquer idade",
    ageFrom: "{min} ou mais",
    ageUpTo: "até {max}",
    ageRange: "{min}–{max}",
    heightAny: "Qualquer altura",
    heightFrom: "a partir de {min} cm",
    heightUpTo: "até {max} cm",
    heightRange: "{min}–{max} cm",
    bmiAny: "Qualquer silhueta",
    bmiFrom: "{min} ou mais",
    bmiUpTo: "{max} ou menos",
    bmiRange: "de {min} a {max}",
    build: {
      slender: "mignon",
      slim: "magra",
      medium: "média",
      curvy: "curvilínea",
      full: "voluptuosa"
    }
  },

  report: {
    helpAria: "Sobre este perfil — informar um erro",
    title: "Sobre este perfil",
    disclaimer:
      "Os dados do perfil vêm dos sites parceiros e de outras fontes públicas. A IVDB não os verifica, então alguns podem estar errados ou desatualizados.",
    question: "Encontrou um erro? Marque o que está errado:",
    reason: {
      measurements: "Medidas, altura ou peso",
      age: "Idade ou data de nascimento",
      details: "Outro dado (cabelo, olhos, país…)",
      media: "As fotos ou os vídeos não são desta pessoa",
      self: "Sou esta pessoa e quero corrigir ou remover algo",
      other: "Outra coisa"
    },
    detailsLabel: "O que está errado e o que deveria constar? (opcional)",
    note: "Isso abre seu app de e-mail com o relato já preenchido, para a equipe da IVDB.",
    send: "Escrever e-mail",
    email: {
      subject: "Correção de perfil na IVDB: {name}",
      intro: "Quero informar um erro neste perfil.",
      nameLine: "Artista: {name}",
      idLine: "ID: {id}",
      linkLine: "Página: {link}",
      reasonsLine: "O que está errado:",
      detailsLine: "Detalhes:",
      profileLine: "O que o perfil diz agora:"
    }
  },

  media: {
    photos: "Fotos",
    reel: "Clipes",
    fromVideo: "Abrir o vídeo",
    counter: "{index} / {total}",
    slideshow: "apresentação de slides",
    previous: "Foto anterior",
    next: "Próxima foto",
    previousVideo: "Vídeo anterior",
    nextVideo: "Próximo vídeo",
    pause: "Pausar",
    play: "Reproduzir"
  },

  profile: {
    eyebrow: "Artista",
    plays: "{count} reprodução do script | {count} reproduções do script",
    linkAria: "{site} — abre em nova aba",
    socials: "Redes sociais",
    moreOf: "Mais de {name}",
    partnerLinkAria: "Perfil em {site} — abre em nova aba",
    about: "Biografia",
    hobbies: "Hobbies",
    details: "Perfil",
    born: "Nascimento",
    age: "Idade",
    from: "Origem",
    career: "Carreira",
    careerSpan: "{start}–{end}",
    careerSince: "Desde {start}",
    careerActive: "Em atividade",
    careerInactive: "Sem atividade",
    height: "Altura",
    weight: "Peso",
    heightValue: "{cm} cm",
    weightValue: "{kg} kg",
    measurements: "Medidas",
    hair: "Cabelo",
    eyes: "Olhos",
    ethnicity: "Etnia",
    starSign: "Signo",
    tattoos: "Tatuagens",
    piercings: "Piercings",
    yes: "Sim",
    no: "Não"
  }
};

export default performers;
