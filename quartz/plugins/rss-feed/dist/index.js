import { mkdir, writeFile } from "node:fs/promises"
import path from "node:path"
import { jsx } from "preact/jsx-runtime"
import { simplifySlug } from "@quartz-community/utils"

export const manifest = {
  name: "rss-feed",
  displayName: "Article RSS Feed",
  version: "1.0.0",
  category: "emitter",
}

function xml(value) {
  return String(value ?? "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;")
}

function publicationDate(data) {
  const frontmatter = data.frontmatter ?? {}
  for (const value of [
    frontmatter.published,
    data.dates?.published,
    data.dates?.created,
    data.dates?.modified,
  ]) {
    if (value === undefined || value === null || value === "") continue
    const date = new Date(value)
    if (!Number.isNaN(date.getTime())) return date
  }
  // Do not turn missing dates into the build time: it changes the feed on every build.
  return undefined
}

export function selectEntries(content, virtualPages = [], limit = 10) {
  const virtualFiles = new Set(virtualPages.map(([, file]) => file))
  const entries = new Map()
  for (const [, file] of content) {
    const data = file.data ?? {}
    const frontmatter = data.frontmatter ?? {}
    const relative = String(data.relativePath ?? "").replaceAll("\\", "/")
    const slug = data.slug
    if (
      virtualFiles.has(file) ||
      !data.filePath ||
      !/\.md$/i.test(relative) ||
      path.posix.basename(relative).toLowerCase() === "index.md" ||
      !slug ||
      slug === "404" ||
      slug.startsWith("tags/") ||
      frontmatter.draft === true ||
      frontmatter.unlisted === true ||
      data.unlisted === true ||
      frontmatter.encrypted === true ||
      data.encrypted === true
    )
      continue
    entries.set(slug, {
      slug,
      title: frontmatter.title ?? slug,
      description:
        frontmatter.description || data.description || String(data.text ?? "").slice(0, 200),
      date: publicationDate(data),
      tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
    })
  }
  return [...entries.values()]
    .sort(
      (a, b) =>
        (b.date?.getTime() ?? 0) - (a.date?.getTime() ?? 0) ||
        (a.slug < b.slug ? -1 : a.slug > b.slug ? 1 : 0),
    )
    .slice(0, limit)
}

export function feedUrls(configuration, rssSlug = "index") {
  if (!configuration.baseUrl) throw new Error("RSS requires configuration.baseUrl")
  if (!/^[\w-]+$/.test(rssSlug))
    throw new Error("rssSlug must be a single filename without an extension")
  const base = new URL(`https://${configuration.baseUrl.replace(/\/+$/, "")}/`)
  const feed = new URL(`${rssSlug}.xml`, base)
  return { base, feed }
}

export function renderFeed(configuration, entries, rssSlug = "index") {
  const { base, feed } = feedUrls(configuration, rssSlug)
  const items = entries
    .map((entry) => {
      const link = new URL(encodeURI(simplifySlug(entry.slug)), base).href
      return `<item>
      <title>${xml(entry.title)}</title>
      <link>${xml(link)}</link>
      <guid>${xml(link)}</guid>
      <description>${xml(entry.description)}</description>
      ${entry.date ? `<pubDate>${entry.date.toUTCString()}</pubDate>` : ""}
      ${entry.tags.map((tag) => `<category>${xml(tag)}</category>`).join("")}
    </item>`
    })
    .join("\n")
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${xml(configuration.pageTitle)}</title>
    <link>${xml(base.href)}</link>
    <description>${xml(configuration.locale?.startsWith("zh") ? "最新文章与笔记" : "Latest articles and notes")}</description>
    <language>${xml(configuration.locale)}</language>
    <atom:link href="${xml(feed.href)}" rel="self" type="application/rss+xml" />
    <generator>Quartz</generator>
    ${items}
  </channel>
</rss>
`
}

export default function RSSFeed(options = {}) {
  const rssSlug = options.rssSlug ?? "index"
  const limit = options.rssLimit ?? 10
  if (!Number.isInteger(limit) || limit < 1) throw new Error("rssLimit must be a positive integer")
  const emit = async (ctx, content) => {
    const entries = selectEntries(content, ctx.virtualPages, limit)
    const output = path.join(ctx.argv.output, `${rssSlug}.xml`)
    await mkdir(path.dirname(output), { recursive: true })
    await writeFile(output, renderFeed(ctx.cfg.configuration, entries, rssSlug), "utf8")
    return [output]
  }
  return {
    name: "RSSFeed",
    emit,
    partialEmit: emit,
    externalResources(ctx) {
      const configuration = ctx.cfg.configuration
      const { feed } = feedUrls(configuration, rssSlug)
      return {
        additionalHead: [
          jsx("link", {
            rel: "alternate",
            type: "application/rss+xml",
            title: `${configuration.pageTitle} RSS (${configuration.locale})`,
            href: feed.pathname,
          }),
        ],
      }
    },
  }
}
