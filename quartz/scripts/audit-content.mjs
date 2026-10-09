import fs from "node:fs"
import path from "node:path"
import process from "node:process"
import { parse as parseYaml } from "yaml"

const projectRoot = process.cwd()
const contentRoot = path.join(projectRoot, "content")
const ignoredSegments = new Set([".obsidian", "Template"])
const frontmatterOrder = [
  "title",
  "draft",
  "author",
  "authorLink",
  "description",
  "published",
  "tags",
  "pinned",
  "image",
  "translations",
  "lang",
]
const requiredKeys = ["title", "draft", "author", "authorLink", "lang"]

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (ignoredSegments.has(entry.name)) return []
    const fullPath = path.join(directory, entry.name)
    if (entry.isDirectory()) return walk(fullPath)
    return [fullPath]
  })
}

function relative(filePath) {
  return path.relative(contentRoot, filePath).replaceAll(path.sep, "/")
}

function normalized(filePath) {
  return path.resolve(filePath).replaceAll("\\", "/").toLowerCase()
}

function extractFrontmatter(source) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)
  if (!match) return undefined
  const keys = [...match[1].matchAll(/^([A-Za-z][A-Za-z0-9_-]*):/gm)].map((item) => item[1])
  return { raw: match[1], data: parseYaml(match[1]) ?? {}, keys }
}

const allFiles = walk(contentRoot)
const fileLookup = new Map(allFiles.map((filePath) => [normalized(filePath), filePath]))
const basenameLookup = new Map()
for (const filePath of allFiles) {
  const basename = path.basename(filePath).toLowerCase()
  const matches = basenameLookup.get(basename) ?? []
  matches.push(filePath)
  basenameLookup.set(basename, matches)
}

function existingCandidate(candidate) {
  const variants = [candidate]
  if (!path.extname(candidate)) {
    variants.push(`${candidate}.md`, path.join(candidate, "index.md"))
  }
  for (const variant of variants) {
    const match = fileLookup.get(normalized(variant))
    if (match) return match
  }
  return undefined
}

