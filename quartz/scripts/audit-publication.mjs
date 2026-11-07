import fs from "node:fs"
import path from "node:path"
import { pathToFileURL } from "node:url"
import { fromHtml } from "hast-util-from-html"
import publication from "../publication.json" with { type: "json" }
import { readPluginsJson } from "../cli/plugin-data.js"

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(directory, entry.name)
    return entry.isDirectory() ? walk(file) : [file]
  })
}

function elements(node) {
  return [node, ...(node.children ?? []).flatMap(elements)].filter((n) => n.type === "element")
}

export function auditPublication(
  outputRoot,
  { englishEnabled = publication.englishEnabled, baseUrl = "tianhao.blog" } = {},
) {
  const errors = []
  const root = path.resolve(outputRoot)
  const base = new URL(`https://${baseUrl.replace(/\/+$/, "")}/`)
  const englishPath = `${base.pathname}en`
  const isEnglishUrl = (value) => {
    try {
      const url = new URL(value, base)
      const pathname = decodeURIComponent(url.pathname).toLowerCase()
      return (
        url.hostname === base.hostname &&
        (pathname === englishPath ||
          pathname === `${englishPath}.html` ||
          pathname.startsWith(`${englishPath}/`))
      )
    } catch {
      return false
    }
  }
  const read = (relative) => {
    const file = path.join(root, relative)
    if (!fs.existsSync(file)) {
      errors.push(`缺少构建文件：${relative}`)
      return undefined
    }
    return fs.readFileSync(file, "utf8")
  }
  if (!fs.existsSync(root))
    return { errors: ["没有找到构建目录，请先构建网站"], pages: 0, entries: 0 }

  // This audit is intentionally strict while English is paused. English source
  // files and translations metadata are not publication artifacts and stay intact.
  if (englishEnabled) return { errors, pages: 0, entries: 0 }
  if (fs.existsSync(path.join(root, "en")) || fs.existsSync(path.join(root, "en.html"))) {
    errors.push("仍残留英文构建产物：en/ 或 en.html")
  }

  const pages = walk(root).filter((file) => file.endsWith(".html"))
  if (!pages.length) errors.push("没有找到已发布的 HTML 页面")
  for (const file of pages) {
    const relative = path.relative(root, file)
    const nodes = elements(fromHtml(fs.readFileSync(file, "utf8")))
    if (nodes.some((node) => node.tagName === "html" && /^en(?:-|$)/i.test(node.properties.lang))) {
      errors.push(`${relative}：不应发布英文页面`)
    }
    if (nodes.some((node) => node.properties.className?.includes("language-switch"))) {
      errors.push(`${relative}：仍显示语言切换按钮`)
    }
    if (nodes.some((node) => node.properties.href && isEnglishUrl(node.properties.href))) {
      errors.push(`${relative}：仍包含本站英文页面入口`)
    }
  }

  let entries = 0
  const rawIndex = read("static/contentIndex.json")
  if (rawIndex !== undefined) {
    try {
      const index = JSON.parse(rawIndex)
      entries = Object.keys(index).length
      if (!entries) errors.push("搜索索引为空")
      for (const [slug, entry] of Object.entries(index)) {
        const routes = [slug, entry.slug, ...(entry.links ?? [])].filter(Boolean)
        if (
          routes.some((route) => isEnglishUrl(route)) ||
          /^content-en[\\/]/i.test(entry.filePath ?? "") ||
          /^en(?:-|$)/i.test(entry.lang ?? "")
        ) {
          errors.push(`搜索索引包含英文页面或链接：${slug}`)
        }
      }
    } catch (error) {
      errors.push(`搜索索引无法解析：${error.message}`)
    }
  }

  for (const relative of ["index.xml", "sitemap.xml"]) {
    const xml = read(relative)
    if (xml === undefined) continue
    const urls = [
      ...[...xml.matchAll(/<(?:loc|link|guid)>([^<]+)<\/(?:loc|link|guid)>/g)].map((m) => m[1]),
      ...[...xml.matchAll(/href="([^"]+)"/g)].map((m) => m[1]),
    ]
    if (!urls.length) errors.push(`${relative}：未找到页面地址`)
    if (urls.some(isEnglishUrl)) errors.push(`${relative}：包含本站英文页面地址`)
  }
  return { errors, pages: pages.length, entries }
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const result = auditPublication(process.argv[2] ?? "public", {
    baseUrl: process.env.QUARTZ_BASE_URL ?? readPluginsJson()?.configuration?.baseUrl,
  })
  console.log(
    `发布范围检查（英文${publication.englishEnabled ? "启用" : "暂停"}）：${result.pages} 个页面、${result.entries} 条搜索索引；错误 ${result.errors.length}`,
  )
  for (const error of result.errors) console.error(`- ${error}`)
  if (result.errors.length) process.exitCode = 1
}
