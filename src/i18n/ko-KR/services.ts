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
      "이 동영상에는 무료 script가 없어요. 카탈로그 정보가 오래됐어요.",
    unauthorized:
      "connection key 값이 틀렸거나 Handy가 온라인 상태가 아니에요. 둘 다 확인한 뒤 다시 시도해 보세요.",
    failed:
      "Script 서버가 응답하지 않았어요. 연결을 확인하고 다시 시도해 보세요."
  }
};

export default services;
