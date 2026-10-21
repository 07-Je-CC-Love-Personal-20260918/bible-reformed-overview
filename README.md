# 📖 圣经全景 · 欧陆改革宗 — CCstudy

**主题**：bible-reformed（整本圣经 · 圣约神学 · 三大普世信经 · 三项联合信条）
**时间**：2026-10-21 **版本**：v2.1.0 **标识**：CCstudy

## 🔗 链接

| 平台 | 地址 | 状态 |
|---|---|---|
| 仓库 | https://github.com/07-Je-CC-Love-Personal-20260918/bible-reformed-overview | ✅ |
| GitHub Pages | https://07-je-cc-love-personal-20260918.github.io/bible-reformed-overview/ | ✅ 每次推送到 main 后自动更新（从 `/docs` 发布） |
| Netlify | https://bible-reformed-20261021-v2-1-ccstudy.netlify.app | ✅ 已关联仓库，每次推送到 main 自动发布 `site/` |
| Surge | https://bible-reformed-20261021-v2-1-0-ccstudy.surge.sh | ✅ 组织级 `SURGE_TOKEN`，每次推送到 main 自动发布 `site/` |

> 仓库计划改名为 **bible-reformed-overview-CCstudy**（Settings → General → Repository name）。改名后旧地址会自动跳转，Pages 地址会变为 `…github.io/bible-reformed-overview-CCstudy/`。

## 🗂️ 页面

| 页面 | 内容 |
|---|---|
| `index.html` 全景 | 总纲、救赎七幕、圣约神学图、五条主线、总时间线（7 个锚点口诀）、南北国王表（善恶色标）、先知与王对照、六大帝国、Leaflet 交互地图、文化区域、正典结构、五经深读 |
| `books.html` 66 卷 | 逐卷：钥节、为什么写、结构、核心、指向基督、难点、信条、应用、口诀；可筛选、搜索 |
| `creeds.html` 信经与信条 | 三大普世信经与三项联合信条全文（逐字取自《中国改革宗教会敬拜手册》2015 版，含导言和经文出处）、背诵遮挡模式、海德堡按 52 主日折叠、深度对比、为什么需要三份、与威斯敏斯特信仰准则对照 |
| `classic.html` 经典版 | v1 单文件版（时间线、列王甘特图、71 张闪卡、自测等），完整保留 |

界面提供 4 套主题（晨曦、夜读、橄榄、君王紫），可点击切换；有毛玻璃效果、可隐藏目录和阅读进度条，适配手机、平板和电脑。
笔记标记：<b>橙色粗体</b>表示核心，荧光底纹表示必背，实线是关键词，虚线是次重点，波浪线是难点；另有 🔑🧠⚠️📜🌱 提示块。

## 📦 版本说明

| 版本 | 日期 | 说明 | 恢复 |
|---|---|---|---|
| v1.0.0 | 2026-10-21 之前 | 单文件“圣经全解”经典版 | 分支 `legacy-v1.0.0-20261021`：`git checkout legacy-v1.0.0-20261021` |
| v2.0.0 | 2026-10-21 | CCstudy 改版：多页面、4 主题、66 卷逐卷、信经全文与背诵、交互地图；经典版保留为 `classic.html` | 提交 v2.0.0 |
| **v2.1.0** | 2026-10-21 | 顺滑版：Lenis 惯性滚动、rAF 节流和 IntersectionObserver、去掉逐卡毛玻璃（滚动由约 16 fps 提升到约 60 fps）；飘动云背景（只用 transform 动画）；主题增至 7 套（新增海洋、樱花、水墨），切换时用 View Transitions 淡入；新增王与先知甘特图、12 时代×书卷对照表、七锚点闪卡、66 卷闪卡模式；笔记标记新增彩色底纹、双下划线、彩色标签、序号 | `main` |

## 🚀 部署与运维

- **GitHub Pages**：`.github/workflows/pages.yml` 先构建经典版，再把 `site/` 同步到 `docs/` 并提交。Pages 从 main 分支的 `/docs` 发布。
- **Netlify**：已在 Netlify 中直接关联本仓库（发布目录 `site`），推送后自动部署，不需要令牌。
- **Surge**：组织 Secret `SURGE_TOKEN` 已配置（Public repositories 可用）。如需更换令牌：
  - `SURGE_TOKEN`：本地运行 `npx surge login`，再运行 `npx surge token` 获取

  添加后，下一次推送会自动部署到 Surge。
