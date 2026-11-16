# 研究目录整理记录

2026-11-16：将 `02Engineering` 调整为 `02Research`，网页名称为“研究与文献”。原 Materials 下 5 篇、Structure 下 6 篇文章共 11 篇直接平铺到该目录，文件名不变，删除两个旧子目录首页，保留一个研究导航首页。

- “研究与文献”：围绕具体研究问题的结构、材料、试验及公开文献精读，通过首页分组、原有标签和双链组织。
- “学习笔记”：通用学习方法、阅读摘记、可查阅和复用的知识，目录仍为 `03Notes`。
- “个人随笔”：个人经历、阶段复盘、感受和观点，目录仍为 `04Blog`。

后续按用户要求，将 ZotLit 原始同步目录从 `03Notes/Literature` 移到 `02Research/Literature`，同步修改 ZotLit 的 `note.literature-folder`、Obsidian 工作区、最近文件记录和文献间引用。该目录继续被 Git、构建、内容检查及 YAML 规范化工具忽略；两个旧私有路径的忽略规则保留，防止旧插件配置重新生成文件后误发布。

迁移的两个文献文件逐字对照，仅替换目录前缀。Wang 笔记的 related 中有三个原本就未导入本地的目标（Liu、He、Lyu），已更新路径但保留待导入关联，不创建占位笔记。ZotLit 配置修改后需要重载插件或重启 Obsidian，避免运行中的旧配置继续使用原目录。

附件目录同步从 `Attachments/02Engineering` 改为 `Attachments/02Research`。附件仍按一级分类平铺，不按文章创建子目录；当前该分类没有附件文件。

标签、草稿状态、文章文件名及正文内容保留。移动会影响尚未提交文件的 Git 日期查找，因此给原先未填写 published 的两篇已发布文章（drawing-notes、shear-wall-layout）固定原路径最后一次 Git 日期 `2026-11-08T17:53:09+08:00`，避免 RSS 因搬家将它们当成新文章。

弹塑性力学第二篇的新页面 `/02research/plasticity-2` 继续使用 Twikoo 原标识 `/posts/elastoplastic-mechanics-2`。其他文章以文件名生成的评论标识无需变化。

根目录 `edgeone.json` 为旧目录首页、旧文章路径及附件分类配置 301 跳转，参考 [EdgeOne Pages 官方配置说明](https://edgeone.cloud.tencent.com/pages/document/162936771610066944)。这些规则在 EdgeOne Pages 部署后生效，本地 Quartz 预览不执行平台重定向；正文不新增迁移用 aliases。

构建验证：57 个 HTML 页面、3241 个本地链接无失效引用；搜索、RSS、站点地图没有英文页面或旧正文路径。评论、网站统计和最近笔记检查通过，已发布笔记仍为 18 篇。11 篇文章的标签、草稿状态和评论标识逐篇对照通过。
