import assert from "node:assert/strict"
import fs from "node:fs"
import test from "node:test"

test("Twikoo comment text and placeholder use Quartz's article body typeface", () => {
  const css = fs.readFileSync(new URL("./custom.scss", import.meta.url), "utf8")
  assert.match(
    css,
    /\.twikoo-comments \.el-textarea__inner,\s*\.twikoo-comments \.el-textarea__inner::placeholder\s*\{\s*font-family:\s*var\(--bodyFont\);\s*\}/,
  )
})

test("only the Quartz frame separator remains above comments", () => {
  const css = fs.readFileSync(new URL("./custom.scss", import.meta.url), "utf8")
  const section = css.match(/\.page-footer > \.twikoo-comments\s*\{([^}]+)\}/)?.[1]
  assert.ok(section)
  assert.match(section, /border-top:\s*0;/)
  assert.match(section, /margin-top:\s*0;/)
  assert.match(section, /padding-top:\s*0;/)
  const frame = fs.readFileSync(
    new URL("../components/frames/DefaultFrame.tsx", import.meta.url),
    "utf8",
  )
  assert.match(frame, /<Content \{\.\.\.componentData\} \/>\s*<hr \/>/)
})