function cleanTarget(rawTarget) {
  let target = rawTarget.trim()
  if (target.startsWith("<") && target.endsWith(">")) target = target.slice(1, -1)
  target = target.replace(/\s+["'][^"']*["']$/, "")
  try {
    target = decodeURIComponent(target)
  } catch {
    // Keep malformed percent-encoded paths visible to the audit below.
  }
  return target.split(/[?#]/, 1)[0]
}

function resolveLocalTarget(sourceFile, rawTarget, isWikiLink = false) {
  const target = cleanTarget(rawTarget)
  if (
    target === "" ||
    target.startsWith("#") ||
    target.startsWith("//") ||
    /^[A-Za-z][A-Za-z0-9+.-]*:/.test(target)
  ) {
    return { kind: "external" }
  }

  const withoutLeadingSlash = target.replace(/^\/+/, "")
  const rootRelative = withoutLeadingSlash.replace(/^attachments(?=\/|$)/i, "Attachments")
  const candidates = target.startsWith("/")
    ? [path.join(contentRoot, rootRelative)]
    : [path.resolve(path.dirname(sourceFile), target), path.join(contentRoot, rootRelative)]

  for (const candidate of candidates) {
    const resolved = existingCandidate(candidate)
    if (resolved) return { kind: "local", resolved }
  }

  if (isWikiLink && !target.includes("/") && !target.includes("\\")) {
    const possibleNames = [target.toLowerCase()]
    if (!path.extname(target)) possibleNames.push(`${target.toLowerCase()}.md`)
    const matches = possibleNames.flatMap((name) => basenameLookup.get(name) ?? [])
    const uniqueMatches = [...new Set(matches)]
    if (uniqueMatches.length === 1) return { kind: "local", resolved: uniqueMatches[0] }
    if (uniqueMatches.length > 1) return { kind: "ambiguous", matches: uniqueMatches }
  }

  return { kind: "missing", target }
}

function proseWithoutCode(source) {
  const proseLines = []
  let fenceCharacter
  for (const line of source.split(/\r?\n/)) {
    const fence = line.match(/^\s*(`{3,}|~{3,})/)
    if (fence) {
      const currentCharacter = fence[1][0]
      if (fenceCharacter === undefined) {
        fenceCharacter = currentCharacter
      } else if (fenceCharacter === currentCharacter) {
        fenceCharacter = undefined
      }
      continue
    }
    if (fenceCharacter === undefined) proseLines.push(line)
  }
  return proseLines.join("\n").replace(/`+[^`\n]*`+/g, "")
}

function extractLinks(source) {
  source = proseWithoutCode(source)

  const links = []
  for (const match of source.matchAll(/!?\[\[([^\]|#]+)(?:[|#][^\]]*)?\]\]/g)) {
    links.push({ target: match[1], syntax: "wikilink" })
  }
  for (const match of source.matchAll(/!?\[[^\]]*\]\(([^)]+)\)/g)) {
    links.push({ target: match[1], syntax: "markdown" })
  }
  for (const match of source.matchAll(/(?:src|href)=["']([^"']+)["']/g)) {
    links.push({ target: match[1], syntax: "html" })
  }
  return links
}

const errors = []
const warnings = []
const markdownFiles = allFiles.filter(
  (filePath) =>
    filePath.toLowerCase().endsWith(".md") &&
    !normalized(filePath).includes("/attachments/") &&
    !relative(filePath).startsWith("03Notes/文献精读/"),
)

for (const filePath of markdownFiles) {
  const source = fs.readFileSync(filePath, "utf8")
  const file = relative(filePath)
  let frontmatter
  try {
    frontmatter = extractFrontmatter(source)
  } catch (error) {
    errors.push(`${file}: YAML 解析失败：${error.message}`)
  }

  if (!frontmatter) {
    errors.push(`${file}: 缺少 YAML frontmatter`)
  } else {
    for (const key of requiredKeys) {
      if (frontmatter.data[key] === undefined || frontmatter.data[key] === null) {
        errors.push(`${file}: YAML 缺少必填字段 ${key}`)
      }
    }
    if (frontmatter.data.draft !== undefined && typeof frontmatter.data.draft !== "boolean") {
      errors.push(`${file}: draft 必须是布尔值`)
    }
    if (frontmatter.data.lang !== undefined && frontmatter.data.lang !== "zh-CN") {
      errors.push(`${file}: lang 应为 zh-CN`)
    }
    if (frontmatter.data.tags !== undefined && !Array.isArray(frontmatter.data.tags)) {
      errors.push(`${file}: tags 必须是数组`)
    }
    if (
      typeof frontmatter.data.description === "string" &&
      /^(?:your description|todo|tbd|请填写)/i.test(frontmatter.data.description.trim())
    ) {
      warnings.push(`${file}: description 仍是占位文本`)
    }

    const orderIndex = new Map(frontmatterOrder.map((key, index) => [key, index]))
    const sortedKeys = [...frontmatter.keys].sort((left, right) => {
      const leftIndex = orderIndex.get(left) ?? frontmatterOrder.length
      const rightIndex = orderIndex.get(right) ?? frontmatterOrder.length
      return leftIndex - rightIndex
    })
    if (frontmatter.keys.join("\0") !== sortedKeys.join("\0")) {
      warnings.push(`${file}: YAML 字段顺序不统一（${frontmatter.keys.join(", ")}）`)
    }
  }

  const emptyListItems = proseWithoutCode(source)
    .split("\n")
    .map((line, index) => ({ line, number: index + 1 }))
    .filter(({ line }) => /^\s*(?:[-*+]|\d+\.)\s*$/.test(line))
  for (const item of emptyListItems) {
    errors.push(`${file}:${item.number}: 存在空列表项`)
  }

  for (const link of extractLinks(source)) {
    const result = resolveLocalTarget(filePath, link.target, link.syntax === "wikilink")
    if (result.kind === "missing") {
      errors.push(`${file}: 找不到本地引用 ${link.target}`)
    } else if (result.kind === "ambiguous") {
      warnings.push(
        `${file}: 引用 ${link.target} 存在多个同名目标：${result.matches.map(relative).join(", ")}`,
      )
    }
  }
}

const referencedAttachments = new Set()
for (const filePath of markdownFiles) {
  const source = fs.readFileSync(filePath, "utf8")
  for (const link of extractLinks(source)) {
    const result = resolveLocalTarget(filePath, link.target, link.syntax === "wikilink")
    if (result.kind === "local" && normalized(result.resolved).includes("/attachments/")) {
      referencedAttachments.add(normalized(result.resolved))
    }
  }
}

for (const attachment of allFiles.filter((filePath) =>
  normalized(filePath).includes("/attachments/"),
)) {
  if (!referencedAttachments.has(normalized(attachment))) {
    warnings.push(`${relative(attachment)}: 附件未被任何中文 Markdown 引用`)
  }
}

console.log(`已检查 ${markdownFiles.length} 个中文 Markdown 文件。`)
console.log(`错误：${errors.length}；警告：${warnings.length}`)
if (errors.length > 0) {
  console.log("\n错误：")
  for (const error of errors) console.log(`- ${error}`)
}
if (warnings.length > 0) {
  console.log("\n警告：")
  for (const warning of warnings) console.log(`- ${warning}`)
}

if (errors.length > 0) process.exitCode = 1
