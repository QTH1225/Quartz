import fs from "node:fs"
import path from "node:path"
import { globby } from "globby"
import { fromHtml } from "hast-util-from-html"
import { readPluginsJson } from "../cli/plugin-data.js"

const root = path.resolve(process.argv[2] ?? "public")
const host = new URL(`https://${readPluginsJson().configuration.baseUrl}`).hostname
const pages = await globby("**/*.html", { cwd: root })
const errors = []
let checked = 0

function elements(node) {
  return [node, ...(node.children ?? []).flatMap(elements)].filter((n) => n.type === "element")
}
function hasClass(node, value) {
  return node.properties?.className?.includes(value)
}

for (const page of pages) {
  const html = fs.readFileSync(path.join(root, page), "utf8")
  const nodes = elements(fromHtml(html))
  const widgets = nodes.filter((node) => hasClass(node, "site-stats"))
  if (page.endsWith("404.html")) {
    if (widgets.length) errors.push(`${page}：404 页面不应有侧栏统计`)
    continue
  }
  if (widgets.length !== 1) {
    errors.push(`${page}：应有且仅有一个统计组件，实际 ${widgets.length}`)
    continue
  }
  checked++
  const widget = widgets[0]
  if (widget.properties.dataSiteStatsHost !== host) errors.push(`${page}：统计主机名不正确`)
  const english = page.startsWith("en/")
  if (widget.properties.ariaLabel !== (english ? "Site statistics" : "网站统计")) {
    errors.push(`${page}：统计语言不正确`)
  }
  if (nodes.some((node) => /^busuanzi_today_/.test(node.properties.id ?? ""))) {
    errors.push(`${page}：不应显示今日访问或今日访客`)
  }
  for (const scope of ["site", "page"]) {
    for (const kind of ["pv", "uv"]) {
      const id = `busuanzi_${scope}_${kind}`
      if (nodes.filter((node) => node.properties.id === id).length !== 1) {
        errors.push(`${page}：官方计数标签 ${id} 缺失或重复`)
      }
    }
  }
  const left = nodes.find((node) => hasClass(node, "sidebar") && hasClass(node, "left"))
  const sidebar = left ? elements(left) : []
  const search = sidebar.findIndex((node) => hasClass(node, "search"))
  const stats = sidebar.indexOf(widget)
  const explorer = sidebar.findIndex((node) => hasClass(node, "explorer"))
  if (!(search >= 0 && search < stats && stats < explorer)) {
    errors.push(`${page}：统计组件未放在左侧搜索与探索之间`)
  }
  if (nodes.some((node) => node.tagName === "script" && /busuanzi/.test(node.properties.src))) {
    errors.push(`${page}：额外的官方脚本会重复计数`)
  }
}

if (!checked) errors.push("没有找到可验证的统计组件，请先构建网站")
console.log(`网站统计检查：${checked} 个页面，错误 ${errors.length}`)
for (const error of errors) console.error(error)
if (errors.length) process.exitCode = 1
