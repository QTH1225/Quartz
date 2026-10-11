import assert from "node:assert/strict"
import test from "node:test"
import render from "preact-render-to-string"
import RSSFeed, { feedUrls, renderFeed, selectEntries } from "./dist/index.js"
import { Footer } from "../footer/dist/components/index.js"

function article(slug, published, frontmatter = {}, overrides = {}) {
  return [
    null,
    {
      data: {
        slug,
        filePath: `content/${slug}.md`,
        relativePath: `${slug}.md`,
        frontmatter: { title: slug, published, tags: [], ...frontmatter },
        ...overrides,
      },
    },
  ]
}

test("RSS excludes generated pages, indexes, drafts, unlisted and encrypted notes", () => {
  const real = article("01code/real", "2025-01-01")
  const virtual = article("virtual/generated", "2099-01-01")
  const content = [
    real,
    virtual,
    article("index", "2099-01-01"),
    article("01code/index", "2099-01-01"),
    article("tags/example", "2099-01-01"),
    article("draft", "2099-01-01", { draft: true }),
    article("unlisted", "2099-01-01", { unlisted: true }),
    article("hidden", "2099-01-01", {}, { unlisted: true }),
    article("encrypted", "2099-01-01", { encrypted: true }),
    article("ciphertext", "2099-01-01", {}, { encrypted: true }),
    article("canvas", "2099-01-01", {}, { relativePath: "canvas.canvas" }),
    article("synthetic", "2099-01-01", {}, { filePath: undefined }),
  ]
  assert.deepEqual(
    selectEntries(content, [virtual]).map((e) => e.slug),
    ["01code/real"],
  )
})

test("RSS sorts and limits by publication date, not modification/build time", () => {
  const content = [
    article("old", "2024-01-01", {}, { dates: { modified: new Date("2099-01-01") } }),
    article("latest", "2026-01-01"),
    article("middle", "2025-01-01"),
    article("undated", undefined),
  ]
  assert.deepEqual(
    selectEntries(content, [], 2).map((e) => e.slug),
    ["latest", "middle"],
  )
  const undated = selectEntries(content, [], 10).at(-1)
  assert.equal(undated.date, undefined)
  assert.ok(
    !renderFeed({ baseUrl: "tianhao.blog", locale: "en-US" }, [undated]).includes("<pubDate>"),
  )
})

test("RSS has deterministic tie ordering, valid date fallback and unique GUIDs", () => {
  const a = article("a", "invalid", {}, { dates: { published: new Date("2025-01-01") } })
  const b = article("b", "2025-01-01")
  const entries = selectEntries([b, a, a])
  assert.deepEqual(
    entries.map((e) => e.slug),
    ["a", "b"],
  )
  assert.equal(entries[0].date.toISOString(), "2025-01-01T00:00:00.000Z")
})

test("RSS uses each language base path and escapes XML text", () => {
  const entries = selectEntries([
    article("01code/example", "2025-01-01", {
      title: 'A & B <C> "D"',
      description: "<p>Text & more</p>",
      tags: ["a&b"],
    }),
  ])
  const configuration = { baseUrl: "tianhao.blog/en", pageTitle: "Yana's Lab", locale: "en-US" }
  const xml = renderFeed(configuration, entries)
  assert.ok(xml.includes("<link>https://tianhao.blog/en/01code/example</link>"))
  assert.ok(xml.includes('href="https://tianhao.blog/en/index.xml"'))
  assert.ok(xml.includes("<title>A &amp; B &lt;C&gt; &quot;D&quot;</title>"))
  assert.ok(xml.includes("<description>&lt;p&gt;Text &amp; more&lt;/p&gt;</description>"))
  assert.ok(xml.includes("<category>a&amp;b</category>"))
  assert.equal(feedUrls({ baseUrl: "tianhao.blog" }).feed.pathname, "/index.xml")
  assert.equal(feedUrls(configuration).feed.pathname, "/en/index.xml")
  assert.throws(() => RSSFeed({ rssLimit: 0 }))
  assert.throws(() => feedUrls(configuration, "../outside"))
})

test("RSS exposes localized reader auto-discovery", () => {
  const resource = RSSFeed().externalResources({
    cfg: {
      configuration: {
        baseUrl: "tianhao.blog/en",
        pageTitle: "Yana's Lab",
        locale: "en-US",
      },
    },
  })
  const html = render(resource.additionalHead[0])
  assert.ok(html.includes('type="application/rss+xml"'))
  assert.ok(html.includes('href="/en/index.xml"'))
})

test("Footer RSS follows the current language without changing other links", () => {
  const Component = Footer({
    links: { RSS: "/index.xml", GitHub: "https://github.com/QTH1225/Quartz" },
  })
  const zh = render(Component({ cfg: { baseUrl: "tianhao.blog" } }))
  const en = render(Component({ cfg: { baseUrl: "tianhao.blog/en" } }))
  assert.ok(zh.includes('href="/index.xml"'))
  assert.ok(en.includes('href="/en/index.xml"'))
  assert.ok(en.includes('href="https://github.com/QTH1225/Quartz"'))
  const localized = Footer({ links: { RSS: "/en/index.xml" } })
  assert.ok(
    render(localized({ cfg: { baseUrl: "tianhao.blog/en" } })).includes('href="/en/index.xml"'),
  )
})
