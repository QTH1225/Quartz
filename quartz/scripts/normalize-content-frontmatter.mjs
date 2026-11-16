import fs from "node:fs"
import path from "node:path"
import process from "node:process"
import { parse as parseYaml, stringify as stringifyYaml } from "yaml"

const contentRoot = path.join(process.cwd(), "content")
const ignoredSegments = new Set([".obsidian", "Template", "Templates", "templates"])
const preferredOrder = [
  "title",
  "draft",
  "author",
  "authorLink",
  "description",
  "published",
  "tags",
  "aliases",
  "pinned",
  "image",
]

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (ignoredSegments.has(entry.name)) return []
    const fullPath = path.join(directory, entry.name)
    const relativePath = path.relative(contentRoot, fullPath).replaceAll("\\", "/")
    if (
      ["02Research/Literature", "03Notes/Literature", "03Notes/文献精读", "private"].includes(
        relativePath,
      )
    )
      return []
    if (entry.isDirectory()) return walk(fullPath)
    return [fullPath]
  })
}

const markdownFiles = walk(contentRoot).filter(
  (filePath) =>
    filePath.toLowerCase().endsWith(".md") &&
    !filePath.replaceAll("\\", "/").includes("/Attachments/") &&
    !path.relative(contentRoot, filePath).replaceAll("\\", "/").startsWith("03Notes/文献精读/"),
)

let changed = 0
for (const filePath of markdownFiles) {
  const source = fs.readFileSync(filePath, "utf8")
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---((?:\r?\n|$)[\s\S]*)$/)
  if (!match) throw new Error(`${path.relative(contentRoot, filePath)} 缺少 YAML frontmatter`)

  const data = parseYaml(match[1]) ?? {}
  data.draft ??= false
  data.author ??= "Qin Tianhao"
  data.authorLink ??= "https://github.com/QTH1225"
  delete data.translations
  delete data.lang

  const ordered = {}
  for (const key of preferredOrder) {
    if (data[key] !== undefined) ordered[key] = data[key]
  }
  for (const [key, value] of Object.entries(data)) {
    if (!(key in ordered)) ordered[key] = value
  }

  const yaml = stringifyYaml(ordered, { lineWidth: 0 }).trimEnd()
  const normalized = `---\n${yaml}\n---${match[2]}`
  if (normalized !== source) {
    fs.writeFileSync(filePath, normalized, "utf8")
    changed += 1
  }
}

console.log(`已规范化 ${changed}/${markdownFiles.length} 个中文 Markdown YAML 头。`)
