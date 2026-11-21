# 毒物大百科 · Agent README

> 更新时间：2026-11-20（v8.1 全英文百科 × 680 核心词汇 × 3D 点翻词卡 × 自建 VoxCPM2 真人语音版）｜ 本文件是该项目的唯一入口文档，不含任何密钥

## 1. 项目背景

给一个能背下斋藤胜裕《致命毒物大百科》99 篇目录的 8 岁孩子做的**全英文科普百科 × 英语核心词学习互动站**（产品名「Toxic Science Wonderpark / 奇妙毒物科学游乐园」）。默认全英文沉浸模式（剑桥 Movers–Flyers / RAZ G–M）+ 暖白绘本护眼主题，支持顶栏一键切回原中文版（`🇬🇧 EN ⇄ 中文`）与夜间模式（`🌙 Night`）：
- 全书 99 张实拍+写实插画绘本闪卡、297 个英文版「十万个为什么」、99 篇生活故事与实况解说，全部内置 **3D 原地点击翻词引擎**（680 个 KET/PET + Kids-AWL 核心词自动加粗，全站 8,930 词形 100% 命中翻中文，点击即播真人发音 → 3D 翻出中文 → 3.6 秒自动翻回 → 自动收入 `🧰 My Word Box` 生词宝盒，复习答对 3 次自动毕业）。
- 第 5 站升级为 **🏝️ Word Island（单词探险岛）**：17 张 Kurzgesagt 扁平绘本插画（含吉祥物黄金箭毒蛙小博士 Professor Dart、6 大核心词主题世界、6 只元素 Boss），涵盖 10 款英语游戏（含怪兽大作战、图文语境填空、生词宝盒闪卡闯关、近反义词/词族连连看、680 核心词典及 5 款升级经典玩法）。
- 语音系统全面接入用户自建 0 成本 **48kHz VoxCPM2 云端克隆语音**（1,074 条全量预生成中文/双语静态语音 + 2,618 条全英文内容通过 `voice_server.py` 与 `scripts/prewarm_server_tts.py` 永久磁盘缓存 0ms 播放）。

## 2. 当前状态（实测）

- 分支 / 远端：`main`；远端 `origin` = `https://github.com/woainijyq-source/duwu-encyclopedia.git`；线上地址 `https://crm.truing.top/duwu/`。
- 最近里程碑：`v8.1` 完成全站全英文升级、680 核心词库、3D 点翻词卡与生词宝盒、17 张原创绘本插画、4 款全新核心词游戏、自建 VoxCPM2 真人语音接管与 `/api/progress` 跨设备云同步。
- 一句话状态判断：**v8.1 全量完成并上线 `https://crm.truing.top/duwu/`**。

## 3. 详细信息

### 3.1 技术栈与运行形态

- 前端：纯静态 HTML + CSS + 原生 JavaScript，无框架、无构建、无 npm、无 CDN 外链（README.md；仓库内无 package.json）。`index.html` 单页按固定顺序注入 21 个 `js/*.js`（全部带 `?v=7.0` 查询串）。数据全部内嵌为 JS 文件（如 `js/data-catalog.js` 74 KB、`js/data-curiosity-english.js` 401 KB）。
- PWA：`manifest.webmanifest` + `sw.js`（缓存名 `duwu-playground-v7.0`），支持 iPad Safari「添加到主屏幕」离线秒开；`.mp4` 与 Range 请求永不走缓存（sw.js 注释）。
- 后端：`deploy/voice_server.py`，Python 3 标准库单文件、零依赖（653 行），监听 `127.0.0.1:8798`，由 systemd 单元 `duwu-voice.service` 常驻；提供录音云同步、豆包 TTS 代理缓存、LLM 聊天三个接口。
- 本机形态：`python3 -m http.server 8892` 静态站（无后端；TTS/聊天/录音接口在本机 8892 下不可用）。

### 3.2 目录结构地图

