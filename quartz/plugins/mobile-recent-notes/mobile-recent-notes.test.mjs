import assert from "node:assert/strict"
import fs from "node:fs"
import test from "node:test"
import render from "preact-render-to-string"
import { parse } from "yaml"
import { RecentNotes } from "../recent-notes/dist/components/index.js"
import { MobileRecentNotes } from "./dist/components/index.js"

const props = {
  allFiles: [
    {
      slug: "01code/older",
      frontmatter: { title: "Older note" },
      defaultDateType: "published",
      dates: { published: new Date("2025-01-01") },
    },
    {
      slug: "05tools/newer",
      frontmatter: { title: "Newer note" },
      defaultDateType: "published",
      dates: { published: new Date("2026-01-01") },
    },
    { slug: "tags/example", frontmatter: { title: "Tag" } },
    { slug: "01code/index", frontmatter: { title: "Directory" } },
    { slug: "private", unlisted: true, frontmatter: { title: "Private" } },
  ],
  fileData: { slug: "04blog/article" },
  cfg: { locale: "zh-CN" },
}

test("mobile recent notes are a single horizontal navigation strip, not a collapsed sidebar button", () => {
  const component = MobileRecentNotes({ limit: 5 })
  const html = render(component(props))
  assert.ok(html.includes('<nav class="recent-notes recent-notes-mobile"'))
  assert.ok(html.includes("最近的笔记"))
  assert.ok(html.includes('tabindex="0"'))
  assert.ok(!html.includes("<button"))
  assert.ok(!html.includes("collapsed"))
  assert.ok(html.indexOf("Newer note") < html.indexOf("Older note"))
  assert.ok(html.includes('href="../05tools/newer"'))
  for (const hidden of [">Tag<", ">Directory<", ">Private<"]) assert.ok(!html.includes(hidden))
  assert.equal(component.afterDOMLoaded, undefined)
  assert.match(component.css, /\.recent-notes\.recent-notes-mobile\s*\{[^}]*flex-direction: row;/)
  assert.match(
    component.css,
    /\.recent-notes-mobile > ul\.recent-ul\s*\{[^}]*min-width: 0;[^}]*overflow-x: auto;/,
  )
  assert.match(
    component.css,
    /\.recent-notes-mobile > ul\.recent-ul > li\.recent-li\s*\{[^}]*white-space: nowrap;/,
  )
})

test("both languages use the same ordering and retain localized titles and links", () => {
  const component = MobileRecentNotes({ limit: 1 })
  const html = render(component({ ...props, cfg: { locale: "en-US" } }))
  assert.ok(html.includes("Recent Notes"))
  assert.ok(html.includes("Newer note"))
  assert.ok(!html.includes("Older note"))
  assert.ok(html.includes('href="../05tools/newer"'))
})

test("desktop notes keep their collapsed behavior and bottom anchoring", () => {
  const component = RecentNotes()
  const html = render(component(props))
  assert.ok(html.includes('class="recent-notes collapsed"'))
  assert.ok(html.includes('aria-expanded="false"'))
  assert.ok(html.includes("recent-notes-toggle"))
  assert.ok(!html.includes("recent-notes-mobile"))
  assert.ok(component.afterDOMLoaded.includes("setupRecentNotes"))
  const css = fs.readFileSync(new URL("../../styles/custom.scss", import.meta.url), "utf8")
  assert.match(
    css,
    /@media all and \(min-width: 801px\)\s*\{[\s\S]*?\.sidebar\.left > \.recent-notes\s*\{[^}]*margin-top: auto;/,
  )
  assert.match(
    css,
    /@media all and \(\$mobile\)\s*\{\s*\.sidebar\.left > \.recent-notes\s*\{\s*display: none;/,
  )
})

test("mobile placement is after the article and before comments, with matching list options", () => {
  const config = parse(
    fs.readFileSync(new URL("../../../quartz.config.yaml", import.meta.url), "utf8"),
  )
  const mobile = config.plugins.find((p) => p.source === "./quartz/plugins/mobile-recent-notes")
  const desktop = config.plugins.find((p) => p.source === "./quartz/plugins/recent-notes")
  const comments = config.plugins.find((p) => p.source === "./quartz/plugins/twikoo-comments")
  assert.equal(mobile.layout.position, "afterBody")
  assert.equal(mobile.layout.display, "mobile-only")
  assert.ok(mobile.layout.priority < comments.layout.priority)
  assert.equal(desktop.layout.position, "left")
  for (const key of ["limit", "hideTagPages", "hideFolderPages"])
    assert.equal(mobile.options[key], desktop.options[key])
})
