# 笔记分类与标签建议

按 2026-10-11 的中文笔记内容整理。目录改名、六篇工具笔记的英文同步移动，以及下表中明确推荐的分类移动已经执行。表格中的笔记路径记录整理前的位置，最终位置见 [笔记路径整理记录](content-migration.md)。标签建议尚未应用，所有原标签均保留。

后续清理：Quartz 功能测试文章及 `SiteTests` 目录已按要求删除，目录迁移遗留的 `aliases` 也已清除。

## 目录的边界

目录用于确定笔记的主要用途，标签用于跨目录检索。每篇笔记建议使用 2–4 个主题标签，避免把目录名和更新状态全部堆进标签。

| 目录 | 适合的内容 |
| --- | --- |
| `00Aboutme` | 简历、成果、项目、个人信息 |
| `01Code` | 编程、计算机基础、开发方法、站点开发 |
| `02Engineering/Materials` | 水泥基材料、混凝土、储能材料与试验 |
| `02Engineering/Structure` | 结构设计、力学、工程制图、工程仿真 |
| `03Notes` | 科研方法、文献阅读、写作方法、学习记录 |
| `04Blog` | 个人经历、思考、故事 |
| `05Tools` | 软件配置、插件、排版工具、个人工作流 |
| `06Misc` | 暂时无法判断主要用途的内容 |

## 优先考虑调整分类的笔记

| 当前笔记 | 更推荐的目录 | 原因 | 建议标签 |
| --- | --- | --- | --- |
| `03Notes/doc-engineering.md` | `01Code`；文章增多后可建 `01Code/Documentation` | 讨论软件项目文档、职责分层与 AI 辅助开发，属于开发方法 | `documentation`, `knowledge-management`, `ai` |
| `03Notes/doc-project.md` | 与 `doc-engineering.md` 放在同一目录 | 属于同一系列的项目实践，适合连续阅读 | `documentation`, `workflow`, `ai` |
| `03Notes/harness-engineering.md` | `01Code`；后续可建 `01Code/AI` | 主要围绕 AI 编程环境与开发组织方式 | `ai`, `agent-engineering`, `documentation` |
| `03Notes/zotero-plugins.md` | `05Tools` | 正文以插件安装、配置和使用为主；文献阅读本身仍放 `03Notes` | `zotero`, `reference-management`, `plugins` |
| `01Code/latex-snippets.md` | `05Tools` | 正文重点是 Obsidian LaTeX Suite 的输入配置，而非程序开发 | `latex`, `obsidian`, `snippets` |
| `01Code/latex-notes.md` | 若继续写语法教程则保留 `01Code`；若主要写环境配置则放 `05Tools` | 目前只有一个参考链接，内容尚不足以确定最终方向 | `latex`, `typesetting` |
| `01Code/mcm-template.md` | `05Tools` | 主要是模板项目的安装、使用与排版指南 | `latex`, `mcm-icm`, `typesetting` |
| `01Code/linux-setup.md` | `05Tools` | 当前正文主要是双系统安装与桌面配置；以后 Linux 编程、系统原理可放 `01Code` | `linux`, `ubuntu`, `installation` |
| `01Code/obsidian-mizuki.md` | `05Tools` 优先；偏重站点代码实现时可保留 `01Code` | 当前覆盖笔记管理、插件和发布流程，主要用途是工作流指南 | `obsidian`, `mizuki`, `blogging`, `workflow` |

不建议仅因为使用软件，就把 `02Engineering/Structure/ansys-notes.md` 移到 `05Tools`。如果以后内容是有限元建模与结果分析，它的主要用途仍然是工程仿真。`drawing-notes.md` 同理，工程识图和制图规则应保留在工程目录。

## 标签最需要修正的笔记

目前标签混用了 `AI` / `人工智能`、`Workflow` / `tools` / `software`，也有残留的 `Template`、`Mizuki`。建议使用小写英文和连字符，使中英文笔记可以使用相同标签；每个词只保留一种写法。以下是候选词表，未实际替换。