| 路径 | 作用 |
| --- | --- |
| `index.html` | 唯一页面入口；19 个脚本加载顺序在此定义，改 js 必须同步其 `?v=` 版本号 |
| `js/app.js` | 前端主逻辑（卡片/导航/实验编排/四视图切换） |
| `js/data-catalog.js` | 全书序章 + 第 1～8 章 99 条毒物条目数据 |
| `js/data-real-videos.js` | 全书 99/99 实景与写实生态动态短片清单（区分 `camera` 野外/实验真实实拍 39 条与 `realistic_scene` 写实动态还原 60 条） |
| `js/data-curiosity-english.js` | 99 卡「生活中的真实实例」故事与写实插画 + 「十万个为什么」3连问（297 故事）+ 实况解说 + 眼力侦探题 + 英文名/297科学词卡/双语情景句 |
| `js/data-card-interactions.js` | 99 卡专属实验/答题/传送内容（193 KB，11-14 新增） |
| `js/upgrade1~5-*.js` | 五大进阶模块：生态寻宝、分子手术、王牌对战（含卡面英文名）、配音间、实况与生活实例伴读及英语点读/拼词/听句填词/跟读 |
| `js/upgrade6-english-playground.js` | 第 5 站「🇬🇧 毒物英语游乐场」6 大游戏：字母积木拼词屋、3D 双语翻翻乐、英文造句小火车、听音戳泡泡、英语开口小舞台、251 词科学词典 |
| `js/upgrade7-knowledge-games.js` | 第 4 站知识闯关（Venom vs Poison 分类实验室、16 关生活安全大冒险、95 宗神秘毒物三步破案、24 关真假科学大法官）+ 🏅 小馆长科学英语护照（每日任务 & 16 枚勋章） |
| `js/doubao-tts.js` / `js/ai-companion.js` | TTS 客户端 / AI 语音伴侣客户端（调 `./api/tts`、`./api/chat`） |
| `js/data-tts-manifest.js` | 1054 条预生成豆包 TTS 音频清单，配合 `assets/tts/` 实现 0ms 播放 |
| `sw.js` | Service Worker：CORE_SHELL 清单 + 缓存名版本号，改 js/css 必改这里 |
| `css/styles.css` | 全站样式（56 KB） |
| `deploy/voice_server.py` | 后端 API（录音 / TTS / 聊天），环境变量见 3.4 |
| `deploy/deploy.sh` | 一键原子发布脚本（见 3.5） |
| `deploy/nginx-duwu.conf` | 线上 nginx 片段：`/duwu/` 静态 alias + `/duwu/api/` 反代 8798 |
| `deploy/duwu-voice.service` | 远端 systemd 单元；`deploy/tts.env.example` 为配置变量示例 |
| `assets/` | 全部入库：photos 99 张、illustrations 99 张写实科学生活插画、real-videos 99 条动态短片、videos 99 条姐姐配音生活剧场短片、tts 1054 条预生成语音、scenes 6 张、intro_video.mp4 |
| `scripts/make_action_videos.py` / `make_intro_video.py` | 资产生成脚本（需 PIL/ffmpeg/外部密钥，重跑会改写 assets/） |
| `启动探索站.command` | macOS 双击启动本机 8892 静态站（绑定 0.0.0.0） |

### 3.3 本地怎么跑起来

- 无需安装依赖、无需构建（纯静态）。
- 启动：双击 `启动探索站.command`，或手动 `python3 -m http.server 8892`（来源 README.md；.command 内为 `--bind 0.0.0.0` 并打印局域网 IP 供 iPad 访问）。
- 构建：无。前端「版本发布」靠手工同步三处版本号：`index.html` 的 `?v=6.0`、`sw.js` 的 `CACHE_NAME`、`sw.js` 的 `CORE_SHELL` 清单。
- 测试：无测试目录、无测试命令（全仓库无 test/CI 配置，实测 find 无命中）。
- 资产再生：`scripts/make_action_videos.py`（生成 99 条 5 秒短视频）与 `scripts/make_intro_video.py`（生成介绍视频），会读外部 .env 里的密钥并改写 `assets/`，只读调研未运行。

### 3.4 数据、存储与外部依赖

- 数据库：无。条目/分子/实验数据全部内嵌在 `js/data-*.js`。
- 客户端持久化：IndexedDB 存本地录音与 TTS 缓存（README.md、voice_server.py 接口注释）。
- 服务端文件存储：`/www/wwwroot/duwu-encyclopedia/shared-data/recordings/`（小馆长配音，archiveId 格式 `ch[0-8]-NN` 或带 `__后缀` 的多条录音，单条上限 25 MB）与 `shared-data/tts-cache/`（按文本 SHA-256 永久缓存 mp3），发版切软链不丢数据。
- 外部服务（只写服务名与变量名，不写值）：豆包语音合成 seed-tts-2.0（`VOLC_TTS_ENDPOINT`、`VOLC_TTS_KEY`、`VOLC_TTS_RESOURCE_ID`、`VOLC_TTS_SPEAKER`）；LLM 聊天走 `AI_BASE`（默认 `https://doudou-newapi.com`）+ `AI_KEY` + `AI_MODEL`。限流与开关变量：`TTS_PER_IP_HOUR`、`TTS_PER_DAY`、`CHAT_PER_IP_HOUR`、`CHAT_PER_DAY`、`DUWU_STRICT_ORIGIN`（默认严格校验 Origin）。来源 `deploy/voice_server.py` 与 `deploy/tts.env.example`。

### 3.5 部署与线上

