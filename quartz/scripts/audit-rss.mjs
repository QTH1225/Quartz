import fs from "node:fs"
import path from "node:path"
import { execFileSync } from "node:child_process"
import { globby } from "globby"
import { parse } from "yaml"
import { slugifyFilePath, simplifySlug } from "@quartz-community/utils"
import { readPluginsJson } from "../cli/plugin-data.js"
import { feedUrls, selectEntries } from "../plugins/rss-feed/dist/index.js"

const config = readPluginsJson()
const options =
  config.plugins.find((p) => p.source === "./quartz/plugins/rss-feed" && p.enabled)?.options ?? {}
const baseUrl = (process.env.QUARTZ_BASE_URL ?? config.configuration.baseUrl).replace(/\/+$/, "")
const errors = []
let itemsChecked = 0
let pagesChecked = 0

function element(xml, name) {
  const value = xml.match(new RegExp(`<${name}>([\\s\\S]*?)</${name}>`))?.[1]
  return value?.replace(
    /&(amp|lt|gt|quot|apos);/g,
    (_, entity) =>
      ({
        amp: "&",
        lt: "<",
        gt: ">",
        quot: '"',
        apos: "'",
      })[entity],
  )
}

function fallbackDate(file) {
  // Match PublishedDate's existing Git/modified-date fallback for undated notes.
  const gitDate = execFileSync("git", ["log", "-1", "--format=%cI", "--", file], {
    encoding: "utf8",
  }).trim()
  return gitDate ? new Date(gitDate) : fs.statSync(file).mtime
}

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(directory, entry.name)
    return entry.isDirectory() ? walk(file) : [file]
  })
}

for (const [directory, output, base, locale] of [
  ["content", "public", baseUrl, "zh-CN"],
  ["content-en", "public/en", baseUrl.endsWith("/en") ? baseUrl : `${baseUrl}/en`, "en-US"],
]) {
  const content = []
  for (const relative of await globby("**/*.md", {
    cwd: directory,
    ignore: config.configuration.ignorePatterns,
    gitignore: true,
  })) {
    const filePath = path.join(directory, relative)
    const raw = fs.readFileSync(filePath, "utf8")
    const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)
    if (!match) continue
    const frontmatter = parse(match[1])
    content.push([
      null,
      {
        data: {
          filePath,
          relativePath: relative,
          slug: slugifyFilePath(relative),
          frontmatter,
          dates: frontmatter.published ? undefined : { published: fallbackDate(filePath) },
        },
      },
    ])
  }
  const entries = selectEntries(content, [], options.rssLimit ?? 10)
  const rssSlug = options.rssSlug ?? "index"
  const configuration = { ...config.configuration, baseUrl: base, locale }
  const urls = feedUrls(configuration, rssSlug)
  const file = path.join(output, `${rssSlug}.xml`)
  const xml = fs.readFileSync(file, "utf8")
  const actual = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((match) => match[1])
  if (actual.length !== entries.length) errors.push(`${file}：RSS 条目数不正确`)
  if (
    element(xml, "language") !== locale ||
    element(xml, "link") !== urls.base.href ||
    !xml.includes(`href="${urls.feed.href}"`)
  ) {
    errors.push(`${file}：订阅源语言、站点地址或自引用地址不正确`)
  }
  for (const [index, entry] of entries.entries()) {
    const item = actual[index] ?? ""
    const link = new URL(encodeURI(simplifySlug(entry.slug)), urls.base).href
    if (
      element(item, "link") !== link ||
      element(item, "guid") !== link ||
      element(item, "title") !== entry.title
    ) {
      errors.push(`${file}：第 ${index + 1} 条不是预期的正式文章 ${entry.slug}`)
    }
    if (entry.date && new Date(element(item, "pubDate")).getTime() !== entry.date.getTime()) {
      errors.push(`${file}：${entry.slug} 的发布时间不正确`)
    }
  }
  itemsChecked += entries.length
  const feedPath = output === "public" ? `/${rssSlug}.xml` : `/en/${rssSlug}.xml`
  for (const page of walk(output).filter(
    (file) =>
      file.endsWith(".html") &&
      (output !== "public" || !file.startsWith(path.join("public", "en") + path.sep)),
  )) {
    const html = fs.readFileSync(page, "utf8")
    if (!html.includes(`type="application/rss+xml"`) || !html.includes(`href="${feedPath}"`)) {
      errors.push(`${page}：缺少当前语言的 RSS 自动发现链接`)
    }
    if (path.basename(page) !== "404.html" && !html.includes(`href="${feedPath}">RSS</a>`)) {
      errors.push(`${page}：页脚没有指向当前语言的 RSS`)
    }
    pagesChecked += 1
  }
}

console.log(
  `已检查中英文 RSS 的 ${itemsChecked} 条正式文章及 ${pagesChecked} 个页面的订阅链接；错误：${errors.length}`,
)
for (const error of errors) console.error(`- ${error}`)
if (errors.length) process.exitCode = 1
