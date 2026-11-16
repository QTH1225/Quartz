# Tianhao's Lab

基于 [Quartz v5](https://quartz.jzhao.xyz/) 的中文数字花园，用于发布代码、工程学习、科研笔记和个人随笔。

生产域名为 `https://tianhao.blog`。`quartz.config.yaml` 中的 `configuration.baseUrl` 填写 `tianhao.blog`，不加协议。部署环境的 `QUARTZ_BASE_URL` 会覆盖此配置，请检查是否仍有旧值。

## 内容与附件

正文位于 `content/`，网站输出到 `public/`。英文站源文件、翻译脚本、双语发布开关和语言切换插件已移除。搜索、RSS 和站点地图只包含中文站页面；语言由 `configuration.locale: zh-CN` 统一管理，笔记 YAML 无需 `lang` 或 `translations`。

| 正文目录     | 内容                       |
| ------------ | -------------------------- |
| `00Aboutme`  | 个人资料                   |
| `01Code`     | 代码、开发与计算机基础     |
| `02Research` | 结构、材料与公开的文献精读 |
| `03Notes`    | 通用学习方法与知识笔记     |
| `04Blog`     | 个人随笔                   |
| `05Tools`    | 工具配置与实践             |
| `06Misc`     | 杂项                       |

文件夹和文件名继续使用现有名称，网站标题由 YAML 的 `title` 控制，URL 由 Quartz 转为小写。纯中文站不要求将文件名或技术专名改成中文。

附件统一平铺在 `Attachments/分类目录/` 下，不按笔记名称创建子目录，例如：

```text
content/
  01Code/markdown-basics.md
  Attachments/01Code/markdown-example.svg
  00Aboutme/Papers.md
  Attachments/00Aboutme/毕业设计.pdf
```

Obsidian Attachment Management 的 `attachmentRoot` 为 `Attachments/`，`attachmentPath` 为 `${notepath}`，不附加 `${notename}`。公开正文按一级分类平铺，科研附件统一放在 `Attachments/02Research/`。共用附件只保留一份，通过完整的知识库相对路径引用，例如 `[[Attachments/00Aboutme/毕设Poster.pdf|毕业设计海报]]`。Markdown 图片可使用相对于当前笔记的路径，空格需要编码。

`content/Templates/` 为模板目录，不发布。ZotLit 原始文献库位于 `content/02Research/Literature/`，被 Git 和构建同时忽略；旧路径 `03Notes/Literature` 和旧私有目录 `03Notes/文献精读` 的忽略规则继续保留，防止未重载的插件重新创建旧目录后误发布。不要把私有笔记的附件放到公开的 `Attachments/` 下；附件应存放在同一个被忽略的私有目录内。

Research 围绕具体研究问题积累专业理论、试验方法和文献证据；Notes 整理可复用的学习方法与知识；Blog 以个人经历、感受和观点为主。文献是否归入 Research 取决于内容与研究问题的关系，普通阅读摘记仍可放在 Notes。ZotLit 原始同步目录迁移到 `02Research/Literature`，插件路径已同步修改，仍保持私有；适合公开的精读文章单独整理到 Research。

`02Research` 目录内不再细分 Materials、Structure 等子目录，使用首页分组、现有标签和双链连接文章。移动没有改变原文标签或草稿状态。

## 开发与部署

```bash
npm install
npm run dev
npm run build
```

`npm run dev` 使用本仓库入口进行本地预览。旧服务器需先在原终端用 `Ctrl+C` 停止，避免多个进程同时写入 `public/`。`npx quartz build --serve` 若调用 npm 缓存中的其他版本，结果可能与本仓库不同。

部署构建命令使用 `npm run build`，输出目录为 `public/`。保留 `npm run build:i18n` 作为旧部署配置的兼容别名，它现在也只构建中文站。现有部署可继续使用，建议之后将平台命令改为 `npm run build`。

部署时替换旧产物；如 CDN 仍缓存旧 `/en/` 页面，需要清除缓存。此次本地修改不会自动更新线上网站。

`edgeone.json` 为本次科研目录迁移配置了旧网址到新网址的 301 跳转，供 EdgeOne Pages 部署读取。它不改变域名、构建命令或其他平台设置，本地 Quartz 预览不执行这些平台规则。旧分类目录首页跳转到“研究与文献”，旧文章路径跳转到同名新文章。

RSS 地址为 `https://tianhao.blog/index.xml`，收录最新 10 篇正式文章，排除首页、目录、草稿、未列出及加密笔记。优先按 `published` 排序，未填写时使用 Git/文件日期。`sitemap.xml` 供搜索引擎发现页面，搜索索引位于 `static/contentIndex.json`。

## 检查

```bash
npm run check:content
npm run check:publication
npm run check:built-links
npm run check:built-domain
npm run check:rss
npm run check:site-stats
npm run check:comments
npm run check:recent-notes
```

内容检查包含草稿，忽略模板及私有文献。`format:content-frontmatter` 为中文 YAML 规范化工具，不会生成英文映射，也不会处理私有文献或 ZotLit 模板。

## 评论与统计

评论沿用 Mizuki 的 Netlify Twikoo 后台和既有评论标识。旧文章映射位于 `quartz/plugins/twikoo-comments/dist/components/paths.js`，不要随意修改，否则可能关联不到已有评论。新文章默认使用 `/notes/文章slug`，如需重命名文章，可提前通过 YAML 的 `commentPath` 固定原标识。后台密钥、数据库连接串和评论导出文件不要提交到仓库。

评论在首页和正式文章显示，目录、标签页、404、草稿、未列出及加密笔记不显示；单篇可用 `comments: false` 关闭。本地默认只读取线上评论并隐藏输入框，正式域名恢复留言。邮件通知由 Twikoo 后台配置决定。

侧栏统计使用 [GoatCounter](https://tianhao.goatcounter.com/)，显示全站和本页访问量；公开计数受后台设置、浏览器拦截和网络影响。本地显示线上计数，不记录访问。已发布笔记数和字数在构建时生成，不依赖统计服务。笔记篇数不计入首页、目录页及 `00Aboutme`；字数排除链接地址、代码等非正文内容。

## 许可证

博客原创内容采用 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 许可。Quartz 框架及相关源代码保留各自的开源许可证。
