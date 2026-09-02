import type enUS from "../en-US/about";

const about: typeof enUS = {
  title: "Acerca de IVDB",
  body: "IVDB es un catálogo de vídeos que tienen scripts para el Handy. Lo hace el equipo de Handy en Ohdoki AS y se puede explorar gratis.",
  beta: "Esta versión todavía es una beta. Algunas cosas están sin terminar y otras seguramente fallan: si encuentras algo, nos gustaría saberlo.",

  version: "Versión {version}",
  built: "Compilado el {date}",
  copyright: "© {year} Ohdoki AS",

  changelog: {
    title: "Novedades",
    lead: "Cambios en el sitio, del más reciente al más antiguo.",
    englishOnly: "Esta lista solo está escrita en inglés.",
    errorTitle: "No se pudo cargar la lista de cambios",
    errorBody:
      "La lista no se cargó. Comprueba tu conexión e inténtalo de nuevo."
  }
};

export default about;
