/**
 * 步青尘 · 站点数据层（V2 功能底座）
 * ---------------------------------------------------------------------------
 * 单一数据来源（single source of truth）。页面展示与数据分离：
 * 页面只负责渲染，所有可持续增长的内容集中在此文件维护。
 *
 * 兼容性说明：
 *  - 采用原生 JS 赋值（window.siteData），同时兼容 file:// 本地预览与
 *    GitHub Pages 子目录部署，无需 fetch / 不触发 CORS。
 *  - 必须在 main.js 之前加载。
 *
 * 给 Codex 预留的视觉字段（不影响功能，可自由覆盖）：
 *  - sceneZone     ：内容所属的“世界分区”，用于后续场景分镜
 *  - accent        ：强调色提示
 *  - visualVariant ：视觉变体编号 / 名称
 *  - branchZone    ：听雪梅树上的枝干分区
 *  - branchOrder   ：同一枝干上的节点顺序
 *  - mood          ：情绪基调，用于氛围渲染
 *  - sceneTone     ：影像的冷暖 / 明暗基调
 *
 * 真实性约束：以下内容均迁移自现有页面，未编造任何照片、经历、
 * 项目成绩或音乐版权信息。新增字段仅为视觉脚手架占位。
 */
(function () {
  'use strict';

  var siteData = window.siteData || {};

  /* ---------------------------------------------------------------------- */
  /* 站点元信息                                                              */
  /* 来源：各页 <meta> 与页脚、品牌记忆（步青尘 / 青尘印）。                 */
  /* ---------------------------------------------------------------------- */
  siteData.siteMeta = {
    name: '步青尘',
    seal: '青尘印',
    tagline: '见字如面 · 岁在丙午',
    defaultWorld: 'day', // day | night —— 与 data-theme(light/dark) 镜像
    // 栏目语义 → 真实页面映射（导航与路由的唯一事实来源）
    routes: [
      { key: 'home',     label: '首页',     alias: '起行', href: 'index.html',    sceneZone: 'entrance' },
      { key: 'about',    label: '关于我',   alias: '小序', href: 'about.html',    sceneZone: 'intro' },
      { key: 'projects', label: '作品',     alias: '行迹', href: 'projects.html', sceneZone: 'works' },
      { key: 'articles', label: '雪笺',     alias: '雪笺', href: 'articles.html', sceneZone: 'letters' },
      { key: 'learning', label: '学习记录', alias: '学习路', href: 'learning.html', sceneZone: 'path' },
      { key: 'gallery',  label: '影像廊',   alias: '影像廊', href: 'gallery.html',  sceneZone: 'gallery' },
      { key: 'music',    label: '听雪',     alias: '听雪', href: 'music.html',    sceneZone: 'plum-tree' },
      { key: 'contact',  label: '联系我',   alias: '留笺', href: 'contact.html',  sceneZone: 'letter' }
    ]
  };

  /* ---------------------------------------------------------------------- */
  /* 听雪 · 音乐曲目                                                         */
  /* 来源：原 main.js musicTracks（本地 assets/audio/*.mp3，真实文件）。     */
  /* 新增 branchZone / branchOrder / mood / available / cover 为视觉脚手架。 */
  /* ---------------------------------------------------------------------- */
  siteData.musicTracks = [
    {
      id: 'you-wo-ne',
      title: '有我呢',
      artist: '郭一凡',
      src: 'assets/audio/you-wo-ne.mp3',
      tag: '雪音',
      duration: '04:35',
      cover: null,
      branchZone: 'low-left',
      branchOrder: 1,
      mood: 'soft',
      available: true
    },
    {
      id: 'fallin-out',
      title: 'Fallin Out',
      artist: 'Keyshia Cole',
      src: 'assets/audio/fallin-out.mp3',
      tag: '风音',
      duration: '04:27',
      cover: null,
      branchZone: 'low-left',
      branchOrder: 2,
      mood: 'wistful',
      available: true
    },
    {
      id: 'hong-san-ke-zhan',
      title: '红尘客栈',
      artist: '周杰伦',
      src: 'assets/audio/hong-san-ke-zhan.mp3',
      tag: '伞音',
      duration: '04:34',
      cover: null,
      branchZone: 'mid-left',
      branchOrder: 1,
      mood: 'narrative',
      available: true
    },
    {
      id: 'ji-mo-ji-mo-bu-hao',
      title: '寂寞寂寞不好',
      artist: '曹格',
      src: 'assets/audio/ji-mo-ji-mo-bu-hao.mp3',
      tag: '夜音',
      duration: '04:03',
      cover: null,
      branchZone: 'mid-right',
      branchOrder: 1,
      mood: 'lonely',
      available: true
    },
    {
      id: 'lan-ting-xu',
      title: '兰亭序',
      artist: '周杰伦',
      src: 'assets/audio/lan-ting-xu.mp3',
      tag: '墨音',
      duration: '04:14',
      cover: null,
      branchZone: 'crown',
      branchOrder: 1,
      mood: 'ink',
      available: true
    },
    {
      id: 'lian-ren',
      title: '恋人',
      artist: '李荣浩',
      src: 'assets/audio/lian-ren.mp3',
      tag: '梅音',
      duration: '04:35',
      cover: null,
      branchZone: 'crown',
      branchOrder: 2,
      mood: 'tender',
      available: true
    },
    {
      id: 'yin-tian',
      title: '阴天',
      artist: '莫文蔚',
      src: 'assets/audio/yin-tian.mp3',
      tag: '雨音',
      duration: '04:02',
      cover: null,
      branchZone: 'high-right',
      branchOrder: 1,
      mood: 'cloudy',
      available: true
    }
  ];

  /* ---------------------------------------------------------------------- */
  /* 雪笺 · 文章与思考                                                       */
  /* 来源：原 main.js snowLetterPosts（用户已撰写）。文本逐字保留。          */
  /* ---------------------------------------------------------------------- */
  siteData.articles = [
    {
      id: 'why-personal-site',
      title: '我为什么开始做这个个人网页',
      category: '项目',
      date: '2026.01.01',
      readTime: '3 分钟',
      excerpt: '从一个空白页面开始，我想给自己搭一个安静的小角落。',
      content: '这是我第一次认真做一个完整的个人网页。它不只是一个展示名字和作品的地方，也像一个可以慢慢记录学习过程的小房间。我希望这里能放下我的前端练习、网页作品、一些风景照片，也放下一些还没有完全想明白的话。',
      sceneZone: 'letters',
      accent: 'cinnabar',
      visualVariant: 'v1'
    },
    {
      id: 'first-web-music',
      title: '第一次让音乐在网页里响起来',
      category: '学习',
      date: '2026.01.02',
      readTime: '2 分钟',
      excerpt: '音乐按钮看起来很小，但里面藏着浏览器限制和交互逻辑。',
      content: '给网页加音乐以后，我才发现浏览器并不总是允许页面自动播放声音。后来我把音乐改成需要点击按钮后播放，这样在电脑和手机上都更稳定。一个小小的按钮，也让我明白网页交互需要尊重用户的操作。',
      sceneZone: 'letters',
      accent: 'daiqing',
      visualVariant: 'v2'
    },
    {
      id: 'ink-background-thoughts',
      title: '关于中式水墨网页背景的一点想法',
      category: '灵感',
      date: '2026.01.03',
      readTime: '4 分钟',
      excerpt: '水墨风不是简单放一张图，而是留白、层次、墨色和呼吸感。',
      content: '我想要的中式网页背景，不应该只是铺一张模糊图片。它应该像一张慢慢展开的纸：有淡淡的纸纹，有远山一样的墨影，有很轻的水波线，也有恰到好处的留白。背景不应该抢走文字，而应该让文字像落在纸面上一样安静。',
      sceneZone: 'letters',
      accent: 'ink',
      visualVariant: 'v3'
    },
    {
      id: 'words-to-future-self',
      title: '给未来自己的几句话',
      category: '随笔',
      date: '2026.01.04',
      readTime: '2 分钟',
      excerpt: '慢一点也没关系，重要的是一直在走。',
      content: '如果以后再看到这个网页，希望我还能记得现在一点点搭建它的心情。也许那时候我已经学会了更多技术，也许这个网站已经变了很多样子。但我希望它仍然保留一点安静，一点认真，还有一点属于自己的温度。',
      sceneZone: 'letters',
      accent: 'tea',
      visualVariant: 'v4'
    },
    {
      id: 'first-road-of-front-end',
      title: 'HTML、CSS 和 JavaScript 的第一段路',
      category: '学习',
      date: '2026.01.05',
      readTime: '3 分钟',
      excerpt: '网页不是一下子完成的，它是一层一层搭起来的。',
      content: 'HTML 像骨架，CSS 像衣服和气质，JavaScript 则让页面开始回应人的动作。刚开始学的时候，每一部分都很零散，但当它们组合到一个完整页面里，我才真正感觉到前端开发的乐趣。',
      sceneZone: 'letters',
      accent: 'daiqing',
      visualVariant: 'v5'
    }
  ];

  /* ---------------------------------------------------------------------- */
  /* 行迹 · 作品 / 项目                                                      */
  /* 来源：projects.html 现有三张卡片，文本与状态保持一致。                  */
  /* ---------------------------------------------------------------------- */
  siteData.projects = [
    {
      id: 'spring-east-homepage',
      title: '春日东方个人主页',
      category: '实践项目 · 静态主页',
      status: 'done',
      statusLabel: '完成时间：2026年6月',
      date: '2026-06',
      tech: ['HTML', 'CSS', 'JavaScript', 'GitHub Pages'],
      desc: '使用 HTML、CSS 和 JavaScript 制作的静态个人主页。采用响应式媒体查询、SVG 水墨与梅枝背景、淡雅东方配色和轻量原生交互。重点优化了日夜模式、鼠标生长特效、移动端显示细节以及键盘无障碍焦点，是我的第一个完整的前端项目实践。',
      href: 'index.html',
      sceneZone: 'works',
      accent: 'cinnabar',
      visualVariant: 'v1'
    },
    {
      id: 'moyi-canvas-board',
      title: '“墨意”Canvas 交互画板',
      category: '规划中 · 趣味组件',
      status: 'planned',
      statusLabel: '完成时间：规划中',
      date: null,
      tech: ['HTML5 Canvas', 'JavaScript'],
      desc: '计划使用 HTML5 Canvas 对原生 JavaScript 的鼠标和触摸事件及像素信息进行处理，模拟国画墨汁在宣纸上的浸润、扩散和枯笔效果。支持调节墨色深浅和笔触粗细，用于深入学习 Canvas 图像渲染机制。',
      href: null,
      sceneZone: 'works',
      accent: 'ink',
      visualVariant: 'v2'
    },
    {
      id: 'poem-scroll-generator',
      title: '诗词卷轴竖排生成器',
      category: '规划中 · 排版工具',
      status: 'planned',
      statusLabel: '完成时间：规划中',
      date: null,
      tech: ['CSS3', 'CSS Grid'],
      desc: '计划利用 CSS3 竖向文本布局（writing-mode: vertical-rl）以及 CSS Grid 网格布局，为经典诗词提供卷轴古籍风格的竖向排版。支持用户自定义诗句一键排版，并支持生成导出静态图片。',
      href: null,
      sceneZone: 'works',
      accent: 'daiqing',
      visualVariant: 'v3'
    }
  ];

  /* ---------------------------------------------------------------------- */
  /* 学习路 · 学习记录                                                       */
  /* 来源：about.html 经历时间轴 + 雪笺中“学习”类文章（均为已有真实内容）。  */
  /* 不编造学习经历；relatedArticle 指向真实文章 id。                        */
  /* ---------------------------------------------------------------------- */
  siteData.learningEntries = [
    {
      id: 'start-self-study',
      title: '起步与自学',
      period: '2025年',
      tag: '起步',
      summary: '出于好奇开始接触网页开发。通过网络上的免费教程，从认识 HTML 标签和 CSS 盒子模型开始，逐步能够自己编写一些简单、没有复杂交互的静态单页。',
      relatedArticle: null,
      sceneZone: 'path',
      accent: 'spring-green'
    },
    {
      id: 'first-complete-site',
      title: '完成第一个完整网页实践',
      period: '2026年6月',
      tag: '里程碑',
      summary: '设计并开发了本站——“步青尘”个人主页。在实践中学会了使用 Git 命令行工具，练习了 CSS 媒体查询以进行移动端适配，并初步摸索了原生 JavaScript 的事件捕获与交互操作。',
      relatedArticle: 'first-road-of-front-end',
      sceneZone: 'path',
      accent: 'cinnabar'
    },
    {
      id: 'web-audio-lesson',
      title: '让音乐在网页里响起来',
      period: '2026年',
      tag: '踩坑复盘',
      summary: '给网页加音乐时遇到浏览器自动播放限制，改为点击后播放，在电脑和手机上都更稳定。一次关于“交互要尊重用户操作”的小复盘。',
      relatedArticle: 'first-web-music',
      sceneZone: 'path',
      accent: 'daiqing'
    },
    {
      id: 'deepen-native-js',
      title: '深耕原生 JavaScript',
      period: '规划中',
      tag: '下一步',
      summary: '下一阶段目标是写出结构合理的原生 JavaScript。计划在扎实 DOM API 操作后，尝试利用 HTML5 Canvas 编写一个涂鸦小画板，深入理解事件状态及图像渲染。',
      relatedArticle: null,
      sceneZone: 'path',
      accent: 'ink'
    }
  ];

  /* ---------------------------------------------------------------------- */
  /* 影像廊 · 生活影像                                                       */
  /* 来源：index.html 影像小记现有 6 张卡片（真实图片文件 + 用户已写文字）。 */
  /* 不编造照片与说明；date 未知处置 null，绝不虚构时间地点。               */
  /* ---------------------------------------------------------------------- */
  siteData.galleryItems = [
    {
      id: 'rain-corner',
      src: 'assets/images/gallery/spring_moss.jpg',
      width: 1024,
      height: 1024,
      alt: '雨后林地里带着水汽的青苔与细小新芽',
      title: '雨后街角',
      caption: '路面还亮着，像刚刚被天空擦过。',
      date: null,
      locationOptional: null,
      visibility: 'public',
      sceneTone: 'cool'
    },
    {
      id: 'dusk-cloud',
      src: 'assets/images/gallery/1534941e2495b8bc5b1b0722ea1ae57c.jpg',
      width: 1279,
      height: 1704,
      alt: '傍晚天空里层叠的蓝灰云与透出的日光',
      title: '傍晚的云',
      caption: '云慢慢散开，今天也算好好结束了。',
      date: null,
      locationOptional: null,
      visibility: 'public',
      sceneTone: 'warm'
    },
    {
      id: 'campus-tree-shadow',
      src: 'assets/images/gallery/5253bd35c3b206dd7106fe47153b3e5d.jpg',
      width: 1280,
      height: 1711,
      alt: '校园里仰望紫花树影、蓝天和交错枝条',
      title: '校园树影',
      caption: '树影落下来，像一页没有写完的笔记。',
      date: null,
      locationOptional: null,
      visibility: 'public',
      sceneTone: 'cool'
    },
    {
      id: 'hot-tea',
      src: 'assets/images/gallery/desk_life.jpg',
      width: 1024,
      height: 1024,
      alt: '木质书案上的茶盏、笔墨、书册与暖色台灯',
      title: '一杯热茶',
      caption: '热气升起来的时候，人会安静一点。',
      date: null,
      locationOptional: null,
      visibility: 'public',
      sceneTone: 'warm'
    },
    {
      id: 'night-window',
      src: 'assets/images/gallery/e3207ce7198c23a173bfc6dfc9ac7a92.jpg',
      width: 1279,
      height: 1706,
      alt: '夜色中被灯光照亮的高塔建筑与红色花树',
      title: '夜色窗边',
      caption: '窗外很暗，屋里还有一点小小的光。',
      date: null,
      locationOptional: null,
      visibility: 'public',
      sceneTone: 'night'
    },
    {
      id: 'distant-mountain',
      src: 'assets/images/gallery/3df858748cd0f8375a2a4f2727a2b05b.jpg',
      width: 1159,
      height: 689,
      alt: '远处山谷、河面倒影和被云光照亮的山坡',
      title: '远处的山',
      caption: '山在很远的地方，却让人觉得心里稳了一点。',
      date: null,
      locationOptional: null,
      visibility: 'public',
      sceneTone: 'cool'
    }
  ];

  /* ---------------------------------------------------------------------- */
  /* 留笺 · 联系方式                                                         */
  /* 来源：contact.html 现有真实邮箱与 GitHub。不暴露额外隐私。              */
  /* ---------------------------------------------------------------------- */
  siteData.contactInfo = {
    email: 'uner9895@gmail.com',
    mailto: 'mailto:uner9895@gmail.com',
    github: 'https://github.com/uner9895-blip',
    note: '本站为托管于 GitHub Pages 的纯静态个人主页，暂无留言后端。最稳妥的方式是直接邮件或在 GitHub 与我交流。'
  };

  /* 向后兼容别名：保证 main.js / music.js 在不改动的情况下仍可读取。 */
  window.siteData = siteData;
  window.musicTracks = siteData.musicTracks;
  window.snowLetterPosts = siteData.articles;
})();
