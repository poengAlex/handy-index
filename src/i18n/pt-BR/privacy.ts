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
      "Não há contas nem cookies. Tudo o que você define fica guardado apenas no armazenamento local deste navegador:",
    item: {
      consent: "a sua resposta ao aviso de consentimento da primeira visita",
      previews: "a configuração de prévias explícitas (NSFW)",
      orientation: "o filtro de orientação",
      accessFilters: "os seus filtros de acesso a scripts e vídeos",
      favorites: "os seus favoritos",
      votes: "os votos que você deu em pedidos de vídeo",
      connectionKey: "a sua connection key do Handy",
      statisticsId:
        "um ID aleatório para as estatísticas de uso anônimas descritas abaixo"
    },
    outro:
      "Abra o site em outro dispositivo — ou limpe os dados do navegador — e isso tudo some; não há nada para recuperar de um servidor."
  },

  catalog: {
    title: "De onde vem o catálogo",
    body: "O catálogo, os metadados dele e os scripts são carregados da API do índice de scripts em handyfeeling.com. Quando você baixa um script, envia um pedido de vídeo ou vota em um, a sua connection key é enviada a essa API como autorização. Com as estatísticas de uso ativadas, ela também é enviada à API do Handy, para verificar se o seu Handy está online — veja abaixo. São as únicas vezes em que algo digitado por você sai do seu navegador."
  },

  statistics: {
    title: "Estatísticas de uso anônimas",
    sent: "Para ver quais recursos são usados e onde o site falha, o IVDB envia estatísticas de uso anônimas ao PostHog, um serviço de análise que as guarda em servidores na UE. O que é enviado: as páginas que você abre, inclusive qual vídeo (pelo ID dele); o que você faz com os botões do site — abrir um vídeo, baixar um script, adicionar um favorito e coisas do tipo; as suas configurações e o seu idioma; o seu navegador e o tipo de dispositivo; o país de onde vem a sua conexão; e um relatório de erro quando algo quebra.",
    never:
      "O que nunca é enviado: o seu filtro de orientação, nomes de tags ou de artistas, o que você busca, títulos de vídeos, os seus comentários ou os filtros do endereço da página. A sua tela nunca é gravada, e o seu endereço IP não é armazenado.",
    device:
      "Se você salvou uma connection key e o seu Handy está online, as estatísticas são ligadas a um ID gerado a partir dessa chave — os três primeiros caracteres e um hash da chave inteira —, junto com o modelo e a versão de firmware do seu Handy. Assim contamos dispositivos, e não navegadores. A chave em si nunca é enviada ao PostHog.",
    choice:
      "As estatísticas vêm ativadas. Você pode desativá-las a qualquer momento nas configurações; o site então envia uma última mensagem avisando disso, e nada depois. Limpar todos os dados guardados também começa um novo ID aleatório."
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
    body: "Nada do que você escolheu no aviso da primeira visita é definitivo. As prévias explícitas, a orientação, os filtros de acesso a scripts e vídeos e as estatísticas de uso podem ser mudados a qualquer momento nas configurações, na barra superior."
  },

  contact: {
    title: "Contato",
    body: "Dúvidas, relatos de bugs ou pedidos de remoção: {email}"
  }
};

export default privacy;
