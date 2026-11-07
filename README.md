# Tianhao's Lab

这个数字花园基于 [Quartz v5](https://quartz.jzhao.xyz/) 构建，用于将笔记、随笔和科研资料发布为可访问的网站。

生产域名为 `https://tianhao.blog`。在 `quartz.config.yaml` 中设置 `configuration.baseUrl: tianhao.blog`（不加协议）；构建统一读取此配置。部署环境若设置了 `QUARTZ_BASE_URL`，该变量会覆盖文件配置，应删除旧值或设置为 `tianhao.blog`。

站点当前只发布中文，保留完整的双语源文件结构：

- 中文内容位于 `content/`
- 英文内容位于 `content-en/`，暂不发布
- 中文站点输出到 `public/`
- 英文恢复发布后输出到 `public/en/`

发布开关位于 `quartz/publication.json`，当前为 `"englishEnabled": false`。它统一控制英文构建和语言切换按钮。`npm run build`、`npx quartz build`、`npm run dev` 以及原部署命令 `npm run build:i18n` 都遵守此开关，当前只生成中文站。构建会清理旧输出，因此不会残留上一次的 `public/en/`。

以后恢复英文时，只需将 `englishEnabled` 改为 `true`，重启预览进程并重新构建、部署，即可恢复 `/en/`、语言按钮和英文搜索索引、RSS、站点地图。无需修改文章的 `draft` 或 `translations`。暂停期间不支持用 `-d content-en` 绕过开关发布英文。

## 主题和样式

- **主题**: 基于 Quartz v5 的现代简约风格
- **颜色方案**: 保留原 Quartz v4 配置中的浅色/深色模式
- **排版**: 保留原 Quartz v4 配置中的中英文阅读体验

## 内容目录

一级目录使用带编号的英文文件夹名，方便控制导航顺序并生成英文 URL：

- `00Aboutme`：个人资料
- `01Code`：代码、开发与计算机基础
- `02Engineering/Materials`：材料研究
- `02Engineering/Structure`：结构工程
- `03Notes`：科研与阅读笔记
- `04Blog`：个人随笔
- `05Tools`：工具配置与实践
- `06Misc`：杂项

英文目录与中文目录一一对应。附件集中在 `content/Attachments/`，按对应分类保存，例如 `Attachments/01Code/`；启用英文发布时，构建会将共用附件复制到英文站点。

目录和文章的网页显示名称由 Markdown frontmatter 中的 `title` 控制。因此文件夹名可以保持英文，网页上仍然可以显示中文标题。

Quartz 会将 URL slug 规范化为小写。例如 `content/01Code/index.md` 最终对应 `/01code/`。双语跳转链接也应使用小写 URL。

中英文文章通过 frontmatter 的 `translations` 字段建立对应关系，暂停英文发布时仍保留这些字段，但不显示语言入口：

```yaml
---
title: 示例文章
translations:
  en: "/en/01code/example"
---
```

英文文章对应写法：

```yaml
---
title: Example Article
lang: en-US
translations:
  zh: "/01code/example"
---
```

## 本地开发

```bash
# 安装依赖
npm install

# 安装 Quartz v5 插件
npx quartz plugin install --from-config

# 启动本地预览（当前只发布中文）
npm run dev

# 按发布开关构建站点
npm run build

# 只构建中文站点
npx quartz build -d content

# 兼容原部署命令，同样遵守发布开关
npm run build:i18n
```

`npm run build:i18n` 保留旧命令名称以兼容现有部署设置，但不会强制发布英文。仅在 `englishEnabled: true` 且不指定 `-d` 时，构建入口才会依次生成中文站点及 `/en/` 英文站点，英文域名路径自动从 `configuration.baseUrl` 派生。

本地预览推荐 `npm run dev`，它明确调用本仓库的入口。如果 `npx quartz build --serve` 实际调用了 npm 缓存中的 Quartz，可能使用不同版本的 CLI，导致双语域名、附件或构建结果不一致。请先在原终端按 `Ctrl+C` 停止旧服务器，再运行 `npm run dev`，不要让两个构建进程同时写入 `public/`。

## 部署

部署生产站点时可以使用：

```bash
npm run build
```

部署目录为 `public/`。其中：

- `public/` 根目录是中文站点
- 当前不生成 `public/en/`，也不生成英文搜索索引、RSS 或站点地图
- `public/index.xml` 是 RSS 订阅源
- `public/sitemap.xml` 是搜索引擎站点地图

RSS 仅收录正式发布的 Markdown 文章，排除首页、目录页、自动生成页面、草稿、未列出及加密笔记，优先按 `published` 日期倒序取最新 10 篇；未设置发布时间时沿用 Quartz 的 Git/文件日期信息。当前订阅地址为 `https://tianhao.blog/index.xml`。搜索索引与站点地图仍保留中文标签页、目录页；英文发布恢复后才会重新生成英文对应文件。

现有部署平台若仍使用 `npm run build:i18n` 或 `npx quartz build`，无需更改命令。部署目录保持 `public/`。部署应替换旧站点产物，不应将新文件增量叠加到旧英文目录上；如果 CDN 仍返回旧 `/en/` 页面，需要清除相应缓存。搜索引擎已经收录的旧页面也需要时间才能移除。

目录调整后，可运行下列命令检查内容、双语映射和生成页面的链接：

```bash
npm run check:content
npm run check:bilingual
npm run check:publication
npm run check:built-links
npm run check:built-domain
npm run check:rss
npm run check:language-switch
npm run check:site-stats
npm run check:comments
```

## 常见提示

### Twikoo 评论

Quartz 连接 Mizuki 已有的 Netlify Twikoo 后台，不创建新数据库，也不重复导入评论。客户端沿用 `1.6.44`，静态资源位于 `quartz/static/twikoo/`，与现有后台匹配。后台地址是公开的前端配置；数据库连接串、管理员密码和评论导出文件不能放进博客仓库。

评论显示在正式文章正文下方及首页，目录页、标签页、404、草稿、未列出/加密笔记不显示；单篇笔记可在 YAML 中设置 `comments: false` 关闭。中英文界面分别显示中文/英文，但对应文章共享同一评论标识。

旧评论映射保存在 `quartz/plugins/twikoo-comments/dist/components/paths.js`：

| Quartz 中文页面                         | 旧 Twikoo 评论标识                 |
| --------------------------------------- | ---------------------------------- |
| `/`                                     | `/posts/about-me`                  |
| `/02engineering/structure/plasticity-2` | `/posts/elastoplastic-mechanics-2` |
| `/05tools/obsidian-mizuki`              | `/posts/obsidianmizuki`            |
| `/01code/github-profile`                | `/posts/github-profile`            |
| `/05tools/mcm-template`                 | `/posts/latex-mcm-template`        |

不要修改表中的旧标识，否则现有评论会关联不到页面。新文章默认使用 `/notes/文章slug`，移动分类目录不改变评论标识；重命名文章时，可在中英文 YAML 中同时设置同一个 `commentPath` 固定原标识。`npm run check:comments` 检查页面映射、语言、资源及标识冲突。

运行 `npm run dev` 后，本地也能读取线上评论。默认 `previewReadOnly: true` 会在非正式域名的预览中隐藏留言输入框、回复及点赞控件，避免测试留言写入正式数据库；这只是前端预览保护，不是后台权限控制。部署到 `configuration.baseUrl` 的正式主机名后恢复留言功能。若确需在预览中测试真实留言，可把该选项设为 `false`，注意提交会直接写入线上数据库。

本项目不会上传或导入评论备份，也不会改变 Netlify/MongoDB 配置。更换后台或升级版本前，应先导出备份。页面切换会重新挂载对应评论，切换前清理旧组件；本地读取失败时检查网络及后台跨域来源配置。

评论列表使用文字加载提示，不显示大尺寸旋转遮罩；成功返回零评论后显示“暂无评论 / No comments yet”。加载失败或评论请求超过 20 秒时显示错误和重试按钮，不会把失败当作零评论。页面切换会清理请求状态监听及计时器，刷新会清除旧错误。

### 网站访问统计

左侧搜索工具栏下方、探索目录上方显示不蒜子统计（桌面及平板侧栏）。包含全站访问/访客、本页阅读/访客，不显示今日访问及今日访客，中英文界面自动切换标签。

接入的是 [busuanzi.cc](https://www.busuanzi.cc/doc.php)，不是其他同名计数服务。组件按官方 `3.6.9` 脚本的 POST 协议请求 `https://cdn.busuanzi.cc/api.php`，并使用官方全站及本页的四个计数标签 ID；不额外加载官方脚本，以免重复计数。Quartz 的每次页面导航会更新统计，过期请求会被取消；页内锚点和界面重绘不会额外计数。中文 `/` 和英文 `/en/` 使用同一域名的全站统计，各自页面的阅读量分开统计。

仅在 `configuration.baseUrl` 所配置的主机名上发送请求，本地 `localhost` 预览不计数，也不会显示真实数字。广告拦截器或服务不可用时显示“统计暂不可用”，不会显示虚假的零。此第三方服务会接收当前页面地址及来源地址，访问记录由不蒜子处理；现有 Plausible 配置保持不变，两者的统计口径可能不同。上线需重新构建并部署 `public/`。

构建时如果看到类似下面的警告：

```text
Warning: content/01Code/index.md isn't yet tracked by git, dates will be inaccurate
```

这表示该文件还没有被 Git 跟踪，Quartz 无法从 Git 历史中读取准确日期。将文件加入 Git 并提交后，这个警告会消失。

## 贡献者

感谢以下开源项目为这个数字花园提供支持：

- [Jacky Zhao](https://github.com/jackyzha0) - Quartz 框架的创建者
- Quartz 社区的所有贡献者

## 许可证

博客原创内容采用 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 许可。也就是说，非商业使用、转载和改编需要署名，并以相同协议共享。

站点框架基于 [Quartz](https://github.com/jackyzha0/quartz) 构建，Quartz 相关源代码保留其上游 MIT 许可证。页脚中的 `RSS` 链接指向 `/index.xml`，可用于订阅博客更新；`sitemap.xml` 主要供搜索引擎发现页面使用。