- 线上地址：`https://crm.truing.top/duwu/`（README.md 明确标注，PWA 可加主屏幕）。
- 服务器别名：`insurance-crm-us`（deploy.sh `REMOTE_HOST`），即美国共用机 `64.83.15.173`（共享索引 `/Users/mac/projects/_shared/infra/docs/servers.md`）。
- 远端布局：`/www/wwwroot/duwu-encyclopedia/releases/<UTC时间戳>/` + `current` 软链 + `shared-data/`（voice_server.py、tts.env、recordings、tts-cache）。
- 进程：systemd 服务 `duwu-voice.service`，ExecStart `/usr/bin/python3 .../shared-data/voice_server.py`，Restart=always；nginx 把 `/duwu/api/` 反代到 `127.0.0.1:8798/api/`。
- 发布方式：项目根执行 `./deploy/deploy.sh`——tar 上传静态包 → 部署 voice_server + systemd 重启 → `ln -sfn` 原子切 `current` → scp nginx 片段到 `/etc/nginx/snippets/duwu-encyclopedia.conf` 并确认 CRM 站点 include 后 reload。注意：发布的是**当前工作树**（tar 打包），不是某个 commit。
- 回滚方式：deploy.sh 无回滚命令；机制上可 `ssh insurance-crm-us ln -sfn <旧releases目录> /www/wwwroot/duwu-encyclopedia/current`（软链结构推得，未实测）。
- 密钥来源：deploy.sh 运行时从 `/Users/mac/projects/电子宠物/server/.env` 取 `DOUBAO_TTS_API_KEY`、从 `/Users/mac/projects/doudou-writing/.env` 取 `AI_BASE`/`AI_KEY`/`AI_MODEL`，拼成远端 `shared-data/tts.env`（chmod 600）；仓库内只有 `deploy/tts.env.example` 变量名示例。

### 3.6 测试与验收方式

- 无自动化测试。验收靠手工：本机 8892 打开 → iPad/手机同 Wi-Fi 访问局域网 IP:8892 → 线上访问 `https://crm.truing.top/duwu/` 并「添加到主屏幕」验证离线。
- 后端健康可用 `GET /duwu/api/tts/stats`（voice_server.py 内置，返回 configured/cachedFiles，不含密钥）。
- 发布后建议核对：index.html 与若干 js 的 `?v=` 是否已升版本（sw.js Network-First，代码即时生效；assets 走 7 天强缓存）。

## 4. 已知问题与下一步

1. **豆包 TTS 配额耗尽（1054/1078 静态语音已入库）**：`/Users/mac/projects/电子宠物/server/.env` 中的 `DOUBAO_TTS_API_KEY`（`seed-tts-2.0`）在生成至第 1054 条静态 MP3 后触发火山引擎配额/资源授权错误（HTTP 403 `code 45000030`）。所有已入库的 1054 条静态语音（含 100% 卡片介绍、生活实例、实况旁白、配音剧场及绝大部分十万个为什么/英文句）均本地 0ms 播放、不消耗 API；其余 24 条子音频与动态「随时互动」AI 语音将自动优雅降级为浏览器内置 `speechSynthesis`（保留逐句高亮），待火山引擎续费/更新密钥并重跑 `./deploy/deploy.sh` 后即可恢复实时豆包合成。
2. **旧快照结论已作废**：`项目情况汇报/10-逐项目正文/毒物大百科.md`（11-12 版）称「无 .git、无远端、仅本机 8892」——现已有 GitHub 远端、正式线上站与 systemd 后端，引用旧文必须复核。
3. **无 HANDOFF/进度文档**：唯一文档 README.md 偏功能宣传；99 条短视频与 3D 分子的生成口径只散落在 `scripts/*.py` docstring，接手成本高。
4. **deploy.sh 对外部 .env 强耦合**：若 `电子宠物/server/.env` 缺失则远端 tts.env 不更新但仍重启服务；若 `doudou-writing/.env` 缺失则 `AI_KEY` 静默为空串写入，聊天功能静默失效。
5. **版本号三处手工同步易漏**：`index.html ?v=`、`sw.js CACHE_NAME`、`sw.js CORE_SHELL`，漏改会导致 iPad 端旧缓存或新脚本不被预缓存（对照提交 `d83014b`、`9b3c486` 均三处同改）。
6. **视频不吃离线缓存**：sw.js 对 `.mp4`/Range 一律直连网络，v4.0 的 99 条视频在纯离线模式下不可播（sw.js 注释称是为 iOS 流播秒开有意为之，但属体验取舍，值得复核）。
7. **129 MB 媒体全部入 git**：clone 与浅历史需求日益明显；未配置 LFS。
8. **共享索引缺行**：`_shared/infra/docs/servers.md` 的该机租户表尚无 duwu 条目，按共享约定部署核实后应回写非秘密事实与验证日期。