| 笔记 | 当前标签 | 建议标签 |
| --- | --- | --- |
| `01Code/github-profile.md` | `Blogging` | `github`, `readme`, `personal-site` |
| `01Code/latex-notes.md` | `LaTeX` | `latex`, `typesetting` |
| `01Code/latex-snippets.md` | `LaTeX`, `Updating` | `latex`, `obsidian`, `snippets` |
| `01Code/linux-setup.md` | `Template`, `Mizuki` | `linux`, `ubuntu`, `installation` |
| `01Code/markdown-basics.md` | `Markdown`, `Mermaid` | `markdown`, `mermaid`, `writing` |
| `01Code/mcm-template.md` | `LaTeX` | `latex`, `mcm-icm`, `typesetting` |
| `01Code/obsidian-mizuki.md` | `Mizuki`, `Workflow`, `Obsidian` | `mizuki`, `obsidian`, `blogging`, `workflow` |
| `05Tools/claude-code-config.md` | `tools` | `claude-code`, `ai`, `configuration` |
| `05Tools/pc-software.md` | `software` | `software`, `windows`, `productivity` |
| `05Tools/piclist-github.md` | `Template`, `Mizuki` | `piclist`, `github`, `image-hosting` |
| `05Tools/rime-input.md` | `Template` | `rime`, `input-method`, `configuration` |
| `05Tools/terminal-config.md` | `Template`, `Mizuki` | `windows`, `terminal`, `configuration` |
| `05Tools/word-layout.md` | `software`, `tools` | `word`, `typesetting`, `writing` |
| `02Engineering/Materials/cement-hydration.md` | `Template` | `cement`, `hydration`, `materials` |
| `02Engineering/Materials/cement-battery.md` | `储能器件`, `水泥基电池` | `cement`, `battery`, `energy-storage` |
| `02Engineering/Materials/supercapacitor-basics.md` | `储能器件`, `超级电容器` | `supercapacitor`, `energy-storage` |
| `02Engineering/Materials/polymer-cement.md` | `聚合物`, `水泥基材料` | `cement`, `polymer`, `materials` |
| `02Engineering/Materials/rcc-air-content.md` | `Concrete` | `concrete`, `air-content`, `testing` |
| `02Engineering/Structure/ansys-notes.md` | `ANSYS`, `Note` | `ansys`, `finite-element`, `simulation` |
| `02Engineering/Structure/drawing-notes.md` | `CAD图纸` | `cad`, `engineering-drawing`, `structural-engineering` |
| `02Engineering/Structure/plasticity-1.md` | `Mechanics`, `Elastoplasticity` | `mechanics`, `elastoplasticity` |
| `02Engineering/Structure/plasticity-2.md` | `Mechanics`, `Elastoplasticity` | `mechanics`, `elastoplasticity`, `tensor` |
| `02Engineering/Structure/plasticity-3.md` | `Elastoplasticity`, `Mechanics` | `mechanics`, `elastoplasticity`, `stress` |
| `02Engineering/Structure/shear-wall-layout.md` | `剪力墙` | `shear-wall`, `structural-design`, `seismic-design` |
| `03Notes/ask-questions.md` | `Reading` | `reading`, `communication`, `problem-solving` |
| `03Notes/citespace-notes.md` | `文献计量`, `CiteSpace` | `citespace`, `bibliometrics`, `research-methods` |
| `03Notes/doc-engineering.md`、`doc-project.md` | `docs`, `文档工程`, `人工智能` | `documentation`, `knowledge-management`, `ai`；实践篇可加 `workflow` |
| `03Notes/harness-engineering.md` | `docs` | `ai`, `agent-engineering`, `documentation` |
| `03Notes/Signs of AI writing.md` | `AI` | `ai`, `writing`, `editing` |
| `03Notes/zotero-plugins.md` | `Zotero` | `zotero`, `reference-management`, `plugins` |
| `04Blog/23-birthday.md` | `Blogging`, `Birthday` | `birthday`, `reflection`, `personal-growth` |
| `04Blog/reflections-on-the-ai-era.md` | `现象思考` | `ai`, `reflection` |
| `04Blog/treasure-in-the-tomb.md` | `随笔故事` | `fiction`, `fable` |
| `04Blog/weisheng-holds-the-bridge-pillar.md` | `随笔故事` | `fiction`, `flash-fiction` |

个人资料中的 `aboutme` 可统一为 `about-me`，但优先级低于上表中的错误标签。目录首页无需为了统一而强行添加标签。

`Updating` 表示维护状态，`Note` 表示文件类型，`Template` 在多篇笔记中只是创建时遗留的标签；这些不宜作为主题标签。真正讨论模板的 `mcm-template.md` 可以使用 `latex`、`mcm-icm`，而不是给所有草稿加 `Template`。只有确实讨论 Mizuki 的文章才需要 `mizuki` 标签。

## 小规模的进一步整理

- `Materials` 目录还包含水泥水化与电化学器件基础，首页名称“复合材料”比实际内容范围窄，建议改为“材料研究（Materials）”。
- `Structure` 的英文展示名建议用 `Structural Engineering`，与结构设计、计算和分析内容一致。
- `03Notes/index.md` 正文仍写“计算机基础知识与代码”，建议改为“科研方法、文献阅读与学习记录”。
- 现阶段每个目录文章数量不多，先明确一级目录用途，再考虑 `Documentation`、`AI`、`Typesetting` 等子目录，避免过早细分。
