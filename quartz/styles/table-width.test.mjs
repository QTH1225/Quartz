import assert from "node:assert/strict"
import fs from "node:fs"
import test from "node:test"

const custom = fs.readFileSync(new URL("./custom.scss", import.meta.url), "utf8")
const base = fs.readFileSync(new URL("./base.scss", import.meta.url), "utf8")

test("article table wrappers span the prose column without expanding it", () => {
  const rule = custom.match(/\.center > article \.table-container\s*\{([^}]+)\}/)?.[1]
  assert.ok(rule)
  assert.match(rule, /\bwidth:\s*100%;/)
  assert.match(rule, /max-width:\s*100%;/)
})

test("short and long article tables have the same full width without side margins", () => {
  const rule = custom.match(/\.center > article \.table-container > table\s*\{([^}]+)\}/)?.[1]
  assert.ok(rule)
  assert.match(rule, /\bwidth:\s*100%;/)
  assert.match(rule, /margin:\s*1rem 0;/)
  assert.match(rule, /table-layout:\s*auto;/)
})

test("dense tables retain their horizontal scrollbar and readable minimum cell width", () => {
  assert.match(base, /\.table-container\s*\{\s*overflow-x:\s*auto;/)
  assert.match(base, /th,\s*td\s*\{\s*min-width:\s*75px;/)
  assert.doesNotMatch(custom, /\.center > article \.table-container[^}]*overflow-x:\s*hidden;/)
})
