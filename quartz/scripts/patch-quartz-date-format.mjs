import { existsSync, readFileSync, writeFileSync } from "node:fs"
import path from "node:path"
import process from "node:process"

const root = process.cwd()

const zhDateFormatter =
  '${date.getFullYear()}年${String(date.getMonth() + 1).padStart(2, "0")}月${String(date.getDate()).padStart(2, "0")}日'
const zhDateFormatterD2 =
  '${d2.getFullYear()}年${String(d2.getMonth() + 1).padStart(2, "0")}月${String(d2.getDate()).padStart(2, "0")}日'
const zhDateFormatterD =
  '${d.getFullYear()}年${String(d.getMonth() + 1).padStart(2, "0")}月${String(d.getDate()).padStart(2, "0")}日'

const folderDateOld = `function DateDisplay({ date, locale }) {
  return /* @__PURE__ */ u2("time", { dateTime: date.toISOString(), children: date.toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "2-digit"
  }) });
}`

const folderDateNew = `function DateDisplay({ date, locale }) {
  const formattedDate = locale?.startsWith("zh") ? \`${zhDateFormatter}\` : date.toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "2-digit"
  });
  return /* @__PURE__ */ u2("time", { dateTime: date.toISOString(), children: formattedDate });
}`

const contentMetaOld = `function formatDate(d2, locale = "en-US") {
  return d2.toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "2-digit"
  });
}`

const contentMetaNew = `function formatDate(d2, locale = "en-US") {
  if (locale?.startsWith("zh")) {
    return \`${zhDateFormatterD2}\`;
  }
  return d2.toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "2-digit"
  });
}`

const utilsDateOld = `function formatDate(d, locale = "en-US") {
  return d.toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "2-digit"
  });
}`

const utilsDateNew = `function formatDate(d, locale = "en-US") {
  if (locale?.startsWith("zh")) {
    return \`${zhDateFormatterD}\`;
  }
  return d.toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "2-digit"
  });
}`

const patches = [
  {
    file: "node_modules/@quartz-community/folder-page/dist/index.js",
    oldText: folderDateOld,
    newText: folderDateNew,
  },
  {
    file: "node_modules/@quartz-community/folder-page/dist/components/index.js",
    oldText: folderDateOld,
    newText: folderDateNew,
  },
  {
    file: "node_modules/@quartz-community/content-meta/dist/index.js",
    oldText: contentMetaOld,
    newText: contentMetaNew,
  },
  {
    file: "node_modules/@quartz-community/content-meta/dist/components/index.js",
    oldText: contentMetaOld,
    newText: contentMetaNew,
  },
  {
    file: "node_modules/@quartz-community/utils/dist/date.js",
    oldText: utilsDateOld,
    newText: utilsDateNew,
  },
]

for (const patch of patches) {
  const filePath = path.join(root, patch.file)
  if (!existsSync(filePath)) continue

  const source = readFileSync(filePath, "utf8")
  if (source.includes(patch.newText)) continue

  if (!source.includes(patch.oldText)) {
    console.warn(`[date-format] skipped ${patch.file}: expected source not found`)
    continue
  }

  writeFileSync(filePath, source.replace(patch.oldText, patch.newText))
  console.log(`[date-format] patched ${patch.file}`)
}
