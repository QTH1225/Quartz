import fs from "node:fs"
import path from "node:path"
import process from "node:process"
import { parse as parseYaml } from "yaml"

const root = process.cwd()
const zhRoot = path.join(root, "content")
const enRoot = path.join(root, "content-en")
const ignoredSegments = new Set([".obsidian", "Attachments", "Template"])

function walk(directory, base) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (ignoredSegments.has(entry.name)) return []
    const fullPath = path.join(directory, entry.name)
    if (entry.isDirectory()) return walk(fullPath, base)
    if (!entry.name.toLowerCase().endsWith(".md")) return []
    const relative = path.relative(base, fullPath).replaceAll("\\", "/")
    if (relative.startsWith("03Notes/文献精读/")) return []
    return [relative]
  })
}

function frontmatter(rootPath, relative) {
  const source = fs.readFileSync(path.join(rootPath, relative), "utf8")
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)
  if (!match) throw new Error(`${relative} 缺少 YAML frontmatter`)
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

const zhFiles = walk(zhRoot, zhRoot).sort()
const enFiles = walk(enRoot, enRoot).sort()
const zhSet = new Set(zhFiles)
const enSet = new Set(enFiles)
const errors = []

for (const relative of zhFiles) {
  if (!enSet.has(relative)) errors.push(`缺少英文对应文件：${relative}`)
}
for (const relative of enFiles) {
  if (!zhSet.has(relative)) errors.push(`英文文件没有中文对应项：${relative}`)
}

for (const relative of zhFiles.filter((item) => enSet.has(item))) {
  const zh = frontmatter(zhRoot, relative)
  const en = frontmatter(enRoot, relative)
  const expectedEn = route(relative, true)
  const expectedZh = route(relative, false)
  if (zh.lang !== "zh-CN") errors.push(`${relative}：中文 lang 应为 zh-CN`)
  if (en.lang !== "en-US") errors.push(`${relative}：英文 lang 应为 en-US`)
  if (!zh.title) errors.push(`${relative}：中文缺少 title`)
  if (!en.title) errors.push(`${relative}：英文缺少 title`)
  if (zh.draft !== en.draft) errors.push(`${relative}：中英文 draft 状态不一致`)
  if (zh.translations?.en !== expectedEn) {
    errors.push(`${relative}：中文 translations.en 应为 ${expectedEn}`)
  }
  if (en.translations?.zh !== expectedZh) {
    errors.push(`${relative}：英文 translations.zh 应为 ${expectedZh}`)
  }
}

console.log(`中文笔记：${zhFiles.length}；英文笔记：${enFiles.length}；错误：${errors.length}`)
for (const error of errors) console.error(`- ${error}`)
if (errors.length > 0) process.exitCode = 1
