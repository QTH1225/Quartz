import fs from "node:fs"
import path from "node:path"
import vm from "node:vm"
import { globby } from "globby"
import { fromHtml } from "hast-util-from-html"
import { readPluginsJson } from "../cli/plugin-data.js"

const root = path.resolve(process.argv[2] ?? "public")
const configuration = readPluginsJson().configuration
const host = new URL(`https://${configuration.baseUrl}`).hostname
const analytics = configuration.analytics
const counterOrigin = `https://${analytics.websiteId}.${analytics.host ?? "goatcounter.com"}`
const pages = await globby("**/*.html", { cwd: root })
const errors = []
let checked = 0
const totals = new Map()
const noteTotals = new Map()
if (analytics.provider !== "goatcounter") errors.push("统计采集应使用 GoatCounter")

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
  if (widget.properties.dataGoatcounterOrigin !== counterOrigin)
    errors.push(`${page}：公开计数账号与采集配置不一致`)
  const english = page.startsWith("en/")
  if (widget.properties.ariaLabel !== (english ? "Site statistics" : "网站统计")) {
    errors.push(`${page}：统计语言不正确`)
  }
  const rows = elements(widget).filter((node) => hasClass(node, "site-stats-word-count"))
  const value =
    rows[0] &&
    elements(rows[0]).find((node) => node.properties.dataPublishedWordCount !== undefined)
  const count = Number(value?.properties.dataPublishedWordCount)
  const language = english ? "en" : "zh"
  const noteRows = elements(widget).filter((node) => hasClass(node, "site-stats-note-count"))
  const noteValue =
    noteRows[0] &&
    elements(noteRows[0]).find((node) => node.properties.dataPublishedNoteCount !== undefined)
  const noteCount = Number(noteValue?.properties.dataPublishedNoteCount)
  if (noteRows.length !== 1 || !Number.isSafeInteger(noteCount) || noteCount <= 0) {
    errors.push(`${page}：已发布笔记数缺失、重复或无效`)
  } else {
    if (noteTotals.has(language) && noteTotals.get(language) !== noteCount)
      errors.push(`${page}：同一语言的笔记总数不一致`)
    noteTotals.set(language, noteCount)
    if (!html.includes(english ? "Published notes" : "已发布笔记"))
      errors.push(`${page}：笔记数标签语言不正确`)
    const descendants = elements(widget)
    if (!(descendants.indexOf(noteRows[0]) < descendants.indexOf(rows[0])))
      errors.push(`${page}：笔记数应位于整行正文量上方`)
  }
  if (rows.length !== 1 || !Number.isSafeInteger(count) || count <= 0) {
    errors.push(`${page}：已发布正文统计缺失、重复或无效`)
  } else {
    if (totals.has(language) && totals.get(language) !== count)
      errors.push(`${page}：同一语言的正文总量不一致`)
    totals.set(language, count)
    if (!html.includes(english ? "Published words" : "已发布字数"))
      errors.push(`${page}：正文统计标签语言不正确`)
  }
  if (/busuanzi/i.test(html)) {
    errors.push(`${page}：不应残留不蒜子计数`)
  }
  for (const scope of ["site", "page"]) {
    const id = `goatcounter_${scope}_count`
    if (nodes.filter((node) => node.properties.id === id).length !== 1) {
      errors.push(`${page}：计数标签 ${id} 缺失或重复`)
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
}

for (const script of await globby("**/postscript*.js", { cwd: root })) {
  const entry = path.join(root, script)
  let source = fs.readFileSync(entry, "utf8")
  // Production emits an orchestrator with dynamic imports; preview is monolithic.
  for (const [, filename] of source.matchAll(/import\(["']([^"']+)["']\)/g)) {
    const chunk = fs.readFileSync(path.resolve(path.dirname(entry), filename), "utf8")
    source += "\n" + chunk
    if (chunk.includes("data-goatcounter-settings")) {
      try {
        // Must safely return on previews, without missing build-time helpers.
        vm.runInNewContext(chunk, { window: { location: { hostname: "localhost" } } })
      } catch (error) {
        errors.push(`${filename}：采集脚本运行失败，会阻断探索栏初始化：${error.message}`)
      }
    }
  }
  if (/busuanzi|plausible\.io/.test(source)) errors.push(`${script}：仍加载旧统计服务`)
  if (!source.includes(`${counterOrigin}/count`))
    errors.push(`${script}：缺少 GoatCounter 采集配置`)
  if ((source.match(/data-goatcounter-settings/g) ?? []).length !== 1)
    errors.push(`${script}：应有且仅有一个手动采集入口`)
}

if (!checked) errors.push("没有找到可验证的统计组件，请先构建网站")
console.log(`网站统计检查：${checked} 个页面，错误 ${errors.length}`)
console.log(`已发布正文：中文 ${totals.get("zh")} 字；英文 ${totals.get("en")} words`)
console.log(`已发布笔记：中文 ${noteTotals.get("zh")} 篇；英文 ${noteTotals.get("en")} 篇`)
for (const error of errors) console.error(error)
if (errors.length) process.exitCode = 1
