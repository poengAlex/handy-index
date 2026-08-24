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
    noFreeScript: "这个视频没有免费 script。片库里的条目已经过时。",
    unauthorized:
      "Connection key 有误，或者 Handy 不在线。两者都检查一遍，然后重试。",
    failed: "Script 服务器没有响应。检查网络连接后重试。"
  }
};

export default services;
