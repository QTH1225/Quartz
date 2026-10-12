import assert from "node:assert/strict"
import fs from "node:fs"
import test from "node:test"

const css = fs.readFileSync(new URL("./custom.scss", import.meta.url), "utf8")

test("Twikoo avatar images override Quartz's global image margin and inline baseline", () => {
  const avatar = css.match(/\.twikoo-comments \.tk-avatar > \.tk-avatar-img\s*\{([^}]+)\}/)?.[1]
  assert.ok(avatar)
  assert.match(avatar, /margin:\s*0;/)
  assert.match(avatar, /padding:\s*0;/)
  assert.match(avatar, /display:\s*block;/)
  assert.match(avatar, /width:\s*100%;/)
})

test("avatar frame is top aligned without changing main/reply avatar heights", () => {
  const frame = css.match(/\.twikoo-comments \.tk-avatar\s*\{([^}]+)\}/)?.[1]
  assert.ok(frame)
  assert.match(frame, /align-self:\s*flex-start;/)
  assert.match(frame, /line-height:\s*0;/)
  const avatar = css.match(/\.twikoo-comments \.tk-avatar > \.tk-avatar-img\s*\{([^}]+)\}/)?.[1]
  assert.doesNotMatch(frame + avatar, /(?:^|[;\s])height\s*:/)
  assert.ok(!css.includes(".twikoo-comments img {"), "Comment content images must remain unchanged")
})
