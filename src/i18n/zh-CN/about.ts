import type enUS from "../en-US/about";

const about: typeof enUS = {
  title: "关于 IVDB",
  body: "IVDB 收录了有 Handy 脚本的视频。它由 Ohdoki AS 的 Handy 团队制作，浏览免费。",
  beta: "这个版本还是测试版。有些地方没做完，有些地方多半有问题——发现了就告诉我们。",

  version: "版本 {version}",
  built: "构建于 {date}",
  copyright: "© {year} Ohdoki AS",

  changelog: {
    title: "更新内容",
    lead: "网站的改动，最新的在最前面。",
    englishOnly: "这份列表只有英文。",
    errorTitle: "无法加载更新列表",
    errorBody: "列表没有加载出来。请检查网络后重试。"
  }
};

export default about;
