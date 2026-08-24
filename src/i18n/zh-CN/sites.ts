import type enUS from "../en-US/sites";

// The site directory (/sites): one nav card per partner site, with a name
// filter. Almost every string here is a count shape — the header line and the
// card captions are built from `common.count.*` pieces joined with "·", so
// each message below covers one phrase of that line, never the whole line.
const sites: typeof enUS = {
  title: "网站",

  search: {
    placeholder: "搜索网站",
    aria: "搜索网站"
  },

  count: {
    // the tail of the header line when no filter is narrowing anything;
    // {total} arrives as "2,000 videos" from common.count.videos
    totalInIndex: "索引中共 {total}",
    // the two paywalls are named in full on the cards: they are different
    // gates, and a bare "500 premium" would not say which
    premiumVideos: "{count} 个付费视频",
    premiumScripts: "{count} 个付费 script"
  },

  errorTitle: "无法加载网站",
  emptyBody: "索引返回时一个网站都没有。重新加载试试。",
  noMatchTitle: "没有匹配的网站",
  noMatchBody: "没有网站名匹配这次搜索。少输入几个字母试试。"
};

export default sites;
