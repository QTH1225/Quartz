import fs from "node:fs"
import path from "node:path"
import process from "node:process"
import { parse as parseYaml } from "yaml"

const root = process.cwd()
const contentRoot = path.join(root, "content")
const publicRoot = path.join(root, "public")
const ignored = new Set([".obsidian", "Attachments", "Template"])

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (ignored.has(entry.name)) return []
    const fullPath = path.join(directory, entry.name)
    if (entry.isDirectory()) return walk(fullPath)
    if (!entry.name.toLowerCase().endsWith(".md")) return []
    const relative = path.relative(contentRoot, fullPath).replaceAll("\\", "/")
    if (relative.startsWith("03Notes/文献精读/")) return []
    return [{ fullPath, relative }]
  })
}

function metadata(filePath) {
  const source = fs.readFileSync(filePath, "utf8")
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)
  if (!match) throw new Error(`${filePath} 缺少 YAML frontmatter`)
  return parseYaml(match[1]) ?? {}
}

function route(relative, english = false) {
  const parts = relative
    .replace(/\.md$/i, "")
    .split("/")
    .map((part) => part.replace(/\s+/g, "-").toLowerCase())
  const isIndex = parts.at(-1) === "index"
  if (isIndex) parts.pop()
  const slug = parts.join("/")
  const prefix = english ? "/en/" : "/"
  return `${prefix}${slug}${isIndex && slug ? "/" : ""}`
}

function htmlPath(relative, english = false) {
  const withoutExtension = relative.replace(/\.md$/i, "")
  const segments = withoutExtension.split("/").map((part) => part.replace(/\s+/g, "-").toLowerCase())
  const isIndex = segments.at(-1) === "index"
  const htmlRelative = isIndex
    ? path.join(...segments.slice(0, -1), "index.html")
    : path.join(...segments.slice(0, -1), `${segments.at(-1)}.html`)
  return path.join(publicRoot, english ? "en" : "", htmlRelative)
}

const errors = []
let checked = 0
for (const { fullPath, relative } of walk(contentRoot)) {
  if (metadata(fullPath).draft === true) continue
  const zhHtmlPath = htmlPath(relative, false)
  const enHtmlPath = htmlPath(relative, true)
  const expectedEn = route(relative, true)
  const expectedZh = route(relative, false)
  if (!fs.existsSync(zhHtmlPath)) {
    errors.push(`${relative}：缺少中文构建页面`)
    continue
  }
  if (!fs.existsSync(enHtmlPath)) {
    errors.push(`${relative}：缺少英文构建页面`)
    continue
  }
  const zhHtml = fs.readFileSync(zhHtmlPath, "utf8")
  const enHtml = fs.readFileSync(enHtmlPath, "utf8")
  if (!zhHtml.includes(`class="language-switch" href="${expectedEn}"`)) {
    errors.push(`${relative}：中文页面没有指向 ${expectedEn} 的语言切换链接`)
  }
  if (!enHtml.includes(`class="language-switch" href="${expectedZh}"`)) {
    errors.push(`${relative}：英文页面没有指向 ${expectedZh} 的语言切换链接`)
  }
  checked += 1
}

console.log(`已检查 ${checked} 对已发布页面的双向语言切换；错误：${errors.length}`)
for (const error of errors) console.error(`- ${error}`)
if (errors.length > 0) process.exitCode = 1
