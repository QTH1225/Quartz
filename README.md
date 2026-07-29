# Tianhao's Lab

这个数字花园基于 [Quartz v5](https://quartz.jzhao.xyz/) 构建，用于将笔记、随笔和科研资料发布为可访问的网站。

站点当前采用中英文双语内容结构：

- 中文内容位于 `content/`
- 英文内容位于 `content-en/`
- 中文站点输出到 `public/`
- 英文站点输出到 `public/en/`

注意：Quartz 默认命令 `npx quartz build` 只会构建单个内容目录，不会自动构建双语站点。本项目的双语构建入口是 `npm run build:i18n`。

## 主题和样式

- **主题**: 基于 Quartz v5 的现代简约风格
- **颜色方案**: 保留原 Quartz v4 配置中的浅色/深色模式
- **排版**: 保留原 Quartz v4 配置中的中英文阅读体验

## 内容目录

一级目录使用带编号的英文文件夹名，方便控制导航顺序并生成英文 URL：

- `01Code`
- `02Composite`
- `03Construction`
- `04Notes`
- `05Random`

目录和文章的网页显示名称由 Markdown frontmatter 中的 `title` 控制。因此文件夹名可以保持英文，网页上仍然可以显示中文标题。

Quartz 会将 URL slug 规范化为小写。例如 `content/01Code/index.md` 最终对应 `/01code/`。双语跳转链接也应使用小写 URL。

中英文文章通过 frontmatter 的 `translations` 字段建立对应关系：

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

# 启动中文站点开发服务器
npx quartz build --serve

# 只构建中文站点
npx quartz build

# 构建中英文双语站点
npm run build:i18n
```

`npm run build:i18n` 会依次执行：

```bash
node quartz/bootstrap-cli.mjs build -d content -o public
node quartz/bootstrap-cli.mjs build -d content-en -o public/en
```

如果只运行 `npx quartz build`，输出中不会包含 `/en/` 英文站点。

## 部署

部署生产站点时应使用：

```bash
npm run build:i18n
```

部署目录为 `public/`。其中：

- `public/` 根目录是中文站点
- `public/en/` 是英文站点

如果部署平台或 GitHub Actions 中仍然使用：

```bash
npx quartz build
```

则只会发布中文站点，不会发布英文站点。

## 常见提示

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

内容部分采用 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 许可，代码部分遵循 Quartz 的 MIT 许可证。
