# 笔记路径整理记录

当前状态：后续已按要求删除中英文 `SiteTests` 测试文章与目录，并清除全部迁移用旧地址 `aliases`。下文保留上一轮整理时的历史记录。

本次仅移动文件并修复路径。中文、英文同步移动；笔记标题、正文内容、标签和草稿状态保持原样，正文仅替换站内链接及附件引用。保留已有旧地址别名，并为这次移动的笔记添加整理前地址的跳转。

| 整理前路径 | 整理后路径 |
| --- | --- |
| `03Notes/doc-engineering.md` | `01Code/doc-engineering.md` |
| `03Notes/doc-project.md` | `01Code/doc-project.md` |
| `03Notes/harness-engineering.md` | `01Code/harness-engineering.md` |
| `03Notes/zotero-plugins.md` | `05Tools/zotero-plugins.md` |
| `01Code/latex-snippets.md` | `05Tools/latex-snippets.md` |
| `01Code/mcm-template.md` | `05Tools/mcm-template.md` |
| `01Code/linux-setup.md` | `05Tools/linux-setup.md` |
| `01Code/obsidian-mizuki.md` | `05Tools/obsidian-mizuki.md` |
| `01Code/quartz-feature-test-article.md` | `01Code/SiteTests/quartz-feature-test-article.md` |

以上路径同时适用于 `content/` 与 `content-en/`。英文网页路径增加 `/en/` 前缀，网页目录名按 Quartz 规则使用小写。

附件同步移动：

- Harness Engineering 的 PDF：`Attachments/03Notes/` → `Attachments/01Code/`。
- Quartz 测试的 3 张 SVG：`Attachments/01Code/` → `Attachments/01Code/SiteTests/`。
- “提问的艺术”PDF 的原始归属仍是 `03Notes`，测试文章引用该文件时使用完整路径。

`01Code/latex-notes.md` 目前只有一个参考链接，未形成工具配置教程，因此暂留 `01Code`。工程仿真和制图笔记保留在 `02Engineering/Structure`。

已更新所有受影响的 `translations`、wikilink、Markdown/HTML 链接、附件引用及英文生成脚本的路径映射。标签原文通过移动前快照逐篇比较，附件通过 SHA-256 校验。

验证结果：108 篇带 YAML 的文件标签原文及非路径元数据保持一致；52 对中英文笔记映射正确；34 对已发布页面的语言切换正确；30 个旧地址跳转的目标均存在。完整构建后检查 151 个 HTML 文件中的 6122 个本地链接，失效引用为 0。

后续清理中，Markdown 教程仍使用的示例图另存为 `Attachments/01Code/markdown-example.svg` 并修复引用。测试目录以及清理前的笔记与别名信息备份于 `quartz/.quartz-cache/removed-sitetests-and-aliases/`。其余笔记标签原文保持不变；当前中英文切换仍由 `translations` 字段控制。旧网址不再自动跳转到新页面。
