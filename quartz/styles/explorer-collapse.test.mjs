import assert from "node:assert/strict"
import fs from "node:fs"
import test from "node:test"

const stylesheet = fs.readFileSync(new URL("./custom.scss", import.meta.url), "utf8")

test("recent notes stay at the bottom when the explorer collapses", () => {
  const recentNotes = stylesheet.match(/\.sidebar\.left > \.recent-notes\s*\{([^}]+)\}/)?.[1]
  assert.ok(recentNotes)
  assert.match(recentNotes, /flex:\s*0 0 auto;/)
  assert.match(recentNotes, /margin-top:\s*auto;/)
})

test("collapsed desktop explorer overrides the expanded flex/minimum height", () => {
  const collapsed = stylesheet.match(/\.sidebar\.left > \.explorer\.collapsed\s*\{([^}]+)\}/)?.[1]
  assert.ok(collapsed, "Collapsed explorer needs its own layout override")
  assert.match(collapsed, /flex:\s*0 0 auto;/)
  assert.match(collapsed, /min-height:\s*1\.2rem;/)
  assert.ok(stylesheet.indexOf(collapsed) > stylesheet.indexOf("min-height: 8rem"))
})

test("collapsed desktop explorer hides the entire tree without changing mobile behavior", () => {
  assert.match(
    stylesheet,
    /\.sidebar\.left > \.explorer\.collapsed > \.explorer-content\s*\{\s*display:\s*none;\s*\}/,
  )
  const desktopStyles = stylesheet.split(".recent-notes > ul.recent-ul")[0]
  assert.match(desktopStyles, /@media all and \(min-width: 801px\)/)
  assert.ok(desktopStyles.includes(".explorer.collapsed > .explorer-content"))
})
