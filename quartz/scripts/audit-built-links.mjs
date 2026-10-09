import fs from "node:fs"
import path from "node:path"
import process from "node:process"

const outputRoot = path.resolve(process.argv[2] ?? "public")
const ignoredPrefixes = process.argv
  .slice(3)
  .filter((argument) => argument.startsWith("--ignore-prefix="))
  .map((argument) => argument.slice("--ignore-prefix=".length))

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name)
    if (entry.isDirectory()) return walk(fullPath)
    return [fullPath]
  })
}

function normalizeUrlPath(value) {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

function resolveTarget(htmlFile, rawTarget) {
  let target = rawTarget.trim()
  if (
    target === "" ||
    target.startsWith("#") ||
    target.startsWith("//") ||
    /^[A-Za-z][A-Za-z0-9+.-]*:/.test(target)
  ) {
    return undefined
  }

  target = normalizeUrlPath(target.split(/[?#]/, 1)[0])
  const candidate = target.startsWith("/")
    ? path.join(outputRoot, target.replace(/^\/+/, ""))
    : path.resolve(path.dirname(htmlFile), target)
  const variants = [candidate]
  if (target.endsWith("/")) {
    variants.push(path.join(candidate, "index.html"))
  } else if (!path.extname(candidate)) {
    variants.push(`${candidate}.html`, path.join(candidate, "index.html"))
  }
  return variants.find((variant) => fs.existsSync(variant))
}

if (!fs.existsSync(outputRoot)) {
  console.error(`构建目录不存在：${outputRoot}`)
  process.exit(1)
}

const htmlFiles = walk(outputRoot).filter((filePath) => filePath.toLowerCase().endsWith(".html"))
const missing = []
let checked = 0

for (const htmlFile of htmlFiles) {
  const html = fs.readFileSync(htmlFile, "utf8")
  for (const match of html.matchAll(/(?:href|src)=["']([^"']+)["']/g)) {
    const target = match[1]
    if (ignoredPrefixes.some((prefix) => target.startsWith(prefix))) continue
    if (
      target === "" ||
      target.startsWith("#") ||
      target.startsWith("//") ||
      /^[A-Za-z][A-Za-z0-9+.-]*:/.test(target)
    ) {
      continue
    }
    checked += 1
    if (!resolveTarget(htmlFile, target)) {
      missing.push(`${path.relative(outputRoot, htmlFile).replaceAll("\\", "/")}: 找不到 ${target}`)
    }
  }
}

console.log(`已检查 ${htmlFiles.length} 个 HTML 文件中的 ${checked} 个本地 href/src。`)
console.log(`失效引用：${missing.length}`)
for (const item of missing) console.log(`- ${item}`)
if (missing.length > 0) process.exitCode = 1
