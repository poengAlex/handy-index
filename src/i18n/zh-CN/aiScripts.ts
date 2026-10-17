import type enUS from "../en-US/aiScripts";

// The AI scripts page (/ai-scripts): every script Handy's auto-scripter has
// published. Reached only from the help page. The warning is the point of
// the page — translate its claim as strongly as English makes it: made by
// AI, checked by nobody.
const aiScripts: typeof enUS = {
  title: "AI scripts",
  lead: "Handy 自动 script 生成器制作的所有 script，最新的在前。",

  warning: {
    title: "高度实验性功能",
    body: "本页上的每个 script 都由 AI 制作，没有经过任何人工检查。可能存在错误：动作不同步、缺失或错误的片段。使用风险自负。"
  },

  search: {
    placeholder: "搜索 AI scripts",
    aria: "按视频标题搜索 AI scripts"
  },

  count: "{count} 个 AI script",
  /** under each title, after the length; {when} is "3 hours ago" */
  made: "制作于{when}",
  download: "下载",
  showMore: "显示更多",

  emptyBody: "自动 script 生成器还没有发布任何 script。",
  errorTitle: "无法加载 AI scripts",
  errorBody: "AI script 服务器没有响应。请稍后再试。",
  noMatchTitle: "没有匹配的 script",
  noMatchBody: "没有标题包含该内容的 AI script。"
};

export default aiScripts;
