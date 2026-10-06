import type enUS from "../en-US/privacy";

// The privacy & terms page at /privacy. Every sentence here is a factual
// claim about what the site stores, what leaves the browser and who may use
// it — translate the claim, never a looser version of it. `apiBody` and
// `contact.body` are rendered through <i18n-t> with the anchors supplied as
// named slots, so the link text lives in its own key and the sentence stays
// one unit whose word order a translator is free to move.
const privacy: typeof enUS = {
  title: "隐私与条款",

  // Shown only when the page is being read in a translation — the English
  // wording is the one the site is held to, and a reader of the Norwegian
  // needs to know that before the first claim, not after the last.
  authoritativeNotice: "本页是译文。两个版本如有出入，以英文版为准。",

  intro:
    "IVDB 是带 Handy scripts 的视频片库，由 Handy 团队（Ohdoki AS）维护。本页说明本站如何处理你的数据——一句话：能少则少。",

  what: {
    title: "本站是什么",
    body: "本站列出有 script 的视频，并把你引向 scripts，以及托管实际内容的合作网站。我们的服务器上不存放任何视频，只有 scripts。Handy 用户浏览本站免费。",
    apiBody:
      "本站建立在公开的 script 索引 API 之上——你也可以把它用在自己的项目里：{apiDocs}。为了完全透明，本站本身也是开源的：{repo}。",
    apiDocsLink: "API 文档",
    repoLink: "GitHub 仓库"
  },

  local: {
    title: "什么留在这个浏览器里",
    intro:
      "没有账号，也没有 Cookie。你设置的一切只保存在这个浏览器的本地存储里：",
    item: {
      consent: "你在首次访问的同意对话框里给出的答复",
      previews: "露骨预览（NSFW）设置",
      orientation: "取向筛选",
      accessFilters: "你的 script 与视频访问权限筛选",
      favorites: "你的收藏",
      votes: "你为视频请求投过的票",
      connectionKey: "你的 Handy connection key",
      statisticsId: "一个随机 ID，用于下文所述的匿名使用统计"
    },
    outro:
      "换一台设备打开本站，或者清除浏览器数据，这些就都没了；服务器上没有任何东西可以恢复。"
  },

  catalog: {
    title: "片库从哪里来",
    body: "片库、它的元数据以及 scripts，都从 handyfeeling.com 的 script 索引 API 加载。当你下载 script、提交视频请求或为请求投票时，你的 connection key 会作为授权发送给该 API。开启使用统计时，它还会发送给 Handy API，用来检查你的 Handy 是否在线——详见下文。只有在这些时候，你输入的内容才会离开浏览器。"
  },

  statistics: {
    title: "匿名使用统计",
    sent: "为了了解哪些功能有人在用、网站在哪里出错，IVDB 会把匿名使用统计发送给 PostHog——一家把数据存放在欧盟服务器上的分析服务。发送的内容：你打开的页面，包括打开的是哪个视频（以视频 ID 表示）；你用网站按钮做了什么——打开视频、获取 script、添加收藏之类；你的设置和语言；你的浏览器和设备类型；你的网络连接所在的国家；以及出错时的错误报告。",
    never:
      "绝不发送的内容：你的取向筛选、标签或演员的名字、你搜索的内容、视频标题、你的评论，以及网址里的筛选条件。绝不会录制你的屏幕，也不会保存你的 IP 地址。",
    device:
      "如果你保存了 connection key，并且你的 Handy 在线，统计数据会关联到一个由这个 key 生成的 ID（它的前三个字符加上整个 key 的哈希值），以及你的 Handy 的型号和固件版本。这样我们统计的是设备，而不是浏览器。key 本身绝不会发送给 PostHog。",
    choice:
      "使用统计默认开启。你可以随时在设置里关闭它；关闭时网站会发送最后一条消息说明这一点，之后不再发送任何内容。清除所有已存储的数据，也会换用一个新的随机 ID。"
  },

  thirdParty: {
    title: "第三方网站",
    body: "视频页会链接到托管这些视频的合作网站。那些是第三方成人网站，有各自的隐私政策和各自的分析统计——一旦离开 IVDB，就按它们的规则来。开启露骨预览后，缩略图直接从合作网站加载，你的浏览器因此发出的请求会被它们的服务器记录。如果你介意这一点，就让预览保持关闭，或者使用 VPN。"
  },

  age: {
    title: "年龄要求",
    body: "本站收录成人内容，仅供成年人使用。你必须年满 18 周岁，或达到你所在地的法定成年年龄，才能使用本站。"
  },

  choices: {
    title: "更改你的选择",
    body: "你在首次访问对话框里做的选择，没有一项是定死的。露骨预览、取向、script 和视频的访问权限筛选，以及使用统计，随时都能在顶栏的设置对话框里更改。"
  },

  contact: {
    title: "联系方式",
    body: "有疑问、要报告问题，或者申请下架内容：{email}"
  }
};

export default privacy;
