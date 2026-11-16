import assert from "node:assert/strict"
import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import test from "node:test"
import { auditPublication } from "./audit-publication.mjs"

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "quartz-publication-"))
  t.after(() => fs.rmSync(root, { recursive: true, force: true }))
  const write = (relative, value) => {
    const file = path.join(root, relative)
    fs.mkdirSync(path.dirname(file), { recursive: true })
    fs.writeFileSync(file, value)
  }
  write("index.html", '<html lang="zh-CN"><a href="/01code/example">中文</a></html>')
  write("static/contentIndex.json", JSON.stringify({ index: { slug: "index", links: [] } }))
  write("index.xml", "<rss><channel><link>https://tianhao.blog/</link></channel></rss>")
  write("sitemap.xml", "<urlset><url><loc>https://tianhao.blog/</loc></url></urlset>")
  return { root, write }
}

test("Chinese-only output passes even with English terminology or external English links", (t) => {
  const { root, write } = fixture(t)
  write("index.html", '<html lang="zh-CN"><a href="https://example.org/en/">Python</a></html>')
  assert.deepEqual(auditPublication(root).errors, [])
})

test("stale English output and the language button are rejected", (t) => {
  const { root, write } = fixture(t)
  write("en/index.html", '<html lang="en-US"><a class="language-switch" href="/">中</a></html>')
  const { errors } = auditPublication(root)
  assert.ok(errors.some((e) => e.includes("残留英文构建产物")))
  assert.ok(errors.some((e) => e.includes("不应发布英文页面")))
  assert.ok(errors.some((e) => e.includes("语言切换按钮")))
})

test("English search entries and outgoing index links are rejected", (t) => {
  const { root, write } = fixture(t)
  write(
    "static/contentIndex.json",
    JSON.stringify({ index: { slug: "index", links: ["en/test"] } }),
  )
  assert.ok(auditPublication(root).errors.some((e) => e.includes("搜索索引包含英文")))
})

test("English RSS, sitemap, and encoded page links are rejected", (t) => {
  const { root, write } = fixture(t)
  write("index.html", '<html lang="zh-CN"><a href="https://tianhao.blog/%65n/test">EN</a></html>')
  write("index.xml", "<rss><channel><link>https://tianhao.blog/en/test</link></channel></rss>")
  write("sitemap.xml", "<urlset><url><loc>https://tianhao.blog/en/</loc></url></urlset>")
  const { errors } = auditPublication(root)
  for (const text of ["英文页面入口", "index.xml：包含", "sitemap.xml：包含"]) {
    assert.ok(
      errors.some((e) => e.includes(text)),
      text,
    )
  }
})

test("a missing build or search index cannot silently pass", (t) => {
  const { root } = fixture(t)
  fs.unlinkSync(path.join(root, "static/contentIndex.json"))
  assert.ok(auditPublication(root).errors.some((e) => e.includes("缺少构建文件")))
  assert.ok(auditPublication(path.join(root, "missing")).errors.length)
})
