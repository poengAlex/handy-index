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
      "Для этого видео нет бесплатного script. Запись в каталоге устарела.",
    unauthorized:
      "Либо connection key неверный, либо Handy не в сети. Проверь и то и другое, затем попробуй снова.",
    failed: "Сервер script не ответил. Проверь соединение и попробуй снова."
  }
};

export default services;