- **修改内容**：
  - 新版：直接编辑 `site/` 下的文件。66 卷的数据在 `site/assets/books-*.js`。
  - 信条页：由 `scripts/build_creeds.py` 和 `scripts/creeds.tpl.html` 生成。
  - 经典版：编辑 `build/` 下的分片，然后运行 `./build.sh`。

### 经典版（v1，`classic.html`）包含什么

| 部分 | 内容 |
|---|---|
| 序 | 三条阅读路径、界面说明 |
| 壹 全景 | 三种框架囚笼、圣经四属性、三层权威、基督中心、释经四律 |
| 贰 时间线与列王 | 全景轴、68 个节点年表、中国朝代同期对照、**王国三阶段**、**42 位王双轨甘特图**、先知⇄列王对应、列强更替、希律家族与罗马皇帝、**六锚点记忆系统** |
| 叁 故事线 | 六幕剧、三条主线（后裔／同在／国度）、三次张力高峰 |
| 肆 圣经神学 | 沃斯四特征、historia／ordo salutis、预表四准则 |
| 伍 圣约神学 | 三约结构、宗主条约五要素、五记号、婴儿洗论证 |
| 陆 逐卷 | 66 卷互动导读，每卷九字段（含故事线位置与圣约期） |
| 柒 教义纵贯 | 神论／人论／基督论／救恩论／教会论／末世论 |
| 捌 认信坐标 | 三大普世信经 ＋ 三项联合信条，含使徒信经⇄圣经⇄海德堡对照 |
| 玖 多视角 | 圣约／时代／新约神学，与路德宗、罗马、东正教、批判学 |
| 拾 应用 | 规范性原则、读经法、家庭崇拜、确据、汉语处境 |
| 拾壹 记忆引擎 | 十个骨架口诀、71 张闪卡（8 类，进度可保存）、16 道自测、52 主日、十三周计划 |
| 拾贰 图解 | 4 张地图、4 张流程图、2 张思维导图、会幕图、信仰之盾、3 组动态图表 |
| 附录 | 66 卷速查表、36 条术语、延伸阅读 |

## 技术要点

- **单文件 HTML，零外部请求**：无 CDN、无外链字体、无图片文件。所有地图与图表均为手绘 SVG 或由 JS 从数据实时生成 —— 在中国大陆网络环境下可完整离线打开。
- 可隐藏目录（自动从标题生成）、全站搜索浮层（`/` 唤出）、阅读进度条、三态主题（随系统／浅／深）、移动端抽屉。
- 动画：路线用 `pathLength="1"` + `stroke-dashoffset` 过渡；柱状图用 `transform-box:fill-box` 缩放；统一挂在 rAF 滚动循环上按需触发，并对 `prefers-reduced-motion` 与打印模式提供静态回退。
- 打印样式：A4，隐藏交互控件，所有图层与闪卡答案强制展开。

## 目录结构

```
build/          分片源文件（HTML 片段 + JS 数据 + 行为脚本）
  00-head.html        head 与全部 CSS
  01-hero-p1.html     扉页与第壹部分
  02-timeline.html    第贰部分 2.1–2.3
  02b-kings.html      第贰部分 2.4–2.9（列王与年代）
  03..07b-*.html      第叁—拾贰部分
  08-appendix.html    附录与页脚
  90-data-ot.js       旧约 39 卷数据
  91-data-nt.js       新约 27 卷数据
  92-data-extra.js    故事线／圣约期、时间线事件、术语、列王、先知、帝国
  93-data-cards.js    52 主日、71 张闪卡、16 道自测
  94-behavior.js      全部交互与图表渲染
build.sh        把分片 cat 成 site/index.html
site/index.html 构建产物（Netlify 发布目录）
docs/index.html 同一产物（GitHub Pages 发布目录）
tools/          校验脚本
```


## 本地构建与校验（经典版）

```bash
./build.sh            # 合并分片，生成 site/classic.html
node tools/test.js    # 交互回归测试
```

## 内容立场与免责

依三大普世信经（使徒／尼西亚／亚他那修）与三项联合信条（比利时信条／海德堡要理问答／多特信经）编纂，方法上取救赎历史与圣约神学路线。经文引用取自和合本。

- 所有神学分歧均已标明属**传统内合法分歧**抑或**正统与异端之别**；
- 年代学采用 Thiele 体系并在页内说明其争议（早期／晚期出埃及说等）；
- 全部地图均标注为**示意图**：相对方位与路线次序准确，距离与海岸线不按比例。

本页为教学与研读用途，不取代教会的教导与牧养。

**Soli Deo Gloria**
