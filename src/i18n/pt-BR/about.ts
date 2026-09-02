import type enUS from "../en-US/about";

const about: typeof enUS = {
  title: "Sobre o IVDB",
  body: "O IVDB é um catálogo de vídeos que têm scripts para o Handy. É feito pela equipe do Handy na Ohdoki AS, e navegar é grátis.",
  beta: "Esta versão ainda é um beta. Parte dela está inacabada e parte provavelmente está com defeito — se você encontrar algo, queremos saber.",

  version: "Versão {version}",
  built: "Compilado em {date}",
  copyright: "© {year} Ohdoki AS",

  changelog: {
    title: "Novidades",
    lead: "Mudanças no site, das mais recentes para as mais antigas.",
    englishOnly: "Esta lista está escrita apenas em inglês.",
    errorTitle: "Não foi possível carregar a lista de mudanças",
    errorBody: "A lista não carregou. Verifique sua conexão e tente de novo."
  }
};

export default about;
