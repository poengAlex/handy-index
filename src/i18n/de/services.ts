import type enUS from "../en-US/services";

// Failures raised down in `services/`, in words. Nothing under `services/`
// may import vue-i18n (ARCHITECTURE.md keeps that layer framework-free), so
// those functions throw a reason *code* and whichever surface caught it looks
// the sentence up here. That also stops the same explanation from being
// retyped in every caller — it is one failure, so it is one message.
//
// Only the explanation lives here. The toast around it — its title, and
// whether it says "script" or "scripts" — belongs to the calling surface's
// own namespace, because that part changes with where you triggered it.
const services: typeof enUS = {
  // Keys match `ScriptDownloadFailure` in services/script-download.ts, so a
  // caller goes straight from catch to message:
  // t(`services.scriptDownload.${scriptDownloadCode(error)}`)
  scriptDownload: {
    noFreeScript:
      "Für dieses Video gibt es kein kostenloses script. Der Katalogeintrag ist veraltet.",
    unauthorized:
      "Entweder ist der connection key falsch, oder The Handy ist nicht online. Prüfe beides und versuche es erneut.",
    failed:
      "Der Script-Server hat nicht geantwortet. Prüfe deine Internetverbindung und versuche es erneut."
  }
};

export default services;
