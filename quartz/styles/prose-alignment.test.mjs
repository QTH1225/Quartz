import assert from "node:assert/strict"
import fs from "node:fs"
import test from "node:test"

const css = fs.readFileSync(new URL("./custom.scss", import.meta.url), "utf8")

test("article paragraphs and list prose justify without stretching the last line", () => {
  assert.match(
    css,
    /\.center > article p,\s*\.center > article li\s*\{[^}]*text-align: justify;[^}]*text-align-last: start;[^}]*text-justify: auto;/,
  )
  assert.match(css, /html\[lang\^="en"\] \.center > article p,[\s\S]*?hyphens: auto;/)
})

test("code remains left aligned and unhyphenated; navigation and comments are outside the scope", () => {
  assert.match(
    css,
    /\.center > article pre,\s*\.center > article pre code\s*\{[^}]*text-align: left;[^}]*text-align-last: auto;/,
  )
  assert.match(css, /\.center > article code\s*\{\s*hyphens: none;/)
  assert.ok(!css.includes("word-break: break-all"))
  assert.ok(!/\.twikoo-comments[^}]*text-align: justify/.test(css))
})
