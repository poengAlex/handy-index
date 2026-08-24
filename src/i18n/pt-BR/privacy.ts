import type enUS from "../en-US/privacy";

// The privacy & terms page at /privacy. Every sentence here is a factual
// claim about what the site stores, what leaves the browser and who may use
// it — translate the claim, never a looser version of it. `apiBody` and
// `contact.body` are rendered through <i18n-t> with the anchors supplied as
// named slots, so the link text lives in its own key and the sentence stays
// one unit whose word order a translator is free to move.
const privacy: typeof enUS = {
  title: "Privacidade e termos",

  // Shown only when the page is being read in a translation — the English
  // wording is the one the site is held to, and a reader of the Norwegian
  // needs to know that before the first claim, not after the last.
  authoritativeNotice:
    "Esta é uma tradução. Se as duas versões divergirem, vale a versão em inglês.",

  intro:
    "O IVDB é um catálogo de vídeos que têm scripts para o Handy, mantido pelo time do Handy (Ohdoki AS). Esta página explica o que o site faz com os seus dados — a versão curta: o mínimo possível.",

  what: {
    title: "O que este site é",
    body: "O site lista vídeos com script e leva você até os scripts e até os sites parceiros que hospedam o conteúdo em si. Nenhum vídeo fica nos nossos servidores — só os scripts. Navegar é grátis para usuários do Handy.",
    apiBody:
      "O site é construído sobre a API pública do índice de scripts — fique à vontade para usá-la nos seus próprios projetos: {apiDocs}. O site em si é código aberto, para total transparência: {repo}.",
    apiDocsLink: "Documentação da API",
    repoLink: "Repositório no GitHub"
  },

  local: {
    title: "O que fica neste navegador",
    intro:
      "Não há contas, nem cookies, nem ferramentas de análise de uso. Tudo o que você define fica guardado apenas no armazenamento local deste navegador:",
    item: {
      consent: "a sua resposta ao aviso de consentimento da primeira visita",
      previews: "a configuração de prévias explícitas (NSFW)",
      orientation: "o filtro de orientação",
      accessFilters: "os seus filtros de acesso a scripts e vídeos",
      favorites: "os seus favoritos",
      votes: "os votos que você deu em pedidos de vídeo",
      connectionKey: "a sua connection key do Handy"
    },
    outro:
      "Abra o site em outro dispositivo — ou limpe os dados do navegador — e isso tudo some; não há nada para recuperar de um servidor. O outro lado de não ter ferramentas de análise é que não conseguimos ver os erros acontecerem, então relatos de bugs são muito bem-vindos."
  },

  catalog: {
    title: "De onde vem o catálogo",
    body: "O catálogo, os metadados dele e os scripts são carregados da API do índice de scripts em handyfeeling.com. Quando você baixa um script, envia um pedido de vídeo ou vota em um, a sua connection key é enviada a essa API como autorização — é a única vez que algo digitado por você sai do seu navegador."
  },

  thirdParty: {
    title: "Sites de terceiros",
    body: "As páginas de vídeo levam aos sites parceiros que hospedam os vídeos. São sites adultos de terceiros, com políticas de privacidade e ferramentas de análise próprias — quando você sai do IVDB, valem as regras deles. Com as prévias explícitas ativadas, as miniaturas são carregadas direto dos sites parceiros, então o seu navegador faz requisições que os servidores deles podem registrar. Se isso preocupa você, deixe as prévias desligadas ou use uma VPN."
  },

  age: {
    title: "Requisito de idade",
    body: "Este site indexa conteúdo adulto e é só para adultos. Para usá-lo, você precisa ter 18 anos ou mais — ou a maioridade do lugar onde você mora."
  },

  choices: {
    title: "Mudar as suas escolhas",
    body: "Nada do que você escolheu no aviso da primeira visita é definitivo. As prévias explícitas, a orientação e os filtros de acesso a scripts e vídeos podem ser mudados a qualquer momento nas configurações, na barra superior."
  },

  contact: {
    title: "Contato",
    body: "Dúvidas, relatos de bugs ou pedidos de remoção: {email}"
  }
};

export default privacy;
