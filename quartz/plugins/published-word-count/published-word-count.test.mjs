import assert from "node:assert/strict"
import test from "node:test"
import { fromHtml } from "hast-util-from-html"
import { unified } from "unified"
import remarkParse from "remark-parse"
import remarkRehype from "remark-rehype"
import { ObsidianFlavoredMarkdown } from "@quartz-community/obsidian-flavored-markdown"
import { Latex } from "@quartz-community/latex"
import { VFile } from "vfile"
import PublishedWordCount from "./dist/index.js"
import {
  countProse,
  proseText,
  publishedTotal,
  publishedSummary,
  hasBodyContent,
} from "./dist/count.js"

test("Han characters and mixed English tokens count independently", () => {
  assert.equal(countProse("你好，Quartz3 学习Python语言！"), 8)
  assert.equal(countProse("don't well-known 2026 3.14 1,234"), 5)
  assert.equal(countProse("don’t well‑known 中文"), 4)
  assert.equal(countProse("  \n，。！？# 😀 "), 0)
  assert.equal(countProse("链接 https://example.org/path，继续说明。"), 6)
})

test("readable links, inline code, prose headings, tables and quotes count", () => {
  const tree = fromHtml(
    `<h2>Hello</h2><p>hel<strong>lo</strong> <a href="https://example.org/long/path">可见文字</a> <code>npm install</code></p>
    <blockquote>quoted words</blockquote><table><tr><td>cell one</td><td>cell two</td></tr></table>`,
    { fragment: true },
  )
  assert.equal(countProse(proseText(tree)), 14)
})

test("code blocks, diagrams, math, images, hidden HTML and URLs do not inflate prose", () => {
  const tree = fromHtml(
    `<p>正文 <a href="https://example.org">https://example.org</a> www.example.org/a</p>
    <pre><code>many fake words</code></pre><div class="mermaid">graph fake words</div>
    <span class="katex"><span>fake formula words</span><math>duplicate formula</math></span>
    <img src="https://example.org/picture.png" alt="fake alt words"><p>真实图注</p>
    <script>fake script words</script><style>fake style words</style><!-- fake comment words -->
    <span hidden>fake hidden words</span><span aria-hidden="true">fake aria words</span>
    <svg><text>fake SVG words</text></svg><blockquote class="transclude">duplicate article words</blockquote>
    <a data-footnote-ref="true">1</a><a data-footnote-backref="true">back</a>`,
    { fragment: true },
  )
  assert.equal(countProse(proseText(tree)), 6)
  assert.equal(countProse(proseText({ type: "raw", value: "<b>Visible</b><!-- hidden -->" })), 1)
})

function data(relativePath, count, options = {}) {
  return {
    filePath: `/vault/${relativePath}`,
    relativePath,
    slug: relativePath.replace(/\.md$/, ""),
    frontmatter: { draft: false, ...options.frontmatter },
    publishedWordCount: { language: "zh", count, ...options.measurement },
    ...options.data,
  }
}

test("totals include authored home and articles but exclude drafts, private and virtual pages", () => {
  const home = data("index.md", 5)
  const files = [
    home,
    home,
    data("01Code/article.md", 10),
    data("00Aboutme/AboutSite.md", 3),
    data("01Code/index.md", 1000),
    data("draft.md", 1000, { frontmatter: { draft: true } }),
    data("missing-draft.md", 1000, { frontmatter: { draft: undefined } }),
    data("string-draft.md", 1000, { frontmatter: { draft: "false" } }),
    data("private.md", 1000, { frontmatter: { unlisted: true } }),
    data("encrypted.md", 1000, { frontmatter: { encrypted: true } }),
    data("hidden.md", 1000, { data: { unlisted: true } }),
    data("locked.md", 1000, { data: { encrypted: true } }),
    data("virtual.md", 1000, { data: { filePath: undefined } }),
    data("board.canvas", 1000),
    data("404.md", 1000),
    data("tags/tools.md", 1000),
    data("en/article.md", 4, { measurement: { language: "en" } }),
    data("invalid.md", NaN),
    data("negative.md", -1),
  ]
  assert.equal(publishedTotal(files, "zh-CN"), 18)
  assert.equal(publishedTotal(files, "en-US"), 4)
  assert.equal(publishedTotal(), 0)
  assert.deepEqual(publishedSummary(files, "zh-CN"), { words: 18, notes: 1 })
  assert.deepEqual(publishedSummary(files, "en-US"), { words: 4, notes: 1 })
})

test("note counts exclude the entire about folder and root index without changing word totals", () => {
  for (const [language, locale] of [
    ["zh", "zh-CN"],
    ["en", "en-US"],
  ]) {
    const files = [
      data("index.md", 5, { measurement: { language } }),
      data("00Aboutme/AboutSite.md", 7, { measurement: { language } }),
      data("00aboutme/nested/biography.md", 11, { measurement: { language } }),
      data("00Aboutme\\MyCV.md", 13, { measurement: { language } }),
      data("01Code/article.md", 17, { measurement: { language } }),
      data("00AboutmeBackup/article.md", 19, { measurement: { language } }),
    ]
    assert.deepEqual(publishedSummary(files, locale), { words: 72, notes: 2 })
    assert.equal(publishedTotal(files, locale), 72)
  }
})

test("published note count excludes empty pages but includes code/math/image-only notes", () => {
  const files = [
    data("empty.md", 0, { measurement: { hasBody: false } }),
    data("code.md", 0, { measurement: { hasBody: true } }),
    data("math.md", 0, { measurement: { hasBody: true } }),
    data("image.md", 0, { measurement: { hasBody: true } }),
  ]
  assert.deepEqual(publishedSummary(files), { words: 0, notes: 3 })
  for (const html of ["", "<!-- comment -->", "<hr><br>"])
    assert.equal(hasBodyContent(fromHtml(html, { fragment: true })), false)
  for (const html of [
    "<pre><code>print(1)</code></pre>",
    '<span class="katex">x</span>',
    '<img src="a.png">',
  ])
    assert.equal(hasBodyContent(fromHtml(html, { fragment: true })), true)
})

test("real Quartz wikilinks and LaTeX transforms retain only authored readable prose", async () => {
  const ctx = {
    cfg: { configuration: { locale: "zh-CN", baseUrl: "tianhao.blog" } },
    allSlugs: ["index", "01code/example"],
  }
  const obsidian = ObsidianFlavoredMarkdown()
  const latex = Latex({ renderEngine: "katex" })
  const plugin = PublishedWordCount()
  const file = new VFile(
    "你好 [[01code/example|技术说明]] `npm install`\n\n```js\nfake code words\n```\n\n$x^2$\n\n![image words](image.png)",
  )
  file.data = { frontmatter: { lang: "zh-CN", draft: false }, slug: "index" }
  const md = unified()
    .use(remarkParse)
    .use(obsidian.markdownPlugins(ctx))
    .use(latex.markdownPlugins(ctx))
  const ast = await md.run(md.parse(file), file)
  await unified()
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(obsidian.htmlPlugins?.(ctx) ?? [])
    .use(latex.htmlPlugins(ctx))
    .use(plugin.htmlPlugins(ctx))
    .run(ast, file)
  assert.deepEqual(file.data.publishedWordCount, { count: 8, hasBody: true, language: "zh" })
})