## 5. 与其它目录的关系

- 本目录就是唯一 git 仓库：`find . -maxdepth 3 -name .git` 仅命中 `./.git`，无内层嵌套仓库；`git worktree list` 仅主工作副本，无双分支工作区。
- 密钥供给方（勿在此目录改它们）：`/Users/mac/projects/电子宠物/`（其 server/.env 供 TTS 密钥）与 `/Users/mac/projects/doudou-writing/`（其 .env 供聊天 API 三项配置），两者是各自独立的 git 仓库。
- 同服务器邻居：`insurance-crm-us` 上主站是保险管理系统（PM2 `insurance-crm`，站点配置属 CRM）；`duwu` 只是 `crm.truing.top` 站点里的一个 nginx 片段（同机还托管 /manual/、/town/、/linhe-elderly* 等，见 `_shared/infra/docs/servers.md`）。**别为了 duwu 去改 `/etc/nginx/sites-available/insurance-crm` 本体**，只动 `duwu-encyclopedia*.conf` 片段；CRM 侧发布时需保留 duwu 的 include 行（deploy.sh 已按此假设断言校验）。
- 历史快照：`/Users/mac/projects/项目情况汇报/10-逐项目正文/毒物大百科.md` 是 11-12 旧正文，仅作线索（见第 4 节第 2 条）。

## 6. 改代码前必读

阅读顺序：
1. `README.md` —— 了解产品形态、四大游乐场功能边界与线上地址，避免误删「孩子视角」的功能。
2. `deploy/deploy.sh` —— 发布全流程、远端布局、密钥从哪两台 .env 拼装、nginx 如何嵌入 CRM 站点。
3. `deploy/voice_server.py` 开头 docstring —— 录音/TTS/聊天三个 API 的完整契约与存储路径。
4. `sw.js` + `index.html` 脚本清单 —— 16 个 js 的加载顺序与「三处版本号」维护约定。
5. `deploy/nginx-duwu.conf` —— `/duwu/` alias、缓存策略与 API 反代，改路径前必看。
6. （线索级）`项目情况汇报/10-逐项目正文/毒物大百科.md` —— 11-12 之前的历史状态。

维护约定：
- 改内容只动 `js/data-*.js`；改玩法动 `js/upgrade*.js` 与 `js/app.js`；样式集中 `css/styles.css`。
- 每次改 js/css：同步 `index.html ?v=`、`sw.js CACHE_NAME`，新增 js 还要进 `sw.js CORE_SHELL` 与 `index.html` 对应位置。
- 别动 `voice_server.py` 里的 archiveId 正则（`ch[0-8]-\d{2}` 及 `__` 后缀），线上已有录音依赖它。
- 仓库内严禁出现密钥；密钥只在原有 .env 来源与远端 `shared-data/tts.env` 流转。
- 提交规矩：本机 8892 手工验证 → git commit/push `main` → 确认工作树干净后 `./deploy/deploy.sh`（它发布工作树，不发布 commit，脏改动会被一起上线）。

## 7. 最近提交摘要

最近主要版本里程碑（git log 实测）：
- 2026-11-17 `v6.0` 全书 99/99 写实动态短片、99 张写实生活插画、99 部姐姐配音生活实例剧场短片与 1054 条预生成语音包
- 2026-11-17 `d6ab389` 新增 50 条核验实况短片、297 个十万个为什么故事与趣味英语互动课堂（v5.0）
- 2026-11-14 `a6ad6e3` 为每张卡增加 99 条短「攻击/施毒机制」视频，全站升 v4.0
- 2026-11-14 `d83014b` 新增 99 卡专属互动实验、答题与游乐传送（data-card-interactions.js +4663 行）
- 2026-11-13 `9b3c486` 按住即录、不限时长 + 每种毒物支持多条录音（含 nginx 上传上限 25m）
- 2026-11-12 `25a2dd3` 打包 1080p 带旁白项目介绍视频与顶栏播放器
- 2026-11-12 `9e3c23c` 预生成 286 条豆包 TTS 音频全部入库 assets/tts，实现 0ms 播放
- 2026-11-12 `e5f405d` 英文句朗读两遍 + 重点英文单词放大高亮
- 2026-11-12 `1a1208b` 选择性双语穿插英语学习 + 随时可唤 DeepSeek+豆包互动语音伴侣
- 2026-11-12 `7f7086d` 「给我讲解」按钮清理、加载动画、波形对齐逐句放大
- 2026-11-12 `042df2a` 接入豆包 seed-tts-2.0：客户端 IndexedDB + 服务端 SHA-256 双级缓存
- 2026-11-12 `6ac99a2` 奇妙毒物科学游乐园 v3 完整交互版初始发布（含 git 导入与部署骨架）
