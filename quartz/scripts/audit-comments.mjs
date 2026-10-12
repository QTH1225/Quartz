import fs from "node:fs"
import path from "node:path"
import { globby } from "globby"
import { parse } from "yaml"
import { fromHtml } from "hast-util-from-html"
import { slugifyFilePath } from "@quartz-community/utils"
import { readPluginsJson } from "../cli/plugin-data.js"
import {
  canonicalPath,
  commentPath,
  isCommentable,
  legacyPaths,
} from "../plugins/twikoo-comments/dist/components/paths.js"

const config = readPluginsJson()
const options = config.plugins.find(
  (p) => p.source === "./quartz/plugins/twikoo-comments" && p.enabled,
)?.options
if (!options?.envId) throw new Error("Twikoo is not enabled")
const root = path.resolve(process.argv[2] ?? "public")
const expected = new Map()
const identifiers = new Map()
const errors = []
let widgetsChecked = 0

for (const [directory, prefix] of [
  ["content", ""],
  ["content-en", "en/"],
]) {
  for (const relativePath of await globby("**/*.md", {
    cwd: directory,
    ignore: config.configuration.ignorePatterns,
    gitignore: true,
  })) {
    const raw = fs.readFileSync(path.join(directory, relativePath), "utf8")
    const frontmatter = parse(raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? "") ?? {}
    if (frontmatter.draft) continue
    const data = { relativePath, frontmatter, slug: slugifyFilePath(relativePath) }
    const visible = isCommentable(data)
    const key = prefix + data.slug + ".html"
    expected.set(key, visible ? { path: commentPath(data), lang: prefix ? "en" : "zh-CN" } : null)
    if (visible) {
      const canonical = canonicalPath(data)
      const previous = identifiers.get(commentPath(data))
      if (previous && previous !== canonical)
        errors.push(`${relativePath}：不同文章使用相同评论标识 ${commentPath(data)}`)
      identifiers.set(commentPath(data), canonical)
      if (!fs.existsSync(path.join(root, key))) errors.push(`${key}：正式文章没有生成页面`)
    }
  }
}

function nodes(tree) {
  return [tree, ...(tree.children ?? []).flatMap(nodes)].filter((n) => n.type === "element")
}
for (const file of await globby("**/*.html", { cwd: root })) {
  const elements = nodes(fromHtml(fs.readFileSync(path.join(root, file), "utf8")))
  const widgets = elements.filter((e) => e.properties.className?.includes("twikoo-comments"))
  const entry = expected.get(file)
  if (widgets.length !== (entry ? 1 : 0)) {
    errors.push(`${file}：评论组件缺失、重复，或出现在不应显示的页面`)
    continue
  }
  if (!entry) continue
  widgetsChecked++
  const widget = widgets[0]
  if (widget.properties.dataCommentPath !== entry.path) errors.push(`${file}：评论关联路径不正确`)
  if (widget.properties.dataLang !== entry.lang) errors.push(`${file}：评论界面语言不正确`)
  const emptyText = entry.lang === "en" ? "No comments yet" : "暂无评论"
  if (widget.properties.dataEmptyText !== emptyText)
    errors.push(`${file}：缺少正确语言的零评论提示`)
  if (widget.properties.dataEnvId !== options.envId) errors.push(`${file}：未使用旧 Twikoo 后台`)
  if (widget.properties.dataPreviewReadonly !== "true")
    errors.push(`${file}：本地预览应默认隐藏留言输入框`)
  const asset = widget.properties.dataClientSrc
  if (!fs.existsSync(path.join(root, asset.replace(/^\//, ""))))
    errors.push(`${file}：Twikoo 客户端资源缺失`)
  if (elements.some((e) => e.properties.className?.includes("giscus")))
    errors.push(`${file}：不应同时加载 Giscus`)
}
for (const [route, legacy] of Object.entries(legacyPaths)) {
  if (identifiers.get(legacy) !== route) errors.push(`旧评论未关联到正式文章：${legacy}`)
}
if (!widgetsChecked) errors.push("没有找到评论组件，请先构建网站")
console.log(
  `评论检查：${widgetsChecked} 个中英文页面，${Object.keys(legacyPaths).length} 组旧评论映射，错误 ${errors.length}`,
)
for (const error of errors) console.error(error)
if (errors.length) process.exitCode = 1
