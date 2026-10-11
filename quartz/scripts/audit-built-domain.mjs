import fs from "node:fs"
import path from "node:path"
import { readPluginsJson } from "../cli/plugin-data.js"

const outputRoot = path.resolve(process.argv[2] ?? "public")
const baseUrl = process.env.QUARTZ_BASE_URL ?? readPluginsJson()?.configuration?.baseUrl
if (!baseUrl) throw new Error("未配置 configuration.baseUrl")
const base = new URL(`https://${String(baseUrl).replace(/\/+$/, "")}/`)
const enBase = new URL(base.href.endsWith("/en/") ? base.href : `${base.href}en/`)
const errors = []
let checked = 0

function checkUrl(value, expectedBase, file) {
  checked += 1
  try {
    const url = new URL(value)
    const basePath = expectedBase.pathname.replace(/\/$/, "")
    if (
      url.origin !== expectedBase.origin ||
      (url.pathname !== basePath && !url.pathname.startsWith(`${basePath}/`)) ||
      (expectedBase === base && url.pathname.startsWith(`${enBase.pathname}`))
    ) {
      errors.push(`${file}：地址不属于预期站点 ${expectedBase.href}：${value}`)
    }
  } catch {
    errors.push(`${file}：无效地址 ${value}`)
  }
}

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(directory, entry.name)
    return entry.isDirectory() ? walk(full) : [full]
  })
}

for (const [prefix, expectedBase] of [
  ["", base],
  ["en", enBase],
]) {
  const cname = path.join(outputRoot, prefix, "CNAME")
  if (fs.readFileSync(cname, "utf8").trim() !== base.hostname) {
    errors.push(`${cname}：CNAME 应为 ${base.hostname}`)
  }
  for (const [name, pattern] of [
    ["sitemap.xml", /<loc>([^<]+)<\/loc>/g],
    ["index.xml", /<(?:link|guid)>([^<]+)<\/(?:link|guid)>/g],
  ]) {
    const file = path.join(outputRoot, prefix, name)
    const values = [...fs.readFileSync(file, "utf8").matchAll(pattern)]
    if (!values.length) errors.push(`${file}：未找到站点地址`)
    for (const match of values) checkUrl(match[1], expectedBase, file)
  }
}

const pages = walk(outputRoot).filter((file) => file.endsWith(".html"))
for (const file of pages) {
  const relative = path.relative(outputRoot, file)
  const expectedBase = relative.startsWith(`en${path.sep}`) ? enBase : base
  const html = fs.readFileSync(file, "utf8")
  const meta = [
    ...html.matchAll(
      /<meta (?:property|name)="(og:url|twitter:url|twitter:domain)" content="([^"]+)"/g,
    ),
  ]
  if (meta.length !== 3) errors.push(`${relative}：缺少分享地址元数据`)
  for (const [, property, value] of meta) {
    if (property === "twitter:domain") {
      if (value !== base.hostname) errors.push(`${relative}：分享域名应为 ${base.hostname}`)
    } else {
      checkUrl(value, expectedBase, relative)
    }
  }
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)
  if (canonical) checkUrl(canonical[1], expectedBase, relative)
  else if (path.basename(file) !== "404.html") errors.push(`${relative}：缺少 canonical`)
}

console.log(
  `已检查 ${pages.length} 个页面、${checked} 个绝对地址及中英文 CNAME；生产域名：${base.hostname}`,
)
console.log(`域名错误：${errors.length}`)
for (const error of errors) console.error(`- ${error}`)
if (errors.length) process.exitCode = 1
