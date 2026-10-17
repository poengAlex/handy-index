import type enUS from "../en-US/aiScripts";

// The AI scripts page (/ai-scripts): every script Handy's auto-scripter has
// published. Reached only from the help page. The warning is the point of
// the page — translate its claim as strongly as English makes it: made by
// AI, checked by nobody.
const aiScripts: typeof enUS = {
  title: "Scripts de IA",
  lead: "Todos los scripts que ha creado el auto-scripter de Handy, los más nuevos primero.",

  warning: {
    title: "Muy experimental",
    body: "Todos los scripts de esta página los ha creado una IA y ningún humano los ha revisado. Espera errores: movimientos desincronizados, partes que faltan o están mal. Úsalos bajo tu propia responsabilidad."
  },

  search: {
    placeholder: "Buscar scripts de IA",
    aria: "Buscar scripts de IA por título del vídeo"
  },

  count: "{count} script de IA | {count} scripts de IA",
  /** under each title, after the length; {when} is "3 hours ago" */
  made: "Creado {when}",
  download: "Descargar",
  showMore: "Mostrar más",

  emptyBody: "El auto-scripter todavía no ha publicado ningún script.",
  errorTitle: "No se pudieron cargar los scripts de IA",
  errorBody:
    "El servidor de scripts de IA no respondió. Inténtalo de nuevo en un momento.",
  noMatchTitle: "Ningún script coincide",
  noMatchBody: "Ningún script de IA tiene un título que contenga eso."
};

export default aiScripts;
