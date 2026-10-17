import type enUS from "../en-US/aiScripts";

// The AI scripts page (/ai-scripts): every script Handy's auto-scripter has
// published. Reached only from the help page. The warning is the point of
// the page — translate its claim as strongly as English makes it: made by
// AI, checked by nobody.
const aiScripts: typeof enUS = {
  title: "Scripts de IA",
  lead: "Todos os scripts que o auto-scripter do Handy criou, os mais novos primeiro.",

  warning: {
    title: "Altamente experimental",
    body: "Todos os scripts desta página foram criados por IA e não foram verificados por nenhum humano. Espere erros: movimentos fora de sincronia, partes faltando ou erradas. Use por sua conta e risco."
  },

  search: {
    placeholder: "Buscar scripts de IA",
    aria: "Buscar scripts de IA pelo título do vídeo"
  },

  count: "{count} script de IA | {count} scripts de IA",
  /** under each title, after the length; {when} is "3 hours ago" */
  made: "Criado {when}",
  download: "Baixar",
  showMore: "Mostrar mais",

  emptyBody: "O auto-scripter ainda não publicou nenhum script.",
  errorTitle: "Não foi possível carregar os scripts de IA",
  errorBody:
    "O servidor de scripts de IA não respondeu. Tente de novo daqui a pouco.",
  noMatchTitle: "Nenhum script encontrado",
  noMatchBody: "Nenhum script de IA tem um título com isso."
};

export default aiScripts;
